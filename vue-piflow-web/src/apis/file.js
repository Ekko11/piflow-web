import axios from 'axios';
import { formDataFormat } from '@/utils/formDataFormat'

// 上传文件
export function uploadFile (data) {
    return axios({
        method:'post',
        url:'/file/uploadFile',
        data:formDataFormat(data),
        headers:{
            'Content-Type':'multipart/form-data'
        },
    })
}


// 根据id下载文件
export function downloadFile (id) {
    return axios({
        method:'get',
        url:`/file/getFileById?id=${id}`,
        responseType:'blob',

    })
}
