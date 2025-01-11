import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuEntity } from './menu.entity';
import { QueryMenuDto } from './dto/queryMenu.dto';
import { SetMenuDto } from './dto/setMenu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private readonly menuEntity: Repository<MenuEntity>
  ) {}

  async onModuleInit() {
    await this.initMenu();
  }

  /* 初始化菜单 */
  async initMenu() {
    const menuCount = await this.menuEntity.count();
    if (menuCount > 0) return;
    const pcMenuData = [
      {
        menuTipText: '对话',
        menuIcon: 'ant-design:message-filled',
        menuName: 'Chat',
        menuPath: '/chat',
        menuType: 0,
        menuPlatform: 1,
        order: 100,
      },
      {
        menuTipText: '应用',
        menuIcon: 'ant-design:product-filled',
        menuName: 'AppStore',
        menuPath: '/app-store',
        menuType: 0,
        menuPlatform: 1,
        order: 200,
      },
      {
        menuTipText: '绘画',
        menuIcon: 'ri:landscape-line',
        menuName: 'Midjourney',
        menuPath: '/midjourney',
        menuType: 0,
        menuPlatform: 1,
        order: 300,
      },
      {
        menuTipText: '画廊',
        menuIcon: 'ant-design:picture-filled',
        menuName: 'Market',
        menuPath: '/market',
        menuType: 0,
        menuPlatform: 1,
        order: 400,
      },
      {
        menuTipText: '基础绘画',
        menuIcon: 'ri:image-edit-fill',
        menuName: 'Draw',
        menuPath: '/draw',
        menuType: 0,
        menuPlatform: 1,
        order: 500,
        isShow: false,
      },
      {
        menuTipText: '思维导图',
        menuIcon: 'ri:stackshare-fill',
        menuName: 'Mind',
        menuPath: '/mind',
        menuType: 0,
        menuPlatform: 1,
        order: 600,
        isShow: false,
      },
      {
        menuTipText: '会员中心',
        menuIcon: 'ant-design:shopping-cart-outlined',
        menuName: 'Pay',
        menuPath: '/pay',
        menuType: 0,
        menuPlatform: 1,
        order: 700,
      },
      {
        menuTipText: '推广计划',
        menuIcon: 'ri:share-fill',
        menuName: 'Share',
        menuPath: '/share',
        menuType: 0,
        menuPlatform: 1,
        order: 800,
        isShow: false,
      },
    ];
    const mobileMenuData = [
      {
        menuTipText: '对话',
        menuIcon: 'ant-design:message-filled',
        menuName: 'Chat',
        menuPath: '/chat',
        menuType: 0,
        menuPlatform: 0,
        order: 100,
        isShow: false,
      },
      {
        menuTipText: '应用',
        menuIcon: 'ant-design:product-filled',
        menuName: 'AppStore',
        menuPath: '/app-store',
        menuType: 0,
        menuPlatform: 0,
        order: 200,
      },
      {
        menuTipText: '绘画',
        menuIcon: 'ri:landscape-line',
        menuName: 'Midjourney',
        menuPath: '/midjourney',
        menuType: 0,
        menuPlatform: 0,
        order: 300,
        isShow: false,
      },
      {
        menuTipText: '思维导图',
        menuIcon: 'ri:stackshare-fill',
        menuName: 'Mind',
        menuPath: '/mind',
        menuType: 0,
        menuPlatform: 0,
        order: 400,
      },
      {
        menuTipText: '个人中心',
        menuIcon: 'ri:account-pin-box-line',
        menuName: 'UserCenter',
        menuPath: '/user-center',
        menuType: 0,
        menuPlatform: 0,
        order: 500,
        isShow: false,
      },
    ];

    const initMenuData = [...pcMenuData, ...mobileMenuData];

    await this.menuEntity.save(initMenuData);
  }

  async queryMenu(query: QueryMenuDto) {
    const { menuPlatform } = query;
    let where: any = {};
    menuPlatform && (where.menuPlatform = menuPlatform);
    console.log(await this.menuEntity.find({ where, order: { order: 'ASC' } }));

    return await this.menuEntity.find({ where, order: { order: 'ASC' } });
  }

  async menuListFront(query: QueryMenuDto) {
    const { menuPlatform } = query;
    let where: any = {
      isShow: true,
    };
    menuPlatform && (where.menuPlatform = menuPlatform);
    return await this.menuEntity.find({ where, order: { order: 'ASC' } });
  }

  async visibleMenu(params) {
    const { id } = params;
    if (!id) return;
    const m = await this.menuEntity.findOne({ where: { id } });
    if (!m) return;
    const { isShow } = m;
    const res = await this.menuEntity.update({ id }, { isShow: !isShow });
    return res.affected > 0;
  }

  async setMenu(params: SetMenuDto) {
    const { id } = params;
    if (params.isSystem) {
      params.menuPath = '';
    } else {
      params.menuIframeUrl = '';
    }
    delete params.isSystem;
    try {
      if (id) {
        const res = await this.menuEntity.update({ id }, params);
        return res.affected > 0;
      } else {
        const res = await this.menuEntity.save(params);
        return res;
      }
    } catch (error) {
      throw new HttpException('操作菜单失败!', HttpStatus.BAD_REQUEST);
    }
  }

  async delMenu(params) {
    const { id } = params;
    if (!id) {
      throw new HttpException('缺失必要参数!', HttpStatus.BAD_REQUEST);
    }
    const res = await this.menuEntity.delete({ id });
    return res;
  }

  async updateIcon(params) {
    const { id, menuIcon, menuTipText, order } = params;
    if (!id || !menuIcon || !menuTipText || !order) {
      throw new HttpException('缺失必要参数!', HttpStatus.BAD_REQUEST);
    }
    const res = await this.menuEntity.update(
      { id },
      { menuIcon, menuTipText, order }
    );
    return res.affected > 0;
  }
}
