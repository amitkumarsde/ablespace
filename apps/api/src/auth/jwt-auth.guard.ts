import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Verify the JWT and attach the user to the request.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Access denied. No token provided.');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Access denied. Invalid token format.');

    try {
      req.user = this.jwtService.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
