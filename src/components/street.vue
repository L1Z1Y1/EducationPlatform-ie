<template>
  <div>
    <div class="selection" style="block">
      <button class="select_button" id="backToStreetBtn" @click="HandleLogout()"></button>
    </div>
    <!-- 登录卡片 -->
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="18%"
      :before-close="handleClose"
      style="vertical-align:center">
        <h2>Web3D教育平台</h2>
        <h4>用户登录</h4>
        <el-form
          :model="ruleForm"
          :visible.sync="dialogVisible"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="0"
          class="demo-ruleForm"
          style="vertical-align:center"
        >
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" prefix-icon="el-icon-user"  auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" prefix-icon="el-icon-user" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitLogin()" style="width:100%;">登录</el-button>
            <p class="login" @click="handleRegisterOpen()">没有账号？立即注册</p>
          </el-form-item>
        </el-form>
        <!-- <el-input placeholder="请输入用户名" v-model="username" prefix-icon="el-icon-user" style="margin-top:30px;width:70%"></el-input>
        <el-input placeholder="请输入密码" v-model="password" show-password prefix-icon="el-icon-lock" style="margin-top:30px;width:70%"></el-input>
        <el-button type="primary" @click="submitLogin()" style="margin-top:30px;width:70%">立即登录</el-button>
        <p class="login" @click="register()">没有账号？立即注册</p> -->
        <!-- <el-button @click="register()" style="margin:10px;width:70%">新人注册</el-button> -->
    </el-dialog>
    <!-- 注册卡片 -->
    <el-dialog
      title=""
      :visible.sync="registerVisible"
      width="18%"
      :before-close="handleClose"
      style="vertical-align:center">
        <h2>Web3D教育平台</h2>
        <h4>用户注册</h4>
        <el-form
          :model="ruleForm2"
          :visible.sync="registerVisible"
          status-icon
          :rules="rules2"
          ref="ruleForm2"
          label-width="0"
          class="demo-ruleForm"
          style="vertical-align:center"
        >
          <el-form-item prop="username">
            <el-input v-model="ruleForm2.username" prefix-icon="el-icon-user" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm2.password" prefix-icon="el-icon-lock" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" prefix-icon="el-icon-lock" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submintRegister('ruleForm2')" style="width:100%;">注册</el-button>
            <p class="login" @click="handleLoginOpen">已有账号？立即登录</p>
          </el-form-item>
        </el-form>

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
    // <!--验证密码-->
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"))
      } else {
        if (this.ruleForm2.checkPass !== "") {
          this.$refs.ruleForm2.validateField("checkPass");
        }
        callback()
      }
    }
    // <!--二次验证密码-->
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm2.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
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
      //登录卡片否显示
      dialogVisible: false,
      registerVisible:false,
      //表单1
      ruleForm: {
        username:"",
        password: "",
      },
      rules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }],
      },
      //表单2
      ruleForm2: {
        username:"",
        password: "",
        checkPass: "",
      },
      rules2: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度大于6个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }],
        checkPass: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'change' }],
      },
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

    //卡片关闭
    handleClose(done) {
      done();
      this.dialogVisible = false;
      this.registerVisible = false;
    },
    //登录卡片开启
    handleLoginOpen(done) {
        this.registerVisible = false;
        this.dialogVisible = true;
    },
    //登录提交
    submitLogin() {
      let data = { 'username': this.ruleForm.username, 'password': this.ruleForm.password};
      this.$axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: this.$qs.stringify(data),
        url:'/api/login',
      }).then( (res) => {
        //查到userId则跳转    
        if(res.data[0]){
          console.log(11111,res.data[0].userId)
          this.$message({
            message: '登录成功',
            type: 'success'
          });
          //保存用户信息
          localStorage.setItem('userId',res.data[0].userId);
          //跳转
          this.getClassId();
          this.HandleBackOffice();
        }else{
          this.$message({
            message: '请输入正确的帐号密码',
            type: 'error'
          });
        }
      })
      .catch((error) => {

        console.log(error);
      });
    },
    //注册卡片显示
    handleRegisterOpen(){
      this.dialogVisible = false;
      this.registerVisible = true;
    },
    //注册提交
    submintRegister() {
      let data = { 'username': this.ruleForm2.username, 'password': this.ruleForm2.password};
      this.$axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: this.$qs.stringify(data),
        url:'/api/register',
      }).then( (res) => {
        //查到userId则跳转    
        if(res.data[0]){
          this.$message({
            message: '注册成功',
            type: 'success'
          });  
          localStorage.setItem('userId',res.data[0].userId);
          this.getClassId();
          this.initClass();
          this.HandleBackOffice();
        }else{
          this.$message({
            message: '用户名已占用',
            type: 'error'
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    //退出登录
    HandleLogout(){
      this.$confirm('退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.setItem('userId','');
          localStorage.setItem('buildingClassId','');
          this.$message({
            message: '已退出！',
            type: 'success'
          });
        }).catch(() => {      
        });
        
    },

    clickPickPosition(){
      this.pickEvents(this.events.pickPosition, this.scene, this.camera, obj=>{
        console.log(`您选中了--${obj.name}`);
        //点击进入threejs工作室
        if(obj.name=='Building_House_02_color03_002'){
          //登入提示
          if(localStorage.getItem('userId')){
            this.getClassId();
            this.HandleBackOffice();
          }else{
            this.dialogVisible = true;
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
    //新用户初始化课程进度
    initClass(){
      let classId = localStorage.getItem('buildingClassId');
      let userId = localStorage.getItem('userId');
      let data = { 'classId': 1, 'userId':userId};
      this.$axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: this.$qs.stringify(data),
        url:'/api/userClassInit',
      }).then( (res) => {  
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    },
     //获得建筑的专业ID
    getClassId(){
      let data = { 'buildingName': 'Building_House_02_color03_002'};
      this.$axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: this.$qs.stringify(data),
        url:'/api/buildingClass',
      }).then( (res) => {  
        localStorage.setItem('buildingClassId',res.data[0].building_class);
      })
      .catch((error) => {
        console.log(error);
      });
    },
    
    //跳转
    HandleBackOffice(){
      this.$router.push('./office');
    },
  }
};    
</script>

<style>
.el-form .demo-ruleForm{
  text-align: center;
}
 .el-form-item .el-form-item--feedback .is-required{
   display: inline-block;
}
.selection{
  float:right;
    position: absolute;
    left: 1830px;
    top:60px;
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
</style>