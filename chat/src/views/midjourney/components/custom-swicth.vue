<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    checkedValue?: number;
    uncheckedValue?: number;
  }>(),
  {
    checkedValue: 1,
    uncheckedValue: 0,
  }
);
const value = defineModel<number>('value');

const isFalse = computed(() => props.uncheckedValue === value.value);

function changeState() {
  if (value.value === props.uncheckedValue) {
    value.value = props.checkedValue;
  } else {
    value.value = props.uncheckedValue;
  }
}
</script>

<template>
  <div
    :class="isFalse ? 'bg-[rgb(196,196,196)]' : 'bg-[rgb(0,47,167)]'"
    class="w-[60px] rounded-full p-0.5 flex items-center cursor-pointer"
    @click="changeState"
  >
    <div
      class="w-[26px] h-[26px] bg-white rounded-full transform transition-transform"
      :class="isFalse ? '' : ' translate-x-[30px]'"
    ></div>
  </div>
</template>
