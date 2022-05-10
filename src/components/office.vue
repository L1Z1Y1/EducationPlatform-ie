<template>
  <div>
     <div class="selection">
            <button class="select_button" id="backToStreetBtn" @click="HandleBackStreet()"></button>
            <button class="select_button" id="videoPlayerBtn" @click="HandleVideoDialog('888')"></button>
            <button class="select_button" id="readerBtn" @click="HandleReaderDialog('888')"></button>
            <button class="select_button" id="personalCenterBtn" @click="HandlepersonDialog()"></button>
      </div>
    <canvas class="c" ref="ThreeJS">
    </canvas>
    <videoplayer title="学习视频" v-if="openVideoDialog" ref="videoplayer"/>
    <reader title="文本阅读" v-if="openReaderDialog" ref="reader"/>
    <person title="个人中心" v-if="openPersonDialog" ref="person"/>
  </div>
</template>

<script>
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import videoplayer from "./videoplayer";
import reader from "./ebook";
import person from './person.vue';

export default {
  components:{
    //注册组件
    videoplayer,
    reader,
    person
  },
  data() {
    return {
      canvasW:0,
      canvasH:0,  
      cameraParam: {
        fov: 30,
        aspect: 1,
        near: 1,
        far: 1000
      },
      events: {
      raycaster: null,
      pickPosition: { x: 0, y: 0 },
      pickedObject: null,
      pickedObjectSavedColor: 0,
      },
      openVideoDialog:false,
      openReaderDialog:false,
      openPersonDialog:false,
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
    this.loader;
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
    this.loader=null;
    this.canvas= null;
    removeEventListener('click', this.clickPickPosition);
    removeEventListener('mousemove', this.setPickPosition);
  },
  methods: {
    start(){
      //初始化三元素
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
      this.scene.background = new THREE.Color('white');
    },
    initCamera(){
      // 远景相机
      this.camera = new THREE.PerspectiveCamera(
        this.cameraParam.fov,this.cameraParam.aspect,
        this.cameraParam.near,this.cameraParam.far);
      this.camera.position.set(0,-23,0);
      this.scene.add(this.camera);
    },
    initRenderer(){
      this.canvas = this.$refs.ThreeJS;
       // 渲染器gitgit 
      this.renderer = new THREE.WebGLRenderer({ 
        canvas: this.canvas,
        antialias: true,//是否开启反锯齿，设置为true开启反锯齿。
        alpha: true,//是否可以设置背景色透明。
      });
      // 是否显示阴影
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    },
    addLight(){
      //灯光
      this.scene.add( new THREE.AmbientLight(0x404040,5));
      this.light = new THREE.PointLight( 0xffffff,1, 10);
      this.light.position.set(-3,-6,4);
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
      //你能够将相机向内移动多少
      this.controls.minDistance  = 10;
      //你能够将相机向外移动多少
      this.controls.maxDistance  = 20;
      //是否可以旋转
      this.controls.enableRotate = false;
      //是否开启右键拖拽
      this.controls.enablePan = true;
      
      //监听鼠标、键盘事件
      this.controls.addEventListener('change', this.render);
    },
    loadModel(){
      this.loadScene();
      this.loadTeacher();
    },
    loadScene(){
      let that = this;
      this.loader = new FBXLoader();
      this.loader.load(
        '/static/Scene_Office.FBX',
        function ( object ) {
          object.scale.set(0.04,0.04,0.04); 
          object.rotateX(3.14/1.6);
          object.position.set(-4,-6,-5);
          object.traverse(function (child) {
	          if(child instanceof THREE.Mesh){
              // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
              var textureLoader = new THREE.TextureLoader();
              // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
              textureLoader.load('/static/OfficeTexture.png', function(texture) {
              child.material.map=texture;
              });
              child.material.needsUpdate=true;
              child.castShadow = child.receiveShadow = true;
              }
	        });
          that.scene.add( object );
          },
        function ( xhr ) {
          console.log( ( 'scene ' +xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
          console.log( 'An error happened in scene model' );
        }
      );
    },
    loadTeacher(){
      let that = this;
      this.loader = new FBXLoader();
      this.loader.load(
        '/static/teacher.fbx',
        function ( object ) {
          object.scale.set(0.0035,0.0035,0.0035); 
          object.traverse(function (child) {
	          if(child instanceof THREE.Mesh){
              // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
              var textureLoader = new THREE.TextureLoader();
              // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
              textureLoader.load('/static/teacher.jpg', function(texture) {
              child.material.map=texture;
              });
              child.material.needsUpdate=true;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          object.rotateX(Math.PI/1.7);
          object.position.set(4.5,-3,-3);
          that.scene.add( object );
        },
        function ( xhr ) {
          console.log( ( 'teacher '+xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
          console.log( 'An error happened in teacher model' );
        }
      );
    },
    clickPickPosition(){
      this.pickEvents(this.events.pickPosition, this.scene, this.camera, obj=>{
        console.log(`您选中了--${obj.name}`);
        //点击显示器，打开播放视频界面
        if(obj.name=='SO_Monitor_01PostItNotes'){
          this.HandleVideoDialog('88888');
        }
        //点击老师,打开领取任务界面
        if(obj.name=='hair' || obj.name=='girl' || obj.name=='dress'){
          
        }
        //点击书架,打开文本阅读界面
        if(obj.name=='SO_Shelf_02' || obj.name=='SO_Bookbox_001'|| obj.name=='SO_Bookbox_002'){
          if(this.openVideoDialog !=true){
          this.HandleReaderDialog('88888');}
        }
        else{
          for(let i=1;i<=17;i++){
            if(obj.name==('SO_Book_0'+i+'')){
              this.HandleReaderDialog('88888');
            }
          }
        }
      })
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
    //返回到街道
    HandleBackStreet(){
      this.$router.push('./street');
    },
    //视频播放界面
    HandleVideoDialog(data){
      if(this.openReaderDialog==false){
      this.openVideoDialog=true;
      this.$nextTick(()=>{
        this.$refs.videoplayer.init();
      })
      }
    },
    //关闭了视频播放界面
    closeVideoDialog(data){
      this.openVideoDialog=data;
    },
    //文本阅读界面
    HandleReaderDialog(data){
      if(this.openVideoDialog==false){
      this.openReaderDialog=true;
      this.$nextTick(()=>{
        this.$refs.reader.init();
      })
      }
    },
    //关闭了文本阅读界面
    closeReaderDialog(data) {
      this.openReaderDialog=data;
	  },
    //个人中心界面
    HandlepersonDialog(data){
      this.openPersonDialog=true;
      this.$nextTick(()=>{
        this.$refs.person.init(data);
      })
    },
  }
};    
</script>

<style>
.selection{
    position: absolute;
    width:500px;
    left: 1200px;
    top:30px;
}
.selection .select_button{
    width: 40px;
    height: 40px;
    margin: 10px;
    border:none;
}
#backToStreetBtn{
    background: url('../assets/退出.png') no-repeat;
}
#videoPlayerBtn{
    background: url('../assets/显示器.png') no-repeat;
}
#readerBtn{
    background: url('../assets/阅读.png') no-repeat;
}
#personalCenterBtn{
    background: url('../assets/个人中心.png') no-repeat;
}
</style>