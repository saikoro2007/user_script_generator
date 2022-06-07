<template>
  <el-container :style="{ height: '100%' }">
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}

html {
  height: 100%;
}

body {
  height: 100%;
}
</style>
