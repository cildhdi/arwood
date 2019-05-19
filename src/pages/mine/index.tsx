import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import './index.scss'

import config from './../../config';

export interface BasicUserInfo {
  name: string,
  phone: string,
  isAdmin: boolean
}

export default class Index extends Component<{}, BasicUserInfo> {
  config: Config = {
    navigationBarTitleText: '我的',
    navigationBarBackgroundColor: '#2d8cf0',
    navigationBarTextStyle: 'white'
  }

  constructor() {
    super(...arguments);
    this.setState({
      name: '',
      phone: '',
      isAdmin: false
    });
  }


  componentDidShow() {
    if (Taro.getStorageSync('updateInfo') != 'true') {
      return;
    }
    Taro.showLoading({
      title: '获取用户信息中'
    });
    Taro.request({
      url: config.infoUrl,
      data: {
        token: Taro.getStorageSync('token')
      },
      method: 'POST',
      success: (res) => {
        Taro.hideLoading();
        if (res.data && res.data.errcode == 0) {
          this.setState({
            name: res.data.data.name,
            phone: res.data.data.phone,
            isAdmin: res.data.data.isAdmin
          });
          Taro.setStorageSync('updateInfo', 'false');
        } else {
          Taro.showModal({
            title: '提示',
            content: '获取用户信息失败'
          });
        }
      }
    });
  }

  changeUserInfo() {
    Taro.navigateTo({
      url: '/pages/change_info/index'
    });
  }

  requestAdmin() {
    Taro.navigateTo({
      url: '/pages/request_admin/index'
    });
  }

  addProduct() {
    Taro.navigateTo({
      url: '/pages/add_product/index'
    });
  }

  render() {
    const avatarOpenData = {
      type: 'userAvatarUrl'
    };
    return (<View>
      <View className='userinfo-bg at-row at-row__align--center'>
        <View style='height:300rpx' className='at-col' />
        <View className='avatar-view at-col'>
          <AtAvatar className='user-avatar' openData={avatarOpenData}></AtAvatar>
        </View>
        <View style='height:300rpx' className='at-col' />
      </View>
      <AtList>
        <AtListItem title='称呼' extraText={this.state.name} />
        <AtListItem title='电话号码' extraText={this.state.phone} />
        <AtListItem title='修改个人信息' arrow='right' onClick={this.changeUserInfo} />
        {
          this.state.isAdmin ?
            <View>
              <AtListItem title='添加产品' arrow='right' onClick={this.addProduct.bind(this)} />
              <AtListItem title='删除产品' arrow='right' />
            </View> :
            <AtListItem title='申请成为管理员' arrow='right' onClick={this.requestAdmin.bind(this)} />
        }
      </AtList>
    </View>
    );
  }
}
