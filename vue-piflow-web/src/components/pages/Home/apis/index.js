import axios from 'axios';
export function getDataProductType () {
    return axios({
        method:'get',
        url:'/dataProductType/get',
    })
}