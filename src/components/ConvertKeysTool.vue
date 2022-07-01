<template>
  <el-container class="tool-container">
    <el-header class="tool-header">
      <span class="tool-title-text">キーを変換するツール</span>
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

        <h4>変更前</h4>
        <el-form-item label="Drum Centre (Left)">
          <el-select v-model="form.oldDrumCentreLeft">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>
        <el-form-item label="Drum Centre (Right)">
          <el-select v-model="form.oldDrumCentreRight">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>
        <el-form-item label="Drum Rim (Left)">
          <el-select v-model="form.oldDrumRimLeft">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>
        <el-form-item label="Drum Rim (Right)">
          <el-select v-model="form.oldDrumRimRight">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>

        <h4>変更後</h4>
        <el-form-item label="Drum Centre (Left)">
          <el-select v-model="form.newDrumCentreLeft">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>
        <el-form-item label="Drum Centre (Right)">
          <el-select v-model="form.newDrumCentreRight">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>
        <el-form-item label="Drum Rim (Left)">
          <el-select v-model="form.newDrumRimLeft">
            <el-option v-for="(str, i) in alphabet" :key="i" :label="str" :value="i+4" />
          </el-select>
        </el-form-item>
        <el-form-item label="Drum Rim (Right)">
          <el-select v-model="form.newDrumRimRight">
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
  name: "TwoComboTool",
  data() {
    return {
      form: {
        // 変更前
        oldDrumCentreLeft: 27, // X
        oldDrumCentreRight: 6, // C
        oldDrumRimLeft: 29, // Z
        oldDrumRimRight: 25, // V
        // 変更後
        newDrumCentreLeft: 9, // F
        newDrumCentreRight: 13, // J
        newDrumRimLeft: 7, // D
        newDrumRimRight: 14, // K
      },
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
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
        if (row.code === 17 || row.code === 25) {
          if (row.values[0] == this.form.oldDrumCentreLeft) {
            row.values[0] = this.form.newDrumCentreLeft
          } else if (row.values[0] == this.form.oldDrumCentreRight) {
            row.values[0] = this.form.newDrumCentreRight
          } else if (row.values[0] == this.form.oldDrumRimLeft) {
            row.values[0] = this.form.newDrumRimLeft
          } else if (row.values[0] == this.form.oldDrumRimRight) {
            row.values[0] = this.form.newDrumRimRight
          }
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