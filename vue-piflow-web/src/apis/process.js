import axios from 'axios';

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




// 获取运行历史列表
export function getProcessHistoryPageOfSelf (data) {
    return axios({
        method:'post',
        url:`/process/getProcessHistoryPageOfSelf`,
        data
    })
}

