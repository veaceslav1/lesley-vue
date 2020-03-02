<template>
  <el-form-item class="user-dinamic-field">
    <div v-if="state === 'search'" class="user-edit">
       v-model="searchName"
    </div>
    <div v-if="state === 'edit'" class="user-edit">
    </div>
    <div v-elseif="state === 'create'" class="user-create">
    </div>
    <div v-else class="user-view">
    </div>
  </el-form-item>
</template>

<script>

export default {
  name: 'UserDinamicField',
  props: {
    user: {
      type: Object,
      default: undefined
    }
  }
  data() {
    return {
      state: 'search',
      searchName: ''
    }
  },
  mounted() {
    if (this.user !== undefined) {
      this.state = 'view'
    }
  }
}
</script>
