import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'



export default class Index extends Component {
  config: Config = {
    navigationBarTitleText: '我的',
  }

  componentWillMount() { }

  componentDidMount() {
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (<View>
    </View>
    );
  }
}
