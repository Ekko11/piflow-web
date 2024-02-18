<template>
    <div>
     <div class="head">
        <div  class="head-l" @click="handleBack">生态台站监测数据产品生产系统</div>
        <div class="head-m"></div>
        <div class="head-r">
            <!-- <div>
                <img src="@/assets/img/home/user.png" alt="">
                <span>登录</span>
            </div> -->
            <div>
                <img src="@/assets/img/home/setting.png" alt="">
                <span @click="handleEnter">后台管理</span>
            </div>
        </div>
     </div>
    <router-view></router-view>        
    </div>
</template>
<script>
import Cookies from 'js-cookie';
export default {
    name:'home',
    methods:{
        handleEnter(){
            let state = Cookies.get('state'); //获取缓存看是否登录过
            if (state == 'jwtok') { 
                this.$router.push('/')
            }else{
                this.$router.push('/login')
            }
        },
        handleBack(){
            this.$router.push('/home')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>