import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      // 没有token，允许访问但不设置用户
      return true;
    }
    
    // 有token，执行JWT验证
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // 如果有错误或没有用户，不抛出错误，返回undefined
    if (err || !user) {
      return undefined;
    }
    
    // 将用户信息设置到请求对象中
    const request = context.switchToHttp().getRequest();
    request.user = user;
    
    return user;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 