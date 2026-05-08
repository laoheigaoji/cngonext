import { CityData } from '../types/city';

export const citiesData: Record<string, CityData> = {
  beijing: {
    id: 'beijing',
    name: '北京',
    enName: 'Beijing',
    heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '144小时过境免签', enText: '144h Visa-Free', color: 'green' },
      { text: '六朝古都', enText: 'Ancient Capital', color: 'amber' },
      { text: '政治文化中心', enText: 'Cultural Center', color: 'blue' }
    ],
    paragraphs: [
      '北京市（Beijing City），简称“京”，古称燕京、北平，是中华人民共和国的首都、直辖市、国家中心城市、超大城市。它不仅是中国政治、文化、国际交往和科技创新的中心，更是一座拥有三千多年建城史、八百多载建都史的历史文化名城，承载着厚重的华夏文明印记。',
      '北京地处华北平原北端，西面和北面环山，东南面向渤海。这里属于暖温带半湿润大陆性季风气候，四季分明。雄伟的燕山山脉与奔流不息的永定河，共同孕育了这片肥沃的土地。从金中都、元大都到明清京师，地理环境的优越性使其自古以来便是兵家必争之地和封建王朝的首选之都。',
      '北京的魅力，在于其宏伟的皇家建筑与幽深的胡同生活并存。您可以登临长城，感受“万里长城永不倒”的民族气节；也可以漫步故宫，惊叹于东方宫殿建筑艺术的巅峰。而在转角的胡同深处，那些灰墙青瓦、提笼挂鸟的老北京生活，依然保留着一份古老城隍的悠闲与从容。这种帝王之气与市井温情的交织，构成了北京最迷人的色彩。',
      '北京的文化博大精深，是传统与现代的完美融合。京剧、相声、老字号，这些文化瑰宝在现代都市的脉动中焕发出新的活力。饮食上，北京菜（鲁菜系为主）讲究规矩与火候，北京烤鸭、老北京炸酱面等经典美食，不仅是味蕾的享受，更是历史的沉淀。',
      '作为举办过夏季和冬季奥运会的“双奥之城”，北京正以前所未有的开放姿态拥抱世界。从CBD的现代建筑森林到中关村的科技创新高地，北京在守护活态文化遗产的同时，正加速建设成为国际一流的和谐宜居之都，向世界展示着古老中国走向现代化的宏伟画卷。'
    ],
    enParagraphs: [
      'Beijing, the capital of the People\'s Republic of China, is a global city with over 3,000 years of history. It serves as the nation\'s political, cultural, and international exchange hub, blending imperial grandeur with cutting-edge modernization.',
      'Located at the northern tip of the North China Plain, Beijing is shielded by mountains to the west and north, facing the Bohai Sea to the southeast. It features a continental monsoon climate with four distinct seasons, from blooming springs to snowy winters.',
      'The city\'s charm lies in the contrast between its massive imperial monuments and its intimate historical alleys. One can walk the Great Wall, explore the Forbidden City\'s vast courtyards, or wander through the grey-walled Hutongs where traditional Beijing life still echoes.',
      'Beijing\'s culture is an immense tapestry including Peking Opera, traditional crafts, and old time-honored brands. Its cuisine, notably Peking Roast Duck, reflects a refined culinary tradition developed over centuries in the royal kitchens.',
      'As the world\'s first "Dual Olympic City," Beijing is a vibrant metropolis. While preserving its seven UNESCO World Heritage sites, it continues to evolve as a global leader in technology and innovation, offering a unique window into China\'s past and future.'
    ],
    stats: { wantToVisit: 95, recommended: 15 },
    info: { area: '16.4K km²', population: '21.8M' },
    bestTravelTime: {
      strongText: '春秋两季（4月-5月，9月-10月）',
      enStrongText: 'Spring (April-May) and Autumn (September-October)',
      paragraphs: [
        '春季的北京，天气逐渐转暖，满园春色。万物复苏，非常适合赏花和在公园漫步。',
        '秋季是北京公认的最美季节，特别是“秋高气爽”的九十月份。由于没有春季的沙尘天气，天色湛蓝，北京香山的红叶也正值观赏期。'
      ],
      enParagraphs: [
        'Spring in Beijing brings rising temperatures and blooming scenery, perfect for park walks.',
        'Autumn is widely considered the best time to visit. The air is crisp, the sky is clear, and the Fragrant Hills provide stunning red maple views.'
      ]
    },
    history: [
      { year: '1421年', enYear: '1421 AD', title: '明迁都北京', enTitle: 'Ming Dynasty Capital Move', desc: '明成祖朱棣正式迁都北京，修筑了故宫和北京城墙，奠定了今天北京老城的格局。', enDesc: 'Emperor Yongle officially moved the capital to Beijing, building the Forbidden City.' },
      { year: '1949年', enYear: '1949 AD', title: '开国大典', enTitle: 'Founding of the PRC', desc: '10月1日，毛泽东在天安门城楼宣布中华人民共和国成立，北京再次成为大一统国家的首都。', enDesc: 'On Oct 1st, Chairman Mao announced the founding of the PRC at Tiananmen.' },
      { year: '2008年', enYear: '2008 AD', title: '夏季奥运会', enTitle: 'Summer Olmpics', desc: '北京成功举办第29届奥林匹克运动会，通过“鸟巢”和“水立方”向全世界展示了现代中国的崛起。', enDesc: 'The 29th Olympic Games were held, showcasing modern China to the world through the Bird\'s Nest.' }
    ],
    attractions: [
      { name: '故宫博物院', enName: 'Forbidden City', desc: '明清两代的皇宫，也是世界上现存规模最大、保存最完整的砖木结构古建筑群。', enDesc: 'The imperial palace of the Ming and Qing dynasties, the world\'s largest ancient palatial complex.', price: '60元(旺季)/40元(淡季)', enPrice: '60 RMB (Peak)/40 RMB (Off)', season: '全年', enSeason: 'All year', time: '3-5小时', enTime: '3-5h', rating: 'AAAAA' },
      { name: '八达岭长城', enName: 'Badaling Great Wall', desc: '长城防御工程最具代表性的地段，见证了中华民族的勤劳与智慧。', enDesc: 'The most representative section of the Great Wall fortification.', price: '40元(旺季)/35元(淡季)', enPrice: '40 RMB (Peak)/35 RMB (Off)', season: '春秋', enSeason: 'Spring/Autumn', time: '半天', enTime: 'Half day', rating: 'AAAAA' },
      { name: '颐和园', enName: 'Summer Palace', desc: '保存最完整的皇家行宫御苑，被誉为“皇家园林博物馆”。', enDesc: 'The best-preserved imperial garden, known as the museum of royal gardens.', price: '30元(旺季)/20元(淡季)', enPrice: '30 RMB (Peak)/20 RMB (Off)', season: '春秋', enSeason: 'Spring/Autumn', time: '3-4小时', enTime: '3-4h', rating: 'AAAAA' },
      { name: '天坛', enName: 'Temple of Heaven', desc: '明清两代皇帝祭天、祈谷的场所，建筑精美，寓意深远。', enDesc: 'Where emperors of the Ming and Qing prayed for good harvests.', price: '15元', enPrice: '15 RMB', season: '全年', enSeason: 'All year', time: '2-3小时', enTime: '2-3h', rating: 'AAAAA' }
    ],
    worldHeritage: [
      { name: '北京故宫', enName: 'Forbidden City', year: '1987录入', enYear: 'Listed 1987', desc: '中国古代艺术与建筑的瑰宝，展示了五百余年的宫廷历史。', enDesc: 'A treasure of ancient Chinese art/architecture with 500 years of history.' },
      { name: '长城', enName: 'The Great Wall', year: '1987录入', enYear: 'Listed 1987', desc: '跨越中国北方，是地球上最宏伟的防御工程，也是中华民族的象征。', enDesc: 'The most ambitious defense system on Earth and a symbol of China.' },
      { name: '周口店北京人遗址', enName: 'Zhoukoudian', year: '1987录入', enYear: 'Listed 1987', desc: '提供了人类进化过程的重要证据，是东亚地区直立人存在的关键。', enDesc: 'Provides key evidence for human evolution in East Asia.' }
    ],
    intangibleHeritage: [
      { name: '京剧', enName: 'Peking Opera', year: '2010-11列入', enYear: 'Listed 2010-11', desc: '糅合了唱、念、做、打、等多门艺术，是中国最具代表性的剧种，被誉为“国粹”。', enDesc: 'Combines vocals, narration, and combat; known as the "national essence."', imageUrl: 'https://images.unsplash.com/photo-1544976785-05d688cf7b44?w=400&q=80' }
    ],
    transportation: [
      { iconName: 'Plane', title: '航班', enTitle: 'Flight', desc: '北京拥有两个枢纽：首都国际机场(PEK) 和 大兴国际机场(PKX)。', enDesc: 'Beijing has two global hubs: Capital (PEK) and Daxing (PKX).', price: '可通过轨道交通大兴线或机场快轨直达。', enPrice: 'Accessible via airport express lines.' },
      { iconName: 'Train', title: '铁路', enTitle: 'Railway', desc: '拥有北京站、北京西站、北京南站等多个主要客运中心。', enDesc: 'Multiple major rail centers including Beijing South.', price: '乘坐京沪高铁到上海最快不到5小时。', enPrice: 'Reach Shanghai in under 5 hours via HSR.' }
    ],
    food: [
      { name: '北京烤鸭', enName: 'Peking Roast Duck', pinyin: 'Běijīng kǎoyā', price: '¥150-300/只', desc: '果木炭火烤制，色泽红润，皮脆肉嫩，肥而不腻。', enDesc: 'Roasted with fruit charcoal, crispy skin, and tender meat.', ingredients: '填鸭、甜面酱、大葱丝、黄瓜条。', enIngredients: 'Duck, sweet bean sauce, green onion, cucumber.', imageIdx: 1 }
    ]
  },
  shanghai: {
    id: 'shanghai',
    name: '上海',
    enName: 'Shanghai',
    heroImage: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '144小时过境免签', enText: '144h Visa-Free', color: 'green' },
      { text: '魔都', enText: 'Magic City', color: 'purple' },
      { text: '全球金融中心', enText: 'Global Financial Center', color: 'blue' }
    ],
    paragraphs: [
      '上海市（Shanghai City），简称“沪”，别称“魔都”，是中国直辖市、国家中心城市、超大城市。它坐落于中国东部海岸线的中点，长江入海口，是中国的经济、金融、贸易、航行和科技创新中心。',
      '从曾经的小渔村到如今的国际大都市，上海的城市天际线见证了时代的巨变。而在外滩的万国建筑群中，那段百年的历史沧桑依然清晰可见。',
      '上海的魅力在于其海派文化。这种文化既保留了中国江南的温婉底蕴，又深度吸纳了西方的现代文明，形成了独特的“海纳百川、追求卓越”的城市精神。'
    ],
    enParagraphs: [
      'Shanghai, known as the "Magic City," is China\'s largest economic and financial center. Located at the mouth of the Yangtze River, it is a global hub for trade, navigation, and technological innovation.',
      'From a fishing village to a global metropolis, Shanghai\'s skyline reflects the rapid change of eras. The historic "Bund" stands as a "Museum of International Architecture," telling stories of a century of history.',
      'The city\'s charm lies in its "Haipai" culture—a unique blend that respects traditional Jiangnan roots while deeply integrating Western modernity, embodying a spirit of excellence.'
    ],
    stats: { wantToVisit: 98, recommended: 18 },
    info: { area: '6.3K km²', population: '24.9M' },
    bestTravelTime: {
      strongText: '春秋两季（3月-5月，9月-11月）',
      enStrongText: 'Spring (March-May) and Autumn (September-November)',
      paragraphs: [
        '春季气温回升，上海的大街小巷繁花似锦；秋季天高气爽，也是品尝大闸蟹的最佳时节。'
      ],
      enParagraphs: [
        'Spring is blooming and mild; autumn is pleasant and the best time for hairy crab tasting.'
      ]
    },
    history: [
      { year: '1843年', enYear: '1843 AD', title: '上海开埠', enTitle: 'Opening as a Port', desc: '根据《南京条约》，上海被列为五口通商口岸之一，正式开启了其近代化进程。', enDesc: 'Shanghai officially opened as a treaty port, starting its history as a global trade hub.' }
    ],
    attractions: [
      { name: '外滩', enName: 'The Bund', desc: '上海的标志性景观，拥有52幢风格各异的古典复兴建筑。', enDesc: 'Shanghai\'s most iconic waterfront, featuring a "Museum of International Architecture."', price: '免费', enPrice: 'Free', season: '全年', enSeason: 'All year', time: '1-2小时', enTime: '1-2h', rating: 'AAAAA' },
      { name: '东方明珠广播电视塔', enName: 'Oriental Pearl Tower', desc: '上海地标建筑，俯瞰迷人的浦江两岸景观。', enDesc: 'A landmark TV tower offering panoramic views of the city.', price: '199元起', enPrice: 'From 199 RMB', season: '全年', enSeason: 'All year', time: '2-3小时', enTime: '2-3h', rating: 'AAAAA' }
    ],
    transportation: [
      { iconName: 'Plane', title: '航班', enTitle: 'Flight', desc: '上海拥有浦东国际机场(PVG)和虹桥国际机场(SHA)。', enDesc: 'Shanghai features Pudong (PVG) and Hongqiao (SHA) airports.', price: '可通过地铁2号线、10号线或磁悬浮列车直达。', enPrice: 'Direct access via Metro Line 2, 10, or Maglev.' }
    ],
    food: [
      { name: '小笼包', enName: 'Xiao Long Bao', pinyin: 'Xiǎolóngbāo', price: '¥20-40/屉', desc: '皮薄、馅鲜、汤多，味道极佳。', enDesc: 'Thin-skinned dumplings filled with rich broth and fresh pork.', ingredients: '猪肉、面粉、高汤皮冻。', enIngredients: 'Pork, flour, and soup jelly.', imageIdx: 5 }
    ]
  },
  haikou: {
    id: 'haikou',
    name: '海口',
    enName: 'Haikou',
    heroImage: 'https://images.unsplash.com/photo-1540202403-b712e0e026ee?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '24小时过境免签', enText: '24h Visa-Free', color: 'green' },
      { text: '椰城', enText: 'Coconut City', color: 'emerald' },
      { text: '自由贸易港', enText: 'Free Trade Port', color: 'blue' }
    ],
    paragraphs: [
      '海口市（Haikou City），简称“海”，是海南省的省会。因历史上遍植椰树，素有“椰城”的美誉。作为中国最南端的热带海岛省会，海口将明媚的阳光、湛蓝的海洋与悠闲的市井生活相融合，孕育出一种从容、开放且富有活力的独特海岛气质。',
      '海口地处海南岛的北端，与广东省雷州半岛隔琼州海峡相望，是连接中国大陆与海南岛的门户。这里地势平缓，属于热带海洋性季风气候区，最显著的特征便是“长夏无冬”，终年阳光充足，空气清新。碧海蓝天是这里日常的背景板，这得天独厚的自然环境，使其成为中国理想的避寒和度假胜地。',
      '这座城市的魅力，一半在于它作为海岛的自然馈赠，另一半则在于它作为港口的历史沉淀。您可以沿着“假日海滩”的绵长海岸线漫步，感受椰风海韵的轻拂；也可以深入市中心，穿行于“骑楼老街”之中。这些融合了南洋与欧式风格的百年骑楼建筑群，见证了海口昔日作为通商口岸的繁华，至今仍充满着浓郁的市井烟火气。',
      '海口的灵魂，在于其独树一帜的“慢生活”节奏。这种节奏在“老爸茶”文化中体现得淋漓尽致。在遍布街巷的茶馆里，当地人（尤其老一辈）用一壶茶、几碟点心，便能闲谈一个下午，这是独属于海口的“巴适”。饮食上，作为海南菜的中心，这里强调食材的本味，口味清淡鲜美。无论是文昌鸡、加积鸭还是新鲜的海鲜，都让人品尝到最纯粹的“海的味道”。',
      '作为海南自由贸易港的核心城市，海口正站在中国新一轮对外开放的最前沿。这座城市正加速从一个传统的旅游城市向国际化的贸易、金融和航运中心转变。它将热带岛屿的闲适风情与建设自由贸易港的时代脉搏巧妙结合，在蔚蓝的南海之滨，展现着一种别具一格的现代化图景。'
    ],
    enParagraphs: [
      'Haikou, the capital of Hainan Province, is known as "Coconut City" due to its historic abundance of coconut trees. As China\'s southernmost tropical island capital, Haikou blends bright sunshine, blue oceans, and a relaxed lifestyle into a unique, open, and vibrant island atmosphere.',
      'Located at the northern tip of Hainan Island, separated from the Leizhou Peninsula of Guangdong by the Qiongzhou Strait, Haikou is the gateway connecting mainland China to Hainan. It features low-lying terrain and a tropical marine monsoon climate, characterized by "long summers and no winters," with year-round sunshine and fresh air.',
      'The city\'s charm lies in both its natural gifts and its historical depth as a port. You can stroll along the "Holiday Beach," feeling the tropical breeze, or dive into the "Qilou Old Street" in the city center. These century-old arcade buildings, blending Nanyang and European styles, witnessed Haikou\'s prosperity as a trading port.',
      'Haikou\'s soul is its "slow life" pace, perfectly embodied in the "Lao Ba Tea" (Old Dad\'s Tea) culture. In teahouses across the streets, locals spend entire afternoons chatting over tea and snacks. The cuisine emphasizes original flavors—light and fresh. Whether it\'s Wenchang Chicken, Jiaji Duck, or fresh seafood, you taste the pure "flavor of the sea."',
      'As the core city of the Hainan Free Trade Port, Haikou is at the forefront of China\'s opening-up. The city is transforming into an international trade, finance, and shipping hub while maintaining its tropical island charm, showcasing a modern picture on the shores of the South China Sea.'
    ],
    stats: { wantToVisit: 55, recommended: 5 },
    info: { area: '2.3K km²', population: '3.0M' },
    bestTravelTime: {
      strongText: '每年的10月至次年5月',
      enStrongText: 'October to May',
      paragraphs: [
        '这段时间海口气候温和舒适，降雨较少，阳光充足，非常适合进行户外活动和海滨游玩。',
        '应尽量避开6月至9月的雨季和台风高发期，尽管此时海鲜最为肥美。'
      ],
      enParagraphs: [
        'The climate is mild and comfortable during this period, with less rain and plenty of sunshine, ideal for outdoor and seaside activities.',
        'Avoid June to September due to the rainy season and typhoons, though seafood is at its best then.'
      ]
    },
    history: [
      { year: '公元前110年', enYear: '110 BC', title: '珠崖郡治', enTitle: 'Zhuya Prefecture', desc: '汉武帝在此地设立珠崖郡，海口作为其下辖的玳瑁县，正式纳入中央王朝版图。', enDesc: 'Emperor Wu of Han established Zhuya Prefecture, officially incorporating Haikou into the empire.' },
      { year: '1858年', enYear: '1858 AD', title: '开埠通商', enTitle: 'Treaty Port', desc: '海口被辟为通商口岸，自此成为海南与海外贸易的重要门户。', enDesc: 'Haikou was opened as a treaty port, becoming a gateway for international trade.' },
      { year: '1988年', enYear: '1988 AD', title: '省会确立', enTitle: 'Provincial Capital', desc: '海南建省并成为特区，海口确立为省会，迅速发展成为现代滨海城市。', enDesc: 'Hainan became a province and SEZ; Haikou was established as its capital.' }
    ],
    attractions: [
      { name: '海口火山群地质公园', enName: 'Volcanic Cluster Geopark', desc: '探索万年前的火山遗迹，感受大自然的鬼斧神工。', enDesc: 'Explore volcanic relics from 10,000 years ago.', price: '50元', enPrice: '50 RMB', season: '全年', enSeason: 'All year', time: '3-4小时', enTime: '3-4h', rating: 'AAAAA' },
      { name: '骑楼老街', enName: 'Qilou Old Street', desc: '漫步于南洋风情的建筑群，品味百年商贸文化。', enDesc: 'Walk through Nanyang-style architecture and taste century-old culture.', price: '免费', enPrice: 'Free', season: '全年', enSeason: 'All year', time: '2-3小时', enTime: '2-3h' }
    ],
    transportation: [
      { iconName: 'Plane', title: '飞机', enTitle: 'Flight', desc: '海口美兰国际机场是区域枢纽。', enDesc: 'Meilan International Airport is a regional hub.', price: '机场大巴约20元。', enPrice: 'Airport bus ~20 RMB.' },
      { iconName: 'Ship', title: '轮渡', enTitle: 'Ferry', desc: '海口拥有秀英港、新海港等多个重要港口。', enDesc: 'Several major ports including Xiuying and Xinhai.', price: '跨海轮渡票价视车型而定。', enPrice: 'Ferry prices vary by vehicle/person.' }
    ],
    food: [
      { name: '文昌鸡', enName: 'Wenchang Chicken', pinyin: 'Wénchāng jī', price: '¥60-120/只', desc: '海南名菜之首，肉质滑嫩，皮薄骨酥。', enDesc: 'The premier Hainan dish, tender and famous.', ingredients: '文昌鸡、姜蒜、桔子汁蘸料。', enIngredients: 'Wenchang chicken, ginger, garlic, calamansi sauce.', imageIdx: 10 },
      { name: '老爸茶', enName: 'Lao Ba Tea', pinyin: 'Lǎobà chá', price: '¥30-60/人', desc: '海口最具特色的生活方式。', enDesc: 'The most unique lifestyle in Haikou.', ingredients: '红茶、各种点心、西点、海南小吃。', enIngredients: 'Tea, various snacks, pastries, local treats.', imageIdx: 11 }
    ]
  },
  fuzhou: {
    id: 'fuzhou',
    name: '福州',
    enName: 'Fuzhou',
    heroImage: 'https://images.unsplash.com/photo-1599701007785-36427d14d2a1?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '榕城', enText: 'Banyan City', color: 'emerald' },
      { text: '海上丝绸之路', enText: 'Maritime Silk Road', color: 'blue' },
      { text: '有福之州', enText: 'Blessed City', color: 'amber' }
    ],
    paragraphs: [
      '福州市（Fuzhou City），简称“榕”，别称闽都，是福建省的省会。因城内多植榕树，自唐代以来便有“榕城”的美誉。福州是一座拥有2200多年建城史的国家历史文化名城，也是国家近代海军的发祥地，承载着厚重的闽越文化与海洋文明基因。',
      '福州地处中国东南沿海、闽江下游，依山傍海，地势北高南低。这里属于典型的亚热带海洋性季风气候，常年温暖潮湿，四季如春。闽江横贯市区，两岸山清水秀，形成了“山在城中，城在山中”的独特景观，也使其成为中国最宜居、空气质量最好的省会城市之一。',
      '福州的魅力，在于其深厚的底蕴与市井温情的交织。位于市中心的“三坊七巷”，被誉为“中国城市里坊制度活化石”和“中国明清建筑博物馆”。穿梭在黛瓦白墙与马鞍墙之间，您可以步入严复、冰心等近现代名人的故居，感受那份从这里走出的“半部中国近代史”的厚重气息。',
      '作为海上丝绸之路的重要起点，福州的文化充满了包容与开放。这种精神也体现在其精致的非物质文化遗产中，如福州脱胎漆器、寿山石雕等，技艺精湛，驰名中外。饮食上，作为闽菜的中心，福州菜以烹制山珍海味见长，讲究鲜、香、淡、脆，尤以调汤闻名。',
      '今天的福州，正以前所未有的姿态拥抱未来。作为国际化的滨海城市和国家中心城市，福州正加速建设“数字福州”和“海上福州”，在守护蓝天绿水的同时，向世界展示着一座“有福之州”的现代化繁华与人文魅力。'
    ],
    enParagraphs: [
      'Fuzhou, the capital of Fujian Province, is famously known as the "Banyan City" due to its ancient banyan trees planted since the Tang Dynasty. With over 2,200 years of history, it is a key cradle of modern Chinese naval culture and a gateway to the Maritime Silk Road.',
      'Located on the southeastern coast at the mouth of the Min River, Fuzhou enjoys a subtropical marine monsoon climate, featuring mild winters and blooming springs. The city is celebrated for its lush greenery and exceptional air quality, consistently ranking among China\'s most livable provincial capitals.',
      'The soul of Fuzhou resides in "Three Lanes and Seven Alleys," a living fossil of the ancient city layout. This district preserved exceptional Ming and Qing architecture and was the home of many influential figures in modern Chinese history, earning it the nickname "half of modern Chinese history."',
      'Fuzhou\'s culture blends mountain and sea influences, visible in its exquisite crafts like Bodiless Lacquerware and Shoushan Stone Carvings. Its cuisine, the heart of Fujianese food, is renowned for its delicate soups and emphasis on the natural, fresh flavors of seafood.',
      'Today, Fuzhou is evolving into a modern coastal metropolis. By integrating digital innovation with its marine heritage, the "Blessed City" continues to preserve its historical roots while building a dynamic, sustainable future for the world to see.'
    ],
    stats: { wantToVisit: 68, recommended: 7 },
    info: { area: '12K km²', population: '8.4M' },
    bestTravelTime: {
      strongText: '春秋两季（3月-5月，10月-11月）',
      enStrongText: 'Spring (March-May) and Autumn (October-November)',
      paragraphs: [
        '福州的春天百花盛开，万物复苏，非常适合在西湖公园或森林公园散步。',
        '秋季则是福州最舒适的季节，由于没有夏季的酷暑和台风，阳光柔和，空气清爽，适合户外探索。'
      ],
      enParagraphs: [
        'Spring in Fuzhou is full of flowers and vitality, perfect for walks in West Lake Park.',
        'Autumn is considered the most comfortable season, with mild sunshine and clear air, ideal for uncovering the city\'s hidden gems.'
      ]
    },
    history: [
      { year: '公元前202年', enYear: '202 BC', title: '闽越建都', enTitle: 'Min-Yue Capital', desc: '闽越王无诸在福州修筑冶城，标志着福州城市建设的开始。', enDesc: 'King Wuzhu built Yecheng in Fuzhou, marking the city\'s beginning.' },
      { year: '公元1844年', enYear: '1844 AD', title: '正式开埠', enTitle: 'Opening of Port', desc: '作为《南京条约》规定的五口通商口岸之一，福州正式开埠，开启了近代城市化进程。', enDesc: 'As one of the five treaty ports, Fuzhou began its modern urbanization.' },
      { year: '1984年', enYear: '1984 AD', title: '沿海开放', enTitle: 'Coastal Opening', desc: '福州被列为全国首批14个沿海开放城市之一，迎来了跨越式的发展机遇。', enDesc: 'Fuzhou became one of the first 14 coastal cities to open up to foreign trade.' }
    ],
    attractions: [
      { name: '三坊七巷', enName: 'Three Lanes and Seven Alleys', desc: '漫步于明清古建筑群中，寻访严复、冰心等名人的故居。', enDesc: 'Walk through ancient alleys and visit celebrity former residences.', price: '免费(部分场馆收费)', enPrice: 'Free (Some venues charge)', season: '全年', enSeason: 'All year', time: '3-4小时', enTime: '3-4h', rating: 'AAAAA' },
      { name: '鼓山', enName: 'Mount Gu', desc: '登临福州著名的风景区，参观千年古刹涌泉寺，俯瞰闽江美景。', enDesc: 'Climb the famous scenic mountain and visit the ancient Yongquan Temple.', price: '免费(部分景点及缆车收费)', enPrice: 'Free (Fees for some spots/cableway)', season: '春秋', enSeason: 'Spring/Autumn', time: '4-6小时', enTime: '4-6h', rating: 'AAAA' }
    ],
    worldHeritage: [
      { name: '中国海上丝绸之路（预备名单）', enName: 'Maritime Silk Road', year: '2012录入预备名单', enYear: 'UNESCO Tentative List 2012', desc: '福州作为海上丝绸之路的重要起点和枢纽，拥有大量相关的历史文化遗存。', enDesc: 'A key starting point and hub of the Maritime Silk Road.' }
    ],
    intangibleHeritage: [
      { name: '福州脱胎漆器', enName: 'Bodiless Lacquerware', year: '2006-05列入', enYear: 'Listed 2006-05', desc: '与北京景泰蓝、江西景德镇瓷器并称中国工艺“三宝”，其质地轻巧坚固，色彩瑰丽，装饰技法丰富。', enDesc: 'One of China\'s "Three Treasures," famous for its lightness and brilliant colors.', imageUrl: 'https://images.unsplash.com/photo-1616422285623-aa30eb07096a?w=400&q=80' }
    ],
    transportation: [
      { iconName: 'Plane', title: '飞机', enTitle: 'Flight', desc: '福州长乐国际机场是重要的国际航空枢纽。', enDesc: 'Changle International Airport is a major international hub.', price: '机场巴士可直达市区，票价约为30元。', enPrice: 'Airport bus costs about 30 RMB.' },
      { iconName: 'Train', title: '高铁', enTitle: 'HSR', desc: '福州拥有福州站和福州南站两个枢纽。', enDesc: 'Fuzhou has two major hubs: Fuzhou and Fuzhou South.', price: '通达全国多个城市。', enPrice: 'Connected to major cities across China.' }
    ],
    food: [
      { name: '佛跳墙', enName: 'Buddha Jumps Over the Wall', pinyin: 'Fó tiào qiáng', price: '¥200-500/人', desc: '闽菜之王，用多种珍贵海鲜煨制而成，香浓诱人。', enDesc: 'The "King of Min Cuisine," a rich soup with premium seafood.', ingredients: '鲍鱼、海参、鱼翅、瑶柱、花胶等。', enIngredients: 'Abalone, sea cucumber, scallops, etc.', imageIdx: 20 },
      { name: '福州鱼丸', enName: 'Fuzhou Fish Balls', pinyin: 'Fúzhōu yúwán', price: '¥10-20/份', desc: '以色泽洁白、质韧滑爽、汤汁鲜美闻名。', enDesc: 'White, elastic fish balls with juicy meat filling.', ingredients: '鳗鱼肉、鲨鱼肉、猪肉馅。', enIngredients: 'Fish meat (eel/shark) and minced pork filling.', imageIdx: 21 }
    ]
  },
  harbin: {
    id: 'harbin',
    name: '哈尔滨',
    enName: 'Harbin',
    heroImage: 'https://images.unsplash.com/photo-1547636737-124b89e3bbcb?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '144小时过境免签', enText: '144h Visa-Free', color: 'green' },
      { text: '冰城', enText: 'Ice City', color: 'blue' },
      { text: '东方莫斯科', enText: 'Moscow of the East', color: 'amber' }
    ],
    paragraphs: [
      '哈尔滨市（Harbin City），简称“哈”，别称冰城、东方莫斯科、东方小巴黎。作为黑龙江省的省会、中国东北地区重要的中心城市，哈尔滨不仅是国家历史文化名城，更是中国最重要的冰雪旅游中心。它以独树一帜的欧陆风情和极具震撼力的冰雪艺术，在世界旅游版图中占据着璀璨的一角。',
      '哈尔滨地处中国东北平原东北部、松花江中游，是连接欧亚大陆桥的重要枢纽。这里属于中温带大陆性季风气候，夏季凉爽宜人，是理想的避暑胜地；而冬季则漫长而寒冷，银装素裹。松花江穿城而过，不仅为这座城市提供了丰富的水源，更在冬季化身为巨大的天然冰场，孕育了哈尔滨延续百年的冰雪情缘。',
      '作为一座有着百年历史的开放城市，哈尔滨的建筑风格融合了中欧、俄式以及装饰艺术风格。漫步在中央大街的水磨石地面上，仿佛置身于欧洲。而圣索菲亚大教堂那巨大的洋葱头圆顶，更是成为了这座城市的永恒地标。这些建筑无声地诉说着20世纪初哈尔滨作为远东国际商贸中心和多元文化交融之地的辉煌往事。',
      '哈尔滨的魅力还体现在其独特的生活方式上。这里是中国的音乐之城，具有浓厚的艺术氛围。而哈尔滨红肠、大列巴、马迭尔冰棍等地道特产，则诉说着中俄文化交融的历史印记。这种豪迈、热情且富有情调的城市性格，使其在寒冬中也散发着温暖且迷人的气息。',
      '今天的哈尔滨，正以前所未有的热度拥抱未来。从声名远扬的冰雪大世界到日益完善的现代化都市配套，哈尔滨在守护工业文明与冰雪遗产的同时，正加速建设成为国际冰雪旅游度假胜地。在冰天雪地中，它正向世界展示着一种充满生命力与浪漫色彩的现代化画卷。'
    ],
    enParagraphs: [
      'Harbin, the capital of Heilongjiang Province, is famously known as the "Ice City" and the "Moscow of the East." As a major hub in Northeast China and a National Historical and Cultural City, Harbin stands at the global forefront of ice and snow tourism, blending distinctive European architecture with breathtaking winter artistry.',
      'Located in the northeastern part of the North China Plain along the Songhua River, Harbin serves as a vital link on the Eurasian Land Bridge. It features a continental monsoon climate, offering cool, pleasant summers perfect for escapes from the heat, and long, snowy winters that transform the landscape into a silver wonderland.',
      'The city\'s unique architectural landscape reflects a century of openness, blending Central European, Russian, and Art Deco styles. Walking along the cobblestones of Central Street or standing before the majestic Saint Sophia Cathedral, one feels transported to an era when Harbin was a thriving international trade center in the Far East.',
      'Harbin’s charm is deeply rooted in its lifestyle—it is China\'s first "City of Music" recognized by the UN. Its culinary scene, featuring local specialties like Red Sausage and Madier Popsicles, showcases a fascinating fusion of Chinese and Russian cultures, creating a bold, hospitable, and romantic urban character.',
      'Today, Harbin is revitalizing its historical roots for a modern audience. From the spectacular Ice and Snow World to its growing high-tech industries, the city is evolving into a world-class winter destination, demonstrating a vibrant and romantic vision of modernization amidst its legendary sub-zero temperatures.'
    ],
    stats: { wantToVisit: 82, recommended: 10 },
    info: { area: '53K km²', population: '9.4M' },
    bestTravelTime: {
      strongText: '每年的12月至次年2月',
      enStrongText: 'December to February',
      paragraphs: [
        '这是哈尔滨最迷人的季节，冰雪大世界在此期间开放，您可以欣赏到最壮丽的冰雕和雪雕。',
        '应准备足够的保暖衣物以应对极寒天气；此外，夏季的7月至8月也是理想的避暑时间。'
      ],
      enParagraphs: [
        'The most magical time as the Ice and Snow World opens with its spectacular sculptures.',
        'Proper winter gear is essential for the extreme cold. July and August are also great for escaping heat.'
      ]
    },
    history: [
      { year: '1898年', enYear: '1898 AD', title: '建城之始', enTitle: 'City Establishment', desc: '随着中东铁路的修建，哈尔滨由一个小渔村迅速崛起为国际商贸大都市。', enDesc: 'With the construction of the railway, Harbin rose from a fishing village to a major hub.' },
      { year: '1946年', enYear: '1946 AD', title: '第一个解放的省会', enTitle: 'First Liberated Capital', desc: '哈尔滨正式解放，成为中国第一个回到人民手中的大城市，并曾作为新中国的临时重要阵地。', enDesc: 'Harbin became the first major city in China to be liberated.' },
      { year: '2010年', enYear: '2010 AD', title: '音乐之城', enTitle: 'City of Music', desc: '被联合国授予“音乐之城”称号，肯定了其悠久的音乐传统和深厚的古典文化底蕴。', enDesc: 'Awarded the title of "City of Music" by the UN, recognizing its cultural heritage.' }
    ],
    attractions: [
      { name: '哈尔滨冰雪大世界', enName: 'Harbin Ice and Snow World', desc: '感受全球最大规模的冰雪乐园带来的震撼体验，欣赏巧夺天工的冰雕建筑。', enDesc: 'Experience the world\'s largest ice and snow theme park.', price: '约300-330元', enPrice: '300-330 RMB', season: '冬季', enSeason: 'Winter', time: '4-5小时', enTime: '4-5h', rating: 'AAAAA' },
      { name: '圣索菲亚大教堂', enName: 'Saint Sophia Cathedral', desc: '在这座远东地区最大的东正教堂前，感受拜占庭式建筑的宏伟与静谧。', enDesc: 'The largest Orthodox cathedral in the Far East.', price: '20元(入内)', enPrice: '20 RMB (Entry)', season: '全年', enSeason: 'All year', time: '1小时', enTime: '1h', rating: 'AAAA' },
      { name: '中央大街', enName: 'Central Street', desc: '漫步百年老街，品尝马迭尔冰棍，鉴赏各种风格的西式建筑。', enDesc: 'Stroll along the century-old street and admire Western-style architecture.', price: '免费', enPrice: 'Free', season: '全年', enSeason: 'All year', time: '2-3小时', enTime: '2-3h' }
    ],
    transportation: [
      { iconName: 'Plane', title: '飞机', enTitle: 'Flight', desc: '哈尔滨太平国际机场是东北地区重要的门户机场。', enDesc: 'Taiping International Airport is a major portal airport.', price: '机场大巴覆盖市区主要区域，票价约为20元。', enPrice: 'Airport bus costs about 20 RMB.' },
      { iconName: 'Train', title: '高铁/火车', enTitle: 'High-speed Rail/Train', desc: '哈尔滨西站、哈尔滨站和东站构成了完善的铁路交通网络。', enDesc: 'Comprehensive rail network through Harbin West and Harbin stations.', price: '高铁班次密集，通达全国各大中心城市。', enPrice: 'Efficient HSR connections to major cities.' }
    ],
    food: [
      { name: '哈尔滨红肠', enName: 'Harbin Red Sausage', pinyin: 'Hǎérbīn hóngcháng', price: '¥30-50/斤', desc: '最具代表性的名产，具有浓郁的烟熏和蒜香味。', enDesc: 'Iconic smoked sausage with a distinct garlic flavor.', ingredients: '优质猪肉或牛肉、大蒜、天然香料、橡木红火烤。', enIngredients: 'Quality meat, garlic, and special spices.', imageIdx: 30 },
      { name: '锅包肉', enName: 'Guobaorou', pinyin: 'Guōbāoròu', price: '¥40-60/份', desc: '哈尔滨特色美食，外脆里嫩，酸甜适口，色泽金黄。', enDesc: 'Classic sweet and sour crispy pork.', ingredients: '里脊肉、淀粉、糖醋汁。', enIngredients: 'Pork tenderloin, starch, sweet & sour sauce.', imageIdx: 31 }
    ]
  },
  shenyang: {
    id: 'shenyang',
    name: '沈阳',
    enName: 'Shenyang',
    heroImage: 'https://images.unsplash.com/photo-1547285141-860cd4659b85?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '一朝发祥地', enText: 'Birthplace of a Dynasty', color: 'amber' },
      { text: '两代帝王都', enText: 'Capital of Two Emperors', color: 'orange' },
      { text: '共和国长子', enText: 'Eldest Son of the Republic', color: 'blue' }
    ],
    paragraphs: [
      '沈阳市（Shenyang City），简称“沈”，别称盛京、奉天。作为辽宁省的省会、东北地区重要的中心城市，沈阳素有“一朝发祥地，两代帝王都”之称。它曾是清朝入关前的都城，又是新中国成立初期的重要工业基地，被誉为“共和国长子”。皇城气象与工业硬核，共同构成了这座东北重镇厚实的底色。',
      '沈阳地处辽宁省中部平原，浑河穿城而过。这里地势平坦，土质肥沃，曾为工业与农业的发展提供了优越条件。沈阳属于温带半湿润大陆性季风气候，四季分明，冬季寒冷干燥，夏季温和多雨。这种鲜明的气候特征，也造就了当地人豪爽、乐观且坚韧的性格。',
      '沈阳的城市灵魂，一半浸透在历史的厚重之中。沈阳故宫作为中国仅存的两大古代皇宫建筑群之一，以其鲜明的满族特色和皇家气质，成为了世界文化遗产。而昭陵、福陵则见证了大清开国的风云，九一八历史博物馆则铭刻着中国近代史的一个重要转折点。',
      '沈阳是典型的东北文化代表。这里的人们性格直率、好客且富有幽默感。这种饮食文化同样粗犷——寒冬里一锅热腾腾的酸菜氽白肉，或是夏夜里的烧烤加冰啤，是当地生活最生动的写照。而在工业文明的熏陶下，沈阳又展现出一种工业美学与现代科技结合的独特魅力。',
      '作为“共和国长子”，沈阳曾是中国最重要的重工业基地之一。今天，在经历了转型的阵痛后，这座城市正焕发出新的活力。从宝马工厂的现代化生产线到日益兴起的科创产业，沈阳在守护工业遗产的同时，正加速建设成为国际化、现代化的国家中心城市，让老工业基地焕发出时代的华彩。'
    ],
    enParagraphs: [
      'Shenyang, known historically as "Shengjing" or "Fengtian," is the capital of Liaoning Province and a pivotal hub in Northeast China. As the "Birthplace of a Dynasty and Capital of Two Emperors," it served as the early capital of the Qing Dynasty and later became the "Eldest Son of the Republic" for its critical role in China\'s early industrial growth.',
      'Located in the central Liaoning Plain along the Hun River, Shenyang features a temperate continental monsoon climate with distinct seasons. The city\'s flat terrain and fertile soil shaped its identity as both an agricultural heartland and an industrial powerhouse, fostering a local character that is famously straightforward, optimistic, and resilient.',
      'The soul of Shenyang is deeply embedded in its imperial history. The Shenyang Palace Museum, one of China\'s two surviving imperial palace complexes, is a UNESCO World Heritage site rich in Manchu cultural heritage. Meanwhile, the Zhao and Fu Mausoleums and the 9.18 Historical Museum stand as silent witnesses to the transformative events of Chinese history.',
      'Shenyang is a vibrant heart of Northeast Chinese culture. Life here is defined by hospitality, humor, and a bold culinary tradition—from steaming pots of sauerkraut and pork in winter to lively summer nights of BBQ and beer. The city also possesses a unique industrial aesthetic, reflecting its history as a pillar of national manufacturing.',
      'Today, the "Eldest Son of the Republic" is thriving through a modern transformation. By integrating its rich industrial heritage with high-end manufacturing like the BMW plant and emerging tech sectors, Shenyang is revitalizing itself into a dynamic international center, proving that its historic industrial soul is ready for a high-tech future.'
    ],
    stats: { wantToVisit: 76, recommended: 12 },
    info: { area: '12.9K km²', population: '9.2M' },
    bestTravelTime: {
      strongText: '春季的5月至6月 和 秋季的9月至10月',
      enStrongText: 'May to June (Spring) and September to October (Autumn)',
      paragraphs: [
        '春末夏初，沈阳天气温和，适合游览各类历史古迹和公园。',
        '秋季，天高气爽，气候宜人，是欣赏城市风光和体验东北秋色的绝佳时机。',
        '尽量避开冬季的极寒与夏季的酷暑，以获得更舒适的旅行体验。'
      ],
      enParagraphs: [
        'Late spring and early summer offer mild weather, ideal for exploring historical sites and parks.',
        'In autumn, the air is crisp and pleasant—perfect for enjoying the city scenery and autumn colors of the Northeast.',
        'Avoiding the extreme cold of winter and the peak heat of summer is recommended for a better experience.'
      ]
    },
    history: [
      { year: '公元1625年', enYear: '1625 AD', title: '盛京建都', enTitle: 'Establishment of Shengjing', desc: '努尔哈赤将都城迁至沈阳并更名“盛京”，确立了沈阳作为清朝发源地核心的地位。', enDesc: 'Nurhaci moved the capital to Shenyang, establishing it as the heart of the early Qing Dynasty.' },
      { year: '1931年', enYear: '1931 AD', title: '九一八事变', enTitle: 'September 18th Incident', desc: '日本在此发动“九一八事变”，成为中国人民抗日战争的起点。', enDesc: 'The start of the War of Resistance against Japanese Aggression occurred here.' },
      { year: '1950年代', enYear: '1950s', title: '共和国长子', enTitle: 'Eldest Son of the Republic', desc: '在“一五”计划期间，沈阳成为国家重工业核心，奠定了中国现代工业的基础。', enDesc: 'Shenyang became the core of heavy industry during the first Five-Year Plan.' }
    ],
    attractions: [
      { name: '沈阳故宫博物院', enName: 'Shenyang Palace Museum', desc: '清朝入关前的皇宫，中国仅存的两座完整皇宫建筑群之一。', enDesc: 'The imperial palace before the Qing entered the pass.', price: '50元', enPrice: '50 RMB', season: '全年', enSeason: 'All year', time: '2-3小时', enTime: '2-3h', rating: 'AAAAA' },
      { name: '张氏帅府博物馆', enName: 'Marshal Zhang\'s Mansion', desc: '探访“东北王”张作霖与爱国将领张学良父子的私宅与官邸。', enDesc: 'The residence of Zhang Zuolin and Zhang Xueliang.', price: '60元(联票)', enPrice: '60 RMB (Combo)', season: '全年', enSeason: 'All year', time: '2-3小时', enTime: '2-3h', rating: 'AAAA' }
    ],
    transportation: [
      { iconName: 'Plane', title: '飞机', enTitle: 'Flight', desc: '沈阳桃仙国际机场是重要的交通枢纽。', enDesc: 'Taoxian International Airport is a major regional hub.', price: '机场大巴约17元。', enPrice: 'Airport bus ~17 RMB.' },
      { iconName: 'Train', title: '高铁/火车', enTitle: 'High-speed Rail/Train', desc: '沈阳北站、沈阳站是重要的铁路枢纽。', enDesc: 'Major rail hubs including Shenyang North and Shenyang Station.', price: '高铁通达全国大中城市。', enPrice: 'Extensive HSR connections.' }
    ],
    food: [
      { name: '老边饺子', enName: 'Laobian Dumplings', pinyin: 'Lǎobiān jiǎozi', price: '¥30-50/人', desc: '沈阳最具代表性的名片，馅料鲜美，工艺独特。', enDesc: 'The most iconic dish in Shenyang, known for its unique fillings.', ingredients: '猪肉、各种肉类、秘制调料、面粉。', enIngredients: 'Pork, various meats, special sauce, flour.', imageIdx: 60 }
    ]
  },
  ningbo: {
    id: 'ningbo',
    name: '宁波',
    enName: 'Ningbo',
    heroImage: 'https://images.unsplash.com/photo-1549480112-c28892ca8a27?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '144小时过境免签', enText: '144h Visa-Free', color: 'green' },
      { text: '海丝枢纽', enText: 'Silk Road Hub', color: 'blue' },
      { text: '院士之乡', enText: 'Home of Academicians', color: 'amber' }
    ],
    paragraphs: [
      '宁波市（Ningbo City），简称“甬”，别称甬城。作为浙江省的副省级城市、计划单列市，宁波是中国东南沿海重要的港口城市和国家历史文化名城。它不仅拥有7000年的河姆渡文化底蕴，更是“海上丝绸之路”的重要起点之一。这种书卷气与海洋气息的交融，构成了宁波独特且厚重的城市底色。',
      '宁波地处东海之滨、宁绍平原东部，境内江河纵横，拥有漫长的海岸线和众多的岛屿。这里属于亚热带季风气候，四季分明，雨量充沛。作为大运河的南端出海口，宁波自古以来便是连接内陆与海外的核心枢纽。这种得天独厚的地理环境，也造就了宁波人务实、开明且富有开拓精神的性格特征。',
      '宁波的魅力，在于其深厚的藏书文化与宏大的海洋气魄的互补。您可以步入“南国书城”天一阁，在摩挲古籍中感受中国现存最古老私家藏书楼的文脉沉淀；也可以漫步在三江口的老外滩，在欧式建筑与江风中品味近代开埠的沧桑史。而宁波博物馆那极具张力的瓦爿墙建筑，则向世界展示着这座城市对历史记忆的现代重塑。',
      '作为享誉世界的“宁波帮”故里，宁波自近代以来便以工商业发达而著称。不仅培育了众多的实业巨子，更是中国的“院士之乡”。这种重教、崇文且善经商的文化基因，让宁波在追求经济高速增长的同时，始终保持着深厚的人文关怀。饮食上，宁波汤圆的软糯香甜与红膏炝蟹的鲜美咸鲜，则是东海之滨最令人难忘的味觉记忆。',
      '今天的宁波，正加速建设现代化滨海大都市。作为全球货物吞吐量最大的港口——宁波舟山港的所在地，宁波在守护蓝天碧海与历史遗址的同时，正深度融入全球贸易版图。在东海之滨，它正向世界展示着一种融合了古典温婉与科技繁华的现代化新图景。'
    ],
    enParagraphs: [
      'Ningbo, historically known as "Yong," is a pivotal coastal city in Zhejiang Province and a National Historical and Cultural City. Home to the 7,000-year-old Hemudu Culture and a key gateway of the Maritime Silk Road, Ningbo blends a deep scholarly tradition with a bold maritime spirit, making it an essential political and economic hub in Southeast China.',
      'Located on the East China Sea coast at the end of the Grand Canal, Ningbo enjoys a subtropical monsoon climate with distinct seasons. Its extensive coastline and strategic "Three Rivers Confluence" (Sanjiangkou) have made it a vital link between inland China and the world for millennia, fostering a local character that is famously pragmatic, open-minded, and pioneering.',
      'The soul of Ningbo thrives on the synergy between its ancient library culture and its grand marine outlook. The Tianyi Pavilion, the oldest private library in China, preserves the city\'s scholarly lineage, while the Old Bund, with its unique blend of European architecture, tells the story of modern openness. The Ningbo Museum, with its iconic repurposed masonry walls, reimagines this historic memory for a modern world.',
      'Known as the cradle of the "Ningbo Group" (influential Ningbo entrepreneurs) and the "Home of Academicians," the city boasts a long history of excellence in both commerce and academia. This culture of valuing education while excelling in industry has produced world-renowned figures. Culturally, the city is defined by its delicate flavors, from the sweet, smooth Ningbo Rice Balls to the savory raw mud crabs, reflecting its rich coastal heritage.',
      'Today, Ningbo is evolving into a world-class modern coastal metropolis. As the site of the Ningbo-Zhoushan Port—the world\'s busiest by cargo tonnage—the city is accelerating its global integration while protecting its historical and marine environments. On the shores of the East China Sea, it presents a dynamic vision of a future where tradition and high-tech prosperity coexist in harmony.'
    ],
    stats: { wantToVisit: 62, recommended: 6 },
    info: { area: '9.8K km²', population: '9.6M' },
    bestTravelTime: {
      strongText: '春季的4月至5月 和 秋季的9月至10月',
      enStrongText: 'April to May (Spring) and September to October (Autumn)',
      paragraphs: [
        '春天的宁波海风柔和，是游览东钱湖和溪口风景区的最佳时间。',
        '秋季，天高气爽，阳光明媚，是品尝东海海鲜、领略滨海城市魅力的黄金时期。',
        '此外，元宵节期间去城隍庙体验地道的宁波汤圆文化也非常应景。'
      ],
      enParagraphs: [
        'Spring offers gentle sea breezes, perfect for exploring Dongqian Lake and the Xikou scenic area.',
        'Autumn brings clear skies and pleasant weather—ideal for savoring East China Sea seafood and the city\'s coastal charm.',
        'Visiting during the Lantern Festival to experience the local rice ball tradition in the City God Temple is also a great choice.'
      ]
    },
    history: [
      { year: '约7000年前', enYear: '7,000 years ago', title: '河姆渡文化', enTitle: 'Hemudu Culture', desc: '河姆渡遗址的发现，证明了这里是长江流域乃至人类水稻种植的最早发源地之一。', enDesc: 'One of the earliest cradles of rice cultivation in the Yangtze River basin.' },
      { year: '公元1561年', enYear: '1561 AD', title: '天一阁建阁', enTitle: 'Tianyi Pavilion Built', desc: '范钦创建天一阁，开启了中国现存最早私家藏书楼的历史，奠定了宁波的藏书文化根基。', enDesc: 'Fan Qin built the oldest surviving private library in China, grounding the city\'s culture.' },
      { year: '1844年', enYear: '1844 AD', title: '开埠通商', enTitle: 'Opening of Port', desc: '作为近代著名通商口岸开埠，宁波老外滩见证了中外商贸与文化的深度融合。', enDesc: 'Ningbo opened as a major treaty port, seeing deep cultural and commercial integration.' }
    ],
    attractions: [
      { name: '天一阁博物院', enName: 'Tianyi Pavilion Museum', desc: '中国现存最古老的私家藏书楼，感受其间散发的宁静书卷气与园林之美。', enDesc: 'China\'s oldest private library, famous for its scholarly and garden beauty.', price: '30元', enPrice: '30 RMB', season: '全年', enSeason: 'All year', time: '1-2小时', enTime: '1-2h', rating: 'AAAAA' },
      { name: '宁波博物馆', enName: 'Ningbo Museum', desc: '王澍设计的标志性建筑，通过其独特的墙面艺术展现宁波的历史底蕴。', enDesc: 'An architectural masterpiece by Wang Shu showcasing regional history.', price: '免费(需预约)', enPrice: 'Free (Reservation required)', season: '全年', enSeason: 'All year', time: '2-3小时', enTime: '2-3h', rating: '国家一级博物馆' }
    ],
    transportation: [
      { iconName: 'Ship', title: '轮渡/港口', enTitle: 'Ferry/Port', desc: '宁波是国际级港口枢纽，拥有成熟的滨海和内河航运网络。', enDesc: 'A world-class hub with advanced sea and river transport networks.', price: '客运航线丰富。', enPrice: 'Wide variety of passenger routes.' },
      { iconName: 'Train', title: '高铁', enTitle: 'HSR', desc: '宁波站是华东地区重要的铁路枢纽，连接杭甬、甬台温等干线。', enDesc: 'A key rail hub in East China connecting major coastal lines.', price: '班次密集，通达各大核心城市。', enPrice: 'High-frequency connections to major cities.' }
    ],
    food: [
      { name: '宁波汤圆', enName: 'Ningbo Rice Balls', pinyin: 'Níngbō tāngyuán', price: '¥10-20/份', desc: '宁波饮食最具代表性的名片，白如羊脂，软糯香甜。', enDesc: 'The most iconic Ningbo dish, famous for its smoothness and sweetness.', ingredients: '糯米、黑芝麻、猪油、白糖。', enIngredients: 'Sticky rice, black sesame, lard, sugar.', imageIdx: 87 },
      { name: '红膏炝蟹', enName: 'Red Roe Pickled Crab', pinyin: 'Hónggāo qiàngxiè', price: '¥100-200/份', desc: '地道的宁波咸鲜味，选材考究，色泽红亮，鲜美适口。', enDesc: 'Authentic Ningbo salty and fresh flavor with brilliant red roe.', ingredients: '梭子蟹、盐、白酒、香料。', enIngredients: 'Swimming crab, salt, wine, spices.', imageIdx: 88 }
    ]
  },
  wuhan: {
    id: 'wuhan',
    name: '武汉',
    enName: 'Wuhan',
    heroImage: 'https://images.unsplash.com/photo-1552093557-0a911eb33c2a?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '144小时过境免签', enText: '144h Visa-Free', color: 'green' },
      { text: '江城', enText: 'River City', color: 'blue' },
      { text: '九省通衢', enText: 'Thoroughfare of Nine Provinces', color: 'amber' }
    ],
    paragraphs: [
      '武汉市（Wuhan City），简称“汉”，别称江城，是湖北省的省会、中部地区唯一的副省级城市。长江及其最大支流汉江在此交汇，将武汉一分为三，形成了武昌、汉口、汉阳三镇隔江鼎立的格局。作为“九省通衢”的陆路与水路枢纽，武汉在华夏大地的版图核心，散发着独特的英雄气概与江湖市井的魅力。',
      '武汉地处江汉平原东部，境内江河纵横、湖泊密布，水域面积占全市总面积的四分之一。这里属于亚热带季风性湿润气候，四季分明，雨量充沛。浩瀚的长江与东湖等百余座大小湖泊，赋予了武汉灵动的生命力，使其成为一座名副其实的“湿地之城”和“百湖之市”。',
      '武汉的魅力，在于其磅礴的江湖气与浓郁的烟火气息的交织。您可以登上“天下江山第一楼”黄鹤楼，在崔颢、李白的诗意中俯瞰滚滚长江东逝水；也可以在晨曦中走进吉庆街或粮道街，在喧嚣的“过早”声中，用一碗地道的热干面开启一天的生活。这种豪迈博大的气魄与热气腾腾的世井温情，构成了武汉最鲜活的城市容颜。',
      '作为近现代革命的摇篮，武汉见证了中国走向现代的多次重大历史抉择。从打响辛亥革命第一枪的武昌起义，到汉口租界区留下的历史印记，这里的每一寸土地都回响着历史的余音。武汉人性格直爽、泼辣且坚韧，这种“英雄城市”的基因，在历次时代的洗礼中都显得格外出彩。',
      '今天的武汉，正加速建设国家中心城市和具有开放色彩的国际化大都市。从光谷的科技创新高地到日益完善的内陆开放门户，武汉在守护英雄底色与大江大湖的同时，正以前所未有的速度迈向高质量发展。在长江之畔，它正向世界展示着一种气势恢宏且充满生机的现代化图景。'
    ],
    enParagraphs: [
      'Wuhan, the capital of Hubei Province, is uniquely known as the "River City" and the "Thoroughfare of Nine Provinces." Divided by the confluence of the Yangtze and Han Rivers into the three towns of Wuchang, Hankou, and Hanyang, Wuhan stands as a pivotal political, economic, and transportation hub in Central China, blending a heroic spirit with vibrant waterfront charm.',
      'Located in the eastern Jianghan Plain, Wuhan is a city defined by water, with interconnected rivers and over 160 lakes covering a quarter of its area. Its subtropical monsoon climate brings four distinct seasons, nurturing a "City of Hundreds of Lakes" that is now recognized globally as a vital ecological wetland metropolis.',
      'The soul of Wuhan lies in the dynamic interplay between its grand "River Culture" and its lively street life. One can look out over the roaring Yangtze from the legendary Yellow Crane Tower, or dive into the bustling energy of a morning "Guo Zao" (breakfast) ritual, where a simple bowl of Hot Dry Noodles embodies the city\'s warm and resilient heart.',
      'As a cradle of modern Chinese revolution, Wuhan witnessed the first shots of the 1911 Revolution that ended imperial rule. The historic buildings in the former foreign concessions and the monuments to the heroic defense of the city tell a story of a people known for being straightforward, spirited, and profoundly courageous in the face of history.',
      'Today, Wuhan is transforming into a global center for high-tech innovation and a strategic gateway for international inland trade. From the "Optics Valley" tech hub to its world-class bridges and transportation networks, the city is building a modern future while preserving its deep historical roots, showcasing a grand vision of growth along the banks of the mighty Yangtze.'
    ],
    stats: { wantToVisit: 85, recommended: 15 },
    info: { area: '8.6K km²', population: '13.7M' },
    bestTravelTime: {
      strongText: '春季的3月至4月 和 秋季的10月至11月',
      enStrongText: 'March to April (Spring) and October to November (Autumn)',
      paragraphs: [
        '春天的武汉是浪漫的，武大的樱花与东湖的红梅交相辉映，气候温和，非常适合赏花。',
        '秋季，天高气爽，阳光明媚，是游览蛇山、俯瞰江湖美景的黄金时期。',
        '应尽量避开夏季（7-8月）的酷暑，“火炉”之名并非虚传。'
      ],
      enParagraphs: [
        'Spring is the most romantic time, with cherry blossoms and plum blossoms in full bloom amidst mild temperatures.',
        'Autumn offers clear skies and mild sunshine, perfect for panoramic views of the rivers and mountains.',
        'Avoid the peak summer months (July-August) when Wuhan lives up to its reputation as one of China\'s "furnace" cities.'
      ]
    },
    history: [
      { year: '公元223年', enYear: '223 AD', title: '夏口筑城', enTitle: 'Construction of Xiakou', desc: '孙权在今武昌蛇山筑夏口城，作为军事要塞，标志着武汉核心区域城市史的开端。', enDesc: 'Sun Quan built Xiakou on Snake Hill as a military fortress, marking the city\'s early roots.' },
      { year: '1911年', enYear: '1911 AD', title: '辛亥首义', enTitle: '1911 Revolution', desc: '武昌起义爆发，成功推翻了统治中国两千多年的封建君主专制制度。', enDesc: 'Expectedly, the Wuchang Uprising ended the millennia-old imperial system of China.' },
      { year: '1927年', enYear: '1927 AD', title: '三镇合并', enTitle: 'Merger of Three Towns', desc: '武昌、汉口、汉阳正式合并，定名为“武汉”，确立了作为特大中心城市的地位。', enDesc: 'The three towns merged and were named "Wuhan," establishing its status as a major metropolis.' }
    ],
    attractions: [
      { name: '黄鹤楼', enName: 'Yellow Crane Tower', desc: '江南三大名楼之首，俯瞰长江与武汉三镇全景的绝佳观景地。', enDesc: 'One of China\'s Three Famous Towers, offering panoramic views of the Yangtze River.', price: '70元', enPrice: '70 RMB', season: '全年', enSeason: 'All year', time: '1-2小时', enTime: '1-2h', rating: 'AAAAA' },
      { name: '东湖生态旅游区', enName: 'East Lake Scenic Area', desc: '中国最大的城中湖之一，碧波万顷，风景秀丽，是武汉市民休闲的好去处。', enDesc: 'One of China\'s largest urban lakes with beautiful scenery and recreational facilities.', price: '免费', enPrice: 'Free', season: '全年', enSeason: 'All year', time: '2-3小时', enTime: '2-3h', rating: 'AAAAA' }
    ],
    transportation: [
      { iconName: 'Airplane', title: '飞机', enTitle: 'Airplane', desc: '武汉天河国际机场是中部地区最大的航空枢纽，通达国内外主要城市。', enDesc: 'Wuhan Tianhe International Airport is Central China\'s largest aviation hub.', price: '航班密集，覆盖全球主要城市。', enPrice: 'High-frequency flights worldwide.' },
      { iconName: 'Train', title: '高铁', enTitle: 'HSR', desc: '武汉站是全国重要的高铁枢纽，四通八达，是中国"米"字形高铁网络的中心。', enDesc: 'A major high-speed rail hub connecting all parts of China.', price: '至北京约4.5小时，至上海约3.5小时。', enPrice: '4.5h to Beijing, 3.5h to Shanghai.' }
    ],
    food: [
      { name: '热干面', enName: 'Hot Dry Noodles', pinyin: 'Règān miàn', price: '¥6-15/份', desc: '武汉过早的灵魂，筋道的面条拌上芝麻酱，香气扑鼻。', enDesc: 'The iconic Wuhan breakfast, noodles with sesame paste.', ingredients: '碱水面、芝麻酱、萝卜丁、葱花。', enIngredients: 'Alkaline noodles, sesame paste, radish, scallions.', imageIdx: 89 },
      { name: '武昌鱼', enName: 'Wuchang Fish', pinyin: 'Wǔchāng yú', price: '¥80-150/份', desc: '毛主席诗词中赞誉的名鱼，肉质细嫩，味道鲜美。', enDesc: 'Famous fish praised by Chairman Mao, tender and delicious.', ingredients: '武昌鱼、葱、姜、料酒。', enIngredients: 'Wuchang fish, scallions, ginger, wine.', imageIdx: 90 }
    ]
  },
  shangrao: {
    id: 'shangrao',
    name: '上饶',
    enName: 'Shangrao',
    heroImage: 'https://images.unsplash.com/photo-1549480112-c28892ca8a27?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '三清山', enText: 'Sanqingshan', color: 'emerald' },
      { text: '婺源', enText: 'Wuyuan', color: 'amber' },
      { text: '高铁枢纽', enText: 'HSR Hub', color: 'blue' }
    ],
    paragraphs: [
      '上饶市（Shangrao City），简称“饶”，古称信州。作为江西省下辖的地级市，上饶地处赣、浙、闽、皖四省交界处，素有“豫章第一门户”和“四省通衢”之称。这里不仅拥有绝美的自然山水，更孕育了深厚的人文底蕴，是一座将传统田园美学与现代化发展节奏完美融合的城市。',
      '上饶地处江西省东北部，北纬27度至29度之间，属于亚热带湿润季风气候，四季分明，雨量充沛。境内地形复杂多样，拥有世界自然遗产三清山、中国最美乡村婺源以及我国最大的淡水湖鄱阳湖的一部分。这种得天独厚的自然条件，让上饶成为中国最热门的生态旅游目的地之一。',
      '上饶的魅力，在于其绝美的自然风光与深郁的人文气息。三清山以其奇峰怪石和变幻莫测的云海，展现了“西太平洋边缘最美丽的花岗岩”景观。而步入婺源，白墙黛瓦的徽派建筑与漫山遍野的油菜花海交织，构成了一幅绝美的“中国画里的乡村”长卷。',
      '历史上的上饶，曾是理学大师朱熹的故里，也是辛弃疾晚年寓居之地。这种“文气”穿越时空，依然流淌在当地的血脉中。饮食上，上饶菜兼具赣菜的辣与徽菜的醇，弋阳年糕的软糯与铅山烫粉的鲜滑，都是当地最地道的味觉印记。',
      '今天的上饶，正利用其独特的地理优势加速崛起。作为华东地区重要的铁路枢纽，沪昆高铁与合福高铁在此交叉，使其成为连接长三角与珠三角的重要节点。在守护青山绿水的同时，上饶正以开放的姿态，向世界展示着赣江大地上一颗璀璨明珠的现代化魅力。'
    ],
    enParagraphs: [
      'Shangrao, historically known as Xinzhou, is a pivotal city in Jiangxi Province located at the junction of Jiangxi, Zhejiang, Fujian, and Anhui. Often referred to as the "First Gateway to Yuzhang," Shangrao is a land of stunning natural landscapes and profound cultural depth, where ancient pastoral beauty meets the dynamic rhythm of modern development.',
      'Located in northeastern Jiangxi, Shangrao enjoys a subtropical humid monsoon climate with distinct seasons. The terrain is exceptionally diverse, home to the UNESCO World Heritage site Mount Sanqing, the picturesque villages of Wuyuan—widely known as "China\'s most beautiful countryside"—and a portion of Poyang Lake, China\'s largest freshwater lake.',
      'The soul of Shangrao lies in its breathtaking granite peaks and its poetic rural soul. Mount Sanqing offers an unparalleled display of granite pillars and clouds, while Wuyuan showcases the ultimate Huizhou architectural elegance amidst golden rapeseed blossoms, creating a living "village in a Chinese painting."',
      'Historically, Shangrao was the home of Neo-Confucian master Zhu Xi and a retreat for the legendary poet Xin Qiji. This scholarly atmosphere continues to influence the local culture today. Its cuisine, a savory blend of Jiangxi and Huizhou influences, is defined by local favorites like the chewy Yiyang Rice Cakes and the fresh Yanshan Tang noodles.',
      'Today, Shangrao is rapidly rising as a major high-speed rail hub in East China, ideally positioned to connect the Yangtze River Delta and Pearl River Delta regions. While fiercely protecting its lush environment, the "Pearl of Jiangxi" is actively building its modern industry and tourism, presenting a vision of sustainable and culturally rich development.'
    ],
    stats: { wantToVisit: 65, recommended: 8 },
    info: { area: '22.8K km²', population: '6.5M' },
    bestTravelTime: {
      strongText: '春季的3月至4月 和 秋季的10月至11月',
      enStrongText: 'March to April (Spring) and October to November (Autumn)',
      paragraphs: [
        '春天的上饶是色彩最斑斓的，婺源的油菜花漫山遍野，气候湿润舒适。',
        '秋季是观赏“篁岭晒秋”的最佳季节，五彩斑斓的农作物晾晒在阳光下，构成绝美的民俗景观。',
        '三清山则建议在5-6月左右，避开雨季，观赏概率更高的云海。'
      ],
      enParagraphs: [
        'Spring is the most colorful season, as Wuyuan is carpeted in golden rapeseed blossoms amidst fresh, humid air.',
        'Autumn is perfect for seeing the famous "Shaiqiu" custom in Huangling, where crops are sun-dried into a vibrant mosaic.',
        'May and June are recommended for Mount Sanqing to avoid the rainy season and enjoy the best views of the cloud ocean.'
      ]
    },
    history: [
      { year: '公元196年', enYear: '196 AD', title: '建安析置', enTitle: 'Establishment of Poyang', desc: '东汉建安初年，析豫章郡地置鄱阳郡，为上饶行政建置之始。', enDesc: 'Poyang Prefecture was established in the early Han, marking the start of Shangrao\'s administration.' },
      { year: '1131-1207年', enYear: '1131-1207 AD', title: '人杰地灵', enTitle: 'Cultural Prosperity', desc: '朱熹、陆九渊等大儒曾在此寓居讲学，留下了深厚的理学文化遗迹。', enDesc: 'Great scholars like Zhu Xi taught here, leaving a deep legacy of Neo-Confucianism.' },
      { year: '2008年', enYear: '2008 AD', title: '申遗成功', enTitle: 'World Heritage Listing', desc: '三清山被列入《世界遗产名录》，标志着上饶旅游资源得到国际最高规格认可。', enDesc: 'Mount Sanqing was listed as a UNESCO World Heritage site.' }
    ],
    attractions: [
      { name: '三清山风景名胜区', enName: 'Mount Sanqing Scenic Area', desc: '欣赏“西太平洋边缘最美丽的花岗岩”，感受世界自然遗产的仙风道骨。', enDesc: 'Admire the most beautiful granite landscape on the West Pacific border.', price: '120元', enPrice: '120 RMB', season: '全年', enSeason: 'All year', time: '1-2天', enTime: '1-2 days', rating: 'AAAAA' },
      { name: '婺源江湾景区', enName: 'Wuyuan Jiangwan Scenic Area', desc: '探访千年古村落，在徽派建筑与漫山花海中感受田园诗意。', enDesc: 'Visit an ancient village amidst Huizhou architecture and flowers.', price: '景区通票', enPrice: 'Ticket Pass', season: '春节', enSeason: 'Spring', time: '3-5小时', enTime: '3-5h', rating: 'AAAAA' }
    ],
    intangibleHeritage: [
      { name: '弋阳腔', enName: 'Yiyang Opera', year: '2006-05列入', enYear: 'Listed 2006-05', desc: '中国古代戏曲声腔之一，起源于江西弋阳，具有极高的历史和艺术价值。', enDesc: 'One of China\'s ancient opera styles originating in Yiyang.', imageUrl: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?w=400&q=80' }
    ],
    transportation: [
      { iconName: 'Train', title: '高铁', enTitle: 'HSR', desc: '上饶站是首座垂直交叉骑跨式高铁枢纽站，连接沪昆、合福高铁。', enDesc: 'The first vertical-crossing HSR station, a major regional hub.', price: '出行极度便捷。', enPrice: 'Extremely convenient transport.' }
    ],
    food: [
      { name: '弋阳年糕', enName: 'Yiyang Rice Cakes', pinyin: 'Yìyáng niángāo', price: '¥10-20/斤', desc: '以“白如霜、韧如玉”著称，久煮不糊。', enDesc: 'Famous for being as white as frost and tough as jade.', ingredients: '大禾谷、优质水源。', enIngredients: 'Quality rice and water.', imageIdx: 81 },
      { name: '铅山烫粉', enName: 'Yanshan Tangfen', pinyin: 'Yánshān tàngfěn', price: '¥8-15/碗', desc: '上饶最具代表性的早餐，爽滑可口。', enDesc: 'The most iconic breakfast in Shangrao.', ingredients: '大米、肉丝、雪里红。', enIngredients: 'Rice noodles, pork, pickles.', imageIdx: 82 }
    ]
  },
  zhengzhou: {
    id: 'zhengzhou',
    name: '郑州',
    enName: 'Zhengzhou',
    heroImage: 'https://images.unsplash.com/photo-1549480112-9c17e33555ae?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '商都', enText: 'Shang Capital', color: 'amber' },
      { text: '铁路心脏', enText: 'Railway Heart', color: 'blue' },
      { text: '144小时过境免签', enText: '144h Visa-Free', color: 'green' }
    ],
    paragraphs: [
      '郑州市（Zhengzhou City），简称“郑”，古称商都。作为河南省的省会、国家中心城市，郑州地处华夏文明腹地，拥有5300年的仰韶文化和3600年的商代文明遗迹。它是中国八大古都之一，也是“火车拉来的城市”，这种古老文明与现代交通脉动的完美结合，赋予了郑州独特且厚重的城市气场。',
      '郑州地处华北平原南部、黄河下游，背依耸翠嵩山，面朝浩瀚黄河。这里属于典型的暖温带大陆性季风气候，四季分明。作为中华民族的母亲河，黄河在郑州境内留下了壮丽的自然奇观和深厚的水利文化。这种壮阔的自然环境，也造就了中原儿女朴实、睿智且大气磅礴的性格底色。',
      '郑州的魅力，在于其恢弘的文明积淀与蓬勃的现代化脉动。您可以步入河南博物院，在贾湖骨笛与莲鹤方壶中穿越古今；也可以深入市中心，在有着3600年历史的商代都城遗址旁，感受历史与现实的共生。而这种底蕴的现代延伸，正通过“只有河南·戏剧幻城”等创新形式，向世人展示着黄河文化的灿烂与不朽。',
      '作为中国最重要的铁路枢纽和航空口岸之一，郑州素有“中国铁路心脏”之称。陇海、京广两大干线在此交汇，密集的航线连接着世界。这种极其便利的交通条件，让郑州成为了连接南北、沟通东西的战略要冲。而在饮食文化上，郑州烩面的醇香与胡辣汤的发散，则是中原大地最质朴且温暖的味觉标志。',
      '今天的郑州，正以前所未有的速度迈向现代化国际化大都市。作为“一带一路”上的重要节点，郑州正加速建设国家中心城市，在守护华夏根脉的同时，向世界展示着中原腹地一颗璀璨明珠的繁华与生机。在黄河之滨，它正焕发出一种自信、开放且充满活力的时代新姿。'
    ],
    enParagraphs: [
      'Zhengzhou, historically known as the Shang Capital, is the capital of Henan Province and a recognized National Central City of China. Located in the heartland of Huaxia civilization, it boasts over 5,300 years of history, including the ancient Shang Dynasty ruins. As one of China\'s Eight Ancient Capitals, it is also a city "brought by trains," blending ancient roots with the dynamic energy of a modern transport hub.',
      'Located in the southern North China Plain along the Yellow River, Zhengzhou is shielded by the majestic Mount Song to the west. It features a warm temperate continental monsoon climate with distinct seasons. The Yellow River, the mother river of the Chinese nation, has left behind grand natural wonders and deep cultural tapestries, shaping a local character that is famously honest, wise, and magnanimous.',
      'The soul of Zhengzhou resides in its vast historical artifacts and its rapid modernization. At the Henan Museum, one can marvel at world-class treasures like the Jiahu Bone Flute, while the 3,600-year-old Shang City walls stand as silent sentinels amidst the bustling modern streets. Today, this heritage is reimagined through creative projects like "Unique Henan-Land of Drama," showcasing a timeless Yellow River culture.',
      'Known as the "Railway Heart of China," Zhengzhou is where the Longhai and Jingguang lines cross, and its international airport serves as a critical global cargo hub. This strategic positioning makes it a vital bridge connecting East and West. Culturally, the city is defined by its warm flavors, from the rich Zhengzhou Stewed Noodles to the spicy and savory Hula Soup, reflecting the authentic heart of Central China.',
      'Today, Zhengzhou is surging towards becoming a globalized metropolis. As a key node on the "Belt and Road," it is building its future while preserving its millennia-old roots. On the shores of the Yellow River, it stands as a confident, open, and vibrant beacon of the Central China plains, ready to present its unique history and bright future to the world.'
    ],
    stats: { wantToVisit: 72, recommended: 9 },
    info: { area: '7.5K km²', population: '12.8M' },
    bestTravelTime: {
      strongText: '春季的3月至5月 和 秋季的9月至11月',
      enStrongText: 'March to May (Spring) and September to November (Autumn)',
      paragraphs: [
        '春天的郑州天气凉爽，是游览嵩山少林寺和河南博物院的理想时间。',
        '秋季，天高气爽，阳光明媚，是观赏黄河风景区和体验中原秋色的绝佳时机。',
        '冬季虽冷，但若能赶上一场雪，少林寺的雪景亦是如梦如幻。'
      ],
      enParagraphs: [
        'Spring offers cool weather, ideal for visiting the Shaolin Temple on Mount Song and the Henan Museum.',
        'Autumn brings clear skies and pleasant sun—perfect for the Yellow River Scenic Area and enjoying Central China\'s autumn hues.',
        'Winter is cold, but the sight of Shaolin Temple covered in snow is a truly ethereal experience if you catch a snowfall.'
      ]
    },
    history: [
      { year: '约公元前1600年', enYear: '1600 BC', title: '商代建都', enTitle: 'Shang Dynasty Capital', desc: '商王仲丁在此迁都，修筑了规模宏大的商代都城，是目前中国发现最早的都城之一。', enDesc: 'King Zhongding moved the capital here, building one of the oldest walled cities in China.' },
      { year: '1900年代', enYear: '1900s', title: '铁路交汇', enTitle: 'Railway Junction', desc: '随着卢汉铁路和汴洛铁路在此交汇，郑州由一个小县城迅速崛起为“火车拉来的城市”。', enDesc: 'With the crossing of major rail lines, Zhengzhou transformed from a small town into a major transport hub.' },
      { year: '1954年', enYear: '1954 AD', title: '迁省会于郑', enTitle: 'Becoming the Capital', desc: '河南省政府由开封迁往郑州，正式确立了其作为全省政治、经济和文化中心的地位。', enDesc: 'The provincial government moved from Kaifeng, establishing Zhengzhou as the new center.' }
    ],
    attractions: [
      { name: '河南博物院', enName: 'Henan Museum', desc: '探访九大镇院之宝，穿越五千余年华夏文明长河。', enDesc: 'Explore nine national treasures spanning 5,000 years of history.', price: '免费(需预约)', enPrice: 'Free (Reservation required)', season: '全年', enSeason: 'All year', time: '3-4小时', enTime: '3-4h', rating: '国家级博物馆' },
      { name: '少林寺', enName: 'Shaolin Temple', desc: '位于嵩山腹地，是禅宗祖庭和少林武术的发源地。', enDesc: 'The birthplace of Chan Buddhism and Shaolin Kung Fu.', price: '80元', enPrice: '80 RMB', season: '全年', enSeason: 'All year', time: '4-6小时', enTime: '4-6h', rating: 'AAAAA' }
    ],
    transportation: [
      { iconName: 'Train', title: '高铁', enTitle: 'HSR', desc: '郑州东站是全国最大的高铁站之一，拥有放射状的“米”字形高铁网。', enDesc: 'One of China\'s largest HSR stations with a unique "star" shaped network.', price: '通达全国各省会极其迅捷。', enPrice: 'Extremely fast access to major Chinese cities.' }
    ],
    food: [
      { name: '郑州烩面', enName: 'Zhengzhou Stewed Noodles', pinyin: 'Zhèngzhōu huìmiàn', price: '¥15-30/碗', desc: '中原饮食名片，面筋道，汤浓郁，荤、素、汤、菜聚而有之。', enDesc: 'The culinary icon of Central China with rich soup and chewy noodles.', ingredients: '面粉、羊肉汤、粉丝、木耳、黄花菜等。', enIngredients: 'Flour, mutton broth, glass noodles, mushrooms, etc.', imageIdx: 84 },
      { name: '胡辣汤', enName: 'Hula Soup', pinyin: 'Húlàtāng', price: '¥5-15/碗', desc: '河南人的经典早餐，糊状汤体，香辣适口，暖胃驱寒。', enDesc: 'Classic spicy breakfast soup that warms the stomach.', ingredients: '熟羊肉、面粉、木耳、面筋、香辛料等。', enIngredients: 'Meat, flour, mushrooms, and various spices.', imageIdx: 85 }
    ]
  },
  guilin: {
    id: 'guilin',
    name: '桂林',
    enName: 'Guilin',
    heroImage: 'https://images.unsplash.com/photo-1548680197-03316ae5cb3f?q=80&w=2670&auto=format&fit=crop',
    tags: [
      { text: '漓江', color: 'teal' },
      { text: '甲天下', color: 'emerald' }
    ],
    paragraphs: [
      '桂林山水是中国一张名片。'
    ],
    enParagraphs: [
      'Guilin scenery is iconic in China.'
    ],
    stats: { wantToVisit: 92, recommended: 9 },
    info: { area: '27.8K km²', population: '5.0M' },
    bestTravelTime: {
      strongText: '4-10月',
      paragraphs: ['漓江最美。'],
      enStrongText: 'April-October',
      enParagraphs: ['Peak Li River season.']
    },
    history: [
      { year: '1982年', title: '首批名城', desc: '获批历史文化名城。', enDesc: 'Designated national cultural city.' }
    ],
    attractions: [
      { name: '漓江', enName: 'Li River', desc: '乘船游览。', price: '300元', season: '全年', time: '1天' }
    ],
    transportation: [
      { iconName: 'Plane', title: '航空', desc: '两江国际机场。', price: '航线密集。' }
    ],
    food: [
      { name: '桂林米粉', pinyin: 'Mǐfěn', price: '¥8/碗', desc: '经典美味。', ingredients: '大米、秘制卤水。', imageIdx: 92 }
    ]
  }
};
