<template>
  <section class="analyList sys-page">
    <transition name="el-zoom-in-center">
      <app-search v-show="analyParamsInfoVisible">
        <app-title title="分析参数信息" style="border-left:4px solid #52bab5;padding-left: 15px;">
        </app-title>
        <el-row>
          <el-col :span="24">
            <div class="grid-content">
              年级：
              <el-tag
                v-for="(tag,index) in classOptions"
                :key="index"
                v-if="tag.itemValue == '全部' ? false : true"
                type="primary">
                {{tag.itemValue}}
              </el-tag>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content">
              考试：
              <el-tag
                v-for="(tag,index) in examOptions"
                :key="index"
                type="primary">
                {{tag.itemValue}}
              </el-tag>
            </div>
          </el-col>
        </el-row>  
        <el-button icon="el-icon-edit" type="primary" size="mini"
          @click.native="editAnalyParams"
          style="margin-top:10px;">变更
        </el-button>         
      </app-search>
    </transition>
    <transition name="el-zoom-in-center">
      <div style="height: 240px;float:left;margin:20px 0px 0px 20px;" v-show="stepVisible">
        <el-steps direction="vertical" :active="step" finish-status="success">
          <el-step></el-step>
          <el-step></el-step>
          <el-step></el-step>
        </el-steps>
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <div v-show="analyFormVisible">
        <div class="el-step-hearder">
          <span class="step-card-title">{{stepCardTitle}}</span>
          <el-button icon="el-icon-caret-left" type="text" size="mini" 
            @click.native.prevent="handlePreStep(step)" v-show="preStep"
            style="padding-top:0px;padding-bottom:0px;margin-left:35px;">上一步
          </el-button>
          <el-button icon="el-icon-caret-right" type="text" size="mini" 
            @click.native.prevent="handleNextStep(step)" v-show="nextStep"
            style="padding-top:0px;padding-bottom:0px;margin-left:35px;">下一步
          </el-button>
        </div>
        <transition name="el-zoom-in-center">
          <div class="el-step-content transition-box" v-show="step1PanelVisible">
            <el-form :model="examAnalyForm" label-position="right" ref="examAnalyForm" label-width="100px" class="examAnalyForm">
              <span class="step-top-button" style="margin-left:100px;">
                <el-button icon="el-icon-plus" type="primary" size="small" plain
                  @click.native="onGradeSelect" 
                  style="vertical-align: middle;margin-bottom:4px;">年级
                </el-button>
              </span>
              <el-form-item>
                <transition name="el-zoom-in-center">
                  <div v-show="stageGradeVisible" class="transition-box">
                    <el-radio-group v-model="examAnalyForm.STAGE_ID" size="small" 
                        @change="onStageGradeChange">
                      <el-radio v-for="item in stageGradeOptions" 
                        :key="item.key" :label="item.key" border>{{item.label}}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </transition>
              </el-form-item>
              <el-form-item>
                <transition name="el-zoom-in-center">
                  <div v-show="gradeGroupVisible" class="transition-box">
                    <el-radio-group v-model="examAnalyForm.GRADE_ID" size="small"
                        @change="onGradeChange">
                      <el-radio v-for="item in gradeGroup" 
                        :key="item.itemKey" :label="item.itemKey" border>{{item.itemValue}}
                      </el-radio>
                    </el-radio-group>
                  </div>
                </transition>
              </el-form-item>
            </el-form>
          </div>
        </transition>
        <transition name="el-zoom-in-center">
          <div class="el-step-content transition-box" v-show="step2PanelVisible">
            <el-form :model="examAnalyForm" label-position="right" ref="examAnalyForm" label-width="100px" class="examAnalyForm">
              <span class="step-top-button" style="margin-left:100px;">
                <el-button icon="el-icon-plus" type="primary" size="small" plain
                  @click.native="classGroupVisible = !classGroupVisible" 
                  style="vertical-align: middle;">班级（可多选）
                </el-button>
              </span>
              <el-form-item>
                <transition name="el-zoom-in-center">
                  <div v-show="classGroupVisible" class="transition-box">
                    <el-checkbox-group v-model="examAnalyForm.EXAM_CLASS_ARR" size="small"
                        @change="onClassChange">
                      <el-checkbox v-for="item in classGroup" :key="item.itemKey" 
                          :label="item.itemKey" border>{{item.itemValue}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </transition>
              </el-form-item>
            </el-form>
          </div>
        </transition>
        <transition name="el-zoom-in-center">
          <div class="el-step-content transition-box" v-show="step3PanelVisible">
            <el-form :model="examAnalyForm" label-position="right" ref="examAnalyForm" label-width="100px" class="examAnalyForm">
              <span class="step-top-button" style="margin-left:100px;">
                <el-button icon="el-icon-plus" type="primary" size="small" plain
                  @click.native="onExamSelect" 
                  style="vertical-align: middle;">考试（可多选）
                </el-button>
              </span>
              <el-form-item>
                <transition name="el-zoom-in-center">
                  <div v-show="examHisVisible" class="transition-box">
                    <el-radio-group v-model="examAnalyForm.EXAM_HIS" size="small"
                        @change="onSemesterChange">
                      <el-radio label="0" border>当前学期</el-radio>
                      <el-radio label="1" border>历史学期</el-radio>
                    </el-radio-group>
                  </div>
                </transition>
              </el-form-item>
              <el-form-item>
                <transition name="el-zoom-in-center">
                  <div v-show="examGroupVisible" class="transition-box">
                    <el-checkbox-group v-model="examAnalyForm.EXAM_ARR" size="small">
                      <el-checkbox v-for="item in examGroup"
                          :key="item.itemKey" :label="item.itemKey" border>{{item.itemValue}}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </transition>
              </el-form-item>
              <el-form-item>
                <transition name="el-zoom-in-center">
                  <el-button icon="el-icon-success" type="success" size="mini"
                      v-show="publish && examAnalyForm.EXAM_ARR.length > 0"
                      @click.native="handlePublish"
                      v-loading.fullscreen.lock="dataLoading"
                      element-loading-text="数据分析中......"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(255, 255, 255, 0.8)"
                      style="margin-top:10px;">开始分析
                  </el-button>
                </transition>
              </el-form-item>
            </el-form>
          </div>
        </transition>
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <app-search v-show="scoreTableVisible">
        <app-title title="成绩表单信息"
          style="border-left:4px solid #52bab5;padding-left: 15px;">
        </app-title>
        <!--表单-->
        <el-form :inline="true" :model="examAnalyForm" class="form-inline">
          <el-form-item label="">
            <el-select v-model="examAnalyForm.classId" size="small" placeholder="--考试班级--">
              <el-option
                v-for="option in classOptions"
                :key="option.itemKey"
                :label="option.itemValue"
                :value="option.itemKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchTableInfo">查询</el-button>
          </el-form-item>
        </el-form>
      </app-search>
    </transition>
    <transition name="el-zoom-in-center">
      <el-card shadow="hover" v-show="scoreTableVisible" 
        body-style="padding:0px;padding-bottom:10px;">
        <!--表格-->
        <el-table
          class="scoreTable"
          :data="scoreTableData.data"
          max-height="340"
          border
          stripe
          fit
          highlight-current-row
          style="width: 100%">
            <el-table-column
              prop="GRADE_NAME"
              label="年级"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="CLASS_NAME"
              label="班级"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="STUDENT_ID"
              label="学号"
              align="center"
              width="80">
            </el-table-column>
            <el-table-column
              prop="STUDENT_NAME"
              label="学生姓名"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column 
              v-for="(item,index) in scoreTableData.head" 
              :label="item.first_label"
              :key="index"
              show-overflow-tooltip
              align="center">
                <el-table-column
                  v-for="(subItem,subIndex) in item.subHead" 
                  :prop="subItem.key"
                  :label="subItem.label"
                  :key="subIndex"
                  show-overflow-tooltip 
                  align="center"
                  sortable>
              </el-table-column>
            </el-table-column>
            <el-table-column
              prop="EXAM_ALL"
              label="合计"
              align="center"
              sortable
              width="80">
            </el-table-column>
            <el-table-column
              prop="XH_ALL"
              label="总排名"
              align="center"
              sortable
              width="80">
            </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="examAnalyForm.pageNum"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="examAnalyForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
    </transition>
    <transition name="el-zoom-in-center">
      <app-search v-show="scoreBarVisible && scorePieVisible" style="margin-top:10px;">
        <app-title title="分布图"
          style="border-left:4px solid #52bab5;padding-left: 15px;">
        </app-title>
        <!--表单-->
        <el-form :inline="true" :model="examAnalyForm" class="form-inline">
          <el-form-item label="">
            <el-select v-model="examAnalyForm.examId" size="small" placeholder="--考试科目--">
              <el-option
                v-for="option in examOptions"
                :key="option.itemKey"
                :label="option.itemValue"
                :value="option.itemKey">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" size="small" @click="searchChartInfo">查询</el-button>
          </el-form-item>
        </el-form>
      </app-search>
    </transition>
    <transition name="el-zoom-in-center">
      <!-- :gutter属性来调整布局之间的宽度 -->
      <el-row :gutter="32">
        <el-col :span="12">
          <!-- 柱状图（分数段分布情况） -->
          <div class="line-container" v-if="scoreBarVisible">
            <el-card shadow="hover"
              body-style="padding:0px;padding-bottom:10px;">
              <bar-chart :chart-data="scoreBarChartData"></bar-chart>
            </el-card>
          </div>
        </el-col>
        <el-col :span="12">
          <!-- 饼图（优良差分布情况） -->
          <div class="line-container" v-if="scorePieVisible">
            <el-card shadow="hover"
              body-style="padding:0px;padding-bottom:10px;">
              <pie-chart :chart-data="scorePieChartData"></pie-chart>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </transition>
  </section>
</template>

<script>
import BarChart from './charts/barChart'
import PieChart from './charts/pieChart'

export default {
  components: {
    BarChart,
    PieChart
  },
  data () {
    //不使用return包裹的数据会在项目的全局可见，会造成变量污染
    //使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件
    return {
      stageGradeOptions: [],               //所有阶段的年级分类整合后数据
      gradeGroup: [],                      //单个阶段的年级
      classGroup: [],                      //班级数据
      examGroup: [],                       //考试数据
      classOptions: [],                    //数据查询参数下拉框
      examOptions: [],                     //数据查询参数下拉框
      step: 1,
      preStep: false,
      nextStep: true,
      publish: false,
      analyParamsInfoVisible: false,       //点击分析按钮后显示的选择参数信息面板是否显示
      stepVisible: true,                   //步骤条是否显示
      analyFormVisible: true,              //分析的参数表单是否显示
      stepCardTitle: '选择年级',            //每一步的文字提示
      step1PanelVisible: true,             //第一步面板是否显示
      stageGradeVisible: false,            //年级对应阶段单选组是否显示
      gradeGroupVisible: false,            //年级单选组是否显示
      step2PanelVisible: false,            //第二步面板是否显示
      classGroupVisible: false,            //班级复选组是否显示
      step3PanelVisible: false,            //第三步面板是否显示
      examHisVisible: false,               //考试是否历史现实
      examGroupVisible: false,             //考试复选组是否显示
      scoreTableVisible: false,            //分数表格是否显示
      scoreBarVisible: false,
      scorePieVisible: false,
      examAnalyForm: {
        STAGE_ID: '',
        GRADE_ID: null,
        EXAM_CLASS_ARR: [],
        EXAM_HIS: null,
        EXAM_ARR: [],
        classId: null,                     //单独查询表格数据的参数
        examId: null,                      //单独查询表格数据的参数
        pageNum: 1,
        pageSize: 10
      },
      dataLoading: false,
      scoreTableData: {
        head: [],
        data: []
      },
      scoreBarChartData: {
        xAxisData: ['[0,20)', '[20,40)', '[40,60)', '[60,80)', '[80,100]'],
        data: [] 
      },
      scorePieChartData: {
        legend: ['优[100,90]', '良(90,80]', '一般(80,60]', '差(60,0]'],
        data: []
      },
      total: 0,
      table_index: 999,
    };
  },
  mounted() {
    var p = JSON.parse(JSON.stringify({isAll:'0'}));
    this.$axios.post('/analyAction.do?method=initAnalyMag',p).then((response) => {
    if(response != null){
        this.stageGradeOptions = response.gradeOptions;
      }
    });
  },
  methods: {
    editAnalyParams: function(){
      this.classOptions = [];
      this.examOptions = [];
      this.analyParamsInfoVisible = false;
      this.scoreTableVisible = false;
      this.scoreBarVisible = false;
      this.scorePieVisible = false;
      setTimeout(()=>{this.stepVisible = true},500);
      setTimeout(()=>{this.analyFormVisible = true},500);
      this.stepCardTitle = '选择年级';
    },
    searchTableInfo: function(){
      var p = JSON.parse(JSON.stringify(this.examAnalyForm));
      this.$axios.post('/analyAction.do?method=queryScoreRankTableData',p).then((response) => {
        if(response != null){
          this.scoreTableData.data = response.scoreDataList;
          this.scoreTableData.head = response.head;            
          setTimeout(()=>{this.scoreTableVisible = true},500);
          setTimeout(()=>{this.dataLoading = false},1000);
        }
      }).catch(() => {
        this.dataLoading = false;
        this.$message({
          showClose: true,
          type: 'info',
          message: '查询数据失败！'
        });          
      });
    },
    searchChartInfo: function(){
      var p = JSON.parse(JSON.stringify(this.examAnalyForm));
      this.$axios.post('/analyAction.do?method=qryScoreChartData',p).then((response) => {
        if(response != null){
          this.scoreBarChartData.data = response.barDataList;
          this.scorePieChartData.data = response.pieDataList;
          setTimeout(()=>{this.scoreBarVisible = true},500);
          setTimeout(()=>{this.scorePieVisible = true},1000);
          setTimeout(()=>{this.dataLoading = false},1000);
        }
      }).catch(() => {
        this.dataLoading = false;
        this.$message({
          showClose: true,
          type: 'info',
          message: '查询数据失败！'
        });          
      });
    },
    //第一步面板点击年级按钮
    onGradeSelect: function(){
      var _this = this;
      this.stageGradeVisible = !_this.stageGradeVisible;
      this.gradeGroupVisible = !_this.gradeGroupVisible;
    },
    //第一步面板选择阶段
    onStageGradeChange: function(val){
      var _this = this;
      this.examAnalyForm.GRADE_ID = null;     //年级选项初始化
      this.initStep2Panel();
      this.initStep3Panel();
      for(var i = 0; i < _this.stageGradeOptions.length; i++){
        if(_this.stageGradeOptions[i].key == val){
          this.gradeGroup = _this.stageGradeOptions[i].options;
          break;
        }
      }
      this.gradeGroupVisible = true;
    },
    //第一步面板选择年级
    onGradeChange: function(){
      this.initStep2Panel();
      this.initStep3Panel();
    },
    //第二步面板选择班级
    onClassChange: function(){
      this.initStep3Panel();
    },
    //第三步面板点击考试按钮
    onExamSelect: function(){
      var _this = this;
      this.examHisVisible = !_this.examHisVisible;
      this.examGroupVisible = !_this.examGroupVisible;
    },
    //第三步面板选择学期类型
    onSemesterChange: function(){
      this.examAnalyForm.EXAM_ARR = [];
      //加载考试
      var p = JSON.parse(JSON.stringify(this.examAnalyForm));
      this.$axios.post('/analyAction.do?method=qryExamByClass',p).then((response) => {
        if(response != null){
          this.examGroup = response.examGroup;
          setTimeout(()=>{this.examGroupVisible = true},500);
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '初始化信息失败！'
        });          
      });
    },
    handlePublish: function(){
      if(this.examAnalyForm.EXAM_ARR.length == 0){
        this.$message({
          showClose: true,
          message: '请先选择考试！',
          type: 'warning'
        });
      } else {
        this.dataLoading = true;
        var _this = this;
        this.classOptions.push({
          itemKey: '',
          itemValue: '全部'
        });
        //表格班级下拉框
        for(var i = 0; i < _this.examAnalyForm.EXAM_CLASS_ARR.length; i++){
          for(var j = 0; j < _this.classGroup.length; j++){
            if( _this.examAnalyForm.EXAM_CLASS_ARR[i] == _this.classGroup[j].itemKey){
              this.classOptions.push({
                itemKey: _this.examAnalyForm.EXAM_CLASS_ARR[i],
                itemValue: _this.classGroup[j].itemValue
              });
              break;
            }
          }
        }
        //图表考试科目下拉框
        for(var i = 0; i < _this.examAnalyForm.EXAM_ARR.length; i++){
          for(var j = 0; j < _this.examGroup.length; j++){
            if( _this.examAnalyForm.EXAM_ARR[i] == _this.examGroup[j].itemKey){
              this.examOptions.push({
                itemKey: _this.examAnalyForm.EXAM_ARR[i],
                itemValue: _this.examGroup[j].itemValue
              });
              break;
            }
          }
        }
        //默认第一个考试科目
        this.examAnalyForm.examId = this.examOptions[0].itemKey;
        var p = JSON.parse(JSON.stringify(this.examAnalyForm));
        this.$axios.post('/analyAction.do?method=initAnalyExamInfo',p).then((response) => {
          if(response != null){
            this.scoreTableData.data = response.scoreDataList;
            this.scoreTableData.head = response.head;
            this.scoreBarChartData.data = response.barDataList;
            this.scorePieChartData.data = response.pieDataList;
            setTimeout(()=>{
              this.dataLoading = false
              this.stepVisible = false
              this.analyFormVisible = false
            },1000);
            setTimeout(()=>{
              this.stepCardTitle = '分析参数信息'
              this.analyParamsInfoVisible = true
            },1300);
            setTimeout(()=>{this.scoreTableVisible = true},1600);
            setTimeout(()=>{this.scoreBarVisible = true},2000);
            setTimeout(()=>{this.scorePieVisible = true},2300);
          }
        }).catch(() => {
          this.dataLoading = false;
          this.$message({
            showClose: true,
            type: 'info',
            message: '分析加载数据失败！'
          });          
        });
      }
    },
    handlePreStep: function(val){
      var _this = this;
      if(val == 2){
        this.step2PanelVisible = false;
        this.step3PanelVisible = false;
        setTimeout(()=>{
          this.stepCardTitle = '选择年级'
          this.step1PanelVisible = true
        },500);
      }
      if(val == 3){
        this.step1PanelVisible = false;
        this.step3PanelVisible = false;
        setTimeout(()=>{
          this.stepCardTitle = '选择班级'
          this.step2PanelVisible = true
        },500);
      }
      setTimeout(function () {
        _this.step--;
        _this.goStep(_this.step);
      })
    },
    handleNextStep: function(val){
      let flag = true;
      var _this = this;
      if(val == 1){
        if(this.examAnalyForm.GRADE_ID == null){
          flag = false;
          this.$message({
            showClose: true,
            message: '请先选择年级！',
            type: 'warning'
          });
        } else {
          //加载对应班级
          var p = JSON.parse(JSON.stringify(this.examAnalyForm));
          this.$axios.post('/analyAction.do?method=qryClassByGrade',p).then((response) => {
            if(response != null){
              this.classGroup = response.classGroup;
              this.step1PanelVisible = false;
              this.step3PanelVisible = false;
              setTimeout(()=>{
                this.stepCardTitle = '选择班级'
                this.step2PanelVisible = true},500);
            }
          }).catch(() => {
            this.$message({
              showClose: true,
              type: 'info',
              message: '初始化信息失败！'
            });          
          });
        }
      }
      if(val == 2){
        if(this.examAnalyForm.EXAM_CLASS_ARR.length == 0){
          flag = false;
          this.$message({
            showClose: true,
            message: '请先选择班级！',
            type: 'warning'
          });
        } else {
          this.step1PanelVisible = false;
          this.step2PanelVisible = false;
          setTimeout(()=>{
            this.stepCardTitle = '选择考试'
            this.step3PanelVisible = true
          },500);
        }
      }
      if(flag){
        setTimeout(function () {
          _this.step++;
          _this.goStep(_this.step);
        })
      }
    },
    goStep: function (n) {
      switch (n) {
        case 1 :
          this.preStep = false; this.nextStep = true; this.publish = false;
          break;
        case 2 :
          this.preStep = true; this.nextStep = true; this.publish = false;
          break;
        case 3 :
          this.preStep = true; this.nextStep = false; this.publish = true;
          break;
      }
    },
    initStep1Panel(){
      this.examAnalyForm.STAGE_ID = '';
      this.examAnalyForm.GRADE_ID = null;
      this.stageGradeVisible = false;
      this.gradeGroupVisible = false;
    },
    initStep2Panel(){
      this.examAnalyForm.EXAM_CLASS_ARR = []      
      this.classGroupVisible = false;
    },
    initStep3Panel(){
      this.examAnalyForm.EXAM_ARR = [];
      this.examAnalyForm.EXAM_HIS = null;
      this.examGroup = [];
      this.examHisVisible = false;
      this.examGroupVisible = false;
    },
    sizeChange(val) {
      this.examAnalyForm.pageSize = val;
      this.searchTableInfo();
    },
    currentChange(val) {
      this.examAnalyForm.pageNum = val;
      this.searchTableInfo();
    }
  }
};
</script>
<style>
  /* 分析参数信息显示面板 */
  .analyList .grid-content{
    padding: 10px 15px 5px;
  }
  /* 表单中标签间隔调整 */
  .analyList .grid-content .el-tag{
    margin-right: 8px;
    vertical-align: middle;
    height: auto;
  }
  .analyList .grid-content .el-tag:first-child{
    margin-left: 0;
  }
  /* 自定义步骤条标题信息信息 */
  .analyList .el-step-hearder{
    margin:15px 0px 0px 60px;
    border-bottom: 1px solid #A2B0C4;
    /*border-left:4px solid #47B2FB;*/
    padding-bottom: 5px;
    font-size: 14px;
    font-weight: 500;
    color: #577c97;
  }
  .analyList .el-step-hearder:before{
    content: "";
    height: 3px;
    width: 40px;
    background-color: #47B2FB;
    position: relative;
    z-index: 1000;
    top: 26px;
    left: -3px;
    display: block;
  }
  .analyList .el-step-content{
    margin-left:60px;
    margin-top:20px;
  }
  .analyList .examAnalyForm .el-form-item{
    height: 40px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
</style>
