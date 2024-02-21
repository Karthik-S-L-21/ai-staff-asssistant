import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserDetails({ email: email });
    if (user && password === user.password) {
      const result = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    return !!user;
  }

  async generateToken(loginDto) {
    const payload = {
      username: loginDto.email,
      sub: {
        id: loginDto.email,
      },
    };
    return this.jwtService.sign(payload, {
      secret: process.env['JWT_SECRET'],
      expiresIn: process.env['JWT_EXPIRE_TIME'],
    });
  }
}
