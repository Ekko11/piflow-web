
// 去除空值
export  const handleFormata = (data)=>{
    if(!data) return 
    const obj = JSON.parse(JSON.stringify(data))
    for (const key in obj) {
        if(Object.prototype.toString.call(obj[key]) === '[object Object]'){
            obj[key] =  handleFormata(obj[key])
        }else{
            if(!(!!obj[key] || obj[key] === 0|| obj[key] === false) ){
                delete obj[key]
            }
        }
    }
    return obj
}