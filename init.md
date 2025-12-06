我想要开发一个用于镜像源的首页

网页结构首先如下(域名为mirror.domain.com)

## 背景
我们要设计的首页为mirror.domain.com

每个镜像源都在子路径下比如
- mirror.domain.com/debian
- mirror.domain.com/ubuntu

然后挂载的资源路径下的结构是
❯ tree -L 2
.
├── debian
│   ├── dists
│   ├── doc
│   ├── extrafiles
│   ├── indices
│   ├── ls-lR.gz
│   ├── pool
│   ├── project
│   ├── README
│   ├── README.CD-manufacture
│   ├── README.html
│   ├── README.mirrors.html
│   ├── README.mirrors.txt
│   ├── tools
│   └── zzz-dists
├── debian-ports
│   └── debian
├── docker
│   └── debian
├── proxmox
│   └── dists
├── pxcloud
│   ├── devel
│   ├── lierfang.gpg
│   ├── pbs
│   ├── pxvdi
│   └── pxvirt
├── README.md
├── tailscale
│   ├── dists
│   └── pool
└── truenas
    └── fangtooth

## 显示需求
- 自动列出当前镜像源的列表根据路径下文件夹，不要硬编码。
```
❯ tree -L 1
.
├── debian
├── debian-ports
├── docker
├── proxmox
├── pxcloud
├── README.md
├── tailscale
└── truenas
```

- 设计一块说明区域，首先自动加载路径下的README.md文件，然后显示在页面上。能实时刷新当README.md文件有更新时，页面也自动更新。

- 有大标题以及子标题作为站点说明，这个标题最好是能通过配置文件或者环境变量加载


# 开发需求
- 前端使用react+tailwindcss
- 想使用  reactbits 的组件库


# 前端视觉需求
- 整体风格简洁现代，我们的第一目的就是好看
- 利用reactbits 的组件库，实现优雅现代的动画和交互效果
