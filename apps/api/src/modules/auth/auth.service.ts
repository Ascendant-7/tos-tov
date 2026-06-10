import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { SupabaseService } from '../../common/supabase/supabase.service'
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
    } else {
      await this.supabaseService.adminClient.from('profiles').insert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
      })
      console.log(`User ${data.user.id} registered but email confirmation required`)
    }

    return {
      msg: 'profile created',
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
}
