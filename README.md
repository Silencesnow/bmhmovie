# Vue+Webpack实现电影APP
用vue全家桶仿写的星美电影app。
完整实现了涉及电影的所有页面。


在线版
-------
[点击进入](www.shamingming.com)

效果截图
-------
![](http://i.imgur.com/OOjfefR.gif)

工具&技能
--------
- vue + vue-router + vue-resource + vue-cli
- webpack + express + node.js
- better-scroll 移动端滚动库
- vue-lazyload 懒加载
- fastclick
- stylus
- fiddler 抓包工具
- json 数据

使用
-------

```
git clone https://github.com/Silencesnow/bmhmovie.git

npm install

npm run dev
```
实现功能
-------
#### 头部城市选项
- 滚动列表实现左右联动
- 城市搜索功能
	- 关键字搜索
	- 查无选项的文字提示
#### 电影页
- 海报轮播
- 电影条目
- loading提示
- 跳转路由至——电影详情页
 - 剧情内容折叠-展开
 - 海报横向列表
 - 购票路由——添加fiter至影院选择页
#### 影院页
- 影院列表
- 影院详情页
	- 电影选择列表
	- 电影详情跳转路由
	- 场次列表
		- 活动内容折叠-展开
	- 座位选择页面（重点实现）
		- 数据驱动实现座位排布
		- 座位信息与本地缓存混合实现座位状态
		- 选票限制与提示
		- 订单提交功能
		- 跳转路由至订单详情页
#### 发现页
- 活动海报列表（暂无链接）

#### 用户页
- 用户选项列表功能
- 本地缓存订单内容
	- 订单详情页功能

目录结构
-------
```
|
|—— build 
|—— config
|—— server 服务端
| |—— app.js 服务端启动入口文件
| |—— static 打包后的资源文件
| |__ index.html 网页入口
|
|——src 资源文件
| |—— base 基础组件
| |—— common 组件静态资源库
| |—— components 组件库
| |—— App.vue vue-movie
| |__ main.js vue-movie入口
|
|__ static 静态资源目录
```