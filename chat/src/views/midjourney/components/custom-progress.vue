<template>
  <div
    class="h-1 bg-[rgb(35,38,39)] rounded-full relative cursor-pointer"
    ref="bar"
  >
    <div
      class="w-[10px] h-[10px] rounded-full cursor-pointer absolute top-1/2 transform -translate-y-1/2 bg-white"
      :style="{ left: `${sliderLeft}px` }"
      @mousedown="mousedown"
    ></div>
    <div
      class="absolute h-full rounded-full top-1/2 transform -translate-y-1/2 bg-[rgb(0,47,167)]"
      :style="{ width: `${sliderLeft}px` }"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'fs';
import { ref, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    max?: number;
    min?: number;
  }>(),
  {
    max: 100,
    min: 0,
  }
);

const value = defineModel<number>('value');

const isMove = ref(false);

const bar = ref<HTMLElement>();
let sliderLeft = ref(0);
// 点击后添加事件
const mousedown = () => {
  isMove.value = true;
  window.addEventListener('mousemove', handleChange);
  window.addEventListener('mouseup', mouseup);
};
// 移动滑块
const handleChange = (e: any) => {
  if (!bar.value || !isMove.value) return;
  // 获取滑块的宽度（可移动区域）
  let w = bar.value.clientWidth;
  // 获取鼠标的位置
  let x = e.pageX - bar.value.getBoundingClientRect().left;
  // 判断是否超出范围
  const maxL = w - 10;
  x = x < maxL && x > 0 ? x : x >= maxL ? maxL : 0;

  const target = Math.round((x / maxL) * (props.max - props.min) + props.min);

  value.value =
    target < props.max && target > props.min
      ? target
      : target >= props.max
      ? props.max
      : props.min;
};

watchEffect(() => {
  if (value.value != undefined) {
    setSlideLeft();
  }
});

function setSlideLeft() {
  if (!bar.value) return;
  // 获取滑块的宽度（可移动区域）
  let w = bar.value.clientWidth;
  // 判断是否超出范围
  const maxL = w - 10;

  const targetVal = value.value ?? 0;
  const target = Math.round(
    ((targetVal - props.min) / (props.max - props.min)) * maxL
  );

  sliderLeft.value =
    target < maxL && target > 0 ? target : target >= maxL ? maxL : 0;
}
// 鼠标放开后移除事件
const mouseup = () => {
  isMove.value = false;
  window.removeEventListener('mousemove', handleChange);
  window.removeEventListener('mouseup', mouseup);
};
</script>
<style scoped lang="scss">
.bar {
  position: relative;
  height: 10px;
  background: linear-gradient(to right, rgb(108, 58, 146), rgb(255, 0, 0));
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  width: 100%;
}
.slider {
  position: absolute;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  width: 6px;
  height: 100%;
  background-color: #fff;
}
</style>
