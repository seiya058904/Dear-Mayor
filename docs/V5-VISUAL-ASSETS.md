# V5 视觉资源说明

## 图标

`public/favicon.svg` 是原创简化文书蜡封徽记：深蓝底、暖纸和朱红印章，与现有案头配色相接。中心金色六向印痕在小尺寸仍有明暗反差。`scripts/render-icons.mjs` 用已有 Playwright 渲染同一 SVG，导出 180×180 Apple 图标、192×192 与 512×512 应用图标；Pillow 从 512 PNG 导出含 16/32/48 尺寸的 ICO。入口和 manifest 均使用相对基路径，适配根路径与 `/Dear-Mayor/`。图标在浅、深页面背景上靠深蓝外框保持边界。

预览：[512 图标](../public/icon-512.png)。系统级书签图标选择与不同浏览器标签栏外观没有独立人工验证；自动化确认资源可读取及链接路径正确。

## 宽幅背景

基于原 `public/art/background.webp`，用内置 imagegen 编辑生成 1916×821 宽幅手绘桌面，保持暖木桌、窗光、花、书、烛台、旗帜、羽笔等语言，并给中央文书留空。生成提示词：

> Use case: illustration-story. Edit the supplied Dear Mayor game background into a much wider landscape desktop background suitable for 21:9 displays. Preserve the entire central 1672x941 illustrated desk composition, warm amber sunlit wood, flower vase at upper left, books at lower left, candle and banner at upper right, ink bottle and quill at right, hand-painted soft medieval fairytale style. Extend only the left and right edges naturally with continuous wooden tabletop, subtle light and shadows, and restrained room-edge details. Keep the central desk empty for a large letter UI overlay. No text, no letter, no modern objects, no photorealism. Seamless visual continuity across the original center and new sides.

新图为 AI 编辑插画，中心细节并非旧图逐像素扩边；旧 `background.png`、`background.webp` 均保留，手机仍用旧 WebP。生成 PNG 2,457,545 字节，`background-wide.webp` 无损 1,886,514 字节，逐像素 RGB 相等；旧背景 PNG 3,447,119 字节、WebP 1,739,326 字节。资源哈希见 `asset-manifest.json`。构建缓存自动收集宽幅 WebP 与图标文件。

截图：[16:9](screenshots/v5/desktop-16x9.png)、[21:9 模拟](screenshots/v5/desktop-21x9.png)、[手机](screenshots/v5/phone.png)。另测 1600×1000、1000×800；未做实体超宽屏长时使用。
