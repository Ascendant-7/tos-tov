import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto, LoginDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() authDto: AuthDto): Promise<any> {
    return this.authService.register(
      authDto.email,
      authDto.password,
      authDto.firstName,
      authDto.lastName,
    )
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: LoginDto): Promise<any> {
    return this.authService.login(authDto.email, authDto.password)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string): Promise<any> {
    return this.authService.forgotPassword(email)
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() body: { email: string; token: string; type?: 'signup' | 'email' },
  ): Promise<any> {
    return this.authService.verifyOtp(body.email, body.token, body.type)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { password: string }): Promise<any> {
    return this.authService.resetPassword(body.password)
  }
}
