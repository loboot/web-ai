module.exports = {
  parser: 'vue-eslint-parser', // 为 Vue 文件使用的解析器
  parserOptions: {
    parser: '@typescript-eslint/parser', // TypeScript 文件的解析器
    ecmaVersion: 2020, // 允许使用最新的 ECMAScript 特性
    sourceType: 'module', // 允许使用 ES 模块
  },
  extends: [
    'plugin:vue/vue3-recommended', // 或者 'plugin:vue/vue3-essential' 或 'plugin:vue/vue3-strongly-recommended'
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // 自定义规则
  },
};
