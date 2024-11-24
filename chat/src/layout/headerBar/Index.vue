lear
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, shallowRef } from 'vue';
import { useAuthStore, useGlobalStoreWithOut } from '@/store';
import Logo from '../siderBar/Logo.vue';
import defaultAvatar from '@/assets/avatar.png';
import { NAvatar, NIcon, NTooltip } from 'naive-ui';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { PersonAddOutline, PersonRemoveOutline } from '@vicons/ionicons5';
import { HoverButton } from '@/components/common';
import NoticeDialog from '../components/NoticeDialog.vue';

type MenuItem = {
  name: string;
  routeName?: string;
  onClick?: () => void;
};

const siteName = computed(() => authStore.globalConfig.siteName ?? 'BingoAI');
const menuList = ref<MenuItem[]>([
  {
    name: '新人必读',
    onClick: () => useGlobalStore.updateNoticeDialog(true),
  },
  {
    name: '充值',
    routeName: 'Pay',
  },
]);

const router = useRouter();
function handleMenuClick(menu: MenuItem) {
  if (menu.onClick) {
    menu.onClick();
  } else if (menu.routeName) {
    router.push({ name: menu.routeName });
  }
}

function toPath(name: string) {
  router.push({ name });
}

const useGlobalStore = useGlobalStoreWithOut();

const route = useRoute();
const activeRoutePath = computed(() => route.path);
const authStore = useAuthStore();
const iframeSrc = computed(() => useGlobalStore.iframeUrl);
const isLogin = computed(() => authStore.isLogin);

const userInfo = computed(() => authStore.userInfo);

const noticeDialog = computed(() => useGlobalStore.noticeDialog);

const { isMobile } = useBasicLayout();

function toggleLogin() {
  if (isLogin.value) authStore.logOut();
  else authStore.setLoginDialog(true);
}

const logInIcon = shallowRef(PersonAddOutline);
const logOutIcon = shallowRef(PersonRemoveOutline);

const isHome = computed(() => route.name === 'Home');
</script>

<template>
  <header
    class="bg-white dark:bg-darkBg h-20 flex justify-between items-center"
  >
    <div class="flex items-center space-x-3 px-3">
      <div class="ele-drag" v-if="!isHome">
        <Logo />
      </div>
      <div
        class="font-semibold text-2xl text-center border-[#25272c] dark:border-white"
        :class="[
          isHome ? 'border-dashed ml-20 w-[141px]  h-9 leading-9 border ' : '',
        ]"
      >
        {{ siteName }}
      </div>
    </div>

    <div class="flex items-center gap-x-4" :class="isMobile ? 'mr-4' : 'mr-16'">
      <template v-if="isLogin">
        <div
          v-for="menu in menuList"
          :key="menu.name"
          @click="handleMenuClick(menu)"
          class="text-lg font-semibold cursor-pointer"
        >
          {{ menu.name }}
        </div>

        <NTooltip trigger="hover" placement="bottom">
          <template #trigger>
            <div
              class="flex items-center cursor-pointer"
              @click="toPath('UserCenter')"
            >
              <NAvatar
                :size="42"
                :src="userInfo.avatar"
                round
                bordered
                :fallback-src="defaultAvatar"
                class="cursor-pointer"
              />
              <div class="ml-2 text-lg font-semibold">
                {{ userInfo.username }}
              </div>
            </div>
          </template>
          个人中心
        </NTooltip>
      </template>
      <template v-else>
        <HoverButton tooltip="登录账户" placement="bottom" @click="toggleLogin">
          <NIcon size="32" color="#555">
            <component :is="logInIcon" />
          </NIcon>
        </HoverButton>
      </template>
    </div>
  </header>

  <NoticeDialog :visible="noticeDialog" />
</template>
