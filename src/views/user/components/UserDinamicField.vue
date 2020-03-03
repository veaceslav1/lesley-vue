<template>
  <div class="user-dinamic-field">
    <div v-if="state === 'search'" class="user-edit">
      <el-form
        :model="userForm"
        :rules="rules"
        ref="userForm" class="form-container" @submit.prevent>
        <el-form-item prop="username">
          <el-input v-model="searchName" prefix-icon="el-icon-search" suffix-icon="el-icon-user" placeholder="Search for User"/>
        </el-form-item>
        <div class="found-cusomers">
          <div v-for="potentialUser in foundUsers" @click="chooseFoundUser(potentialUser)">{{ potentialUser.username }}</div>
        </div>
        <div v-if="searchName.length > 1 && foundUsers.length === 0">
          <div class="create-user-explain">
            The username {{ userForm.username }} cannot be found.
            Provide a password to create a new user account.
          </div>
          <el-form-item prop="password">
            <el-input
              v-model="password"
              type="password"
              prefix-icon="el-icon-lock"
            />
          </el-form-item>
          <el-form-item prop="passwordRepeat">
            <el-input v-model="passwordRepeat" type="password" prefix-icon="el-icon-lock" />
          </el-form-item>
          <el-button type="success">Create User</el-button>
          <el-button type="warning" @click="clearSearch()">Clear</el-button>
        </div>
      </el-form>
    </div>
    <div v-else class="user-view">
      <div class="el-icon-user"> {{ user && user.username }} </div>
      <el-button type="success" @click="changeUser()">Change</el-button>
    </div>
  </div>
</template>

<script>
import UserEditor from '@/views/user/components/UserEditor'
import { getUsers, getUser } from '@/api/user'
import debounce from 'throttle-debounce/debounce';

const defaultForm = {
  username: '',
  password: '',
  passwordRepeat: ''
}

export default {
  name: 'UserEditor',
  props: ['user', 'initialstate'],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'))
      } else {
        if (this.userForm.password !== '') {
          this.$refs.userForm.validateField('passwordRepeat')
        }
        callback();
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.userForm.password) {
        callback(new Error('Two inputs don\'t match!'))
      } else {
        callback();
      }
    }
    return {
      userForm: Object.assign({}, defaultForm),
      state: 'view',
      searchName: '',
      doneLoading: false,
      foundUsers: [],
      password: '',
      passwordRepeat: '',
      rules: {
        username: [
          { required: true, message: 'Username required', trigger: 'blur' },
          { min: 2, message: 'Username length shall be at least 2 characters', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwordRepeat: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  watch: {
    searchName: function (newUserForm, oldUserForm) {
      // this.userForm.username = this.searchName
      this.debouncedSearchUsers()
    }
  },
  mounted() {
    this.debouncedSearchUsers = debounce(500, this.searchUsers)
    if (this._props.initialstate) {
      this.state = this._props.initialstate
    }
  },
  methods: {
    changeUser() {
      this.searchName = ''
      this.state = 'search'
    },
    searchUsers(){
      if (!this.searchName) return
      getUsers({username: this.searchName}).then(response =>  {
        if (response.status === 200) {
          this.foundUsers = response.data['hydra:member']
        }
        else {
          this.foundUsers = []
        }
      })
    },
    chooseFoundUser(userObject) {
      if (!userObject) return
      this.$emit('select-user', userObject)
      this.state = 'view'
      this.userForm.username = userObject.username
      this.foundUsers = []
    },
    clearSearch() {
      this.userForm.username = ''
      this.password = ''
      this.passwordRepeat = ''
    }
  }
}
</script>
