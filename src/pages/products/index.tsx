import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import { Product } from './../../interfaces'
import config from './../../config';

import ProductItem from '../../components/product_item/index'

interface ProductsState {
  products: Product[]
}

export default class Index extends Component<{}, ProductsState> {
  config: Config = {
    navigationBarTitleText: '产品列表',
  }

  constructor() {
    super(...arguments);
    this.setState({
      products: [] as Product[]
    });
  }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中'
    });
    Taro.request({
      url: config.getProducts,
      method: 'POST',
      data: {
        token: Taro.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.errcode == 0) {
          this.setState({
            products: res.data.data.products as Product[]
          });
          console.log(this.state.products);
          Taro.hideLoading();
        }
      }
    })
  }

  render() {
    return (
      <View>
        {this.state.products.map((product) => {
          return <ProductItem name={product.name} desc={product.desc} pics={product.pics} ></ProductItem>
        })}
      </View>
    );
  }
}
