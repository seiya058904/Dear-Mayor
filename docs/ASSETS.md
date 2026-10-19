# 美术与字体来源

用户提供：`Medieval_Petition_Replication_Kit.zip`、两份 UI / handoff 文档、完整 v1.0 玩法任务书，以及 `D:/下载/1231` 原始生成素材。原始文件均未修改。复制包已含来源映射，项目实际复用其规范化图像，避免把原始图集误当独立按钮。

| 产物 | 来源与处理 |
|---|---|
| `public/art/background.png` | 复制包原背景，原样使用，无重复道具层 |
| `public/art/{approve,reject,defer,written_reply}.png` | 复制包已裁切按钮，含文字与图标；真实 button 提供点击与可访问名称 |
| `public/art/note.png` | 复制包 blank_paper，用作批示便笺 |
| `public/art/paper.png` | filled_paper 经内置 imagegen 编辑，移除全部文字，保留装饰框、百合、分隔线、红章与透明边缘 |
| `public/art/paper-mobile.png` | 桌面动态纸面经内置 imagegen 生成竖版，移除内部固定分隔线与红章，避免随长文拉伸后压字 |
| `public/fonts/wenkai.woff2` | LXGWWenKaiLite-Regular.ttf 完整字符集转换为 WOFF2，未删字；原 OFL 随包保留 |

## 生成提示词

桌面纸面：

> Use case: precise-object-edit. Create a production game sprite by editing the supplied decorated parchment stack. REMOVE ALL Chinese calligraphy/text only: date, title, sender, salutation, paragraphs and signature. Reconstruct continuous blank cream watercolor paper texture at the removed lettering. KEEP exactly the same paper stack silhouette, orientation, irregular edges, delicate gold four-sided ornamental frame with corner flourishes, center top gold fleur de lis, small gold horizontal title divider, lower-right red tree seal, warm colors and shading. Keep all decorations in exactly their original positions. Output transparent RGBA outside paper stack, same landscape 4:3 proportions and full uncropped stack. No letters, words or numbers anywhere. This must remain the supplied art, not a new redesign. Interior blank areas will receive actual HTML text in the game.

手机纸面：

> Use case: precise-object-edit. Create a mobile portrait version of this supplied blank decorated parchment stack for a real reading game. Keep same cream watercolor paper, delicate gold ornamental outer border, subtly irregular layered edges. Portrait aspect ratio 1:2.3, taller and narrower. Leave generous continuous blank interior for long Chinese text. Keep tiny gold fleur-de-lis centered at very top border. Remove the horizontal divider in the upper middle entirely. Remove lower right red seal entirely. No internal dividing lines, no text, no writing anywhere. Border stays near edges (about 8% margins), with fine small corners, not thick or oversized. The original has exactly the warm hand-painted visual language wanted. Transparent outside the stack, full unclipped stack visible. This is a production sprite to sit behind mobile DOM text.

## 字体

来源：[LXGW WenKai Lite 官方仓库](https://github.com/lxgw/LxgwWenKai-Lite)。使用其 Regular 完整字体，以 FontTools 4.67.0 / Brotli 1.2.0 转为网页 WOFF2（约 5.3 MB，原 TTF 约 13.9 MB），仅作格式转换。它是可读的风格替代，不宣称与参考图字形相同。许可见 `public/fonts/OFL.txt`。

## 视觉真值与差异

原目标为复制包 `reference/target_1672x941.png`。最终截图不是目标截图贴底，背景、纸面、DOM 文字、真实按钮是独立层。动态纸面的纸边、金边线宽、印章位置和字库存在可见差异；参考原始素材本身也并非目标截图的完全可逆分层。不要将本版称为像素级还原。

素材校验摘要保存在 `docs/asset-manifest.json`。未来改图应保留旧来源与新派生关系。
