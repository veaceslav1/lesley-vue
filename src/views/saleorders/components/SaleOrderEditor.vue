<template>
  <div class="app-container">
    <el-form ref="form" :model="form">
      <el-form-item label="">
        <el-col :span="11">
          <el-date-picker v-model="form.date" type="date" placeholder="Order Date" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="11">
          <el-input v-model="customerName"
            prefix-icon="el-icon-user"
            placeholder="Customer Username"
          />
        </el-col>
        <el-col>
          <li v-for="customer in customers">{{ customer.username }}</li>
          <el-button-group>
            <el-button v-if="!form.customer" type="success">Create {{ customerName }}</el-button>
            <el-button v-if="form.customer" type="success">Update {{ customerName }}</el-button>
          </el-button-group>
        </el-col>
      </el-form-item>
    </el-form>
    <user-editor :userId="anUserId" />
    <input type="text" v-model="anUserId" />
  </div>
</template>

<script>
import { getSaleOrder } from '@/api/saleorders'
import { getUsers } from '@/api/user'
import debounce from 'throttle-debounce/debounce';

import UserEditor from '@/views/user/components/UserEditor'

export default {
  name: 'SaleOrderEditor',
  components: { UserEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        id: undefined,
        date: Date(),
        customer: '',
      },
      customerName: '',
      customers: [],
      customersFound: 0,
      saleOrderItems: [],
      links: [],
      theId: this.$route.params.id,
      doneLoading: false,
      anUserId: 44
    }
  },
  watch: {
    customerName: function (newName, oldName) {
      // load only if customer field is done loadding at form creation
      if (this.doneLoading) {
        this.debouncedGetCustomers()
      }
    }
  },
  created: function () {
    this.loadData()
  },
  mounted() {
    this.debouncedGetCustomers = debounce(500, this.getCustomers)
  },
  methods: {
    loadData() {
      if (this.isEdit) {
        getSaleOrder(this.$route.params.id).then(response => {
          if (response.status === 200) {
            this.form.customer = response.data.customer['@id']
            this.customerName = response.data.customer.username
          }
          else {
            console.log('Failed to load order')
          }
        }).then(() => {
          this.doneLoading = true
        })
      }
      else {
        this.doneLoading = true
      }
    },
    onSubmit() {
      this.$message('submit!')
    },
    getCustomers(){
      if (!this.doneLoading) return
      getUsers({username: this.customerName}).then(response =>  {
        if (response.status === 200) {
          console.log(response.data)
          this.customersFound = response.data['hydra:totalItems']
          this.customers = response.data['hydra:member']
          if (this.customersFound > 0 ) {
            this.form.customer = this.customers[0]
          }
          else {
            this.form.customer
          }
        }
        else {
          this.customersList = []
        }
      })
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
    fetchUsersByName() {
      getUsers({username: this.form.customer}).then(response => {
        if (response.status === 200) {
          var data = response.data['hydra:member']
          this.customers = data.length >= 1 ? data : []
        }
      })
    },
    onCustomerChange() {
      if (this.form.customer.length > 0) {
        this.fetchUsersByName()
      }
      else {
        this.customers = []
      }
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>
