<template>
  <div id="app">
    <el-dialog :title="title" :visible.sync="open" width="1100px" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="6">
            <el-tabs v-model="activeName">
              <el-tab-pane label="目录" name="catalogue">
                <el-input
                  placeholder="输入关键字进行搜索"
                  v-model="filterText">
                </el-input>
                <el-tree
                  class="filter-tree"
                  :data="data"
                  :props="defaultProps"
                  default-expand-all
                  :filter-node-method="filterNode"
                  ref="tree"
                  accordion
                  @node-click="chosevideo">
                </el-tree>
            </el-tab-pane>
            <el-tab-pane label="笔记" name="note">
              <el-row :gutter="20">
                <el-input
                  type="textarea"
                  :rows="18"
                  placeholder="请输入内容"
                  v-model="textarea">
                </el-input>
              </el-row>
              <el-row :gutter="85">
                  <el-col :span="12"><el-button type="primary">保存</el-button></el-col>
                  <el-col :span="12"><el-button @click="resetnote">清空</el-button></el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="讨论" name="disscussion">
              <el-avatar shape="square" :size="50" :src="squareUrl"></el-avatar>
              <el-divider></el-divider>
            </el-tab-pane>
            </el-tabs>
          
        </el-col>
        <el-col :span="18">
          <el-empty description="请选择视频" v-if="!openvideo" image-size="334.9"></el-empty>
          <vue-core-video-player :src="this.address" :loop="true" v-if="openvideo"></vue-core-video-player>   
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "VideoDialog",
        data() {
            return {
                // 弹出层标题
                title: "学习视频",
                // 是否显示弹出层
                open: false,
                openvideo:false,
                address:require("../assets/v1.mp4"),
                filterText: '',
                activeName: 'catalogue',
                data: [{
                  id: 1,
                  label: '书签栏脚本',
                  children: [{
                    id: 2,
                    label: 'vue书签栏脚本小技巧',
                  }, {
                    id: 3,
                    label: 'csdn关注文章展开脚本'
                  }]
                }, {
                  id: 4,
                  label: '深入了解vue-router',
                  children: [{
                    id: 5,
                    label: 'vue-router简介'
                  }]
                }],
                textarea: '',
                squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
                defaultProps: {
                  children: 'children',
                  label: 'label'
                }
            };
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        methods: {
        	// 窗口初始化方法
            init(data) {
                this.open = true;
            },
            filterNode(value, data) {
              if (!value) return true;
              return data.label.indexOf(value) !== -1;
            },
            chosevideo(data){
              this.openvideo=true;
              console.log(data.$treeNodeId);
              if(data.$treeNodeId=='2'){
                this.address=require("../assets/v1.mp4");
              }
              else if(data.$treeNodeId=='3'){
                this.address=require("../assets/v2.mp4");
              }
              else if(data.$treeNodeId=='5'){
                this.address=require("../assets/v3.mp4");
              }
            },
            resetnote(){
              this.textarea='';
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
</style>
