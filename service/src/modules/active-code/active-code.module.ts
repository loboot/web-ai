import { ActiveCodeController } from './active-code.controller';
import { Global, Module } from '@nestjs/common';
import { ActiveCodeService } from './active-code.service';
import { HttpService, HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [ActiveCodeController],
  providers: [ActiveCodeService],
})
export class ActiveCodeModule {}
