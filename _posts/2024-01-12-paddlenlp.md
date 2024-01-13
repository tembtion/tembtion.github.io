---
layout: post
current: post
cover:  /assets/images/posts/2024-01-12-paddlenlp/cover.jpg
navigation: True
title: Centos7 PaddleNLP 图片信息提取 基于 SimpleServing 的服务化部署
date: 2024-01-13 09:00:00
tags: [getting-started]
class: post-template
subclass: 'post'
---

使用PaddleNLP中UIE模型提取图片信息

### 环境准备

```bash
# 安装PaddleNLP
pip install paddlenlp==2.7.1 -i https://pypi.tuna.tsinghua.edu.cn/simple
# 安装PaddleOcr (最新版不兼容 使用2.6版)
pip install paddleocr==2.6.1.3 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Server服务启动
```bash
# 获取PaddleNLP源码
git clone https://github.com/PaddlePaddle/PaddleNLP.git

cd PaddleNLP/applications/information_extraction/document/deploy/simple_serving/
# 启动服务
paddlenlp server server:app --host 0.0.0.0 --port 8189 --workers 1
```
### 开放端口

```bash
# 端口添加
firewall-cmd --zone=public --add-port=8189/tcp --permanent
# 重启防火墙
firewall-cmd --reload
# 查看开启的端口
firewall-cmd --zone=public --list-ports
```
### 接口请求
![alt](/assets/images/posts/2024-01-12-paddlenlp/1705141028351.jpg)

### 修改使用模型
```bash
vi server.python
# 使用uie-base目前最精准
uie = Taskflow("information_extraction", schema=schema, model="uie-base")
```
[更多模型](https://github.com/PaddlePaddle/PaddleNLP/tree/develop/model_zoo/uie?_blank)

|模型|结构|语言|
|:-------:|:-------:|:-------:|
|uie-base (默认)|12-layers, 768-hidden, 12-heads|中文|
|uie-base-en|12-layers, 768-hidden, 12-heads|英文|
|uie-medical-base|12-layers, 768-hidden, 12-heads|中文|
|uie-medium|6-layers, 768-hidden, 12-heads|中文|
|uie-mini|6-layers, 384-hidden, 12-heads|中文|
|uie-micro|4-layers, 384-hidden, 12-heads|中文|
|uie-nano|4-layers, 312-hidden, 12-heads|中文|
|uie-m-large|24-layers, 1024-hidden, 16-heads|中、英文|
|uie-m-base|12-layers, 768-hidden, 12-heads|中、英文|


### 修改提取字段
```bash
vi server.python

schema = ["开票日期", "名称", "纳税人识别号", "开户行及账号", "金额", "价税合计", "No", "税率", "地址、电话", "税额"]
```

### 多卡服务化预测
PaddleNLP SimpleServing 支持多卡负载均衡预测，主要在服务化注册的时候，注册两个Taskflow的task即可，下面是示例代码
```bash
uie1 = Taskflow('information_extraction', task_path='../../checkpoint/model_best/', schema=schema, device_id=0)
uie2 = Taskflow('information_extraction', task_path='../../checkpoint/model_best/', schema=schema, device_id=1)
service.register_taskflow('uie', [uie1, uie2])
```

[官方文档](https://github.com/PaddlePaddle/PaddleNLP/tree/develop/applications/information_extraction/document/deploy/simple_serving?_blank)
