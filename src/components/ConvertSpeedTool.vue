<template>
  <el-container class="tool-container">
    <el-header class="tool-header">
      <span class="tool-title-text">速度変換ツール</span>
    </el-header>
    <el-main>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <el-form :model="form" label-width="auto">

        <el-upload
          action=""
          :auto-upload="false"
          :limit="1"
          :on-change="handleAdd"
          accept="application/json"
        >
          <el-button type="primary">ファイル選択</el-button>
        </el-upload>

        <el-form-item label="倍率" style="margin-top: 20px;">
          <el-input v-model.number="form.ratio" type="number"  />
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
  name: "ConvertSpeedTool",
  data() {
    return {
      form: {
        // 倍率
        ratio: 1.5,
      },
      script: [],
      errorMessage: '',
    }
  },
  methods: {
    handleAdd(file) {
      let reader = new FileReader()
      reader.onload = e => {
        this.script = JSON.parse(e.target.result)
      }
      reader.readAsText(file.raw)
    },
    onSubmit() {
      if (this.script.length === 0) {
        this.errorMessage = 'Jsonファイルが正しくありません。'
        return
      }
      // json作成
      const result = this.convertJson()
      if (result) {
        // ダウンロード
        this.downloadFile()
        // 初期化
        this.script = []
      }
    },
    convertJson () {
      for (let i=0; i < this.script.length; i++) {
        const row = this.script[i]
        if (row.code === 5 || row.code === 6) {
          row.values[0] = Math.round(row.values[0] * 1 / this.form.ratio)
        }
        this.script[i] = row
      }
      return true
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
.error-message {
  font-size: 16px;
  color: #c45656;
}
</style>