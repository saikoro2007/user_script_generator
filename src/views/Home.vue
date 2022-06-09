<template>
  <el-container class="main-container">
    <el-header>
      <span class="title-text">2打叩くスクリプトを生成するツール</span>
    </el-header>
    <el-main>
      <el-form :model="form" label-width="auto">
        <el-form-item label="BPM">
          <el-input v-model.number="form.bpm" />
        </el-form-item>

        <el-form-item label="1/n snap">
          <el-input v-model.number="form.snap" type="number" :min="1" />
        </el-form-item>

        <el-form-item label="２打目の遅延(ms)">
          <el-input v-model.number="form.delay" type="number" />
        </el-form-item>

        <el-form-item label="１打目を離すまでの時間(ms)">
          <el-input v-model.number="form.releaseTime1" type="number" />
        </el-form-item>

        <el-form-item label="２打目を離すまでの時間(ms)">
          <el-input v-model.number="form.releaseTime2" type="number" />
        </el-form-item>

        <el-form-item label="キー１">
          <el-select v-model="form.key1">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>

        <el-form-item label="キー２">
          <el-select v-model="form.key2">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">作成</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "Home",
  data() {
    return {
      form: {
        // BPM
        bpm: 150,

        // 1/n
        snap: 8,

        // 遅延
        delay: 0,

        // 離すまでの時間
        releaseTime1: 20,
        releaseTime2: 20,

        // keys
        key1: 13, // J
        key2: 9, // F

      },
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      script: [],
    }
  },
  methods: {
    goBack() {
      this.$router.push('/')
    },
    onSubmit() {
      // json作成
      this.createJson()
      // ダウンロード
      this.downloadFile()
      // 初期化
      this.script = []
    },
    createJson() {
      // BPMとsnapから2打の間隔の時間を計算
      const snapTime = Math.round(60 * 1000 / this.form.bpm / this.form.snap)
      // 遅延を加味した2打目の時間
      const secondPushTime = snapTime + this.form.delay

      // 1.key1を押す
      this.script.push({ "code": 17, "number": 0, "values": [this.form.key1, 0, 0, 0]})
      // 2.離すのを待つ
      this.script.push({ "code": 6, "number": 1, "values": [this.form.releaseTime1, 0, 0, 0]})
      // 3.key1を離す
      this.script.push({ "code": 25, "number": 2, "values": [this.form.key1, 0, 0, 0]})
      // 4.key2を押すのを待つ
      this.script.push({ "code": 6, "number": 3, "values": [secondPushTime - this.form.releaseTime1, 0, 0, 0]})

      // 1.key2を押す
      this.script.push({ "code": 17, "number": 4, "values": [this.form.key2, 0, 0, 0]})
      // 2.離すのを待つ
      this.script.push({ "code": 6, "number": 5, "values": [this.form.releaseTime2, 0, 0, 0]})
      // 3.key2を離す
      this.script.push({ "code": 25, "number": 6, "values": [this.form.key2, 0, 0, 0]})

      // 8,9: 終了処理
      this.script.push({ "code": 255, "number": 7, "values": [0, 0, 0, 0]})
      this.script.push({ "code": 255, "number": 8, "values": [0, 0, 0, 0]})

    },
    downloadFile() {
      // jsonダウンロード
      const blob = new Blob([JSON.stringify(this.script, null, '  ')], {
        type: 'application/json',
      });
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'exportData.json'
      link.click()
      link.remove()
    }
  },
}
</script>

<style scoped>
.el-container{
  border: solid 1px var(--el-border-color-base)
}
.el-header {
  border-bottom: solid 1px var(--el-border-color-base);
  display: flex;
  align-items: center;
}
.title-text {
  font-size: 20px;
}
</style>