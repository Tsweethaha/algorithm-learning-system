# algorithm-learning-system
AI Algorithm Learning Platform
一个基于 Flask 构建的 **AI辅助算法学习平台**，通过算法可视化与 AI 提示帮助学生理解数据结构与算法原理。

## 项目简介

本系统为算法学习提供交互式学习环境，结合 **算法可视化、AI提示与AI解释功能**，帮助学生更直观地理解算法执行过程。

学生可以通过浏览器访问系统，查看不同算法的动态演示，并在遇到困难时获取 AI 提供的提示或解释。

## 主要功能

- 数据结构与算法可视化
- AI算法提示（Hint）
- AI算法解释（Explain）
- 统一导航的学习模块
- 支持在线访问和分享

## 已支持的算法模块

- 数组（Array）
- 单链表（Linked List）
- 栈（Stack）
- 队列（Queue）
- 二叉树遍历（Binary Tree Traversal）
- 二叉搜索树插入（BST Insert）
- 堆（Heap）
- 图的广度优先搜索（Graph BFS）
- 二分查找（Binary Search）
- 冒泡排序（Bubble Sort）
- 选择排序（Selection Sort）
- 插入排序（Insertion Sort）
- 快速排序（Quick Sort）

## 技术架构

- Backend: Flask
- Frontend: HTML + CSS + JavaScript
- AI接口: DeepSeek API
- 部署平台: Render

## 项目结构

```
algorithm-system/
│
├── app.py
├── requirements.txt
├── Procfile
│
├── templates/
│   ├── index.html
│   ├── bubble.html
│   ├── array.html
│   ├── linkedlist.html
│   ├── stack.html
│   ├── queue.html
│   ├── tree_traversal.html
│   ├── bst_insert.html
│   ├── heap.html
│   ├── graph_bfs.html
│   ├── binary_search.html
│   ├── selection.html
│   ├── insertion.html
│   └── quick.html
│
└── static/
    ├── css/
    └── js/
```

## 安装与运行（本地）

1. 安装依赖

```
pip install -r requirements.txt
```

2. 运行系统

```
python app.py
```

3. 打开浏览器访问

```
http://127.0.0.1:5000
```
