import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleLoginDto {
  // Google access token from the frontend.
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
