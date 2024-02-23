import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // async validateUser(email: string, password: string) {
  //   const user = await this.userService.getUserDetails({ email: email });
  //   if (user && password === user.password) {
  //     const result = user;
  //     return result;
  //   }
  //   return null;
  // }
  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserDetails({ email: email });
    // if (user && (await bcrypt.compare(password, user.password))) {       //TODO after implementing register user
    if (user && password === user.password) {
      const result = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const payload = {
      username: loginDto.email,
      sub: {
        id: loginDto.email,
      },
    };
    const validUser = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (validUser) {
      return {
        message: `Logged in successFully for ${loginDto.email}`,
        accessToken: this.jwtService.sign(payload, {
          secret: process.env['JWT_SECRET'],
          expiresIn: process.env['JWT_EXPIRE_TIME'],
        }),
        tokenType: 'Bearer',
        refreshToken: this.jwtService.sign(payload, {
          secret: process.env['JWT_SECRET'],
          expiresIn: process.env['JWT_REFRESH_EXPIRE_TIME'],
        }),
      };
    } else {
      return {
        message: 'Please enter correct password',
      };
    }
  }
  async refreshToken(user: User) {
    const payload = {
      username: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env['JWT_SECRET'],
        expiresIn: process.env['JWT_REFRESH_EXPIRE_TIME'],
      }),
    };
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
