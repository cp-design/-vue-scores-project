<template>
  <section class="classList sys-page">
    <app-search>
      <!--表单-->
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="">
          <el-input v-model="params.className" size="small" prefix-icon="el-icon-search"
            placeholder="班级名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="params.gradeId" size="small" filterable placeholder="--选择年级--">
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
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchInfo">查询
          </el-button>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addClass">新增
          </el-button>
        </el-form-item>
      </el-form>
    </app-search>
    <el-card shadow="hover" body-style="padding:0px;padding-bottom:10px;">
      <!--表格-->
      <el-table
        class="classTable"
        :data="classTableData"
        max-height="340"
        border
        stripe
        @current-change="classSelectChange"
        highlight-current-row
        v-loading="dataLoading"
        element-loading-text="数据加载中，请稍后！"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%">
        <el-table-column
          prop="CLASS_ID"
          label="班级标识"
          fixed="left"
          sortable
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="CLASS_NAME"
          label="班级名称"
          fixed="left"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="STUDENT_NUM"
          label="学生人数"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-tag :type="studentLimitWarn(scope.row.STUDENT_NUM,scope.row.UPPER_LIMIT)" disable-transitions>{{scope.row.STUDENT_NUM}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="UPPER_LIMIT"
          label="人数上限"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="GRADE_NAME"
          label="归属年级"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="TEACHER_NAME"
          label="班主任"
          align="center"
          width="150">
        </el-table-column>
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
        <el-table-column
          prop="COMMENT"
          label="备注"
          show-overflow-tooltip
          header-align="center"
          align="left"
          width="300">
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="290">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="warning" plain size="mini" 
                @click="specifyTeacher(scope.$index, scope.row)">{{scope.row.TEACHER_ID == undefined ? '指定班主任' : '变更班主任'}}</el-button>
              <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="editClass(scope.$index, scope.row)">变更</el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="deleteClass(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="" width="50%" :visible.sync="classDialogVisible">
      <app-title title="新增班级" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <el-form :model="classDealForm" status-icon :rules="rules" label-position="right" ref="classDealForm" label-width="100px" class="classDealForm" style="width:500px;margin-left:10%;">
        <el-form-item label="班级名称" prop="CLASS_NAME">
          <el-input v-model="classDealForm.CLASS_NAME" size="small" style="width:55%" placeholder="班级名称"></el-input>
        </el-form-item>
        <el-form-item label="所属年级" prop="GRADE_ID">
          <el-select v-model="classDealForm.GRADE_ID" size="small" style="width:55%" filterable placeholder="--选择年级--">
            <el-option-group
              v-for="group in gradeList"
              v-if="group.label == '其他' ? false : true"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                v-if="item.itemValue == '全部' ? false : true"
                :key="item.itemKey"
                :label="item.itemValue"
                :value="item.itemKey">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="人数上限" prop="UPPER_LIMIT">
          <el-input-number v-model="classDealForm.UPPER_LIMIT" size="small" :min="10" :max="50" style="width:55%"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="STATUS" required>
          <el-radio-group v-model="classDealForm.STATUS" size="small">
            <el-radio-button label="10A">有效</el-radio-button>
            <el-radio-button label="10X">失效</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" class="formArea" prop="COMMENT">
          <el-input type="textarea" v-model="classDealForm.COMMENT" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="dealClassSure()">确定</el-button>
        <el-button size="small" @click.native="classDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 指定班主任弹出框 -->
    <el-dialog title="" width="50%" :visible.sync="teacherDialogVisible">
      <app-title title="选择班主任" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <!--查询表单-->
        <el-form :inline="true" :model="teacherParams" class="teacherForm">
          <el-form-item>
            <el-input v-model="teacherParams.teacherName" size="small" placeholder="教师姓名"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" class='qryBtn' icon="search" size="small" 
              @click="qrySpecifyTeacher">查询
            </el-button>
          </el-form-item>
        </el-form>
      <!-- 数据列表 -->
      <el-table 
        class="teacherTable"
        :data="teacherTableData"
        @current-change="teacherSelectChange"
        height="200"
        max-height="200"
        border
        highlight-current-row
        v-loading="teacherDataLoading"
        element-loading-text="数据加载中，请稍后！"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        >
        <el-table-column prop="TEACHER_ID" label="教师工号" align="center">
        </el-table-column>
        <el-table-column prop="TEACHER_NAME" label="教师姓名" align="center">
        </el-table-column>
        <el-table-column prop="COURSE_NAME" label="教授课程" align="center"></el-table-column>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="teacherTableSizeChange"
          @current-change="teacherTableCurrentChange"
          :current-page="teacherParams.pageNum"
          :page-sizes="[10, 30, 50, 100, 300, 500]"
          :page-size="teacherParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="teacherTotal">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="teacherSure()">确定</el-button>
        <el-button size="small" @click.native="teacherDialogVisible = false">取消</el-button>
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
      classDialogVisible: false,
      teacherDialogVisible: false,
      initClassDealForm:{},
      classDealForm: {
        CLASS_ID: null,
        CLASS_NAME: '',
        GRADE_ID: null,
        UPPER_LIMIT: 10,
        STATUS: '10A',
        COMMENT: ''
      },
      specifyTeacherForm: {
        teacherId: null,
        classId: null
      },
      rules: {
        CLASS_NAME: [
          { required: true, message: '请填写班级名称', trigger: 'blur' }
        ],
        GRADE_ID: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ]
      },
      teacherParams: {
        teacherName: '',
        classId: null,
        pageNum: 1,
        pageSize: 10
      },
      params: {
        className: '',
        gradeId: null,
        pageNum: 1,
        pageSize: 10
      },
      classCurSelectIndex: -1,
      classTableData: [],
      teacherTableData: [],
      teacherCurSelect: [],
      dataLoading: true,
      teacherDataLoading: false,
      total: 0,
      teacherTotal: 0,
      table_index: 999,
    };
  },
  mounted() {
    //深拷贝
    this.initClassDealForm = JSON.parse(JSON.stringify(this.classDealForm));
    var p = JSON.parse(JSON.stringify({isAll:'1'}));
    this.$axios.post('/classAction.do?method=getGradeList',p).then((response) => {
      if(response != null){
        this.gradeList = response.gradeList;
      }
      //默认选择第一个
      //this.params.gradeId = response.gradeList[0].options[0].itemKey;
      this.searchInfo();
    });
  },
  methods: {
    //表单数据规范检查
    validationForm() {
      let flag = true;
      this.$refs.classDealForm.validate((valid) => {
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
    searchInfo(){
      this.dataLoading = true;
      var p = JSON.parse(JSON.stringify(this.params));
      this.$axios.post('/classAction.do?method=queryClassList', p).then((response) => {
        if(response != null){
          this.total = response.total;
          this.classTableData = response.rows;
          console.log(this.classTableData);
        }
        this.dataLoading = false;
      });
    },
    studentLimitWarn(val,limitNum){
      var result = (val / limitNum) * 100;
      if(result > 80){
        return 'danger';
      } else if(result > 60){
        return 'warning';
      } else {
        return 'success';
      }
    },
    //点击新增按钮时
    addClass(){
      this.classDealForm = JSON.parse(JSON.stringify(this.initClassDealForm));
      //DOM加载的顺序需要这样写
      this.$nextTick(() => {
        if (this.$refs.classDealForm !== undefined) {
          //这种重置的方式貌似先编辑后新增会有问题,被记录了
          //this.$refs.classDealForm.resetFields();
          //重置验证
          this.$refs.classDealForm.clearValidate();
        }
      });
      this.classDialogVisible = true;
    },
    //点击编辑按钮时
    editClass (index, row) {
      this.classDialogVisible = true;
      //因为表单不多，所以直接赋值了
      this.classDealForm.CLASS_ID = row.CLASS_ID;
      this.classDealForm.CLASS_NAME = row.CLASS_NAME;
      this.classDealForm.GRADE_ID = row.GRADE_ID;
      this.classDealForm.UPPER_LIMIT = row.UPPER_LIMIT;
      this.classDealForm.STATUS = row.STATUS;
      this.classDealForm.COMMENT = row.COMMENT;
    },
    deleteClass (index, row) {
      //验证
      if(row.STUDENT_NUM > 0){
        this.$message({
          showClose: true,
          message: '该班级下存在学生，请移走后再操作！',
          type: 'error'
        });
      } else {
        this.$confirm('将同时删除任课老师与班级的关系，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var p = JSON.parse(JSON.stringify({'CLASS_ID':row.CLASS_ID}));
          this.$axios.post('/classAction.do?method=deleteClass', p).then((response) => {
            if(response.status == "deleteSuccess"){
              this.classTableData.splice(index, 1);
              this.$message({
                message: "删除操作成功！",
                type: 'success'
              });
            } else {
              this.$message({
                showClose: true,
                message: '删除班级出错！',
                type: 'error'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          });          
        });
      }
    },
    //新增班级确认
    dealClassSure(){
      if(this.validationForm()){
        var p = JSON.parse(JSON.stringify(this.classDealForm));
        this.$axios.post('/classAction.do?method=dealClass', p).then((response) => {
          if(response.status == "addSuccess"){
            this.$message({
              showClose: true,
              message: '班级添加成功！',
              type: 'success'
            });
            this.classDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else if(response.status == "editSuccess"){
            this.$message({
              showClose: true,
              message: '班级编辑成功！',
              type: 'success'
            });
            this.classDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else {
            this.$message({
              showClose: true,
              message: '操作班级信息出错！',
              type: 'error'
            });
          }
        });
      }
    },
    //班级表格选中行时操作
    classSelectChange(val){
      this.classCurSelectIndex = this.classTableData.indexOf(val);
    },
    //指定班主任操作
    specifyTeacher(index, row){
      this.teacherDialogVisible = true;
      this.specifyTeacherForm.classId = row.CLASS_ID; //设定班主任form的班级ID
      this.teacherParams.classId = row.CLASS_ID; //设定查询班主任的参数班级ID
      this.qrySpecifyTeacher();
    },
    //查询班主任
    qrySpecifyTeacher(){
      this.teacherDataLoading = true;
      var p = JSON.parse(JSON.stringify(this.teacherParams));
      this.$axios.post('/classAction.do?method=queryDirectorTeacherList', p).then((response) => {
        if(response != null){
          this.teacherTotal = response.total;
          this.teacherTableData = response.rows;
          this.teacherDataLoading = false;
        }
      });
    },
    //教师表格选中的记录信息
    teacherSelectChange(val){
      this.teacherCurSelect = [];
      Object.assign(this.teacherCurSelect,val); //浅拷贝
    },
    //确定选择班主任
    teacherSure(){
      var teacherId = this.teacherCurSelect.TEACHER_ID;
      var teacherName = this.teacherCurSelect.TEACHER_NAME;
      if(typeof(teacherId) == "undefined"){
        this.$message({
          message: '请选择班主任教师！',
          type: 'warning'
        });
      } else {
        this.specifyTeacherForm.teacherId = teacherId; //设定班主任form的老师编码
        var p = JSON.parse(JSON.stringify(this.specifyTeacherForm));
        this.$axios.post('/classAction.do?method=updateClassDirectorTeacher', p).then((response) => {
          if(response.status == "1"){
            this.$message({
              showClose: true,
              message: '班主任指定成功！',
              type: 'success'
            });
            //更改数据列表中的数据时，因数据层次太多，没有触发render函数进行自动更新，需手动调用
            this.$forceUpdate();
            //根据班级选择的行(index)在数据列表中查找出来并设置值
            this.$set(this.classTableData[this.classCurSelectIndex],"TEACHER_ID",teacherId);
            this.$set(this.classTableData[this.classCurSelectIndex],"TEACHER_NAME",teacherName);
            this.teacherDialogVisible = false; 
          } else {
            this.$message({
              showClose: true,
              message: '班主任指定失败！',
              type: 'error'
            });
          }
        });
      }
    },
    teacherTableSizeChange(val) {
      this.params.pageSize = val;
      this.searchInfo();
    },
    teacherTableCurrentChange(val) {
      this.params.pageNum = val;
      this.searchInfo();
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
  .classList .el-table--border th, .el-table--border td{
    border-right:1px solid #dfe6ec;
  }
  /* 操作表单列表各项下距离缩短 */
  .classList .classDealForm .el-form-item{
    margin-bottom: 10px;
  }
  /* 操作表单列表文本域上距离缩短 */
  .classList .classDealForm .formArea{
    margin-top: 16px;
  }
  /* 表单中错误信息显示上距离缩短 */
  .classList .el-form-item__error{
    padding-top: 0px;
  }
  /* 操作表单列表各项下距离缩短 */
  .classList .teacherForm .el-form-item{
    margin-bottom: 10px;
  }
  /* 弹出框表格主下方距离缩短 */
  .classList .el-dialog__body{
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
