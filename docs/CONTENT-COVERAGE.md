# 内容库存与覆盖（自动生成）

`npm run content:report` 从当前源码重新计算。状态 TARGET_REACHED；相似度筛查不能代替文学审校。

| 项目 | 计数 |
|---|---:|
| target | 1160 |
| before | 116 |
| uniqueAuthoredNodes | 1160 |
| newAuthoredNodes | 1044 |
| rewrittenLegacyNodes | 116 |
| remainingToTarget | 0 |
| reachableInOneRun | 860 |
| distinctStorylines | 82 |
| newCharacters | 62 |
| minBodyCharacters | 28 |
| maxBodyCharacters | 204 |
| previousBatchNodes | 1160 |
| newNodesThisBatch | 0 |
| changedPreviousMachineContractsThisBatch | 31 |
| standaloneItems | 586 |
| unconditionalStandaloneItems | 514 |
| conditionalEchoItems | 72 |
| gatedChainOpenings | 1 |
| echoesPerRun | 18 |
| specialOrUpperLevelItems | 139 |
| postExhaustionRepeatingVariants | 4 |
| unionReachable | 1160 |
| catalogRevision | 19 |
| catalogCompatibilityFixtureCases | 207 |
| migrationFixtureCases | 55 |
| v1FixtureCases | 16 |
| v2FixtureCases | 20 |
| v3FixtureCases | 19 |

静态 1160 节点中，互斥故事分支与回声不能在同一局全见。单局 860 = 82×4 + 514 + 18。4 种耗尽后循环不计原创节点。

完整性错误：0；完全重复正文：0；四字片段 Jaccard ≥0.45 的可疑对：0。
达到至少四节点的长重复句：0。均在 JSON 报告列出；未通过替换字符规避检测。

1000+ 静态原创节点完整性门槛：PASS（当前 1160；全池结构与调度覆盖，不等于文学验收）。1000 次决定模拟包含循环，不能充作 1000 封原创。

16 个 v1、20 个 v2、19 个 v3 固定样本及 176 个旧内容目录样本是冻结引擎生成的合法格式回归夹具，包含 v1→v2 前缀及耗尽/循环。不是收集的玩家个人数据。实际测试结果见 QA。

## 二十种子长期模拟

| seed | decisions | authored | unique IDs | days | pending |
|---:|---:|---:|---:|---:|---:|
| 0 | 1000 | 860 | 1000 | 251 | 0 |
| 1 | 1000 | 860 | 1000 | 251 | 0 |
| 2 | 1000 | 860 | 1000 | 251 | 0 |
| 3 | 1000 | 860 | 1000 | 251 | 0 |
| 4 | 1000 | 860 | 1000 | 251 | 0 |
| 5 | 1000 | 860 | 1000 | 251 | 0 |
| 6 | 1000 | 860 | 1000 | 251 | 0 |
| 7 | 1000 | 860 | 1000 | 251 | 0 |
| 8 | 1000 | 860 | 1000 | 251 | 0 |
| 9 | 1000 | 860 | 1000 | 251 | 0 |
| 10 | 1000 | 860 | 1000 | 251 | 0 |
| 11 | 1000 | 860 | 1000 | 251 | 0 |
| 12 | 1000 | 860 | 1000 | 251 | 0 |
| 13 | 1000 | 860 | 1000 | 251 | 0 |
| 14 | 1000 | 860 | 1000 | 251 | 0 |
| 15 | 1000 | 860 | 1000 | 251 | 0 |
| 16 | 1000 | 860 | 1000 | 251 | 0 |
| 17 | 1000 | 860 | 1000 | 251 | 0 |
| 18 | 1000 | 860 | 1000 | 251 | 0 |
| 19 | 1000 | 860 | 1000 | 251 | 0 |

## 全量库存

| ID | 标题 | 署名 | 形式 | 阶段 | 前史条件及最早间隔 |
|---|---|---|---|---|---|
| bridge/start | 桥梁修缮请愿 | 北渡口木匠行会 | letter | 1 | — |
| bridge/approve | 新桥的一声咳嗽 | 北渡口木匠行会 | letter | 2 | — |
| bridge/reject | 绕路的人与一块板 | 北渡口木匠行会 | letter | 2 | — |
| bridge/defer | 没有回音的桥头 | 北渡口木匠行会 | letter | 2 | — |
| bridge/reply | 木匠照着批示办 | 北渡口木匠行会 | letter | 2 | — |
| bridge/continuation | 桥边长出的花 | 北渡口木匠行会 | letter | 3 | — |
| bridge/finale | 留给下一位木匠 | 北渡口木匠行会 | letter | 4 | — |
| clock/start | 钟楼迟到问题 | 钟楼钟匠阿尔诺 | letter | 1 | — |
| clock/approve | 十二响面包不好卖 | 钟楼钟匠阿尔诺 | letter | 2 | — |
| clock/reject | 没有经费的耳朵 | 钟楼钟匠阿尔诺 | letter | 2 | — |
| clock/defer | 乌鸦先给了答复 | 钟楼钟匠阿尔诺 | letter | 2 | — |
| clock/reply | 听钟的人太认真 | 钟楼钟匠阿尔诺 | letter | 2 | — |
| clock/continuation | 一声也不能白送 | 钟楼钟匠阿尔诺 | letter | 3 | — |
| clock/finale | 钟匠给自己的规矩 | 钟楼钟匠阿尔诺 | letter | 4 | — |
| goat/start | 吃掉告示的山羊 | 羊倌托比 | letter | 1 | — |
| goat/approve | 一根桩的生意 | 羊倌托比 | letter | 2 | — |
| goat/reject | 牧场的读者 | 羊倌托比 | letter | 2 | — |
| goat/defer | 羊在门外等批文 | 羊倌托比 | letter | 2 | — |
| goat/reply | 薄荷没有学会读书 | 羊倌托比 | letter | 2 | — |
| goat/continuation | 失踪的申诉书 | 羊倌托比 | letter | 3 | — |
| goat/finale | 木牌上的春天 | 羊倌托比 | letter | 4 | — |
| ducks/start | 没有执照的鸭游行 | 洗衣人贝拉 | letter | 1 | — |
| ducks/approve | 鸭子不懂午后 | 洗衣人贝拉 | letter | 2 | — |
| ducks/reject | 绕河的迟到者 | 洗衣人贝拉 | letter | 2 | — |
| ducks/defer | 谁给鸭子盖了章 | 洗衣人贝拉 | letter | 2 | — |
| ducks/reply | 鸭队少了一个头 | 洗衣人贝拉 | letter | 2 | — |
| ducks/continuation | 洗衣绳下的通道 | 洗衣人贝拉 | letter | 3 | — |
| ducks/finale | 一张没有脚印的约定 | 洗衣人贝拉 | letter | 4 | — |
| bread/start | 诚实得过头的面包 | 面包师彼得 | letter | 1 | — |
| bread/approve | 试吃桌的空锅 | 面包师彼得 | letter | 2 | — |
| bread/reject | 门挡不肯退休 | 面包师彼得 | letter | 2 | — |
| bread/defer | 一封烤得很香的信 | 面包师彼得 | letter | 2 | — |
| bread/reply | 修士的半句道歉 | 面包师彼得 | letter | 2 | — |
| bread/continuation | 面包房里的小凳子 | 面包师彼得 | letter | 3 | — |
| bread/finale | 写在配方背面的名字 | 面包师彼得 | letter | 4 | — |
| flag/start | 远处看不清的威严 | 卫兵队长布鲁诺 | letter | 1 | — |
| flag/approve | 旗比门先到岗 | 卫兵队长布鲁诺 | letter | 2 | — |
| flag/reject | 栗子的证词 | 卫兵队长布鲁诺 | letter | 2 | — |
| flag/defer | 一袋不是税的栗子 | 卫兵队长布鲁诺 | letter | 2 | — |
| flag/reply | 巡卫不是巡回剧团 | 卫兵队长布鲁诺 | letter | 2 | — |
| flag/continuation | 夜里的低声口令 | 卫兵队长布鲁诺 | letter | 3 | — |
| flag/finale | 给新卫兵的一张纸 | 卫兵队长布鲁诺 | letter | 4 | — |
| garden/start | 墙角的一小片春天 | 寡居居民艾琳 | letter | 1 | — |
| garden/approve | 谁也没有种过的花 | 寡居居民艾琳 | letter | 2 | — |
| garden/reject | 窗台容不下的颜色 | 寡居居民艾琳 | letter | 2 | — |
| garden/defer | 一壶水不是地契 | 寡居居民艾琳 | letter | 2 | — |
| garden/reply | 写错名字的花签 | 寡居居民艾琳 | letter | 2 | — |
| garden/continuation | 给走累的人留个位子 | 寡居居民艾琳 | letter | 3 | — |
| garden/finale | 今年收下的种子 | 寡居居民艾琳 | letter | 4 | — |
| well/start | 井里的第二个人 | 井匠罗温 | letter | 1 | — |
| well/approve | 新绳需要旧规矩 | 井匠罗温 | letter | 2 | — |
| well/reject | 多走的一段水路 | 井匠罗温 | letter | 2 | — |
| well/defer | 井客不会替人取水 | 井匠罗温 | letter | 2 | — |
| well/reply | 回声学堂不收学生 | 井匠罗温 | letter | 2 | — |
| well/continuation | 雨后的第一桶 | 井匠罗温 | letter | 3 | — |
| well/finale | 井匠不想写传奇 | 井匠罗温 | letter | 4 | — |
| post/start | 两位住在尽头的人 | 驿夫塞缪尔 | letter | 1 | — |
| post/approve | 短巷子的长名字 | 驿夫塞缪尔 | letter | 2 | — |
| post/reject | 鞋底记得地址 | 驿夫塞缪尔 | letter | 2 | — |
| post/defer | 没拆开的两封信 | 驿夫塞缪尔 | letter | 2 | — |
| post/reply | 地址终于认识了人 | 驿夫塞缪尔 | letter | 2 | — |
| post/continuation | 驿站最后一格 | 驿夫塞缪尔 | letter | 3 | — |
| post/finale | 送到窗边的问候 | 驿夫塞缪尔 | letter | 4 | — |
| wedding/start | 婚礼上少了一把椅子 | 裁缝米拉 | letter | 1 | — |
| wedding/approve | 椅背上的两条丝带 | 裁缝米拉 | letter | 2 | — |
| wedding/reject | 借来的凳子有点矮 | 裁缝米拉 | letter | 2 | — |
| wedding/defer | 还没回信，先来喝汤 | 裁缝米拉 | letter | 2 | — |
| wedding/reply | 谁把座次画成了花 | 裁缝米拉 | letter | 2 | — |
| wedding/continuation | 婚纱边上的旧线 | 裁缝米拉 | letter | 3 | — |
| wedding/finale | 归还时多了一张借条 | 裁缝米拉 | letter | 4 | — |
| warmth/start | 窗缝里的冷风 | 药草师伊莎 | letter | 1 | — |
| warmth/approve | 不肯独自热着的炉子 | 药草师伊莎 | letter | 2 | — |
| warmth/reject | 借柴的人先道了谢 | 药草师伊莎 | letter | 2 | — |
| warmth/defer | 等回音的人没有催 | 药草师伊莎 | letter | 2 | — |
| warmth/reply | 帮助也要敲门 | 药草师伊莎 | letter | 2 | — |
| warmth/continuation | 想帮忙的人也怕冷 | 药草师伊莎 | letter | 3 | — |
| warmth/finale | 洗净后还回来的毛毯 | 药草师伊莎 | letter | 4 | — |
| fair/start | 南瓜应当站在哪边 | 商会代表奥斯温 | letter | 1 | — |
| fair/approve | 南瓜的坐垫 | 商会代表奥斯温 | letter | 2 | — |
| fair/reject | 萝卜摊的退让 | 商会代表奥斯温 | letter | 2 | — |
| fair/defer | 没有批文的瓜王 | 商会代表奥斯温 | letter | 2 | — |
| fair/reply | 切瓜之前先说清 | 商会代表奥斯温 | letter | 2 | — |
| fair/continuation | 节庆之后的果皮 | 商会代表奥斯温 | letter | 3 | — |
| fair/finale | 比南瓜还长的名单 | 商会代表奥斯温 | letter | 4 | — |
| goose/start | 鹅挡在秤前面 | 菜贩萝莎 | letter | 1 | — |
| goose/approve | 围栏外的贵宾 | 菜贩萝莎 | letter | 2 | — |
| goose/reject | 院里的菜账 | 菜贩萝莎 | letter | 2 | — |
| goose/defer | 鹅等过了午饭 | 菜贩萝莎 | letter | 2 | — |
| goose/reply | 三个人教一只鹅 | 菜贩萝莎 | letter | 2 | — |
| goose/continuation | 鱼贩递来的菜叶 | 菜贩萝莎 | letter | 3 | — |
| goose/finale | 不太像鹅的招牌 | 菜贩萝莎 | letter | 4 | — |
| inspection/start | 接待不包括天鹅 | 王室巡察处书记奎因 | official | 1 | — |
| inspection/approve | 梯子旁的一把椅子 | 王室巡察处书记奎因 | official | 2 | — |
| inspection/reject | 一次不必赔罪的改期 | 王室巡察处书记奎因 | official | 2 | — |
| inspection/defer | 信差带回的空盒 | 王室巡察处书记奎因 | official | 2 | — |
| inspection/reply | 附注里的附注 | 王室巡察处书记奎因 | official | 2 | — |
| inspection/continuation | 没有送出的天鹅羽毛 | 王室巡察处书记奎因 | official | 3 | — |
| inspection/finale | 给书记的私信袋 | 王室巡察处书记奎因 | official | 4 | — |
| lanename/start | 一条巷子的两个名字 | 住在东巷的阿苔 | letter | 1 | — |
| lanename/approve | 东巷的西边 | 住在东巷的阿苔 | letter | 2 | — |
| lanename/reject | 地址太长的面包 | 住在东巷的阿苔 | letter | 2 | — |
| lanename/defer | 等名字的猫 | 住在东巷的阿苔 | letter | 2 | — |
| lanename/reply | 两张图上同一棵树 | 住在东巷的阿苔 | letter | 2 | — |
| lanename/continuation | 一人缺一角的桌布 | 住在东巷的阿苔 | letter | 3 | — |
| lanename/finale | 没有写巷名的联署 | 住在东巷的阿苔 | letter | 4 | — |
| shadowplay/start | 巨龙只借一面墙 | 巡游戏班学徒洛洛 | letter | 1 | — |
| shadowplay/approve | 借墙之后借月亮 | 巡游戏班学徒洛洛 | letter | 2 | — |
| shadowplay/reject | 龙去客栈吃饭 | 巡游戏班学徒洛洛 | letter | 2 | — |
| shadowplay/defer | 练习里的小声音 | 巡游戏班学徒洛洛 | letter | 2 | — |
| shadowplay/reply | 龙尾巴有自己的主意 | 巡游戏班学徒洛洛 | letter | 2 | — |
| shadowplay/continuation | 公主想当送信人 | 巡游戏班学徒洛洛 | letter | 3 | — |
| shadowplay/finale | 饼盒里留一点空 | 巡游戏班学徒洛洛 | letter | 4 | — |
| shoebox/start | 一双没取走的小鞋 | 鞋匠马丁 | letter | 1 | — |
| shoebox/approve | 包鞋纸上的小路 | 鞋匠马丁 | letter | 2 | — |
| shoebox/reject | 柜子里仍有位置 | 鞋匠马丁 | letter | 2 | — |
| shoebox/defer | 门口的那句话 | 鞋匠马丁 | letter | 2 | — |
| shoebox/reply | 尺子不量人的心事 | 鞋匠马丁 | letter | 2 | — |
| shoebox/continuation | 窗边的小凳子 | 鞋匠马丁 | letter | 3 | — |
| shoebox/finale | 鞋底没写名字 | 鞋匠马丁 | letter | 4 | — |
| soupbell/start | 汤不能等钟饿了 | 食堂厨娘妮娜 | letter | 1 | — |
| soupbell/approve | 只有猫听见的铃 | 食堂厨娘妮娜 | letter | 2 | — |
| soupbell/reject | 嗓子也是借来的 | 食堂厨娘妮娜 | letter | 2 | — |
| soupbell/defer | 端汤的人先吃一口 | 食堂厨娘妮娜 | letter | 2 | — |
| soupbell/reply | 锅盖不参加演奏 | 食堂厨娘妮娜 | letter | 2 | — |
| soupbell/continuation | 两人份的一小锅 | 食堂厨娘妮娜 | letter | 3 | — |
| soupbell/finale | 不必记账的一碗 | 食堂厨娘妮娜 | letter | 4 | — |
| halfnotice/start | 通知只剩后半张 | 书记官露西安 | archive | 1 | — |
| halfnotice/approve | 副本也怕下雨 | 书记官露西安 | archive | 2 | — |
| halfnotice/reject | 残页不是镇里的规矩 | 书记官露西安 | archive | 2 | — |
| halfnotice/defer | 空出来的前半句 | 书记官露西安 | archive | 2 | — |
| halfnotice/reply | 派错处的问询函 | 书记官露西安 | archive | 2 | — |
| halfnotice/continuation | 一张附在残页旁的说明 | 书记官露西安 | archive | 3 | — |
| halfnotice/finale | 写着不知道的那一格 | 书记官露西安 | archive | 4 | — |
| borderpear/start | 梨落在哪一边 | 邻镇果农蓓姬 | letter | 1 | — |
| borderpear/approve | 一篮梨过两遍桥 | 邻镇果农蓓姬 | letter | 2 | — |
| borderpear/reject | 还留在沟边的半篮 | 邻镇果农蓓姬 | letter | 2 | — |
| borderpear/defer | 没盖章的梨 | 邻镇果农蓓姬 | letter | 2 | — |
| borderpear/reply | 书记带来的细绳 | 邻镇果农蓓姬 | letter | 2 | — |
| borderpear/continuation | 果酱的两种叫法 | 邻镇果农蓓姬 | letter | 3 | — |
| borderpear/finale | 树下不画线的午后 | 邻镇果农蓓姬 | letter | 4 | — |
| clocklesson/start | 少一颗齿的第一课 | 钟匠学徒小蓟 | letter | 1 | — |
| clocklesson/approve | 小孩问了师傅没问的 | 钟匠学徒小蓟 | letter | 2 | — |
| clocklesson/reject | 没去上课的那张图 | 钟匠学徒小蓟 | letter | 2 | — |
| clocklesson/defer | 先问一只不走的钟 | 钟匠学徒小蓟 | letter | 2 | — |
| clocklesson/reply | 图纸上留一块擦得掉的地方 | 钟匠学徒小蓟 | letter | 2 | — |
| clocklesson/continuation | 师傅也有不想被看见的时候 | 钟匠学徒小蓟 | letter | 3 | — |
| clocklesson/finale | 学徒簿空着师傅那一行 | 钟匠学徒小蓟 | letter | 4 | — |
| bluewash/start | 蓝袖口比主人先回家 | 洗衣人贝拉 | letter | 1 | — |
| bluewash/approve | 新架子晾出三封问询 | 洗衣人贝拉 | letter | 2 | — |
| bluewash/reject | 院里多了一道白墙 | 洗衣人贝拉 | letter | 2 | — |
| bluewash/defer | 我没把等待写成赛拉的错 | 洗衣人贝拉 | letter | 2 | — |
| bluewash/reply | 不是每种蓝都叫天空 | 洗衣人贝拉 | letter | 2 | — |
| bluewash/continuation | 两条旧带上的同一种结 | 染匠赛拉 | letter | 3 | — |
| bluewash/finale | 衣服干了，话还没说完 | 洗衣人贝拉 | letter | 4 | — |
| readaloud/start | 书不一定要自己捧着 | 图书管理员奥黛 | letter | 1 | — |
| readaloud/approve | 听众坐满，椅子少一把 | 图书管理员奥黛 | letter | 2 | — |
| readaloud/reject | 门边那一小段海 | 图书管理员奥黛 | letter | 2 | — |
| readaloud/defer | 他没有每天来等 | 图书管理员奥黛 | letter | 2 | — |
| readaloud/reply | 读书人也能选停在哪里 | 图书管理员奥黛 | letter | 2 | — |
| readaloud/continuation | 船匠给书里的椅子挑错 | 图书管理员奥黛 | letter | 3 | — |
| readaloud/finale | 今天换我听他讲 | 图书管理员奥黛 | letter | 4 | — |
| millerleave/start | 一辆装不下牵挂的车 | 磨坊主格里特 | letter | 1 | — |
| millerleave/approve | 送完人，车上剩一只碗 | 磨坊主格里特 | letter | 2 | — |
| millerleave/reject | 减掉的锅没有受委屈 | 磨坊主格里特 | letter | 2 | — |
| millerleave/defer | 他走了，申请还在等 | 磨坊主格里特 | letter | 2 | — |
| millerleave/reply | 临行那句别替我说 | 磨坊主格里特 | letter | 2 | — |
| millerleave/continuation | 一封只问风大的家信 | 磨坊主格里特 | letter | 3 | — |
| millerleave/finale | 把回来住一阵写在门内 | 磨坊主格里特 | letter | 4 | — |
| quietchoir/start | 唱错的那只鞋 | 修士安瑟 | letter | 1 | — |
| quietchoir/approve | 门廊站着一个不唱的人 | 修士安瑟 | letter | 2 | — |
| quietchoir/reject | 院墙把尾音带走了 | 修士安瑟 | letter | 2 | — |
| quietchoir/defer | 没唱出来也先记下 | 修士安瑟 | letter | 2 | — |
| quietchoir/reply | 歌队的名字先别绣 | 修士安瑟 | letter | 2 | — |
| quietchoir/continuation | 阿满想把第一句让给孩子 | 修士安瑟 | letter | 3 | — |
| quietchoir/finale | 那句落鞋留在笑话里 | 修士安瑟 | letter | 4 | — |
| waterturn/start | 小桶总排在大桶后 | 井匠罗温 | letter | 1 | — |
| waterturn/approve | 排头忘带自己的桶 | 井匠罗温 | letter | 2 | — |
| waterturn/reject | 井边不是认嗓门的地方 | 井匠罗温 | letter | 2 | — |
| waterturn/defer | 没人回信，老人仍来取水 | 井匠罗温 | letter | 2 | — |
| waterturn/reply | 一句提醒别抄成长文 | 井匠罗温 | letter | 2 | — |
| waterturn/continuation | 新来的人不知道旧规矩 | 井匠罗温 | letter | 3 | — |
| waterturn/finale | 没人需要记住谁让过谁 | 井匠罗温 | letter | 4 | — |
| lanternmarket/start | 黄昏再卖一小会儿 | 商会代表奥斯温 | letter | 1 | — |
| lanternmarket/approve | 灯亮了，窗里也亮了 | 商会代表奥斯温 | letter | 2 | — |
| lanternmarket/reject | 白天也能看见小灯 | 商会代表奥斯温 | letter | 2 | — |
| lanternmarket/defer | 还没开就先想好怎么收 | 商会代表奥斯温 | letter | 2 | — |
| lanternmarket/reply | 请帖没有写必须来 | 商会代表奥斯温 | letter | 2 | — |
| lanternmarket/continuation | 没有点亮的那一盏 | 商会代表奥斯温 | letter | 3 | — |
| lanternmarket/finale | 我没有写盛会两个字 | 商会代表奥斯温 | letter | 4 | — |
| paperkite/start | 风筝带着没寄出的对不起 | 学堂教师埃芙 | letter | 1 | — |
| paperkite/approve | 学会保密后大家小声过头 | 学堂教师埃芙 | letter | 2 | — |
| paperkite/reject | 没上那一课也得尊重人 | 学堂教师埃芙 | letter | 2 | — |
| paperkite/defer | 纸封着，风筝还在等 | 学堂教师埃芙 | letter | 2 | — |
| paperkite/reply | 一封不催回答的短信 | 学堂教师埃芙 | letter | 2 | — |
| paperkite/continuation | 纸屑要有自己的去处 | 学堂教师埃芙 | letter | 3 | — |
| paperkite/finale | 同一张纸上的两幅画 | 学堂教师埃芙 | letter | 4 | — |
| chestnutwatch/start | 卫兵买栗子也得找钱 | 栗子贩薇朵 | letter | 1 | — |
| chestnutwatch/approve | 人人都说自己也下班了 | 栗子贩薇朵 | letter | 2 | — |
| chestnutwatch/reject | 队旗后的半包午饭 | 栗子贩薇朵 | letter | 2 | — |
| chestnutwatch/defer | 两文钱和三个人的记性 | 栗子贩薇朵 | letter | 2 | — |
| chestnutwatch/reply | 休息时不必替旗杆站直 | 栗子贩薇朵 | letter | 2 | — |
| chestnutwatch/continuation | 一粒焦栗子没卖出去 | 栗子贩薇朵 | letter | 3 | — |
| chestnutwatch/finale | 这回他带来的不是队旗 | 栗子贩薇朵 | letter | 4 | — |
| basinboats/start | 船不下河也能试一试 | 旧船匠涅尔 | letter | 1 | — |
| basinboats/approve | 船长只坐得下一颗豆 | 旧船匠涅尔 | letter | 2 | — |
| basinboats/reject | 盆圆不圆不是借口 | 旧船匠涅尔 | letter | 2 | — |
| basinboats/defer | 木小舟先陪我们等 | 旧船匠涅尔 | letter | 2 | — |
| basinboats/reply | 老眼睛也能问新画法 | 旧船匠涅尔 | letter | 2 | — |
| basinboats/continuation | 师傅说慢一点时不是骂人 | 旧船匠涅尔 | letter | 3 | — |
| basinboats/finale | 两只不一样直的小舟 | 旧船匠涅尔 | letter | 4 | — |
| doorchalk/start | 门前的小鹿只有两条腿 | 送水人珂娅 | letter | 1 | — |
| doorchalk/approve | 祖母也想留脚印 | 送水人珂娅 | letter | 2 | — |
| doorchalk/reject | 纸上的鹿跑得更远 | 送水人珂娅 | letter | 2 | — |
| doorchalk/defer | 雨先替我回了信 | 送水人珂娅 | letter | 2 | — |
| doorchalk/reply | 图画里那只水桶 | 送水人珂娅 | letter | 2 | — |
| doorchalk/continuation | 厨房里有一块不用催的布 | 送水人珂娅 | letter | 3 | — |
| doorchalk/finale | 回字挤成了一只窗 | 送水人珂娅 | letter | 4 | — |
| foreignstones/start | 请把磨坊后面的地址补全 | 在邻镇学艺的尤恩 | letter | 1 | millerleave/start: approve/reject/defer/written_reply +25天 |
| foreignstones/approve | 回条先学会了旅行 | 在邻镇学艺的尤恩 | letter | 2 | — |
| foreignstones/reject | 叔父把门旁的树也写来了 | 在邻镇学艺的尤恩 | letter | 2 | — |
| foreignstones/defer | 不是每封短信都表示生气 | 在邻镇学艺的尤恩 | letter | 2 | — |
| foreignstones/reply | 师傅说名字别刻在石头底下 | 在邻镇学艺的尤恩 | letter | 2 | — |
| foreignstones/continuation | 这里的石头也不会自己变圆 | 在邻镇学艺的尤恩 | letter | 3 | — |
| foreignstones/finale | 我想多学一件再回来 | 在邻镇学艺的尤恩 | letter | 4 | — |
| stonelion/start | 石狮子没有领过马钱 | 石匠乌戈 | letter | 1 | — |
| stonelion/approve | 马桩旁的狮子价钱 | 石匠乌戈 | letter | 2 | — |
| stonelion/reject | 帕福的嘴比牌子先开工 | 石匠乌戈 | letter | 2 | — |
| stonelion/defer | 狮子嘴里多了一块饼 | 石匠乌戈 | letter | 2 | — |
| stonelion/reply | 缺的那颗牙不是新伤 | 石匠乌戈 | letter | 2 | — |
| stonelion/continuation | 我把威风刻得太满了 | 石匠乌戈 | letter | 3 | — |
| stonelion/finale | 下一只狮子要先画扫帚 | 石匠乌戈 | letter | 4 | — |
| mapname/start | 地图上多了一个亲启镇 | 王室地图刻版处芙嘉 | official | 1 | — |
| mapname/approve | 更正时又挤歪了河 | 王室地图刻版处芙嘉 | official | 2 | — |
| mapname/reject | 旧卷里还夹着邻镇的纸 | 王室地图刻版处芙嘉 | official | 2 | — |
| mapname/defer | 没有回信不等于喜欢新名字 | 王室地图刻版处芙嘉 | official | 2 | — |
| mapname/reply | 师傅的放大镜看不见自己的错 | 王室地图刻版处芙嘉 | official | 2 | — |
| mapname/continuation | 错版要不要全刮干净 | 王室地图刻版处芙嘉 | official | 3 | — |
| mapname/finale | 下回别寄最漂亮的错字 | 王室地图刻版处芙嘉 | official | 4 | — |
| wagonroute/start | 车轮不认识体面二字 | 王室转运队军官塔琳 | official | 1 | — |
| wagonroute/approve | 一辆空车引出三种传闻 | 王室转运队军官塔琳 | official | 2 | — |
| wagonroute/reject | 本队查路的人也得先问门 | 王室转运队军官塔琳 | official | 2 | — |
| wagonroute/defer | 等回报的车停在镇外 | 王室转运队军官塔琳 | official | 2 | — |
| wagonroute/reply | 图上的圈不是每处都能停 | 王室转运队军官塔琳 | official | 2 | — |
| wagonroute/continuation | 重车留下的不是王室花纹 | 王室转运队军官塔琳 | official | 3 | — |
| wagonroute/finale | 回执不写全体欢欣 | 王室转运队军官塔琳 | official | 4 | — |
| wrongpie/start | 送到镇厅的饼不是给镇长的 | 诺拉婆婆 | letter | 1 | — |
| wrongpie/approve | 饼回家，盒上多了一张纸 | 诺拉婆婆 | letter | 2 | — |
| wrongpie/reject | 我自己走一趟也没关系 | 诺拉婆婆 | letter | 2 | — |
| wrongpie/defer | 等信时我已经认回盒了 | 诺拉婆婆 | letter | 2 | — |
| wrongpie/reply | 苏默想给盒子画个镇厅 | 诺拉婆婆 | letter | 2 | — |
| wrongpie/continuation | 两家都以为对方不爱甜 | 诺拉婆婆 | letter | 3 | — |
| wrongpie/finale | 孙辈说下次直接喊我吃 | 诺拉婆婆 | letter | 4 | — |
| lastloom/start | 祖母的织机比门还宽 | 织工绮蔻 | letter | 1 | — |
| lastloom/approve | 十天不够织完一场争吵 | 织工绮蔻 | letter | 2 | — |
| lastloom/reject | 捐出去也不是丢掉祖母 | 织工绮蔻 | letter | 2 | — |
| lastloom/defer | 没有回信，母亲先挪了床 | 织工绮蔻 | letter | 2 | — |
| lastloom/reply | 梭子落在我的脚边 | 织工绮蔻 | letter | 2 | — |
| lastloom/continuation | 第一段布丑得很像我 | 织工绮蔻 | letter | 3 | — |
| lastloom/finale | 留下一张椅子的位置 | 织工绮蔻 | letter | 4 | — |
| ferrydaughter/start | 女儿不想继承那支长篙 | 渡船人罗恩 | letter | 1 | — |
| ferrydaughter/approve | 旧消息下来了，我还在岸边 | 渡船人罗恩 | letter | 2 | — |
| ferrydaughter/reject | 我自己去把那张纸拿回了 | 渡船人罗恩 | letter | 2 | — |
| ferrydaughter/defer | 她把篙放回了我的船 | 渡船人罗恩 | letter | 2 | — |
| ferrydaughter/reply | 琴盒里有一条河 | 渡船人罗恩 | letter | 2 | — |
| ferrydaughter/continuation | 渡口少一双手也要照常开船 | 渡船人罗恩 | letter | 3 | — |
| ferrydaughter/finale | 她回家第一句问汤在哪里 | 渡船人罗恩 | letter | 4 | — |
| actorspurse/start | 龙把钱袋吞进肚里了 | 巡游戏班领班奥斯丁 | letter | 1 | — |
| actorspurse/approve | 观众笑了，我却没笑出来 | 巡游戏班领班奥斯丁 | letter | 2 | — |
| actorspurse/reject | 说短一点，也得说到原来的人 | 巡游戏班领班奥斯丁 | letter | 2 | — |
| actorspurse/defer | 洛洛不想收那袋赔礼栗子 | 巡游戏班领班奥斯丁 | letter | 2 | — |
| actorspurse/reply | 新钱袋有我的名字 | 巡游戏班领班奥斯丁 | letter | 2 | — |
| actorspurse/continuation | 少一场戏，给大家留一晚 | 巡游戏班领班奥斯丁 | letter | 3 | — |
| actorspurse/finale | 龙头先上车，人最后核齐 | 巡游戏班领班奥斯丁 | letter | 4 | — |
| cellarmusic/start | 地下的鬼只会拉一个音 | 客栈老板欧妲 | letter | 1 | — |
| cellarmusic/approve | 下午的鬼换了听众 | 客栈老板欧妲 | letter | 2 | — |
| cellarmusic/reject | 我没准那时辰，不是叫他别学 | 客栈老板欧妲 | letter | 2 | — |
| cellarmusic/defer | 没人捉鬼，客人自己写了结尾 | 客栈老板欧妲 | letter | 2 | — |
| cellarmusic/reply | 那根弦终于像一根弦了 | 客栈老板欧妲 | letter | 2 | — |
| cellarmusic/continuation | 碗要洗，琴也想练 | 客栈老板欧妲 | letter | 3 | — |
| cellarmusic/finale | 酒窖今晚只住酒桶 | 客栈老板欧妲 | letter | 4 | — |
| countesswalk/start | 这次请别让孔雀来接我 | 女伯爵玛蕾的私人来信 | official | 1 | — |
| countesswalk/approve | 她先问我有没有带零钱 | 女伯爵玛蕾的私人来信 | official | 2 | — |
| countesswalk/reject | 没来成也不必送一车花 | 女伯爵玛蕾的私人来信 | official | 2 | — |
| countesswalk/defer | 没等回信，我先在自家园里坐了 | 女伯爵玛蕾的私人来信 | official | 2 | — |
| countesswalk/reply | 普通茶也不是一挥手便来 | 女伯爵玛蕾的私人来信 | official | 2 | — |
| countesswalk/continuation | 我想买那盆最不起眼的草 | 女伯爵玛蕾的私人来信 | official | 3 | — |
| countesswalk/finale | 谢函比那盆草还高 | 女伯爵玛蕾的私人来信 | official | 4 | — |
| hollowdrum/start | 我的鼓还响，我的耳朵也在 | 退伍鼓匠格登 | letter | 1 | — |
| hollowdrum/approve | 入了名单，我也会说不 | 退伍鼓匠格登 | letter | 2 | — |
| hollowdrum/reject | 那我就只接邻居的活 | 退伍鼓匠格登 | letter | 2 | — |
| hollowdrum/defer | 送来的轻鼓真是好鼓 | 退伍鼓匠格登 | letter | 2 | — |
| hollowdrum/reply | 鼓面上的姓不是我的 | 退伍鼓匠格登 | letter | 2 | — |
| hollowdrum/continuation | 他想学的不是我最会的 | 退伍鼓匠格登 | letter | 3 | — |
| hollowdrum/finale | 我不把每一次见面敲出来 | 退伍鼓匠格登 | letter | 4 | — |
| flouroath/start | 这炉面包我先答应多了 | 面包师彼得 | letter | 1 | — |
| flouroath/approve | 桌子分不开一只大面包 | 面包师彼得 | letter | 2 | — |
| flouroath/reject | 我家面包不能堵住人家的嘴 | 面包师彼得 | letter | 2 | — |
| flouroath/defer | 没等回信，炉火也不能等 | 面包师彼得 | letter | 2 | — |
| flouroath/reply | 艾达说这次让我先说完 | 面包师彼得 | letter | 2 | — |
| flouroath/continuation | 今天轮到师傅把话说短 | 面包师彼得 | letter | 3 | — |
| flouroath/finale | 空着的炉边不是留给国王 | 面包师彼得 | letter | 4 | — |
| pearboundary/start | 树根不肯认我画的线 | 邻镇果农蓓姬 | letter | 1 | — |
| pearboundary/approve | 看完才知石沿早裂一角 | 邻镇果农蓓姬 | letter | 2 | — |
| pearboundary/reject | 我不愿拿一篮梨换他不说话 | 邻镇果农蓓姬 | letter | 2 | — |
| pearboundary/defer | 梨先落了，信还没来 | 邻镇果农蓓姬 | letter | 2 | — |
| pearboundary/reply | 图里没写舍不得 | 邻镇果农蓓姬 | letter | 2 | — |
| pearboundary/continuation | 我第一次看见邻家怎么推车 | 邻镇果农蓓姬 | letter | 3 | — |
| pearboundary/finale | 这一次邀请与梨树无关 | 邻镇果农蓓姬 | letter | 4 | — |
| tinmoon/start | 我只想借一刻没有这盏灯 | 观星人绪恩 | letter | 1 | — |
| tinmoon/approve | 看清楚以后，是我算错了 | 观星人绪恩 | letter | 2 | — |
| tinmoon/reject | 邻家的高墙倒帮了我 | 观星人绪恩 | letter | 2 | — |
| tinmoon/defer | 没等到信，云先收了整片天 | 观星人绪恩 | letter | 2 | — |
| tinmoon/reply | 镜里那颗星是锅盖 | 观星人绪恩 | letter | 2 | — |
| tinmoon/continuation | 孩子问我还会不会算错 | 观星人绪恩 | letter | 3 | — |
| tinmoon/finale | 今晚没奇观，也不算白看 | 观星人绪恩 | letter | 4 | — |
| emptylikeness/start | 我想画镇长常坐的空椅 | 画师岚珂 | letter | 1 | — |
| emptylikeness/approve | 椅子后面长出一座金山 | 画师岚珂 | letter | 2 | — |
| emptylikeness/reject | 不像伟人也不能随便画别人 | 画师岚珂 | letter | 2 | — |
| emptylikeness/defer | 没有回音，空椅先被人坐了 | 画师岚珂 | letter | 2 | — |
| emptylikeness/reply | 我差点把扫帚画进阴影里 | 画师岚珂 | letter | 2 | — |
| emptylikeness/continuation | 画底下是谁的名字 | 画师岚珂 | letter | 3 | — |
| emptylikeness/finale | 草稿里那点面包屑我没擦 | 画师岚珂 | letter | 4 | — |
| granaryrain/start | 雨比我先查了屋顶 | 公仓守仓人托文 | letter | 1 | — |
| granaryrain/approve | 补好一角，又多出一车 | 公仓守仓人托文 | letter | 2 | — |
| granaryrain/reject | 半间仓也得好好用 | 公仓守仓人托文 | letter | 2 | — |
| granaryrain/defer | 桶满了，事情还没满纸 | 公仓守仓人托文 | letter | 2 | — |
| granaryrain/reply | 借来的屋子也有主人的事 | 公仓守仓人托文 | letter | 2 | — |
| granaryrain/continuation | 我的桶底也漏了一点 | 公仓守仓人托文 | letter | 3 | — |
| granaryrain/finale | 一只新桶不能算新屋顶 | 公仓守仓人托文 | letter | 4 | — |
| bathhearth/start | 炉门闹脾气，澡屋得歇一歇 | 澡屋主人斐拉 | letter | 1 | — |
| bathhearth/approve | 车送走了，客人却提前来了 | 澡屋主人斐拉 | letter | 2 | — |
| bathhearth/reject | 等不到车也不能怪炉门 | 澡屋主人斐拉 | letter | 2 | — |
| bathhearth/defer | 没回信的几日也要发工钱 | 澡屋主人斐拉 | letter | 2 | — |
| bathhearth/reply | 修理单比炉门更热闹 | 澡屋主人斐拉 | letter | 2 | — |
| bathhearth/continuation | 旧木凳趁停业露了个角 | 澡屋主人斐拉 | letter | 3 | — |
| bathhearth/finale | 开门那日也不必全镇都来 | 澡屋主人斐拉 | letter | 4 | — |
| kilnclay/start | 这回窑里先响了坏消息 | 陶匠黛西 | letter | 1 | — |
| kilnclay/approve | 妮娜把旧碗端来给我看 | 陶匠黛西 | letter | 2 | — |
| kilnclay/reject | 退钱那日，我不想看炉子 | 陶匠黛西 | letter | 2 | — |
| kilnclay/defer | 钱留在抽屉，碗不算交了 | 陶匠黛西 | letter | 2 | — |
| kilnclay/reply | 新碗不是越薄越有面子 | 陶匠黛西 | letter | 2 | — |
| kilnclay/continuation | 一只歪杯碰到一只大手 | 陶匠黛西 | letter | 3 | — |
| kilnclay/finale | 这一窑不求每只都唱歌 | 陶匠黛西 | letter | 4 | — |
| turnipgiant/start | 这颗萝卜把自己种成了邻居 | 菜贩赫伯 | letter | 1 | — |
| turnipgiant/approve | 车上坐着一位没有腿的贵客 | 菜贩赫伯 | letter | 2 | — |
| turnipgiant/reject | 没车，它还在地里当大王 | 菜贩赫伯 | letter | 2 | — |
| turnipgiant/defer | 我先替萝卜收了一次信 | 菜贩赫伯 | letter | 2 | — |
| turnipgiant/reply | 我以为分开就不算我的本事了 | 菜贩赫伯 | letter | 2 | — |
| turnipgiant/continuation | 小萝卜也要过秤 | 菜贩赫伯 | letter | 3 | — |
| turnipgiant/finale | 孩子把冠戴在一只小的上 | 菜贩赫伯 | letter | 4 | — |
| royalbook/start | 王室想借一本不肯多出一本的书 | 王室阅书官希铎 | official | 1 | — |
| royalbook/approve | 书到了，箱子比书讲究 | 王室阅书官希铎 | official | 2 | — |
| royalbook/reject | 没借到原本，我先读了目录 | 王室阅书官希铎 | official | 2 | — |
| royalbook/defer | 没有回函不是书已经出门 | 王室阅书官希铎 | official | 2 | — |
| royalbook/reply | 抄页上的空格也有来历 | 王室阅书官希铎 | official | 2 | — |
| royalbook/continuation | 原来读过的人不想只站在旁边 | 王室阅书官希铎 | official | 3 | — |
| royalbook/finale | 借过与没借过都不能叫献上 | 王室阅书官希铎 | official | 4 | — |
| dancefloor/start | 集市散后，脚想多留一会儿 | 乐师维奥 | letter | 1 | — |
| dancefloor/approve | 诺拉说她想跳，不想被扶着跳 | 乐师维奥 | letter | 2 | — |
| dancefloor/reject | 没借到场，琴先在我家歇了 | 乐师维奥 | letter | 2 | — |
| dancefloor/defer | 等回音的人先把脚踩热了 | 乐师维奥 | letter | 2 | — |
| dancefloor/reply | 跳得最慢的人记住了曲子 | 乐师维奥 | letter | 2 | — |
| dancefloor/continuation | 木板响得比我的琴齐 | 乐师维奥 | letter | 3 | — |
| dancefloor/finale | 那支曲子也该有个停的地方 | 乐师维奥 | letter | 4 | — |
| hillpasture/start | 羊很爱这片不归它的草 | 羊倌莓可 | letter | 1 | — |
| hillpasture/approve | 我画了边界，羊没学过字 | 羊倌莓可 | letter | 2 | — |
| hillpasture/reject | 离开坡地，羊没替我生气 | 羊倌莓可 | letter | 2 | — |
| hillpasture/defer | 等地的不是羊，是我 | 羊倌莓可 | letter | 2 | — |
| hillpasture/reply | 贝拉的布上画着一只羊 | 羊倌莓可 | letter | 2 | — |
| hillpasture/continuation | 我想给贝拉一团羊毛 | 羊倌莓可 | letter | 3 | — |
| hillpasture/finale | 明年还想借，也得重新问 | 羊倌莓可 | letter | 4 | — |
| nightferry/start | 这封急信没有长出第二条船 | 渡船人罗恩 | letter | 1 | — |
| nightferry/approve | 说好一箱，来时又跟着一位 | 渡船人罗恩 | letter | 2 | — |
| nightferry/reject | 我拒绝后，他们把戏改了时辰 | 渡船人罗恩 | letter | 2 | — |
| nightferry/defer | 等回函的时辰也在走 | 渡船人罗恩 | letter | 2 | — |
| nightferry/reply | 那口箱子最怕的不是晚 | 渡船人罗恩 | letter | 2 | — |
| nightferry/continuation | 渡口有一张不写免费的小凳 | 渡船人罗恩 | letter | 3 | — |
| nightferry/finale | 今晚我想听自己的锅响 | 渡船人罗恩 | letter | 4 | — |
| wrongdoor/start | 门做好了，家却进不去了 | 木匠学徒伊沃 | letter | 1 | — |
| wrongdoor/approve | 合工棚的门不等于合我家 | 木匠学徒伊沃 | letter | 2 | — |
| wrongdoor/reject | 我拿门板吃了一顿饭 | 木匠学徒伊沃 | letter | 2 | — |
| wrongdoor/defer | 邻居敲的是我没装上的门 | 木匠学徒伊沃 | letter | 2 | — |
| wrongdoor/reply | 刻掉的花有些像一条鱼 | 木匠学徒伊沃 | letter | 2 | — |
| wrongdoor/continuation | 量尺上没有我想要的那一格 | 木匠学徒伊沃 | letter | 3 | — |
| wrongdoor/finale | 门最后得归房子，不归面子 | 木匠学徒伊沃 | letter | 4 | — |
| nightlodging/start | 客人来了，床没有跟着长 | 客栈老板欧妲 | letter | 1 | — |
| nightlodging/approve | 借来的是一晚，不是一座客栈 | 客栈老板欧妲 | letter | 2 | — |
| nightlodging/reject | 我把自己的房先看了一遍 | 客栈老板欧妲 | letter | 2 | — |
| nightlodging/defer | 等回音的人自己找到一盏灯 | 客栈老板欧妲 | letter | 2 | — |
| nightlodging/reply | 她不想用一箱东西付谢意 | 客栈老板欧妲 | letter | 2 | — |
| nightlodging/continuation | 我自己写的床数也得看 | 客栈老板欧妲 | letter | 3 | — |
| nightlodging/finale | 她回来时想买一碗面 | 客栈老板欧妲 | letter | 4 | — |
| sharedoven/start | 三家的果馅想挤一口炉 | 厨娘妮娜 | letter | 1 | — |
| sharedoven/approve | 梨饼跑进了诺拉的酸果里 | 厨娘妮娜 | letter | 2 | — |
| sharedoven/reject | 没借炉，我们先吃了冷梨 | 厨娘妮娜 | letter | 2 | — |
| sharedoven/defer | 面团不读镇厅的回信 | 厨娘妮娜 | letter | 2 | — |
| sharedoven/reply | 她带来的不是我熟悉的甜 | 厨娘妮娜 | letter | 2 | — |
| sharedoven/continuation | 收完盘，地上还有我们的热闹 | 厨娘妮娜 | letter | 3 | — |
| sharedoven/finale | 下次我先问谁真的有空 | 厨娘妮娜 | letter | 4 | — |
| shadowclock/start | 我想借太阳的一点影子 | 观星人绪恩 | letter | 1 | — |
| shadowclock/approve | 太阳走了，影子被孩子踩住了 | 观星人绪恩 | letter | 2 | — |
| shadowclock/reject | 树影本来就在路上 | 观星人绪恩 | letter | 2 | — |
| shadowclock/defer | 云没把名字写在信上 | 观星人绪恩 | letter | 2 | — |
| shadowclock/reply | 树叶比我更会画小狗 | 观星人绪恩 | letter | 2 | — |
| shadowclock/continuation | 他站在阴处也一样认真 | 观星人绪恩 | letter | 3 | — |
| shadowclock/finale | 太阳没领我们的课表 | 观星人绪恩 | letter | 4 | — |
| playvillain/start | 坏人也想先吃晚饭 | 戏班学徒洛洛 | letter | 1 | — |
| playvillain/approve | 换了结尾，我却还在大笑 | 戏班学徒洛洛 | letter | 2 | — |
| playvillain/reject | 没借厅，台词还在我嘴里 | 戏班学徒洛洛 | letter | 2 | — |
| playvillain/defer | 我等回信，坏人等下一句 | 戏班学徒洛洛 | letter | 2 | — |
| playvillain/reply | 演公主的人想多说半句 | 戏班学徒洛洛 | letter | 2 | — |
| playvillain/continuation | 坏人的靴子也磨破了 | 戏班学徒洛洛 | letter | 3 | — |
| playvillain/finale | 台词先留着，门照约关 | 戏班学徒洛洛 | letter | 4 | — |
| threadwage/start | 布还没织完，帮工已经做了活 | 织工绮蔻 | letter | 1 | — |
| threadwage/approve | 钱到了，我先想买一只新梭 | 织工绮蔻 | letter | 2 | — |
| threadwage/reject | 我自己答应的，不能交给她等 | 织工绮蔻 | letter | 2 | — |
| threadwage/defer | 抽屉里那张未回的信 | 织工绮蔻 | letter | 2 | — |
| threadwage/reply | 她又来了，是想谈自己的花样 | 织工绮蔻 | letter | 2 | — |
| threadwage/continuation | 她提醒我中午也有长度 | 织工绮蔻 | letter | 3 | — |
| threadwage/finale | 这片布她想自己带去 | 织工绮蔻 | letter | 4 | — |
| weddingday/start | 女儿过两日成婚，我的车也有约 | 车夫麦森 | letter | 1 | — |
| weddingday/approve | 我去了，祝词却忘在车上 | 车夫麦森 | letter | 2 | — |
| weddingday/reject | 我只赶到最后一段曲子 | 车夫麦森 | letter | 2 | — |
| weddingday/defer | 没回信，我就一直想也许 | 车夫麦森 | letter | 2 | — |
| weddingday/reply | 帮过我一次，不欠我每回 | 车夫麦森 | letter | 2 | — |
| weddingday/continuation | 那张小凳子是他们自己挑的 | 车夫麦森 | letter | 3 | — |
| weddingday/finale | 我想少答应一个也能赶得上 | 车夫麦森 | letter | 4 | — |
| lostdonkey/start | 驴没说自己要去哪一户 | 老彭 | letter | 1 | — |
| lostdonkey/approve | 来了三份线索，没有三头我的驴 | 老彭 | letter | 2 | — |
| lostdonkey/reject | 我问了一圈，先找到自己的绳 | 老彭 | letter | 2 | — |
| lostdonkey/defer | 它回来时嘴里也没带回信 | 老彭 | letter | 2 | — |
| lostdonkey/reply | 别人家的驴也有自己的门 | 老彭 | letter | 2 | — |
| lostdonkey/continuation | 我拿新绳给阿苔看 | 老彭 | letter | 3 | — |
| lostdonkey/finale | 驴不必再来镇厅道谢 | 老彭 | letter | 4 | — |
| unevencolor/start | 这匹红一头深，一头先害羞了 | 染匠斐尔 | letter | 1 | — |
| unevencolor/approve | 槽还没脏，我的袖子先换色了 | 染匠斐尔 | letter | 2 | — |
| unevencolor/reject | 小罐不肯替我装整匹布 | 染匠斐尔 | letter | 2 | — |
| unevencolor/defer | 等回音时，雨替我催了一遍 | 染匠斐尔 | letter | 2 | — |
| unevencolor/reply | 客人问我能不能再染坏一匹 | 染匠斐尔 | letter | 2 | — |
| unevencolor/continuation | 浅的一段，我自己想留下 | 染匠斐尔 | letter | 3 | — |
| unevencolor/finale | 帘子挂起来，我才喜欢那一半 | 染匠斐尔 | letter | 4 | — |
| glassfish/start | 我做了一群游不动的鱼 | 玻璃匠维珀 | letter | 1 | — |
| glassfish/approve | 鱼游到别人靴子上去了 | 玻璃匠维珀 | letter | 2 | — |
| glassfish/reject | 家里那面墙倒有了客人 | 玻璃匠维珀 | letter | 2 | — |
| glassfish/defer | 阴天把鱼全留在了玻璃里 | 玻璃匠维珀 | letter | 2 | — |
| glassfish/reply | 有客人想买一面每天都有鱼的墙 | 玻璃匠维珀 | letter | 2 | — |
| glassfish/continuation | 少一条鱼，反而看清空处 | 玻璃匠维珀 | letter | 3 | — |
| glassfish/finale | 我想把鱼放得再低一点 | 玻璃匠维珀 | letter | 4 | — |
| candlemarks/start | 我给蜡烛画了一身时辰 | 制烛人柚宁 | letter | 1 | — |
| candlemarks/approve | 两根烛走出了不同的步子 | 制烛人柚宁 | letter | 2 | — |
| candlemarks/reject | 没借场，我先擦掉了价目旁的钟 | 制烛人柚宁 | letter | 2 | — |
| candlemarks/defer | 邻人等的是一顿饭，不是这条线 | 制烛人柚宁 | letter | 2 | — |
| candlemarks/reply | 有人只喜欢烛上的小短线 | 制烛人柚宁 | letter | 2 | — |
| candlemarks/continuation | 短烛端上桌，汤反而先亮了 | 制烛人柚宁 | letter | 3 | — |
| candlemarks/finale | 这支没画线，是留给我自己的 | 制烛人柚宁 | letter | 4 | — |
| honeycontest/start | 我说全镇最甜，还没问过别家的蜜 | 蜂农岚泽 | letter | 1 | — |
| honeycontest/approve | 样瓶坐上桌，我想回去送货了 | 蜂农岚泽 | letter | 2 | — |
| honeycontest/reject | 没进试味会，照样有人来买 | 蜂农岚泽 | letter | 2 | — |
| honeycontest/defer | 我先写好的奖签还在抽屉里 | 蜂农岚泽 | letter | 2 | — |
| honeycontest/reply | 同一口蜜，有人先想喝水 | 蜂农岚泽 | letter | 2 | — |
| honeycontest/continuation | 邻居种的花不是我专用的蜜罐 | 蜂农岚泽 | letter | 3 | — |
| honeycontest/finale | 铺名想写我的名字，不写第一甜 | 蜂农岚泽 | letter | 4 | — |
| teanewcomer/start | 茶凉了，我还没讲到自己名字 | 新住户蘅岚 | letter | 1 | — |
| teanewcomer/approve | 第一位客人只想喝热的 | 新住户蘅岚 | letter | 2 | — |
| teanewcomer/reject | 托盘还没端稳，她先叹起气了 | 新住户蘅岚 | letter | 2 | — |
| teanewcomer/defer | 我的盘缠怎么先上路了 | 新住户蘅岚 | letter | 2 | — |
| teanewcomer/reply | 糖请留在杯子里 | 新住户蘅岚 | letter | 2 | — |
| teanewcomer/continuation | 有人在门外叫了我的名字 | 新住户蘅岚 | letter | 3 | — |
| teanewcomer/finale | 来我家，这三个字写顺手了 | 新住户蘅岚 | letter | 4 | — |
| oldchess/start | 我先说必胜，才发现不会摆马 | 东巷住户老彭 | letter | 1 | — |
| oldchess/approve | 棋借到了，我把马认得太亲了 | 东巷住户老彭 | letter | 2 | — |
| oldchess/reject | 纸上的马也没有比木头的听话 | 东巷住户老彭 | letter | 2 | — |
| oldchess/defer | 回信还没来，我已输了自己的左手 | 东巷住户老彭 | letter | 2 | — |
| oldchess/reply | 阿苔说让我先走，我又不乐意了 | 东巷住户老彭 | letter | 2 | — |
| oldchess/continuation | 我输了一局，想买自己的棋盘 | 东巷住户老彭 | letter | 3 | — |
| oldchess/finale | 这次我想请她来，不附一场必胜 | 东巷住户老彭 | letter | 4 | — |
| lampwindow/start | 灯照见路，也照进了我的被窝 | 巷口守灯人黛芬 | letter | 1 | — |
| lampwindow/approve | 看灯的人先站到了我的窗外 | 巷口守灯人黛芬 | letter | 2 | — |
| lampwindow/reject | 没等来查看，我先学着把帘拉严 | 巷口守灯人黛芬 | letter | 2 | — |
| lampwindow/defer | 回音没到，邻人先以为灯要搬家 | 巷口守灯人黛芬 | letter | 2 | — |
| lampwindow/reply | 有人想看得清，有人只想看得见 | 巷口守灯人黛芬 | letter | 2 | — |
| lampwindow/continuation | 我的帘做好了，灯的事还要照实说 | 巷口守灯人黛芬 | letter | 3 | — |
| lampwindow/finale | 白天的巷子我也想走一走 | 巷口守灯人黛芬 | letter | 4 | — |
| nightbloom/start | 花偏在我想睡时开了 | 园丁艾琳 | letter | 1 | — |
| nightbloom/approve | 灯照着半朵，纸上却画了整朵 | 园丁艾琳 | letter | 2 | — |
| nightbloom/reject | 我的影子倒比花开得大 | 园丁艾琳 | letter | 2 | — |
| nightbloom/defer | 孩子给花画了眼睛 | 园丁艾琳 | letter | 2 | — |
| nightbloom/reply | 请别敲我家的花盆 | 园丁艾琳 | letter | 2 | — |
| nightbloom/continuation | 花谢了，问花的人还没散 | 园丁艾琳 | letter | 3 | — |
| nightbloom/finale | 花盆占了我的吃饭位置 | 园丁艾琳 | letter | 4 | — |
| debtorlist/start | 这张欠账单，我想先贴出去 | 商会代表奥斯温 | letter | 1 | — |
| debtorlist/approve | 上墙的两个字找来了不欠钱的人 | 商会代表奥斯温 | letter | 2 | — |
| debtorlist/reject | 没贴成，账簿里倒先找到一张回条 | 商会代表奥斯温 | letter | 2 | — |
| debtorlist/defer | 回音没到，老客先不来取新货了 | 商会代表奥斯温 | letter | 2 | — |
| debtorlist/reply | 我把物主记成了借筐的人 | 商会代表奥斯温 | letter | 2 | — |
| debtorlist/continuation | 真欠的那一笔，也得听真话 | 商会代表奥斯温 | letter | 3 | — |
| debtorlist/finale | 账清了一些，我还想好好做生意 | 商会代表奥斯温 | letter | 4 | — |
| breadapprentice/start | 这批面包想让她主做，我仍担原约 | 面包师彼得 | letter | 1 | — |
| breadapprentice/approve | 她做得不一样，我先想遮住那一面 | 面包师彼得 | letter | 2 | — |
| breadapprentice/reject | 这炉我来做，她却帮我发现一处焦边 | 面包师彼得 | letter | 2 | — |
| breadapprentice/defer | 回音没到，她先问今天算不算工 | 面包师彼得 | letter | 2 | — |
| breadapprentice/reply | 她不想把试炉都署成我的名字 | 面包师彼得 | letter | 2 | — |
| breadapprentice/continuation | 她想做的第一只，不是镇厅订的那种 | 面包师彼得 | letter | 3 | — |
| breadapprentice/finale | 这次轮到她说我的面包有点咸 | 面包师彼得 | letter | 4 | — |
| duettempo/start | 合奏两个人，我想先走在前头 | 乐师维奥 | letter | 1 | — |
| duettempo/approve | 我先走了，笛声留在后面 | 乐师维奥 | letter | 2 | — |
| duettempo/reject | 没改节目，我们先在屋里吵了半支曲 | 乐师维奥 | letter | 2 | — |
| duettempo/defer | 回音没来，我先听见自己太响 | 乐师维奥 | letter | 2 | — |
| duettempo/reply | 她喜欢那一句，我却一直想删 | 乐师维奥 | letter | 2 | — |
| duettempo/continuation | 我今天想坐在后面听她一次 | 乐师维奥 | letter | 3 | — |
| duettempo/finale | 两个人的尾音，不必一样长 | 乐师维奥 | letter | 4 | — |
| rockingseat/start | 这把椅子，我故意没让它站死 | 木匠玛塔 | letter | 1 | — |
| rockingseat/approve | 有人说它坏了，另一个却不肯下来 | 木匠玛塔 | letter | 2 | — |
| rockingseat/reject | 没借角落，我先坐回自己的直脚椅 | 木匠玛塔 | letter | 2 | — |
| rockingseat/defer | 信没回，孩子先叫它木船了 | 木匠玛塔 | letter | 2 | — |
| rockingseat/reply | 有人想把所有园椅都换成它 | 木匠玛塔 | letter | 2 | — |
| rockingseat/continuation | 我想留一把自己也常坐的椅子 | 木匠玛塔 | letter | 3 | — |
| rockingseat/finale | 姐姐想用一篮梨换我的旧椅 | 木匠玛塔 | letter | 4 | — |
| wideumbrella/start | 我做了一把能让两个人不吵架的伞 | 制伞人檐朵 | letter | 1 | — |
| wideumbrella/approve | 伞下没吵，伞边倒有人说话了 | 制伞人檐朵 | letter | 2 | — |
| wideumbrella/reject | 没借到位，邻人先问收起来多重 | 制伞人檐朵 | letter | 2 | — |
| wideumbrella/defer | 信没回，有人已替伞配好了新人 | 制伞人檐朵 | letter | 2 | — |
| wideumbrella/reply | 两位客人都想自己拿伞柄 | 制伞人檐朵 | letter | 2 | — |
| wideumbrella/continuation | 我给自己留了一把很普通的伞 | 制伞人檐朵 | letter | 3 | — |
| wideumbrella/finale | 今天下雨，我也想只当一个走路的人 | 制伞人檐朵 | letter | 4 | — |
| shortrope/start | 长出一截的绳，我也想收进价里 | 制绳人延栖 | letter | 1 | — |
| shortrope/approve | 收看的人先拿出了原来那只小箱 | 制绳人延栖 | letter | 2 | — |
| shortrope/reject | 没改约，留下那截倒刚好捆自己的箱 | 制绳人延栖 | letter | 2 | — |
| shortrope/defer | 回音没到，我先把长绳说成有人要了 | 制绳人延栖 | letter | 2 | — |
| shortrope/reply | 客人要一截，不想接一个结绳故事 | 制绳人延栖 | letter | 2 | — |
| shortrope/continuation | 别人教我的结，不用都叫延栖结 | 制绳人延栖 | letter | 3 | — |
| shortrope/finale | 我想买一截合用的，不先比谁的更长 | 制绳人延栖 | letter | 4 | — |
| sweepstakes/start | 我也想听一回大家喊快看 | 清扫人菲恩 | letter | 1 | — |
| sweepstakes/approve | 大叶扫走了，小灰却留在鞋上 | 清扫人菲恩 | letter | 2 | — |
| sweepstakes/reject | 没比成，我在巷尾听见一声辛苦 | 清扫人菲恩 | letter | 2 | — |
| sweepstakes/defer | 信没回，孩子先给路撒满了花瓣 | 清扫人菲恩 | letter | 2 | — |
| sweepstakes/reply | 我的扫帚今天少了一把威风 | 清扫人菲恩 | letter | 2 | — |
| sweepstakes/continuation | 我想请别人看一小段已经干净的路 | 清扫人菲恩 | letter | 3 | — |
| sweepstakes/finale | 今晚那碗汤，我想带回家喝 | 清扫人菲恩 | letter | 4 | — |
| countesspoem/start | 这回想先让诗到场，我晚些再到 | 女伯爵玛蕾 | letter | 1 | — |
| countesspoem/approve | 评语说鹅写得像一位很富的鹅 | 女伯爵玛蕾 | letter | 2 | — |
| countesspoem/reject | 没匿名投成，我先读给了一只猫 | 女伯爵玛蕾 | letter | 2 | — |
| countesspoem/defer | 回音没到，随员已经学会叫我诗人阁下 | 女伯爵玛蕾 | letter | 2 | — |
| countesspoem/reply | 雷纳每一句都说好，我越听越怕 | 女伯爵玛蕾 | letter | 2 | — |
| countesspoem/continuation | 我读到别人写的鹅，竟没有银盘 | 女伯爵玛蕾 | letter | 3 | — |
| countesspoem/finale | 我的鹅这回终于肯自己走路了 | 女伯爵玛蕾 | letter | 4 | — |
| maskthanks/start | 那张笑脸能替我领谢吗 | 面具匠葵诺 | letter | 1 | — |
| maskthanks/approve | 有人把坏掉的面具送到瑞恩家了 | 面具匠葵诺 | letter | 2 | — |
| maskthanks/reject | 我没去，作坊里倒热闹得很 | 面具匠葵诺 | letter | 2 | — |
| maskthanks/defer | 我们两个都在等别人先动 | 面具匠葵诺 | letter | 2 | — |
| maskthanks/reply | 我在台边只说出了谢谢 | 面具匠葵诺 | letter | 2 | — |
| maskthanks/continuation | 笑得最大的一张，试戴的人说累 | 面具匠葵诺 | letter | 3 | — |
| maskthanks/finale | 这次我想坐在台下看 | 面具匠葵诺 | letter | 4 | — |
| soupbyname/start | 那锅汤上为什么写着我的名字 | 厨娘妮娜 | letter | 1 | — |
| soupbyname/approve | 纸撤了，邻人的脸也沉下去了 | 厨娘妮娜 | letter | 2 | — |
| soupbyname/reject | 我把原纸和新纸一起拿来了 | 厨娘妮娜 | letter | 2 | — |
| soupbyname/defer | 没等到回话，我先把自家的晚饭煮糊了 | 厨娘妮娜 | letter | 2 | — |
| soupbyname/reply | 改方的人也有她想留的味 | 厨娘妮娜 | letter | 2 | — |
| soupbyname/continuation | 我也改过母亲教的那一锅 | 厨娘妮娜 | letter | 3 | — |
| soupbyname/finale | 这次请她来吃我不擅长的东西 | 厨娘妮娜 | letter | 4 | — |
| twolabeltrunk/start | 两张旧签把一只箱子说成两件事 | 客栈老板欧妲 | letter | 1 | — |
| twolabeltrunk/approve | 箱里没有一件替我解围的公文 | 客栈老板欧妲 | letter | 2 | — |
| twolabeltrunk/reject | 不开箱，也得给走廊留一条路 | 客栈老板欧妲 | letter | 2 | — |
| twolabeltrunk/defer | 客人开始把那只箱子当成我的了 | 客栈老板欧妲 | letter | 2 | — |
| twolabeltrunk/reply | 回条找到了，人却还在路上 | 客栈老板欧妲 | letter | 2 | — |
| twolabeltrunk/continuation | 箱主到了，先摸了一下提手 | 客栈老板欧妲 | letter | 3 | — |
| twolabeltrunk/finale | 这次他请我只看外面 | 客栈老板欧妲 | letter | 4 | — |
| quietbetrothal/start | 那场大家都知道的宴，我们想先停下 | 笙棠与泊禾 | letter | 1 | — |
| quietbetrothal/approve | 厅空下来了，话倒挤满了街 | 笙棠与泊禾 | letter | 2 | — |
| quietbetrothal/reject | 原约还在，我们却不能照原话去坐 | 笙棠与泊禾 | letter | 2 | — |
| quietbetrothal/defer | 没回的信让亲友还在做点心 | 笙棠与泊禾 | letter | 2 | — |
| quietbetrothal/reply | 同一张纸，我们各改了一句话 | 笙棠与泊禾 | letter | 2 | — |
| quietbetrothal/continuation | 那只大碗是她借的，木匙是我的 | 笙棠与泊禾 | letter | 3 | — |
| quietbetrothal/finale | 我们想把合写的那首歌留给自己 | 笙棠与泊禾 | letter | 4 | — |
| daily/0 | 猫不愿担任馆长 | 图书管理员奥黛 | letter | 独立 | — |
| daily/1 | 倒着挂的门牌 | 学堂教师埃芙 | letter | 独立 | — |
| daily/2 | 盐罐里的小石头 | 食堂厨娘妮娜 | letter | 独立 | — |
| daily/3 | 借一阵风的申请 | 磨坊主格里特 | letter | 独立 | — |
| daily/4 | 蜂箱不接受指挥 | 养蜂人佩拉 | letter | 独立 | — |
| daily/5 | 松鼠借走了纽扣 | 裁缝米拉 | letter | 独立 | — |
| daily/6 | 会移动的晾布影子 | 染匠赛拉 | letter | 独立 | — |
| daily/7 | 失物里的一只鞋 | 清扫人菲恩 | letter | 独立 | — |
| daily/8 | 晨祷之前的喷嚏 | 修士安瑟 | letter | 独立 | — |
| daily/9 | 鹅毛笔的脾气 | 书记官露西安 | letter | 独立 | — |
| daily/10 | 鱼摊的风向旗 | 鱼贩赫伯 | letter | 独立 | — |
| daily/11 | 只有一只手的手套 | 木匠玛塔 | letter | 独立 | — |
| daily/12 | 背面也能写字 | 造纸人陶恩 | letter | 独立 | — |
| daily/13 | 画得太像的萝卜 | 学堂教师埃芙 | letter | 独立 | — |
| daily/14 | 比信还快的蜗牛 | 驿夫塞缪尔 | letter | 独立 | — |
| daily/15 | 客栈枕头的争论 | 客栈老板欧妲 | letter | 独立 | — |
| daily/16 | 夜里不认颜色的灯 | 烛匠芬恩 | letter | 独立 | — |
| daily/17 | 忘记带走的掌声 | 乐师维奥 | letter | 独立 | — |
| daily/18 | 一张没有牙印的课表 | 羊倌托比 | letter | 独立 | — |
| daily/19 | 搬不动的欢迎石 | 石匠乌戈 | letter | 独立 | — |
| daily/20 | 会漏水的雨量碗 | 磨坊主格里特 | letter | 独立 | — |
| daily/21 | 花环里的洋葱 | 花贩莉娅 | letter | 独立 | — |
| daily/22 | 袜子该不该成双 | 诺拉婆婆 | letter | 独立 | — |
| daily/23 | 糖罐需要一把小勺 | 客栈老板欧妲 | letter | 独立 | — |
| daily/24 | 一把伞下的两张地图 | 商会代表奥斯温 | letter | 独立 | — |
| daily/25 | 不想叫醒全街的门环 | 铁匠达恩 | letter | 独立 | — |
| daily/26 | 忘在讲台上的苹果 | 图书管理员奥黛 | letter | 独立 | — |
| daily/27 | 吹不到自己脸上的扇子 | 清扫人菲恩 | letter | 独立 | — |
| daily/28 | 乐谱上的一只苍蝇 | 乐师维奥 | letter | 独立 | — |
| daily/29 | 陶碗底下的名字 | 陶匠黛西 | letter | 独立 | — |
| daily/30 | 被风翻过的故事结尾 | 学堂教师埃芙 | letter | 独立 | — |
| daily/31 | 一封不用回礼的来函 | 邻镇书记官赫敏 | letter | 独立 | — |
| town/duke-button | 领主的第三颗纽扣 | 领主府管家雷纳 | official | 独立 | — |
| town/returned-praise | 表扬信寄回来了 | 巡察处退件员 | archive | 独立 | — |
| town/empty-gift | 一只空罐的说明 | 邻镇书记官赫敏 | note | 独立 | — |
| town/unsigned-mittens | 我不想说是谁 | 没有署名的来信 | archive | 独立 | — |
| town/pot-lid-witness | 锅盖的两份证词 | 铁匠达恩与厨娘妮娜 | letter | 独立 | — |
| town/night-pigeon | 夜哨上的鸽子 | 守夜卫兵布鲁诺 | note | 独立 | — |
| town/bishop-beans | 大人不吃那种豆 | 主教府助理修士柏恩 | official | 独立 | — |
| town/clock-ears | 师傅把耳朵忘在家 | 钟匠学徒小蓟 | letter | 独立 | — |
| town/flower-refund | 花束开得太慢 | 花贩莉娅 | letter | 独立 | — |
| town/lost-signature | 落款被咬走了 | 驿站退件簿 | archive | 独立 | — |
| town/school-whisper | 小声说话的比赛 | 学堂教师埃芙 | letter | 独立 | — |
| town/washline-letter | 请别晾这封信 | 染匠赛拉 | note | 独立 | — |
| town/guild-apology | 撤下最响亮的招牌 | 商会代表奥斯温 | official | 独立 | — |
| town/candle-moon | 不卖月光的蜡烛 | 烛匠芬恩 | letter | 独立 | — |
| town/hen-exemption | 鸡不会在这张纸上签名 | 王室税务员莫温 | official | 独立 | — |
| town/quiet-return | 把送别的花带回来 | 药草师伊莎 | letter | 独立 | — |
| town/inn-snore | 哪间房离鼾声远 | 客栈老板欧妲 | letter | 独立 | — |
| town/herb-taste | 苦不代表更有用 | 药草师伊莎 | note | 独立 | — |
| town/librarian-blank | 这页本来就是空白 | 图书管理员奥黛 | archive | 独立 | — |
| town/garden-chair | 坐着也能看花 | 园丁艾琳 | letter | 独立 | — |
| town/merchant-honest | 我把坏处先写了 | 行商苏默 | letter | 独立 | — |
| town/widow-key | 暂时不换那把钥匙 | 诺拉婆婆 | letter | 独立 | — |
| town/tax-smudge | 这不是新的税印 | 税务员莫温 | official | 独立 | — |
| town/wrong-wedding | 给马的请帖 | 驿夫塞缪尔 | archive | 独立 | — |
| town/inn-half-song | 只唱到一半的歌 | 客栈洗碗人阿满 | letter | 独立 | — |
| town/snow-wood | 冬柴里的一根梁 | 木匠玛塔 | letter | 独立 | — |
| town/missing-page-two | 第二页在第一页里面 | 抄书人苔丝 | archive | 独立 | — |
| town/bread-end | 面包头不该没人要 | 面包师彼得 | note | 独立 | — |
| town/ferry-dog | 狗不上船的理由 | 渡船人罗恩 | letter | 独立 | — |
| town/old-date | 日期被油抹掉了 | 没有署名的旧信 | archive | 独立 | — |
| town/two-apologies | 我们都带了道歉 | 石匠乌戈与清扫人菲恩 | letter | 独立 | — |
| town/abbey-permission | 没有命令全镇午睡 | 修道院院长索恩 | official | 独立 | — |
| echo/bridge-clear | 孩子记得那袋面粉 | 学堂教师埃芙 | letter | 独立 | bridge/start: approve +10天 |
| echo/bridge-detour | 绕路时看见的树 | 洗衣人贝拉 | letter | 独立 | bridge/start: reject +12天 |
| echo/bridge-no-answer | 师傅那张修过的凳子 | 木匠学徒伊沃 | letter | 独立 | bridge/start: defer +9天 |
| echo/bridge-instructions | 批示背面的船影 | 渡船人罗恩 | letter | 独立 | bridge/start: written_reply +11天 |
| echo/clock-repaired | 钟修好那天的焦面包 | 面包师彼得 | letter | 独立 | clock/start: approve +10天 |
| echo/clock-refused | 没有拨款的那一页 | 钟匠学徒小蓟 | letter | 独立 | clock/start: reject +13天 |
| echo/clock-unanswered | 没回信不能写成不许 | 书记官露西安 | letter | 独立 | clock/start: defer +8天 |
| echo/clock-replied | 不要给批示配进行曲 | 乐师维奥 | letter | 独立 | clock/start: written_reply +12天 |
| echo/goose-fence | 围栏挪走以后 | 鱼贩赫伯 | letter | 独立 | goose/start: approve +10天 |
| echo/goose-home | 鹅回院子那一天 | 食堂厨娘妮娜 | letter | 独立 | goose/start: reject +11天 |
| echo/goose-wait | 牵绳不能牵公事 | 守夜卫兵布鲁诺 | letter | 独立 | goose/start: defer +9天 |
| echo/goose-plan | 不是所有动物都开会 | 羊倌托比 | letter | 独立 | goose/start: written_reply +12天 |
| town/red-margin | 红墨只涂在边上 | 王室誊写处助理芙嘉 | official | 独立 | — |
| town/duke-back-portrait | 画像暂时面向墙 | 领主府管家雷纳 | official | 独立 | — |
| town/chestnut-song | 栗子熟了，歌还没熟 | 栗子贩薇朵 | letter | 独立 | — |
| town/flour-footprints | 脚印长得一模一样 | 卫兵队长布鲁诺 | archive | 独立 | — |
| town/countess-peacock | 孔雀拒绝撑伞 | 王室花园管事赫达 | official | 独立 | — |
| town/royal-cold-soup | 不冒热气的汤 | 王室膳房誊写员鲁缇 | official | 独立 | — |
| town/small-mayor | 我今天只当半个镇长 | 学堂孩子栗米 | note | 独立 | — |
| town/cobbler-mud-map | 鞋底带回的小地图 | 鞋匠马丁 | letter | 独立 | — |
| town/teacup-left-handle | 杯把总在另一边 | 客栈洗碗人阿满 | letter | 独立 | — |
| town/returned-festival-date | 邀请寄到时已经散场 | 王室节庆处芙嘉 | archive | 独立 | — |
| town/three-baskets | 三只篮子都不认主人 | 菲恩、赫伯与莉娅 | letter | 独立 | — |
| town/tailor-pocket | 口袋先别缝死 | 裁缝米拉 | note | 独立 | — |
| town/flower-seed-label | 纸包上的黄不够用了 | 照料花园的艾琳 | letter | 独立 | — |
| town/smith-silent-hammer | 木槌不是怕铁锤 | 铁匠达恩 | letter | 独立 | — |
| town/librarian-reserved-page | 别替读者跳过那一页 | 图书管理员奥黛 | archive | 独立 | — |
| town/messenger-boot-toll | 鞋底的泥不算过境货 | 关卡书记柯尔 | official | 独立 | — |
| town/not-a-seal | 这枚印是饼底 | 造纸人陶恩 | note | 独立 | — |
| town/garlic-parcel | 包裹比地址先被认出 | 驿夫塞缪尔 | note | 独立 | — |
| town/short-toast | 祝词还没完，菜已经凉 | 客栈老板欧妲 | letter | 独立 | — |
| town/royal-smile | 笑不够齐不用重来 | 王室礼仪处芙嘉 | official | 独立 | — |
| town/winter-neighbor-hat | 雪比通知先到 | 邻镇书记官赫敏 | letter | 独立 | — |
| town/mirror-shop | 镜子不肯替我讲价 | 商会代表奥斯温 | letter | 独立 | — |
| town/soup-name | 昨天汤和今日汤 | 食堂厨娘妮娜 | letter | 独立 | — |
| town/miller-name-bag | 袋上写了叔叔 | 磨坊主格里特 | note | 独立 | — |
| town/clock-ribbon-door | 门口那条丝带不报时 | 钟楼学徒小蓟 | letter | 独立 | — |
| town/goose-quill | 鹅毛笔不是鹅签的 | 菜贩萝莎 | letter | 独立 | — |
| town/map-fold-stream | 河流折到山后去了 | 驿夫塞缪尔 | archive | 独立 | — |
| town/baron-petition-time | 大人也会说请稍等 | 领主府管家雷纳 | official | 独立 | — |
| town/misdelivered-birthcloth | 小帽子装进大帽盒 | 裁缝米拉 | archive | 独立 | — |
| town/garden-worm-title | 蚯蚓没有领过工钱 | 照料花园的艾琳 | note | 独立 | — |
| town/traveler-unasked-riddle | 买一把勺要先猜谜吗 | 行商苏默 | letter | 独立 | — |
| town/snowman-return | 借给布雪人的围巾 | 石匠乌戈 | note | 独立 | — |
| echo/bread-soup-cups | 试吃那回留下的半碗 | 食堂厨娘妮娜 | letter | 独立 | bread/start: approve +10天 |
| echo/bread-doorstop | 门挡还得找真的 | 铁匠达恩 | letter | 独立 | bread/start: reject +12天 |
| echo/bread-paper-envelope | 能吃的信仍只算点心 | 书记官露西安 | letter | 独立 | bread/start: defer +9天 |
| echo/bread-recipe-listener | 想把吃法听清的人 | 驿夫塞缪尔 | letter | 独立 | bread/start: written_reply +13天 |
| echo/warmth-still-page | 那张不再自己翻的纸 | 造纸人陶恩 | letter | 独立 | warmth/start: approve +11天 |
| echo/warmth-split-wood | 伊莎分出去的那一半 | 木匠玛塔 | letter | 独立 | warmth/start: reject +10天 |
| echo/warmth-blanket-stitch | 备用毯上的旧针脚 | 裁缝米拉 | letter | 独立 | warmth/start: defer +8天 |
| echo/warmth-knock-first | 邻镇想借的不是一位老人 | 邻镇书记官赫敏 | letter | 独立 | warmth/start: written_reply +12天 |
| echo/post-sign-shadow | 巷牌投下的那点阴影 | 染匠赛拉 | letter | 独立 | post/start: approve +10天 |
| echo/post-tree-change | 盆栽不是不会搬的门牌 | 照料花园的艾琳 | letter | 独立 | post/start: reject +11天 |
| echo/post-private-slip | 认领条也有背面 | 裁缝米拉 | letter | 独立 | post/start: defer +9天 |
| echo/post-near-letter | 写给隔着一条街的人 | 客栈洗碗人阿满 | letter | 独立 | post/start: written_reply +12天 |
| town/eaves-two-shadows | 两位贵客带来三道影子 | 烛匠芬恩 | letter | 独立 | — |
| town/mixed-herb-seeds | 花种包穿了药包外衣 | 药草师伊莎 | archive | 独立 | — |
| town/wrong-town-award | 这份夸奖不是夸我们的 | 邻镇抄写员赫敏 | official | 独立 | — |
| town/chestnut-ladle | 量栗子的不是汤勺 | 栗子贩薇朵 | note | 独立 | — |
| town/full-inn-sign | 招牌说欢迎，房间没说有空 | 客栈老板欧妲 | letter | 独立 | — |
| town/apprentice-order | 这张订货纸先别夸我字好 | 面包房学徒艾达 | letter | 独立 | — |
| town/honey-lid | 蜜罐不是考臂力的 | 养蜂人佩拉 | letter | 独立 | — |
| town/dog-rent | 爪印没有租下谷仓 | 镇厅收件人露西安 | archive | 独立 | — |
| town/two-old-united | 巷名没谈拢，豆子先晒上了 | 阿苔与老彭 | letter | 独立 | — |
| town/old-letter-window | 请给还没上任的镇长 | 没有署名的旧信 | archive | 独立 | — |
| town/clock-signature | 师傅的名字我先留空 | 钟匠学徒小蓟 | note | 独立 | — |
| town/captain-handkerchief | 这一封不归转运卷 | 转运队军官塔琳 | letter | 独立 | — |
| town/stone-cube | 圆得不能放下的样品 | 邻镇磨石匠萨瓦 | letter | 独立 | — |
| town/withdrawn-ladder | 梯子申请可以划回去了 | 屋顶修补人苔默 | note | 独立 | — |
| town/broom-is-work | 我只有两只手，扫帚也占一只 | 清扫人菲恩 | letter | 独立 | — |
| town/quiet-remembrance | 留一盏灯，不留一整夜 | 客栈老板欧妲 | letter | 独立 | — |
| town/perfume-onion | 香袋里那半片洋葱 | 花贩莉娅 | letter | 独立 | — |
| town/wet-broom-flag | 这不是第二面队旗 | 巡卫新兵德伊 | note | 独立 | — |
| town/crooked-table-vote | 那张桌子不投反对票 | 行会书记露西安 | letter | 独立 | — |
| town/rhyme-echo | 井里的诗人只会最后一行 | 乐师维奥 | letter | 独立 | — |
| town/cat-key | 猫没有借走那本书 | 图书管理员奥黛 | archive | 独立 | — |
| town/bathhouse-banner | 毛巾不是投降的白旗 | 澡屋主人斐拉 | letter | 独立 | — |
| town/chess-king-wait | 国王能不能等我喝口水 | 诺拉婆婆 | note | 独立 | — |
| town/sleeve-check | 新袖口很威风，手抬不高 | 裁缝米拉 | letter | 独立 | — |
| town/abbot-empty-seat | 这个空座位没有人占 | 修道院院长索恩 | official | 独立 | — |
| town/two-page-return | 补鞋的后半封像在求婚 | 驿站退件处 | archive | 独立 | — |
| town/half-bell-hat | 帽子上的铃只管帽子 | 守钟学徒小蓟 | letter | 独立 | — |
| town/soup-three-signatures | 我们只同意这一锅汤 | 妮娜、赫伯与栗子贩薇朵 | letter | 独立 | — |
| town/dance-shoe-silence | 戏还没演，鞋先鼓掌 | 巡游戏班学徒洛洛 | letter | 独立 | — |
| town/town-stamp-pillow | 印章不睡这个枕头 | 书记官露西安 | note | 独立 | — |
| town/welcome-without-song | 我们来三个人，不来一首歌 | 邻镇书记官赫敏 | official | 独立 | — |
| town/empty-chair-lesson | 空椅子也没有缺课 | 学堂教师埃芙 | letter | 独立 | — |
| echo/clocklesson-year-class | 去年缺掉的那颗齿 | 学堂教师埃芙 | letter | 独立 | clocklesson/start: approve +190天 |
| echo/clocklesson-year-shop | 没去成课堂的旧图还在 | 钟匠学徒小蓟 | letter | 独立 | clocklesson/start: reject +190天 |
| echo/clocklesson-year-wait | 那只坏钟终于不当听众了 | 钟匠阿尔诺 | letter | 独立 | clocklesson/start: defer +190天 |
| echo/clocklesson-year-reply | 抄本里夹着一枚纸齿轮 | 钟匠学徒小蓟 | letter | 独立 | clocklesson/start: written_reply +190天 |
| echo/paperkite-after-class | 他没有把朋友的名字刻上去 | 木匠学徒伊沃 | letter | 独立 | paperkite/start: approve +62天 |
| echo/paperkite-after-private | 我想邀请他看，不催他坐 | 学堂孩子栗米 | letter | 独立 | paperkite/start: reject +65天 |
| echo/paperkite-after-silence | 我不想为了认一个字读完信 | 珂娅的女儿小素 | letter | 独立 | paperkite/start: defer +58天 |
| echo/paperkite-after-instructions | 看新画不表示我要换座位 | 学堂里收到过道歉纸的孩子 | letter | 独立 | paperkite/start: written_reply +68天 |
| echo/miller-after-cart | 送到镇门以后我又多走了几步 | 磨坊主格里特 | letter | 独立 | millerleave/start: approve +66天 |
| echo/miller-after-light-bag | 没带走的那口锅仍在煮汤 | 木匠学徒伊沃 | letter | 独立 | millerleave/start: reject +61天 |
| echo/miller-after-unanswered | 那双手套并不是丢的那双 | 裁缝米拉 | letter | 独立 | millerleave/start: defer +70天 |
| echo/miller-after-plan | 这不是尤恩磨坊的广告 | 磨坊主格里特 | letter | 独立 | millerleave/start: written_reply +65天 |
| town/rose-with-thorns | 这束花不肯只收夸奖 | 花贩莉娅 | note | 独立 | — |
| town/goat-court | 我带来的证人只会吃纸 | 羊倌托比 | letter | 独立 | — |
| town/mothers-reservation | 我的午后不要全替我排好 | 珂娅的母亲 | letter | 独立 | — |
| town/badger-banner | 横幅太长，祝词转了个弯 | 行商苏默 | note | 独立 | — |
| town/tax-apples | 苹果不抵这份账 | 王室税务员莫温 | official | 独立 | — |
| town/hat-of-night | 头盔里没有第二个卫兵 | 巡卫布鲁诺 | note | 独立 | — |
| town/borrowed-shadow | 影子不该收第二份房租 | 烛匠芬恩 | letter | 独立 | — |
| town/royal-empty-box | 空匣子不是第二件礼物 | 王室礼仪处芙嘉 | official | 独立 | — |
| town/old-bell-anger | 我不是因为老了才嫌吵 | 钟匠阿尔诺 | letter | 独立 | — |
| town/not-my-ribbon | 这条红带我不敢认领 | 裁缝米拉 | archive | 独立 | — |
| town/merchant-of-weather | 晴天不是帽子里附送的 | 行商苏默 | letter | 独立 | — |
| town/wedding-no-bell | 我们想成婚，不想叫醒整条街 | 两位准备成婚的镇民 | letter | 独立 | — |
| town/no-free-carry | 我的个子高，不是柜子矮 | 学徒伊沃 | note | 独立 | — |
| town/sour-bean-vote | 酸豆不能用举手变甜 | 商会代表奥斯温 | letter | 独立 | — |
| town/stamp-on-wax | 封蜡上的印不是我按的 | 抄书人苔丝 | archive | 独立 | — |
| town/saint-of-soup | 这锅汤不封圣 | 修士柏恩 | official | 独立 | — |
| town/quiet-cheer | 我做成了，也不想上台 | 木匠玛塔 | letter | 独立 | — |
| town/wrong-sleeper | 这封信不是给打鼾的人 | 驿夫塞缪尔 | note | 独立 | — |
| town/two-puddles | 这两摊水不肯互相抵消 | 清扫人菲恩 | letter | 独立 | — |
| town/letter-to-monday | 收信人写的是下星期 | 书记官露西安 | archive | 独立 | — |
| town/cat-window-wages | 猫不能替我值班 | 图书管理员奥黛 | letter | 独立 | — |
| town/do-not-bless-hat | 帽子淋湿不归修道院批准 | 院长索恩 | official | 独立 | — |
| town/unwanted-family-recipe | 我的汤不需要嫁进谁家 | 厨娘妮娜 | letter | 独立 | — |
| town/farewell-first | 送别的话留给还在这儿的人 | 旧船匠涅尔 | note | 独立 | — |
| town/roof-rain-race | 两家的漏水不必争冠军 | 屋顶修补人苔默 | letter | 独立 | — |
| town/wine-list-empty | 陈年空瓶没有陈年味道 | 客栈老板欧妲 | note | 独立 | — |
| town/blank-birthday | 我不记得，也不想让你猜 | 阿苔 | letter | 独立 | — |
| town/apple-stone-letter | 样石没坏，信先磨薄了 | 磨石匠萨瓦 | letter | 独立 | — |
| town/pretend-invitation | 戏里的请帖不能领真晚饭 | 巡游戏班学徒洛洛 | archive | 独立 | — |
| town/sugar-on-register | 糖粉不是新落款 | 镇厅书记官露西安 | note | 独立 | — |
| town/dry-socks-stop | 我想在路上换一双干袜 | 驿夫塞缪尔 | letter | 独立 | — |
| town/brush-at-door | 泥先住在鞋上就好 | 客栈洗碗人阿满 | note | 独立 | — |
| town/low-stirring-seat | 汤还没好，我的腿先想坐了 | 厨娘妮娜 | letter | 独立 | — |
| town/mill-funnel | 面粉不需要第二顶帽子 | 磨坊主格里特 | note | 独立 | — |
| town/windy-stall-cloth | 风把我的摊布穿走了 | 菜贩萝莎 | letter | 独立 | — |
| town/bean-window | 豆子不按座次发芽 | 学堂教师埃芙 | letter | 独立 | — |
| town/grandma-old-song | 那首歌我还想听一次 | 珂娅的母亲 | letter | 独立 | — |
| town/mat-from-rope | 旧绳还想在门口干点活 | 编席人 | note | 独立 | — |
| town/cart-backrest | 请别坐在我的货架上 | 常来镇上的车夫 | letter | 独立 | — |
| town/bell-two-towns | 两边的钟不能替两边人吵架 | 邻镇书记官赫敏 | official | 独立 | — |
| town/new-snow-shovel | 雪还没来，铲子先老了 | 清扫人菲恩 | letter | 独立 | — |
| town/short-coat-tall-boy | 孩子长高，旧衣没有失职 | 裁缝米拉 | letter | 独立 | — |
| town/empty-pigeon-basket | 鸽子空着篮子也不算失职 | 驿站帮工 | note | 独立 | — |
| town/earring-under-floor | 找耳坠不能先拆别人房间 | 客栈老板欧妲 | letter | 独立 | — |
| town/one-black-glove | 一只手套不算半份礼仪 | 卫兵队长布鲁诺 | note | 独立 | — |
| town/not-a-trophy | 我画的船不想参加第一名 | 孩子栗米 | letter | 独立 | — |
| town/borrowed-corner-light | 借半盏灯，不借一整晚 | 抄书人苔丝 | letter | 独立 | — |
| town/tea-for-one-more | 我多摆了一只杯，又想收起来 | 诺拉婆婆 | letter | 独立 | — |
| town/school-door-mat | 脚印不用一起站好 | 学堂教师埃芙 | note | 独立 | — |
| town/jar-not-public | 这罐蜜不是全镇都点过头 | 养蜂人佩拉 | letter | 独立 | — |
| town/book-spine-rest | 厚书也想平着喘口气 | 图书管理员奥黛 | letter | 独立 | — |
| town/plain-town-paper | 便条不必每天穿金边衣 | 镇厅书记官露西安 | official | 独立 | — |
| town/two-sides-of-bench | 这张凳子不全为怀念坐着 | 寡居居民艾琳 | letter | 独立 | — |
| town/dawn-before-music | 我打哈欠不是给歌伴奏 | 面包房学徒艾达 | note | 独立 | — |
| town/extra-arm-apron | 围裙没有第三只手 | 裁缝米拉 | letter | 独立 | — |
| town/bent-spoon-song | 勺子不能天天替我敲拍 | 乐师维奥 | letter | 独立 | — |
| town/one-more-curtain | 帘后也不该再长一个门房 | 门房帕福 | note | 独立 | — |
| town/long-rope-short-truth | 绳子长，不表示我量过 | 磨坊主格里特 | letter | 独立 | — |
| town/queen-two-chairs | 两把椅子不等于两位女王 | 王室誊送员芙嘉 | official | 独立 | — |
| town/closed-eye-portrait | 他睡着时不曾答应当英雄 | 画师岚珂 | letter | 独立 | — |
| town/stew-without-speech | 开饭前我不想再背一篇话 | 厨娘妮娜 | letter | 独立 | — |
| town/little-door-to-sun | 花想晒太阳，我想开门 | 寡居居民艾琳 | letter | 独立 | — |
| town/market-drum-lunch | 饭碗不认识集合鼓点 | 退伍鼓匠格登 | note | 独立 | — |
| town/wool-not-a-cloud | 一团羊毛还没学会变被子 | 羊倌莓可 | note | 独立 | — |
| town/bread-for-hens | 鸡不能替我评价整炉面包 | 面包师彼得 | letter | 独立 | — |
| town/royal-map-fold | 河不该折在封口里面 | 王室刻版师伦诺 | official | 独立 | — |
| town/borrowed-flute-breath | 借笛子不借他的那口气 | 罗恩的女儿黛禾 | letter | 独立 | — |
| town/father-not-a-post | 这封家信我想自己送到邮袋 | 鞋匠马丁 | letter | 独立 | — |
| town/three-lids-one-pot | 锅没有答应戴三顶帽 | 铁匠达恩 | letter | 独立 | — |
| town/steps-for-slow-friend | 我走慢，不是给阿苔让冠军 | 老彭 | letter | 独立 | — |
| town/no-joke-retelling | 笑过一次不包终身再讲 | 栗子贩薇朵 | note | 独立 | — |
| town/private-repair-royal | 这只花盆不是王室急件 | 女伯爵玛蕾 | official | 独立 | — |
| town/quiet-unfinished-letter | 没写完的那句先留给原主人 | 书记官露西安 | archive | 独立 | — |
| town/school-bell-bird | 鸟叫了，不算老师让放学 | 学堂孩子小素 | note | 独立 | — |
| town/nearest-gate-stall | 这回我也想离镇门近一点 | 商会代表奥斯温 | letter | 独立 | — |
| town/empty-garden-paint | 我想画一小块没有人的园子 | 画师岚珂 | letter | 独立 | — |
| town/plain-wedding-flowers | 她想要的就是这几朵小花 | 花贩莉娅 | letter | 独立 | — |
| town/goose-no-tickets | 鹅看门不卖入场票 | 菜贩萝莎 | note | 独立 | — |
| town/basket-heavy-favor | 他帮我提篮，不必帮我选晚饭 | 诺拉婆婆 | letter | 独立 | — |
| town/shoe-seam-outside | 这道线朝外，是他自己选的 | 鞋匠马丁 | letter | 独立 | — |
| town/bird-on-royal-window | 鸟没有答应站成徽章 | 王室花园管事赫达 | official | 独立 | — |
| town/quiet-letter-father | 这封家信请别先念给父亲听 | 罗恩的女儿黛禾 | letter | 独立 | — |
| town/soap-not-a-prize | 肥皂不是最爱干净的奖章 | 澡屋主人斐拉 | note | 独立 | — |
| town/countess-no-special-ladle | 汤勺只需能舀起我的汤 | 女伯爵玛蕾 | official | 独立 | — |
| town/two-sweet-potatoes | 我们这回各护一只烤薯 | 阿苔与老彭 | note | 独立 | — |
| town/odd-bead-game | 我想先输完这一局 | 学堂孩子栗米 | letter | 独立 | — |
| town/hats-look-tall | 帽子能显高，我可没卖长高 | 行商苏默 | letter | 独立 | — |
| town/small-farewell-stone | 这块告别石不想挡住路 | 石匠乌戈 | letter | 独立 | — |
| town/bed-curtain-light | 我想自己把帘子拉开一半 | 旅客缇玛 | letter | 独立 | — |
| town/private-letter-return | 封上又写了请还给我 | 镇厅收件处 | archive | 独立 | — |
| town/taxman-no-companions | 我点的是面，不是呈报 | 王室税务员莫温 | official | 独立 | — |
| town/abbot-travel-hour | 我今天也想做一位普通来客 | 修道院院长索恩 | letter | 独立 | — |
| town/clerk-lunch-seat | 空椅子请先留给吃饭的人 | 王室誊送员芙嘉 | note | 独立 | — |
| town/guard-dog-owner | 它跟车走，不等于归车队了 | 转运队军官塔琳 | letter | 独立 | — |
| town/dyer-no-flower-smell | 干净不一定要像一整园花 | 洗衣人贝拉 | letter | 独立 | — |
| town/prop-empty-bowls | 台上的宴席先别借真晚饭 | 戏班领班奥斯丁 | letter | 独立 | — |
| town/print-own-leaf | 叶子不用借镇长的印章 | 学堂教师埃芙 | letter | 独立 | — |
| town/poems-for-sale | 没选中的诗也想摆一小会儿 | 写诗的镇民 | letter | 独立 | — |
| town/lamb-picture-board | 他们把羊画得比我本人懂事 | 羊倌托比 | note | 独立 | — |
| town/cup-from-far-town | 一只杯子别把我当来访团 | 磨石匠萨瓦 | letter | 独立 | — |
| town/small-roof-nest | 鸟窝不能替我认哪片瓦坏了 | 屋顶修补人苔默 | letter | 独立 | — |
| town/old-key-no-door | 这把钥匙还没找到自己的门 | 镇厅档案帮工 | archive | 独立 | — |
| town/do-not-count-gifts | 送出去的两粒栗子别算成全摊 | 栗子贩薇朵 | letter | 独立 | — |
| town/goose-feather-quill | 这支笔写不好不全怪鹅 | 抄书人苔丝 | note | 独立 | — |
| town/ordinary-seat-reader | 书廊想添座，不添一排官位 | 王室阅书官希铎 | official | 独立 | — |
| town/grandma-drawing-map | 这条小路我想让它通到云上 | 学堂孩子小素 | letter | 独立 | — |
| echo/granary-after-visit | 看过屋顶的人也会忘带小工具 | 木匠玛塔 | letter | 独立 | granaryrain/start: approve +65天 |
| echo/granary-after-small-room | 地方少那会儿，话也该说实 | 公仓守仓人托文 | letter | 独立 | granaryrain/start: reject +68天 |
| echo/granary-after-unanswered | 雨桶不能代收一车东西 | 驿夫塞缪尔 | letter | 独立 | granaryrain/start: defer +70天 |
| echo/granary-after-instruction | 隔门喊一声不算看见了 | 门房帕福 | letter | 独立 | granaryrain/start: written_reply +72天 |
| echo/loom-after-ten-days | 十日给了我们，不是给一块奖牌 | 绮蔻的母亲 | letter | 独立 | lastloom/start: approve +70天 |
| echo/loom-after-no-delay | 没延日期，也没让谁替我搬走 | 织工绮蔻 | letter | 独立 | lastloom/start: reject +73天 |
| echo/loom-after-wait | 那回没搬走的不是整屋空气 | 木匠玛塔 | letter | 独立 | lastloom/start: defer +75天 |
| echo/loom-after-reply | 这次只看愿意带来的小手艺 | 行会书记 | letter | 独立 | lastloom/start: written_reply +76天 |
| echo/flour-after-talk | 坐在旁边不算多订一份 | 厨娘妮娜 | letter | 独立 | flouroath/start: approve +66天 |
| echo/flour-after-own-visit | 上门说清，不一定就得带饼 | 面包师彼得 | letter | 独立 | flouroath/start: reject +69天 |
| echo/flour-after-unanswered | 停收那炉时，我先以为要关门 | 面包房学徒艾达 | letter | 独立 | flouroath/start: defer +71天 |
| echo/flour-after-instructions | 批示没有替我把面揉好 | 面包房学徒艾达 | letter | 独立 | flouroath/start: written_reply +74天 |
| town/blue-bread-cloth | 蓝布下面还是原来的面包 | 面包师彼得 | letter | 独立 | — |
| town/bowl-bottom-cat | 猫画在碗底，得喝完才看见 | 陶匠黛西 | letter | 独立 | — |
| town/left-foot-dancer | 两只鞋都等着左脚 | 鞋匠马丁 | letter | 独立 | — |
| town/candle-no-whole-wick | 烛头还能亮，不能当整根卖 | 行商苏默 | letter | 独立 | — |
| town/red-dye-apron | 围裙上的红不是今天的颜色 | 染匠斐尔 | letter | 独立 | — |
| town/cheese-wax-window | 亮壳并不说明里面更大 | 行商苏默 | letter | 独立 | — |
| town/silent-bell-price | 铃响不是每一回都降价 | 行商苏默 | letter | 独立 | — |
| town/wood-cup-handle | 杯把像一只伸出来的耳朵 | 木匠学徒伊沃 | letter | 独立 | — |
| town/three-empty-drawers | 空抽屉也不全该塞满 | 书记员赫敏 | letter | 独立 | — |
| town/crooked-brass-weight | 秤砣歪了一点，我先停用 | 商会代表奥斯温 | letter | 独立 | — |
| town/borrowed-smell-box | 空木盒还记得上一束花 | 花贩莉娅 | letter | 独立 | — |
| town/teapot-spout-west | 壶嘴朝哪边，不该靠看太阳 | 陶匠黛西 | letter | 独立 | — |
| town/loud-paper-bag | 纸袋一响，猫就以为开饭 | 造纸人陶恩 | note | 独立 | — |
| town/mended-flag-colors | 补丁不想假装从没补过 | 旗匠艾铎 | letter | 独立 | — |
| town/mismatched-tin-lids | 盖子会响，不说明正好合口 | 行商苏默 | letter | 独立 | — |
| town/window-small-repair | 一小片窗不用换一整面天 | 玻璃匠维珀 | letter | 独立 | — |
| town/pear-tree-ladder | 梯子借去，梨树还在这里 | 邻镇果农蓓姬 | letter | 独立 | — |
| town/turnip-too-late | 大萝卜错过了最想吃它的人 | 菜贩赫伯 | letter | 独立 | — |
| town/pond-reflection-seat | 水里的椅子不用打捞 | 画师岚珂 | letter | 独立 | — |
| town/mole-soft-path | 小土丘不全是花坛的新边 | 园丁艾琳 | letter | 独立 | — |
| town/walnut-under-floor | 地板下面不是一座小粮仓 | 诺拉婆婆 | letter | 独立 | — |
| town/willow-boat-shadow | 柳条扫到船，不是岸在赶人 | 船夫罗恩 | letter | 独立 | — |
| town/snail-flower-pot | 蜗牛走过的路不想拿针指着 | 学堂老师埃芙 | letter | 独立 | — |
| town/wind-dry-sheets | 风把床单吹成了来客名单 | 客栈主人欧妲 | letter | 独立 | — |
| town/seed-label-washed | 牌子洗白了，种子还没有说话 | 园丁艾琳 | letter | 独立 | — |
| town/hollow-log-drum | 空树桩比我的鼓先响 | 退伍鼓匠格登 | letter | 独立 | — |
| town/hens-dust-bath | 鸡把花盆当成了澡盆 | 菜贩萝莎 | letter | 独立 | — |
| town/chestnut-green-shell | 刺壳不是另一袋免费栗子 | 栗子贩薇朵 | letter | 独立 | — |
| town/old-hedge-gap | 篱笆空了一格，不是多开一扇门 | 放牧人莓可 | letter | 独立 | — |
| town/bee-yellow-banner | 黄色小旗招来的客人长着翅膀 | 花贩莉娅 | letter | 独立 | — |
| town/river-stone-pocket | 我捡的石头想先洗给自己看 | 钟匠学徒小蓟 | letter | 独立 | — |
| town/snowless-sled-board | 雪橇今天只想当一块板 | 木匠伊沃 | letter | 独立 | — |
| town/apology-without-cake | 这次道歉不想藏在蛋糕里 | 面包师彼得 | letter | 独立 | — |
| town/sisters-same-ribbon | 同一卷缎带不必分成一样的蝴蝶 | 裁缝米拉 | letter | 独立 | — |
| town/winning-child-speech | 赢了的人今天只想跑出去 | 学堂教师埃芙 | letter | 独立 | — |
| town/mill-extra-chair | 留一把椅子，不等于约了客 | 磨坊主格里特 | letter | 独立 | — |
| town/father-first-dance | 父亲的旧舞步慢了一拍 | 新兵德伊 | letter | 独立 | — |
| town/return-red-scarf | 围巾送错了，我想好好拿回来 | 旅客缇玛 | letter | 独立 | — |
| town/friend-no-seat-saved | 我不想替他一直留最后一排 | 乐师维奥 | letter | 独立 | — |
| town/mother-chest-pattern | 箱底的花样不一定是遗愿 | 织工绮蔻 | letter | 独立 | — |
| town/borrow-name-for-song | 歌里想借一个名字，不借整个人 | 洗碗人阿满 | letter | 独立 | — |
| town/grandson-tall-letter | 他写长高了，不必替我报喜 | 诺拉婆婆 | letter | 独立 | — |
| town/birthday-wrong-day | 我把自己的生日抄错了 | 书记员露西安 | letter | 独立 | — |
| town/quiet-shop-opening | 开门第一天不想敲一整街 | 鞋匠马丁 | letter | 独立 | — |
| town/two-versions-lullaby | 我记得的尾句没有输 | 寡居居民艾琳 | letter | 独立 | — |
| town/helper-hour-end | 帮完这一匹，我要回去织自己的 | 成年织工瑟禾 | letter | 独立 | — |
| town/visitor-wants-to-leave | 她说住得很好，也说今天想走 | 客栈主人欧妲 | letter | 独立 | — |
| town/son-old-coat | 长高以后还想留旧袖子 | 裁缝米拉 | letter | 独立 | — |
| town/royal-cart-straw | 草垫随车来，也该随车走 | 转运队军官塔琳 | official | 独立 | — |
| town/countess-small-umbrella | 大伞下我看不见街了 | 女伯爵玛蕾 | official | 独立 | — |
| town/taxman-ink-sleeve | 袖口印了一排自己的名字 | 税务员莫温 | official | 独立 | — |
| town/map-folded-river | 河折进纸缝里，不是改道了 | 刻版师伦诺 | official | 独立 | — |
| town/abbot-borrowed-saucepan | 锅沿高，不表示它愿当花盆 | 修道院院长索恩 | official | 独立 | — |
| town/guard-hat-doorway | 新帽子先被门楣检阅了 | 卫兵队长布鲁诺 | letter | 独立 | — |
| town/courier-hollow-parcel | 轻箱里装的不是忘装的东西 | 驿夫塞缪尔 | letter | 独立 | — |
| town/public-clock-tune | 整点不想替我唱新曲 | 钟匠阿尔诺 | letter | 独立 | — |
| town/kitchen-window-steam | 窗雾把菜单写得很神秘 | 厨娘妮娜 | letter | 独立 | — |
| town/town-crier-whisper | 小声的消息也想让人听清 | 清扫人菲恩 | letter | 独立 | — |
| town/seal-on-bread-wrapper | 午饭纸不想继续当公函 | 王室书记奎因 | official | 独立 | — |
| town/twin-key-ring | 钥匙挂在一起，门可不在一起 | 镇厅保管员露西安 | archive | 独立 | — |
| town/rented-stage-mirror | 镜里多了一位不收票的演员 | 戏班管事奥斯丁 | letter | 独立 | — |
| town/short-charter-copy | 少抄一页，不能算条文变短了 | 书记员露西安 | archive | 独立 | — |
| town/prize-last-apple | 奖苹果想留给今天的自己 | 学堂孩子栗米 | note | 独立 | — |
| town/repairman-no-story | 我想修完就回家，不再讲险处 | 屋顶修补人苔默 | letter | 独立 | — |
| town/knife-not-for-ribbon | 菜刀不想去剪开幕彩带 | 厨娘妮娜 | letter | 独立 | — |
| town/laundry-wind-note | 风把空衬衣吹得很忙 | 洗衣人贝拉 | note | 独立 | — |
| town/stone-lion-mouth | 石狮张嘴不是想吃请愿书 | 石匠乌戈 | letter | 独立 | — |
| town/borrowed-dry-ink | 借来的墨已经干在笔上了 | 抄书人苔丝 | letter | 独立 | — |
| town/goose-shadow-statue | 鹅的影子长得像镇门官 | 菜贩萝莎 | note | 独立 | — |
| town/old-basket-new-handle | 新提手不用替整只篮子年轻 | 诺拉婆婆 | letter | 独立 | — |
| town/classroom-no-window-name | 窗边的位置不想永久姓谁 | 学堂教师埃芙 | letter | 独立 | — |
| town/cart-wheel-song | 车轮唱得响，我可没请它领唱 | 车夫麦森 | letter | 独立 | — |
| town/pigeon-empty-envelope | 鸽子带走的是空信封 | 驿夫塞缪尔 | note | 独立 | — |
| town/hat-rack-too-polite | 衣帽架替客人站了一整晚 | 客栈主人欧妲 | letter | 独立 | — |
| town/tailor-sample-button | 试扣想留在试布上 | 裁缝米拉 | letter | 独立 | — |
| town/bell-rope-knot | 结打得像花，也得看能不能解 | 钟匠学徒小蓟 | letter | 独立 | — |
| town/sweet-song-wrong-seller | 唱得像蜜，也还是在卖栗子 | 栗子贩薇朵 | letter | 独立 | — |
| town/book-return-leaf | 夹在书里的叶子不是新章节 | 书馆照管人奥黛 | letter | 独立 | — |
| town/small-mirror-wedding | 婚礼借的小镜不想留下当纪念 | 旗匠艾铎 | letter | 独立 | — |
| town/own-map-shortcut | 我的近路绕过了别人想看的地方 | 居民珂娅 | letter | 独立 | — |
| town/merchant-best-corner | 最显眼的一角，我也想先用 | 商会代表奥斯温 | letter | 独立 | — |
| town/countess-dog-cushion | 它偏看中了礼宾红垫 | 女伯爵玛蕾 | official | 独立 | — |
| town/abbot-extra-quiet | 我想歇一晚，巷子却还在过日子 | 修道院院长索恩 | official | 独立 | — |
| town/painter-own-exhibition | 我想多挂两幅，不只是方便大家 | 画师岚珂 | letter | 独立 | — |
| town/school-prize-big-name | 奖品上我想把名字写很大 | 学堂孩子栗米 | letter | 独立 | — |
| town/ferry-wave-no-passenger | 我挥手是告别，不是催你上船 | 渡船人罗恩 | letter | 独立 | — |
| town/bread-smell-fee | 我竟想给香味收一回钱 | 面包师彼得 | letter | 独立 | — |
| town/garden-chair-facing-away | 长椅想先朝着花，不朝着我 | 寡居居民艾琳 | letter | 独立 | — |
| town/stone-carver-own-error | 我刻错的一横想自己磨掉 | 石匠乌戈 | letter | 独立 | — |
| town/royal-empty-gift-box | 礼盒太大，礼物一直在里面找路 | 管家雷纳 | official | 独立 | — |
| town/clerk-wrong-tea-invite | 请喝茶的信写得像要人赴差 | 书记员芙嘉 | letter | 独立 | — |
| town/warm-bench-stone | 暖石头不想被当成新长凳 | 清扫人菲恩 | note | 独立 | — |
| town/friend-cake-last-slice | 最后一块饼，我想留着明天吃 | 诺拉婆婆 | letter | 独立 | — |
| town/miller-dust-portrait | 面粉像白胡子，我还不想坐像 | 磨坊主格里特 | letter | 独立 | — |
| town/sleeping-cat-royal-name | 猫睡着时听不见新封的名字 | 花园管事赫达 | official | 独立 | — |
| town/drummer-tiny-job | 小活也想按小活付钱 | 退伍鼓匠格登 | letter | 独立 | — |
| town/poem-empty-line | 空着一行，不是忘给的纸钱 | 写诗的镇民 | letter | 独立 | — |
| town/room-snore-question | 两位都说自己睡着时很安静 | 客栈主人欧妲 | letter | 独立 | — |
| town/chairs-no-staircase | 椅子叠得高，也没变成楼梯 | 木匠学徒伊沃 | letter | 独立 | — |
| town/flower-shade-stall | 树影跑到哪儿，我就想把摊搬哪儿 | 花贩莉娅 | letter | 独立 | — |
| town/two-teachers-one-map | 两位老师都想把地图翻过来 | 学堂教师埃芙 | letter | 独立 | — |
| town/rain-festival-title | 庆典叫晴日会，天却没读过帖 | 王室书记奎因 | official | 独立 | — |
| town/watch-whistle-private-test | 试哨那声，不想让整巷先跑来 | 卫兵队长布鲁诺 | letter | 独立 | — |
| town/untraveled-travel-note | 路还没走，我先写到了海边 | 旅客缇玛 | letter | 独立 | — |
| town/clay-cup-small-scratch | 小划痕不想被说成古老传说 | 陶匠黛西 | letter | 独立 | — |
| town/courtyard-no-honors | 小院不用天天等一次表扬 | 养花的艾琳 | note | 独立 | — |
| town/soldier-private-portrait | 盔甲画得亮，我的脸却没进去 | 新兵德伊 | letter | 独立 | — |
| town/small-hammer-no-title | 小锤子不想被封作镇宝 | 铁匠达恩 | letter | 独立 | — |
| town/audience-knows-ending | 他连坏人藏哪儿都先喊给我了 | 戏班学徒洛洛 | letter | 独立 | — |
| town/clapping-during-flute | 拍手一响，我把下一口气吹丢了 | 笛手弦芽 | note | 独立 | — |
| town/blank-town-feast-order | 这次宴会先别准备，上一封发早了 | 王室宴务处 | official | 独立 | — |
| town/wrong-border-crate | 请别再把空箱寄回来了 | 邻镇转运署 | official | 独立 | — |
| town/crooked-soup-name | 汤的名字先写饿了 | 厨娘妮娜 | note | 独立 | — |
| town/tired-letter-mother | 那句话我今天不想再解释一遍 | 未署名的住户 | letter | 独立 | — |
| town/father-old-oars | 旧桨不在水里，还想留一道划痕 | 旧船匠涅尔 | letter | 独立 | — |
| town/quiet-guest-shoes | 楼上声音大，鞋却是我的 | 客栈主人欧妲 | note | 独立 | — |
| town/market-weathervane-bow | 纸上那只鸡指着西边 | 商会收件处 | archive | 独立 | — |
| town/last-day-fair-seat | 收摊前，我想去坐一次别人的摊 | 栗子贩薇朵 | letter | 独立 | — |
| town/royal-visit-no-line | 这回只看旧件，不看大家站得齐不齐 | 巡察处书记奎因 | official | 独立 | — |
| town/mended-doll-eye | 布偶想留一只不太圆的眼睛 | 裁缝米拉 | letter | 独立 | — |
| town/wrong-flour-message | 那张急条是面团，不是军团 | 面包师彼得 | note | 独立 | — |
| town/missing-half-wedding-list | 只剩半张的不是半场婚礼 | 驿站退件夹 | archive | 独立 | — |
| town/self-portrait-not-town | 这张满脸疲倦，是我自己画的我 | 画师岚珂 | letter | 独立 | — |
| town/one-rake-two-gardens | 一把耙子先答应了两块地 | 邻镇果农蓓姬 | letter | 独立 | — |
| town/riddle-paper-back | 我的谜底先跑到大家背后去了 | 学堂孩子栗米 | note | 独立 | — |
| town/taxman-one-bean | 口袋清点完，只有一粒豆 | 税务员莫温 | letter | 独立 | — |
| town/letter-no-sudden-return | 请先问他愿不愿见我 | 未署名的来信人 | letter | 独立 | — |
| town/hero-door-hinge | 那扇门修好，是因为换了合用的铰 | 木匠学徒伊沃 | letter | 独立 | — |
| town/kingdom-cold-greeting | 新问候语还没定，请先别背了 | 王室礼仪处 | official | 独立 | — |
| town/two-lids-joint-record | 我们各认得自己没借出的那一只 | 陶匠黛西与杂货摊苏默 | archive | 独立 | — |
| town/doctor-lost-chalk | 小石笔躲进了薄荷里 | 药草师伊莎 | note | 独立 | — |
| town/night-mail-no-song | 送夜信时，我想少唱半支路歌 | 驿夫塞缪尔 | letter | 独立 | — |
| town/snow-in-stage-bag | 袋里的雪下不到明年去了 | 戏班管事奥斯丁 | letter | 独立 | — |
| town/returned-unsigned-order | 写着照办，后面一片空白 | 镇厅未明来件夹 | archive | 独立 | — |
| town/drum-case-personal-message | 鼓箱里的信想自己轻一点 | 退伍鼓匠格登 | letter | 独立 | — |
| town/thanks-from-years-ago | 他连簿子掉过的一角都还记着 | 书记员露西安 | archive | 独立 | — |
| town/garden-gate-two-knocks | 两声敲门，未必都要我去送水 | 居民珂娅 | letter | 独立 | — |
| town/royal-small-chair-letter | 我来坐一坐，不是来试你们的椅阵 | 转运队军官塔琳 | official | 独立 | — |
| town/neighbor-wharf-change | 钉子都备好了，两边的时辰还没合上 | 邻镇渡口联络处 | official | 独立 | — |
| town/merchant-no-good-luck-fee | 卖过一枚好运扣，我自己先输了棋 | 行商苏默 | letter | 独立 | — |
| echo/lamp-after-look | 来看灯的人把晚饭问得很清楚 | 厨娘妮娜 | letter | 独立 | lampwindow/start: approve +75天 |
| echo/lamp-after-curtain | 她量窗时先给我看了一小束光 | 裁缝米拉 | letter | 独立 | lampwindow/start: reject +77天 |
| echo/lamp-after-wait | 没回的灯信走得比巡夜人还快 | 镇门看门人帕福 | letter | 独立 | lampwindow/start: defer +79天 |
| echo/lamp-after-directions | 那块小样板想留一面没画线的 | 木匠玛塔 | letter | 独立 | lampwindow/start: written_reply +81天 |
| echo/tea-after-table | 她收杯子的样子我认得 | 花贩莉娅 | letter | 独立 | teanewcomer/start: approve +65天 |
| echo/tea-after-no-table | 杯子画得比茶名还大 | 造纸人陶恩 | letter | 独立 | teanewcomer/start: reject +67天 |
| echo/tea-after-unanswered | 我替她说得太快了 | 居民珂娅 | letter | 独立 | teanewcomer/start: defer +69天 |
| echo/tea-after-instruction | 这块布她摸了两回 | 洗衣人贝拉 | letter | 独立 | teanewcomer/start: written_reply +71天 |
| echo/candle-after-trial | 她把两条没走齐的线都画给我了 | 钟匠阿尔诺 | letter | 独立 | candlemarks/start: approve +70天 |
| echo/candle-after-no-room | 她擦掉的小钟留下一个淡圆圈 | 抄书人苔丝 | letter | 独立 | candlemarks/start: reject +72天 |
| echo/candle-after-waiting | 等女儿的那碗汤不用跟着烛线跑 | 厨娘妮娜 | letter | 独立 | candlemarks/start: defer +74天 |
| echo/candle-after-reply | 我只想让她画两条自己喜欢的线 | 新住户蘅岚 | letter | 独立 | candlemarks/start: written_reply +76天 |
| town/cat-on-pay-paper | 这只爪印不在领款人里面 | 王室税务员莫温 | official | 独立 | — |
| town/abbot-brother-letter | 这封说我爬树的信，不必入院史 | 修道院院长索恩 | letter | 独立 | — |
| town/ribbon-not-summons | 蓝带只是捆地图，不是传人来 | 王室巡察处书记奎因 | official | 独立 | — |
| town/no-toast-needed | 来谈事的人不一定会把杯子喝空 | 邻镇书记官赫敏 | official | 独立 | — |
| town/guestbook-praise | 来访簿上的那句赞美，可否空着 | 领主府管家雷纳 | official | 独立 | — |
| town/guard-portrait-sitting | 画到胡子时，我已经站不稳了 | 卫兵队长布鲁诺 | letter | 独立 | — |
| town/practice-letter-return | 这封练习信别寄到外婆那儿 | 孩子栗米 | note | 独立 | — |
| town/old-peng-shoe-gift | 新鞋先给我走，别先给客人看 | 老彭 | letter | 独立 | — |
| town/dog-not-night-watch | 我的狗叫两声，不算接了夜班 | 东巷住户阿苔 | letter | 独立 | — |
| town/borrowed-weeping | 院里那阵哭声，是她在练戏 | 诺拉婆婆 | letter | 独立 | — |
| town/wool-socks-own-price | 这捆旧款袜子，我想按实卖 | 行商苏默 | letter | 独立 | — |
| town/countess-nap-music | 午睡时不必替我盖过鼾声 | 伯爵夫人玛蕾 | letter | 独立 | — |
| town/bed-head-name | 床头那两个字，刻大了 | 木匠玛塔 | letter | 独立 | — |
| town/squeaking-shoe-display | 会叫的鞋，别替客人先挑了 | 鞋匠马丁 | note | 独立 | — |
| town/unfinished-weave-edge | 那截没织满的，不是漏工 | 织工绮蔻 | letter | 独立 | — |
| town/green-dyer-hands | 我的手绿了，不等于红布也绿了 | 染匠斐尔 | letter | 独立 | — |
| town/hammer-as-sign | 那柄大锤还是留地上吧 | 铁匠达恩 | letter | 独立 | — |
| town/glass-packaging-music | 那声响不是我随货送的小铃 | 玻璃匠维珀 | letter | 独立 | — |
| town/honey-jar-last-drop | 瓶底那一点，我没想拿来算人情 | 蜂农岚泽 | letter | 独立 | — |
| town/rope-wish-knot | 结打成了，不替人把愿望打成 | 制绳人延栖 | letter | 独立 | — |
| town/umbrella-mended-map | 补丁像一座岛，也还是补丁 | 制伞人檐朵 | letter | 独立 | — |
| town/baker-bread-handle | 面包上那个环，不是提手 | 面包师彼得 | note | 独立 | — |
| town/two-sided-apron-name | 围裙翻过来，名字就去了背后 | 裁缝米拉 | letter | 独立 | — |
| town/wicker-basket-voice | 有一只筐，我想不拿去评了 | 编席人 | letter | 独立 | — |
| town/merchant-unloading-corner | 这块角地离我的仓门最近 | 商会代表奥斯温 | letter | 独立 | — |
| town/countess-over-old-picture | 我的画像想挂在最亮那一块 | 伯爵夫人玛蕾 | letter | 独立 | — |
| town/apprentice-own-tips | 那枚铜片不是我替全班收的 | 巡游戏班学徒洛洛 | letter | 独立 | — |
| town/dishwasher-one-song | 我答应唱一首，不是答应唱到收碗 | 客栈洗碗人阿满 | letter | 独立 | — |
| town/miller-nephew-first-stone | 最好的那块，我想先给侄子留 | 磨坊主格里特 | letter | 独立 | — |
| town/tea-accent-invitation | 我愿讲茶，不愿每次先学自己说话 | 新住户蘅岚 | letter | 独立 | — |
| town/old-boatman-not-hero | 我的小船故事没有救过一整镇 | 旧船匠涅尔 | letter | 独立 | — |
| town/daughter-handwriting-contest | 我写她的名，她却不想比 | 王室巡察处书记奎因 | letter | 独立 | — |
| town/two-neighbors-no-reunion-show | 我们借同一辆车，不是在演和好 | 阿苔与老彭 | letter | 独立 | — |
| town/ferryman-private-wait | 我想等一个人，但不想让乘客陪等 | 渡船人罗恩 | letter | 独立 | — |
| town/keeper-no-home-tour | 看灯可以，别顺便看我的卧房 | 守灯人黛芬 | letter | 独立 | — |
| town/rainer-unpaid-poem-copy | 抄得好看，也不能每晚顺手多抄 | 领主府管家雷纳 | note | 独立 | — |
| town/hollow-tree-whistle | 风吹空树，不是有人偷练笛 | 林边看木人 | letter | 独立 | — |
| town/moon-drying-cloth | 月亮照得好看，可被单还是湿的 | 栗子贩薇朵 | letter | 独立 | — |
| town/frog-counting-board | 蛙叫一声，孩子要一起报三声 | 井边住户珂娅 | note | 独立 | — |
| town/bee-at-painted-flower | 窗上那朵花，只是我画的 | 养蜂人佩拉 | letter | 独立 | — |
| town/scarecrow-guest-hat | 稻草人穿得太像收门钱的人了 | 农夫赫伯 | letter | 独立 | — |
| town/shadow-lesson-time | 昨天的影子不能量今天的树 | 学堂教师埃芙 | letter | 独立 | — |
| town/frost-window-copy | 我想抄一页不打算寄给谁的东西 | 抄书人苔丝 | letter | 独立 | — |
| town/snail-letter-race | 慢的那只也没输给我 | 孩子栗米 | letter | 独立 | — |
| town/bird-foot-flour | 鸟走过面粉，不是给新饼盖章 | 面包学徒琳朵 | note | 独立 | — |
| town/garden-stone-ear | 那块像耳朵的石头，没听见秘密 | 邻镇果农蓓姬 | letter | 独立 | — |
| town/rainbarrel-sky | 桶里一片天，不是多了一口井 | 客栈老板欧妲 | letter | 独立 | — |
| town/winter-leaf-message | 那天我想去看叶子落下来 | 守灯人黛芬 | letter | 独立 | — |
| town/monk-recommendation-scope | 我只和他一同搬过两次柴 | 修士安瑟 | letter | 独立 | — |
| town/library-borrow-index | 这位读者只想先看目录 | 图书管理员奥黛 | letter | 独立 | — |
| town/musician-retire-old-song | 那首成名曲，今晚我不想再唱 | 乐师维奥 | letter | 独立 | — |
| town/teacher-own-misspelling | 那一笔是我漏的，不是孩子捣乱 | 学堂教师埃芙 | note | 独立 | — |
| town/copyist-quote-not-free-copy | 问价的那一页，不是已经接下整本 | 抄书人苔丝 | letter | 独立 | — |
| town/postman-wait-at-gate | 门上的等我，得等到哪一顿 | 驿夫塞缪尔 | letter | 独立 | — |
| town/potter-mended-bowl-exhibit | 这只补碗，物主还想拿回去喝汤 | 陶匠莱恩 | letter | 独立 | — |
| town/royal-servant-lunch-turn | 饭端来时，能先让轮休的人吃吗 | 王室随行侍从 | official | 独立 | — |
| town/visitor-feet-wet | 我想先换鞋，再行您那套礼 | 邻镇来访工匠 | letter | 独立 | — |
| town/unsigned-story-name | 那位好像是我，不等于就是我 | 匿名故事来稿 | archive | 独立 | — |
| town/old-woman-empty-day | 今天没有安排，也算我想好的安排 | 诺拉婆婆 | letter | 独立 | — |
| town/fair-stall-shut-early | 最后一篮，我想留给自家吃 | 菜贩萝莎 | letter | 独立 | — |
| echo/honey-table-open | 尝过一小口，还能各喜欢各的 | 厨娘妮娜 | letter | 独立 | honeycontest/start: approve +90天 |
| echo/honey-table-closed | 没上试味桌，不等于没有这罐蜜 | 行商苏默 | letter | 独立 | honeycontest/start: reject +92天 |
| echo/honey-table-wait | 空着的奖名栏，先让它空着 | 抄书人苔丝 | letter | 独立 | honeycontest/start: defer +94天 |
| echo/honey-table-letter | 甜蜜旁边，也想放一口淡茶 | 新住户蘅岚 | letter | 独立 | honeycontest/start: written_reply +96天 |
| echo/chess-two-day-loan | 木马借过给老彭，不是归他养的 | 学堂教师埃芙 | letter | 独立 | oldchess/start: approve +95天 |
| echo/chess-paper-horse | 纸马画得像，也可以从棋盘上拿走 | 孩子栗米 | letter | 独立 | oldchess/start: reject +97天 |
| echo/chess-waiting-hands | 没回借棋的信，不是判他那边输 | 东巷住户阿苔 | letter | 独立 | oldchess/start: defer +99天 |
| echo/chess-rule-letter | 同一本棋书，可以先翻不同的页 | 图书管理员奥黛 | letter | 独立 | oldchess/start: written_reply +101天 |
| echo/apprentice-main-bake | 这双手做过，不必藏在师傅背后 | 镇厅收餐帮工 | letter | 独立 | breadapprentice/start: approve +100天 |
| echo/apprentice-original-order | 不改那一批，也不是不许她学 | 行会织工绮蔻 | letter | 独立 | breadapprentice/start: reject +102天 |
| echo/apprentice-no-answer | 没有新分工，我原来做过的也还在 | 面包铺成年学徒琳朵 | letter | 独立 | breadapprentice/start: defer +104天 |
| echo/apprentice-specific-reply | 她教我折纸包时，也没先问我会不会 | 面包师彼得 | letter | 独立 | breadapprentice/start: written_reply +106天 |
| eleventh/book-damp-corner | 这页地图只湿了一个角 | 图书管理员奥黛 | letter | 独立 | — |
| eleventh/market-pea-measure | 豌豆没有长到量勺上 | 菜商赫伯 | note | 独立 | — |
| eleventh/school-quiet-bell | 下课钟早响了半盏茶 | 学堂教师埃芙 | letter | 独立 | — |
| eleventh/bakery-flour-sneeze | 面粉袋上多了一朵白云 | 面包师彼得 | letter | 独立 | — |
| eleventh/cobbler-boot-tap | 左靴比右靴先到门口 | 鞋匠斐洛 | letter | 独立 | — |
| eleventh/lamplighter-wick | 灯芯剪下来的小黑卷 | 守灯人黛芬 | letter | 独立 | — |
| eleventh/post-rain-letter | 这封信被雨点改了一个字 | 驿夫塞缪尔 | letter | 独立 | — |
| eleventh/tailor-button-jar | 三只蓝扣不是一套 | 裁缝米拉 | note | 独立 | — |
| eleventh/miller-sack-mark | 两袋麦子都写了“最后一袋” | 磨坊主格里特 | letter | 独立 | — |
| eleventh/inn-room-number | 七号房其实是窗边那间 | 客栈老板娘欧妲 | letter | 独立 | — |
| eleventh/garden-seed-packet | 种子袋上写着去年 | 园丁艾琳 | note | 独立 | — |
| eleventh/smith-tongs-rest | 钳子今天需要坐一会儿 | 铁匠达恩 | letter | 独立 | — |
| eleventh/bridge-ribbon | 桥栏上的红布条不是告示 | 桥边住户阿苔 | letter | 独立 | — |
| eleventh/candle-drip-table | 烛泪落在桌布不是蜡封 | 制烛人柚宁 | letter | 独立 | — |
| eleventh/fisher-basket-shadow | 水里那张网不是漏网的鱼 | 河边摆渡人鲁姆 | note | 独立 | — |
| eleventh/porridge-pot-size | 一锅粥够三个人还是四个 | 厨房帮手琵娅 | letter | 独立 | — |
| eleventh/court-drum-skin | 巡夜鼓今天先别敲 | 巡夜队长温斯 | official | 独立 | — |
| eleventh/queen-map-fold | 地图要不要把羊圈也画进去 | 王室绘图员罗莎 | official | 独立 | — |
| eleventh/guild-napkin-contract | 餐巾背面的约定太容易洗掉 | 行商苏默 | letter | 独立 | — |
| eleventh/shepherd-lost-sheepbell | 羊回来了，铃还在山上 | 牧羊人波恩 | letter | 独立 | — |
| eleventh/painter-window-dry | 窗外的云画得比窗里干 | 画匠莱娜 | letter | 独立 | — |
| eleventh/mason-stair-count | 台阶数对了，木尺少一格 | 石匠阿诺 | note | 独立 | — |
| eleventh/widow-warm-bread | 炉火灭了，面包还温着 | 居民诺薇 | letter | 独立 | — |
| eleventh/stable-brush-return | 刷马的刷子扎到了自己 | 马厩管事尤拉 | note | 独立 | — |
| eleventh/herald-wrong-title | 这封信把我叫成了城主 | 邻镇传令员狄恩 | official | 独立 | — |
| eleventh/weaver-thread-sample | 这团线只够织一只袖口 | 织工瑟禾 | letter | 独立 | — |
| eleventh/herbalist-pestle | 石杵找到了，药粉不见了 | 草药师梅朵 | letter | 独立 | — |
| eleventh/baker-doorstep-crumbs | 门阶上没有一只偷面包的鸟 | 面包学徒琳朵 | note | 独立 | — |
| eleventh/bellmaker-soft-clapper | 钟声像吞了一颗糖 | 钟匠阿尔诺 | letter | 独立 | — |
| eleventh/tailor-patch-stitch | 补丁比洞多了一圈 | 裁缝米拉 | letter | 独立 | — |
| eleventh/orchard-crate-label | 筐上写苹果，里面是梨 | 果农阿芙 | note | 独立 | — |
| eleventh/scribe-ink-blot | 印泥里落了一粒面包屑 | 抄书人苔丝 | official | 独立 | — |
| eleventh/cobbler-lace-tangle | 鞋带结没有打在同一边 | 鞋匠斐洛 | note | 独立 | — |
| eleventh/herald-horse-water | 王室马喝了两桶水 | 王室传令员瑟恩 | official | 独立 | — |
| eleventh/school-chalk-crumbs | 黑板边掉下一粒蓝粉 | 学堂教师埃芙 | letter | 独立 | — |
| eleventh/market-hen-shadow | 篷布下面多了个鸡窝 | 菜贩萝莎 | letter | 独立 | — |
| eleventh/inn-key-tag | 钥匙牌的数字掉了 | 客栈老板娘欧妲 | letter | 独立 | — |
| eleventh/weaver-dye-pot | 蓝布晾干后变成了灰 | 染匠斐尔 | letter | 独立 | — |
| eleventh/garden-bucket-rim | 桶沿上留下了半圈月亮 | 居民阿满 | letter | 独立 | — |
| eleventh/scribe-returned-envelope | 退回来的信封里没有信 | 抄书人苔丝 | archive | 独立 | — |
| eleventh/smith-lantern-hook | 灯钩比灯更亮 | 铁匠达恩 | note | 独立 | — |
| eleventh/shepherd-sheep-name | 小羊叫错了名字 | 牧羊人波恩 | letter | 独立 | — |
| eleventh/royal-tablecloth | 长桌布短了一掌 | 王室宴席侍者露珊 | official | 独立 | — |
| eleventh/ferryman-coin-pouch | 船票钱多了一枚铜子 | 摆渡人鲁姆 | letter | 独立 | — |
| eleventh/glassworker-sun-chip | 窗上的光斑不是裂纹 | 玻璃匠维珀 | letter | 独立 | — |
| eleventh/inn-guest-supper | 我想吃热饭，不想再加床 | 客栈旅客缇玛 | letter | 独立 | — |
| eleventh/school-slate-crack | 石板裂了，字还写得进去 | 孩子栗米 | letter | 独立 | — |
| eleventh/market-hat-brim | 帽檐挡住了菜价 | 菜贩萝莎 | note | 独立 | — |
| eleventh/council-hall-chairs | 椅子排齐后少了一把 | 客栈女主人欧妲 | letter | 独立 | — |
| eleventh/soup-ladle-handle | 木勺柄的影子像一条鱼 | 食堂厨娘妮娜 | letter | 独立 | — |
| eleventh/tailor-parade-sleeve | 游行袖口不是旗面 | 裁缝米拉 | letter | 独立 | — |
| eleventh/miller-rain-wheel | 雨水流走了，轮子没转 | 磨坊主格里特 | note | 独立 | — |
| eleventh/school-ink-stain | 红墨水把值日表变成了花 | 学堂教师埃芙 | letter | 独立 | — |
| eleventh/garden-bee-box-lid | 蜂箱盖上落了朵花 | 蜂农岚泽 | letter | 独立 | — |
| eleventh/postbag-wrong-bundle | 两捆信都绑着同一根红线 | 驿夫塞缪尔 | archive | 独立 | — |
| eleventh/forge-bellows-rope | 风箱绳子磨得发白 | 铁匠达恩 | letter | 独立 | — |
| eleventh/inn-window-latch | 窗闩扣上后还是晃 | 客栈老板娘欧妲 | letter | 独立 | — |
| eleventh/ledger-duplicate-mark | 账簿里有两道一样的勾 | 书记官露西安 | official | 独立 | — |
| eleventh/river-child-boat | 纸船漂到桥下就不算我的了 | 孩子栗米 | letter | 独立 | — |
| eleventh/laundry-rope-shadow | 这张床单得有两个人收 | 洗衣人贝拉 | note | 独立 | — |
| eleventh/mason-stone-cart | 车轮上的石子自己不会下来 | 石匠阿诺 | letter | 独立 | — |
| eleventh/royal-seal-wax | 封蜡印纹缺了一瓣 | 王室文书官米珂 | official | 独立 | — |
| eleventh/market-umbrella-drip | 雨伞滴水刚好滴进空篮 | 行商苏默 | letter | 独立 | — |
| eleventh/healer-pillow-fluff | 枕头里的羽毛跑出来了 | 草药师梅朵 | letter | 独立 | — |
| eleventh/parade-banner-fold | 旗子折起来时还是朝外 | 庆典管事乌娜 | letter | 独立 | — |
| eleventh/grain-scale-weight | 秤砣落在地上没碎 | 磨坊主格里特 | letter | 独立 | — |
| eleventh/weaver-dog-hair | 围巾边上织进一根狗毛 | 织工瑟禾 | note | 独立 | — |
| eleventh/royal-horse-brush | 御马刷借去梳了自己的马 | 王室马夫洛安 | official | 独立 | — |
| eleventh/laundry-window-light | 窗台上晾的手帕挡了一束光 | 洗衣人贝拉 | letter | 独立 | — |
| eleventh/bridge-plank-squeak | 桥板响了一声又安静了 | 桥边守桥人托恩 | letter | 独立 | — |
| eleventh/soup-bowl-rim | 碗边有一道蓝线 | 食堂厨娘妮娜 | letter | 独立 | — |
| eleventh/town-crier-voice | 我喊到第三遍才听见自己 | 报信人法恩 | note | 独立 | — |
| eleventh/cobbler-old-last | 旧鞋楦比新脚大半寸 | 鞋匠斐洛 | letter | 独立 | — |
| eleventh/scribe-dry-ink | 墨水干得像一片小田 | 抄书人苔丝 | official | 独立 | — |
| eleventh/orchard-branch-ladder | 梯子靠着树就像一扇门 | 果农阿芙 | letter | 独立 | — |
| eleventh/stable-horseshoe-line | 两只马蹄铁排成了一支小船 | 马厩管事尤拉 | letter | 独立 | — |
| eleventh/royal-ribbon-return | 迎宾绸带忘了收回盒里 | 王室侍从贝洛 | official | 独立 | — |
| eleventh/basket-maker-handle | 篮子提手不该替手掌决定 | 织工绮蔻 | letter | 独立 | — |
| eleventh/river-map-stain | 旧地图上的蓝斑是河还是墨 | 摆渡人鲁姆 | archive | 独立 | — |
| eleventh/library-window-seat | 窗边那把椅子太高了 | 孩子栗米 | letter | 独立 | — |

## 可疑重复句（需作者判断）
