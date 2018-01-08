import React from 'react';
import styles from './APD.less';
import { Form, Table, Icon, Button, Breadcrumb, Row, Col, Select, Input, Modal, Radio, Cascader, DatePicker } from 'antd';
import { connect } from 'dva';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
import { hashHistory } from 'dva/router';
import { Map, Marker, NavigationControl, InfoWindow, Polygon } from 'react-bmap';
import { wgs84ToGcj, gcjToBd, isPointInPolygon } from '../../utils/bmap';
let polygon = [];//闭合图形
var map = '';//地图
//增加部件信息
class APD extends React.Component {

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

    //获取所有网格经纬度
    this.props.dispatch({
      type: 'inform/queryLngs',
      payload: {},
    });


    // 百度地图API功能
    map = new BMap.Map(document.getElementById("allmap"));
    map.centerAndZoom(new BMap.Point(112.73291586269, 40.020370418687), 15);
    map.enableScrollWheelZoom(true);

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

        console.log('Received values of form: ', values);
        this.props.dispatch({

          type: 'partData/insertComponent',

          payload: values
        });

      }
    });
  }

  //重置
  handleReset = () => {
    this.props.form.resetFields();
  }

  onChange = (value) => {

    const community_id = value[value.length - 1];

    //根据社区、村获取单元网格的
    this.props.dispatch({
      type: 'partData/queryDyGrid',
      payload: { community_id },
    });

    this.props.form.setFieldsValue({
      dy_grid_id: '',
    });


  }

  //返回
  handleReturn = () => {
    // this.props.form.resetFields();
    hashHistory.push({
      pathname: '/PartData',
    })
  }


  //根据经纬度获取区域和网格
  onBlur = () => {
    let data = [];//网格经纬度
    if (this.props.inform.lngs) {
      data = this.props.inform.lngs;
    }
    //将坐标转化为地图使用的格式
    function getBMPoint(list) {
      let info = [];
      list.map(function (pts, index) {
        info.push(new BMap.Point(pts['lng'], pts['lat']))
      })
      return info;
    }

    data.map(function (info, index) {

      if (info.list.length > 0) {
        let ply = new BMap.Polygon(getBMPoint(info.list));
        // polygon.push( [ply,[info.county_id,info.street_id,info.community_id]]);
        polygon.push(new Map([ply, [info.county_id, info.street_id, info.community_id, info.grid_id]]));
      }
    })
    var lng = this.props.form.getFieldValue('longitude');
    var lat = this.props.form.getFieldValue('latitude');
    if (lng && lat) {
      map.clearOverlays();
      var lnglat = wgs84ToGcj(lng, lat);//wgs84转换为gcj20
      lnglat = gcjToBd(parseFloat(lnglat[0]), parseFloat(lnglat[1]));//gcj20转换为百度
      var marker = new BMap.Marker(new BMap.Point(parseFloat(lnglat[0]), parseFloat(lnglat[1]))); // 创建点
      map.centerAndZoom(new BMap.Point(parseFloat(lnglat[0]), parseFloat(lnglat[1])), 15);
      map.addOverlay(marker);
      var rs = this.ptInPolygon(new BMap.Point(parseFloat(lnglat[0]), parseFloat(lnglat[1])));
      if (rs) {
        this.props.form.setFieldsValue({
          area: [rs[0], rs[1], rs[2]],
          dy_grid_id: rs[3],
        });
      }
    }

  }

  //判断点是否在多边形内
  ptInPolygon = (pt) => {
    // let rs=[];//判断点是否在多变形内返回的结果(true,数组/网格,区域)
    for (let i = 0; i < polygon.length; i++) {
      let ply = polygon[i].props;
      for (let j = 0; j < ply.length; j++) {
        if (ply[j] instanceof BMap.Polygon) {
          if (isPointInPolygon(pt, ply[j])) {
            return ply[j + 1];
          }
        }
      }
    }
  }

  render() {

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };


    function displayRender(label) {
      return label[label.length - 1];
    }

    const { getFieldDecorator } = this.props.form;

    //定义所有网格经纬度数据
    let markers = [];
    if (this.props.inform.lngs) {
      markers = this.props.inform.lngs;
    }
    //定义部件状态下拉框选项
    const stu = [];
    if (this.props.partData.cstatus) {
      const allstu = this.props.partData.cstatus;
      for (let i = 0; i < allstu.length; i++) {
        stu.push(<Option key={allstu[i]['status_id']}>{allstu[i]['status_name']}</Option>);
      }
    }


    //定义根据社区、村获取单元网格的下拉框选项
    // const grid = [];
    // if (this.props.partData.dyGrid) {
    //   const allgrid = this.props.partData.dyGrid;
    //   for (let i = 0; i < allgrid.length; i++) {
    //     grid.push(<Option key={allgrid[i]['event_code']}>{allgrid[i]['event_name']}</Option>);
    //   }
    // }
    return (

      <div className={styles.frame}>

        <div style={{ height: '60px', borderBottom: '1px solid #C8CAC9', paddingTop: '15px' }}>
          <Col span={1} style={{ textAlign: 'center' }}>
            <img src={require('../../assets/images/address.png')} />
          </Col>
          <Col span={20}>
            <Breadcrumb separator=">" style={{ display: 'inline-block', fontSize: '14px', marginTop: '2px' }}>
              <Breadcrumb.Item>部件数据管理</Breadcrumb.Item>
              <Breadcrumb.Item >新增部件数据</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Button type="primary" style={{ padding: '6px 20px' }} size="large" onClick={this.handleReturn}>
            返回
            </Button>
        </div>
        <div className={styles.form} style={{ paddingTop: 30 }}>
          <Form horizontal onSubmit={this.handleSubmit}>
            <Row style={{ margin: 0 }}>
              <Col span={12}>
                <FormItem   {...formItemLayout}
                  label="部件标识"
                >
                  {getFieldDecorator('bj_identification', {
                    rules: [{ required: true, message: '请输入部件标识!' }],
                  })(
                    <Input style={{ width: '80%' }} />
                    )}
                </FormItem>
                <FormItem   {...formItemLayout}
                  label="部件经度"
                >
                  {getFieldDecorator('longitude', {
                    rules: [{ required: true, message: '请输入部件经度!' }],
                  })(
                    <Input style={{ width: '80%' }} />
                    )}
                </FormItem>
                <FormItem   {...formItemLayout}
                  label="部件纬度"
                >
                  {getFieldDecorator('latitude', {
                    rules: [{ required: true, message: '请输入部件纬度!' }],
                  })(
                    <Input style={{ width: '80%' }} onBlur={this.onBlur} />
                    )}
                </FormItem>
                <FormItem    {...formItemLayout}
                  label="所属区域"
                >
                  {getFieldDecorator('area', {
                    rules: [{ type: 'array', required: true, message: '请选择所属区域!' }],
                  })(
                    <Cascader options={this.props.solve.areaCSelect} placeholder="请选择" displayRender={displayRender} onChange={this.onChange} style={{ width: '80%' }} disabled />
                    // <Input style={{ width: '80%' }} disabled id='area' />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="所属网格"
                >
                  {getFieldDecorator('dy_grid_id',
                    { rules: [{ required: true, message: '请选择所属网格!' }] }

                  )(
                    // <Select
                    //   size='default'
                    //   style={{ width: '40%' }}
                    //   placeholder="请选择"
                    // >
                    //   {grid}
                    // </Select>
                    <Input style={{ width: '80%' }} disabled id='grid' />
                    )}
                </FormItem>
                <FormItem   {...formItemLayout}
                  label="大类小类"
                >
                  {getFieldDecorator('big_small_class',
                    { rules: [{ type: 'array', required: true, message: '请选择大类小类!' }] }
                  )(
                    <Cascader options={this.props.unit.unitSelect} displayRender={displayRender} placeholder="请选择" style={{ width: '80%' }} />
                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="主管单位"
                >
                  {getFieldDecorator('zgdept_id',
                    // { rules: [{ required: true, message: '请选择主管部门!' }] }

                  )(

                    <Cascader options={this.props.partData.compoentDep} displayRender={displayRender} placeholder="请选择" style={{ width: '80%' }} changeOnSelect />

                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="权属单位"
                >
                  {getFieldDecorator('qsdept_id',
                    // { rules: [{ required: true, message: '请选择权属单位!' }] }
                  )(
                    <Cascader options={this.props.partData.compoentDep} displayRender={displayRender} placeholder="请选择" style={{ width: '80%' }} changeOnSelect />

                    )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="养护单位"
                >
                  {getFieldDecorator('yhdept_id',
                    { rules: [{ required: true, message: '请选择养护单位!' }] }
                  )(
                    <Cascader options={this.props.partData.compoentDep} displayRender={displayRender} placeholder="请选择" style={{ width: '80%' }} changeOnSelect />

                    )}
                </FormItem>
                <FormItem   {...formItemLayout}
                  label="部件状态"
                >
                  {getFieldDecorator('state',
                    { rules: [{ required: true, message: '请选择部件状态!' }] }

                  )(
                    <Select
                      size='default'
                      style={{ width: '80%' }}
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
              {getFieldDecorator('created_at'
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
              {getFieldDecorator('updated_at')(
                <DatePicker
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem> */}


                <FormItem   {...formItemLayout}
                  label="数据来源"
                >
                  {getFieldDecorator('source_id', {
                    rules: [{ required: true, message: '请输入数据来源!' }],
                  })(
                    <Input style={{ width: '80%' }} />
                    )}
                </FormItem>

                <FormItem    {...formItemLayout}
                  label="备注"
                >
                  {getFieldDecorator('note'
                  )(
                    <TextArea autosize={{ minRows: 3, maxRows: 3 }} style={{ width: '80%' }} />
                    )}
                </FormItem>
              </Col>
              <Col span={12}>
                {/* <Map center={{ lng: 112.7191731533, lat: 40.001410105899 }} zoom="16" minZoom="10" style={{ height: 600, width: 520 }}
                  enableScrollWheelZoom={true}>
                  {markers.map((ply, index) => {
                    if (ply.list.length > 0) {
                      return (
                        <Polygon
                          strokeColor='red'
                          strokeWeight='2'
                          fillOpacity='0.1'
                          path={ply.list}
                        />)
                    }
                  })
                  }
                </Map> */}
                <div style={{ height: 600, width: 520 }} id='allmap'>
                </div>
              </Col>
            </Row>
            <Row style={{ margin: 0 }}>
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

function mapStateToProps({ inform, partData, unit, solve }) {
  return { inform, partData, unit, solve };
}

const APDForm = Form.create()(APD);

export default connect(mapStateToProps)(APDForm);



