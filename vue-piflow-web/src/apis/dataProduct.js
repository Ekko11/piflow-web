import axios from 'axios';
export function getDataProductType () {
    return axios({
        method:'get',
        url:'/dataProductType/get',
    })
}

export function saveDataProduct (data) {
    return axios({
        method:'post',
        url:'/dataProduct/save',
        data,
        headers:{
            'Content-Type':'multipart/form-data'
        },
    })
}


