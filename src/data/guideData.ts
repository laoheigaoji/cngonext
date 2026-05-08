export const digitalToolbox = {
  vpn: {
    title: '互联网连接: VPN',
    subtitle: '访问国际互联网的必备工具',
    importantNote: '必须在入华前下载并安装VPN！在中国境内无法下载。',
    whyNeed: '中国互联网有防火墙，许多国外社交媒体、新闻网站、搜索引擎在中国无法直接访问，如谷歌、YouTube、WhatsApp、Facebook和Instagram。',
    options: {
        recommendation: { title: '推荐 eSIM', desc: '• 出发前在线购买\n• 部分可直接访问国际网络\n• 推荐： Trip.com eSIM' },
        simCard: { title: '本地SIM卡', desc: '• 需要护照实名登记\n• 适合长期停留\n• 运营商： 中国联通' }
    },
    apps: ['WeChat(微信)', 'Alipay(支付宝)', 'Meituan(美团)', 'Xiaohongshu(小红书)']
  },
  payment: {
    title: '掌握移动支付',
    subtitle: '畅行中国的钥匙',
    description: '中国已进入准无现金社会，熟练使用移动支付是您在中国必备的必备技能',
    setupSteps: [
        '出国前下载“Alipay”',
        '使用国际手机号注册',
        '绑定国际信用卡（Visa/Mastercard）',
        '完成身份验证（上传护照照片）'
    ]
  }
};

export const vocabulary = [
  { cn: '你好', pinyin: 'Nǐ hǎo', en: 'Hello' },
  { cn: '谢谢', pinyin: 'Xièxiè', en: 'Thank you' },
  { cn: '这个', pinyin: 'Zhège', en: 'This one' },
  { cn: '那个', pinyin: 'Nàge', en: 'That one' },
  { cn: '多少钱', pinyin: 'Duōshǎo qián?', en: 'How much?' },
  { cn: '买单', pinyin: 'Mǎidān', en: 'The bill, please' },
  { cn: '菜单', pinyin: 'Càidān', en: 'Menu' },
  { cn: '洗手间', pinyin: 'Xǐshǒujiān', en: 'Restroom' },
  { cn: '扫码', pinyin: 'Sǎo mǎ', en: 'Scan code' },
  { cn: '听不懂', pinyin: 'Tīng bù dǒng', en: 'I don\'t understand' },
  { cn: '对不起', pinyin: 'Duìbùqǐ', en: 'Sorry' },
  { cn: '再见', pinyin: 'Zàijiàn', en: 'Goodbye' },
  { cn: '等一下', pinyin: 'Děng yíxià', en: 'Wait a moment' },
  { cn: '吃了吗', pinyin: 'Chīle ma', en: 'Have you eaten?' },
  { cn: '来都来了', pinyin: 'Lái dōu lái le', en: 'Since you\'re here, accept calmly' }
];

export const conversations = {
    dining: {
        title: '用餐与点菜',
        phrases: [
            { cn: '我要... (Wǒ yào...)', en: 'I want...' },
            { cn: '不要辣 (Bù là)', en: 'Not spicy' },
            { cn: '这是什么东西? (Zhè shì shénme dōngxi?)', en: 'What is this?' },
            { cn: '这个多少钱? (Zhège duōshǎo qián?)', en: 'How much is this?' },
            { cn: '可不可以帮我? (Kěbùkěyǐ bāngwǒ xià?)', en: 'Can you help me?' }
        ]
    },
    transport: {
        title: '问路与交通',
        phrases: [
            { cn: '这个地方在哪里? (Zhège dìfang zài nǎlǐ?)', en: 'Where is this place?' },
            { cn: '我想去这个地方 (Wǒ xiǎng qù zhè ge dìfang)', en: 'I want to go to this place' },
            { cn: '我迷路了 (Wǒ mí lù le)', en: 'I\'m lost' },
            { cn: '附近有卫生间吗? (Bùjìn yǒu wèishēngjiān ma?)', en: 'Is there a restroom nearby?' },
            { cn: '请问地铁站怎么走? (Qǐngwèn dìtiězhàn zěnme zǒu?)', en: 'How do I get to the subway station?' }
        ]
    }
};

export const culture = {
  dining: {
    title: '餐饮礼仪',
    rules: [
      { type: 'negative', title: '筷子禁忌', items: ['禁止将筷子竖插在米饭中，因为这象征着祭奠', '禁止用筷子敲碗，因为这象征着乞丐', '禁止用筷子指人，因为这很不礼貌'] },
      { type: 'positive', title: '敬酒规则', items: ['碰杯时杯沿低于长辈或上级', '听到“干杯 (gānbēi)”时应喝光', '听到“随意 (suíyì)”时可以随意喝'] }
    ]
  },
  gifts: {
    title: '赠礼艺术',
    sections: [
        { title: '合适的礼物', items: ['第一次去朋友家，应当带些礼物', '礼物可以是来自您国家的特产', '也可以是茶叶、酒、水果、牛奶等', '如果对方家有小孩可以带些糖果、玩具等'] },
        { title: '禁忌的礼物', items: ['钟表 —— 谐音“送终”，参加葬礼', '雨伞 —— 谐音“散”，分离', '梨 —— 谐音“离”，分离', '鞋 —— 谐音“邪”，邪气', '尖锐物品 —— 象征断绝关系', '数量为4的物品 —— 谐音“死”', '绿色的帽子 —— 暗示伴侣不忠', '黑/白包装纸 —— 葬礼颜色'] },
        { title: '赠礼仪式', items: ['双手递上礼物，双手接受礼物', '对方可能会礼貌拒绝，请温温和坚持', '不要在送礼者面前打开'] }
    ]
  },
  social: {
    title: '通用社交意识',
    items: [
        { title: '敏感话题', desc: '避免讨论政治、宗教、性等敏感话题；中国人大都比较爱国，有关国家主权的话题请谨慎讨论。' },
        { title: '好奇', desc: '中国人好客，自古以来就有“有朋自远方来，不亦乐乎”的传统；不要直接拒绝他人的邀请，即使不想参加，也请委婉拒绝，并连声谢谢。' },
        { title: '面子', desc: '中国人讲面子，是为了维护自身形象和声誉，请避免在公共场合让人难堪，如大声喧哗、争吵等，更容易赢得对他人的尊重。' },
        { title: '问候', desc: '一句“你好”或握手即可，避免多余的肢体接触；女士应握手半，即用手轻轻碰触对方的手尖，而不是整个手掌。' }
    ]
  }
};
