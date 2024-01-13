---
layout: post
current: post
cover:  /assets/images/posts/2024-01-13-paddleocr/cover.jpg
navigation: True
title: centos7 paddleocr paddlehub 服务部署 
date: 2024-01-13 09:00:00
tags: [getting-started]
class: post-template
subclass: 'post'
---

PaddleOCR旨在打造一套丰富、领先、且实用的OCR工具库，助力开发者训练出更好的模型，并应用落地。

## 1.使用anaconda安装python环境

```bash
wget https://repo.anaconda.com/archive/Anaconda3-2023.09-0-Linux-x86_64.sh

sh Anaconda3-2023.09-0-Linux-x86_64.sh

# 修改环境变量
vi ~/.bashrc
# 在第一行输入：
export PATH="~/anaconda3/bin:$PATH"
# 刷新环境变量
source ~/.bash_profile
# 验证是否能识别conda命令
conda info --envs
# 创建paddle_env的运行环境
conda create --name paddle_env python=3.8 --channel https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
# 激活paddle_env环境
conda activate paddle_env
```


### 安裝paddlepaddle
```bash
pip install paddlepaddle -i https://pypi.tuna.tsinghua.edu.cn/simple
```
### 安裝paddlehub
```bash
pip install paddlehub --upgrade -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### 下载PaddleOCR
```bash
# 添加gcc
yum install -y gcc-c++

yum install -y mesa-libGL.x86_64 
# 下载PaddleOCR
git clone  https://github.com/PaddlePaddle/PaddleOCR.git

cd PaddleOCR
# 添加依赖
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

```

### 检查是否存在 GLIBCXX_3.4.20 如果存在跳过此步骤
```bash
# 检查是否存在
strings /usr/lib64/libstdc++.so.6 | grep GLIBCXX 
# 查找高版本
find / -name libstdc++.so.6*

cp /root/anaconda3/lib/libstdc++.so.6.0.29 /usr/lib64/

ls -l | grep libstdc++

rm -f /usr/lib64/libstdc++.so.6

ln -s /usr/lib64/libstdc++.so.6.0.29 /usr/lib64/libstdc++.so.6
```

### 添加模型
```bash
mkdir inference && cd inference

# 下载 OCR 文本检测模型
wget https://paddleocr.bj.bcebos.com/PP-OCRv3/chinese/ch_PP-OCRv3_det_infer.tar && tar -xf ch_PP-OCRv3_det_infer.tar

# 下载 OCR 文本识别模型
wget https://paddleocr.bj.bcebos.com/PP-OCRv3/chinese/ch_PP-OCRv3_rec_infer.tar && tar -xf ch_PP-OCRv3_rec_infer.tar 

# 下载 方向分类器模型
wget https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_cls_infer.tar && tar -xf ch_ppocr_mobile_v2.0_cls_infer.tar

# 下载版面分析模型
wget https://paddleocr.bj.bcebos.com/ppstructure/models/layout/picodet_lcnet_x1_0_fgd_layout_infer.tar && tar -xvf picodet_lcnet_x1_0_fgd_layout_infer.tar

# 下载表格结构识别模型
wget https://paddleocr.bj.bcebos.com/ppstructure/models/slanet/ch_ppstructure_mobile_v2.0_SLANet_infer.tar && tar -xvf ch_ppstructure_mobile_v2.0_SLANet_infer.tar

# 下载关键信息抽取SER模型
wget https://paddleocr.bj.bcebos.com/ppstructure/models/vi_layoutxlm/ser_vi_layoutxlm_xfund_infer.tar && tar -xvf ser_vi_layoutxlm_xfund_infer.tar

# 下载关键信息抽取RE模型
wget https://paddleocr.bj.bcebos.com/ppstructure/models/vi_layoutxlm/re_vi_layoutxlm_xfund_infer.tar && tar -xvf re_vi_layoutxlm_xfund_infer.tar


cd ..
mkdir train_data && cd train_data

# 下载与解压数据
wget https://paddleocr.bj.bcebos.com/ppstructure/dataset/XFUND.tar && tar -xf XFUND.tar
cd ..

# 修改依赖包版本
pip uninstall protobuf

pip install protobuf==3.20.2 -i https://pypi.tuna.tsinghua.edu.cn/simple

pip uninstall numpy

pip install numpy==1.22  -i https://pypi.tuna.tsinghua.edu.cn/simple  
```
### 安装服务模块

```bash
# 检测
hub install /root/PaddleOCR/deploy/hubserving/ocr_det
# 分类
hub install /root/PaddleOCR/deploy/hubserving/ocr_cls
# 识别
hub install /root/PaddleOCR/deploy/hubserving/ocr_rec
# 检测+识别串联
hub install /root/PaddleOCR/deploy/hubserving/ocr_system
# 表格识别
hub install /root/PaddleOCR/deploy/hubserving/structure_table
# PP-Structure
hub install /root/PaddleOCR/deploy/hubserving/structure_system
# 版面分析
hub install /root/PaddleOCR/deploy/hubserving/structure_layout
# 关键信息抽取SER
hub install /root/PaddleOCR/deploy/hubserving/kie_ser
# 关键信息抽取SER+RE
hub install /root/PaddleOCR/deploy/hubserving/kie_ser_re
```

### 开放端口

```bash
# 端口添加
firewall-cmd --zone=public --add-port=8868/tcp --permanent
firewall-cmd --zone=public --add-port=8869/tcp --permanent
firewall-cmd --zone=public --add-port=8870/tcp --permanent
firewall-cmd --zone=public --add-port=8871/tcp --permanent
firewall-cmd --zone=public --add-port=8872/tcp --permanent
firewall-cmd --zone=public --add-port=8873/tcp --permanent
# 重启防火墙
firewall-cmd --reload
# 查看开启的端口
firewall-cmd --zone=public --list-ports
```

### 启动服务

```bash
hub serving start -m ocr_system --port 8868 
hub serving start -m structure_table --port 8873
hub serving start -m kie_ser_re --port 8872 

# 后台启动
nohup hub serving start -m ocr_system --port 8868 &
nohup hub serving start -m structure_table --port 8873 &
nohup hub serving start -m kie_ser_re --port 8872 &

# 停止服务
hub serving stop -p 8868
hub serving stop -p 8873
hub serving stop -p 8872

# 服务端调用
python /root/PaddleOCR/tools/test_hubserving.py --server_url=http://127.0.0.1:8868/predict/ocr_system --image_dir=/root/card.jpg --visualize=false
python /root/PaddleOCR/tools/test_hubserving.py --server_url=http://127.0.0.1:8873/predict/structure_table --image_dir=/root/card.jpg --visualize=false
python /root/PaddleOCR/tools/test_hubserving.py --server_url=http://127.0.0.1:8872/predict/kie_ser_re --image_dir=/root/card.jpg --visualize=false
```

