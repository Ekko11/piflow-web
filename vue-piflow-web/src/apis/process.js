import axios from 'axios';

// 根据发布流水线Id分页获取运行历史列表
export function getProcessPageByPublishingId (data) {
    return axios({
        method:'post',
        url:`/process/getProcessPageByPublishingId`,
        data
    })
}
