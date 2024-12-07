<template>
  <div class="activate-container">
    <div class="activate-box">
      <h2 class="title">系统激活</h2>
      <div class="input-group">
        <el-input
          v-model="activeCode"
          placeholder="请输入激活码"
          :maxlength="32"
          :disabled="loading"
          clearable
        >
          <template #prefix>
            <el-icon><Key /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" :loading="loading" @click="handleActivate">
          激活
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Key } from '@element-plus/icons-vue';
import activeCodeApi from '@/api/modules/active-code';
import { useRouter } from 'vue-router';

const activeCode = ref('');
const loading = ref(false);

const router = useRouter();

onMounted(async () => {
  const res = await activeCodeApi.queryActiveCodeCheck();
  if (res.data) {
    router.replace('/');
  }
});

const handleActivate = async () => {
  if (!activeCode.value) {
    ElMessage.warning('请输入激活码');
    return;
  }

  loading.value = true;
  try {
    const res = await activeCodeApi.activateCode(activeCode.value);
    console.log(res);
    ElMessage.success('激活成功');
    activeCode.value = '';
    router.replace('/login');
  } catch (error: any) {
    ElMessage.error(error.message || '激活失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.activate-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--el-bg-color-page);

  .activate-box {
    background: var(--el-bg-color);
    padding: 32px;
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    width: 90%;
    max-width: 400px;

    .title {
      text-align: center;
      margin-bottom: 24px;
      color: var(--el-text-color-primary);
      font-weight: 500;
    }

    .input-group {
      display: flex;
      gap: 12px;

      .el-input {
        flex: 1;
      }

      :deep(.el-input__prefix) {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
