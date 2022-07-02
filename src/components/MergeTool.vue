<template>
  <el-container class="tool-container">
    <el-header class="tool-header">
      <span class="tool-title-text">2つのJsonを結合するツール</span>
    </el-header>
    <el-main>
      <el-form :model="form" label-width="auto">
        <el-form-item label="ファイル１">
          <el-upload
            action=""
            :auto-upload="false"
            :limit="1"
            :on-change="handleAdd1"
            accept="application/json"
          >
            <el-button type="primary">ファイル選択</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="ファイル２">
          <el-upload
            action=""
            :auto-upload="false"
            :limit="1"
            :on-change="handleAdd2"
            accept="application/json"
          >
            <el-button type="primary">ファイル選択</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="遅延(ms)">
          <el-input v-model.number="form.delay" type="number" :min="0" :max="255" :step="1" />
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
  name: "MergeTool",
  data() {
    return {
      form: {
        // 遅延
        delay: 0,
      },
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      script_base1: [],
      script_base2: [],
      script: [],
    }
  },
  methods: {
    handleAdd1(file) {
      let reader = new FileReader()
      reader.onload = e => {
        this.script_base1 = JSON.parse(e.target.result)
      }
      reader.readAsText(file.raw)
    },
    handleAdd2(file) {
      let reader = new FileReader()
      reader.onload = e => {
        this.script_base2 = JSON.parse(e.target.result)
      }
      reader.readAsText(file.raw)
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
      this.script = this.script_base1
      // ファイル1を編集
      for (let i = this.script.length - 1; i >= 0; i--) {
        const row = this.script[i]
        // ファイルの後ろのExitとNoneを削除
        if (row.code === 1 || row.code === 255) {
          this.script.splice(i, 1)
        } else {
          break
        }
      }

      // 遅延を挿入
      if (this.form.delay) {
        this.script.push({ "code": 6, "number": 3, "values": [this.form.delay, 0, 0, 0]} )
      }

      // ファイル2 を結合
      this.script = this.script.concat(this.script_base2)
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