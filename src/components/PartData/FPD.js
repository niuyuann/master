import React from 'react';
import styles from './FPD.less';
import { Form, Table, Icon, Button, Breadcrumb, Row, Col, Select, Input, Modal, Radio, Cascader, DatePicker } from 'antd';
import { connect } from 'dva';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
import { hashHistory } from 'dva/router';
import { Map, Marker, NavigationControl, InfoWindow } from 'react-bmap';



//查看部件信息
class FPD extends React.Component {

  constructor(props) {

    super(props)

    this.state = {

    }

  }

  componentDidMount() {

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

    const { name, big_class, small_class, description, zgdept_id_name, qsdept_id_name,
      yhdept_id_name, dy_grid_id, longitude, latitude, created_at, updated_at, source_id,
      county_id, street_id, community_id, state_name, note }
      = { ...this.props.partData.component };

    return (

      <div className={styles.frame}>

        <div style={{ height: '60px', borderBottom: '1px solid #C8CAC9', paddingTop: '15px' }}>
          <Col span={1} style={{ textAlign: 'center' }}>
            <img src={require('../../assets/images/address.png')} />
          </Col>
          <Col span={20}>
            <Breadcrumb separator=">" style={{ display: 'inline-block', fontSize: '14px', marginTop: '2px' }}>
              <Breadcrumb.Item>部件数据管理</Breadcrumb.Item>
              <Breadcrumb.Item >查看部件数据</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Button type="primary" style={{padding: '6px 20px'}} size="large" onClick={this.handleReturn}>
          返回
            </Button>
        </div>

        <div className={styles.form} style={{ paddingTop: 10 }}>

          <Form horizontal onSubmit={this.handleSubmit} style={{ marginTop: 30 }}>

            <Row>
              <Col span={24}>
                <FormItem   {...formItemLayout}
                  label="部件名称"
                >
                  {name}
                </FormItem>

                <FormItem    {...formItemLayout}
                  label="选择区域"
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
                <FormItem
                  {...formItemLayout}
                  label="主管单位"
                >
                  {zgdept_id_name?zgdept_id_name:'无'}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="权属单位"
                >
                  {qsdept_id_name?qsdept_id_name:'无'}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="养护单位"
                >
                  {yhdept_id_name?yhdept_id_name:'无'}
                </FormItem>
                <FormItem   {...formItemLayout}
                  label="部件状态"
                >
                  {state_name?state_name:'无'}
                </FormItem>

                {'' != created_at && null != created_at &&

                  <FormItem
                    {...formItemLayout}
                    label="初始日期"
                  >

                    {created_at}
                  </FormItem>
                }

                {'' == created_at  &&

                  <FormItem
                    {...formItemLayout}
                    label="初始日期"
                  >

                    无
                </FormItem>
                }

                {'' != updated_at && null != updated_at &&
                  <FormItem
                    {...formItemLayout}
                    label="变更日期"
                  >
                    {updated_at}
                  </FormItem>
                }

                {'' == updated_at &&

                  <FormItem
                    {...formItemLayout}
                    label="变更日期"
                  >

                    无
                </FormItem>
                }

                <FormItem   {...formItemLayout}
                  label="数据来源"
                >
                  {source_id?source_id:'无'}
                </FormItem>


                {'' != note && null != note &&
                  <FormItem    {...formItemLayout}
                    label="备注"
                  >
                    {note}
                  </FormItem>
                }

                {'' == note &&
                  <FormItem    {...formItemLayout}
                    label="备注"
                  >
                    无
                </FormItem>
                }
              </Col>
             
            </Row>
          </Form>
        </div>
      </div>
    );
  }

}

function mapStateToProps({ partData }) {
  return { partData };
}

const FPDForm = Form.create()(FPD);

export default connect(mapStateToProps)(FPDForm);



