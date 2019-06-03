<template>
  <section class="studentList sys-page">
    <app-search>
      <!--表单-->
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="">
          <el-input v-model="params.studentName" size="small" prefix-icon="el-icon-search"
            placeholder="学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="params.gradeId" size="small" filterable placeholder="--选择所属年级--" @change="qryClass">
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
          <el-select v-model="params.classId" size="small" filterable placeholder="--选择所属班级--" 
            :disabled="params.gradeId != undefined ? false : true">
            <el-option
              v-for="item in classList"
              :key="item.itemKey"
              :label="item.itemValue"
              :value="item.itemKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchInfo">查询</el-button>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="dealStudent">新增</el-button>
          <el-button type="success" icon="el-icon-upload" size="small" @click="importStudent">批量导入</el-button>
        </el-form-item>
      </el-form>
    </app-search>
    <el-card shadow="hover" body-style="padding:0px;padding-bottom:10px;">
      <!--表格-->
      <el-table
        class="studentTable"
        :data="studentTableData"
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
          prop="STUDENT_ID"
          label="学号"
          fixed="left"
          sortable
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="STUDENT_NAME"
          label="学生姓名"
          fixed="left"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="GENDER_DESC"
          label="性别"
          align="center"
          width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.GENDER === '1' ? 'success' : ''" disable-transitions>{{scope.row.GENDER_DESC}}
            </el-tag>
          </template>
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
          width="120">
        </el-table-column>
        <el-table-column
          prop="CLASS_NAME"
          label="所在班级"
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="GRADE_NAME"
          label="归属年级"
          align="center"
          width="120">
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
        <el-table-column label="操作" fixed="right" align="center" width="170">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="dealStudent(scope.$index, scope.row)">变更</el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="deleteStudent(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="" width="60%" :visible.sync="studentDialogVisible">
      <app-title title="新增学生" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <el-form :model="studentDealForm" status-icon :rules="rules" label-position="right" ref="studentDealForm" label-width="100px" class="studentDealForm" style="width:90%;margin-left:6%;">
        <el-row>
          <el-col :span="11">
            <el-form-item label="学生姓名" prop="STUDENT_NAME">
              <el-input v-model="studentDealForm.STUDENT_NAME" size="small" placeholder="学生姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性别" prop="GENDER" required>
              <el-radio-group v-model="studentDealForm.GENDER" size="small">
                <el-radio-button label="1">男</el-radio-button>
                <el-radio-button label="2">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="年龄" prop="AGE" required>
              <el-input-number v-model.number="studentDealForm.AGE" size="small" 
                :min="15" :max="100" placeholder="年龄"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="民族" prop="NATION">
              <el-select v-model="studentDealForm.NATION" size="small" placeholder="---请选择---">
                <el-option
                  v-for="nation in nationOptions"
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
            <el-form-item label="年级" prop="GRADE_ID">
              <el-select v-model="studentDealForm.GRADE_ID" size="small" filterable placeholder="--选择所属年级--" @change="qryClass">
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
          </el-col>
          <el-col :span="11">
            <el-form-item label="班级" prop="CLASS_ID">
              <el-select v-model="studentDealForm.CLASS_ID" size="small" filterable placeholder="--选择所属班级--"
              :disabled="studentDealForm.GRADE_ID != undefined ? false : true">
                <el-option
                  v-for="item in classList"
                  v-if="item.itemValue == '全部' ? false : true"
                  :key="item.itemKey"
                  :label="item.itemValue"
                  :value="item.itemKey"
                  :disabled="item.itemDisabled == 'true' ? true : false">
                  <span style="float: left">{{ item.itemValue }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.itemStatus }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="政治面貌" prop="POLITICAL_STATUS">
              <el-select v-model="studentDealForm.POLITICAL_STATUS" size="small" placeholder="---请选择---">
                <el-option
                  v-for="political in politicalOptions"
                  :key="political.itemKey"
                  :label="political.itemValue"
                  :value="political.itemKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="状态" prop="STATUS" required>
              <el-radio-group v-model="studentDealForm.STATUS" size="small">
                <el-radio-button label="10A">有效</el-radio-button>
                <el-radio-button label="10X">失效</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注" class="formArea" prop="COMMENT">
              <el-input type="textarea" v-model="studentDealForm.COMMENT" :rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="dealStudentSure()">确定</el-button>
        <el-button size="small" @click.native="studentDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 批量导入 -->
    <el-dialog title="" width="60%" :visible.sync="importDialogVisible"
        v-loading="importLoading"
        element-loading-text="数据导入中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)">
      <app-title title="批量导入学生信息" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <el-form :model="uploadForm" status-icon :rules="uploadRules" label-position="right" 
                ref="uploadForm" label-width="100px" class="uploadForm" 
                style="width:90%;margin-left:6%;">
        <el-row>
          <el-col :span="11">
            <el-form-item label="年级" prop="gradeId">
              <el-select v-model="uploadForm.gradeId" size="small" filterable placeholder="--选择所属年级--" @change="qryClass">
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
          </el-col>
          <el-col :span="11">
            <el-form-item label="班级" prop="classId">
              <el-select v-model="uploadForm.classId" size="small" filterable placeholder="--选择所属班级--"
              :disabled="uploadForm.gradeId != undefined ? false : true">
                <el-option
                  v-for="item in classList"
                  v-if="item.itemValue == '全部' ? false : true"
                  :key="item.itemKey"
                  :label="item.itemValue"
                  :value="item.itemKey"
                  :disabled="item.itemDisabled == 'true' ? true : false">
                  <span style="float: left">{{ item.itemValue }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.itemStatus }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- data:上传时附带的额外参数(obj) -->
      <el-upload 
          ref="upload" 
          class="uploadStudent"
          drag
          list-type="picture"
          :multiple="false"
          :limit="1"
          :data="uploadForm"
          :with-credentials="true"
          action="http://127.0.0.1:8080/SP/studentAction.do?method=importStudentBatch"
          :on-success="handleSuccess" 
          :on-error="handleError" 
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :on-progress="handleProgress"
          :before-upload="beforeUpload"
          :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">注意：目前只支持上传xls文件，且不超过10MB
          <el-button type="text">【导入模板下载】</el-button>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="submitUpload()">确定</el-button>
        <el-button size="small" @click.native="importDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import excel from '../../assets/images/excel.jpeg'
export default {
  data () {
    //不使用return包裹的数据会在项目的全局可见，会造成变量污染
    //使用return包裹后数据中变量只在当前组件中生效，不会影响其他组件
    return {
      gradeList: [],
      classList: [],
      nationOptions: [],
      politicalOptions: [],
      studentDialogVisible: false,   //新增或编辑学生的dialog
      importDialogVisible: false,    //批量导入dialog
      importLoading: false,          //批量导入加载图标
      initUploadForm:{},             //初始化的批量导入其他参数表单
      uploadForm:{                   //批量导入其他参数表单
        gradeId: null,
        classId: null
      },
      initStudentDealForm:{},        //初始化的新增或编辑表单
      studentDealForm: {             //新增或编辑表单
        STUDENT_ID: null,
        STUDENT_NAME: '',
        GENDER: '1',
        AGE: null,
        NATION: '',
        POLITICAL_STATUS: '',
        GRADE_ID: null,
        CLASS_ID: null,
        STATUS: '10A',
        COMMENT: ''
      },
      rules: {
        STUDENT_NAME: [
          { required: true, message: '请填写学生姓名', trigger: 'blur' }
        ],
        NATION: [
          { required: true, message: '请选择民族', trigger: 'change' }
        ],
        POLITICAL_STATUS: [
          { required: true, message: '请选择政治面貌', trigger: 'change' }
        ],
        GRADE_ID: [
          { required: true, message: '请选择学生年级', trigger: 'change' }
        ],
        CLASS_ID: [
          { required: true, message: '请选择学生班级', trigger: 'change' }
        ]
      },
      uploadRules: {
        gradeId: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        classId: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ]
      },
      params: {                      //学生界面查询form
        studentName: '',
        gradeId: null,
        classId: null,
        pageNum: 1,
        pageSize: 10
      },
      studentTableData: [],        //学生表格数据
      dataLoading: true,
      total: 0,
      table_index: 999,
    };
  },
  mounted() {
    //深拷贝
    this.initStudentDealForm = JSON.parse(JSON.stringify(this.studentDealForm));
    this.initUploadForm = JSON.parse(JSON.stringify(this.uploadForm));
    var p = JSON.parse(JSON.stringify({isAll:'1'}));
    this.$axios.post('/studentAction.do?method=getGradeList',p).then((response) => {
      if(response != null){
        this.gradeList = response.gradeList;
      }
    });
    this.searchInfo();
  },
  methods: {
    //表单数据规范检查
    validationForm() {
      let flag = true;
      this.$refs.studentDealForm.validate((valid) => {
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
    validationUploadForm() {
      let flag = true;
      this.$refs.uploadForm.validate((valid) => {
        if (!valid) {
          flag = false;
        }
      });
      return flag;
    },
    searchInfo () {
      this.dataLoading = true;
      var p = JSON.parse(JSON.stringify(this.params));
      this.$axios.post('/studentAction.do?method=queryStudentList', p).then((response) => {
        if(response != null){
          this.total = response.total;
          this.studentTableData = response.rows;
        }
        this.dataLoading = false;
      });
    },
    //点击导入按钮
    importStudent (){
      this.$nextTick(() => {
        if (this.$refs.upload !== undefined) {
          this.$refs.upload.clearFiles();
        }
      });
      this.uploadForm = JSON.parse(JSON.stringify(this.initUploadForm));
      this.$nextTick(() => {
        if (this.$refs.uploadForm !== undefined) {
          this.$refs.uploadForm.clearValidate();
        }
      });
      this.importDialogVisible = true;
    },
    //文件上传提交
    submitUpload: function () {
      if(this.validationUploadForm()){
        this.$refs.upload.submit();
      }
    },
    //文件上传前检查
    beforeUpload: function (file) {
      var fileName=new Array()
      fileName =file.name.split('.');
      const extension = fileName[fileName.length-1] === 'xls'
      //xlsx到后台会有内存溢出的问题，待解决
      //const extension2 =  fileName[fileName.length-1]=== 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$message({
            showClose: true,
            message: '上传模板只能是xls格式！',
            type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
            showClose: true,
            message: '上传模板大小不能超过【10MB】!',
            type: 'warning'
        });
      }
      if (extension && isLt2M) {
        return true
      }
      return extension && isLt2M
    },
    handleProgress: function(){
      this.importLoading = true;
    },
    //添加文件、上传成功和上传失败时都会被调用
    handleChange: function(file){
      file.url = excel;
    },
    //文件超出个数限制时
    handleExceed: function(){
      this.$message({
        showClose: true,
        message: '抱歉，目前只支持单个文件上传！',
        type: 'warning'
      });
    },
    //上传成功回调函数
    handleSuccess: function (response,file) {
      this.importLoading = false;
      if(response != null){
        if(response.status = 'importSuccess'){
          this.$message({
            showClose: true,
            message: '文件【' + file.name + '】上传导入成功！',
            type: 'success'
          });
          this.$nextTick(() => {
            if (this.$refs.upload !== undefined) {
              this.$refs.upload.clearFiles();
            }
          });
          this.importDialogVisible = false;
          setTimeout(()=>{this.searchInfo()}, 1000);
        } else{
          this.$message({
            showClose: true,
            message: '文件【' + file.name + '】上传导入失败，请重新尝试！',
            type: 'error'
          });
        }
      }
    },
    //上传失败回调函数
    handleError: function (err,file) {
      this.importLoading = false;
      this.$message({
        showClose: true,
        message: '文件【' + file.name + '】上传导入失败，请重新尝试！',
        type: 'error'
      });
    },
    //根据年级查询班级
    qryClass: function(val) {
      var p = JSON.parse(JSON.stringify({'gradeId':val}));
      this.$axios.post('/studentAction.do?method=getClassList',p).then((response) => {
        if(response != null){
          this.classList = response.classList;
          this.params.classId = response.classList[0].itemKey;
        }
      });
    },
    //点击新增或编辑按钮时
    dealStudent(index, row){
      this.$axios.post('/studentAction.do?method=initOperStudent').then((response) => {
        if(response != null){
          this.nationOptions = response.nationList;
          this.politicalOptions = response.politicalList;
          if(row == undefined){
            //初始化表单
            this.studentDealForm = JSON.parse(JSON.stringify(this.initStudentDealForm));
            this.$nextTick(() => {
              if (this.$refs.studentDealForm !== undefined) {
                this.$refs.studentDealForm.clearValidate();
              }
            });
            this.studentDialogVisible = true;
          } else {
            //因为表单不多，所以直接赋值了
            this.studentDealForm.STUDENT_ID = row.STUDENT_ID;
            this.studentDealForm.STUDENT_NAME = row.STUDENT_NAME;
            this.studentDealForm.GENDER = row.GENDER;
            this.studentDealForm.AGE = row.AGE;
            this.studentDealForm.NATION = row.NATION;
            this.studentDealForm.POLITICAL_STATUS = row.POLITICAL_STATUS;
            this.studentDealForm.GRADE_ID = row.GRADE_ID;
            this.studentDealForm.CLASS_ID = row.CLASS_ID;
            this.studentDealForm.STATUS = row.STATUS;
            this.studentDealForm.COMMENT = row.COMMENT;
            //查询出年级下的班级
            this.qryClass(row.GRADE_ID);
            this.studentDialogVisible = true;
          }
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '初始化信息出错！',
          type: 'error'
        });        
      });
    },
    //新增或变更处理操作
    dealStudentSure(){
      if(this.validationForm()){
        var p = JSON.parse(JSON.stringify(this.studentDealForm));
        this.$axios.post('/studentAction.do?method=dealStudent', p).then((response) => {
          if(response.status == "addSuccess"){
            this.$message({
              showClose: true,
              message: '学生添加成功！',
              type: 'success'
            });
            this.studentDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else if(response.status == "editSuccess"){
            this.$message({
              showClose: true,
              message: '学生信息编辑成功！',
              type: 'success'
            });
            this.studentDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else {
            this.$message({
              showClose: true,
              message: '操作学生信息出错！',
              type: 'error'
            });
          }
        });
      }
    },
    //点击删除钮时
    deleteStudent (index, row) {
      this.$confirm('确认删除该学生信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var p = JSON.parse(JSON.stringify({'STUDENT_ID':row.STUDENT_ID}));
        this.$axios.post('/studentAction.do?method=deleteStudent', p).then((response) => {
          if(response.status == "deleteSuccess"){
            this.studentTableData.splice(index, 1);
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
  .studentList .el-table--border th, .el-table--border td{
    border-right:1px solid #dfe6ec;
  }
  /* 操作表单列表各项下距离缩短 */
  .studentList .studentDealForm .el-form-item{
    margin-bottom: 10px;
  }
  /* 操作表单列表文本域上距离缩短 */
  .studentList .studentDealForm .formArea{
    margin-top: 6px;
  }
  /* 表单中错误信息显示上距离缩短 */
  .studentList .studentDealForm .el-form-item__error{
    padding-top: 0px;
  }
  /* 弹出框表格主下方距离缩短 */
  .studentList .el-dialog__body{
    padding:10px 20px;
  }
  /* 表单下拉框宽度100% */
  .studentList .studentDealForm .el-select{
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

  /* 下面可以考虑放入公共css中，统一格式 */
  
  /* 导入弹出框内容居中 */
  .studentList .uploadStudent{
    text-align: center;
  }
  /* 导入表单中上传拖拽框高度调小 */
  .studentList .uploadStudent .el-upload-dragger{
    height: 130px;
  }
  /* 导入表单中上传拖拽框中图片top调小 */
  .studentList .uploadStudent .el-icon-upload{
    margin: 16px 0 16px;
  }
  
  /* 导入表单上传文件列表（单个）文件默认图片取消 */
  .studentList .uploadStudent .el-upload-list .el-icon-document:before{
    content: "";
  }
  /* 导入表单上传文件列表（单个）文件图片高度宽度调小 */
  .studentList .uploadStudent .el-upload-list.el-upload-list--picture .el-upload-list__item-thumbnail{
    width: 65px;
    height: 60px;
  }
  /* 导入表单上传文件列表（单个）内部top调小10 - 0 */
  .studentList .uploadStudent .el-upload-list .el-upload-list__item{
    padding: 0px 10px 10px 90px;
  }
  /* 导入表单上传文件列表文字调整top调小20 - 15 */
  .studentList .uploadStudent .el-upload-list.el-upload-list--picture .el-upload-list__item-name{
    margin-top: 15px;
  }
  /* 导入表单上传文件列表（单个）文件高度调整调小92 - 60 */
  .studentList .uploadStudent .el-upload-list.el-upload-list--picture .el-upload-list__item{
    height: 60px;
  }
</style>
