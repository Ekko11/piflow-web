import axios from 'axios';
import { formDataFormat } from '@/utils/formDataFormat'

// 查询数据产品分类
export function getDataProductType () {
    return axios({
        method:'get',
        url:'/dataProductType/get',
    })
}
// 数据产品编辑或新增
export function saveDataProduct (data) {
    return axios({
        method:'post',
        url:'/dataProductType/save',
        data:formDataFormat(data),
        headers:{
            'Content-Type':'multipart/form-data'
        },
    })
}


// 流水线发布 获取组件信息
export function getStopsInfoByFlowId (id) {
    return axios({
        method:'post',
        url:`/stops/getStopsInfoByFlowId?flowId=${id}`,
    })
}


// 流水线发布  编辑/新增
export function publishingStops (data) {
    return axios({
        method:'post',
        url:'/flowPublish/publishingStops',
        data,
        // headers:{
        //     'Content-Type':'multipart/form-data'
        // },
    })
}


// 获取数据产品列表
export function getDataProductList (data) {
    return axios({
        method:'post',
        url:'/paramsProduct/getByPage',
        data
    })
}


// 获取数据产品列表
export function downProductFile (id) {
    return axios({
        method:'get',
        url:`file/getFileById?id=${id}`,
        responseType:'blob'
    })
}

// 数据产品 管理员审核
export function permissionForPublishing (data) {
    return axios({
        method:'post',
        url:'/dataProduct/permissionForPublishing',
        data
    })
}

// 数据产品 下架
export function delistDataProduct (data) {
    return axios({
        method:'post',
        url:'/dataProduct/down',
        data
    })
}

// 删除 数据产品
export function deleteDataProduct (id) {
    return axios({
        method:'post',
        url:`/dataProduct/delete?id=${id}`,
    })
}


// 获取待审核数据产品列表
export function getPermissionByPage (data) {
    return axios({
        method:'post',
        url:'/dataProduct/getPermissionByPage',
        data
    })
}

// 数据产品使用 审核
export function permissionForUse (data) {
    return axios({
        method:'post',
        url:'/dataProduct/permissionForUse',
        data
    })
}




// 获取数据产品分类  偏好设置
export function setDataProductPreference (data) {
    return axios({
        method:'post',
        url:'/dataProductType/preference',
        data
    })
}




// 获取所有数据产品
export function getDataProductByPage (data) {
    return axios({
        method:'post',
        url:`/dataProduct/getByPage`,
        data
    })
}

