import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '@repo/supabase';
import { Request } from 'express';
import { SupabaseService } from '../../supabase/supabase.service';

interface AuthenticatedRequest extends Request {
  user: User
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()

    const token = request.headers['authorization']?.replace('Bearer ', '')

    if (!token) return false

    const { data, error } = await this.supabaseService.anonClient.auth.getUser(token)

    if (error) return false

    request.user = data.user

    return true
  }
}
