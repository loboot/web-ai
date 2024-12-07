import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ActiveCodeService } from './active-code.service';

@ApiTags('active-code')
@Controller('active-code')
export class ActiveCodeController {
  constructor(private activeCodeService: ActiveCodeService) {}

  @Get('check')
  @ApiOperation({ summary: '检查激活码激活状态' })
  async check() {
    return await this.activeCodeService.checkActivationStatus();
  }

  @Post('activate')
  @ApiOperation({ summary: '激活服务' })
  @ApiResponse({ status: 200, description: '激活成功' })
  @ApiResponse({ status: 400, description: '无效的激活码' })
  async activate(@Body('activeCode') activeCode: string) {
    try {
      const res = await this.activeCodeService.activateService(activeCode);
      return res;
    } catch (e) {
      Logger.error(e, '激活失败');
      throw new BadRequestException('激活失败: ' + e.message);
    }
  }
}
