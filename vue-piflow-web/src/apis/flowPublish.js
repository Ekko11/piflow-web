import axios from 'axios';


// 流水线发布  编辑/新增
export function publishingStops (data) {
    return axios({
        method:'post',
        url:'/flowPublish/publishingStops',
        data,
    })
}


// 获取已发布流水线
export function getflowPublishList (data) {
    return axios({
        method:'post',
        url:'/flowPublish/getListByPage',
        data
    })
}


// 删除已发布流水线
export function deleteFlowPublish (id) {
    return axios({
        method:'post',
        url:`/flowPublish/delete?id=${id}`,
    })
}


// 根据产品分类Id获取已发布流水线
export function getflowPublishListByProductTypeId (data) {
    return axios({
        method:'post',
        url:'/flowPublish/getFlowPublishingListPageByProductTypeId',
        data
    })
}

// 根据产发布Id获取已发布流水线
export function getPublishingById (id) {
    return axios({
        method:'get',
        url:`/flowPublish/getPublishingById?id=${id}`,
    })
}


// 运行流水线
export function runPublishFlow (data) {
    return axios({
        method:'post',
        url:'/flowPublish/run',
        data
    })
}

