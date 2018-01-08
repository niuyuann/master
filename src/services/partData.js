
import ajaxApi from '../utils/request';
import qs from 'qs';
import { pathname } from '../utils/config';


//获取所有部件管理信息
export async function queryAllComponent(data) {

  data.service='ComponentManage.GetComponents';

  data.XDEBUG_SESSION_START = '11456';

  return ajaxApi(pathname, { method: "post", data })

}

//获取部件状态
export async function queryCStatus(){
  
  let data = {'service':'ComponentManage.GetComponentStatus'};
  return ajaxApi(pathname,{method:"post",data});

}

//获取主管部门，养护单位
export async function queryCompoentDep(){
  
  let data = {'service':'Orga.getOrgasList1'};
  return ajaxApi(pathname,{method:"post",data});

}

//根据社区、村获取单元网格的
export async function queryDyGrid(data){
  
  data.service='AppGrid.GetDyGrid';
  data.XDEBUG_SESSION_START = '19772';
  return ajaxApi(pathname,{method:"post",data});

}

//插入部件信息
export async function insertComponent(data){
  
  data.service='ComponentManage.InsertComponent';
  data.XDEBUG_SESSION_START = '16905';
  return ajaxApi(pathname,{method:"post",data});

}

//根据id获取单个部件信息
export async function queryComponentById(data){
  
  data.service='ComponentManage.GetBaseInfo';
  data.XDEBUG_SESSION_START = '12892';
  return ajaxApi(pathname,{method:"post",data});

}

//根据id修改单个部件信息
export async function updateComponentById(data){
  
  data.service='ComponentManage.UpdateComponentById';
  data.XDEBUG_SESSION_START = '17744';
  return ajaxApi(pathname,{method:"post",data});

}

//根据id删除部件信息
export async function deleteComponentById(data){
  
  data.service='ComponentManage.DeleteComponent';
  data.XDEBUG_SESSION_START = '14853';
  return ajaxApi(pathname,{method:"post",data});

}
//批量导入数据
export async function anyExcel(data){
  data.service = 'ComponentManage.AnyExcel';
  data.XDEBUG_SESSION_START = '10334';
  return ajaxApi(pathname,{method:'post',data});
}

