import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { supabase } from '../../supabase/supabase.client';
import { AuthResponse } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  /**
   * Register a new user account
   * @param email - User's email address
   * @param password - User's password (minimum 6 characters)
   * @returns Auth response with user and session data
   */
  async register(
    email: string,
    password: string,
  ): Promise<AuthResponse['data']> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  /**
   * Login user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Auth response with user and session data
   */
  async login(email: string, password: string): Promise<AuthResponse['data']> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return data;
  }
}
