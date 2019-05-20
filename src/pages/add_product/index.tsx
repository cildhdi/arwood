import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'
import { AtForm, AtInput, AtTextarea, AtImagePicker, AtButton } from 'taro-ui'

import { Product } from './../../interfaces'
import * as qiniu from './../../qiniuUploader'
import config from './../../config';

export default class Index extends Component<{}, Product> {
  config: Config = {
    navigationBarTitleText: '添加产品',
  }

  constructor() {
    super(...arguments);
    this.setState({
      name: '',
      desc: '',
      pics: []
    });
  }

  nameChange(value: string | number) {
    this.setState({
      name: value.toString()
    });
  }


  descChange(event: any) {
    this.setState({
      desc: event.target.value
    });
  }

  onChange(files) {
    this.setState({
      pics: files
    });
  }

  finish(urls: { url: string }[]) {
    Taro.request({
      url: config.addProduct,
      method: 'POST',
      data: {
        token: Taro.getStorageSync('token'),
        name: this.state.name,
        desc: this.state.desc,
        urls: urls
      },
      success: (res) => {
        console.log(res);
      }
    });
    Taro.hideLoading();
    Taro.navigateBack();
    Taro.showToast({
      title: '发布成功',
      icon: 'success'
    });
  }

  onSubmit() {
    if (this.state.name.length == 0 || this.state.desc.length == 0) {
      Taro.showToast({
        title: '请输入名称与描述',
        icon: 'none'
      });
      return;
    }
    Taro.showLoading({
      title: '发布中'
    });
    if (this.state.pics.length != 0) {
      let urls: { url: string }[] = [];
      this.state.pics.forEach(element => {
        qiniu.upload({
          filePath: element.url,
          success: (res) => {
            Taro.request({
              url: config.imgUploaded,
              method: 'POST',
              data: {
                token: Taro.getStorageSync('token'),
                url: res.imageURL
              }
            });
            urls.push({ url: res.imageURL });
            if (urls.length == this.state.pics.length) {
              this.finish(urls);
            }
          },
          fail: () => {

          },
          options: {
            region: 'ECN',
            uptokenURL: config.uptokenURL,
            domain: config.staticDomain
          }
        });
      });
    } else {
      this.finish([]);
    }
  }

  render() {
    return (
      <View className='container'>
        <AtForm>
          <AtInput
            name='name'
            title='名称'
            type='text'
            placeholder='请输入产品名称'
            value={this.state.name}
            onChange={this.nameChange.bind(this)}
          />
          <View className='descText'>
            <AtTextarea
              placeholder='请输入产品描述'
              value={this.state.desc}
              onChange={this.descChange.bind(this)}
              maxLength={200}
            />

          </View>
          <AtImagePicker
            multiple
            files={this.state.pics as []}
            onChange={this.onChange.bind(this)}
          />
          <View className='btn'>
            <AtButton onClick={this.onSubmit.bind(this)} type='primary'>发布</AtButton>
          </View>
        </AtForm>

      </View>
    );
  }
}
