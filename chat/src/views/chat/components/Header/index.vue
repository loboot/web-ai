<script lang="ts" setup>
import { computed, ref, onMounted, Ref } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { SvgIcon } from '@/components/common';
import {
  useAppStore,
  useAuthStore,
  useChatStore,
  useGlobalStoreWithOut,
} from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { fetchUpdateGroupAPI } from '@/api/group';
import { fetchQueryModelsListAPI } from '@/api/models';
import { ChevronRightIcon } from '@heroicons/vue/24/outline';
defineProps<Props>();
const emit = defineEmits<Emit>();
const authStore = useAuthStore();

interface Props {
  usingContext: boolean;
}

interface ModelOption {
  label: string;
  value: string;
}

interface Model {
  modelName: string; // 模型的名称
  model: string; // 模型的标识符或代码
  deduct: number; // 可能表示某种扣减值或费用
  deductType: number; // 扣减类型的标识符
  maxRounds: number; // 最大轮数或某种限制
}

interface Emit {
  (ev: 'export'): void;
  (ev: 'toggleUsingContext'): void;
  (ev: 'clear'): void;
  (ev: 'scrollBtn'): void;
}

let modelMapsCache: any = ref({});
let modelTypeListCache: any = ref([]);

const modelName = computed(() => getModelName());

function getModelName() {
  const chatStore = useChatStore();
  console.log('当前的 activeConfig:', chatStore.activeConfig);
  if (!chatStore.activeConfig) return;

  const { modelTypeInfo, modelInfo } = chatStore.activeConfig;
  console.log('当前的 activeConfig:', chatStore.activeConfig);
  if (!modelTypeInfo || !modelInfo) return;
  return `${modelInfo.modelName}`;
}

const appStore = useAppStore();
const chatStore = useChatStore();
const modelOptions: Ref<ModelOption[]> = ref([]);

const useGlobalStore = useGlobalStoreWithOut();
const darkMode = computed(() => appStore.theme === 'dark');

const collapsed = computed(() => appStore.siderCollapsed);

const { isMobile } = useBasicLayout();

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value);
}

function handleExport() {
  emit('export');
}

function handleClear() {
  emit('clear');
}

function checkMode() {
  const mode = darkMode.value ? 'light' : 'dark';
  appStore.setTheme(mode);
}

/* 当前的对话组id */
const chatGroupId = computed(() => chatStore.active);

/* 修改对话组模型配置 */
async function switchModel(option) {
  const { modelTypeInfo, modelInfo } = chatStore.activeConfig;
  const config = {
    modelInfo: {
      keyType: modelInfo.keyType,
      modelName: option.label,
      model: option.value,
      maxModelTokens: modelInfo.maxModelTokens,
      maxResponseTokens: modelInfo.maxResponseTokens,
      systemMessage: modelInfo.systemMessage,
      topN: modelInfo.topN,
      deductType: modelInfo.deductType,
      deduct: modelInfo.deduct,
      maxRounds: modelInfo.maxRounds,
      rounds: modelInfo.rounds,
    },
    modelTypeInfo: modelTypeInfo,
  };

  const params = {
    groupId: chatGroupId.value,
    config: JSON.stringify(config),
  };

  await fetchUpdateGroupAPI(params);
  await chatStore.queryMyGroup();
  useGlobalStore.updateModelDialog(false);
}

async function queryModelsList() {
  try {
    const res: any = await fetchQueryModelsListAPI();
    if (!res.success) return;
    const { modelMaps, modelTypeList } = res.data;
    modelMapsCache.value = modelMaps;
    console.log('modelMaps', modelMaps);
    modelTypeListCache.value = modelTypeList;
    modelOptions.value = Object.values(modelMaps)
      .flat()
      .map((model: Model) => ({
        label: model.modelName,
        value: model.model,
      }));
  } catch (error) {
    console.error('Error in queryModelsList:', error);
  }
}

const isLogin = computed(() => authStore.isLogin);

function handleSignIn() {
  if (!isLogin.value) {
    authStore.setLoginDialog(true);
    return;
  }
  useGlobalStore.updateSignInDialog(true);
}

onMounted(() => {
  queryModelsList();
});
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
          <Menu
            as="div"
            class="relative flex-1 flex ele-drag items-center h-full dark:bg-gray-900"
          >
            <div>
              <div class="py-1">
                <MenuButton
                  class="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400 text-gray-700"
                >
                  {{ modelName }}
                  <ChevronRightIcon class="h-4 w-4 align-middle" />
                </MenuButton>
              </div>
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
                class="absolute left-0 top-full z-10 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:text-gray-400 text-gray-900"
              >
                <div class="py-1">
                  <MenuItem
                    v-for="(option, index) in modelOptions"
                    :key="index"
                  >
                    <div class="group" @click="switchModel(option)">
                      <a
                        href="#"
                        class="flex items-center px-4 py-2 text-sm group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
                      >
                        {{ option.label }}
                      </a>

                      <!-- <p
                        class="mt-1 p-5 text-gray-600 group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
                      >
                        介绍介绍介绍介绍介绍介绍介绍介绍
                      </p> -->
                    </div>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

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
