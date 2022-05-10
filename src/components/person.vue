<template>
    <el-dialog class="outbox" :title="title" :visible.sync="open" width="1000px" :close-on-click-modal="false">
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-dialog>
</template>

<script>
    export default {
        name: "PersonDialog",
        data() {
            return {
                // 弹出层标题
                title: "个人中心",
                // 是否显示弹出层
                open: false,
            };
        },
        methods: {
        	// 窗口初始化方法
            init(data) {
                this.open = true;
            },
        }
    }
</script>
<style scoped>
.el-dialog__body{
display: flex;
}
.leftline{
  height: 30vh;
  width: 30%;
	display:inline-block;
}
.rightline{
    height: 30vh;
  width: 70%;
	display:inline-block;
}



</style>