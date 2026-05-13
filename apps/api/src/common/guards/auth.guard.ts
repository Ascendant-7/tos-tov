import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '@supabase/auth-js';
import { Request } from 'express';
import { supabase } from '../../supabase/supabase.client';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = request.headers['authorization']?.replace('Bearer ', '');

    if (!token) return false;

    const { data, error } = await supabase.auth.getUser(token);

    if (error) return false;

    request.user = data.user;

    return true;
  }
}
