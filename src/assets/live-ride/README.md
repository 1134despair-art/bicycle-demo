# 实时骑行图片素材

本目录由实时骑行 UI 设计稿导出，仅用于实时骑行页面。

## 目录

- `icons/`：每个图标一个透明 PNG 文件，尺寸为 `96 × 96`。
- `backgrounds/`：实时骑行地图背景，尺寸为 `780 × 908`，对应页面 `390 × 454` 地图区的 2 倍图。
- `manifest.json`：文件名、颜色和适用场景索引。

## 使用规则

- 图标按 `24 × 24` CSS 尺寸使用；高清屏可直接使用当前 4 倍像素文件。
- 白色图标仅用于主题色或危险色实心按钮，不要放在白色背景上。
- `map-route-light@2x.png` 用于常规骑行。
- `map-route-satellite@2x.png` 用于卫星图层状态。
- `map-route-offline@2x.png` 用于离线地图状态。
- 不要对 PNG 图标二次拉伸、加阴影或改变宽高比例。

导出源脚本位于 `docs/design-system/live-ride-ui/scripts/export-assets.mjs`。
