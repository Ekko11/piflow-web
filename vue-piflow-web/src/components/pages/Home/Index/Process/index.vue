<template>
    <div class="process">
         <div v-for="(item,index) in list" :key="index">
            <div class="process_title">
                <img src="@/assets/img/home/title.png" alt="">
                <h4>{{item.title}}</h4>
            </div>
            <div class="process_list" @click="handleEnter">
                <div v-for="(child,idx) in item.list" :key="idx">
                    <img :src="imgList[0]" alt="">
                    <div>
                        <p>{{child.title}}</p>
                        <p>{{child.subTitle}}</p>
                    </div>
                 </div>
            </div>

         </div>
    </div>
</template>
<script>
import {getDataProductType} from '@/apis/dataProduct'
export default {
    data(){
        return {
            list:[],
            imgList:[
                require("@/assets/img/home/p2.png"),
            ]
        }
    },
    created(){
        this.getList()
    },
    methods:{
        handleEnter(){
            this.$router.push('/home/list')
        },
        async getList(){
            // const res = await getDataProductType()
            this.list = [
                {
                    title:'生态系统要素数据产品生产流水线',
                    list:[
                        {
                            title:'大气环境要素数据产品',
                            subTitle:'生产流水线',
                            link:'123',
                            image:''
                        },
                        {
                            title:'大气环境要素数据产品',
                            subTitle:'生产流水线',
                            link:'123',
                            image:''
                        },
                        {
                            title:'大气环境要素数据产品',
                            subTitle:'生产流水线',
                            link:'123',
                            image:''
                        },
                        {
                            title:'大气环境要素数据产品',
                            subTitle:'生产流水线',
                            link:'123',
                            image:''
                        }
                    ]
                },
                {
                    title:'生态系统要素数据产品生产流水线',
                    list:[
                        {
                            title:'大气环境要素数据产品',
                            subTitle:'生产流水线',
                            link:'123',
                            image:''
                        },
                        {
                            title:'大气环境要素数据产品',
                            subTitle:'生产流水线',
                            link:'123',
                            image:''
                        },
                        {
                            title:'大气环境要素数据产品',
                            subTitle:'生产流水线',
                            link:'123',
                            image:''
                        },
                        {
                            title:'大气环境要素数据产品',
                            subTitle:'生产流水线',
                            link:'123',
                            image:''
                        }
                    ]
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>