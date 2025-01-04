<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { computed } from 'vue';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useAuthStore } from '@/store';
const authStore = useAuthStore();

const props = withDefaults(
  defineProps<{
    imageClass?: string;
    notJump?: boolean;
  }>(),
  {
    imageClass: 'w-[54px]',
  }
);

const $router = useRouter();

const logoPath = computed(() => authStore.globalConfig.clientLogoPath);
const homePage = computed(() => authStore.globalConfig.clientHomePath || '/');

const { isMobile } = useBasicLayout();

const getMobileClass = computed(() => {
  if (isMobile.value) return ['py-2', 'w-8'];
  return ['py-4', 'px-2'];
});

function jumpPage() {
  if (props.notJump) return;

  $router.push(homePage.value);
}
</script>

<template>
  <div @click="jumpPage">
    <img
      :src="logoPath ? logoPath : '/logo.png'"
      :class="[getMobileClass, imageClass, notJump ? '' : 'cursor-pointer']"
      class="px-0 box-content dark:border-[#ffffff17] border-#ebebeb-400"
      alt=""
    />
  </div>
</template>
