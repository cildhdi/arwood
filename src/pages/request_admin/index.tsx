import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtForm, AtInput } from 'taro-ui';
import './index.scss';
import config from './../../config';



export default class Index extends Component<{}, { adminToken: string }> {
  config: Config = {
    navigationBarTitleText: '申请成为管理员',
  }

  constructor() {
    super(...arguments);
    this.setState({
      adminToken: ''
    });
  }

  valueChange(value: string | number) {
    this.setState({
      adminToken: value.toString()
    });
  }

  requestAdmin() {
    if (this.state.adminToken.length == 0) {
      Taro.showToast({
        title: '请输入 Token',
        icon: 'none',
      });
      return;
    }
    Taro.request({
      url: config.requestAdmin,
      method: 'POST',
      data: {
        token: Taro.getStorageSync('token'),
        adminToken: this.state.adminToken
      },
      success: (res) => {
        console.log(res);
        if (res.data.errcode == 0) {
          Taro.showToast({
            title: '申请成功',
            icon: 'success',
          });
          Taro.navigateBack();
        } else {
          Taro.showToast({
            title: '申请失败',
            icon: 'none'
          });
        }
      }
    });
  }

  render() {
    return (<View className='container'>
      <AtForm>
        <AtInput
          name='name'
          title='Token'
          type='text'
          placeholder='请向管理员索取Token'
          value={this.state.adminToken}
          onChange={this.valueChange.bind(this)}
        />
      </AtForm>
      <View className='commit-btn'>
        <AtButton type='primary' onClick={this.requestAdmin.bind(this)}>确定</AtButton>
      </View>
    </View>
    );
  }
}
