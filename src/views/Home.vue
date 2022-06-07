<template>
  <el-container>
    <el-form :model="form" label-width="120px">
      <el-form-item label="BPM">
        <el-input v-model.number="form.bpm" />
      </el-form-item>

      <el-form-item label="1/n snap">
        <el-input v-model.number="form.snap" type="number" :min="1" />
      </el-form-item>

      <el-form-item label="遅延(ms)">
        <el-col :span="11">
          <el-input v-model.number="form.delay.min" type="number" />
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500"> ～ </span>
        </el-col>
        <el-col :span="11">
          <el-input v-model.number="form.delay.max" type="number" />
        </el-col>
      </el-form-item>

      <el-form-item label="キー１">
        <el-select v-model="form.key1" placeholder="選択してください。">
          <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
        </el-select>
      </el-form-item>

      <el-form-item label="キー２">
        <el-select v-model="form.key2" placeholder="選択してください。">
          <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">作成</el-button>
      </el-form-item>
    </el-form>
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
        delay: {
          min: 0,
          max: 0,
        },

        // keys
        key1: 13, // J
        key2: 9, // F

      },
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      script: [],
    }
  },
  methods: {
    onSubmit() {
      console.log(this.form)
      // json作成
      this.createJson()
      // ダウンロード
      this.downloadFile()
      // 初期化
      this.script = []
    },
    createJson() {
      // ミリ秒を計算 172＝＞44 8→32
      const snapTime = Math.round(60 * 1000 / this.form.bpm / this.form.snap)
      // 離すまでの時間(ms)
      const releaseTime = 20
      // 遅延を決定
      const secondPushTime = snapTime + Math.floor(Math.random() * ( this.form.delay.max + 1 - this.form.delay.min ) + this.form.delay.min) * [-1,1][Math.floor(Math.random() * 2)]

      // 1.key1を押す
      this.script.push({ "code": 17, "number": 0, "values": [this.form.key1, 0, 0, 0]})
      // 2.離すのを待つ
      this.script.push({ "code": 6, "number": 1, "values": [releaseTime, 0, 0, 0]})
      // 3.key1を離す
      this.script.push({ "code": 25, "number": 2, "values": [this.form.key1, 0, 0, 0]})
      // 4.key2を押すのを待つ
      this.script.push({ "code": 6, "number": 3, "values": [secondPushTime - releaseTime, 0, 0, 0]})

      // 1.key2を押す
      this.script.push({ "code": 17, "number": 4, "values": [this.form.key2, 0, 0, 0]})
      // 2.離すのを待つ
      this.script.push({ "code": 6, "number": 5, "values": [releaseTime, 0, 0, 0]})
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
