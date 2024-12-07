<script setup lang="ts">
import TopBannerBg from '@/assets/home/top-banner-bg.png';
import { useAuthStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, VNode } from 'vue';
import DrawPng from '@/assets/home/draw.png';
import MessagePng from '@/assets/home/message.png';
import MusicPng from '@/assets/home/music.png';
import VideoPng from '@/assets/home/video.png';
import Card1 from '@/assets/home/Card_1.png';
import Card2 from '@/assets/home/Card_2.png';
import Row from '@/assets/home/Row.png';
import Group from '@/assets/home/Group.png';
import MusicImage from '@/assets/home/music-image.png';
import Start from '@/assets/home/start.png';
import Stop from '@/assets/home/stop.png';
import VideoBg from '@/assets/home/video-bg.png';
import VideoImage from '@/assets/home/video-image.png';
import BannerLeft from '@/assets/home/banner-left.png';
import BannerRight from '@/assets/home/banner-right.png';
import { useRouter } from 'vue-router';
import { h } from 'vue';
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import { ResData } from '@/api/types';
import { fetchMidjourneyGetList } from '@/api';

const $router = useRouter();
const authStore = useAuthStore();
const { globalConfig } = storeToRefs(useAuthStore());

const topTitle = computed(() => globalConfig.value.homeTitle?.split(';') ?? []);

const vxNumber = computed(() => globalConfig.value.vxNumber);
const qqNumber = computed(() => globalConfig.value.qqNumber);

type MenuItem = {
  name: string;
  routeName?: string;
  icon?: string;
  clickFunc?: () => void;
  notNeedLogin?: boolean;
};
const menuList = computed(() => {
  const targetArr: MenuItem[] = [];
  type MenuItemType = 'AI对话' | 'AI音乐' | 'AI绘画' | 'AI视频';
  const menus = globalConfig.value.functionSwitch ?? '';

  const menusOptions: (Omit<MenuItem, 'name'> & {
    name: MenuItemType | (string & {});
  })[] = [
    {
      name: 'AI对话',
      routeName: 'Chat',
      icon: MessagePng,
    },
    {
      name: 'AI音乐',
      icon: MusicPng,
    },
    {
      name: 'AI绘画',
      routeName: 'Midjourney',
      icon: DrawPng,
    },
    {
      name: 'AI视频',
      icon: VideoPng,
    },
  ];

  targetArr.push(...menusOptions.filter((v) => menus.includes(v.name)));

  return targetArr;
});

function handleMenuClick(menu: MenuItem) {
  if (!authStore.isLogin && !menu.notNeedLogin) {
    return authStore.setLoginDialog(true);
  }
  if (menu.routeName) {
    $router.push({
      name: menu.routeName,
    });
  } else if (menu.clickFunc) {
    menu.clickFunc();
  }
}

const musicList: {
  icon: string;
  title: string;
  subTitle: string;
  rightIcon: string;
}[] = [
  {
    icon: MusicImage,
    title: 'Aroukkii - 深海的拥抱「Deep DnB',
    subTitle: 'Deep Drum 和Bass·大气',
    rightIcon: Start,
  },
  {
    icon: MusicImage,
    title: 'Aroukkii - 深海的拥抱「Deep DnB',
    subTitle: 'Deep Drum 和Bass·大气',
    rightIcon: Stop,
  },
  {
    icon: MusicImage,
    title: 'Aroukkii - 深海的拥抱「Deep DnB',
    subTitle: 'Deep Drum 和Bass·大气',
    rightIcon: Start,
  },
];

const footerMenus = computed<
  {
    moduleName: string;
    data: (MenuItem & { isHidden?: any })[];
  }[]
>(() => [
  {
    moduleName: '快速链接',
    data: [
      {
        name: '注册/登录',
        isHidden: authStore.isLogin,
      },
      {
        name: '观看作品集',
      },
    ],
  },
  {
    moduleName: '开始你的作品',
    data: menuList.value,
  },
  {
    moduleName: '联系我们',
    data: [
      {
        name: `微信：${vxNumber.value}`,
        isHidden: !vxNumber.value,
        notNeedLogin: true,
      },
      {
        name: `qq：${qqNumber.value}`,
        isHidden: !qqNumber.value,
        notNeedLogin: true,
      },
    ],
  },
]);

function checkShow(name: string) {
  return ~menuList.value.findIndex((v) => v.name === name);
}

const imageList = ref<
  {
    src: string;
  }[]
>([]);
async function init() {
  try {
    const res: ResData = await fetchMidjourneyGetList({
      page: 1,
      size: 6,
      rec: 1,
    });
    const target: any[] = res.data?.rows ?? [];

    imageList.value = target.map((v) => ({ src: v.drawUrl }));
  } catch (error) {
    console.log(error);
  }
}

init();
</script>
<template>
  <div>
    <div class="relative min-w-[694px] w-max mx-auto">
      <img
        class="absolute w-full h-full object-cover rounded-[16px]"
        :src="TopBannerBg"
        alt=""
      />

      <div class="relative z-20 pt-[87px] pb-[78px] text-center">
        <div class="text-center relative" v-show="topTitle.length">
          <div
            class="font-[700] text-[64px] text-white"
            v-for="text in topTitle"
            :key="text"
          >
            {{ text }}
          </div>
          <img
            class="absolute -left-[40px] top-[40px]"
            :src="BannerLeft"
            alt=""
          />
          <img
            class="absolute -right-[100px] -top-[10px]"
            :src="BannerRight"
            alt=""
          />
        </div>
        <div class="my-6 text-[18px] font-[600] text-[rgb(108,114,117)]">
          {{ globalConfig.homeSubTitle }}
        </div>
        <div
          class="flex items-center justify-center gap-x-[10px]"
          v-if="menuList.length"
        >
          <button
            class="btn-box border border-[rgba(255,255,255,0.4)] bg-gradient-to-b from-[rgb(62,144,240)] to-[rgb(27,110,207)]"
            @click="handleMenuClick(menuList[0])"
          >
            开始使用
          </button>
          <button
            class="btn-box border border-[white]"
            @click="handleMenuClick({ name: '', routeName: 'Market' })"
          >
            观看作品集
          </button>
        </div>
      </div>
    </div>
    <div
      class="text-center mt-[64px] mb-[38px] text-white font-[600] text-[18px]"
    >
      快来开启你的 AI 之旅
    </div>
    <div class="flex justify-center items-center gap-[36px] mb-[126px]">
      <div
        class="flex items-center cursor-pointer justify-center gap-[13px] w-[282px] h-[62px] rounded-[7px] bg-[rgb(35,38,39)] border border-[rgb(52,56,57)]"
        v-for="item in menuList"
        :key="item.name"
        @click="handleMenuClick(item)"
      >
        <img class="w-[26px] h-6" :src="item.icon" alt="" />
        <span class="text-white text-[24px] font-[700]">{{ item.name }}</span>
      </div>
    </div>
    <template v-if="checkShow('AI对话')">
      <div class="text-white font-[700] text-[48px] mb-6 text-center">
        AI 智能对话
      </div>
      <div
        class="text-center text-[18px] font-[600] text-[rgb(108,114,117)] mb-[40px]"
      >
        <div>
          实际上，我们和其他的 AI 平台没有什么太大区别，但对于学习
          AI我们更懂你的意思。
        </div>
        <div>没错(･o･)ﾉYes!! 这就是重点</div>
      </div>
      <div class="flex items-center justify-center h-[608px] gap-6 mb-[216px]">
        <div class="w-[576px]">
          <img :src="Card1" alt="" />
        </div>
        <div class="w-[576px]">
          <img :src="Card2" alt="" />
        </div>
      </div>
    </template>
    <template v-if="checkShow('AI绘画')">
      <div class="text-white font-[700] text-[48px] text-center mb-[41px]">
        <div>我们正在构建初学者</div>
        <div>最容易上手的 AI 绘画</div>
      </div>
      <div
        class="relative mb-[223px]"
        :class="{ 'h-[1310px]': !imageList.length }"
      >
        <img class="absolute w-full left-0 top-[237px]" :src="Group" alt="" />
        <div class="relative z-10">
          <Waterfall
            v-if="imageList.length"
            :list="imageList"
            :width="376"
            :gutter="26"
            backgroundColor="transition"
          >
            <!-- v2.6.0之前版本插槽数据获取 -->
            <!-- <template #item="{ item, url, index }"> -->
            <!-- 新版插槽数据获取 -->
            <template #default="{ item, url, index }">
              <div class="rounded-[24px] overflow-hidden">
                <!-- <LazyImg :url="url" Access-Control-Allow-Origin /> -->
                <img :src="url" alt="" />
              </div>
            </template>
          </Waterfall>
          <img class="mx-auto" :src="Row" alt="" v-else />
          <div
            class="absolute w-full h-[348px] left-0 bottom-0 bg-gradient-to-b from-[rgba(20,23,24,0.01)] to-[rgb(20,23,24)]"
          ></div>
        </div>
      </div>
    </template>
    <template v-if="checkShow('AI音乐')">
      <div class="flex items-center justify-center gap-[202px] mb-[251px]">
        <div class="space-y-[13px]">
          <div
            class="flex items-center justify-center w-[667px] rounded-[24px] bg-gradient-to-b from-[rgb(32,35,36)] to-[rgb(20,23,24)] border border-[rgba(255,255,255,0.1)]"
            v-for="item in musicList"
          >
            <div class="w-[140px] h-[140px] rounded-[24px] overflow-hidden">
              <img class="w-full h-full object-cover" :src="item.icon" alt="" />
            </div>
            <div
              class="flex-1 flex items-center justify-between text-base ml-[12px] mr-[21px]"
            >
              <div class="">
                <div class="mb-3">{{ item.title }}</div>
                <div class="opacity-60">{{ item.subTitle }}</div>
              </div>
              <div class="opacity-60">6:33</div>
            </div>
            <div class="w-[72px] h-[72px] mr-3">
              <img :src="item.rightIcon" alt="" />
            </div>
          </div>
        </div>
        <div class="">
          <div class="text-[60px] text-white mb-[54px] text-center font-[600]">
            AI 音乐
          </div>
          <div class="flex items-center justify-center gap-x-[10px]">
            <button
              class="btn-box border border-[rgba(255,255,255,0.4)] bg-gradient-to-b from-[rgb(62,144,240)] to-[rgb(27,110,207)]"
            >
              开始使用
            </button>
            <button class="btn-box border border-[white]">观看作品集</button>
          </div>
        </div>
      </div>
    </template>
    <div
      class="flex items-center justify-center gap-[100px]"
      v-if="checkShow('AI视频')"
    >
      <div class="text-white space-y-[24px]">
        <div class="text-[48px] font-[700]">
          <div>{{ globalConfig.siteName || 'BingoAI' }}</div>
          <div>开启你的 AI 探索之旅</div>
        </div>
        <div class="text-[17px]">{{ globalConfig.homeEndingSubTitle }}</div>
        <div class="flex items-center gap-x-[10px]">
          <button
            class="btn-box border border-[rgba(255,255,255,0.4)] bg-gradient-to-b from-[rgb(62,144,240)] to-[rgb(27,110,207)]"
          >
            开始使用
          </button>
          <button class="btn-box border border-[white]">观看作品集</button>
        </div>
      </div>
      <div class="relative w-[640px] h-[440px]">
        <img
          class="absolute left-0 top-0 w-full h-full object-cover"
          :src="VideoBg"
          alt=""
        />
        <div class="absolute top-1/2 transform -translate-y-1/2 z-10">
          <img class="w-full" :src="VideoImage" alt="" />
        </div>
      </div>
    </div>
    <footer class="px-[100px] pt-[46px] pb-4">
      <div class="grid grid-cols-2">
        <div class="px-[28px] pt-[14px] font-[600] text-[24px]">
          {{ globalConfig.siteName || 'BingoAI' }}
        </div>
        <div class="grid grid-cols-3">
          <div v-for="moduleData in footerMenus">
            <div class="text-[14px] font-[500] text-[rgb(108,114,117)] mb-4">
              {{ moduleData.moduleName }}
            </div>
            <div class="space-y-2">
              <div
                class="text-[14px] font-[500] cursor-pointer"
                v-for="item in moduleData.data"
                @click="handleMenuClick(item)"
                v-show="!item.isHidden"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-[56px] text-center text-[14px]">
        {{ globalConfig.filingNumber }}
      </div>
    </footer>
  </div>
</template>

<style scoped>
.btn-box {
  padding: 8px 32px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  border-radius: 50px;
}
</style>
