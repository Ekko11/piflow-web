import axios from "axios";
import iView from 'view-design';
import { formDataFormat } from "@/utils/formDataFormat";
// 上传文件
export function uploadFile(data) {
  return axios({
    method: "post",
    url: "/file/uploadFile",
    data: formDataFormat(data),
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
// 根据id下载文件
export function downloadFileByIds(ids) {
  return axios({
    method: "get",
    url: `/file/getFileListByIds?ids=${ids}`,
    responseType: "blob",
  });
}



// 根据id下载文件
export function downloadFile(id) {
  return axios({
    method: "get",
    url: `/file/getFileById?id=${id}`,
    responseType: "blob",
  });
}


export function getFileNameByHeaders(headers, defaultFileName) {
  try{
    return  headers["content-disposition"].split(";")[1].split("=")[1].replaceAll("\"",'')
  }catch(err){
    return defaultFileName
  }
}

// 封装的下载方法
export const download = async (request, params, fileName) => {
  try {
    fileName = fileName || "download.txt";
    const res = await request(params);
    // 只要出现code就是异常
    if (res.data.code) {
      iView.Message.error({
        content: '下载失败',
        duration: 3,
      });
    } else {
      const file = res.data;
      const blob = new Blob([file]);
      fileName = getFileNameByHeaders(res.headers, fileName);
      console.log(fileName)
      downloadByBlob(blob, fileName);
    }
  } catch (error) {
    iView.Message.error({
      content: '下载失败',
      duration: 3,
    });
  }
};

// 文件流下载
export function downloadByBlob(file, fileName = "下载文件") {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}
