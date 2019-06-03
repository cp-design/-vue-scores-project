<template>
  <section class="examList sys-page">
    <app-search>
      <!--表单-->
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="">
          <el-input v-model="params.examName" size="small" prefix-icon="el-icon-search"
            placeholder="考试名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="params.gradeId" size="small" placeholder="--选择年级--">
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
        <el-form-item label="">
          <el-select v-model="params.examType" size="small" placeholder="--考试类型--">
            <el-option
              v-for="nation in examTypeOptions"
              :key="nation.itemKey"
              :label="nation.itemValue"
              :value="nation.itemKey">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchInfo">查询</el-button>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="dealExam">新增</el-button>
        </el-form-item>
      </el-form>
    </app-search>
    <el-card shadow="hover" body-style="padding:0px;padding-bottom:10px;">
      <!--表格-->
      <el-table
        class="examTable"
        :data="examTableData"
        max-height="340"
        border
        stripe
        highlight-current-row
        v-loading="dataLoading"
        element-loading-text="数据加载中，请稍后！"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="exam-table-expand">
              <el-form-item label="考试年级：">
                <span>{{ props.row.GRADE_NAME }}</span>
              </el-form-item>
              <el-form-item label="考试地点：">
                <span>{{ props.row.EXAM_ADDR }}</span>
              </el-form-item>
              <el-form-item label="考试班级：">
                <span>{{ props.row.CLASS_NAME_STR }}</span>
              </el-form-item>
              <el-form-item label="监考老师：">
                <span>{{ props.row.SUPERVISOR }}</span>
              </el-form-item>
              <el-form-item label="创建时间：">
                <span>{{ props.row.CREATE_TIME }}</span>
              </el-form-item>
              <el-form-item label="状态：">
                <span>{{props.row.STATUS_NAME}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="EXAM_NAME"
          label="考试名称"
          show-overflow-tooltip
          align="center"
          width="150">
        </el-table-column>
        <el-table-column
          prop="EXAM_TYPE_NAME"
          label="考试类型"
          show-overflow-tooltip
          align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="GRADE_NAME"
          label="所属年级"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          prop="COURSE_NAME"
          label="考试科目"
          align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="EXAM_TIME"
          label="考试时间"
          align="center"
          sortable
          width="170">
        </el-table-column>
        <el-table-column
          prop="EXAM_LIMIT"
          label="考试时限"
          align="center"
          width="80">
          <template slot-scope="scope">
            <el-tag type="success" disable-transitions>{{scope.row.EXAM_LIMIT}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="EXAM_STATUS_NAME"
          label="考试状态"
          align="center"
          width="80">
          <template slot-scope="scope">
            <el-tag :type="scope.row.EXAM_STATUS_NAME === '未开始' ? 'warning' : 'success'" disable-transitions>{{scope.row.EXAM_STATUS_NAME}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="IS_IMPORT_SCORE_DESC"
          label="导入成绩"
          align="center"
          width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.IS_IMPORT_SCORE === 1 ? 'success' : 'warning'" disable-transitions>{{scope.row.IS_IMPORT_SCORE_DESC}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="COMMENT"
          label="考试内容"
          show-overflow-tooltip
          header-align="center"
          align="left"
          width="262">
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="240">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="success" plain size="mini" icon="el-icon-upload" 
                @click="importExamScore(scope.$index, scope.row)" 
                :disabled="scope.row.EXAM_STATUS == '10C' ? false : true">导入</el-button>
              <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="dealExam(scope.$index, scope.row)">变更</el-button>
              <el-button type="danger" plain size="mini" icon="el-icon-delete" @click="deleteExam(scope.$index, scope.row)">删除</el-button>
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
    <el-dialog title="" width="65%" :visible.sync="examDialogVisible" class="heightDialog">
      <app-title title="发布考试" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <el-form :model="examDealForm" status-icon :rules="rules" label-position="right" ref="examDealForm" label-width="100px" class="examDealForm" style="width:90%;margin-left:6%;">
        <el-row>
          <el-col :span="11">
            <el-form-item label="考试名称" prop="EXAM_NAME">
              <el-input v-model="examDealForm.EXAM_NAME" size="small" placeholder="考试名称">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="考试类型" prop="EXAM_TYPE">
              <el-select v-model="examDealForm.EXAM_TYPE" size="small" placeholder="---请选择---">
                <el-option
                  v-for="nation in examTypeOptions"
                  :key="nation.itemKey"
                  :label="nation.itemValue"
                  :value="nation.itemKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="考试地点" prop="EXAM_ADDR">
              <el-input v-model="examDealForm.EXAM_ADDR" size="small" placeholder="考试地点">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="考试内容" class="formArea" prop="COMMENT">
              <el-input type="textarea" v-model="examDealForm.COMMENT" :rows="1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="考试时间" class="time-item" prop="EXAM_TIME">
              <el-date-picker
                ref="examTime"
                size="small"
                popper-class="exam-time-data-picker"
                v-model="examDealForm.EXAM_TIME"
                type="datetime"
                placeholder="选择日期时间"
                :picker-options="pickerOptions"
                default-time="08:00:00"
                @change="onExamTimeChange">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="考试时限" prop="EXAM_LIMIT" required>
              <el-input-number v-model.number="examDealForm.EXAM_LIMIT" size="small"
                :min="45" :max="360"></el-input-number> （单位：分钟）
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="年级" prop="GRADE_ID">
              <el-select v-model="examDealForm.GRADE_ID" size="small" filterable placeholder="--请选择--" @change="onGradeChange">
                <el-option-group
                  v-for="group in gradeOptions"
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
            <el-form-item label="考试科目" prop="COURSE_ID">
              <el-select v-model="examDealForm.COURSE_ID" size="small" placeholder="---请选择---"
                :disabled="examDealForm.GRADE_ID != undefined ? false : true">
                <el-option
                  v-for="option in courseOptions"
                  :key="option.COURSE_ID"
                  :label="option.COURSE_NAME"
                  :value="option.COURSE_ID"
                  :disabled="examDealForm.EXAM_ID == undefined ? false : true"
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="考试班级" required>
              <el-tag
                v-for="EXAM_CLASS in examDealForm.EXAM_CLASS_ARR"
                :key="EXAM_CLASS.CLASS_ID"
                closable
                type="primary"
                @close="examClassClose(EXAM_CLASS)"
                 >
                {{EXAM_CLASS.CLASS_NAME}}
              </el-tag>
              <el-button icon="el-icon-plus" size="small" @click.native="showExamClassDialog" 
                         style="vertical-align: middle;"
                         :disabled="(examDealForm.GRADE_ID != undefined && 
                                     examDealForm.EXAM_TIME != '') ? false : true">
              </el-button>
              <transition name="fade">
                <div class="el-form-item__error" v-show="examClassValid">{{ examClassError }}</div>
              </transition>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="监考老师" required>
              <el-tag
                v-for="SUPERVISOR in examDealForm.SUPERVISOR_ARR"
                :key="SUPERVISOR.TEACHER_ID"
                closable
                type="primary"
                @close="examSupClose(SUPERVISOR)"
                 >
                {{SUPERVISOR.TEACHER_NAME}}
              </el-tag>
              <el-button icon="el-icon-plus" size="small" @click.native="showExamSupDialog" 
                         style="vertical-align: middle;"
                         :disabled="examDealForm.EXAM_TIME != '' ? false : true">
              </el-button>
              <transition name="fade">
                <div class="el-form-item__error" v-show="examSupValid">{{ examSupError }}</div>
              </transition>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="状态" prop="STATUS" required>
              <el-radio-group v-model="examDealForm.STATUS" size="small">
                <el-radio-button label="10A">有效</el-radio-button>
                <el-radio-button label="10X">失效</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="dealExamSure()">确定</el-button>
        <el-button size="small" @click.native="examDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 考试班级dialog -->
    <el-dialog title="" width="65%" :visible.sync="examClassDialogVisible" class="heightDialog">
      <app-title title="考试班级选择" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <app-search>
        <el-form :inline="true" :model="examClassQryParams" class="examClassForm">
          <el-form-item label="">
            <el-input v-model="examClassQryParams.className" size="small" prefix-icon="el-icon-search"
              placeholder="班级名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" size="small" @click="queryExamClassList">查询</el-button>
          </el-form-item>
        </el-form>
      </app-search>
      <el-card shadow="hover" body-style="padding:0px;padding-bottom:10px;">
        <!-- 数据列表 -->
        <el-table 
          class="examClassTable"
          :data="examClassTableData"
          @current-change="examClassSelectChange"
          height="215"
          max-height="215"
          border
          stripe
          highlight-current-row
          v-loading="examClassDataLoading"
          element-loading-text="数据加载中，请稍后！"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          >
          <el-table-column
            property="CLASS_NAME"
            label="班级名称"
            align="center">
          </el-table-column>
          <el-table-column
            property="GRADE_NAME"
            label="所属年级"
            align="center">
          </el-table-column>
          <el-table-column
            property="LATEST_EXAM_COURSE"
            label="最近考试科目"
            align="center">
          </el-table-column>
          <el-table-column
            property="LATEST_EXAM_TIME"
            label="最近考试时间"
            align="center">
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="examClassTableSizeChange"
            @current-change="examClassTableCurrentChange"
            :current-page="examClassQryParams.pageNum"
            :page-sizes="[10, 30, 50, 100, 300, 500]"
            :page-size="examClassQryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="examClassAdd">确定</el-button>
        <el-button size="small" @click.native="examClassDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 监考老师dialog -->
    <el-dialog title="" width="65%" :visible.sync="examSupDialogVisible" class="heightDialog">
      <app-title title="监考老师选择" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <app-search>
        <el-form :inline="true" :model="examSupQryParams" class="examSupForm">
          <el-form-item label="">
            <el-input v-model="examSupQryParams.teacherName" size="small" prefix-icon="el-icon-search"
              placeholder="教师名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" size="small" @click="queryExamSupList">查询</el-button>
          </el-form-item>
        </el-form>
      </app-search>
      <el-card shadow="hover" body-style="padding:0px;padding-bottom:10px;">
        <!-- 数据列表 -->
        <el-table 
          class="examSupTable"
          :data="examSupTableData"
          @current-change="examSupSelectChange"
          height="215"
          max-height="215"
          border
          stripe
          highlight-current-row
          v-loading="examSupDataLoading"
          element-loading-text="数据加载中，请稍后！"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          >
          <el-table-column
            property="TEACHER_NAME"
            label="教师名称"
            align="center">
          </el-table-column>
          <el-table-column
            property="COURSE_PATH"
            label="教授课程"
            align="center">
          </el-table-column>
          <el-table-column
            property="LATEST_EXAM_COURSE"
            label="最近监考科目"
            align="center">
          </el-table-column>
          <el-table-column
            property="LATEST_EXAM_TIME"
            label="最近监考时间"
            align="center">
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="examSupTableSizeChange"
            @current-change="examSupTableCurrentChange"
            :current-page="examSupQryParams.pageNum"
            :page-sizes="[10, 30, 50, 100, 300, 500]"
            :page-size="examSupQryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click.native="examSupAdd">确定</el-button>
        <el-button size="small" @click.native="examSupDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>


    <!-- 批量导入 -->
    <el-dialog title="" width="60%" :visible.sync="importDialogVisible"
        v-loading="importLoading"
        element-loading-text="数据导入中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)">
      <app-title :title="importDialogTitle" style="border-left:4px solid #52bab5;padding-left: 15px;">
      </app-title>
      <el-form :model="uploadForm" status-icon :rules="uploadRules" label-position="right" 
                ref="uploadForm" label-width="100px" class="uploadForm" 
                style="width:90%;margin-left:6%;">
        <el-row>
          <el-col :span="11">
            <el-form-item label="班级" prop="classId">
              <el-select v-model="uploadForm.classId" size="small" filterable placeholder="--选择所属班级--">
                <el-option
                  v-for="item in classOptions"
                  :key="item.itemKey"
                  :label="item.itemValue"
                  :value="item.itemKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- data:上传时附带的额外参数(obj) -->
      <el-upload 
          ref="upload" 
          class="uploadScore"
          drag
          list-type="picture"
          :multiple="false"
          :limit="1"
          :data="uploadForm"
          :with-credentials="true"
          action="http://127.0.0.1:8080/SP/examAction.do?method=importExamScoreBatch"
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
    return {
      //API中这是个对象属性
      pickerOptions: {
        //设置禁用状态，参数为当前日期，要求返回 Boolean
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;   //今天以及今天之后的日期
          //return time.getTime() > Date.now() - 8.64e6; //今天以及今天以前的日期
          //return time.getTime() < Date.now();          //今天之后的日期（不能选择当天时间）
          //return time.getTime() > Date.now();          //今天之前的日期（不能选择当天）
        }
      },
      classOptions: [],               //导入时选择的
      gradeOptions: [],
      courseOptions: [],
      examTypeOptions: [],
      importDialogTitle: '',
      importDialogVisible: false,     //导入dialog
      examDialogVisible: false,       //新增或编辑课程的dialog
      examClassDialogVisible: false,  //考试班级选择弹出框
      examClassValid:false,           //考试班级选择非法提示显示标识
      examClassError:'请选择考试班级', //考试班级选择非法提示信息
      examSupDialogVisible: false,    //监考老师选择弹出框
      examSupValid:false,             //监考老师选择非法提示显示标识
      examSupError:'请选择监考老师',   //监考老师选择非法提示信息
      initUploadForm:{},              //初始化的批量导入其他参数表单
      uploadForm:{                    //批量导入其他参数表单
        examId: null,
        classId: null
      },
      initExamDealForm:{},            //初始化的新增或编辑表单
      examDealForm: {                 //新增或编辑表单
        EXAM_ID: null,
        EXAM_NAME: '',
        EXAM_TYPE: null,
        EXAM_ADDR: '',
        GRADE_ID: null,
        EXAM_CLASS_ARR: [],           //参考班级（可多选）
        SUPERVISOR_ARR: [],           //监考老师（可多选）
        COURSE_ID: null,
        EXAM_TIME: '',
        EXAM_LIMIT: 45,
        STATUS: '10A',
        COMMENT: ''
      },
      rules: {
        EXAM_NAME: [
          { required: true, message: '请填写考试名称', trigger: 'blur' }
        ],
        EXAM_ADDR: [
          { required: true, message: '请填写考试地点', trigger: 'blur' }
        ],
        EXAM_TIME: [
          { required: true, message: '请填写考试日期', trigger: 'change' }
        ],
        GRADE_ID: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        COURSE_ID: [
          { required: true, message: '请选择考试科目', trigger: 'change' }
        ]
      },
      uploadRules: {
        classId: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ]
      },
      params: {
        examName: '',
        gradeId: null,
        examType: null,
        pageNum: 1,
        pageSize: 10
      },
      examClassQryParams: {           //考试班级查询表格数据参数
        classIdStr: '',               //针对编辑时把已经选择的也查询出来
        className: '',                //显示参数：用户输入的
        gradeId: '',                  //隐藏参数：在选择年级时被赋值
        examTime: '',                 //隐藏参数：在时间控件选择时被赋值
        examLimit: 45,                //隐藏参数：在时限选择时被赋值
        pageNum: 1,
        pageSize: 10
      },
      examSupQryParams: {             //监考老师查询表格数据参数
        teacherIdStr: '',             //针对编辑时把已经选择的也查询出来
        teacherName: '',              //显示参数：用户输入的
        examTime: '',                 //隐藏参数：在时间控件选择时被赋值
        examLimit: 45,                //隐藏参数：在时限选择时被赋值
        pageNum: 1,
        pageSize: 10
      },
      examTableData: [],                 //考试列表数据
      dataLoading: true,                 //考试列表加载
      importLoading: true,               //导入加载
      courseCurSelect: [],               //考试科目级联下拉框当前选中记录
      examClassTableData: [],            //考试班级列表数据
      examClassDataLoading: true,        //考试班级列表加载
      examClassCurSelect: [],            //考试班级列表当前选中
      examSupTableData: [],              //监考老师列表数据
      examSupDataLoading: true,          //监考老师列表加载
      examSupCurSelect: [],              //监考老师列表当前选中
      total: 0,
      table_index: 999,
    };
  },
  mounted() {
    //深拷贝
    this.initExamDealForm = JSON.parse(JSON.stringify(this.examDealForm));
    this.initUploadForm = JSON.parse(JSON.stringify(this.uploadForm));
    var p = JSON.parse(JSON.stringify({isAll:'1'}));
    this.$axios.post('/examAction.do?method=initExamMag',p).then((response) => {
      if(response != null){
        this.gradeOptions = response.gradeOptions;
        this.examTypeOptions = response.examTypeOptions;
      }
    });
    this.searchInfo();
  },
  methods: {
    //表单数据规范检查
    validationForm() {
      let flag = true;
      var _this = this;
      this.examClassValid = this.examDealForm.EXAM_CLASS_ARR.length > 0 ? false : true;
      this.examSupValid = this.examDealForm.SUPERVISOR_ARR.length > 0 ? false : true;
      this.$refs.examDealForm.validate((valid) => {
        if (!valid) {
          flag = false;
        }
        //检查考试班级
        if(_this.examClassValid){
          flag = false;
        }
        //检查监考老师
        if(_this.examSupValid){
          flag = false;
        }
        if(!flag){
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
      this.$axios.post('/examAction.do?method=queryExamList', p).then((response) => {
        if(response != null){
          this.total = response.total;
          this.examTableData = response.rows;
        }
        this.dataLoading = false;
      });
    },
    //年级下拉框变化时
    onGradeChange: function(val) {
      //加载年级对应课程
      var p = JSON.parse(JSON.stringify({gradeId: val})); //深拷贝，双方值互不影响
      this.$axios.post('/examAction.do?method=qryCourseByGrade', p).then((response) => {
        if(response != null){
          this.courseOptions = response.courseOptions;
        }
      });
    },
    //考试时间变化时
    onExamTimeChange: function(val){
      if(val.getTime() <= Date.now()){
        this.$message({
          showClose: true,
          message: '考试时间不能小于当前时间，请重新选择！',
          type: 'error'
        });
        this.examDealForm.EXAM_TIME = '';
        //this.$refs.examTime.focus();
      }
    },
    //显示考试班级选择列表
    showExamClassDialog: function(){
      this.queryExamClassList();
      this.examClassDialogVisible = true;
    },
    //查询考试班级信息
    queryExamClassList: function() {
      this.examClassDataLoading = true;
      var _this = this;
      this.examClassQryParams.gradeId = _this.examDealForm.GRADE_ID;
      this.examClassQryParams.examTime = _this.examDealForm.EXAM_TIME;
      this.examClassQryParams.examLimit = _this.examDealForm.EXAM_LIMIT;
      var p = JSON.parse(JSON.stringify(this.examClassQryParams)); //深拷贝，双方值互不影响
      this.$axios.post('/examAction.do?method=queryExamClassList', p).then((response) => {
        if(response != null){
          this.total = response.total;
          this.examClassTableData = response.rows;
        }
        this.examClassDataLoading = false;
      });
    },
    //考试班级表格选中的记录信息
    examClassSelectChange(val) {
      //每次初始化
      this.examClassCurSelect = [];
      Object.assign(this.examClassCurSelect,val); //浅拷贝
    },
    //添加考试班级
    examClassAdd: function () {
      var classId = this.examClassCurSelect.CLASS_ID;
      var className = this.examClassCurSelect.CLASS_NAME;
      if(typeof(classId) == "undefined"){
        this.$message({
          showClose: true,
          message: '考试班级不能为空！',
          type: 'warning'
        });
      } else {
        //浅拷贝，值变化时将影响对方
        var values = this.examDealForm.EXAM_CLASS_ARR;
        var isExist = false ;
        for(var i = 0; i < values.length; i++){
          if(values[i].CLASS_ID == classId ){
            isExist = true;
            break
          }
        }
        if(isExist){
          this.$message({
            showClose: true,
            message: '【' + this.examClassCurSelect.CLASS_NAME + '】已选择，请重新操作！',
            type: 'warning'
          });
        } else {
          this.examClassDialogVisible = false;
          values.push({
            CLASS_ID: classId,
            CLASS_NAME: className
          });
        }
      }
    },
    //删除考试班级标签
    examClassClose: function (value) {
      var index = this.examDealForm.EXAM_CLASS_ARR.indexOf(value);
      this.examDealForm.EXAM_CLASS_ARR.splice(index,1);
    },


    //显示监考老师选择列表
    showExamSupDialog: function(){
      if(this.examDealForm.SUPERVISOR_ARR.length >= 2 ){
        this.$message({
          showClose: true,
          message: '最多选择两位监考老师！',
          type: 'warning'
        });
      }else{
        this.queryExamSupList();
        this.examSupDialogVisible = true;
      }
    },
    //查询监考老师信息
    queryExamSupList: function() {
      this.examSupDataLoading = true;
      var _this = this;
      this.examSupQryParams.examTime = _this.examDealForm.EXAM_TIME;
      this.examSupQryParams.examLimit = _this.examDealForm.EXAM_LIMIT;
      var p = JSON.parse(JSON.stringify(this.examSupQryParams)); //深拷贝，双方值互不影响
      this.$axios.post('/examAction.do?method=queryExamSupList', p).then((response) => {
        if(response != null){
          this.total = response.total;
          this.examSupTableData = response.rows;
        }
        this.examSupDataLoading = false;
      });
    },
    //监考老师表格选中的记录信息
    examSupSelectChange(val) {
      //每次初始化
      this.examSupCurSelect = [];
      Object.assign(this.examSupCurSelect,val); //浅拷贝
    },
    //添加监考老师
    examSupAdd: function () {
      var teacherId = this.examSupCurSelect.TEACHER_ID;
      var teacherName = this.examSupCurSelect.TEACHER_NAME;
      if(typeof(teacherId) == "undefined"){
        this.$message({
          showClose: true,
          message: '监考老师不能为空！',
          type: 'warning'
        });
      } else {
        //浅拷贝，值变化时将影响对方
        var values = this.examDealForm.SUPERVISOR_ARR;
        var isExist = false ;
        for(var i = 0; i < values.length; i++){
          if(values[i].TEACHER_ID == teacherId ){
            isExist = true;
            break
          }
        }
        if(isExist){
          this.$message({
            message: '【' + this.examSupCurSelect.TEACHER_NAME + '】已选择，请重新操作！',
            type: 'warning'
          });
        } else {
          this.examSupDialogVisible = false;
          values.push({
            TEACHER_ID: teacherId,
            TEACHER_NAME: teacherName
          });
        }
      }
    },
    //删除考试班级标签
    examSupClose: function (value) {
      var index = this.examDealForm.SUPERVISOR_ARR.indexOf(value);
      this.examDealForm.SUPERVISOR_ARR.splice(index,1);
    },
    //点击新增或编辑按钮时
    dealExam(index, row){
      //初始化表单-深拷贝
      this.examDealForm = JSON.parse(JSON.stringify(this.initExamDealForm));
      if(row == undefined){
        //在新增时查询参数初始化
        this.examClassQryParams.classIdStr = '';
        this.examSupQryParams.teacherIdStr = '';
        this.$nextTick(() => {
          if (this.$refs.examDealForm !== undefined) {
            this.$refs.examDealForm.clearValidate();
          }
        });
        this.examDialogVisible = true;
      } else {
        var examTime = row.EXAM_TIME;
        var sdate = new Date(examTime.replace(/-/g, "/"));
        if((Date.parse(sdate) <= Date.parse(new Date()))/86400000){
          this.$notify.error({
            title: '错误',
            message: '【' + row.EXAM_NAME + '】考试已经结束，禁止编辑！'
          });
          return;
        }
        this.examDealForm.EXAM_ID = row.EXAM_ID;
        this.examDealForm.EXAM_NAME = row.EXAM_NAME;
        this.examDealForm.EXAM_TYPE = row.EXAM_TYPE;
        this.examDealForm.EXAM_ADDR = row.EXAM_ADDR;
        this.examDealForm.GRADE_ID = row.GRADE_ID;
        this.examDealForm.COURSE_ID = row.COURSE_ID;
        this.examDealForm.EXAM_TIME = this.$StrToGMT(row.EXAM_TIME);
        this.examDealForm.EXAM_LIMIT = row.EXAM_LIMIT;
        this.examDealForm.STATUS = row.STATUS;
        this.examDealForm.COMMENT = row.COMMENT;

        var classResultArr = this.examDealForm.EXAM_CLASS_ARR;
        var classIdArr = row.CLASS_ID_STR.split(',');
        var classNameArr = row.CLASS_NAME_STR.split(',');
        for(var i = 0; i < classIdArr.length; i++){
          if('' != classIdArr[i]){
            classResultArr.push({
              CLASS_ID: classIdArr[i],
              CLASS_NAME: classNameArr[i]
            });
          }
        }

        var supResultArr = this.examDealForm.SUPERVISOR_ARR;
        var supIdArr = row.SUPERVISOR_ID.split(',');
        var supNameArr = row.SUPERVISOR.split(',');
        for(var i = 0; i < supIdArr.length; i++){
          if('' != classIdArr[i]){
            supResultArr.push({
              TEACHER_ID: supIdArr[i],
              TEACHER_NAME: supNameArr[i]
            });
          }
        }
        this.onGradeChange(row.GRADE_ID);
        //在点击编辑时将参与考试的班级ID字符串赋值给查询参数
        this.examClassQryParams.classIdStr = row.CLASS_ID_STR;
        this.examSupQryParams.teacherIdStr = row.SUPERVISOR_ID;

        this.examDialogVisible = true;
      }
    },
    //新增或变更处理操作
    dealExamSure(){
      if(this.validationForm()){
        var p = JSON.parse(JSON.stringify(this.examDealForm));
        this.$axios.post('/examAction.do?method=dealExam', p).then((response) => {
          if(response.status == "addSuccess"){
            this.$message({
              showClose: true,
              message: '考试发布成功！',
              type: 'success'
            });
            this.examDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else if(response.status == "editSuccess"){
            this.$message({
              showClose: true,
              message: '考试重新发布成功！',
              type: 'success'
            });
            this.examDialogVisible = false;
            setTimeout(()=>{this.searchInfo()}, 1000);
          } else {
            this.$message({
              showClose: true,
              message: '考试发布出错！',
              type: 'error'
            });
          }
        });
      }
    },
    //点击删除钮时
    deleteExam (index, row) {
      this.$confirm('对应成绩将一并清空，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var p = JSON.parse(JSON.stringify({'EXAM_ID':row.EXAM_ID}));
        this.$axios.post('/examAction.do?method=deleteExam', p).then((response) => {
          if(response.status == "deleteSuccess"){
            this.examTableData.splice(index, 1);
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

    //导入考试成绩
    importExamScore(index, row){
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
      if(row.IS_IMPORT_SCORE == 1){
        this.$confirm('将对同一学号的学生成绩进行覆盖，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.classOptions = [];
          var classIdArr = row.CLASS_ID_STR.split(',');
          var classNameArr = row.CLASS_NAME_STR.split(',');
          for(var i = 0; i < classIdArr.length; i++){
            if('' != classIdArr[i]){
              this.classOptions.push({
                itemKey: classIdArr[i],
                itemValue: classNameArr[i]
              });
            }
          }
          this.importDialogTitle = '批量导入【' + row.EXAM_NAME + '】考试成绩';
          this.uploadForm.examId = row.EXAM_ID;
          this.importDialogVisible = true;
        }).catch(() => {
          this.$message({
            showClose: true,
            type: 'info',
            message: '已取消导入覆盖！'
          });          
        });
      } else {
        this.importDialogTitle = '批量导入【' + row.EXAM_NAME + '】考试成绩';
        this.uploadForm.examId = row.EXAM_ID;
        this.importDialogVisible = true;
      }
    },
    //文件上传提交
    submitUpload: function () {
      if(this.validationUploadForm()){
        this.$refs.upload.submit();
      }
    },
    //文件上传前检查
    beforeUpload: function (file) {
      file.url = excel;
      var fileName=new Array()
      fileName =file.name.split('.');
      const extension = fileName[fileName.length-1] === 'xls'
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
    
    sizeChange(val) {
      this.params.pageSize = val;
      this.searchInfo();
    },
    currentChange(val) {
      this.params.pageNum = val;
      this.searchInfo();
    },
    examClassTableSizeChange(val) {
      this.examClassQryParams.pageSize = val;
      this.searchInfo();
    },
    examClassTableCurrentChange(val) {
      this.examClassQryParams.pageNum = val;
      this.searchInfo();
    },
    examSupTableSizeChange(val) {
      this.examSupQryParams.pageSize = val;
      this.searchInfo();
    },
    examSupTableCurrentChange(val) {
      this.examSupQryParams.pageNum = val;
      this.searchInfo();
    }
  }
};
</script>
<style>
  /* 表格斑马线 */
  .examList .el-table--border th, .el-table--border td{
    border-right:1px solid #dfe6ec;
  }
  /* 操作表单列表各项下距离缩短 */
  .examList .examDealForm .el-form-item{
    margin-bottom: 10px;
  }
  /* 操作表单列表时间控件下距离缩短 */
  .examList .examDealForm .el-form-item.time-item{
    margin-bottom: 0px;
  }
  /* 操作表单列表文本域上距离缩短 */
  .examList .examDealForm .formArea{
    margin-top: 0px;
  }
  /* 表单中错误信息显示上距离缩短 */
  .examList .examDealForm .el-form-item__error{
    padding-top: 0px;
  }
  /* 弹出框表格主下方距离缩短 */
  .examList .el-dialog__body{
    padding:10px 20px;
  }
  /* 弹出框超长后隐藏overflow滚动条 */
  .examList .el-dialog__wrapper.heightDialog{
    overflow: hidden;
  }
  /* 弹出框top缩短--为了时间控件能够展现全 */
  .examList .el-dialog__wrapper.heightDialog .el-dialog{
    margin-top: 10vh !important;
  }
  /* 表单下拉框宽度100% */
  .examList .examDealForm .el-select{
    width: 100%;
  }
  /* 表单时间控件宽度100% */
  .examList .examDealForm .el-date-editor{
    width: 100%;
  }
  /* 表单中标签间隔调整 */
  .examList .examDealForm .el-tag{
    margin-right: 5px;
    vertical-align: middle;
    height: auto;
  }
  /* 表单中第一个标签左侧间隔跳转 */
  .examList .examDealForm .el-tag:first-child{
    margin-left: 0;
  }
  /* 分组下拉框标题字体调大 */
  .el-select-group__title{
    font-size: 16px;
  }
  /* 分组下拉框内容字体调小 */
  .el-select-dropdown__item{
    font-size: 14px;
  }
  /* 下面都是表格的展开行样式 */
  .exam-table-expand {
    font-size: 0;
  }
  .exam-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .exam-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }



  /* 下面可以考虑放入公共css中，统一格式 */
  
  /* 导入弹出框内容居中 */
  .examList .uploadScore{
    text-align: center;
  }
  /* 导入表单中上传拖拽框高度调小 */
  .examList .uploadScore .el-upload-dragger{
    height: 130px;
  }
  /* 导入表单中上传拖拽框中图片top调小 */
  .examList .uploadScore .el-icon-upload{
    margin: 16px 0 16px;
  }
  
  /* 导入表单上传文件列表（单个）文件默认图片取消 */
  .examList .uploadScore .el-upload-list .el-icon-document:before{
    content: "";
  }
  /* 导入表单上传文件列表（单个）文件图片高度宽度调小 */
  .examList .uploadScore .el-upload-list.el-upload-list--picture .el-upload-list__item-thumbnail{
    width: 65px;
    height: 60px;
  }
  /* 导入表单上传文件列表（单个）内部top调小10 - 0 */
  .examList .uploadScore .el-upload-list .el-upload-list__item{
    padding: 0px 10px 10px 90px;
  }
  /* 导入表单上传文件列表文字调整top调小20 - 15 */
  .examList .uploadScore .el-upload-list.el-upload-list--picture .el-upload-list__item-name{
    margin-top: 15px;
  }
  /* 导入表单上传文件列表（单个）文件高度调整调小92 - 60 */
  .examList .uploadScore .el-upload-list.el-upload-list--picture .el-upload-list__item{
    height: 60px;
  }
</style>
