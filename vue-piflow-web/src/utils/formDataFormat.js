export const formDataFormat = (data)=>{
    const formdata = new FormData()
    if(!data) return formdata
    Object.keys(data).forEach(key => {
        formdata.append(key, data[key] ?? '')
    })
    return formdata
}