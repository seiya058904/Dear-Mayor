# V5 长期因果试点

唯一文案依据：`V4-CAUSAL-PILOT.json` 与 `V4-REVIEW.md`。启用阿尔诺—彼得 `clock/continuation → clock/finale`、欧妲—阿满 `cellarmusic/continuation → cellarmusic/finale`。其余六组仍为设计稿，没有接入。没有增加文书、选项、显示数值或新故事门槛。

目录 20 是一个空机器契约增量，用于标识动态正文起点。目录 19 的两封 finale 标题和正文单独冻结于 `catalog-prose.json`。运行时只在目录 20 新开局、非 v1/v2/v3 迁入状态、来源决定带目录 20 标记时查验历史。来源 ID、action、reply index 和完整 result 必须与设计表完全一致，然后在目标正文的唯一锚点后插入一小句。选项、结果、sender 和调度不变。缺来源、缺字段、结果不符、旧目录、旧 pending、旧迁入边界、锚点失效均显示原静态正文。

回放只用不可变 history，不依赖后来会覆盖的 `facts.lastResult`。旧档在目标文书 pending 时仍用旧目录与原文；作出决定后才能升级目录，所记录结果继续按旧选项回放。自动化覆盖两组各六种实际可达来源、新旧 pending、损坏或截断来源、保存恢复、根路径和子路径的离线刷新。

实际界面截图：[钟匠 finale](screenshots/v5/clock-finale.png)、[酒窖 finale](screenshots/v5/cellarmusic-finale.png)。
