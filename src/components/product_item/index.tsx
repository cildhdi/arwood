import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'
import { AtCard } from 'taro-ui'
import { Product } from './../../interfaces'

export default class Index extends Component<Product> {

  onClickImage(url: string) {
    Taro.previewImage({
      current: url,
      urls: this.props.pics.map((ele) => ele.url)
    });
  }

  render() {
    return (
      <View key={this.props.id} style='margin-top:30rpx'>
        <AtCard title={this.props.name}>
          <View>
            {this.props.desc}
          </View>
          <View className='at-row at-row--wrap'>
            {this.props.pics.map((ele) => {
              return <Image className='product-img at-col at-col-4'
                mode='aspectFill'
                src={ele.url}
                onClick={() => { this.onClickImage(ele.url); }}
              />;
            })}
          </View>
        </AtCard>
      </View>
    );
  }
}


(Index as any).defaultProps = {
  name: '',
  desc: '',
  pics: [],
  onClick: () => { }
}