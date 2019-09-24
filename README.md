# demo-collection

## 项目描述
此项目基于vue, 用于个人作品展示，目前有三个项目：
1. 16点控制平面变形
2. 三维数据标定
3. 三阶魔方（仍在持续开发中）

## 项目线上预览
[www.yufengzhw.cn:20020](www.yufengzhw.cn:20020)  
推荐使用chrome或safari进行浏览

## 项目本地操作
1. 克隆代码到本地
   ```
   git clone
   ```
2. 安装node环境(建议node10)和yarn，如需要调试还需全局安装vue-cli
   ```
   yarn global add @vue/cli
   ```
3. 进入项目目录
4. 如只需在本地查看效果则
    ```
    cd server // 进入server目录
    yarn install // 安装服务端依赖
    ```
    等待安装完成输入以下命令启动服务
    ```
    yarn run start // 运行服务
    ```
    浏览器输入[localhost:20020](localhost:20020)即可浏览效果
5. 如需要在开发环境调试则除了上述步骤之外还需要  
   进入项目目录并输入
   ```
   yarn install // 安装开发环境依赖
   yarn run serve // 开启开发环境服务器
   ```
   然后根据提示的地址(默认为localhost:8080，如端口号已被占用则会使用后续最近一个未被使用的端口号)用浏览器打开即可查看和调试，
   更改代码并保存后浏览器会自动刷新
6. 前端代码编译打包，使用以下命令自动刷新并覆盖后端项目文件
   ```
   yarn run build
   ```

## 项目目录说明
前端部分主要代码在./src下，相关目录或文件的作用描述：  
./src/main.js 入口文件  
./src/App.vue 根组件   
./src/router.js 路由注册文件  
./src/layout/* 导航栏和菜单栏对应的组件  
./src/views/* 页面组件，一般一个路由路径对应一个页面组件  
./src/components/* 业务组件，与业务相关的组件，由其他业务组件或页面组件调用  
./src/base/* 基础组件，一般与业务不相关，为多个业务组件抽取出来的公共部分组成  
./src/common/* 公用库  
./src/assets/* 公用样式或资源  
./src/api/* 涉及后端请求的封装库  
./public/* 静态资源和静态样式，一般通过第三方获取，不进行更改
   
后端代码放在./server目录下，主要作用为前端编译打包后可直接用后端程序部署以及提供调试和生产环境下的后端请求接口，
其中的几个主要文件有：  
./server/bin/www 服务器开启的入口文件，一般不需要修改  
./server/app.js 主文件  
./server/routes/* 路由文件，提供后端接口  
./server/views/* 入口html页面，一般无需修改  
./server/public/* 前端项目编译打包后会自动将打包后的文件存放在该目录下
