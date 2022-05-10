  /*
  格式化树形
  最外层节点的pid
  */

 const getListData = function getListData(datas,bigPid,defaultProp) {
  if(!defaultProp){
    defaultProp={
        label: 'label',
        id:'id',
        pid:'pid'
    }
  }  
  let dataArray = []
  //遍历datas的每一条数据
  datas.forEach(function(data) {
    //读取所处树的层级pid
    let pid = data[defaultProp.pid]
    //如果层级pid为0
    if (pid == bigPid) {
      //遍历这一条数据到objTemp
      let objTemp = {}
      for(var pl in data){
          objTemp[pl] = data[pl]
      }
      //把第一层的父节点添加到dataArray
      dataArray.push(objTemp)
    }
  })
  //总数据，这一条数据，树形数据的默认配置
  return data2treeDG(datas, dataArray, defaultProp)
}
function  data2treeDG(datas, dataArray, defaultProp) {
    //遍历父节点
    for (let j = 0; j < dataArray.length; j++) {
      let dataArrayIndex = dataArray[j]
      let childrenArray = []
      let Pid = dataArrayIndex[defaultProp.pid]
      let Cno = dataArrayIndex[defaultProp.chapterno]
    
      for (let i = 0; i < datas.length; i++) {
        //遍历到datas里的每一条数据data
        let data = datas[i]
        //获取该数据data的pid
        let pid = data[defaultProp.pid]
        //获取该数据data的chapterno
        let cno = data[defaultProp.chapterno]
        //判断是否为下一级的儿子节点且是一个章节
        if (pid == Pid+1 && Cno == cno) {
          //遍历这一条数据到objTemp
          let objTemp = {}
          for(var pl in data){ //数组对象遍历
              objTemp[pl] = data[pl]
          }
          //把objTemp数据添加到childrenArray
          childrenArray.push(objTemp)
        }
      }
      dataArrayIndex.children = childrenArray
      if (childrenArray.length > 0) {
        //有儿子节点则递归
        data2treeDG(datas, childrenArray, defaultProp)
      }
    }
    return dataArray
  }
  export default getListData;
