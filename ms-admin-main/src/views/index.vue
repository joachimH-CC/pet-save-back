<template>
  <div class="workbench">
    <div class="page-title">
      工作台
    </div>
    <div class="data-container" v-if="dataList">
      <div class="data-item">
        <div class="data-item-content">
          <p class="top-text">宠物总数</p>
          <div class="price">
            {{ dataList.petNum }}
          </div>
          <el-divider></el-divider>
          <div style="display: flex;justify-content: space-between;">
            <span v-if="dataList.petNumRatio < 0" class="el-icon-bottom up-text">{{ dataList.petNumRatio }}%较上月</span>
            <span v-else class="el-icon-top up-text">{{ dataList.petNumRatio }}%较上月</span>
          </div>
        </div>
      </div>
      <div class="data-item green">
        <div class="data-item-content">
          <p class="top-text">用户总数</p>
          <div class="price">
            {{ dataList.userNum }}
          </div>
          <el-divider></el-divider>
          <div style="display: flex;justify-content: space-between;">
            <span v-if="dataList.userNumRatio < 0" class="el-icon-bottom up-text">{{ dataList.userNumRatio }}%较上月</span>
            <span v-else class="el-icon-top up-text">{{ dataList.userNumRatio }}%较上月</span>
          </div>
        </div>
      </div>
      <div class="data-item org">
        <div class="data-item-content">
          <p class="top-text">本月申请数</p>
          <div class="price">
            {{ dataList.applyNum }}
          </div>
          <el-divider></el-divider>
          <div style="display: flex;justify-content: space-between;">
            <span v-if="dataList.applyNumRatio < 0" class="el-icon-bottom up-text">{{ dataList.applyNumRatio
            }}%较上月</span>
            <span v-else class="el-icon-top up-text">{{ dataList.applyNumRatio }}%较上月</span>
          </div>
        </div>
      </div>
      <div class="data-item">
        <div class="data-item-content">
          <p class="top-text">本月领养数</p>
          <div class="price">
            {{ dataList.adoptNum }}
          </div>
          <el-divider></el-divider>
          <div style="display: flex;justify-content: space-between;">
            <span v-if="dataList.adoptNumRatio < 0" class="el-icon-bottom up-text">{{ dataList.adoptNumRatio
            }}%较上月</span>
            <span v-else class="el-icon-top up-text">{{ dataList.adoptNumRatio }}%较上月</span>
          </div>
        </div>
      </div>
    </div>


    <div class="chart-container">

      <el-menu :default-active="activeTab" class="el-menu-demo" mode="horizontal" @select="handleTabChange"
        background-color="#fff" text-color="#333" active-text-color="#409EFF">
        <el-menu-item index="trend">宠物领养趋势</el-menu-item>
        <el-menu-item index="type">宠物类型分布</el-menu-item>
        <el-menu-item index="behavior">用户领养行为分析</el-menu-item>
      </el-menu>

      <div class="chart" v-show="activeTab === 'trend'" ref="trendChart"></div>
      <div class="chart" v-show="activeTab === 'type'" ref="typeChart"></div>
      <div class="chart" v-show="activeTab === 'behavior'" ref="behaviorChart"></div>
    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts'
import { monthAdoptNum, monthApplyNum, monthLoginNum, petTypeRadio, topData } from '../api/petAdopt/workbench';
export default {
  name: 'workbenches',
  data() {
    return {
      chart: null,
      // 模拟数据
      chartData: {
        receivable: undefined,
        received: undefined,
      },
      //图表数据
      monthAdoptData: undefined,
      adoptData: undefined,
      registerData: undefined,
      petdata: undefined,
      //顶部数据
      dataList: undefined,
      activeTab: 'trend',
      //图表初始化
      trendChart: null,
      typeChart: null,
      behaviorChart: null,
      //宠物类型底部legend数据
      legendData: undefined
    }
  },
  created() {
    this.getData()
  },
  mounted() {

    // 监听窗口大小变化，重新调整图表尺寸
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    // 组件实例销毁之前触发，离开当前页面
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
    //获取数据
    async getData() {
      const year = new Date().getFullYear()

      try {
        await this.getTopData()
        await this.getMonthAdoptNum(year)
        await this.getPetTypeRadio()
        await this.getMonthApplyNum(year)
        await this.getMonthLoginNum(year)

        // 所有数据获取完成后初始化图表
        this.$nextTick(() => {
          this.initCharts()
        })
      } catch (error) {
        console.error('获取数据失败:', error)
      }
    },
    //顶部栏数据
    async getTopData() {
      await topData().then(res => {
        console.log(res);
        this.dataList = res.data

      })
    },
    //宠物每月领养数量(已领养)
    async getMonthAdoptNum(year) {
      await monthAdoptNum({ year }).then(res => {

        this.monthAdoptData = this.monthlyArray(res.data)
        console.log(this.monthAdoptData);
      })
    },
    //宠物类型占比
    async getPetTypeRadio() {
      await petTypeRadio().then(res => {

        this.petdata = Object.entries(res.data).map(([name, item], index) => {
          const colors = [
            { itemStyle: { color: '#409eff' } },
            { itemStyle: { color: '#91cc75' } },
            { itemStyle: { color: '#fac858' } },
            { itemStyle: { color: '#ee6666' } }
          ]
          return {
            ...colors[index],
            value: item.petNum,
            name: name
          }
        })

        this.legendData = this.petdata.map(item => {
          return item.name
        })
        console.log(this.petdata);
      })
    },
    //每月用户申请数(取消的不算)
    async getMonthApplyNum(year) {
      await monthApplyNum({ year }).then(res => {
        this.adoptData = this.monthlyArray(res.data)
        console.log(this.adoptData);

      })
    },
    //每月用户登录次数(登录成功)
    async getMonthLoginNum(year) {
      await monthLoginNum({ year }).then(res => {

        this.registerData = this.monthlyArray(res.data)
        console.log(this.registerData);
      })
    },
    monthlyArray(val) {
      if (val) {
        const monthlyData = [];

        // 确保 1-12 月都有数据，按顺序排列
        for (let month = 1; month <= 12; month++) {
          monthlyData.push(val[month] || 0);
        }

        return monthlyData;
      }

    },
    initCharts() {
      // 初始化领养趋势图表
      this.trendChart = echarts.init(this.$refs.trendChart);
      this.trendChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

        },
        yAxis: {
          type: 'value',
          name: '领养数量',
        },
        series: [{
          data: this.monthAdoptData,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#2188ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(122, 184, 255, 0.3)'
              }, {
                offset: 1, color: 'rgba(255, 255, 255, 0.1)'
              }]
            }
          }
        }],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '70px',
          containLabel: true
        }
      });

      // 初始化宠物类型分布图表
      this.typeChart = echarts.init(this.$refs.typeChart);
      this.typeChart.setOption({

        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} 只({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: this.legendData
        },
        series: [{
          name: '宠物类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: this.petdata,
        }],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '60px',
          top: '30px',
          containLabel: true
        }
      });

      // 初始化用户领养行为分析图表
      this.behaviorChart = echarts.init(this.$refs.behaviorChart);
      this.behaviorChart.setOption({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['新用户注册', '领养申请'],
          bottom: 10
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '注册数量',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#333'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          }
        },
        series: [{
          name: '新用户注册',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#92c5ff'
              }, {
                offset: 1, color: '#fff'
              }]
            }
          },
          emphasis: {
            focus: 'series'
          },
          lineStyle: {
            width: 2,
            color: '#2188ff'  // 线条颜色在这里设置
          },
          itemStyle: {
            color: '#2188ff'  // 数据点颜色
          },
          data: this.registerData,
        }, {
          name: '领养申请',
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#f3d699'
              }, {
                offset: 1, color: '#fff'
              }]
            }
          },
          lineStyle: {
            width: 2,
            color: '#fbb936'  // 线条颜色在这里设置
          },
          itemStyle: {
            color: '#fbb936'  // 数据点颜色
          },
          emphasis: {
            focus: 'series'
          },
          data: this.adoptData
        }],
        grid: {
          left: '5%',
          right: '5%',
          bottom: '60px',
          top: '70px',
          containLabel: true
        }
      });
    },
    handleTabChange(key) {
      this.activeTab = key;
      this.$nextTick(() => {
        this.resizeCharts();
      });
    },
    resizeCharts() {
      if (this.trendChart) {
        this.trendChart.resize();
      }
      if (this.typeChart) {
        this.typeChart.resize();
      }
      if (this.behaviorChart) {
        this.behaviorChart.resize();
      }
    }
  }


}
</script>

<style rel="stylesheet/scss" lang="scss">
.workbench {

  .data-container {
    margin: 15px;
    display: flex;
    justify-content: space-between;

    .data-item {
      width: 350px;
      height: 150px;
      margin-right: 20px;
      background-color: white;
      border-left: #409eff 3px solid;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
      //border-image: linear-gradient(to right, #409eff, #fff) 1;

      .data-item-content {
        margin: 20px;
        color: #a4a4a4;

        .top-text {
          font-size: 14px;

        }

        .up-text {
          color: #52c41a;
        }

        .price {
          color: black;
          font-size: 30px;
          font-weight: 500;
        }
      }
    }

    .green {
      border-color: #52c41a;
    }

    .org {
      border-color: #fbb936;
    }

    .el-divider--horizontal {
      margin: 15px 0 !important;
    }
  }



  .chart-container {
    margin: 15px 15px 0 15px;
    background-color: white;

    .el-menu {
      padding: 15px;
    }

    .chart {
      width: 1200px;
      height: 400px;
    }
  }

}
</style>