import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'get/insect/all',
    method: 'get',
    params
  })
}
