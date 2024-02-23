// import { Module } from '@nestjs/common';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';

// @Module({
//   imports: [
//     JwtModule.register({
//       secret: process.env.JWT_SECRET,
//       signOptions: { expiresIn: '1h' },
//     }),
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//   ],
//   providers: [JwtService, PassportModule, JwtModule],
//   exports: [JwtService, PassportModule, JwtModule],
// })
// export class JwtAuthModule {}
