import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT, SWAGGERPREFIX, APIPREFIX } from '@/config/main';

const swaggerOptions = new DocumentBuilder()
  .setTitle('Bingo Team api document')
  .setDescription('Bingo Team api document')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();

export function createSwagger(app) {
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/BINGOAI/swagger/docs', app, document);
}
