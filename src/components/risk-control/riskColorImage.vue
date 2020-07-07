<template>
  <el-container class="inner-page-container" v-loading="pageLoading">
    <el-header class="inner-header">
      <bread-crumb :breadList="breadcrumb">
      </bread-crumb>
    </el-header>
    <el-main class="inner-main-container">
      <div class="body-box">
        <div class="body-menu">
          <div class="menu-item" @click="zoomUp">
            <div class="menu-icon menu-icon-1">
              <i class="el-icon-zoom-in"></i>
            </div>
            <p>放大</p>
          </div>
          <div class="line-out">
            <div class="line"></div>
          </div>
          <div class="menu-item" @click="zoomDown">
            <div class="menu-icon menu-icon-1">
              <i class="el-icon-zoom-out"></i>
            </div>
            <p>缩小</p>
          </div>
          <div class="line-out">
            <div class="line"></div>
          </div>
          <div class="menu-item" @click="addPoint" :class="pointAble ? 'active' : ''">
            <div class="menu-icon menu-icon-1">
              <i class="el-icon-map-location"></i>
            </div>
            <p>添加风险点</p>
          </div>
          <div class="line-out">
            <div class="line"></div>
          </div>
          <div class="menu-item" @click="addUnit" :class="unitAble ? 'active' : ''">
            <div class="menu-icon menu-icon-1">
              <i class="el-icon-edit-outline"></i>
            </div>
            <p>添加二级风险单元</p>
          </div>
          <div class="line-out">
            <div class="line"></div>
          </div>
          <div class="menu-item" @click="cancel">
            <div class="menu-icon menu-icon-1">
              <i class="el-icon-refresh-left"></i>
            </div>
            <p>撤销</p>
          </div>
          <div class="line-out">
            <div class="line"></div>
          </div>
          <div class="menu-item" @click="saveChange">
            <div class="menu-icon menu-icon-1">
              <i class="el-icon-document-checked"></i>
            </div>
            <p>保存修改</p>
          </div>
        </div>
        <div class="body-body">
          <div class="body-header">
            <span class="label">当前位置：</span>
            <el-select v-model="currentMap" placeholder="请选择" size="medium" @change="optionChange()">
              <el-option v-for="(item, index) in mapLists" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>

            <i class="el-icon-delete del-btn" v-if="fucBtns.includes('del-btn')" title="删除" @click="deleteMap()"></i>
            <i class="el-icon-upload2 upload-btn" v-if="fucBtns.includes('upload-btn')" title="上传新图片" @click="uploadNewMap()"></i>
            <i class="el-icon-plus add-btn" v-if="fucBtns.includes('add-btn')" title="添加位置" @click="addMap()"></i>
          </div>
          <div class="canvas-box">
            <div style="display:none;" v-if="mapLists.length > 0 && currentImage.url !== ''">
              <img id="source"
                   :src="currentImage.url"
                   :width="currentImage.width"
                   :height="currentImage.height">
            </div>

            <!-- 暂无地图，需要上传新地图 -->
            <div v-if="currentMap && !currentImage.url" class="up-new-map">
              <el-button size="medium" type="primary" @click="uploadNewMap()"><i class="el-icon-upload2"></i> 上传新图片</el-button>
            </div>

            <!-- 暂无地图，需要新建新地图 -->
            <div v-show="mapLists.length === 0" class="up-new-map">
              <el-button size="medium" type="primary" @click="addMap()"><i class="el-icon-plus"></i> 添加位置</el-button>
            </div>

            <canvas id="myCanvas" ref="canvas" v-show="mapLists.length > 0"
                    :width="currentImage.width"
                    :height="currentImage.height"
                    style="background-color: #fff;"
                    @mousedown="mousedown"
                    @mousemove="mousemove"
                    @mouseup="mouseup"
                    @mouseleave="leaveCanvas"
                    @mouseenter="enterCanvas"
                    @contextmenu="openMenu"
            >
              Your browser does not support the HTML5 canvas tag.<br>
              您所使用浏览器不支持CANVAS标签，请使用Chrome浏览器、火狐浏览器或IE11版本以上的浏览器
            </canvas>

            <div class="mouse-menu" v-show="showMenu" v-bind:style="`top: ${menuPosition.top}px; left: ${menuPosition.left}px`">
              <template v-if="!bound">
                <div class="mouse-menu-item" @click="bind()">绑定</div>
                <div class="mouse-menu-item" @click="deleteItem()">删除</div>
              </template>
              <template v-else>
                <div class="mouse-menu-item" @click="checkItem()">查看</div>
                <div class="mouse-menu-item" @click="rebind()">重新绑定</div>
                <div class="mouse-menu-item" @click="deleteItem()">删除</div>
              </template>
            </div>
          </div>

          <!-- 绑定风险点 -->
          <el-dialog title="绑定风险点" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
                     :visible.sync="bindVisible"
                     width="480px" :append-to-body="true">
            <el-form label-width="120px">
              <el-form-item label="风险点名称：">
                <el-select v-model="bindSelection"  placeholder="请选择" size="medium">
                  <el-option
                    v-for="item in bindOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="bindVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmBind()">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 重新绑定风险点 -->
          <el-dialog title="重新绑定风险点" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
                     :visible.sync="rebindVisible"
                     width="480px" :append-to-body="true">
            <el-form label-width="120px">
              <el-form-item label="风险点名称：">
                <el-select v-model="rebindSelection"  placeholder="请选择" size="medium">
                  <el-option
                    v-for="item in bindOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="rebindVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmReBind()">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 上传弹窗 -->
          <el-dialog title="上传" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
                     :visible.sync="uploadVisible"
                     v-loading="uploadLoading"
                     width="580px" :append-to-body="true">
            <el-form
              ref="messageForm"
              label-width="100px"
              label-position="right">
              <el-form-item label="上传图片">
                <el-upload
                  class="upload-demo"
                  :action="baseUrl"
                  :data="uploadData"
                  :limit="1"
                  accept=".png, .jpg"
                  :before-upload="handleBeforeUpload"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :file-list="fileList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传.jpg，.png格式的图片</div>
                </el-upload>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="uploadVisible = false">取 消</el-button>
              <el-button type="primary" @click="confirmUpload()">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 查看的侧边展示栏 -->
          <div class="slide-temp" :class="slideOpen ? 'active' : ''" v-loading="slidLoading">
            <p
              style="line-height: 30px; font-size: 24px; margin-bottom: 8px;"><i class="el-icon-circle-close" @click="slideOpen = false"></i>
            </p>
            <el-table ref="slideTable"
                      border
                      stripe
                      :data="slideTable"
                      tooltip-effect="dark"
                      style="width: 100%">
              <el-table-column
                label="风险点名称"
                align="center">
                <template slot-scope="scope">{{ scope.row.riskSourceName }}</template>
              </el-table-column>
              <el-table-column
                label="风险等级"
                width="100"
                align="center">
                <template slot-scope="scope">
                  <el-tag
                    size="mini"
                    effect="dark"
                    :class="classObj(scope.row.riskLevelCode)">
                    {{ scope.row.riskLevel}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="主要危害因素"
                align="center">
                <template slot-scope="scope">{{ scope.row.factor }}</template>
              </el-table-column>
              <el-table-column
                label="管控措施"
                align="center">
                <template slot-scope="scope">
                  {{ (scope.row.technology ? scope.row.technology + ';' : '')
                    + (scope.row.bmp ? scope.row.bmp + ';' : '')
                    + (scope.row.train? + scope.row.train + ';' : '')
                    + (scope.row.individual ? scope.row.individual + ';' : '')
                    + (scope.row.emergency ? scope.row.emergency + ';' : '') }}
                </template>
              </el-table-column>
              <el-table-column
                label="风险点详情"
                width="110"
                align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="checkOutDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 四色图风险点详情 -->
          <el-dialog title="风险点详情"
                    :visible.sync="detailVisible"
                    width="580px" :append-to-body="true">
            <div class="detail-p">
              <div class="detail-key">风险点：</div>
              <div class="detail-value">{{`${detailData.oneName}-${detailData.twoName}-${detailData.riskName}`}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">作业步骤：</div>
              <div class="detail-value">{{detailData.work}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">风险类别/事故后果：</div>
              <div class="detail-value">{{detailData.riskSourceType}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">风险因素：</div>
              <div class="detail-value">{{detailData.factor}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">风险点类别：</div>
              <div class="detail-value">{{detailData.riskType}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">三级风险单元编号：</div>
              <div class="detail-value">{{`${detailData.oneNo}-${detailData.twoNo}-${detailData.orderNo}`}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">应采取的管控措施：</div>
              <div class="detail-value">{{detailData.mustCs}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">管控措施依据的标准和规范：</div>
              <div class="detail-value">{{detailData.csStand}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">技术措施：</div>
              <div class="detail-value">{{detailData.technology}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">管理措施：</div>
              <div class="detail-value">{{detailData.bmp}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">教育措施：</div>
              <div class="detail-value">{{detailData.train}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">防护措施：</div>
              <div class="detail-value">{{detailData.individual}}</div>
            </div>
            <div class="detail-p">
              <div class="detail-key">应急措施：</div>
              <div class="detail-value">{{detailData.emergency}}</div>
            </div>
          </el-dialog>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'
import {
  getPlaceSelector,
  getRiskSelector,
  getUnitSelector,
  addPlace,
  bindLayer,
  getLayer,
  delMap,
  delPoint,
  uploadPic,
  checkItemDetail,
  checkUnitDetail,
  getImageSize
} from '@/api/riskControl'
import base from '@/api/baseUrl'
import {getQiNiuToken} from '@/api/upload'
import axios from '@/api/axios'

export default {
  name: 'riskColorImage',
  data () {
    return {
      breadcrumb: ['风险分级管控', '风险四色图'],
      baseUrl: '',
      fileAddress: '',
      uploadData: {
        token: ''
      },
      fileList: [],
      uploadImageUrl: '',
      pageLoading: false,
      mapLists: [], // map 选项列表
      currentMap: '', // 当前所选のmap
      layers: [], // 新建图层,包括新建的图标，用 type 作为区分
      oldLayers: [], // 之前存在的图层
      fillStyles: ['#a3a3a3', '#d13a38', '#ff9309', '#fffb09', '#4680ff'],
      imageStyles: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACOklEQVRIS9WVv2sUQRTHv28vp2AhYmnQP0CSuz0j7swc8UenYBAtrBRiJ1pYWqloaWWlWClodwghYKGNB97N7QYlu5tCxMaAYJk0igi3T3ZxdS/e3s5ejoBbzr73/cz3vTczhB3+aId5+D+Aq0osVpi+1Xq9VtkKlXYYKLkE8LkYxOAlW3vny0BLAX0pjxGxlwVYEQ7Puu4HU2gpYKDkBsD7suIM/mpr78DEgWFT3mbmu8OECbhS0+5TE6iRw3dzc9Xq7urPVJAY7aSHhJPp2sfpg1MXW61+EdQIGCgRA06kYlGEUw3XbQdKcLrGzI/tnnd128BAiAVYWM4KDQPG/ytWZM90VoJR0EKHoZLrDD5kAmSwb2uvMTYwUPIBwDe2CuQ5/H02L9vae54HzXXoSzlNxF+GJY4CxvFkTe2vdTobORM9fC++FMtEWBgHyMB9W7s3jYGhEosMPMkrS5HDJI+i4/XuytutGkNLGiixBmBmW0Dwq7r2ThcCfencI6JboyYtApIbxwLujD53fL2uvYfZmAGHq0rZFqIugD1FB9jsP2/2UbGPaL2exg8AQyWeMXCpSCzuYeLQwpuiWACP6tq99g/Qb4oLxHhhIACjockIWbDOzmr9MpmldD1UosuAMgGOEdOpa3f+D3Bt3qlFfRp5B44BGUghi4/WOt77xOEnx9n7vULxq238kJbcwOdo149Go+1v/i1pU5zpM5ySQkbhBNa29l4P9NAocwJBhc/TBBiDvZy0YJHeLwsl5B31eUctAAAAAElFTkSuQmCC',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACFElEQVRIS9WVv2sUQRzF3zt/3VxAxEZQ8A8QkQuIguCPdAoG0cJKQTvJZTdYWaloaSW7MSGVgdiJEAIW2nigESwExcJWQbD0LHK7nt4+uctxZt3b3dmcHDjVsvu+77NvZr4zxIgHR8zD/wGUV74Cco1O8LjoDBVOKM8sgzjXAy3TCc4XgRYCyjNHQLyJAUrtA6y1PtpCiwF98w3Arpi58JVusPefAzVbvgXxzkDjkq6yFi7aQK0SagHb0DKtDYb13vOp/rs9wVZeRDsPagf0TB3EyT9mmqAT1uUb9d9JC3TDa0MD5VUmQa3EjQYAOwKVqnTX3mdBcxPKN58B7LcCAu/oBOObBso39wHMJA1SEnaFukwnfJQGTU2oebMPv/BlcGEWEMCW7bs59b3TQomRDvTMCojJTQGBe3SCG9bA3ln5MH0tchJ2Z1Yn6IYv//YYmFB++QPAg0MBoWd0wtO5QPmVu4BuZvZTpPUTp8Tb2X3HGp3m3EZNLKEejFURRasAKnkNbPm9AarK6bDTWt0RB/pmCcClfDNN9Mpf5GqJeU4HUwmgPHMBxJNcg/VeSx5tWYXiWbrNp7GEmjWrEI7ZAQuqhFd0g+N9oObGDqEdZZ6BBRFJecTDnGm+7a6hPOwETefWtr5IC/0A8Qk/d4zzeqPR3zTyK2cQRUcLGdmKqdd0fzxP7FLb+mF0udfTMOaDakcO/A38Z8gdevKgTAAAAABJRU5ErkJggg==',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACIElEQVRIS9WVPYgTURSFz50xjYWIpYKkSCUiWRAFwb9OwWXRIpWCNkG0kJCZ+5hCRavMfRAkhWK1gnYiLIKFNi7oChaCYmGrIFjuNkKQDFcmZJdsksm82UjAVw0z555vzvu5jzDnQXPm4f8AishVAL+Z+XnRGSqcUERWACylIFVdMcZcLAItBIzj+BgRfRwGqOohY8w3V2ghoLV2XVX3jgB/GWP2/3OgiNwBcC/D+BozP3GBOiWs1+ulSqXyZ8hwdfB8ZvNduVzeVavVkjyoE1BEUsDpTbMkSc5GUbQqIjoEeMzM12cGWmsXVfXlsFEGEL7vV5vN5pdp0NyEIvIDwEEXIIDPzLywY6CIPABwa9QgK2GqI6IrYRg+y4JmJmy32wd6vd7PSYXTgKk+SZJ9URStT6rNBIpIum6LOwECEGY2zsBBr1zOmpa8hIO6U8z8btRjYkIR+Qrg8CxAVX1tjDmXC4zj+D4R3Z6201S133GI6G6O7qYx5uGwZltCEakCWAOwO+8AO37f8DyvGgRBerT6YxT4FMDlPLN0DVON7/tv87QAHjHzjTFgHMeXiOiFg0G67Se1tsxSIroQhuGrbQmttWuqesIFWFRDRO/DMDy5BbTWHlHVqT2wKGRU73ne0SAIPvXXsNPp7Ol2u+mt7XyRFvyB76VSaaHRaGxsbZpWq3WeiI4XNHKSE9EHZn4ztkudqmcU5V5PM/qPlc8d+BciVeUd9MidXQAAAABJRU5ErkJggg=='
      ],
      imageIcon1: {},
      imageIcon2: {},
      imageIcon3: {},
      currentR: null, // 当前点击的矩形{obj}
      startx: 0, // 起始x坐标
      starty: 0, // 起始y坐标
      flag: false, // 是否是mousedown的状态
      x: 0,
      y: 0,
      leftDistance: 0,
      topDistance: 0,
      op: 0, // 操作类型：0 无操作 1 画矩形框 2 拖动矩形框 -1 绘制点图标 -2 拖动点图标
      scale: 1,
      type: 0, // 设置绘制图形类型：0 矩形， 1 点
      currentImage: {
        url: '',
        width: 0,
        height: 0
      },
      minWidth: 1180,
      minHeight: 747,
      maxWidth: 9000,
      maxHeight: 7000,
      scaleStep: 1.5,
      elementWidth: 1180,
      elementHeight: 747,
      bound: false, // 所点击的元素，是否是已绑定的
      showMenu: false, // 显示右键菜单
      menuPosition: {
        top: 0,
        left: 0
      },
      slideOpen: false, // 右侧滑出部分
      slideTable: [],
      bindVisible: false,
      bindOptions: [],
      pointOptions: [],
      unitOptions: [],
      bindSelection: null, // 绑定的选项
      rebindVisible: false,
      rebindSelection: null, // 重新绑定的选项
      uploadVisible: false,
      uploadLoading: false,
      slidLoading: false,
      starshMenu: null, // 暂存右键的值
      detailVisible: false,
      detailData: {},
      unitAble: false, // 是否激活“添加风险单元”
      pointAble: false, // 是否激活“添加添加风险点”
      ctx: {}, // 提前设置canvas对象
      canvas: {},
      fucBtns: [] // 获取按钮权限

    }
  },
  mounted () {
    let vm = this
    // 将所有图片的image生成提前，避免渲染顺序问题
    vm.imageIcon1 = new Image()
    vm.imageIcon1.src = vm.imageStyles[0]
    vm.imageIcon2 = new Image()
    vm.imageIcon2.src = vm.imageStyles[1]
    vm.imageIcon3 = new Image()
    vm.imageIcon3.src = vm.imageStyles[2]
    let image = new Image()
    image.src = vm.imageStyles[0]
    vm.canvas = this.$refs.canvas
    vm.ctx = vm.canvas.getContext('2d') // 直接全局设置canvas活动对象
    document.onclick = function () {
      vm.showMenu = false // 关闭自定义右键menu
    }
    vm.getPointSelector()
    vm.getUnitSelector()
    vm.getPlaceSelector(0)// 初始化时，获取map列表
  },
  created () {
    let vm = this
    vm.baseUrl = base.uploadQiniuAdr
    vm.fileAddress = base.fileQiniuAddr
    this.getBtnAuthority()
  },
  methods: {
    // 点击 添加风险点
    addPoint () {
      this.unitAble = false
      this.pointAble = true
    },
    // 点击 添加风险单元
    addUnit () {
      this.pointAble = false
      this.unitAble = true
    },
    // 获取风险单元选项列表
    getUnitSelector () {
      let vm = this
      vm.pageLoading = true
      getUnitSelector().then(res => {
        if (res.code === 200) {
          vm.unitOptions = res.data
        } else {
          vm.$message({
            type: 'warning',
            message: '数据失败， 请稍后重试'
          })
        }
        vm.pageLoading = false
      })
    },
    // 获取风险点选项列表
    getPointSelector () {
      let vm = this
      vm.pageLoading = true
      getRiskSelector().then(res => {
        if (res.code === 200) {
          vm.pointOptions = res.data
        } else {
          vm.$message({
            type: 'warning',
            message: '数据失败， 请稍后重试'
          })
        }
        vm.pageLoading = false
      })
    },
    // 获取所有的map；0：初始化；1：添加后更新map；2：删除后更新map
    getPlaceSelector (type) {
      let vm = this
      vm.pageLoading = true
      getPlaceSelector().then(res => {
        if (res.code === 200) {
          vm.mapLists = res.data
          if (type === 0) {
            vm.currentMap = vm.mapLists[0] ? vm.mapLists[0].value : ''
          } else if (type === 1) {
            vm.currentMap = vm.mapLists[vm.mapLists.length - 1].value
          } else if (type === 2) {
            vm.currentMap = vm.mapLists[0] ? vm.mapLists[0].value : ''
          }
          vm.getOldLayers()
        } else {
          vm.$message({
            type: 'warning',
            message: '数据失败，请稍后重试'
          })
        }
        vm.pageLoading = false
      })
    },
    /** 获取当前map下原有记录的racts & points，顺便使用drawOldLayers()方法重绘 **/
    getOldLayers () {
      let vm = this
      vm.pageLoading = true
      if (vm.currentMap) {
        getLayer(vm.currentMap).then(res => {
          if (res.code === 200) {
            vm.oldLayers = res.data
            vm.currentImage.url = res.map.backgroundUrl
            if (vm.currentImage.url) {
              /** 获取图片尺寸 **/
              getImageSize(vm.currentImage.url).then(res => {
                vm.currentImage.width = res.width
                vm.currentImage.height = res.height
                vm.canvas.width = res.width
                vm.canvas.height = res.height
                vm.$nextTick(() => {
                  vm.initCanvas() // 获取背景图片的宽高后，再进行绘制（尤其是背景图），避免绘制先执行，所导致的白屏
                })
              })
            }
          } else {
            vm.$message({
              type: 'warning',
              message: '获取数据失败，请稍后重试'
            })
          }
          vm.pageLoading = false
        })
      }
    },
    zoomUp () {
      let vm = this
      if (vm.canvas.width <= vm.maxWidth && vm.canvas.height <= vm.maxHeight) {
        vm.canvas.width *= vm.scaleStep
        vm.canvas.height *= vm.scaleStep
        vm.scale = vm.canvas.height / vm.currentImage.height
        vm.ctx.scale(vm.scale, vm.scale)
        vm.canvas.style.backgroundSize = `${vm.canvas.width}px ${vm.canvas.height}px`
        vm.initCanvas()
      }
    },
    zoomDown () {
      let vm = this
      const c = document.getElementById('myCanvas')

      if (vm.canvas.width >= vm.currentImage.width && vm.canvas.height >= vm.currentImage.height) {
        vm.canvas.width /= vm.scaleStep
        vm.canvas.height /= vm.scaleStep
        vm.scale = c.height / vm.currentImage.height
        vm.ctx.scale(vm.scale, vm.scale)
        vm.canvas.style.backgroundSize = `${vm.canvas.width}px ${vm.canvas.height}px`
        vm.initCanvas()
      }
    },
    cancel () {
      let vm = this
      vm.layers.pop()
      vm.ctx.clearRect(0, 0, vm.currentImage.width, vm.currentImage.height)
      vm.initCanvas()
    },
    /* 清空画板，顺便再initCanvas，根据当前的数据重绘 */
    clear () {
      let vm = this
      vm.layers = []
      vm.ctx.clearRect(0, 0, vm.currentImage.width, vm.currentImage.height)
      vm.initCanvas()
    },
    saveChange () { // 保存修改
      let vm = this
      vm.pageLoading = true
      let allLayers = vm.oldLayers.concat(vm.layers)

      let postD = {
        id: vm.currentMap,
        layers: allLayers
      }
      bindLayer(postD).then(res => {
        if (res.code === 200) {
          vm.layers = [] // 因为修改的layers以及保存了，再次加载时，作为oldLayers加载，故layers清空
          vm.getOldLayers()
        } else {
          vm.$message({
            type: 'warning',
            message: '保存失败，请稍后重试'
          })
        }
        vm.pageLoading = false
      })
    },
    resizeLeft (rect) {
      let vm = this
      vm.canvas.style.cursor = 'w-resize'
      if (vm.flag && vm.op === 0) {
        vm.op = 3
      }
      if (vm.flag && vm.op === 3) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.x1 = vm.x
        vm.currentR.width = vm.currentR.x2 - vm.currentR.x1
      }
    },
    resizeTop (rect) {
      let vm = this
      vm.canvas.style.cursor = 's-resize'
      if (vm.flag && vm.op === 0) {
        vm.op = 4
      }
      if (vm.flag && vm.op === 4) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.y1 = vm.y
        vm.currentR.height = vm.currentR.y2 - vm.currentR.y1
      }
    },
    resizeWidth (rect) {
      let vm = this
      vm.canvas.style.cursor = 'w-resize'
      if (vm.flag && vm.op === 0) {
        vm.op = 5
      }
      if (vm.flag && vm.op === 5) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.x2 = vm.x
        vm.currentR.width = vm.currentR.x2 - vm.currentR.x1
      }
    },
    resizeHeight (rect) {
      let vm = this
      vm.canvas.style.cursor = 's-resize'
      if (vm.flag && vm.op === 0) {
        vm.op = 6
      }
      if (vm.flag && vm.op === 6) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.y2 = vm.y
        vm.currentR.height = vm.currentR.y2 - vm.currentR.y1
      }
    },
    resizeLT (rect) {
      let vm = this
      vm.canvas.style.cursor = 'se-resize'
      if (vm.flag && vm.op === 0) {
        vm.op = 7
      }
      if (vm.flag && vm.op === 7) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.x1 = vm.x
        vm.currentR.y1 = vm.y
        vm.currentR.height = vm.currentR.y2 - vm.currentR.y1
        vm.currentR.width = vm.currentR.x2 - vm.currentR.x1
      }
    },
    resizeWH (rect) {
      let vm = this
      vm.canvas.style.cursor = 'se-resize'
      if (vm.flag && vm.op === 0) {
        vm.op = 8
      }
      if (vm.flag && vm.op === 8) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.x2 = vm.x
        vm.currentR.y2 = vm.y
        vm.currentR.height = vm.currentR.y2 - vm.currentR.y1
        vm.currentR.width = vm.currentR.x2 - vm.currentR.x1
      }
    },
    resizeLH (rect) {
      let vm = this
      vm.canvas.style.cursor = 'ne-resize'
      if (vm.flag && vm.op === 0) {
        vm.op = 9
      }
      if (vm.flag && vm.op === 9) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.x1 = vm.x
        vm.currentR.y2 = vm.y
        vm.currentR.height = vm.currentR.y2 - vm.currentR.y1
        vm.currentR.width = vm.currentR.x2 - vm.currentR.x1
      }
    },
    resizeWT (rect) {
      let vm = this
      vm.canvas.style.cursor = 'ne-resize'
      if (vm.flag && vm.op === 0) {
        vm.op = 10
      }
      if (vm.flag && vm.op === 10) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.x2 = vm.x
        vm.currentR.y1 = vm.y
        vm.currentR.height = vm.currentR.y2 - vm.currentR.y1
        vm.currentR.width = vm.currentR.x2 - vm.currentR.x1
      }
    },
    initCanvas () {
      this.drawOldLayers()
      this.drawNewLayers()
    },
    drawImage () {
      let vm = this
      if (vm.currentImage.url) {
        let img = new Image()
        img.src = vm.currentImage.url
        vm.ctx.drawImage(img, 0, 0, vm.canvas.width, vm.canvas.height)
      }
    },
    /** 绘制后台传过来的数据
     * 包括背景图，风险单元，风险点 **/
    drawOldLayers () {
      let vm = this
      vm.drawImage() // 放到循环前执行，避免由于性能问题，导致的闪屏

      const iconLayers = [] // 设置图标集合
      const rectLayers = [] // 设置块集合

      vm.oldLayers.forEach(item => {
        if (item.riskType === 0) {
          rectLayers.push(item)
        } else {
          iconLayers.push(item)
        }
      })

      // 先绘制块，风险单元
      rectLayers.forEach(item => {
        vm.ctx.beginPath()
        vm.ctx.rect(item.x1, item.y1, item.width, item.height)
        vm.ctx.strokeStyle = vm.fillStyles[item.level]
        vm.ctx.fillStyle = vm.fillStyles[item.level]
        vm.ctx.globalAlpha = 0.7
        vm.ctx.fill()
        vm.ctx.stroke()
        vm.ctx.font = '20px Georgia'
        vm.ctx.fillStyle = 'black'
        vm.ctx.textAlign = 'center'
        vm.ctx.textBaseline = 'middle'
        vm.ctx.fillText(item.riskName, (item.x1 + item.width / 2), (item.y1 + item.height * 0.5), item.width)
        vm.ctx.stroke()
      })

      // 再绘制点，风险点
      iconLayers.forEach(item => {
        let image = new Image()
        if (item.level === 1) {
          image = vm.imageIcon1
        } else if (item.level === 2) {
          image = vm.imageIcon2
        } else {
          image = vm.imageIcon3
        }
        vm.ctx.beginPath()
        vm.ctx.drawImage(image, item.x1 - 14, item.y1 - 14, 28, 28)
      })

      vm.op = 0 // 在旧节点上，无拖动、放大操作
    },
    /** 绘制缓存里的layers图层
     * 绘制图形（擦除后重绘 or 第一遍加载时绘制）
     * **/
    drawNewLayers (x, y) {
      let vm = this
      let allNotIn = 1

      vm.layers.forEach(item => {
        if (item.riskType === 0) {
          vm.ctx.beginPath()
          vm.ctx.rect(item.x1, item.y1, item.width, item.height)
          if (x >= (item.x1 - 25 / vm.scale) && x <= (item.x1 + 25 / vm.scale) && y <= (item.y2 - 25 / vm.scale) && y >= (item.y1 + 25 / vm.scale)) {
            vm.resizeLeft(item)
          } else if (x >= (item.x2 - 25 / vm.scale) && x <= (item.x2 + 25 / vm.scale) && y <= (item.y2 - 25 / vm.scale) && y >= (item.y1 + 25 / vm.scale)) {
            vm.resizeWidth(item)
          } else if (y >= (item.y1 - 25 / vm.scale) && y <= (item.y1 + 25 / vm.scale) && x <= (item.x2 - 25 / vm.scale) && x >= (item.x1 + 25 / vm.scale)) {
            vm.resizeTop(item)
          } else if (y >= (item.y2 - 25 / vm.scale) && y <= (item.y2 + 25 / vm.scale) && x <= (item.x2 - 25 / vm.scale) && x >= (item.x1 + 25 / vm.scale)) {
            vm.resizeHeight(item)
          } else if (x >= (item.x1 - 25 / vm.scale) && x <= (item.x1 + 25 / vm.scale) && y <= (item.y1 + 25 / vm.scale) && y >= (item.y1 - 25 / vm.scale)) {
            vm.resizeLT(item)
          } else if (x >= (item.x2 - 25 / vm.scale) && x <= (item.x2 + 25 / vm.scale) && y <= (item.y2 + 25 / vm.scale) && y >= (item.y2 - 25 / vm.scale)) {
            vm.resizeWH(item)
          } else if (x >= (item.x1 - 25 / vm.scale) && x <= (item.x1 + 25 / vm.scale) && y <= (item.y2 + 25 / vm.scale) && y >= (item.y2 - 25 / vm.scale)) {
            vm.resizeLH(item)
          } else if (x >= (item.x2 - 25 / vm.scale) && x <= (item.x2 + 25 / vm.scale) && y <= (item.y1 + 25 / vm.scale) && y >= (item.y1 - 25 / vm.scale)) {
            vm.resizeWT(item)
          }
          if (vm.ctx.isPointInPath(x * vm.scale, y * vm.scale)) {
            vm.render(item)
            allNotIn = 0
          }
          vm.ctx.strokeStyle = vm.fillStyles[item.level]
          vm.ctx.fillStyle = vm.fillStyles[item.level]
          vm.ctx.globalAlpha = 0.7
          vm.ctx.fill()
          vm.ctx.stroke()
        } else {
          /* 绘制点图标，无需resize功能
           * 但需要对点图标的矩形位置进行重新定位
           * 使用矩形中心进行定位
          */
          if (vm.ctx.isPointInPath(x * vm.scale, y * vm.scale)) {
            let pointRact = {
              bindId: item.bindId,
              height: 28,
              level: item.level,
              picid: item.picid,
              type: item.type,
              riskType: item.riskType,
              width: 28,
              x1: item.x1,
              x2: item.x2,
              y1: item.y1,
              y2: item.y2
            }
            vm.render(pointRact)
            allNotIn = 0
          }
          let image = {}
          if (item.level === 1) {
            image = vm.imageIcon1
          } else if (item.level === 2) {
            image = vm.imageIcon2
          } else {
            image = vm.imageIcon3
          }
          vm.ctx.beginPath()
          vm.ctx.drawImage(image, item.x1 - 14, item.y1 - 14, 28, 28)
        }
      })
      if (vm.flag && allNotIn && vm.op < 3) {
        vm.op = 1
      }
    },
    render (rect) {
      let vm = this
      vm.canvas.style.cursor = 'move'
      if (vm.flag && vm.op === 0) {
        vm.op = 2 // 此时为拖动
      }
      if (vm.flag && vm.op === 2) {
        if (!vm.currentR) {
          vm.currentR = rect
        }
        vm.currentR.x2 += vm.x - vm.leftDistance - vm.currentR.x1
        vm.currentR.x1 += vm.x - vm.leftDistance - vm.currentR.x1
        vm.currentR.y2 += vm.y - vm.topDistance - vm.currentR.y1
        vm.currentR.y1 += vm.y - vm.topDistance - vm.currentR.y1
      }
    },
    /** 确定是否是在绘制的矩形中 (匹配 layers) **/
    isPointInRect (x, y) {
      let vm = this
      let len = vm.layers.length
      for (let i = 0; i < len; i++) {
        let itemLayer = vm.layers[i]
        if (itemLayer.riskType === 0) {
          if (itemLayer.x1 < x && x < itemLayer.x2 && itemLayer.y1 < y && y < itemLayer.y2) {
            return itemLayer
          }
        } else {
          if ((itemLayer.x1 - 14) < x && x < (itemLayer.x1 + 14) && (itemLayer.y1 - 14) < y && y < (itemLayer.y1 + 14)) {
            return itemLayer
          }
        }
      }
    },
    /** 匹配是否是在原有的矩形中 (匹配 oldLayers) **/
    isPointInOld (x, y) {
      let vm = this
      let len = vm.oldLayers.length
      let rect = null
      let point = null
      for (let i = 0; i < len; i++) {
        let itemLayer = vm.oldLayers[i]
        if (itemLayer.riskType !== 0) {
          if ((itemLayer.x1 - 14) < x && x < (itemLayer.x1 + 14) && (itemLayer.y1 - 14) < y && y < (itemLayer.y1 + 14)) {
            point = itemLayer
          }
        } else {
          if (itemLayer.x1 < x && x < itemLayer.x2 && itemLayer.y1 < y && y < itemLayer.y2) {
            rect = itemLayer
          }
        }
      }
      if (point) {
        return point
      } else {
        return rect
      }
    },
    /** 绘制矩形时，默认最小60*60 **/
    fixPosition (position) {
      if (position.x1 > position.x2) {
        let x = position.x1
        position.x1 = position.x2
        position.x2 = x
      }
      if (position.y1 > position.y2) {
        let y = position.y1
        position.y1 = position.y2
        position.y2 = y
      }
      position.width = position.x2 - position.x1
      position.height = position.y2 - position.y1
      if (position.width < 50 || position.height < 50) {
        position.width = 60
        position.height = 60
        position.x2 += position.x1 + 60
        position.y2 += position.y1 + 60
      }
      return position
    },
    mousedown (e) {
      if (e.button === 0) {
        console.log('mousedown: mousedown')
      } else {
        console.log('mousedown: menu')
        return
      }
      let vm = this
      // 鼠标按下时，实时添加风险单元的绘制
      if (vm.unitAble) {
        vm.startx = e.layerX / vm.scale
        vm.starty = e.layerY / vm.scale
        vm.currentR = vm.isPointInRect(vm.startx, vm.starty)
        if (vm.currentR) {
          vm.leftDistance = vm.startx - vm.currentR.x1
          vm.topDistance = vm.starty - vm.currentR.y1
        }
        vm.ctx.strokeRect(vm.x, vm.y, 0, 0)
        vm.ctx.strokeStyle = '#0000ff'
        vm.flag = true
      }
      /** 区别于矩形的绘制，需要记录两个点，添加点，只需要记录鼠标点击的点坐标(x1, y1)
        * 剩下的点，根据固定的28px宽高进行计算
        * 实时绘制风险点
        * 向layers里添加风险点
      **/
      if (vm.pointAble) {
        let image = new Image()
        image.src = vm.imageStyles[2] // 默认使用灰色图标
        vm.layers.push({
          x1: vm.x,
          y1: vm.y,
          x2: vm.x,
          y2: vm.y,
          type: vm.type,
          level: 0,
          bindId: '',
          picid: vm.currentMap,
          riskType: 1
        })
      }
    },
    mousemove (e) {
      let vm = this
      vm.x = e.layerX / vm.scale
      vm.y = e.layerY / vm.scale
      if (vm.unitAble) {
        vm.ctx.save()
        vm.ctx.setLineDash([5])
        vm.canvas.style.cursor = 'default'
        vm.ctx.clearRect(0, 0, vm.currentImage.width, vm.currentImage.height)
        if (vm.flag && vm.op === 1) {
          vm.ctx.strokeRect(vm.startx, vm.starty, vm.x - vm.startx, vm.y - vm.starty)
        }
        vm.ctx.restore()
        vm.drawOldLayers()
        vm.drawNewLayers(vm.x, vm.y)
      }
    },
    mouseup (e) {
      let vm = this

      if (vm.op === 1) {
        // 向此时的layers里注入新画的图层，point 或 rect
        if (vm.unitAble) {
          vm.layers.push(vm.fixPosition({
            x1: vm.startx,
            y1: vm.starty,
            x2: vm.x,
            y2: vm.y,
            type: vm.type,
            riskType: 0,
            level: 0,
            bindId: '', // 绑定的点的id
            picid: vm.currentMap // 绑定的map的id
          }))
        }
      } else if (vm.op >= 3) {
        vm.fixPosition(vm.currentR)
      }

      vm.currentR = null
      vm.flag = false
      vm.drawNewLayers(vm.x, vm.y)
      vm.op = 0
    },
    openMenu (e) {
      let vm = this
      vm.startx = e.layerX / vm.scale
      vm.starty = e.layerY / vm.scale

      if (vm.isPointInRect(vm.startx, vm.starty)) {
        vm.currentR = vm.isPointInRect(vm.startx, vm.starty)
        vm.starshMenu = vm.currentR
        vm.bound = false
      } else if (vm.isPointInOld(vm.startx, vm.starty)) {
        vm.currentR = vm.isPointInOld(vm.startx, vm.starty)
        vm.starshMenu = vm.currentR
        vm.bound = true
      } else {
        vm.currentR = null
      }
      if (vm.currentR) {
        vm.leftDistance = vm.startx - vm.currentR.x1
        vm.topDistance = vm.starty - vm.currentR.y1
      } else {
        console.log('not in Rects')
        return
      }

      e.preventDefault() // 阻止右键的默认窗口

      this.menuPosition = {
        top: e.offsetY,
        left: e.offsetX
      }
      this.showMenu = true
      console.log('openMenu', vm.currentR)
    },
    leaveCanvas () {
      this.canvas.onmousedown = null
      this.canvas.onmousemove = null
      this.canvas.onmouseup = null
    },
    enterCanvas () {
      // document.onmouseup = this.mouseup()
    },
    optionChange () {
      let vm = this
      vm.ctx.clearRect(0, 0, vm.currentImage.width, vm.currentImage.height)
      vm.getOldLayers()
      vm.layers = []
      vm.drawOldLayers()
    },
    addMap () {
      let vm = this
      vm.pageLoading = true
      vm.$prompt('请输入位置名称', '添加位置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        let postData = {
          name: value
        }
        addPlace(postData).then(res => {
          if (res.code === 200) {
            vm.$message({
              type: 'success',
              message: '节点添加成功'
            })
            vm.getPlaceSelector(1) // 更新map列表
            vm.ctx.clearRect(0, 0, vm.currentImage.width, vm.currentImage.height)
            vm.getOldLayers() // 重绘
          }
          vm.pageLoading = false
        })
      }).catch(() => {
        // after cancel
        vm.pageLoading = false
      })
    },
    deleteMap () {
      let vm = this
      vm.$confirm('此操作将永久删除该地图和相关节点信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let postD = {
          id: vm.currentMap
        }
        delMap(postD).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            vm.getPlaceSelector(2) // 更新map列表
            // 再初始化其他的绘图元素
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败，请稍后重试'
            })
          }
          // 重新请求，then，重新绘图
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    checkItem () {
      let vm = this
      vm.slidLoading = true
      vm.slideOpen = true
      console.log('item', vm.currentR)
      if (vm.currentR.riskType === 0) {
        checkUnitDetail(vm.starshMenu.bindId).then(res => {
          if (res.code === 200) {
            vm.slideTable = res.data
            vm.slidLoading = false
          } else {
            vm.slidLoading = false
            vm.slideOpen = false
            vm.$message({
              type: 'warning',
              message: '数据获取失败，请稍后重试'
            })
          }
        })
      } else {
        checkItemDetail(vm.starshMenu.bindId).then(res => {
          if (res.code === 200) {
            vm.slideTable = res.data
            vm.slidLoading = false
          } else {
            vm.slidLoading = false
            vm.slideOpen = false
            vm.$message({
              type: 'warning',
              message: '数据获取失败，请稍后重试'
            })
          }
        })
      }
    },
    deleteItem () {
      let vm = this
      vm.$confirm('此操作将永久删除该位置信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (vm.bound) { // 是odlData，需要请求后台，删除该点
          let postD = {
            id: vm.currentR.id
          }
          delPoint(postD).then(res => {
            if (res.code === 200) {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              vm.$message({
                type: 'warning',
                message: '删除失败，请稍后重试'
              })
            }
            // 重新请求，then，重新绘图
            vm.getOldLayers()
          })
        } else { // 直接在本地删除即可，只需在最后保存阶段前从layers里删除
          for (let i = 0; i < vm.layers.length; i++) {
            if (vm.layers[i].x1 === vm.starshMenu.x1 && vm.layers[i].y1 === vm.starshMenu.y1) {
              vm.layers.splice(i, 1)
            }
          }
          vm.clear()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    classObj (data) {
      if (data === '4') {
        return 'tag-low'
      } else if (data === '3') {
        return 'tag-normal'
      } else if (data === '2') {
        return 'tag-warning'
      } else if (data === '1') {
        return 'tag-danger'
      }
    },
    bind () {
      let vm = this
      if (vm.currentR.riskType === 0) { // 绑定风险单元，切换选项
        vm.bindOptions = vm.unitOptions
      } else {
        vm.bindOptions = vm.pointOptions
      }
      vm.bindVisible = true
    },
    rebind () {
      let vm = this
      if (vm.currentR.riskType === 0) { // 绑定风险单元
        vm.bindOptions = vm.unitOptions
      } else {
        vm.bindOptions = vm.pointOptions
      }
      vm.rebindVisible = true
    },
    uploadNewMap () {
      this.uploadVisible = true
    },
    /** 点击查看详情 **/
    checkOutDetail (data) {
      this.detailVisible = true
      this.detailData = data
    },
    confirmBind () { // 提交绑定区域
      let vm = this
      vm.layers.forEach(item => {
        if (item.x1 === vm.currentR.x1 && item.y1 === vm.currentR.y1) {
          item.bindId = vm.bindSelection.value
          item.level = vm.bindSelection.level
        }
      })
      vm.bindVisible = false
    },
    confirmReBind () { // 提交重新绑定
      let vm = this
      vm.oldLayers.forEach(item => {
        if (item.x1 === vm.currentR.x1 && item.y1 === vm.currentR.y1) {
          item.bindId = vm.rebindSelection.value
          item.level = vm.rebindSelection.level
        }
      })
      vm.rebindVisible = false
    },
    handleBeforeUpload (file) {
      return getQiNiuToken().then((res) => {
        this.uploadData.token = res
      })
    },
    handleSuccess (response, file, fileList) {
      let vm = this
      vm.fileList = fileList
      vm.uploadImageUrl = vm.fileAddress + fileList[0].response.key
    },
    handleRemove (file, fileList) {
      this.uploadImageUrl = ''
    },
    confirmUpload () {
      let vm = this
      vm.uploadLoading = true
      if (!vm.uploadImageUrl) {
        vm.$message({
          message: '请上传图片',
          type: 'warning'
        })
        return
      }
      let postD = {
        backgroundUrl: vm.uploadImageUrl,
        id: vm.currentMap
      }
      uploadPic(postD).then(res => {
        if (res.code === 200) {
          vm.$message({
            type: 'success',
            message: '添加成功'
          })
          vm.getOldLayers() // 重新获取数据，再重新绘制
        } else {
          vm.$message({
            type: 'warning',
            message: '添加失败，请稍后重试'
          })
        }
        vm.fileList = []
        vm.uploadImageUrl = ''
      })
      vm.uploadLoading = false
      vm.uploadVisible = false
    },
    // 获取按钮权限方法
    getBtnAuthority () {
      const authId = {authId: '4-6'}
      axios
        .get('user/getBtnArray', authId)
        .then((res) => {
          if (res.data.code === 200) {
            this.fucBtns = res.data.data.functionBtns
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
    }
  },
  components: {
    TreeDiagram,
    BreadCrumb
  }
}
</script>

<style lang="scss" scoped>
@import '@/utils/css/tools/_variables.scss';
  .inner-page-container{
    .body-box{
      padding-left: 100px;
      position: relative;
      width: 100%;
      height: 100%;
      .body-menu{
        position: absolute;
        left: 0;
        top: 0;
        width: 92px;
        height: 100%;
        line-height: 50px;
        background: #fff;
        padding: 21px 17px;
        .menu-item{
          width: 100%;
          color: #646464;
          cursor: pointer;
          &.active{
            color: #409eff;
            .menu-icon{
              background: #e4edf7;
            }
          }
          .menu-icon{
            width: 47px;
            height: 44px;
            border-radius: 2px;
            margin: auto;
            font-size: 24px;
            text-align: center;
            line-height: 44px;
          }
          p{
            line-height: 24px;
            text-align: center;
          }
          &:hover{
            color: #409eff;
            .menu-icon{
              background: #e4edf7;
            }
          }
        }
        .line-out{
          width: 100%;
          padding: 5px 2px;
          .line{
            width: 100%;
            border-top: 1px solid #e5e5e5;
          }
        }
      }
      .body-body{
        padding-top: 58px;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .body-header{
          position: absolute;
          top: 0;
          width: 100%;
          height: 50px;
          line-height: 50px;
          background: #fff;
          .label{
            color: #999;
            font-size: 16px;
            padding-left: 18px;
          }
          i{
            font-size: 24px;
            color: #999;
            cursor: pointer;
            float: right;
            line-height: 50px;
            margin: 0 15px;
          }
        }
        .canvas-box{
          position: relative;
          width: 100%;
          height: 100%;
          background: #fff;
          overflow: auto;
          .up-new-map{
            position: absolute;
            top: 35%;
            width: 100%;
            text-align: center;
          }
        }
        .slide-temp{
          position: absolute;
          top: 0;
          right: -905px;
          width: 900px;
          border: 1px solid #ddd;
          height: 100%;
          overflow: auto;
          background: #fff;
          padding: 20px;
          box-shadow: -1px 2px 5px #c0c4cc;
          transition: all 0.3s ease-in;
          &.active{
            right: 0;
          }
        }
      }
      .mouse-menu{
        position: absolute;
        width: 100px;
        border: 1px solid #dbdbdb;
        background: #fff;
        border-radius: 4px;
        z-index: 100001;
        .mouse-menu-item{
          line-height: 24px;
          padding: 0 10px;
          font-size: 16px;
          border-bottom: 0.5px solid #e9ecee;
          color: #474747;
          cursor: pointer;
          &:last-child{
            border-bottom: none;
          }
          &:hover{
            background: #e9ecee;
          }
        }
      }
    }
  }
  .detail-p{
    position: relative;
    padding-left: 15em;
    font-size: 15px;
    min-height: 20px;
    line-height: 20px;
    .detail-key{
      position: absolute;
      top: 0;
      left: 0;
      width: 14em;
      text-align: right;
    }
  }
</style>
