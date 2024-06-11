// Class based middleware
// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     console.log('Request: ' + JSON.stringify(req));
//     next();
//   }
// }

// If simple, a middleware can be written in functional style
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
	console.log(`Request...` + req.method + ' ' + req.url);
	next();
}
