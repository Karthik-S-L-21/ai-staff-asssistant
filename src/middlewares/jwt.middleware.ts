// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class JwtMiddleware implements NestMiddleware {
//   constructor(private readonly jwtService: JwtService) {}

//   use(req: Request, res: Response, next: NextFunction) {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (token) {
//       try {
//         const user = this.jwtService.verify(token);
//         (req as any).user = user;
//       } catch (error) {
//         return res.status(401).json({ message: 'Unauthorized' });
//       }
//     }

//     next();
//   }
// }
