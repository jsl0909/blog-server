import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // eslint-disable-next-line no-console
    console.error('全局异常日志:', exception);
    throw exception;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 全局异常日志
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS 配置
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:5173'),
    credentials: true,
  });

  // API 前缀
  app.setGlobalPrefix('api');

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('博客 API')
    .setDescription('博客系统 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  console.log(`应用运行在: http://localhost:${port}`);
  console.log(`API 文档: http://localhost:${port}/api`);
}
bootstrap(); 