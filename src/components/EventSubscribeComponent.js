import React from 'react';
import { Steps, Button, message, Input, Table } from 'antd';
import styles from './EventSubscribeComponent.css';
import { Link } from 'dva/router';
import fetch from 'dva/fetch';

const Step = Steps.Step;
const Column = Table;
// const steps = [{
//   title: '选择水文数据集',
//   content: <div>进入选择水文传感器界面选择事件的数据集：<Button type={'primary'}>进入传感器</Button></div>,
// }, {
//   title: '构建过程信息订阅模型',
//   content: '<div>',
// }, {
//   title: '设置接收地址（邮箱）',
//   content: <div>设置邮箱：<Input style={{ width: '30%' }} placeholder="设置事件监听邮箱" /></div>,
// }];

export class EventSubscribeComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      current: 0,
      stepsStatus: null,
      eventOtherName: '',
    };
  }
  componentDidMount() {
    // Fetch 获取存储于Session中的Json数据
    fetch('http://www.myflood.com/getSubScribeJson', { method: 'GET', credentials: 'include' }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    },
    ).then((data) => {
      this.setState({
        stepsStatus: data,
      });
    }).catch((error) => {
      return error;
    });
  }
  changeEmail=(e) => {
    this.setState({
      email: e.target.value,
    });
  }
  changeEventName=(e) => {
    this.setState({
      eventOtherName: e.target.value,
    });
  }
  createContent=() => {
    const sensorData = this.state.stepsStatus.dataset.sensorList;
    if (this.state.current == 0) {
      if (this.state.stepsStatus.dataset.flag) {
        return (
          <div>
            <h2 style={{ 'text-align': 'center' }}>已选择的传感器数据表</h2>
            <br />
            <Table dataSource={sensorData}>
              <Column dataIndex="sensorID" title="传感器ID" />
              <Column dataIndex="sensorName" title="传感器名称" />
            </Table>
            <br />
            <div style={{ 'padding-right': '5px' }}>重新选择传感器：<Button type={'primary'}><Link to="/sensor">进入传感器选择页面</Link></Button></div>
          </div>);
      } else {
        return (<div>进入选择水文传感器界面选择事件的数据集：<Button type={'primary'}><Link to="/sensor">进入传感器选择页面</Link></Button></div>);
      }
    }
    if (this.state.current == 1) {
      if (this.state.stepsStatus.event.flag) {
        return (<div><h2>事件ID:{this.state.stepsStatus.event.eventID}</h2><br />
          <label>准备阶段时间窗口：</label>{0}
        </div>);
      } else {
        return (<div>进入选择洪涝事件过程信息模型参数设置页面：<Button type={'primary'}><a href="http://www.myflood.com/simpleSubscribeEvnt">进入参数设置页面</a></Button></div>);
      }
    }
    if (this.state.current == 2) {
      return (<div>设置邮箱：<Input style={{ width: '30%' }} placeholder="设置事件监听邮箱" value={this.state.email} onChange={this.changeEmail} />
      添加事件用户自定义名称：<Input style={{ width: '30%' }} placeholder="设置事件别名" value={this.state.eventOtherName} onChange={this.changeEventName} /></div>);
    }
  }
  // 以Session作为状态存储的对象
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  submitEvent() {
    if (this.state.stepsStatus == null || !this.state.stepsStatus.dataset.flag || !this.state.stepsStatus.event.flag) alert('不行');
    // 上传配置参数数据，以及用户定义别名及邮箱
    const subcribeParams = this.state.stepsStatus.event.params;
    subcribeParams.userDefineName = this.state.eventOtherName;
    subcribeParams.name=this.state.eventOtherName;
    subcribeParams.email = this.state.email;
     alert(JSON.stringify(subcribeParams));
    fetch('http://www.myflood.com/subscribeWithSession', { method: 'POST',
      credentials: 'include',
      headers:
      { Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(subcribeParams) }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      },
    ).then((data) => {
      data.flag ? window.location.href = `/show/${data.object}` : alert(`${data.message}`);
    }).catch((error) => {
      throw error;
    });
  }
  render() {
    const steps = [{
      title: '选择水文数据集',
      content: <div>进入选择水文传感器界面选择事件的数据集：<Button type={'primary'}><Link to="/sensor">进入传感器选择页面</Link></Button></div>,
    }, {
      title: '构建过程信息订阅模型',
      content: <div>进入选择洪涝事件过程信息模型参数设置页面：<Button type={'primary'}><a href="http://www.myflood.com/simpleSubscribeEvnt">进入参数设置页面</a></Button></div>,
    }, {
      title: '设置接收地址（邮箱）',
      content: <div>设置邮箱：<Input style={{ width: '30%' }} placeholder="设置事件监听邮箱" value={this.state.email} onChange={this.changeEmail} />
        添加事件用户自定义名称：<Input style={{ width: '30%' }} placeholder="设置事件别名" value={this.state.eventOtherName} onChange={this.changeEventName} /></div>,
    }];
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.content}>{this.state.stepsStatus == null ? steps[this.state.current].content : this.createContent()}</div>
        <div className={styles.action}>
          {
            this.state.current < steps.length - 1
            &&
            <Button type="primary" onClick={() => this.next()}>Next</Button>
          }
          {
            this.state.current === steps.length - 1
            &&
            <Button type="primary" onClick={() => this.submitEvent()}>Done</Button>
          }
          {
            this.state.current > 0
            &&
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              Previous
            </Button>
          }
        </div>
      </div>
    );
  }
}

