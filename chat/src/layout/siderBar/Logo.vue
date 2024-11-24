<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useAuthStore } from '@/store';
const authStore = useAuthStore();

const logoPath = computed(() => authStore.globalConfig.clientLogoPath);
const homePage = computed(() => authStore.globalConfig.clientHomePath || '/');

const { isMobile } = useBasicLayout();

const getMobileClass = computed(() => {
  if (isMobile.value) return ['py-2', 'w-8'];
  return ['py-4', 'px-2', 'w-full'];
});
</script>

<template>
  <RouterLink :to="homePage">
    <img
      :src="logoPath ? logoPath : '/logo.ico'"
      :class="getMobileClass"
      class="cursor-pointer px-0 dark:border-[#ffffff17] border-#ebebeb-400"
      alt=""
    />
  </RouterLink>
</template>
