import axios from 'axios';

// 获取已发布流水线
export function getflowPublishList (params) {
    return axios({
        method:'get',
        url:'/flowPublish/getListByPage',
        params
    })
}


// 删除已发布流水线
export function deleteFlowPublish (id) {
    return axios({
        method:'post',
        url:`/flowPublish/delete?id=${id}`,
    })
}