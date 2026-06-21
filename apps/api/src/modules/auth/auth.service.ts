import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { SupabaseService } from '../../supabase/supabase.service'
import type { Database, SupabaseClient, AuthResponse } from '@repo/supabase'

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  private get client(): SupabaseClient<Database> {
    return this.supabaseService.anonClient
  }

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<any> {
    // dto error checking, not sure if they should be here
    if (!email || !password) throw new BadRequestException('Email and password are required')
    if (password.length < 6) throw new BadRequestException('Password must be at least 6 characters')

    // supabase signup method
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    })

    // signup error checking
    if (error) throw new BadRequestException(error.message)

    if (!data.user) throw new BadRequestException('User Creation Failed')

    if (data.session?.access_token) {
      const userClient = this.supabaseService.createUserClient(data.session.access_token)

      const { error: profileError } = await userClient.from('profiles').insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
      })

      if (profileError) throw new BadRequestException('Profile Creation Failed')

      console.log(`User ${data.user.id} registered with session`)
      return {
        msg: 'profile created',
        user: { id: data.user.id, email },
      }
    }

    console.log(`User ${data.user.id} registered, waiting for OTP verification`)
    return {
      msg: 'OTP sent',
      user: { id: data.user.id, email },
    }
  }

  async login(email: string, password: string): Promise<AuthResponse['data']> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required')
    }

    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new UnauthorizedException('Invalid email or password')
    }

    return data
  }

  async forgotPassword(email: string): Promise<any> {
    const { error } = await this.client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) {
      throw new BadRequestException(error.message)
    }

    return { msg: 'OTP sent' }
  }

  async verifyOtp(email: string, token: string, type: 'signup' | 'email' = 'signup'): Promise<any> {
    const { data, error } = await this.client.auth.verifyOtp({
      email,
      token,
      type,
    })

    if (error) {
      throw new BadRequestException(error.message)
    }

    if (data.user) {
      // Check if profile already exists
      const { data: profile } = await this.supabaseService.adminClient
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        // Create profile from metadata
        const { first_name, last_name } = data.user.user_metadata || {}
        const { error: profileError } = await this.supabaseService.adminClient
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            first_name: first_name || '',
            last_name: last_name || '',
          })

        if (profileError) {
          console.error('Failed to create profile during OTP verification:', profileError)
          // We don't necessarily want to fail verification if profile creation fails,
          // but for this task we want it to be reliable.
        } else {
          console.log(`Profile created for user ${data.user.id} after OTP verification`)
        }
      }
    }

    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resetPassword(_password: string): Promise<any> {
    // For Supabase, password reset is typically handled on the frontend
    // using the session obtained from verifyOtp.
    return Promise.resolve({ msg: 'Please use frontend supabase.auth.updateUser with the session' })
  }
}
