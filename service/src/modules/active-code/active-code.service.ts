import { ConfigService } from 'nestjs-config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import getMAC, { isMAC } from 'getmac';

@Injectable()
export class ActiveCodeService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  // 查询激活状态，传入 MAC 地址
  async checkActivationStatus() {
    try {
      const url = this.configService.get('active-code').baseUrl;
      const macAddress = getMAC();
      const params = { macAddress };

      const response = await firstValueFrom(
        this.httpService.get(`${url}/active-code/checkActiveCode`, { params })
      );

      const { data, code, message } = response.data;
      if (code === 200) {
        return data;
      }
      throw new HttpException(
        message || '查询激活状态失败',
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      Logger.error('检查激活状态失败:', error);
      throw new HttpException(
        error.response?.message || '查询激活状态失败',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 激活服务，传入激活码
  async activateService(activeCode: string): Promise<any> {
    if (!activeCode) {
      throw new HttpException('激活码为空', HttpStatus.BAD_REQUEST);
    }

    try {
      const url = this.configService.get('active-code').baseUrl;
      const macAddress = getMAC();
      Logger.debug(macAddress, '获取macAddress成功');
      const response = await firstValueFrom(
        this.httpService
          .post(`${url}/active-code/activate`, {
            activeCode,
            macAddress,
          })
          .pipe(
            map((res) => res.data),
            catchError((error) => {
              throw new HttpException(
                error.response?.data?.message || '激活失败',
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
              );
            })
          )
      );

      const { data, code, message } = response;
      if (code === 200) {
        return data;
      }

      throw new HttpException(message || '激活失败', HttpStatus.BAD_REQUEST);
    } catch (error: any) {
      Logger.error('激活服务失败:', error);
      throw error;
    }
  }
}
