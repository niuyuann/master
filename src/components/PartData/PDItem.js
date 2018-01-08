import React from 'react';
import styles from './PDItem.less';
import { Form, Tabs, Table, Icon, Button, Breadcrumb, Row, Col, Select, Input, Cascader, Pagination, Popconfirm, Modal, Upload, message, Spin, Progress } from 'antd';
const TabPane = Tabs.TabPane;
import { connect } from 'dva';
const Option = Select.Option;
import { hashHistory } from 'dva/router';
import { routerRedux } from 'dva/router';
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
import { pathname } from '../../utils/config';
let path = pathname + '?service=Upload.UploadExcel&XDEBUG_SESSION_START=14439';
//部件数据管理
class PDItem extends React.Component {

  constructor(props) {

    super(props)
    this.state = {
      visible: false,
      fileList: [],
      ModalTitle: '导入Excel文件',
      query: {},
      selectedRowKeys: [],
      export: 1
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'partData/queryAllComponent',
      payload: { pageSize: 11, pageIndex: this.props.partData.AllComponentProps.current?this.props.partData.AllComponentProps.current:1 },
    });

    //下拉框区域(从县开始)
    this.props.dispatch({
      type: 'solve/queryAreaC',
      payload: {},
    });

    //获取部件下拉框
    this.props.dispatch({
      type: 'unit/queryEventU',
      payload: {},
    });

    //获取部件状态
    this.props.dispatch({
      type: 'partData/queryCStatus',
      payload: {},
    });

    //获取主管部门，养护单位
    this.props.dispatch({
      type: 'partData/queryCompoentDep',
      payload: {},
    });

  }


  //删除部件信息
  deleteHandler = (e) => {
    e.preventDefault();
    let ids = this.state.selectedRowKeys;
    if ('undefined' != ids && '' != ids && null != ids) {
      this.props.dispatch({
        type: 'partData/deleteComponent',
        payload: { ids },
      }
      );
    } else {
      message.warn('请选择要删除的信息');
    }
  }

  //查看部件信息
  handleClickF = (id, values) => {

    this.props.dispatch(routerRedux.push({
      pathname: '/Fpd',
      query: { id: id },
    }));

  }
  //修改部件信息
  handleClickE = (id, values) => {

    this.props.dispatch(routerRedux.push({
      pathname: '/Epd',
      query: { id: id },
    }));

  }
  //检索
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.pageIndex = 1;
      values.pageSize = 11;
      console.log('Received values of form: ', values);
      this.setState({
        query: values,
      })
      this.props.dispatch({

        type: 'partData/queryAllComponent',

        payload: values,

      });
    });
  }

  //上传文件时，状态的变化
  onChange = (e) => {
    this.setState({
      fileList: e.fileList,
    })
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  //弹出框，用来上传Excel文件
  showAddModal = () => {
    this.setState({
      visible: true,
    });
  }


  //弹出框，用来导出Excel文件
  showModal = () => {
    this.setState({
      visiblep: true,
    });
  }

  handleOk = () => {
    if (this.state.fileList.length !== 0) {
      let filename = this.state.fileList[0].response.data.file;
      let user_id = window.localStorage.getItem('user_id');
      if (filename) {
        this.props.dispatch({
          type: 'partData/anyExcel',
          payload: {
            filename,
            user_id
          }
        });
        this.setState({
          visible: false,
        });
      }
    } else {
      message.error('请点击上传文件')
    }
  }

  //导出
  exportExcel = () => {

    window.location.href = pathname + 'componentDataExportExcel.php?XDEBUG_SESSION_START=106221';
   
  }

  //多选框
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  render() {
    // 定义分页对象
    const pagination = {
      current: parseInt(this.props.partData.AllComponentProps.current),
      total: parseInt(this.props.partData.AllComponentProps.total),
      pageSize: 11,
      onChange: (page, pageSize) => {
        let query = this.state.query;
        query.pageIndex = page;
        query.pageSize = pageSize;

        this.props.dispatch({
          type: 'partData/queryAllComponent',
          payload: query,
        });

      },
    };
    //新增部件
    function addPD() {

      hashHistory.push({
        pathname: '/Apd',
      })
    }
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };
    function displayRender(label) {
      return label[label.length - 1];
    }

    //定义部件状态下拉框选项
    const stu = [];
    if (this.props.partData.cstatus) {
      const allstu = this.props.partData.cstatus;
      stu.push(<Option key={0}>请选择</Option>);
      for (let i = 0; i < allstu.length; i++) {
        stu.push(<Option key={allstu[i]['status_id']}>{allstu[i]['status_name']}</Option>);
      }
    }

    const columns = [{
      title: '部件标识',
      dataIndex: 'bj_identification',
      key: 'bj_identification',
      render: (text, record) => (
        <a type="primary" onClick={this.handleClickF.bind(null, record.id)} >{record.bj_identification}</a>
      )
    }, {
      title: '大类',
      dataIndex: 'big_class',
      key: 'big_class',
    }, {
      title: '小类',
      dataIndex: 'small_class',
      key: 'small_class',
    }, {
      title: '状态',
      dataIndex: 'state_name',
      key: 'state_name',
      render: (text, record) => (
        <div>
          {record['state_name'] == null ? '无' : record['state_name']}
        </div>
      )
    }, {
      title: '所属区域',
      dataIndex: 'area',
      key: 'area',
    }
      //   , {
      //   title: '定位',
      //   render: (text, record) => (
      //     <a type="primary" onClick={this.handleClickF.bind(null, record.id)} >123</a>
      //   )
      // }
      , {
      title: '主管单位',
      dataIndex: 'zgdept_id_name',
      key: 'zgdept_id',
      render: (text, record) => (
        <div>
          {record['zgdept_id_name'] == null ? '无' : record['zgdept_id_name']}
        </div>
      )
    }, {
      title: '权属单位',
      dataIndex: 'qsdept_id_name',
      key: 'qsdept_id',
      render: (text, record) => (
        <div>
          {record['qsdept_id_name'] == null ? '无' : record['qsdept_id_name']}
        </div>
      )
    }, {
      title: '养护单位',
      dataIndex: 'yhdept_id_name',
      key: 'yhdept_id',
      render: (text, record) => (
        <div>
          {record['yhdept_id_name'] == null ? '无' : record['yhdept_id_name']}
        </div>
      )
    }, {
      title: '详细信息',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => (

        <div>

          <Button type="primary" onClick={this.handleClickE.bind(null, record.id)} style={{ height:26 }}>修改</Button>
          {/* <Popconfirm placement="topRight" title="确认删除?" onConfirm={this.deleteHandler.bind(null, record.id)}>
            <Button type='primary'>删除</Button>
          </Popconfirm> */}

        </div>
      )
    }];

    let height = sessionStorage.getItem('height') - 205;

    //多选框
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.tabContent}>
      
        <div className={styles.headline}>
          <div className={styles.form}>
            <Form
              className="ant-advanced-search-form"
              onSubmit={this.handleSearch}
              style={{ display: 'inline' }}
              layout="inline"
            >
            
              
              <Row gutter={40} style={{ margin: 0 }}>
                <Col span={16}></Col>
                <Modal
                  title={this.state.ModalTitle}
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <div style={{ width: '50%' }}>
                    <Upload name="file" listType="text" action={path} onChange={this.onChange} fileList={this.state.fileList}>
                      {this.state.fileList.length !== 0 ? '' : <Button><Icon type="upload" /> 点击，选择文件</Button>}
                    </Upload>
                  </div>
                </Modal>

                <Col span={8}>
                  <ButtonGroup >
                    <Button type="primary" onClick={this.showAddModal} >
                      上传Excel文件
                </Button>

                    <Button type='primary' onClick={this.exportExcel} >
                      导出Excel文件
                </Button>

                    {/* {this.state.export==2&&
                <Progress percent={25} strokeWidth={5} status="active" style={{width:100}}/>
                } */}
                    <Popconfirm title="确定删除选中行?" onConfirm={this.deleteHandler}>
                      <Button type="danger" value="large">
                        <Icon type="delete" />删除</Button>
                    </Popconfirm>
                  </ButtonGroup>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div style={{ height: height, overflow: 'auto' }}>
          <Table columns={columns} rowSelection={rowSelection} dataSource={this.props.partData.AllComponentProps.dataSource} loading={this.props.loading}  pagination={pagination} />
        </div>

      </div>

    )
  }

}

function mapStateToProps({ partData, unit, solve,loading}) {

  return { partData, unit, solve,loading:loading.models.partData };
}

const PDItemForm = Form.create()(PDItem);

export default connect(mapStateToProps)(PDItemForm);





