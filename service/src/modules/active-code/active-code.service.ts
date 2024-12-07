import { ConfigService } from 'nestjs-config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as os from 'node:os';

@Injectable()
export class ActiveCodeService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  getIp() {
    try {
      const networkInterfaces = os.networkInterfaces();

      let ipAddress;
      for (const iface in networkInterfaces) {
        for (const details of networkInterfaces[iface]) {
          if (details.family === 'IPv4' && !details.internal) {
            ipAddress = details.address;
            break;
          }
        }
        if (ipAddress) break;
      }
      return ipAddress;
    } catch (e) {
      Logger.error('获取网络接口信息失败:', e);
    }
  }

  // 查询激活状态，传入 ip 地址
  async checkActivationStatus() {
    try {
      const url = this.configService.get('active-code').baseUrl;
      const ip = this.getIp();

      const params = { ip };

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
      const ip = this.getIp();

      Logger.debug(ip, '获取ip成功');
      const response = await firstValueFrom(
        this.httpService
          .post(`${url}/active-code/activate`, {
            activeCode,
            ip,
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
