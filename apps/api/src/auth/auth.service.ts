import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/user.schema';

interface GoogleProfile {
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // Guest login — create a throwaway account.
  async guestLogin() {
    const user = await this.usersService.create({ name: 'Guest', isGuest: true });
    return this.buildAuthResponse(user);
  }

  // Google login — verify the access token, then find or create the user.
  async googleLogin(accessToken: string) {
    const profile = await this.fetchGoogleProfile(accessToken);
    let user = await this.usersService.findByEmail(profile.email);
    if (!user) {
      user = await this.usersService.create({
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.picture,
        isGuest: false,
      });
    }
    return this.buildAuthResponse(user);
  }

  // Verify the token and read the Google profile.
  private async fetchGoogleProfile(accessToken: string): Promise<GoogleProfile> {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');

    const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`);
    if (!infoRes.ok) throw new UnauthorizedException('Invalid Google token.');
    const info = await infoRes.json();
    if (clientId && info.aud !== clientId) {
      throw new UnauthorizedException('Google token was issued for a different app.');
    }

    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profileRes.ok) throw new UnauthorizedException('Failed to read Google profile.');
    const p = await profileRes.json();
    return { email: p.email, name: p.name || p.email, picture: p.picture };
  }

  // Sign a JWT and return it with the user.
  private buildAuthResponse(user: UserDocument) {
    const token = this.jwtService.sign({
      sub: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      isGuest: user.isGuest,
    });
    return { token, user: this.usersService.toPublic(user) };
  }
}
