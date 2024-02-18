<template>
    <div class="intro">
             <div class="desc">
                本系统为采用大数据流水线技术开发的生态系统长期监测数据产品生产系统，根据《生态系统监测数据产品分类分级规范》和《生态系统关键指标数据产品生产技术规范》的要求，实现生态系统观测数据的质量控制和生态系统要素、功能和质量数据产品的加工生产。具体使用方法详见《系统使用说明文档》。
             </div>
             
             <div class="intro_table"> 
                <h4>生态系统监测数据产品分类分级</h4>

                <table>
                    <tbody>
                        <tr>
                            <td rowspan="6" width="162px">生态系统要素 <br>观测数据产品</td>
                            <td rowspan="2">大气环境要素观测数据产品</td>
                            <td>地面气象要素数据产品</td>
                            <td>气温、最高气温、最低气温、相对湿度、 大气压、10min平均风速、降水量</td>
                            <td>自动、人工观测小时尺度数据</td>
                            <td>质控后的小时尺度数据</td>
                            <td>插补后的小时尺度数据</td>
                            <td>日、月、年统计数据</td>
                        </tr>
                        <tr>
                            <td>辐射数据产品</td>
                            <td>总辐射曝辐量、总辐射辐照度，净辐射曝辐量、净辐射辐照度、光量子通量密度</td>
                            <td>自动观测小时尺度数据</td>
                            <td>质控后的小时尺度数据</td>
                            <td>插补后的小时尺度数据</td>
                            <td>日、月、年统计数据</td>
                        </tr>
                        <tr>
                            <td>生物要素观测数产品</td>
                            <td>植物群落种类组成与物质生产数据产品</td>
                            <td>生物量、物种组成、凋落物（森林、草地、水体）</td>
                            <td>样方调查数据</td>
                            <td>质控后的样方调查数据</td>
                            <td>/</td>
                            <td>样地尺度统计数据</td>
                        </tr>
                        <tr>
                            <td>土壤要素观测数据产品</td>
                            <td>土壤化学性质数据产品</td>
                            <td>土壤有机质（表层和剖面）</td>
                            <td>样方测定结果</td>
                            <td>质控后的样方测定结果</td>
                            <td>/</td>
                            <td>样地尺度统计数据</td>
                        </tr>
                        <tr>
                            <td  rowspan="2">水环境要素观测数据产品</td>
                            <td>水文要素数据产品</td>
                            <td>土壤含水量（TDR、中子仪）</td>
                            <td>日尺度观测数据</td>
                            <td>质控后的日尺度数据</td>
                            <td>/</td>
                            <td>月、年统计数据</td>
                        </tr>
                        <tr>
                            <td>水化学要素数据产品</td>
                            <td>水质（待定）</td>
                            <td>采样点测定数据</td>
                            <td>质控后数据</td>
                            <td>/</td>
                            <td>统计数据</td>
                        </tr>
                    </tbody>
                </table>


                <table>
                    <tbody>
                        <tr>
                            <td rowspan="7" width="162px">生态系统要素 <br> 观测数据产品</td>
                            <td rowspan="4">生产力和固碳功能数据产品</td>
                            <td rowspan="4">生产力和固碳数据产品</td>
                            <td>净初级生产力（NPP）</td>
                        </tr>
                        <tr>
                            <td>固碳（植被碳密度）</td>
                        </tr>
                        <tr>
                            <td>固碳（土壤有机碳密度）</td>
                        </tr>
                        <tr>
                            <td>涡度相关碳通量</td>
                        </tr>
                        <tr>
                            <td>生物多样性功能数据产品</td>
                            <td>生物多样性数据产品</td>
                            <td>物种丰富度、Shannon-Wiener指数、Simpson指数、Pielou指数</td>
                        </tr>
                        <tr>
                            <td>土壤保持功能数据产品</td>
                            <td>土壤保持数据产品</td>
                            <td>土壤保持量（通用土壤流失方程）</td>
                        </tr>
                        <tr>
                            <td>防风固沙功能数据产品</td>
                            <td>防风固沙数据产品</td>
                            <td>防风固沙量</td>
                        </tr>

                    </tbody>
                </table>
             </div>
    </div>
</template>
<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>