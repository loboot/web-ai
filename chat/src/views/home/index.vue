<script setup lang="ts">
import TopBannerBg from '@/assets/home/top-banner-bg.png';
import { useAuthStore } from '@/store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const { globalConfig } = storeToRefs(useAuthStore());

const topTitle = computed(() => globalConfig.value.homeTitle.split(';'));
</script>
<template>
  <div>
    <div class="relative overflow-hidden min-w-[694px] w-max mx-auto">
      <div
        class="absolute w-full h-full z-10"
        style="
          filter: blur(216.88px);
          background: radial-gradient(
            50% 50%,
            rgba(22, 22, 24, 0),
            rgb(22, 22, 24) 46.589%
          );
        "
      ></div>
      <img
        class="absolute w-full h-full object-cover rounded-[16px]"
        :src="TopBannerBg"
        style="box-shadow: 0 0 20px 20px rgba(16, 16, 20, 0.8)"
        alt=""
      />

      <div class="relative z-20 pt-[87px] pb-[78px] text-center">
        <div class="text-center">
          <div
            class="font-[700] text-[64px] text-white"
            v-for="text in topTitle"
            :key="text"
          >
            {{ text }}
          </div>
        </div>
        <div class="my-6 text-[18px] font-[600] text-[rgb(108,114,117)]">
          {{ globalConfig.homeSubTitle }}
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
    <div
      class="text-center mt-[64px] mb-[38px] text-white font-[600] text-[18px]"
    >
      快来开启你的 AI 之旅
    </div>
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
