# C端天天抽奖社群项目

- 支付宝内走ap.getAuthCode
- 支付宝回调地址只支持https回调地址
- h5鉴权文档地址：https://opendocs.alipay.com/open/284/h5?pathHash=e39a95b3
- 支付宝H5开放文档：https://myjsapi.alipay.com/en-us/jsapi/context/push-window.html

## 静态页面地址

- 测试环境：https://association-laiy-static-test-k8s01.shulidata.com
- 测试环境http地址：http://association-static-base.test.k8s01.shuli.com
- 线上环境：https://association.shulidata-static.com

## authCode获取

> 测试环境和开发环境走APP_ID: 2021004135682480鉴权 https://association-laiy-static-k8s01.laiytech.com/#auth 点击按钮获取authcode
> 线上环境走APP_ID: 2021004135682480鉴权

## 开发环境、测试环境鉴权

> 页面地址参数直接拼接：?AUTH_CODE=28686e8514154fcc9c66e19959d4OX67 不走鉴权获取authCode

## 聚合页面

测试环境：https://association-laiy-static-test-k8s01.shulidata.com/?pageId=2024020117551400065306
线上环境: https://association-laiy-static.laiytech.com/?pageId=2024020117551400065306
