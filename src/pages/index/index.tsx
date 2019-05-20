import Taro, { Component, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';
import config from './../../config';

export default class Index extends Component {

  config: Config = {
    navigationBarTitleText: '首页'
  }

  loginSuccess() {
    Taro.setStorageSync('updateInfo', 'true');
    Taro.switchTab({
      url: '/pages/mine/index'
    });
  }

  login() {
    Taro.login({
      success: (res) => {
        console.log("code: " + res.code);
        Taro.request({
          url: config.loginUrl,
          method: 'POST',
          data: {
            code: res.code
          },
          success: (res) => {
            Taro.hideLoading();
            if (res.data && res.data.errcode == 0) {
              console.log('token: ' + res.data.data.token);
              Taro.setStorageSync('token', res.data.data.token);
              this.loginSuccess();
            } else {
              Taro.showModal({
                title: '警告',
                content: '登录失败，请检查网络',
              });
            }
          }
        });
      },
      fail: () => {
        Taro.showToast({
          title: '请检查网络'
        });
      }
    });
  }

  componentDidMount() {
    Taro.showLoading({
      title: '登录中'
    });
    try {
      let token: string = Taro.getStorageSync('token');
      if (token && token.length != 0) {
        Taro.request({
          url: config.tokenLogin,
          method: 'POST',
          data: {
            token: token
          },
          success: (res) => {
            if (res.data && res.data.errcode == 0) {
              this.loginSuccess();
            } else {
              this.login();
            }
          }
        });
      } else {
        this.login();
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <View>
      </View>
    )
  }
}
