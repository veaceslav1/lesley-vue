import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/sale_orders',
    method: 'get',
    params
  })
}

export function getSaleOrder(id) {
  return request({
    url: '/sale_orders/' + id,
    method: 'get'
  })
}
