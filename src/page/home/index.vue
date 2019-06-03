<template>
  <section class="homeList sys-page">
    <el-row>
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="">
          <el-select v-model="params.gradeId" size="small" placeholder="--选择年级--"
            @change="onGradeChange">
            <el-option-group
              v-for="group in gradeOptions"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.itemKey"
                :label="item.itemValue"
                :value="item.itemKey">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div style="width:50%;margin:0px auto 10px;">
        <el-carousel trigger="click" type="card" :autoplay="false" height="120px"
          @change="onCardChange">
          <el-carousel-item v-for="item in classList" :key="item.itemKey">
            <div class="card-panel-icon-wrapper icon-people">
              <img src="~sysStatic/images/peoples.png" alt="" class="card-panel-icon">
            </div>
            <div class="card-panel-description">
              <div class="card-panel-header">{{ item.itemValue1 }}</div>
              <div class="card-panel-text">{{ item.itemValue2 }}</div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-row>
    <!-- :gutter属性来调整布局之间的宽度 -->
    <el-row>
      <div class="line-container" 
          v-loading="dataLoading"
          element-loading-text="数据加载中，请稍后！"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-card shadow="hover" body-style="padding:0px;">
          <line-chart :chart-data="examLineChartData"></line-chart>
        </el-card>
      </div>
    </el-row>
  </section>
</template>

<script>
import LineChart from './charts/lineChart'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      dataLoading: false,
      gradeOptions: [],
      classList: [],
      params: {
        gradeId: null,
        classId: null
      },
      examLineChartData: {
        legend: ['考试次数'],
        xAxisData: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        data: []
      }
    };
  },
  mounted() {
    var p = JSON.parse(JSON.stringify({isAll:'0'}));
    this.$axios.post('/homeAction.do?method=initHomeMag',p).then((response) => {
      if(response != null){
        this.gradeOptions = response.gradeOptions;
        this.classList = response.classList;
      }
    });
  },
  methods: {
    onGradeChange: function(){
      var p = JSON.parse(JSON.stringify(this.params));
      this.$axios.post('/homeAction.do?method=qryClassByGrade',p).then((response) => {
        if(response != null){
          this.classList = response.classList;
          if(this.classList.length == 0){
            this.examLineChartData.data = [];
          }
        }
      });
    },
    onCardChange: function(val){
      this.dataLoading = true;
      var p = JSON.parse(JSON.stringify({classId: this.classList[val].itemKey}));
      this.$axios.post('/homeAction.do?method=qryExamCountLineData',p).then((response) => {
        if(response != null){
          this.examLineChartData.data = response.lineDataList;
          this.dataLoading = false;
        }
      }).catch(() => {
        this.dataLoading = false;
        this.$message({
          showClose: true,
          message: '初始化信息出错！',
          type: 'error'
        });        
      });
    }
  }
};
</script>
<style>
  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 36px 70px;
    margin-left: 0px;
  }
  .card-panel-description .card-panel-header {
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    margin-bottom: 12px;
  }
  .card-panel-icon-wrapper {
    color: #fff;
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .icon-people {
     background: #40c9c6;
     color: #40c9c6;
  }
  .card-panel-icon {
    float: left;
    font-size: 48px;
    width: 60px;
    height: 60px;
  }

  .el-carousel__item {
    background-color: #138c88;
  }
  .el-carousel__item.is-active {
    background-color: #40c9c6;
  }
</style>