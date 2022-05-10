<template>
  <div>
    <el-dialog :title="title" :visible.sync="open" width="1100px" :close-on-click-modal="false" :before-close="handleClose">
      <el-row :gutter="20">
        <el-col :span="6">
            <el-tabs v-model="activeName">
              <el-tab-pane label="目录" name="catalogue">
                <el-input
                  placeholder="输入关键字进行搜索"
                  v-model="filterText"
                  @change="filterChange">
                </el-input>

                <el-tree  
                :data="videoListData" 
                :props="defaultProp" 
                default-expand-all               
                :filter-node-method="filterNode"
                ref="tree"
                @node-click="chosevideo"
                :render-content="renderContent"> 
                </el-tree>

            </el-tab-pane>
            <el-tab-pane label="笔记" name="note">
              <el-row :gutter="20">
                <el-input
                  type="textarea"
                  :rows="18"
                  placeholder="请输入内容"
                  v-model="textarea1">
                </el-input>
              </el-row>
              <el-row :gutter="85">
                  <el-col :span="12"><el-button type="primary">保存</el-button></el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="讨论" name="disscussion">
              <dl id="info">
              <el-row>
                <el-col :span="6">
                  <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar>
                </el-col>
                <el-col :span="18">
                  <p id>用户1</p>
                  <p id>这个课程挺不错的，简洁又受益匪浅，爱了爱了。</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar>
                </el-col>
                <el-col :span="18">
                  <p id= 'usrname'>用户2</p>
                  <p id='comment'>还行吧，挺不错的。</p>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar>
                </el-col>
                <el-col :span="18">
                  <p id= 'usrname'>用户3</p>
                  <p id='comment'>如果要我给这个课程评分的话，我愿意打出100分。</p>
                </el-col>
              </el-row>
              </dl>
              <el-row>
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="textarea2"
                  id="commentInfo">
                </el-input>
              </el-row>
              <el-row :gutter="85">
                  <el-col :span="12"><el-button type="primary" @click="submmitcommment">提交</el-button></el-col>
                  <el-col :span="12"><el-button @click="resetdiscussion">清空</el-button></el-col>
              </el-row>            
            </el-tab-pane>
            </el-tabs>
          
        </el-col>
        <el-col :span="18">
          <el-empty description="请选择视频" v-if="!openvideo" :image-size="339"></el-empty>
          <vue-core-video-player :src="this.address" :loop="false" 
           v-if="openvideo" @play="playvideo" @ended="endvideo"></vue-core-video-player>   
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
    import getListData from "../assets/js/formatTree";
    export default {
        name: "VideoDialog",
        data() {
            return {
                // 弹出层标题
                title: "学习视频",
                // 是否显示弹出层
                open: false,
                openvideo:false,
                address:'',
                filterText: '',
                activeName: 'catalogue',
                videoListData:[],
                videoLearnedData:[],
                textarea1: '',
                textarea2: '',
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                defaultProp: {
                  label: 'Name',
                  id:"Id",
                  pid:"pid",
                  chapterno:"chapterNo",
                },
                endcurrentvideo:0
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
        	// 窗口初始化方法
            init() {
                this.open = true;
                this.getdata();
            },
            handleClose(done) {
              this.$emit('parentFunc', false);
              done();
            },
            formatTreeData(data){
                this.videoListData= getListData(data,0,this.defaultProp);
            },
            getdata(){
                let classid = { 'classId': 1};
                var that=this;
                this.$axios({
                  method: 'POST',
                  headers: { 'content-type': 'application/x-www-form-urlencoded' },
                  data: this.$qs.stringify(classid),
                  url:'/api/getVideoList'
                }).then(function (res) {
                  that.formatTreeData(res.data);
                })
                .catch(function (error) {
                  console.log(error);
                });
                let userId = { 'userId': 2001};
                this.$axios({
                  method: 'POST',
                  headers: { 'content-type': 'application/x-www-form-urlencoded' },
                  data: this.$qs.stringify(userId),
                  url:'/api/getVideoLearnInfo'
                }).then(function (res) {
                  that.videoLearnedData=res.data;
                })
                .catch(function (error) {
                  console.log(error);
                });
            },
            filterNode(value, data) {
              if (!value) return true;
              return data.Name.indexOf(value) !== -1;
            },
            filterChange:function () {
            // 这里每当输入的数据有变化就触发原生的过滤节点这个函数
            this.$refs.tree.filter(app.filterText);
            },
            renderContent:function (h, { node, data, store }) {
              /**这个addElement等于的是一个自身的索引为0的东西*/
              let addElement = arguments[0];
              /*
               在最后返回了一个dom元素，一个i标签和俩span标签
               i标签添加个类名是放置icon图标
               第一个span是放置文字
               最后一个span是把原先的数据传进去
              */
             let that=this;
             let videoid=data.videoId;
             var learned=0;
             if(data.pid==1){
                that.videoLearnedData.forEach(function(data1) {
                  if(data1.videoId==videoid){
                    learned=data1.learned;
                  }  
                })
                if(learned==1){
                  return addElement("span", [
                  addElement("i", { class: "el-icon-check" }), 
                  addElement("span", "已完成     "),
                  addElement("span", arguments[1].node.label),
                  ])
                }
                else{
                  return addElement("span", [
                  addElement("i", {class:"el-icon-loading"}), 
                  addElement("span", "未完成     "),
                  addElement("span", arguments[1].node.label),
                ]);
                }
             }
             else{
                return addElement("span", [
                addElement("i", {}), 
                addElement("span", ""),
                addElement("span", arguments[1].node.label),
                ]);
             }
            },
            chosevideo(data){
              if(data.pid==1){
              let videoid=data.videoId;
              // //遍历res的每一条数据
              //     res.data.forEach(function(data2) {
              //       //如果视频id对得上
              //       if(data2.videoId==videoid){
              //        console.log(data2.learned);
              //       }
              // this.playvideo(data);
              // if(this.endcurrentvideo==1){console.log("看完了"+data.Name);}

              this.openvideo=true;
              this.address=data.url;
              this.textarea1=data.note;
              }
            },
            playvideo(data){
              this.endcurrentvideo=0;
            },
            endvideo(data){
              this.endcurrentvideo=1;
            },
            resetdiscussion(){
              this.textarea2='';
            },
            submmitcommment(){
            }
        }
    };
</script>
<style>
  .el-row {
    margin-bottom: 20px;
  }
.el-row:last-child {
    margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
    margin-top: -10px;
  }
  .el-tabs{
    margin-top: -10px;
  }
  .vue-core-video-player{
    margin-top: -10px;
  }
  .el-avatar{
    margin-top: 15px;
  }
  #info{
    text-align: left;
  }
</style>
