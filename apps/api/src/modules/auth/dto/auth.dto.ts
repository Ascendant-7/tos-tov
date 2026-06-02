import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail()
  email!: string

  @IsString()
  @MinLength(6)
  password!: string
}

export class AuthDto extends LoginDto {
  @IsString()
  firstName!: string

  @IsString()
  lastName!: string
}
