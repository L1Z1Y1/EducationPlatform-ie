<template>
  <div>
    <canvas class="c" ref="ThreeJS"></canvas>
    <videoplayer title="学习视频" v-if="openVideoDialog" ref="videoplayer"/>
    <reader title="文本阅读" v-if="openReaderDialog" ref="reader"/>
  </div>
</template>

<script>
import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import videoplayer from "./videoplayer";
import reader from "./reader";

export default {
  components:{
    //注册组件
    videoplayer,
    reader
  },
  data() {
    return {
      camera: null,
      cameraPole: null,
      renderer: null,
      mesh: null,
      controls:null,
      light:null,
      scene:null,
      loader:null,
      canvas: null,
      canvasW: 0,
      canvasH: 0,
      cameraParam: {
        fov: 30,
        aspect: 1,
        near: 1,
        far: 1000
      },
      events: {
      raycaster: new THREE.Raycaster(),
      pickPosition: { x: 0, y: 0 },
      pickedObject: null,
      pickedObjectSavedColor: 0,
      },
      openVideoDialog:false,
      openReaderDialog:false,
    };
  },
  created(){
  this.canvasW = window.innerWidth;
  this.canvasH = window.innerHeight;
  // 初始化设置宽高比
  this.cameraParam.aspect = this.canvasW / this.canvasH
  },
  mounted() {
    this.start();
  },
  methods: {
    start(){
      //初始化三元素
      this.initMain();
      //启用渲染
      this.render();
    },
    initMain(){
      this.initScene();
      this.initCamera();
      this.initRenderer();
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
      this.camera.position.set(0,-23,16);
      this.scene.add(this.camera);
    },
    initRenderer(){
      this.canvas = this.$refs.ThreeJS;
       // 渲染器
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
      // this.light = new THREE.PointLight( 0xffffff,1, 100);
      // this.light.position.set(0,0,5);
      // this.light.castShadow = true;
      // this.scene.add(this.light);
      // //灯光阴影设置
      // this.light.shadow.mapSize.width = 512; 
      // this.light.shadow.mapSize.height = 512;
      // this.light.shadow.camera.near = 1;
      // this.light.shadow.camera.far = 1000;
      // //Create a helper for the shadow camera (optional)
      // var helper = new THREE.CameraHelper( this.light.shadow.camera );
      // this.scene.add( helper );
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
    loadModel(){
      this.loadScene();
      this.loadTeacher();
      this.loadmonitor();
    },
    loadScene(){
      let that = this;
      this.loader = new FBXLoader();
      this.loader.load(
        '/static/Scene.fbx',
        function ( object ) {
          object.scale.set(0.02,0.02,0.02); 
          object.rotation.x -= 0.9;
          object.position.set(0,-35,0);
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
          object.scale.set(0.004,0.004,0.004); 
          object.castShadow = true;
          object.receiveShadow = true;
          object.rotation.x += 0.6;
          object.rotation.y -= 1;
          object.position.set(8.5,-25,-5);
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
    loadmonitor(){
      let that = this;
      this.loader = new FBXLoader();
      this.loader.load(
        '/static/Monitor.fbx',
        function ( object ) {
          object.scale.set(2,2,2); 
          object.traverse(function (child) {
	          if(child instanceof THREE.Mesh){
              // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
              var textureLoader = new THREE.TextureLoader();
              // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
              textureLoader.load('/static/OfficeTexture.png', function(texture) {
              child.material.map=texture;
              });
              child.material.needsUpdate=true;
              child.castShadow = true;
              child.receiveShadow = true;
              }
	        });
          object.rotation.x += 0.7;
          object.position.set(-2.2,-25.7,-6);
          that.scene.add( object );
        },
        function ( xhr ) {
          console.log( ( 'Monitor '+xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
          console.log( 'An error happened in Monitor model' );
        }
      );
    },
    clickPickPosition(){
      this.pickEvents(this.events.pickPosition, this.scene, this.camera, obj=>{
        console.log(`您选中了--${obj.name}`);
        if(obj.name=='SO_Monitor_01PostItNotes'){
          this.HandleVideoDialog('88888');
        }
        if(obj.name=='hair' || obj.name=='girl' || obj.name=='dress'){
          //this.handleDialog('88888');
        }
        if(obj.name=='SM_Shelf_01'){
          this.HandleReaderDialog('88888');
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
    HandleVideoDialog(data){
      this.openVideoDialog=true;
      this.$nextTick(()=>{
        //这里的dialog与上面dialog-component组件里面的ref属性值是一致的
        //init调用的是dialog-component组件里面的init方法
        //data是传递给弹窗页面的值
        this.$refs.videoplayer.init(data);
      })
    },
    HandleReaderDialog(data){
      this.openReaderDialog=true;
      this.$nextTick(()=>{
        this.$refs.reader.init(data);
      })
    },
  }
};    
</script>

<style>
body {
  margin: 0;
}
</style>