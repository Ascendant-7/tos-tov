import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { AuthResponse } from '@supabase/supabase-js';
import type { Database, SupabaseClient } from '@repo/supabase';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  private get client(): SupabaseClient<Database> {
    return this.supabaseService.client;
  }

  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<AuthResponse['data'] & { profile?: unknown }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const { data, error } = await this.client.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    let profile: unknown;

    if (data.user) {
      const { error: profileError } = await this.client
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email,
            first_name: firstName || null,
            last_name: lastName || null,
          },
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
      } else {
        const { data: profileData, error: profileFetchError } =
          await this.client
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileFetchError) {
          console.error('Error fetching profile:', profileFetchError);
        } else {
          profile = profileData;
        }
      }
    }

    return {
      ...data,
      profile,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse['data']> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return data;
  }
}
