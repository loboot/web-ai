<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';
import { NButton, NPopover, NTooltip, useMessage } from 'naive-ui';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { useUsingContext } from '../../hooks/useUsingContext';
import { SvgIcon } from '@/components/common';
import {
  useAppStore,
  useAuthStore,
  useChatStore,
  useGlobalStoreWithOut,
} from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';

import type { Theme } from '@/store/modules/app/helper';
defineProps<Props>();
const emit = defineEmits<Emit>();
const authStore = useAuthStore();
const { usingContext, toggleUsingContext } = useUsingContext();

interface Props {
  usingContext: boolean;
}

interface Emit {
  (ev: 'export'): void;
  (ev: 'toggleUsingContext'): void;
  (ev: 'clear'): void;
  (ev: 'scrollBtn'): void;
}
const ms = useMessage();
const themeOptions: { label: string; key: Theme; icon: string }[] = [
  {
    label: 'Auto',
    key: 'auto',
    icon: 'ri:contrast-line',
  },
  {
    label: 'Light',
    key: 'light',
    icon: 'ri:sun-foggy-line',
  },
  {
    label: 'Dark',
    key: 'dark',
    icon: 'ri:moon-foggy-line',
  },
];

const modelName = computed(() => {
  if (!chatStore.activeConfig) return;
  const { modelTypeInfo, modelInfo } = chatStore.activeConfig;
  if (!modelTypeInfo || !modelInfo) return;
  return `${modelInfo.modelName}`;
});

const appStore = useAppStore();
const chatStore = useChatStore();
const useGlobalStore = useGlobalStoreWithOut();
const darkMode = computed(() => appStore.theme === 'dark');

const collapsed = computed(() => appStore.siderCollapsed);
const currentChatHistory = computed(() => chatStore.getChatByGroupInfo());

const { isMobile } = useBasicLayout();
const theme = computed(() => appStore.theme);

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value);
}

function onScrollToTop() {
  const scrollRef = document.querySelector('#scrollRef');
  if (scrollRef) nextTick(() => (scrollRef.scrollTop = 0));
}

function handleExport() {
  emit('export');
}

function handleClear() {
  emit('clear');
}

function handleScrollBtm() {
  emit('scrollBtn');
}

function checkMode() {
  const mode = darkMode.value ? 'light' : 'dark';
  appStore.setTheme(mode);
}

function handleOpenModelDialog() {
  if (useGlobalStore.isChatIn)
    return ms.warning('请等待聊天结束后修改模型信息！');

  useGlobalStore.updateModelDialog(true);
}
const isLogin = computed(() => authStore.isLogin);

function handleSignIn() {
  if (!isLogin.value) {
    authStore.setLoginDialog(true);
    return;
  }
  useGlobalStore.updateSignInDialog(true);
}
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 z-30 border-b-gray-100 dark:border-neutral-800 bg-white dark:bg-gray-900 h-14"
  >
    <div class="relative flex items-center justify-center min-w-0 h-full">
      <div class="max-w-screen-4xl flex w-full h-full items-center px-4">
        <div v-if="isMobile" class="flex items-center">
          <button
            class="flex items-center justify-center w-11 h-full"
            @click="handleUpdateCollapsed"
          >
            <SvgIcon
              v-if="collapsed"
              class="text-2xl"
              icon="ri:align-justify"
            />
            <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
          </button>
        </div>

        <!-- pc -->
        <div class="flex justify-between items-center h-full w-full">
          <div
            class="flex-1 flex ele-drag items-center h-full dark:bg-gray-900"
          >
            <button
              class="flex items-center rounded-md justify-between px-2 py-2 font-bold text-ellipsis whitespace-nowrap cursor-pointer select-none dark:text-gray-400 dark:hover:bg-gray-800"
              @click="handleOpenModelDialog"
            >
              <span class="flex-1 overflow-hidden">{{ modelName }}</span>
              <SvgIcon
                class="text-2xl"
                :icon="
                  useGlobalStore.modelDialog
                    ? 'ri:arrow-down-s-line'
                    : 'ri:arrow-right-s-line'
                "
              />
            </button>
          </div>

          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400 text-gray-700"
              >
                更多
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-24 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:text-gray-400 text-gray-900"
              >
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100  dark:bg-gray-700' : '',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                      @click="checkMode"
                    >
                      切换主题
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100  dark:bg-gray-700' : '',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                      @click="handleSignIn"
                    >
                      每日签到
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100  dark:bg-gray-700' : '',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                      @click="handleExport"
                    >
                      导出记录
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100  dark:bg-gray-700' : '',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                      @click="handleClear"
                    >
                      清空本页
                    </a>
                  </MenuItem>
                  <!-- <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                      @click="handleScrollBtm"
                    >
                      滚动到底部
                    </a>
                  </MenuItem> -->
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </header>
</template>
