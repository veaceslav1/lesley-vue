import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sale_orders',
    method: 'get',
    params
  })
}
