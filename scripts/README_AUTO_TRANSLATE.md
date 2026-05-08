# 城市翻译脚本配置指南

## 1. 安装依赖

```bash
npm install @supabase/supabase-js
```

## 2. 配置脚本

编辑 `scripts/autoTranslateCities.js` 文件顶部的配置区域：

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';  // 替换为你的项目URL
const SUPABASE_ANON_KEY = 'your-anon-key';  // 替换为你的 anon key
const DEEPSEEK_API_KEY = 'sk-d2b755410b11417490aa2f90ec678ce6';  // DeepSeek API Key
```

## 3. 运行脚本

```bash
node scripts/autoTranslateCities.js
```

## 4. 功能说明

- 自动获取所有城市数据
- 检查每个城市的所有字段是否缺少翻译
- 跳过已翻译完成的字段
- 每翻译完一个城市自动保存
- 支持 9 种语言：英语、日语、韩语、俄语、法语、西班牙语、德语、繁体中文、意大利语

## 5. 翻译的字段

| 分类 | 字段 |
|------|------|
| 基础信息 | enName (英文名) |
| 标签 | tags[].text |
| 简介 | paragraphs[] |
| 城市信息 | info.area, info.population |
| 最佳旅行时间 | bestTravelTime.strongText, bestTravelTime.paragraphs[] |
| 景点 | attractions[].name, desc, price, season, time |
| 历史 | history[].title, desc |
| 世界遗产 | worldHeritage[].name, desc |
| 非遗传承 | intangibleHeritage[].name, desc |
| 交通 | transportation[].title, desc, price |
| 美食 | food[].name, desc |

## 6. 注意事项

- 脚本内置 500ms 延迟，避免 API 限流
- 每处理完一个城市会暂停 1 秒
- 建议在网络稳定的环境下运行
- 运行过程中可随时 Ctrl+C 停止
