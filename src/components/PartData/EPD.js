import React from 'react';
import styles from './EPD.less';
import { Form, Table, Icon, Button, Breadcrumb, Row, Col, Select, Input, Modal, Radio, Cascader, DatePicker } from 'antd';
import { connect } from 'dva';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
import { hashHistory } from 'dva/router';
import moment from 'moment';


//修改部件信息
class EPD extends React.Component {

  constructor(props) {

    super(props)

    this.state = {

    }

  }

  componentDidMount() {

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


  //提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        

        const user_id = window.localStorage.getItem('user_id');

        values.user_id = user_id;

        const created_at = values['created_at'];

        const updated_at = values['updated_at'];

        if ('undefined' != created_at && '' != created_at && null != created_at) {

          values.created_at = created_at.format('YYYY-MM-DD');

        }

        if ('undefined' != updated_at && '' != updated_at && null != updated_at) {

          values.updated_at = updated_at.format('YYYY-MM-DD');

        }

        values.id = this.props.partData.component.id;
        

        console.log('Received values of form: ', values);
        this.props.dispatch({

          type: 'partData/updateComponent',

          payload: values
        });

      }
    });
  }

  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }


   //返回
   handleReturn = () => {
    // this.props.form.resetFields();
    hashHistory.push({
      pathname: '/PartData',
    })
  }


  render() {

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };


    const { getFieldDecorator } = this.props.form;

    const { name, big_class, small_class, description, zgdept_id, qsdept_id,
      yhdept_id, dy_grid_id, longitude, latitude, created_at, updated_at, source_id,
      county_id, street_id, community_id, state, note ,bj_identification,zgdept,yhdept,qsdept}
      = { ...this.props.partData.component };

    //定义部件状态下拉框选项
    const stu = [];
    if (this.props.partData.cstatus) {
      const allstu = this.props.partData.cstatus;
      for (let i = 0; i < allstu.length; i++) {
        stu.push(<Option key={allstu[i]['status_id']}>{allstu[i]['status_name']}</Option>);
      }
    }

    //定义主管部门，养护单位下拉框选项
    const dep = [];
    if (this.props.partData.compoentDep) {
      const alldep = this.props.partData.compoentDep;
      for (let i = 0; i < alldep.length; i++) {
        dep.push(<Option key={alldep[i]['event_code']}>{alldep[i]['event_name']}</Option>);
      }
    }

    function displayRender(label) {
      return label[label.length - 1];
    }

   //开始结束日期
   const dateFormat = 'YYYY-MM-DD';

    return (

      <div className={styles.frame}>

        <div style={{ height: '60px', borderBottom: '1px solid #C8CAC9', paddingTop: '15px' }}>
          <Col span={1} style={{ textAlign: 'center' }}>
            <img src={require('../../assets/images/address.png')} />
          </Col>
          <Col span={20}>
            <Breadcrumb separator=">" style={{ display: 'inline-block', fontSize: '14px', marginTop: '2px' }}>
              <Breadcrumb.Item>部件数据管理</Breadcrumb.Item>
              <Breadcrumb.Item >修改部件数据</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Button type="primary" style={{padding: '6px 20px'}} size="large" onClick={this.handleReturn}>
          返回
            </Button>
        </div>

        <div className={styles.form} style={{ paddingTop: 10 }}>

          <Form horizontal onSubmit={this.handleSubmit}>

            
            <FormItem    {...formItemLayout}
            label="所属区域"
          >
            {county_id + street_id + community_id}
          </FormItem>
          <FormItem   {...formItemLayout}
            label="大类小类"
          >
            {big_class + small_class}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="所属网格"
          >
            {dy_grid_id}
          </FormItem>
          <FormItem   {...formItemLayout}
              label="部件标识"
            >
                {bj_identification}
            </FormItem>
          <FormItem   {...formItemLayout}
              label="部件名称"
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入部件名称!' }],
                initialValue: name,
              })(
                <Input style={{ width: '40%' }} />
                )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="主管单位"
              
            >
              {getFieldDecorator('zgdept_id',
                { 
                  // rules: [{ required: true, message: '请选择主管部门!' }],
                initialValue: zgdept,
               }

              )(
                <Cascader options={this.props.partData.compoentDep} displayRender={displayRender} placeholder="请选择" style={{ width: '40%' }} changeOnSelect/>
                
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权属单位"
            >
              {getFieldDecorator('qsdept_id',
                { 
                  // rules: [{ required: true, message: '请选择权属单位!' }],
                initialValue: qsdept,
               }
              )(
                <Cascader options={this.props.partData.compoentDep} displayRender={displayRender} placeholder="请选择" style={{ width: '40%' }} changeOnSelect/>

                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="养护单位"
            >
              {getFieldDecorator('yhdept_id',
                { rules: [{ required: true, message: '请选择养护单位!' }],
                initialValue: yhdept,                
               }
              )(
                <Cascader options={this.props.partData.compoentDep} displayRender={displayRender} placeholder="请选择" style={{ width: '40%' }} changeOnSelect/>

                )}
            </FormItem>
            <FormItem   {...formItemLayout}
              label="部件状态"
            >
              {getFieldDecorator('state',
                { rules: [{ required: true, message: '请选择部件状态!' }],
                initialValue: state,  
               }

              )(
                <Select
                  size='default'
                  style={{ width: '40%' }}
                  placeholder="请选择"
                >
                  {stu}
                </Select>
                )}
            </FormItem>

            {/* <FormItem
              {...formItemLayout}
              label="初始日期"
            >
              {getFieldDecorator('created_at',
                  { initialValue: ''==created_at?'':moment(created_at, dateFormat) }
              )(
                <DatePicker
                  format="YYYY-MM-DD"
                />
                )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="变更日期"
            >
              {getFieldDecorator('updated_at',
              { initialValue: ''==updated_at?'':moment(updated_at, dateFormat) }
              )(
                <DatePicker
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem> */}

<FormItem   {...formItemLayout}
              label="部件经度"
            >
              {getFieldDecorator('longitude', {
                rules: [{ required: true, message: '请输入部件经度!' }],
                initialValue:longitude
              })(
                <Input style={{ width: '40%' }} />
                )}
            </FormItem>
            <FormItem   {...formItemLayout}
              label="部件纬度"
            >
              {getFieldDecorator('latitude', {
                rules: [{ required: true, message: '请输入部件纬度!' }],
                initialValue:latitude
              })(
                <Input style={{ width: '40%' }} />
                )}
            </FormItem>

            <FormItem   {...formItemLayout}
              label="数据来源"
            >
              {getFieldDecorator('source_id', {
                rules: [{ required: true, message: '请输入数据来源!' }],
                initialValue: source_id,
              })(
                <Input style={{ width: '40%' }} />
                )}
            </FormItem>

            <FormItem    {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('note',
              { initialValue: note }
              )(
                <TextArea autosize={{ minRows: 3, maxRows: 3 }} />
                )}
            </FormItem>

            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>确定</Button>
                <Button type="primary" style={{ marginLeft: 20 }} onClick={this.handleReset}>
                  重置
              </Button>

              </Col>
            </Row>

          </Form>
        </div>
      </div>
    );
  }

}




function mapStateToProps({ partData, unit, solve }) {
  return { partData, unit, solve };
}

const EPDForm = Form.create()(EPD);

export default connect(mapStateToProps)(EPDForm);



