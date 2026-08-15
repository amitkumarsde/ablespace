import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Guest login — no credentials required.
  @Post('guest')
  guestLogin() {
    return this.authService.guestLogin();
  }

  // Google login — exchanges a Google access token for our JWT.
  @Post('google')
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto.accessToken);
  }
}
