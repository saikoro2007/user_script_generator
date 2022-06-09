<template>
  <el-container :style="{ height: '100%' }">
    <el-header>
      <span class="title-text">User Script Generator</span>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<style>
html {
  height: 100%;
}

body {
  font-family: sans-serif;
  background-color: #F7F9FA;
}
</style>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-header {
  text-align: center!important;
}

.el-main {
  margin: 50px auto auto auto;
  width: 50%;
}

.el-main  > .el-container {
  background-color: #FFF;
}

.title-text {
  font-size: 40px;
  font-family: Oswald, sans-serif;
}
</style>
