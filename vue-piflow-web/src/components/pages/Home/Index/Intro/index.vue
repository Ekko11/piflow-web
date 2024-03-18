<template>
    <div class="intro">
             <div class="desc">
                本系统为采用大数据流水线技术开发的生态系统长期监测数据产品生产系统，根据《生态系统监测数据产品分类分级规范》和《生态系统关键指标数据产品生产技术规范》的要求，实现生态系统观测数据的质量控制和生态系统要素、功能和质量数据产品的加工生产。本系统目前支持2个大类、9个中类、12个小类、共计30个指标的数据质量控制和数据产品生产（表1），用于构建从生态系统要素、过程、功能到质量的数据产品体系。这些数据产品可做为生态系统评估的参照基准，服务于国家和典型区域生态系统状况评估。具体使用方法详见《系统使用说明文档》。
             </div>
             
             <div class="intro_table"> 
                <h4>表1·本系统支持的生态系统监测数据产品</h4>

                <table>

                    <thead>
                        <th>大类</th>
                        <th>中类</th>
                        <th>小类</th>
                        <th>指标</th>
                        <th>L0级数据产品</th>
                        <th>L1级数据产品</th>
                        <th>L2级数据产品</th>
                        <th>L3级数据产品</th>
                        <th>L4级数据产品</th>
                    </thead>

                    <tbody>
                        <tr>
                            <td rowspan="7" width="162px">生态系统要素 <br>观测数据产品</td>
                            <td rowspan="2">大气环境要素观测数据产品</td>
                            <td>地面气象要素数据产品</td>
                            <td>平均气温、最高气温、最低气温、降水量、相对湿度、风速、大气压</td>
                            <td>自动观测小时尺度数据</td>
                            <td>质控后的小时尺度数据</td>
                            <td>插补后的小时尺度数据</td>
                            <td>日、月、年统计数据</td>
                            <td>/</td>
                        </tr>
                        <tr>
                            <td>辐射数据产品</td>
                            <td>总辐射、光合有效辐射、净辐射</td>
                            <td>自动观测小时尺度数据</td>
                            <td>质控后的小时尺度数据</td>
                            <td>插补后的小时尺度数据</td>
                            <td>日、月、年统计数据</td>
                            <td>/</td>
                        </tr>
                        <tr>
                            <td  rowspan="2">生物要素观测数产品</td>
                            <td>植物群落种类组成与物质生产数据产品</td>
                            <td>生物量、植物种类组成、凋落物</td>
                            <td>样方调查数据</td>
                            <td>质控后的样方调查数据</td>
                            <td>/</td>
                            <td>样地尺度统计数据</td>
                            <td>/</td>
                        </tr>

                        <tr>
                            <td>植物群落动态与物候数据产品</td>
                            <td>物候期、作物生育时期动态</td>
                            <td>日尺度调查数据</td>
                            <td>质控后的日尺度数据</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                        </tr>

                        
                        <tr>
                            <td rowspan="2">土壤要素观测数据产品</td>
                            <td>土壤化学性质数据产品</td>
                            <td>土壤有机质</td>
                            <td>样方测定结果</td>
                            <td>质控后的样方测定结果</td>
                            <td>/</td>
                            <td>样地尺度统计数据</td>
                            <td>/</td>

                        </tr>
                                                
                        <tr>
                            <td>土壤物理性质数据产品</td>
                            <td>土壤颗粒组成、土壤容重</td>
                            <td>样方测定结果</td>
                            <td>质控后的样方测定结果</td>
                            <td>/</td>
                            <td>样地尺度统计数据</td>
                            <td>/</td>
                        </tr>

                        <tr>
                            <td>水环境要素观测数据产品</td>
                            <td>水文要素数据产品</td>
                            <td>土壤含水量</td>
                            <td>日尺度观测数据</td>
                            <td>质控后的日尺度数据</td>
                            <td>/</td>
                            <td>月、年统计数据</td>
                            <td>/</td>
                        </tr>


                        <tr>
                            <td rowspan="6">生态系统服务功能数据产品</td>
                            <td>水源涵养功能数据产品·</td>
                            <td>水源涵养数据产品</td>
                            <td>土壤蓄水量</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>根据土壤含水量L3级数据计算</td>
                        </tr>



                        <tr>
                            <td rowspan="2">生产力和固碳功能数据产品</td>
                            <td rowspan="2">生产力和固碳数据产品</td>
                            <td>净初级生产力、植被碳密度、土壤碳密度</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>根据生物量、土壤有机质等L3级数据计算</td>
                        </tr>


                        <tr>
                            <td>净CO<sub>2</sub>交换量</td>
                            <td>半小时自动观测数据</td>
                            <td>质控后的半小时数据</td>
                            <td>插补后的半小时数据</td>
                            <td>日、月、年统计数据</td>
                            <td></td>
                        </tr>

                        <tr>
                            <td>生物多样性功能数据产品</td>
                            <td>生物多样性数据产品</td>
                            <td>物种丰富度、Simpson指数、Shannon-Wiener指数、Pielou指数</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>根据植物种类组成L3级数据计算</td>
                        </tr>

                        <tr>
                            <td>土壤保持功能数据产品</td>
                            <td>土壤保持数据产品</td>
                            <td>土壤保持量</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>利用通用土壤流失方程计算</td>
                        </tr>

                        <tr>
                            <td>防风固沙功能数据产品</td>
                            <td>防风固沙数据产品</td>
                            <td>防风固沙量</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>/</td>
                            <td>利用修正风蚀方程计算</td>
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