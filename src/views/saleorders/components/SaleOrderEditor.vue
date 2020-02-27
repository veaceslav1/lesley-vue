<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Order Date">
        <el-col :span="11">
          <el-date-picker v-model="form.date" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="Customer">
        <el-col :span="11">
          <el-autocomplete
            v-model="form.customer"
            :fetch-suggestions="querySearch"
            placeholder="Please input"
            class="inline-input"
            @select="handleSelect"
          />
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        date: '',
        customer: '',
        saleOrderItems: []
      },
      links: []
    }
  },
  mounted() {
    this.links = this.loadAll()
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    querySearch(queryString, cb) {
      var links = this.links
      var results = queryString ? links.filter(this.createFilter(queryString)) : links
      // call callback function to return suggestions
      cb(results)
    },
    createFilter(queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        { value: 'element', link: 'https://github.com/ElemeFE/element' },
        { value: 'babel', link: 'https://github.com/babel/babel' }
      ]
    },
    handleSelect(item) {
      console.log(item)
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
