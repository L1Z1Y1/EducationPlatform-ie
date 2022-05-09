<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <canvas class="s" ref="ThreeJS"></canvas>
    
    
  </div>


</template>

<script>
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  data() {
    return {
      canvasW: 0,
      canvasH: 0,
      cameraParam: {
        fov: 20,
        aspect: 1,
        near: 1,
        far: 4000
      },
      events: {
      raycaster: null,
      pickPosition: { x: 0, y: 0 },
      pickedObject: null,
      pickedObjectSavedColor: 0,
      },
      //登录卡片是否显示
      dialogVisible: false
    };
  },
  created(){
  this.canvasW = window.innerWidth;
  this.canvasH = window.innerHeight;
  // 初始化设置宽高比
  this.cameraParam.aspect = this.canvasW / this.canvasH
  },
  mounted() {
    this.controls;
    this.camera;
    this.cameraPole;
    this.renderer;
    this.light;
    this.scene;
    this.mtlloader;
    this.objloader;
    this.canvas;
    this.start();
  },
  beforeDestroy(){
    this.controls=null;
    this.camera=null;
    this.cameraPole=null;
    this.renderer=null;
    this.light=null;
    this.scene=null;
    this.mtlloader=null;
    this.objloader=null;
    this.canvas= null;
    removeEventListener('click', this.clickPickPosition);
    removeEventListener('mousemove', this.setPickPosition);
  },
  methods: {
    start(){
      //初始化
      this.initMain();
      //启用渲染
      this.render();
      //启用轨道控制器
      this.controler();
    },
    initMain(){
      this.initScene();
      this.initRenderer();
      this.initCamera();
      this.addLight();
      this.loadModel();
      this.clickEvents();
    },
    initScene(){
      // 场景对象Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x87CEEB);
    },
    initCamera(){
      // 远景相机
      this.camera = new THREE.PerspectiveCamera(
        this.cameraParam.fov,this.cameraParam.aspect,
        this.cameraParam.near,this.cameraParam.far);
      this.camera.position.set(0,-140,0);
      this.scene.add(this.camera);
    },    
    initRenderer(){
      this.canvas = this.$refs.ThreeJS;
       // 渲染器
      this.renderer = new THREE.WebGLRenderer({ 
        canvas: this.canvas,
        //是否开启反锯齿，设置为true开启反锯齿。
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      // 是否显示阴影
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    },
    addLight(){
      //灯光
      this.scene.add( new THREE.AmbientLight(0x404040,10));
      this.light = new THREE.PointLight( 0xffffff,1, 10);
      this.light.position.set(-6,-6,-5);
      this.light.castShadow = true;
      this.scene.add(this.light);
      //灯光阴影设置
      this.light.shadow.mapSize.width = 512; 
      this.light.shadow.mapSize.height = 512;
      this.light.shadow.camera.near = 1;
      this.light.shadow.camera.far = 1000;
    },
    render(){
      // 渲染场景 动画
      this.renderer.render(this.scene, this.camera);
      // 动态监听窗口尺寸变化
      if (this.resizeRendererToDisplaySize(this.renderer)) {
        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }
      requestAnimationFrame(this.render.bind(this))
    },
    resizeRendererToDisplaySize(renderer){
      const canvas = renderer.domElement;
      this.canvasW = window.innerWidth;
      this.canvasH = window.innerHeight;
      const needResize = canvas.width !== this.canvasW || canvas.height !== this.canvasH;
      if(needResize){
        this.renderer.setSize(this.canvasW, this.canvasH, false);
      }
      return needResize;
    },
    controler(){
      //轨道控制器
      this.controls = new OrbitControls(this.camera,this.renderer.domElement);
      //是否可以缩放
      this.controls.enableZoom = true;
      //是否可以旋转
      this.controls.enableRotate = true;
      //是否开启右键拖拽
      this.controls.enablePan = true;
      
      //监听鼠标、键盘事件
      this.controls.addEventListener('change', this.render);
    },
    loadModel(){
      this.loadStreetScene();
    },
    loadStreetScene(){
      let that=this;
      this.mtlLoader=new MTLLoader();
      this.objLoader=new OBJLoader();
      this.mtlLoader.load('/static/Scene_Street.mtl',
      function(materials){
          materials.preload();
          that.objLoader.setMaterials(materials);
          that.objLoader.load('/static/Scene_Street.obj',
          function ( obj ){
            obj.scale.set(0.35,0.35,0.35);
            obj.rotateX(Math.PI/1.79);
            obj.rotateY(Math.PI/10);
            //设置可以投影
            obj.children.forEach(item => {
              item.castShadow=true;
              item.receiveShadow=true;
            })
            that.scene.add( obj );
          },function(){
            console.log('import obj success!');
          },function(err){
            console.log('obj error',err);
          });
      },function(){
          console.log('import MTL success!');
      },function(err){
          console.log('mtl error',err);
      } );
    },

    //登陆卡片关闭
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    clickPickPosition(){
      //登入提示
      this.dialogVisible = true;

      console.log(this.dialogVisible)
      let data = { 'username': 'eee', 'password': '123123'};
      this.$axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: this.$qs.stringify(data),
        url:'/api/login',
      }).then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });


      // this.pickEvents(this.events.pickPosition, this.scene, this.camera, obj=>{
      //   console.log(`您选中了--${obj.name}`);
      //   //点击进入threejs工作室
      //   if(obj.name=='Building_House_02_color03_002'){
      //     this.HandleBackOffice();
      //   }
      // })
    },
    // 获取当前焦点坐标
    setPickPosition(event){
      const pos = this.getCanvasRelativePosition(event);
      this.events.pickPosition.x = (pos.x / this.canvas.width) * 2 - 1;
      this.events.pickPosition.y = (pos.y / this.canvas.height) * -2 + 1;
      this.pickEvents(this.events.pickPosition, this.scene, this.camera)
    },
    // 获取当前事件焦点坐标所在位置
    getCanvasRelativePosition(event){
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * this.canvas.width / rect.width,
        y: (event.clientY - rect.top) * this.canvas.height / rect.height
      }
    },
    // 添加鼠标划过以及点击事件
    clickEvents(){
      window.addEventListener('click', this.clickPickPosition);   
      window.addEventListener('mousemove', this.setPickPosition);
    },
    // 创建点击事件(默认是离摄像头最近的相交)
   pickEvents(normalizedPosition,scene, camera, callback){
     this.events.raycaster=new THREE.Raycaster();
     // 沿着摄像头的方向投射射线
     this.events.raycaster.setFromCamera(normalizedPosition, camera)
     // 获取与射线光线相交的对象列表
     const intersectedObjects = this.events.raycaster.intersectObjects(this.scene.children);
     if(intersectedObjects.length){
     // 获取与射线光纤相交的第一个对象。也是最近的一个
     this.events.pickedObject = intersectedObjects[0].object;
     if(callback){
       callback(this.events.pickedObject)
    }}
    },
    HandleBackOffice(){
      this.$router.push('./office');
    },
  }
};    
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>