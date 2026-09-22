# 蓝图骑行原型

Vue 3、TypeScript、Vite 移动端原型。演示流程使用前端数据，无需单独部署后端；防伪查询在未配置接口时使用本地 Mock。

## 本地运行

使用 Node.js 20.19+ 或兼容版本：

```bash
npm install
npm run dev
```

## 原型广场发布

在 `master` 分支提交源码和 `package-lock.json`。流水线执行：

```bash
npm install
npm run build:prod
```

静态产物位于 `dist/`，入口为 `dist/index.html`。Vite 资源路径为相对路径，页面使用 Hash 路由，可部署在 `/prototype-preview/{projectCode}/{demoCode}/` 等多级目录。`dist/` 和 `node_modules/` 不提交到仓库。

部分产品展示图片使用外部 HTTPS 图片服务，断网时这些图片可能不可用；本地媒体、登录背景和分享图片已包含在 `public/` 中。
