import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import './index.scss'

import config from './../../config';

interface BasicUserInfo {
  name: string,
  phone: string
}

export default class Index extends Component<{}, BasicUserInfo> {
  config: Config = {
    navigationBarTitleText: '我的',
  }

  constructor() {
    super(...arguments);
    this.setState({
      name: '',
      phone: ''
    });
  }

  componentWillMount() { }

  componentDidMount() {
    Taro.showLoading();
    console.log(Taro.getStorageSync('token'));
    Taro.request({
      url: config.infoUrl,
      data: {
        token: Taro.getStorageSync('token')
      },
      method: 'POST',
      success: (res) => {
        console.log(res);
        Taro.hideLoading();
        if (res.data && res.data.errcode == 0) {
          this.setState({
            name: res.data.data.name,
            phone: res.data.data.phone
          });
        } else {
          Taro.showModal({
            title: '提示',
            content: '获取用户信息失败'
          });
        }
      }
    });
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

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
      </AtList>
    </View>
    );
  }
}
