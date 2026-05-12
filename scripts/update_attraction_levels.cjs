/**
 * 批量更新景点A级等级数据
 * 
 * 使用方法: 
 *   node scripts/update_attraction_levels.cjs          # 预览模式（不执行）
 *   node scripts/update_attraction_levels.cjs --apply   # 执行更新
 *   node scripts/update_attraction_levels.cjs --force    # 强制覆盖已有等级
 * 
 * 功能：
 * 1. 从Supabase读取所有城市的景点数据
 * 2. 根据景点名称匹配A级等级（5A/4A/3A）
 * 3. 生成SQL更新语句
 * 4. --apply 时执行更新到数据库
 * 
 * 等级映射表 LEVEL_MAP 维护在脚本中，可根据需要增删
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Supabase 配置
const SUPABASE_URL = 'https://cxegaqhwexiidezycbyg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NDIyMjUsImV4cCI6MjA5MzUxODIyNX0.7Tp0V5WoTfWOIhbHOH-SKoTH7VRJeGDQDcQXIaJuz6g';

// ============================================================
// 全国知名景点A级等级映射表
// 格式: [景点名关键词, 等级]
// 匹配规则: 景点名包含关键词即匹配（模糊匹配），优先匹配更长的关键词
// 数据来源: 文化和旅游部公布的A级景区名单
// 维护说明: 新增景区时在对应城市区域添加条目即可
// ============================================================
const LEVEL_MAP = [
  // ===== 5A景区 =====
  // 北京
  ['故宫', '5A'], ['八达岭', '5A'], ['颐和园', '5A'], ['天坛', '5A'], ['天安门', '5A'],
  ['恭王府', '5A'], ['慕田峪', '5A'], ['奥林匹克公园', '5A'], ['圆明园', '5A'],
  // 上海
  ['东方明珠', '5A'], ['外滩', '5A'], ['迪士尼', '5A'], ['野生动物园', '5A'],
  ['科技馆', '5A'], ['中共一大', '5A'],
  // 重庆
  ['武隆天生三桥', '5A'], ['武隆', '5A'], ['大足石刻', '5A'], ['巫山小三峡', '5A'],
  ['酉阳桃花源', '5A'], ['金佛山', '5A'], ['云阳龙缸', '5A'], ['黑山谷', '5A'],
  // 杭州
  ['西湖', '5A'], ['灵隐寺', '5A'], ['千岛湖', '5A'], ['西溪湿地', '5A'],
  ['良渚', '5A'],
  // 南京
  ['中山陵', '5A'], ['夫子庙', '5A'], ['明孝陵', '5A'], ['总统府', '5A'],
  ['牛首山', '5A'], ['雨花台', '5A'],
  // 苏州
  ['拙政园', '5A'], ['虎丘', '5A'], ['留园', '5A'], ['周庄', '5A'],
  ['金鸡湖', '5A'], ['同里', '5A'], ['沙家浜', '5A'], ['苏州博物馆', '5A'],
  // 成都
  ['大熊猫繁育研究基地', '5A'], ['都江堰', '5A'], ['青城山', '5A'],
  ['峨眉山', '5A'], ['乐山大佛', '5A'], ['九寨沟', '5A'], ['黄龙', '5A'],
  ['武侯祠', '5A'], ['杜甫草堂', '5A'], ['阆中古城', '5A'],
  // 西安
  ['兵马俑', '5A'], ['秦始皇', '5A'], ['华清宫', '5A'], ['大雁塔', '5A'],
  ['大唐芙蓉园', '5A'], ['华山', '5A'], ['法门寺', '5A'], ['黄帝陵', '5A'],
  // 三亚
  ['蜈支洲岛', '5A'], ['南山文化', '5A'], ['大小洞天', '5A'], ['呀诺达', '5A'],
  ['亚龙湾热带天堂', '5A'],
  // 桂林
  ['漓江', '5A'], ['象鼻山', '5A'], ['两江四湖', '5A'], ['独秀峰', '5A'],
  ['乐满地', '5A'],
  // 张家界
  ['武陵源', '5A'], ['天门山', '5A'], ['张家界国家森林公园', '5A'],
  // 厦门
  ['鼓浪屿', '5A'],
  // 昆明
  ['石林', '5A'], ['世博园', '5A'],
  // 哈尔滨
  ['太阳岛', '5A'],
  // 长沙
  ['岳麓山', '5A'], ['橘子洲', '5A'], ['花明楼', '5A'],
  // 天津
  ['古文化街', '5A'], ['盘山', '5A'],
  // 宁波
  ['溪口', '5A'], ['天一阁', '5A'],
  // 南昌
  ['滕王阁', '5A'],
  // 广州
  ['长隆', '5A'], ['白云山', '5A'],
  // 武汉
  ['黄鹤楼', '5A'], ['东湖', '5A'],
  // 郑州
  ['少林寺', '5A'], ['嵩山', '5A'], ['龙门石窟', '5A'], ['清明上河园', '5A'],
  ['殷墟', '5A'],
  // 青岛
  ['崂山', '5A'],
  // 深圳
  ['世界之窗', '5A'], ['观澜湖', '5A'],
  // 上饶
  ['三清山', '5A'], ['婺源江湾', '5A'], ['龟峰', '5A'], ['篁岭', '5A'],
  // 大理
  ['崇圣寺三塔', '5A'],
  // 海口
  ['火山口', '5A'],
  // 沈阳
  ['沈阳故宫', '5A'],
  // 福州
  ['三坊七巷', '5A'],
  // 其他著名5A
  ['黄山', '5A'], ['泰山', '5A'], ['庐山', '5A'], ['武夷山', '5A'],
  ['丽江古城', '5A'], ['玉龙雪山', '5A'], ['布达拉宫', '5A'],
  ['避暑山庄', '5A'], ['云冈石窟', '5A'], ['平遥古城', '5A'],
  ['五台山', '5A'], ['恒山', '5A'],

  // ===== 4A景区 =====
  // 北京
  ['鸟巢', '4A'], ['国家体育场', '4A'], ['水立方', '4A'], ['什刹海', '4A'],
  ['北海公园', '4A'], ['景山公园', '4A'], ['北京动物园', '4A'],
  // 上海
  ['豫园', '4A'], ['上海博物馆', '4A'], ['朱家角', '4A'],
  // 重庆
  ['洪崖洞', '4A'], ['磁器口', '4A'], ['长江索道', '4A'], ['解放碑', '4A'],
  ['缙云山', '4A'], ['四面山', '4A'],
  // 杭州
  ['宋城', '4A'],
  // 南京
  ['南京博物院', '4A'], ['南京城墙', '4A'], ['玄武湖', '4A'],
  ['栖霞山', '4A'], ['红山森林动物园', '4A'],
  // 成都
  ['宽窄巷子', '4A'], ['锦里', '4A'], ['文殊院', '4A'], ['三星堆', '4A'],
  // 西安
  ['陕西历史博物馆', '4A'], ['西安城墙', '4A'], ['小雁塔', '4A'],
  ['大唐不夜城', '4A'], ['回民街', '4A'],
  // 三亚
  ['天涯海角', '4A'], ['亚龙湾', '4A'], ['鹿回头', '4A'],
  // 桂林
  ['阳朔西街', '4A'], ['龙脊梯田', '4A'], ['七星公园', '4A'],
  // 张家界
  ['黄龙洞', '4A'], ['大峡谷', '4A'], ['土家风情园', '4A'],
  // 厦门
  ['南普陀', '4A'], ['胡里山', '4A'], ['集美', '4A'],
  // 昆明
  ['云南民族村', '4A'], ['滇池', '4A'], ['金殿', '4A'],
  // 哈尔滨
  ['冰雪大世界', '4A'], ['圣索菲亚', '4A'], ['东北虎林园', '4A'],
  ['中央大街', '4A'],
  // 长沙
  ['湖南博物院', '4A'], ['天心阁', '4A'], ['太平老街', '4A'],
  ['马王堆', '4A'],
  // 天津
  ['天津之眼', '4A'], ['五大道', '4A'], ['天津博物馆', '4A'],
  ['水上公园', '4A'],
  // 宁波
  ['老外滩', '4A'], ['东钱湖', '4A'], ['保国寺', '4A'],
  // 南昌
  ['梅岭', '4A'], ['八一起义', '4A'], ['绳金塔', '4A'],
  ['南昌之星', '4A'],
  // 广州
  ['陈家祠', '4A'], ['中山纪念堂', '4A'], ['沙面', '4A'],
  ['广州塔', '4A'], ['越秀公园', '4A'],
  // 武汉
  ['湖北省博物馆', '4A'], ['武汉长江大桥', '4A'], ['武汉大学', '4A'],
  // 郑州
  ['河南博物院', '4A'], ['黄河风景名胜区', '4A'], ['二七纪念塔', '4A'],
  ['嵩阳书院', '4A'],
  // 青岛
  ['青岛啤酒博物馆', '4A'], ['八大关', '4A'], ['栈桥', '4A'],
  ['五四广场', '4A'], ['金沙滩', '4A'],
  // 深圳
  ['大鹏所城', '4A'], ['仙湖植物园', '4A'], ['深圳湾公园', '4A'],
  ['华侨城创意文化园', '4A'],
  // 上饶
  ['灵山', '4A'],
  // 大理
  ['苍山', '4A'], ['洱海', '4A'], ['喜洲古镇', '4A'], ['大理古城', '4A'],
  ['蝴蝶泉', '4A'],
  // 海口
  ['骑楼老街', '4A'], ['五公祠', '4A'], ['假日海滩', '4A'],
  ['热带野生动植物园', '4A'],
  // 沈阳
  ['北陵公园', '4A'], ['清昭陵', '4A'], ['张氏帅府', '4A'],
  ['沈阳世博园', '4A'], ['九一八', '4A'],
  // 福州
  ['鼓山', '4A'], ['福州国家森林公园', '4A'], ['上下杭', '4A'],

  // ===== 3A景区 =====
  ['福州西湖公园', '3A'], ['金马碧鸡坊', '3A'], ['大观楼', '3A'],
  ['华强北', '3A'],
];

/**
 * 根据景点名称匹配等级
 * 优先匹配更精确（更长）的关键词，5A优先于4A
 */
function matchLevel(attractionName) {
  let bestMatch = null;
  let bestMatchLength = 0;

  for (const [keyword, level] of LEVEL_MAP) {
    if (attractionName.includes(keyword)) {
      if (keyword.length > bestMatchLength) {
        bestMatch = level;
        bestMatchLength = keyword.length;
      }
    }
  }

  return bestMatch;
}

/**
 * 通过 Supabase REST API 读取数据
 */
function fetchFromSupabase(pathSuffix) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'cxegaqhwexiidezycbyg.supabase.co',
      path: `/rest/v1/${pathSuffix}`,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          reject(new Error(`Parse error: ${data.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * 通过 Supabase REST API 更新城市数据
 */
function updateCityAttractions(cityId, attractions) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ attractions });
    
    const options = {
      hostname: 'cxegaqhwexiidezycbyg.supabase.co',
      path: `/rest/v1/cities?id=eq.${cityId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * 生成 SQL UPDATE 语句
 */
function generateUpdateSQL(cityName, attractionName, level) {
  const safeName = attractionName.replace(/'/g, "''");
  const safeCity = cityName.replace(/'/g, "''");
  
  return `UPDATE cities SET attractions = (
    SELECT jsonb_agg(
      CASE 
        WHEN elem->>'name' = '${safeName}' THEN jsonb_set(elem, '{level}', '"${level}"')
        ELSE elem
      END
    ) FROM jsonb_array_elements(attractions) elem
  ) WHERE name = '${safeCity}';`;
}

async function main() {
  const applyMode = process.argv.includes('--apply');
  const forceOverwrite = process.argv.includes('--force');
  
  console.log('=== 景点A级等级批量更新脚本 ===');
  console.log(`模式: ${applyMode ? '执行更新' : '预览模式（加 --apply 执行）'}`);
  console.log(`覆盖: ${forceOverwrite ? '强制覆盖已有等级' : '跳过已有等级'}\n`);

  // 1. 读取所有城市数据
  console.log('正在从数据库读取城市数据...');
  const cities = await fetchFromSupabase('cities?select=id,name,attractions&attractions=not.is.null');
  console.log(`共读取 ${cities.length} 个城市\n`);

  let totalMatched = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalUnmatched = 0;
  const unmatchedList = [];
  const allSQL = [];
  const updateQueue = []; // { cityId, cityName, attractions }

  // 2. 遍历每个城市
  for (const city of cities) {
    const attractions = city.attractions;
    if (!Array.isArray(attractions)) continue;

    let cityNeedsUpdate = false;
    const newAttractions = [];
    const cityUpdates = [];

    for (const attr of attractions) {
      const name = attr.name || '';
      const existingLevel = attr.level;

      // 已有等级的跳过（除非强制覆盖）
      if (existingLevel && !forceOverwrite) {
        newAttractions.push(attr);
        totalSkipped++;
        continue;
      }

      // 匹配等级
      const level = matchLevel(name);
      if (level) {
        const newAttr = { ...attr, level };
        newAttractions.push(newAttr);
        cityNeedsUpdate = true;
        totalMatched++;
        cityUpdates.push({ name, level, existingLevel });
        allSQL.push(generateUpdateSQL(city.name, name, level));
      } else {
        newAttractions.push(attr);
        totalUnmatched++;
        unmatchedList.push({ city: city.name, attraction: name });
      }
    }

    if (cityNeedsUpdate) {
      updateQueue.push({ cityId: city.id, cityName: city.name, attractions: newAttractions });
      const levelSummary = {};
      cityUpdates.forEach(u => {
        levelSummary[u.level] = (levelSummary[u.level] || 0) + 1;
      });
      console.log(`[${city.name}] 待更新 ${cityUpdates.length} 个: ${Object.entries(levelSummary).map(([k,v]) => `${k}×${v}`).join(', ')}`);
      cityUpdates.forEach(u => {
        const suffix = u.existingLevel ? ` (${u.existingLevel}→${u.level})` : '';
        console.log(`    ${u.name} → ${u.level}${suffix}`);
      });
    } else {
      const hasLevel = attractions.filter(a => a.level).length;
      console.log(`[${city.name}] 无需更新 (${hasLevel}/${attractions.length} 已有等级)`);
    }
  }

  // 3. 生成SQL文件
  if (allSQL.length > 0) {
    const sqlFile = path.join(__dirname, 'update_levels.sql');
    fs.writeFileSync(sqlFile, allSQL.join('\n\n'), 'utf8');
    console.log(`\n已生成SQL文件: ${sqlFile} (${allSQL.length} 条语句)`);
  }

  // 4. 执行更新
  if (applyMode && updateQueue.length > 0) {
    console.log(`\n开始执行更新 (${updateQueue.length} 个城市)...`);
    
    for (const { cityId, cityName, attractions } of updateQueue) {
      try {
        await updateCityAttractions(cityId, attractions);
        totalUpdated++;
        console.log(`  ✓ [${cityName}] 更新成功`);
      } catch (err) {
        console.log(`  ✗ [${cityName}] 更新失败: ${err.message}`);
      }
    }
  } else if (!applyMode && updateQueue.length > 0) {
    console.log('\n⚠ 预览模式，未执行更新。加 --apply 参数执行更新。');
  }

  // 5. 输出统计
  console.log('\n=== 统计 ===');
  console.log(`匹配成功: ${totalMatched} 个景点`);
  console.log(`已有等级跳过: ${totalSkipped} 个`);
  console.log(`未匹配等级: ${totalUnmatched} 个`);
  if (applyMode) {
    console.log(`成功更新: ${totalUpdated} 个城市`);
  }

  if (unmatchedList.length > 0) {
    console.log('\n未匹配等级的景点（可在 LEVEL_MAP 中添加映射）:');
    unmatchedList.forEach(u => console.log(`  - [${u.city}] ${u.attraction}`));
  }
}

main().catch(console.error);
