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
        </div>
        <div class="body-body">
          <div class="body-header">
            <span class="label">当前位置：</span>
            <el-select v-model="mapSelection" placeholder="请选择" size="medium">
              <el-option v-for="(item, index) in listAA" :key="index" label="状态一" value="shanghai"></el-option>
            </el-select>

            <i class="el-icon-delete" title="删除"></i>
            <i class="el-icon-upload2" title="上传"></i>
            <i class="el-icon-plus" title="添加"></i>
          </div>
          <div class="canvas-box">
            <canvas id="myCanvas"
                    width="1180" height="800"
                    style="border:1px solid #d3d3d3;"
                    @mousedown="mousedown"
                    @mousemove="mousemove"
                    @mouseup="mouseup"
            >
              Your browser does not support the HTML5 canvas tag.
            </canvas>
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
      listAA: [],
      mapSelection: '',
      layers: [
        {
          height: 274,
          strokeStyle: '#0000ff',
          type: 0,
          width: 362,
          x1: 182,
          x2: 544,
          y1: 109,
          y2: 383
        }
      ], // 图层
      currentR: null, // 当前点击的矩形{obj}
      startx: 0, // 起始x坐标
      starty: 0, // 起始y坐标
      flag: false, // 是否点击鼠标的标志
      x: 0,
      y: 0,
      leftDistance: 0,
      topDistance: 0,
      op: 0, // op操作类型 0 无操作 1 画矩形框 2 拖动矩形框
      scale: 1,
      type: 0,
      img: {
        url: 'https://yyb.gtimg.com/aiplat/page/product/visionimgidy/img/demo6-16a47e5d31.jpg?max_age=31536000',
        width: 500,
        height: 570
      },
      minWidth: 1180,
      minHeight: 800,
      maxWidth: 9000,
      maxHeight: 7000,
      scaleStep: 1.05,
      elementWidth: 1180,
      elementHeight: 800
    }
  },
  mounted () {
    this.canvas_init()
  },
  created () {

  },
  methods: {
    canvas_init () {
      console.log(this.layers)
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')
      // const img = document.createElement('img')
      const img = new Image()
      img.src = this.img.url
      console.log(img)
      img.onload = function () {
        c.style.backgroundImage = `url(${img.src})`
        c.style.backgroundSize = this.img.width + 'px ' + this.img.height + 'px'
        c.style.backgroundRepeat = 'no-repeat'
        // let prtn = ctx.createPattern(img, 'no-repeat')
        // ctx.fillStyle = prtn
        // ctx.fillRect(0, 0, 900, 700)
      }
      ctx.drawImage(img, 10, 10, this.img.width, this.img.height)
      c.onmouseenter = this.enterCanvas()
      c.onmouseleave = this.leaveCanvas()
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
        vm.scale = c.height / vm.minHeight
        ctx.scale(vm.scale, vm.scale)
        c.style.backgroundSize = `${c.width}px ${c.height}px`
        vm.reshow()
      }
    },
    zoomDown () {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      if (c.width >= vm.minWidth && c.height >= vm.minHeight) {
        c.width /= vm.scaleStep
        c.height /= vm.scaleStep
        vm.scale = c.height / vm.minHeight
        ctx.scale(vm.scale, vm.scale)
        c.style.backgroundSize = `${c.width}px ${c.height}px`
        vm.reshow()
      }
    },
    cancel () {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')
      vm.layers.pop()
      ctx.clearRect(0, 0, vm.elementWidth, vm.elementHeight)
      vm.reshow()
    },
    clear () {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')
      vm.layers = []
      ctx.clearRect(0, 0, vm.elementWidth, vm.elementHeight)
      vm.reshow()
    },
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
    reshow (x, y) {
      let vm = this
      let allNotIn = 1
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      vm.layers.forEach(item => {
        ctx.beginPath()
        ctx.rect(item.x1, item.y1, item.width, item.height)
        ctx.strokeStyle = item.strokeStyle
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
    isPointInRetc (x, y) {
      let vm = this
      let len = vm.layers.length
      for (let i = 0; i < len; i++) {
        if (vm.layers[i].x1 < x && x < vm.layers[i].x2 && vm.layers[i].y1 < y && y < vm.layers[i].y2) {
          return vm.layers[i]
        }
      }
    },
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
      console.log('mousedown:')
      console.log(e)
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      vm.startx = (e.pageX - c.offsetLeft + c.parentElement.scrollLeft) / vm.scale
      vm.starty = (e.pageY - c.offsetTop + c.parentElement.scrollTop) / vm.scale
      vm.currentR = vm.isPointInRetc(vm.startx, vm.starty)
      if (vm.currentR) {
        vm.leftDistance = vm.startx - vm.currentR.x1
        vm.topDistance = vm.starty - vm.currentR.y1
      }
      ctx.strokeRect(vm.x, vm.y, 0, 0)
      ctx.strokeStyle = '#0000ff'
      vm.flag = 1
    },
    mousemove (e) {
      let vm = this
      const c = document.getElementById('myCanvas')
      const ctx = c.getContext('2d')

      vm.x = (e.pageX - c.offsetLeft + c.parentElement.scrollLeft) / vm.scale
      vm.y = (e.pageY - c.offsetTop + c.parentElement.scrollTop) / vm.scale
      ctx.save()
      ctx.setLineDash([5])
      c.style.cursor = 'default'
      ctx.clearRect(0, 0, vm.elementWidth, vm.elementHeight)
      if (vm.flag && vm.op === 1) {
        ctx.strokeRect(vm.startx, vm.starty, vm.x - vm.startx, vm.y - vm.starty)
      }
      ctx.restore()
      vm.reshow(vm.x, vm.y)
    },
    mouseup (e) {
      console.log('mousedown:')
      console.log(e)
      console.log(this.layers)

      let vm = this

      if (vm.op === 1) {
        vm.layers.push(vm.fixPosition({
          x1: vm.startx,
          y1: vm.starty,
          x2: vm.x,
          y2: vm.y,
          strokeStyle: '#0000ff',
          type: vm.type
        }))
      } else if (vm.op >= 3) {
        vm.fixPosition(vm.currentR)
      }
      vm.currentR = null
      vm.flag = 0
      vm.reshow(vm.x, vm.y)
      vm.op = 0
    },
    leaveCanvas () {
      const c = document.getElementById('myCanvas')
      c.onmousedown = null
      c.onmousemove = null
      c.onmouseup = null
    },
    enterCanvas () {
      document.onmouseup = this.mouseup()
      // c.onmousedown= this.mousedown()
      // c.onmousemove= this.mousemove()
    }
  },
  components: {
    TreeDiagram,
    BreadCrumb
  }
}
</script>

<style lang="scss" scoped>
  @import '../../utils/css/style.scss';

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
        padding: 21px 19px;
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
          width: 100%;
          height: 100%;
          background: #fff;
        }
      }
      .body-aside{}
    }
  }

  /deep/.inner-main-container{}
</style>
