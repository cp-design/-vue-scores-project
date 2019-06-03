<template>
  <section class="teacherList sys-page">
    <app-search>
      <!--表单-->
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="">
          <el-input v-model="params.teacherName" size="small" prefix-icon="el-icon-search"
            placeholder="教师姓名"></el-input>
        </el-form-item>
        <el-form-item label="" style="width:150px;">
          <el-select v-model="params.roleId" size="small">
            <el-option
              v-for="nation in roleOptions"
              :key="nation.itemKey"
              :label="nation.itemValue"
              :value="nation.itemKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="params.gradeId" size="small" placeholder="--选择任教年级--" @change="qryClass">
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
          <el-select v-model="params.classId" size="small" placeholder="--选择任教班级--" :disabled="params.gradeId != undefined ? false : true">
            <el-option
              v-for="item in classList"
              :key="item.itemKey"
              :label="item.itemValue"
              :value="item.itemKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchInfo">查询
          </el-button>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="dealTeacher"           v-hasPermission="'ADD_TEACHER_LIMIT'">新增
          </el-button>
        </el-form-item>
      </el-form>
    </app-search>
    <el-card shadow="hover" body-style="padding:0px;padding-bottom:10px;">
      <!--表格-->
      <el-table
        class="teacherTable"
        :data="teacherTableData"
        :span-method="objectSpanMethod"
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
          prop="TEACHER_ID"
          label="工号"
          fixed="left"
          sortable
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="TEACHER_NAME"
          label="教师姓名"
          fixed="left"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="TEACHER_TEL"
          label="联系电话"
          align="center"
          width="130">
        </el-table-column>
        <el-table-column
          prop="GENDER_NAME"
          label="性别"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="AGE"
          label="年龄"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="NATION_NAME"
          label="民族"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="POLITICAL_STATUS_NAME"
          label="政治面貌"
          align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="ROLE_NAME"
          label="角色"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="COURSE_PATH"
          label="教授课程"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="CLASS_NAME"
          label="教授班级"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="GRADE_NAME"
          label="班级所属年级"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="CALSS_CHARGE"
          label="是否班主任"
          align="center"
          width="100">
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
        <el-table-column label="操作" fixed="right" align="center" width="260">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="warning" plain size="mini" @click="specifyClass(scope.$index, scope.row)">任教班级</el-button>
              <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="dealTeacher(scope.$index, scope.row)" v-hasPermission="'EDIT_TEACHER_LIMIT'">变更</el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="deleteTeacher(scope.$index, scope.row)" 
              v-hasPermission="'DELETE_TEACHER_LIMIT'">删除</el-button>
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
    <el-dialog title="" width="60%" :visible.sync="teacherDialogVisible">
      <app-title title="新增教师" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <el-form :model="teacherDealForm" status-icon :rules="rules" label-position="right" ref="teacherDealForm" label-width="100px" class="teacherDealForm" style="width:90%;margin-left:6%;">
        <el-row>
          <el-col :span="11">
            <el-form-item label="教师姓名" prop="TEACHER_NAME">
              <el-input v-model="teacherDealForm.TEACHER_NAME" size="small" placeholder="教师姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="联系电话" prop="TEACHER_TEL">
              <el-input v-model="teacherDealForm.TEACHER_TEL" size="small" placeholder="联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="年龄" prop="AGE" required>
              <el-input-number v-model.number="teacherDealForm.AGE" size="small" :min="15" :max="100"                 placeholder="年龄"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性别" prop="GENDER" required>
              <el-radio-group v-model="teacherDealForm.GENDER" size="small">
                <el-radio-button label="1">男</el-radio-button>
                <el-radio-button label="2">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="民族" prop="NATION">
              <el-select v-model="teacherDealForm.NATION" size="small" placeholder="---请选择---">
                <el-option
                  v-for="nation in nationOptions"
                  :key="nation.itemKey"
                  :label="nation.itemValue"
                  :value="nation.itemKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="政治面貌" prop="POLITICAL_STATUS">
              <el-select v-model="teacherDealForm.POLITICAL_STATUS" size="small" placeholder="---请选择---">
                <el-option
                  v-for="political in politicalOptions"
                  :key="political.itemKey"
                  :label="political.itemValue"
                  :value="political.itemKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="教授课程" prop="COURSE_ID" required>
              <el-cascader
                size="small"
                placeholder="可搜索"
                :options="courseOptions"
                :props="props"
                v-model="courseCurSelect"
                @change="onCourseSelect"
                :disabled="this.teacherDealForm.CLASS_ID == undefined ? false : true"
                filterable
                change-on-select
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色" prop="ROLE_ID" required>
              <el-select v-model="teacherDealForm.ROLE_ID" size="small">
                <el-option
                  v-for="nation in roleOptions"
                  :key="nation.itemKey"
                  :label="nation.itemValue"
                  :value="nation.itemKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态" prop="STATUS" required>
              <el-radio-group v-model="teacherDealForm.STATUS" size="small">
                <el-radio-button label="10A">有效</el-radio-button>
                <el-radio-button label="10X">失效</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" class="formArea" prop="COMMENT">
              <el-input type="textarea" v-model="teacherDealForm.COMMENT" :rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="dealTeacherSure()">确定</el-button>
        <el-button size="small" @click.native="teacherDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 设定班级 -->
    <el-dialog title="" width="50%" :visible.sync="classDialogVisible">
      <app-title title="设定班级" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <el-form :model="specifyClassForm" class="specifyClassForm" status-icon>
        <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入关键字"
            v-model="specifyClassForm.teachClass"
            :props="{
              key: 'itemKey',
              label: 'itemValue',
              disabled: 'itemDisabled'
            }"
            :data="specifyClassData"
            :titles="['待选班级', '任教班级']"
            :button-texts="['删除', '设定']"
            >
        </el-transfer>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="specifyClassSure()">确定</el-button>
        <el-button size="small" @click.native="classDialogVisible = false">取消</el-button>
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
      classList: [],
      spanArr:[],
      nationOptions: [],             //民族下拉框option
      politicalOptions: [],          //政治面貌下拉框option
      courseOptions: [],             //课程下拉框option
      roleOptions: [],               //角色下拉框option
      teacherDialogVisible: false,   //新增或编辑教师的dialog
      classDialogVisible: false,     //设定班级的dialog
      initTeacherDealForm:{},        //初始化的新增或编辑表单
      teacherDealForm: {             //新增或编辑表单
        CLASS_ID: null,              //用来做更改教授课程是否能修改判断的
        TEACHER_ID: null,
        TEACHER_NAME: '',
        TEACHER_TEL: '',
        GENDER: '1',
        AGE: null,
        NATION: '',
        POLITICAL_STATUS: '',
        COURSE_ID: null,
        COURSE_LEVEL: '',
        ROLE_ID: 'R05',
        STATUS: '10A',
        COMMENT: ''
      },
      specifyClassForm: {             //指定课程的表单
        teacherId: null,
        teachClass: []
      },
      rules: {
        TEACHER_NAME: [
          { required: true, message: '请填写教师姓名', trigger: 'blur' }
        ],
        TEACHER_TEL: [
          { required: true, message: '请填写联系电话', trigger: 'blur' }
        ],
        NATION: [
          { required: true, message: '请选择民族', trigger: 'change' }
        ],
        POLITICAL_STATUS: [
          { required: true, message: '请选择政治面貌', trigger: 'change' }
        ],
        COURSE_ID: [
          { required: true, message: '请选择教授的课程', trigger: 'change' }
        ]
      },
      props: {                         //级联菜单的字段映射
        value: 'itemKey',
        label: 'itemValue'
      },
      params: {                        //教师查询参数
        teacherName: '',
        gradeId: null,
        classId: null,
        roleId: 'R05',
        pageNum: 1,
        pageSize: 10
      },
      courseParams: {                  //指定课程查询参数
        courseName: '',
        gradeId: null,
        pageNum: 1,
        pageSize: 10
      },
      teacherTableData: [],              //教师表格数据
      specifyClassData: [],              //设定班级数据
      courseCurSelect: [],               //指定课程级联下拉框当前选中记录
      dataLoading: true,                 //教师表格加载图标是否显示
      total: 0,
      table_index: 999
    };
  },
  mounted() {
    //深拷贝
    this.initTeacherDealForm = JSON.parse(JSON.stringify(this.teacherDealForm));
    var p = JSON.parse(JSON.stringify({isAll:'1'}));
    this.$axios.post('/teacherAction.do?method=initTeacherMag',p).then((response) => {
      if(response != null){
        this.gradeList = response.gradeList;
        this.nationOptions = response.nationList;
        this.politicalOptions = response.politicalList;
        this.courseOptions =  response.courseList;
        this.roleOptions =  response.roleList;
      }
    }).catch(() => {
      this.$message({
        showClose: true,
        message: '初始化信息出错！',
        type: 'error'
      });        
    });
    this.searchInfo();
  },
  methods: {
    //表单数据规范检查
    validationForm() {
      let flag = true;
      this.$refs.teacherDealForm.validate((valid) => {
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
    //查询
    searchInfo () {
      this.dataLoading = true;
      var p = JSON.parse(JSON.stringify(this.params));
      this.$axios.post('/teacherAction.do?method=queryTeacherList', p).then((response) => {
        if(response != null){
          this.total = response.total;
          this.teacherTableData = response.rows;
          //根据唯一key,动态合并单元（根据与上一次的key比较，所以排序很重要）
          let contactDot = 0;
          this.spanArr = [];
          this.teacherTableData.forEach((item,index) => {
            item.index = index;
            if(index === 0){
                this.spanArr.push(1);
            }else{
                if(item.TEACHER_ID == this.teacherTableData[index - 1].TEACHER_ID){
                    this.spanArr[contactDot] +=1;
                    this.spanArr.push(0);
                }else{
                    this.spanArr.push(1);
                    contactDot = index;
                }
            }
          });
        }
        this.dataLoading = false;
      });
    },
    //点击设定班级按钮
    specifyClass(index, row){
      this.specifyClassForm.teacherId = row.TEACHER_ID;
      this.classDialogVisible = true;
      var p = JSON.parse(JSON.stringify({teacherId : row.TEACHER_ID}));
      this.$axios.post('/teacherAction.do?method=initTeachClassMag', p).then((response) => {
        if(response != null){
          this.specifyClassForm.teachClass = response.teachClass;
          this.specifyClassData = response.specifyClassData;
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '初始化信息出错！',
          type: 'error'
        });        
      });
    },
    //处理教师与班级的关系
    specifyClassSure(){
      if(this.specifyClassForm.teachClass.length > 0){
        var p = JSON.parse(JSON.stringify(this.specifyClassForm));
        this.$axios.post('/teacherAction.do?method=dealTeacherClassRela', p).then((response) => {
          if(response.status == "operSuccess"){
            this.$message({
              showClose: true,
              message: '教师与班级关系操作成功！',
              type: 'success'
            });
            this.classDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else {
            this.$message({
              showClose: true,
              message: '教师与班级关系操作出错！',
              type: 'error'
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: '还未选择任课的班级！',
          type: 'warning'
        });
      }
    },
    filterMethod(query, item) {
      return item.itemValue.indexOf(query) > -1;
    },
    //课程级联下拉框选择
    onCourseSelect: function(val){
      if(val[0] != undefined){
        this.teacherDealForm.COURSE_LEVEL = val[0];
      }
      if(val[1] != undefined){
        this.teacherDealForm.COURSE_ID = val[1];
      }
    },
    //根据年级查询班级
    qryClass: function(val) {
      var p = JSON.parse(JSON.stringify({'gradeId':val}));
      this.$axios.post('/teacherAction.do?method=getClassList',p).then((response) => {
        if(response != null){
          this.classList = response.classList;
          this.params.classId = response.classList[0].itemKey;
        }
      });
    },
    //点击新增或编辑按钮时
    dealTeacher(index, row){
      //深拷贝
      this.teacherDealForm = JSON.parse(JSON.stringify(this.initTeacherDealForm));
      this.courseCurSelect = [];
      if(row == undefined){
        this.$nextTick(() => {
          if (this.$refs.teacherDealForm !== undefined) {
            this.$refs.teacherDealForm.clearValidate();
          }
        });
        this.teacherDialogVisible = true;
      } else {
        //因为表单不多，所以直接赋值了
        this.teacherDealForm.CLASS_ID = row.CLASS_ID;
        this.teacherDealForm.TEACHER_ID = row.TEACHER_ID;
        this.teacherDealForm.TEACHER_NAME = row.TEACHER_NAME;
        this.teacherDealForm.TEACHER_TEL = row.TEACHER_TEL;
        this.teacherDealForm.GENDER = row.GENDER;
        this.teacherDealForm.AGE = row.AGE;
        this.teacherDealForm.NATION = row.NATION;
        this.teacherDealForm.POLITICAL_STATUS = row.POLITICAL_STATUS;
        this.courseCurSelect.push(row.COURSE_LEVEL);
        this.courseCurSelect.push(row.COURSE_ID);
        this.teacherDealForm.COURSE_LEVEL = row.COURSE_LEVEL;
        this.teacherDealForm.COURSE_ID = row.COURSE_ID;
        this.teacherDealForm.ROLE_ID = row.ROLE_ID;
        this.teacherDealForm.STATUS = row.STATUS;
        this.teacherDealForm.COMMENT = row.COMMENT;
        this.teacherDialogVisible = true;
      }
    },
    //新增或变更处理操作
    dealTeacherSure(){
      if(this.validationForm()){
        var p = JSON.parse(JSON.stringify(this.teacherDealForm));
        this.$axios.post('/teacherAction.do?method=dealTeacher', p).then((response) => {
          if(response.status == "addSuccess"){
            this.$message({
              showClose: true,
              message: '教师添加成功！',
              type: 'success'
            });
            this.teacherDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else if(response.status == "editSuccess"){
            this.$message({
              showClose: true,
              message: '教师信息编辑成功！',
              type: 'success'
            });
            this.teacherDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else {
            this.$message({
              showClose: true,
              message: '操作教师信息出错！',
              type: 'error'
            });
          }
        });
      }
    },
    //点击删除钮时
    deleteTeacher (index, row) {
      this.$confirm('确认删除该教师？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var p = JSON.parse(JSON.stringify({'TEACHER_ID':row.TEACHER_ID}));
        this.$axios.post('/teacherAction.do?method=deleteTeacher', p).then((response) => {
          if(response.status == "deleteSuccess"){
            this.teacherTableData.splice(index, 1);
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
    //table method 合并列计算方法
    objectSpanMethod({ rowIndex, columnIndex }) {
      if(columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 13){
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0;
        return{
          rowspan:_row,
          colspan:_col                  
        }
      }
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
  .teacherList .el-table--border th, .el-table--border td{
    border-right:1px solid #dfe6ec;
  }
  /* 操作表单列表各项下距离缩短 */
  .teacherList .teacherDealForm .el-form-item{
    margin-bottom: 10px;
  }
  /* 操作表单列表文本域上距离缩短 */
  .teacherList .teacherDealForm .formArea{
    margin-top: 6px;
  }
  /* 表单中错误信息显示上距离缩短 */
  .teacherList .teacherDealForm .el-form-item__error{
    padding-top: 0px;
  }
  /* 弹出框表格主下方距离缩短 */
  .teacherList .el-dialog__body{
    padding:10px 20px;
  }
  /* 表单下拉框宽度100% */
  .teacherList .teacherDealForm .el-select{
    width: 100%;
  }
  /* 表单级联下拉框宽度100% */
  .teacherList .teacherDealForm .el-cascader{
    width: 100%;
  }
  /* 分组下拉框标题字体调大 */
  .el-select-group__title{
    font-size: 16px;
  }
  /* 分组下拉框内容字体调小 */
  .el-select-dropdown__item{
    font-size: 14px;
  }
  /* 穿梭框居中 */
  .teacherList .specifyClassForm .el-transfer{
    text-align: center;
  }
  /* 穿梭框内部其他内容保持靠左 */
  .teacherList .specifyClassForm .el-transfer-panel{
    text-align: left;
  }
</style>
