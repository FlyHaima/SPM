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
              <el-option v-for="(item, index) in mapLists" :key="index" :label="item" :value="item"></el-option>
            </el-select>

            <i class="el-icon-delete" title="删除" @click="deleteMap()"></i>
            <i class="el-icon-upload2" title="上传新图片" @click="uploadNewMap()"></i>
            <i class="el-icon-plus" title="添加位置" @click="addMap()"></i>
          </div>
          <div class="canvas-box">
            <div style="display:none;">
              <img id="source"
                   :src="img.url"
                   :width="img.width"
                   :height="img.height">
            </div>
            <canvas id="myCanvas"
                    :width="img.width" :height="img.height"
                    style="background-color: #fff;"
                    @mousedown="mousedown"
                    @mousemove="mousemove"
                    @mouseup="mouseup"
                    @mouseleave="leaveCanvas"
                    @mouseenter="enterCanvas"
                    @contextmenu="openMenu"
            >
              Your browser does not support the HTML5 canvas tag.<br>
              您所使用浏览器不支持CANVAS标签
            </canvas>

            <div class="mouse-menu" v-show="showMenu" v-bind:style="`top: ${menuPosition.top}px; left: ${menuPosition.left}px`">
              <template v-if="bound">
                <div class="mouse-menu-item">绑定</div>
                <div class="mouse-menu-item">删除</div>
              </template>
              <template v-else>
                <div class="mouse-menu-item">查看</div>
                <div class="mouse-menu-item">重新绑定</div>
                <div class="mouse-menu-item">删除</div>
              </template>
            </div>
          </div>
        </div>
        <div class="body-aside"></div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import BreadCrumb from '../Breadcrumb/Breadcrumb'
import TreeDiagram from '../tree-diagram/treeDiagram'

export default {
  name: 'riskColorImage',
  data () {
    return {
      breadcrumb: ['风险分级管控', '风险四色图'],
      pageLoading: false,
      mapLists: ['mapA', 'mapB', 'mapC'], // map 选项列表
      currentMap: '', // 当前所选のmap
      layers: [], // 新建图层
      oldLayers: [
        {
          height: 170,
          level: 2,
          type: 0,
          width: 110,
          x1: 182,
          x2: 544,
          y1: 109,
          y2: 383
        }
      ], // 之前存在的图层
      fillStyles: ['#a3a3a3', '#4680ff', '#fffb09', '#ff9309', '#d13a38'],
      currentR: null, // 当前点击的矩形{obj}
      startx: 0, // 起始x坐标
      starty: 0, // 起始y坐标
      flag: false, // 是否点击鼠标的标志
      x: 0,
      y: 0,
      leftDistance: 0,
      topDistance: 0,
      op: 0, // 操作类型：0 无操作 1 画矩形框 2 拖动矩形框
      scale: 1,
      type: 0,
      img: {
        url: 'https://yyb.gtimg.com/aiplat/page/product/visionimgidy/img/demo6-16a47e5d31.jpg?max_age=31536000',
        width: 399,
        height: 600
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
      }
    }
  },
  mounted () {
    this.canvas_init()
  },
  created () {
    let vm = this
    document.onclick = function () {
      // console.log('click document')
      vm.showMenu = false // 关闭自定义右键menu
    }
  },
  methods: {
    canvas_init () {
      this.showOld()
    },
    // 获取图片的原始尺寸
    checkImgSize (imgUrl) {
      let newImg = new Image()
      newImg.src = imgUrl
      let newW = 0
      let newH = 0
      newImg.onload = function () {
        // onload 耗费时间由网络而定
        newW = newImg.width
        newH = newImg.height
      }
      return [newW, newH]
    },
    zoomUp () {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      if (c.width <= vm.maxWidth && c.height <= vm.maxHeight) {
        c.width *= vm.scaleStep
        c.height *= vm.scaleStep
        vm.scale = c.height / vm.img.height
        ctx.scale(vm.scale, vm.scale)
        c.style.backgroundSize = `${c.width}px ${c.height}px`
        vm.showOld()
        vm.reshow()
      }
    },
    zoomDown () {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      // debugger
      if (c.width >= vm.img.width && c.height >= vm.img.height) {
        c.width /= vm.scaleStep
        c.height /= vm.scaleStep
        vm.scale = c.height / vm.img.height
        ctx.scale(vm.scale, vm.scale)
        c.style.backgroundSize = `${c.width}px ${c.height}px`
        vm.showOld()
        vm.reshow()
      }
    },
    cancel () {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')
      vm.layers.pop()
      ctx.clearRect(0, 0, vm.elementWidth, vm.elementHeight)
      vm.showOld()
      vm.reshow()
    },
    clear () {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')
      vm.layers = []
      ctx.clearRect(0, 0, vm.elementWidth, vm.elementHeight)
      vm.showOld()
      vm.reshow()
    },
    saveChange () {},
    resizeLeft (rect) {
      let vm = this
      const c = document.getElementById('myCanvas')

      c.style.cursor = 'w-resize'
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
      const c = document.getElementById('myCanvas')

      c.style.cursor = 's-resize'
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
      const c = document.getElementById('myCanvas')

      c.style.cursor = 'w-resize'
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
      const c = document.getElementById('myCanvas')

      c.style.cursor = 's-resize'
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
      const c = document.getElementById('myCanvas')

      c.style.cursor = 'se-resize'
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
      const c = document.getElementById('myCanvas')

      c.style.cursor = 'se-resize'
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
      const c = document.getElementById('myCanvas')

      c.style.cursor = 'ne-resize'
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
      const c = document.getElementById('myCanvas')

      c.style.cursor = 'ne-resize'
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
    drawImage () {
      const canvas = document.getElementById('myCanvas')
      const ctx = canvas.getContext('2d')

      let image = document.getElementById('source')

      ctx.drawImage(image, 0, 0, 399, 600)
    },
    // 绘制原有图形，包括背景图
    showOld () {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')
      vm.drawImage() // 放到循环前执行，避免由于性能问题，导致的闪屏
      // debugger
      vm.oldLayers.forEach(item => {
        ctx.beginPath()
        ctx.rect(item.x1, item.y1, item.width, item.height)
        ctx.strokeStyle = vm.fillStyles[item.level]
        ctx.fillStyle = vm.fillStyles[item.level]
        ctx.globalAlpha = 0.7
        ctx.fill()
        ctx.stroke()
      })

      vm.op = 0 // 在旧节点上，无拖动、放大操作
    },
    // 绘制图形（擦除后重绘or第一遍加载时绘制）
    reshow (x, y) {
      let vm = this
      let allNotIn = 1
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      vm.layers.forEach(item => {
        ctx.beginPath()
        ctx.rect(item.x1, item.y1, item.width, item.height)
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
        if (ctx.isPointInPath(x * vm.scale, y * vm.scale)) {
          vm.render(item)
          allNotIn = 0
        }
        ctx.strokeStyle = vm.fillStyles[item.level]
        ctx.fillStyle = vm.fillStyles[item.level]
        ctx.globalAlpha = 0.7
        ctx.fill()
        ctx.stroke()
      })
      if (vm.flag && allNotIn && vm.op < 3) {
        vm.op = 1
      }
    },
    render (rect) {
      let vm = this
      const c = document.getElementById('myCanvas')

      c.style.cursor = 'move'
      if (vm.flag && vm.op === 0) {
        vm.op = 2
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
    // 确定是否是在绘制的矩形中
    isPointInRect (x, y) {
      let vm = this
      let len = vm.layers.length
      for (let i = 0; i < len; i++) {
        if (vm.layers[i].x1 < x && x < vm.layers[i].x2 && vm.layers[i].y1 < y && y < vm.layers[i].y2) {
          return vm.layers[i]
        }
      }
    },
    // 绘制矩形时，默认最小60*60
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
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      vm.startx = e.layerX / vm.scale
      vm.starty = e.layerY / vm.scale
      vm.currentR = vm.isPointInRect(vm.startx, vm.starty)
      if (vm.currentR) {
        vm.leftDistance = vm.startx - vm.currentR.x1
        vm.topDistance = vm.starty - vm.currentR.y1
      }
      ctx.strokeRect(vm.x, vm.y, 0, 0)
      ctx.strokeStyle = '#0000ff'
      vm.flag = 1
      console.log(vm.currentR)
      console.log(vm.layers)
    },
    mousemove (e) {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      vm.x = e.layerX / vm.scale
      vm.y = e.layerY / vm.scale
      ctx.save()
      ctx.setLineDash([5])
      c.style.cursor = 'default'
      ctx.clearRect(0, 0, vm.elementWidth, vm.elementHeight)
      if (vm.flag && vm.op === 1) {
        ctx.strokeRect(vm.startx, vm.starty, vm.x - vm.startx, vm.y - vm.starty)
      }
      ctx.restore()
      vm.showOld(vm.x, vm.y)
      vm.reshow(vm.x, vm.y)
    },
    mouseup (e) {
      console.log('mouseup:', e)

      let vm = this

      if (vm.op === 1) {
        vm.layers.push(vm.fixPosition({
          x1: vm.startx,
          y1: vm.starty,
          x2: vm.x,
          y2: vm.y,
          type: vm.type,
          level: 0
        }))
      } else if (vm.op >= 3) {
        vm.fixPosition(vm.currentR)
      }
      vm.currentR = null
      vm.flag = 0
      vm.reshow(vm.x, vm.y)
      vm.op = 0
    },
    openMenu (e) {
      e.preventDefault()
      console.log('右键：', e)
      this.menuPosition = {
        top: e.offsetY,
        left: e.offsetX
      }
      this.showMenu = true
    },
    leaveCanvas () {
      const c = document.getElementById('myCanvas')
      c.onmousedown = null
      c.onmousemove = null
      c.onmouseup = null
    },
    enterCanvas () {
      document.onmouseup = this.mouseup()
    },
    optionChange () {
      console.log('optionChange', this.currentMap)
      // then 获取新mapの画板绘制数据
      // then 需要重新绘制画板 canvas_init()
    },
    addMap () {
      let vm = this
      vm.pageLoading = true
      vm.$prompt('请输入位置名称', '添加位置', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        // let postData = {
        //   riskName: value,
        //   pId: data.pId
        // }
        // addRiskTree(postData).then(res => {
        //   if (res.code === 200) {
        //     vm.$message({
        //       type: 'success',
        //       message: '节点设置成功'
        //     })
        //     vm.getRiskTree()
        //   }
        //   vm.pageLoading = false
        // })
      }).catch(() => {
        // after cancel
        vm.pageLoading = false
      })
    },
    uploadNewMap () {},
    deleteMap () {}
  },
  components: {
    TreeDiagram,
    BreadCrumb
  }
}
</script>

<style lang="scss" scoped>
  @import '@/utils/css/style.scss';

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
        }
      }
      .body-aside{}
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

  /deep/.inner-main-container{}
</style>
