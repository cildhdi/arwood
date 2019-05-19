import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton, AtForm, AtInput } from 'taro-ui';
import './index.scss';
import config from './../../config';

import { BasicUserInfo } from '../mine/index';

export default class Index extends Component<{}, BasicUserInfo> {
  config: Config = {
    navigationBarTitleText: '修改信息',
  }

  constructor() {
    super(...arguments);
    this.setState({
      name: '',
      phone: ''
    })
  }


  nameChange(value: string | number) {
    this.setState({
      name: value.toString()
    });
  }

  phoneChange(value: string | number) {
    this.setState({
      phone: value.toString()
    });
  }

  commit() {
    if (this.state.name.length == 0) {
      Taro.showToast({
        title: '请输入姓名',
        icon: 'none',
      });
      return;
    }
    if (this.state.phone.length != 11) {
      Taro.showToast({
        title: '请输入正确的电话号码',
        icon: 'none',
      });
      return;
    }
    Taro.request({
      url: config.changeInfo,
      method: 'POST',
      data: {
        token: Taro.getStorageSync('token'),
        name: this.state.name,
        phone: this.state.phone
      },
      success: (res) => {
        console.log(res);
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: '修改成功',
            icon: 'success',
          });
          Taro.setStorageSync('updateInfo', 'true');
          Taro.navigateBack();
        } else {
          Taro.showToast({
            title: '修改失败',
            icon: 'none'
          });
        }
      }
    });
  }

  render() {
    return (
      <View className='container'>
        <AtForm>
          <AtInput
            name='name'
            title='姓名'
            type='text'
            placeholder='请输入姓名'
            value={this.state.name}
            onChange={this.nameChange.bind(this)}
          />
          <AtInput
            name='value6'
            border={false}
            title='手机号码'
            type='phone'
            placeholder='请输入手机号码'
            value={this.state.phone}
            onChange={this.phoneChange.bind(this)}
          />
        </AtForm>
        <View className='commit-btn'>
          <AtButton type='primary' onClick={this.commit.bind(this)}>确定</AtButton>
        </View>
      </View>
    );
  }
}
