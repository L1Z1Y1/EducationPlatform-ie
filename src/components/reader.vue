<template>
  <div id="app">
    <el-dialog :title="title" :visible.sync="open" width="900px" :close-on-click-modal="false">
     88888
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "ReaderDialog",
        data() {
            return {
                // 弹出层标题
                title: "文本阅读",
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
    };
</script>