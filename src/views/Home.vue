<template>
  <el-menu
    default-active="1"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1">2打生成ツール</el-menu-item>
    <el-menu-item index="2">キー変換ツール</el-menu-item>
    <el-menu-item index="3" disabled>1.5倍ツール(準備中)</el-menu-item>
  </el-menu>

  <two-combo-tool v-if="selected === '1'" />
  <convert-keys-tool v-if="selected === '2'" />
</template>

<script>
import TwoComboTool from "../components/TwoComboTool.vue";
import ConvertKeysTool from "../components/ConvertKeysTool.vue";

export default {
  name: "Home",
  components: {
    TwoComboTool,
    ConvertKeysTool,
  },
  data() {
    return {
      selected: '1',
    }
  },
  methods: {
    handleSelect(index) {
      this.selected = index
    }
  },
}
</script>

<style>
.tool-container {
  border: solid 1px var(--el-border-color-base);
  background-color: #FFF;
}
.tool-header {
  border-bottom: solid 1px var(--el-border-color-base);
  display: flex;
  align-items: center;
}
.tool-title-text {
  font-size: 20px;
}
</style>