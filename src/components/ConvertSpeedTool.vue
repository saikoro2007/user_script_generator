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
      converted: [],
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
        this.converted = []
      }
    },
    convertJson () {
      let ms = 0
      let remainder = 0
      let number = 0
      for (let i=0; i < this.script.length; i++) {
        const row = this.script[i]
        switch (row.code) {
          case 5:
            // msに戻しておく
            row.values[0] *= 256
            /* falls through */
          case 6: {
            // 元のmsに倍率を付与してから足す
            const shou = Math.floor(row.values[0] / this.form.ratio)
            remainder += row.values[0] / this.form.ratio - shou
            ms += shou
            // 余りが1msに達した場合delayを追加
            if (remainder >= 1) {
              ms += 1
              remainder -= 1
            }
            break
          }
          default:
            // delayがある場合は追加
            if (ms >= 1) {
              if (Math.floor(ms / 255) >= 1) {
                this.converted.push({"code": 5, "number": number++, "values": [Math.floor(ms/255), 0, 0, 0]})
              }
              if (ms % 255 >= 1) {
                this.converted.push({"code": 6, "number": number++, "values": [ms % 255, 0, 0, 0]})
              }
              ms = 0
            }

            // press, releaseを追加
            row.number = number++
            this.converted.push(row)
            break
        }
      }
      return true
    },
    downloadFile() {
      // jsonダウンロード
      const blob = new Blob([JSON.stringify(this.converted, null)], {
        type: 'application/json',
      });
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'converted.json'
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