


import * as partDataService from '../services/partData';
import { message } from 'antd';
import { hashHistory } from 'dva/router';

export default {
  namespace: 'partData',
  state: {

    dyGrid: [],
    compoentDep: [],
    AllComponentProps: '',
    dataSource: [],
  },
  reducers: {
    queryAllComponentSuccess(state, action) {

      const AllComponentProps = {
        total: action.payload.total,
        current: action.payload.current,
        loading: false,
        dataSource: action.payload.list
      };
      return { ...state, AllComponentProps };
    },

    queryProblemByIdSuccess(state, action) {
      state.report = action.payload.report;
      //const report=action.payload.report;
      return { ...state };
    },

    showLoading(state, action) {
      return { ...state, loading: true };
    },
    queryCStatusSuccess(state, action) {

      const cstatus = action.payload.list;

      return { ...state, cstatus };
    },

    queryCompoentDepSuccess(state, action) {

      const compoentDep = action.payload.list;

      return { ...state, compoentDep };
    },

    queryDyGridSuccess(state, action) {

      const dyGrid = action.payload.list;

      return { ...state, dyGrid };
    },

    queryComponentByIduccess(state, action) {

      const component = action.payload.list;

      return { ...state, component };
    },


  },
  effects: {
    *queryAllComponent({ payload }, { select, call, put }) {
      // yield put({ type: 'showLoading' });
      const { data } = yield call(partDataService.queryAllComponent, payload);

      if (data) {

        yield put({
          type: 'queryAllComponentSuccess',
          payload: {
            list: data.list.componentAll,
            total: data.list.count,
            current: data.list.current
          }
        });
      }
    },

    //查询所有部件状态信息
    *queryCStatus({ payload }, { call, put, select }) {

      const { data } = yield call(partDataService.queryCStatus);

      if (data) {
        yield put({
          type: 'queryCStatusSuccess',
          payload: {
            list: data.list.componentAll,
          }
        });
      }
    },

    //获取主管部门，养护单位
    *queryCompoentDep({ payload }, { call, put, select }) {

      const { data } = yield call(partDataService.queryCompoentDep);

      if (data) {
        yield put({
          type: 'queryCompoentDepSuccess',
          payload: {
            list: data.list,
          }
        });
      }
    },

    //根据社区、村获取单元网格的
    *queryDyGrid({ payload }, { call, put, select }) {

      const { data } = yield call(partDataService.queryDyGrid, payload);

      if (data) {
        yield put({
          type: 'queryDyGridSuccess',
          payload: {
            list: data,
          }
        });
      }
    },

    //插入部件信息
    *insertComponent({ payload }, { call, put, select }) {
      const info = yield call(partDataService.insertComponent, payload);
      if (info.data.list == '部件识已存在') {
        message.warning('部件识已存在');
      } else if (info.data.code == 0) {
        message.loading('部件信息插入成功', 1, function () {
          hashHistory.push({
            pathname: '/PartData',
          })
        });

      } else {
        message.error('部件信息插入失败');

      }
    },

    //根据id查询部件信息
    *patch({ payload }, { call, put, select }) {

      const id = payload.id;
      const info = yield call(partDataService.queryComponentById, { id });
      if (info) {
        yield put({
          type: 'queryComponentByIduccess',
          payload: {
            list: info.data.list,

          }
        });
      }

    },

    //通过id更新部件详细信息
    *updateComponent({ payload }, { call, put, select }) {

      const info = yield call(partDataService.updateComponentById, payload);

      if (info.data.list == 1) {
        message.loading('部件数据信息修改成功', 1, function () {
          hashHistory.push({
            pathname: '/PartData',
          })
        });
      } else {
        message.error('部件数据信息修改失败');

      }

    },

    //通过id删除部件详细信息
    *deleteComponent({ payload }, { call, put, select }) {

      const info = yield call(partDataService.deleteComponentById, payload);

      if (info.data.code == 0) {
        message.loading('部件数据信息删除成功', 1, function () {
          window.location.reload();
        });
      } else {
        message.error('部件数据信息删除失败');

      }

    },
    //导入excel
    *anyExcel({ payload }, { select, put, call }) {
      const { data } = yield call(partDataService.anyExcel, payload);
      if (data.code == 0) {
        message.success('导入成功', 1, function () {
          window.location.reload();
        });
      } else {
        message.error('请按照规定的格式上传Excel文件');
      }
    },

  },
  subscriptions: {

    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {

        if (pathname === '/Fpd') {
          dispatch({ type: 'patch', payload: query });
        } else if (pathname === '/Epd') {
          dispatch({ type: 'patch', payload: query });
        } else if (pathname === '/TPD') {
          dispatch({ type: 'patch', payload: query });
        }

      });
    },

  },
};

