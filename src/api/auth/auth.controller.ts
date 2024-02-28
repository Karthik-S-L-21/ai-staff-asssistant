import {
  Body,
  Controller,
  Delete,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  COOKIE_SAME_SITE_POLICY,
  FALLBACK_VALUES,
} from '../../constants/common.constants';
import { Public } from '../../decorators/public-guard.decorator';
import { RefreshJwtGuard } from '../../guards/refresh-jwt.auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { JwtGuard } from '../../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  private sameSite: (typeof COOKIE_SAME_SITE_POLICY)[number];
  private refreshTokenMaxAge: number;
  private accessTokenMaxAge: number;
  private secure: boolean;
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.initCookieConfig();
  }
  private initCookieConfig(): void {
    const policy = this.configService.get<
      (typeof COOKIE_SAME_SITE_POLICY)[number]
    >('COOKIE-SAME-SITE-POLICY');
    this.sameSite = COOKIE_SAME_SITE_POLICY.includes(policy) ? policy : 'none';
    this.secure =
      this.configService
        .get<string>('ENV', FALLBACK_VALUES.ENV)
        .toUpperCase() !== 'LOCAL';
    this.accessTokenMaxAge = this.configService.get<number>(
      'ACCESS-TOKEN-COOKIE-TIME',
      FALLBACK_VALUES.ACCESS_TOKEN_COOKIE_TIME,
    ); // 4 hour accessToken valid time
    this.refreshTokenMaxAge = this.configService.get<number>(
      'REFRESH-TOKEN-COOKIE-TIME',
      FALLBACK_VALUES.REFRESH_TOKEN_COOKIE_TIME,
    ); // 7 days refreshToken valid Time
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const loginResponse = await this.authService.login(loginDto);
    res.cookie('accessToken', loginResponse.accessToken, {
      httpOnly: true,
      secure: this.secure,
      sameSite: this.sameSite,
      maxAge: this.accessTokenMaxAge,
    });
    res.cookie('refreshToken', loginResponse.refreshToken, {
      httpOnly: true,
      secure: this.secure,
      sameSite: this.sameSite,
      maxAge: this.refreshTokenMaxAge,
    });
    return res.send({
      message: loginResponse.message,
      accessToken: loginResponse.accessToken,
      tokenType: loginResponse.tokenType,
      refreshToken: loginResponse.refreshToken,
    });
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtGuard)
  @Delete('logout')
  async logout(@Request() req, @Res() res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: this.secure,
      sameSite: this.sameSite,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.secure,
      sameSite: this.sameSite,
    });
    return res.send({
      statusCode: 200,
      message: 'Logged Out Successfully.',
      result: null,
    });
  }
}
