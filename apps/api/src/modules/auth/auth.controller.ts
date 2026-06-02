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
}