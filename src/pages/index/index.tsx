import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'
import config from './../../config';

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount() {
    Taro.showLoading({
      title: '登录中'
    });
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
              Taro.switchTab({
                url: '/pages/mine/index'
              });
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

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View>
      </View>
    )
  }
}
