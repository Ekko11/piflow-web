import axios from 'axios';
import { formDataFormat } from '@/utils/formDataFormat'

// 根据发布流水线Id分页获取运行历史列表
export function getProcessPageByPublishingId (data) {
    return axios({
        method:'post',
        url:`/process/getProcessPageByPublishingId`,
        data
    })
}


// 根据流水线运行状态
export function getAppInfo (params) {
    return axios({
        method:'get',
        url:`/process/getAppInfo`,
        params
    })
}


// 根据流水线运行状态
export function getByProcessId (id) {
    return axios({
        method:'get',
        url:`/process/getByProcessId?processId=${id}`,
    })
}


// 获取Appid
export function getAppIdByProcessId (id) {
    return axios({
        method:'get',
        url:`/process/getAppIdByProcessId?processId=${id}`,
    })
}


// 获取运行历史列表
export function getProcessHistoryPageOfSelf (data) {
    return axios({
        method:'post',
        url:`/process/getProcessHistoryPageOfSelf`,
        data
    })
}


// 获取日志地址
export function getLogUrl (data) {
    return axios({
        method:'post',
        url:'/process/getLogUrl',
        data:formDataFormat(data),
        headers:{
            'Content-Type':'multipart/form-data'
        },
    })
}

// 获取日志详情
export function getLog (data) {
    return axios({
        method:'post',
        url:'/process/getLog',
        data:formDataFormat(data),
        headers:{
            'Content-Type':'multipart/form-data'
        },
    })
}


