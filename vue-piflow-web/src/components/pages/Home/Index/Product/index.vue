<template>
    <div class="product">
        <div class="search">
            <Input search enter-button  @on-search="handleSearch" placeholder="关键词搜索" />
        </div> 
        <div class="contain">
            <div class="contain_l">
                <h4>数据产品分类</h4>
                <Tree :data="data" expand-node @on-select-change="handleChangeSelectNode"></Tree>
            </div>
            <div class="contain_r">
                <div v-for="item in 12" :key="item">
                    <img src="@/assets/img/home/p1.png" alt="">
                    <div>
                        <h4>2007-2009年中国农业大学石羊河实验站玉米通量与生长观测数据集</h4>
                        <div class="contain_r-desc">
                            本数据集为中国农业大学石羊河实验站玉米地通量观测数据，包含能量平衡分量；耗水量；风速；气温；相对湿度；饱和水汽压差；土壤含水量；叶面积指数；冠高等指标，时间分辨率为日尺度，数据范围为2007-2009年玉米生长季（4/5月至9月）。本数据集为中国农业大学石羊河实验站玉米地通量观测数据，包含能量平衡分量；耗水量；风速；气温；相对湿度；饱和水汽压差；土壤含水量；叶面积指数；冠高等指标，时……
                        </div>
                        <div class="contain_r-btn">
                            <Button>在线下载</Button>
                            <Button>查看</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
            return {
                data: [
                    {
                        title: '生态系统要素数据',
                        expand: true,
                        children: [
                            {
                                title: '大气环境要素',
                                id:1
                            },
                            {
                                title: '生物要素',
                            },
                        ]
                    },
                    {
                        title: '生态系统服务功能数据',
                        expand: true,
                        children: [
                            {
                                title: '生产力和固碳功能',
                            },
                            {
                                title: '生物多样性维护功能生物多样性维护功能',
                            },
                        ]
                    }
                ]
            }
    },
    methods:{
        handleSearch(val){
            console.log(val)
        },
        handleChangeSelectNode(list,node){
            console.log(node)
        }
    }
}
</script>

<style lang="scss" scoped>
</style>