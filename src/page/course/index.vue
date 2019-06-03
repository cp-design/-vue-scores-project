<template>
  <section class="courseList sys-page">
    <app-search>
      <!--表单-->
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="">
          <el-input v-model="params.courseName" size="small" prefix-icon="el-icon-search"
            placeholder="课程名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="params.gradeId" size="small" placeholder="--选择年级--">
            <el-option-group
              v-for="group in gradeList"
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
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchInfo">查询</el-button>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="dealCourse">新增</el-button>
        </el-form-item>
      </el-form>
    </app-search>
    <el-card shadow="hover" body-style="padding:0px;padding-bottom:10px;">
      <!--表格-->
      <el-table
        class="courseTable"
        :data="courseTableData"
        max-height="340"
        border
        stripe
        highlight-current-row
        v-loading="dataLoading"
        element-loading-text="数据加载中，请稍后！"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%">
        <el-table-column
          prop="COURSE_ID"
          label="课程编号"
          fixed="left"
          sortable
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="COURSE_NAME"
          label="课程名称"
          fixed="left"
          align="center"
          width="170">
        </el-table-column>
        <el-table-column
          prop="SHARE_LEVEL_NAME"
          label="共享级别"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag type="success" disable-transitions>{{scope.row.SHARE_LEVEL_NAME}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="IS_HAS_TEACHER_DESC"
          label="是否有教师教授"
          align="center"
          width="140">
          <template slot-scope="scope">
            <el-tag :type="scope.row.IS_HAS_TEACHER === '1' ? 'success' : 'warning'" disable-transitions>{{scope.row.IS_HAS_TEACHER_DESC}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="COURSE_DESC"
          label="课程描述"
          header-align="center"
          align="left"
          show-overflow-tooltip
          width="330">
        </el-table-column>
        <!--
        <el-table-column
          prop="COURSE_ORDER"
          label="显示顺序"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-tag type="success" disable-transitions>{{scope.row.COURSE_ORDER}}
            </el-tag>
          </template>
        </el-table-column>
        -->
        <el-table-column
          prop="STATUS_NAME"
          label="状态"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.STATUS === '10A' ? 'success' : 'warning'" disable-transitions>{{scope.row.STATUS_NAME}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="180">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="dealCourse(scope.$index, scope.row)">变更</el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="deleteCourse(scope.$index, scope.row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="params.pageNum"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- ADD/EDIT -->
    <el-dialog title="" width="50%" :visible.sync="courseDialogVisible">
      <app-title title="新增课程" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <el-form :model="courseDealForm" status-icon :rules="rules" label-position="right" ref="courseDealForm" label-width="100px" class="courseDealForm" style="width:500px;margin-left:10%;">
        <el-form-item label="课程名称" prop="COURSE_NAME">
          <el-input v-model="courseDealForm.COURSE_NAME" size="small" style="width:54%" placeholder="课程名称"></el-input>
        </el-form-item>
        <el-form-item label="共享级别" required prop="SHARE_LEVEL">
          <el-select v-model="courseDealForm.SHARE_LEVEL" size="small" placeholder="---请选择---">
            <el-option
              v-for="option in shareLevelList"
              :key="option.itemKey"
              :label="option.itemValue"
              :value="option.itemKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展现顺序" prop="COURSE_ORDER" required>
          <el-input-number v-model.number="courseDealForm.COURSE_ORDER" size="small"
            :min="1" :max="10000"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="STATUS" required>
          <el-radio-group v-model="courseDealForm.STATUS" size="small">
            <el-radio-button label="10A">有效</el-radio-button>
            <el-radio-button label="10X">失效</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程描述" class="formArea" prop="COURSE_DESC">
          <el-input type="textarea" v-model="courseDealForm.COURSE_DESC" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="dealCourseSure()">确定</el-button>
        <el-button size="small" @click.native="courseDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data () {
    //不使用return包裹的数据会在项目的全局可见，会造成变量污染
    //使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件
    return {
      gradeList: [],
      shareLevelList: [],
      courseDialogVisible: false,   //新增或编辑课程的dialog
      initCourseDealForm:{},        //初始化的新增或编辑表单
      courseDealForm: {             //新增或编辑表单
        COURSE_ID: null,
        COURSE_NAME: '',
        SHARE_LEVEL: '',
        COURSE_ORDER: null,
        STATUS: '10A',
        COURSE_DESC: ''
      },
      rules: {
        COURSE_NAME: [
          { required: true, message: '请填写课程名称', trigger: 'blur' }
        ],
        SHARE_LEVEL: [
          { required: true, message: '请选择共享级别', trigger: 'change' }
        ]
      },
      params: {
        courseName: '',
        gradeId: null,
        pageNum: 1,
        pageSize: 10
      },
      courseTableData: [],
      dataLoading: true,
      total: 0,
      table_index: 999,
    };
  },
  mounted() {
    //深拷贝
    this.initCourseDealForm = JSON.parse(JSON.stringify(this.courseDealForm));
    var p = JSON.parse(JSON.stringify({isAll:'1'}));
    this.$axios.post('/courseAction.do?method=initCourseMag',p).then((response) => {
      if(response != null){
        this.gradeList = response.gradeList;
        this.shareLevelList = response.shareLevelList;
      }
    });
    this.searchInfo();
  },
  methods: {
    //表单数据规范检查
    validationForm() {
      let flag = true;
      this.$refs.courseDealForm.validate((valid) => {
        if (!valid) {
          flag = false;
          this.$message({
            showClose: true,
            message: '请先写完整的信息！',
            type: 'error'
          });
        }
      });
      return flag;
    },
    searchInfo () {
      this.dataLoading = true;
      var p = JSON.parse(JSON.stringify(this.params));
      this.$axios.post('/courseAction.do?method=queryCourseList', p).then((response) => {
        if(response != null){
          this.total = response.total;
          this.courseTableData = response.rows;
        }
        this.dataLoading = false;
      });
    },
    //点击新增或编辑按钮时
    dealCourse(index, row){
      if(row == undefined){
        //初始化表单-深拷贝
        this.courseDealForm = JSON.parse(JSON.stringify(this.initCourseDealForm));
        this.$nextTick(() => {
          if (this.$refs.courseDealForm !== undefined) {
            this.$refs.courseDealForm.clearValidate();
          }
        });
        this.courseDialogVisible = true;
      } else {
        if(row.IS_HAS_TEACHER == '1'){
          this.$notify.error({
            title: '错误',
            message: '该课程下有任课教师，请移除后再尝试！'
          });
          return;
        }
        //因为表单不多，所以直接赋值了
        this.courseDealForm.COURSE_ID = row.COURSE_ID;
        this.courseDealForm.COURSE_NAME = row.COURSE_NAME;
        this.courseDealForm.SHARE_LEVEL = row.SHARE_LEVEL;
        this.courseDealForm.COURSE_ORDER = row.COURSE_ORDER;
        this.courseDealForm.STATUS = row.STATUS;
        this.courseDealForm.COURSE_DESC = row.COURSE_DESC;
        this.courseDialogVisible = true;
      }
    },
    //新增或变更处理操作
    dealCourseSure(){
      if(this.validationForm()){
        var p = JSON.parse(JSON.stringify(this.courseDealForm));
        this.$axios.post('/courseAction.do?method=dealCourse', p).then((response) => {
          if(response.status == "addSuccess"){
            this.$message({
              showClose: true,
              message: '课程添加成功！',
              type: 'success'
            });
            this.courseDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else if(response.status == "editSuccess"){
            this.$message({
              showClose: true,
              message: '课程信息编辑成功！',
              type: 'success'
            });
            this.courseDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else {
            this.$message({
              showClose: true,
              message: '操作课程信息出错！',
              type: 'error'
            });
          }
        });
      }
    },
    //点击删除钮时
    deleteCourse (index, row) {
      if(row.IS_HAS_TEACHER == '1'){
        this.$notify.error({
          title: '错误',
          message: '该课程下有任课教师，请移除后再尝试！'
        });
        return;
      }
      this.$confirm('删除课程后将无法恢复，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var p = JSON.parse(JSON.stringify({'COURSE_ID':row.COURSE_ID}));
        this.$axios.post('/courseAction.do?method=deleteCourse', p).then((response) => {
          if(response.status == "deleteSuccess"){
            this.courseTableData.splice(index, 1);
            this.$message({
              showClose: true,
              message: "删除操作成功！",
              type: 'success'
            });
          } else {
            this.$message({
              showClose: true,
              message: '删除操作出错！',
              type: 'error'
            });
          }
        });
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除！'
        });          
      });
    },
    sizeChange(val) {
      this.params.pageSize = val;
      this.searchInfo();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchInfo();
    }
  }
};
</script>
<style>
  /* 表格斑马线 */
  .courseList .el-table--border th, .el-table--border td{
    border-right:1px solid #dfe6ec;
  }
  /* 操作表单列表各项下距离缩短 */
  .courseList .courseDealForm .el-form-item{
    margin-bottom: 10px;
  }
  /* 操作表单列表文本域上距离缩短 */
  .courseList .courseDealForm .formArea{
    margin-top: 6px;
  }
  /* 表单中错误信息显示上距离缩短 */
  .courseList .courseDealForm .el-form-item__error{
    padding-top: 0px;
  }
  /* 弹出框表格主下方距离缩短 */
  .courseList .el-dialog__body{
    padding:10px 20px;
  }
  /* 分组下拉框标题字体调大 */
  .el-select-group__title{
    font-size: 16px;
  }
  /* 分组下拉框内容字体调小 */
  .el-select-dropdown__item{
    font-size: 14px;
  }
</style>
