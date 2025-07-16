import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // 总是返回true，允许访问
    return true;
  }

  handleRequest(err: any, user: any) {
    // 不抛出错误，允许游客访问
    return user;
  }
} 