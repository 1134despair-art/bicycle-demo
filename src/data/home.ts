export type QuickAction = {
  key: string
  label: string
  icon: 'startRide' | 'deviceDebug' | 'routePlan'
}

export type HomeBanner = {
  key: string
  title: string
  subtitle: string
  image: string
}

export type ProductCategory = {
  key: string
  label: string
  sublabel: string
  image: string
}

export type RecommendedProduct = {
  key: string
  categoryKey: string
  productKey: string
  category: string
  name: string
  specs: string
  description: string
  image: string
}

export type ProductMatrixItem = {
  key: string
  name: string
  specs: string
  image: string
  description: string
  highlights: string[]
  parameters: Array<{ label: string; value: string }>
  technicalFeatures?: Array<{
    title: string
    description: string
    image?: string
  }>
}

export type ProductMatrixCategory = {
  key: string
  label: string
  sublabel: string
  title: string
  subtitle: string
  heroImage: string
  items: ProductMatrixItem[]
}

export const homeHero = {
  brand: 'CHEXIN',
  subtitle: '精选产品、设备状态、骑行服务',
  bikeName: 'Aurora Carbon Pro',
  bikeModel: '公路整车 · Di2 套件',
  mileage: 98.6,
  location: '成都锦城湖绿道环线',
  battery: '86%',
  heroLabel: '当前车辆',
  voltage: '12.4V',
  connectState: '已配置骑行外设',
  stats: [
    { label: '外设电量', value: '86%', tone: 'text-ink' },
    { label: '外设', value: '3 台', tone: 'text-brand-700' },
    { label: '定位', value: '成都', tone: 'text-ink' },
  ],
}

export const homeBanners: HomeBanner[] = [
  {
    key: 'erx',
    title: '重构立新',
    subtitle: 'eRX 电子变速全新升级',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=high-end%20cycling%20campaign%20banner%2C%20electronic%20road%20groupset%20upgrade%2C%20large%20gear%20cassette%20and%20crankset%20close-up%2C%20premium%20sports%20advertising%2C%20clean%20light%20gray%20background%2C%20commercial%20mobile%20app%20hero&image_size=portrait_16_9',
  },
  {
    key: 'disc',
    title: 'DISC',
    subtitle: '油压碟刹系统',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=hydraulic%20disc%20brake%20cycling%20product%20banner%2C%20close-up%20of%20road%20bike%20brake%20caliper%20and%20wheel%2C%20dark%20premium%20advertising%20style%2C%20high%20contrast%2C%20commercial%20mobile%20app%20banner&image_size=portrait_16_9',
  },
  {
    key: 'gravel',
    title: 'GRAVEL',
    subtitle: '多地形骑行方案',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20cycling%20brand%20banner%2C%20cyclist%20riding%20on%20mountain%20road%2C%20premium%20sports%20campaign%2C%20earthy%20colors%2C%20high-end%20commercial%20mobile%20app%20hero&image_size=portrait_16_9',
  },
]

export const productCategories: ProductCategory[] = [
  {
    key: 'road',
    label: 'ROAD',
    sublabel: '公路',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=road%20bike%20component%20thumbnail%2C%20premium%20cycling%20product%20photo%2C%20dark%20background%2C%20sharp%20detail%2C%20commercial%20app%20icon&image_size=square',
  },
  {
    key: 'gravel',
    label: 'GRAVEL',
    sublabel: '砾石',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20cyclist%20on%20country%20road%20thumbnail%2C%20premium%20cycling%20lifestyle%20photo%2C%20commercial%20app%20icon&image_size=square',
  },
  {
    key: 'mtb',
    label: 'MTB',
    sublabel: '山地',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20rider%20action%20thumbnail%2C%20premium%20sports%20photo%2C%20commercial%20app%20icon&image_size=square',
  },
  {
    key: 'other',
    label: 'L-TWOO',
    sublabel: '其他',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cycling%20brand%20parts%20thumbnail%2C%20gear%20component%20with%20logo-style%20presentation%2C%20premium%20dark%20product%20photo%2C%20commercial%20app%20icon&image_size=square',
  },
]

export const recommendedProducts: RecommendedProduct[] = [
  {
    key: 'computer',
    categoryKey: 'other',
    productKey: 'other-computer',
    category: '智能码表',
    name: '蓝图智能码表 Pro',
    specs: '2.4 寸彩屏 · 双频定位 · 蓝牙/ANT+',
    description: '骑行训练与户外导航场景的核心设备。',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20cycling%20computer%20device%20product%20photo%2C%20dark%20background%2C%20premium%20tech%20style%2C%20commercial%20ecommerce%20card&image_size=landscape_4_3',
  },
  {
    key: 'disc-brake',
    categoryKey: 'road',
    productKey: 'road-brake',
    category: '油压碟刹',
    name: 'DISC 油压碟刹系统',
    specs: '双活塞卡钳 · 兼容公路整车 · 稳定制动',
    description: '面向公路整车升级与制动性能优化。',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=hydraulic%20disc%20brake%20system%20product%20photo%2C%20road%20bike%20wheel%20close-up%2C%20premium%20commercial%20catalog%20style&image_size=landscape_4_3',
  },
  {
    key: 'road-bike',
    categoryKey: 'road',
    productKey: 'road-bike-frame',
    category: '公路整车',
    name: 'Aurora Carbon 公路车',
    specs: '碳纤维车架 · 竞赛几何 · 油压碟刹',
    description: '面向公路训练和高速巡航的旗舰整车方案。',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=carbon%20road%20bike%20product%20photo%2C%20premium%20sports%20catalog%2C%20dark%20studio%20background%2C%20commercial%20app&image_size=landscape_4_3',
  },
  {
    key: 'power-meter',
    categoryKey: 'other',
    productKey: 'other-power-meter',
    category: '训练设备',
    name: '功率计曲柄组',
    specs: '功率输出监测 · 蓝牙/ANT+ · 训练分析',
    description: '适合结构化训练与骑行功率数据采集。',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cycling%20power%20meter%20crankset%20product%20photo%2C%20premium%20sports%20technology%20catalog%2C%20dark%20background&image_size=landscape_4_3',
  },
]

export const productMatrixCategories: ProductMatrixCategory[] = [
  {
    key: 'road',
    label: 'ROAD',
    sublabel: '公路',
    title: 'ROAD 公路',
    subtitle: '电子变速、公路整车与公路骑行配件',
    heroImage:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=road%20cycling%20product%20category%20banner%2C%20premium%20road%20bike%20and%20high-end%20components%2C%20clean%20mountain%20road%20background%2C%20commercial%20mobile%20app%20hero&image_size=landscape_16_9',
    items: [
      {
        key: 'road-erx-left-shifter',
        name: 'eRX 电子液压碟刹双控手柄 2x 10-12速（左）碳纤维',
        specs: '2x 10-12 速 · 左手双控 · 碳纤维',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=left%20road%20bike%20hydraulic%20disc%20brake%20shift%20lever%2C%20carbon%20fiber%20electronic%20shifter%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于 eRX 公路电子变速系统的左手液压双控手柄，兼顾刹车手感与变速控制响应。',
        highlights: ['碳纤维刹把结构', '适配 2x 10-12 速', '液压碟刹一体控制'],
        parameters: [
          { label: '速别', value: '2x10-12S' },
          { label: '颜色', value: '黑色 + 镭射银' },
          { label: '重量', value: '225g (Left)' },
          { label: '安装位置', value: '左' },
          { label: '刹车杆材料', value: '碳纤维' },
          { label: '制动方式', value: '液压' },
        ],
        technicalFeatures: [
          {
            title: 'ST-Single Shift Lever 变速操控逻辑',
            description: 'Single Shift Lever 采用单拨杆与刹车杆联动的变速逻辑设计，上下把位均可轻松换挡。',
          },
          {
            title: 'ST-Comfort III 人体工学设计',
            description: 'Comfort III 采用蓝图第三代手变人体工学设计，使整体握持舒适性与操控稳定性得到显著提升。',
          },
        ],
      },
      {
        key: 'road-erx-right-shifter',
        name: 'eRX 电子液压碟刹双控手柄 2x 10-12速（右）碳纤维',
        specs: '2x 10-12 速 · 右手双控 · 碳纤维',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=right%20road%20bike%20hydraulic%20disc%20brake%20shift%20lever%2C%20carbon%20fiber%20electronic%20shifter%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于 eRX 公路电子变速系统的右手液压双控手柄，适合公路电子变速整车升级方案。',
        highlights: ['碳纤维刹把结构', '适配 2x 10-12 速', '更清晰的右手拨片反馈'],
        parameters: [
          { label: '类型', value: '右手双控' },
          { label: '档位', value: '2x 10-12 速' },
          { label: '材质', value: '碳纤维' },
          { label: '制动', value: '液压碟刹' },
        ],
      },
      {
        key: 'road-erx-front-derailleur',
        name: 'eRX 电子前拨 2x',
        specs: '电子前拨 · 2x 系统 · 公路竞赛',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=electronic%20road%20bike%20front%20derailleur%20product%20photo%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '面向 eRX 公路双盘系统，换挡干脆迅速，适合竞赛与高速巡航骑行场景。',
        highlights: ['双盘系统适配', '电子换挡响应快', '整车走线更简洁'],
        parameters: [
          { label: '类型', value: '电子前拨' },
          { label: '档位', value: '2x' },
          { label: '定位', value: '公路竞赛' },
          { label: '安装', value: '焊接座/夹环' },
        ],
      },
      {
        key: 'road-erx-rear-derailleur',
        name: 'eRX 电子后拨 10-12速 32T / 碳纤维',
        specs: '电子后拨 · 10-12 速 · 32T',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=electronic%20road%20bike%20rear%20derailleur%20product%20photo%2C%20carbon%20fiber%20cage%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '提供稳定的后拨导链表现与精准换挡体验，适合 eRX 公路电子套件整套搭配。',
        highlights: ['支持 10-12 速', '32T 宽容齿比', '碳纤维后拨臂'],
        parameters: [
          { label: '类型', value: '电子后拨' },
          { label: '档位', value: '10-12 速' },
          { label: '最大飞轮', value: '32T' },
          { label: '材质', value: '碳纤维/铝合金' },
        ],
      },
      {
        key: 'road-erx-charger',
        name: 'L-TWOO 磁吸充电器',
        specs: '磁吸快充 · eRX 系统配件',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=magnetic%20charger%20for%20electronic%20bike%20groupset%2C%20premium%20accessory%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于 eRX 电子变速系统的日常补能，磁吸连接更稳定，适合随车携带。',
        highlights: ['磁吸连接结构', '充电更稳定', '适配 eRX 系统'],
        parameters: [
          { label: '类型', value: '磁吸充电器' },
          { label: '接口', value: 'USB' },
          { label: '用途', value: '系统充电' },
          { label: '适配', value: 'eRX' },
        ],
      },
      {
        key: 'road-erx-battery',
        name: 'L-TWOO 二次锂电池组',
        specs: '锂电池组 · 电子变速供电',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=lithium%20battery%20pack%20for%20electronic%20bike%20groupset%2C%20premium%20cycling%20accessory%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '为公路电子变速系统提供持续稳定供电，适合训练和比赛长时间骑行使用。',
        highlights: ['稳定供电', '轻量化电池组', '支持快速更换'],
        parameters: [
          { label: '类型', value: '锂电池组' },
          { label: '用途', value: '电子变速供电' },
          { label: '特性', value: '可重复充电' },
          { label: '适配', value: 'eRX' },
        ],
      },
      {
        key: 'road-er9-groupset',
        name: 'eR9 电子变速套件',
        specs: '10-12 速 · 公路训练 · 电子控制',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=electronic%20road%20bike%20groupset%20product%20photo%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '面向公路训练和日常进阶用户的电子变速套件方案，兼顾性能与整车兼容性。',
        highlights: ['电子控制逻辑', '适配 10-12 速', '适合公路训练场景'],
        parameters: [
          { label: '档位', value: '10-12 速' },
          { label: '控制方式', value: '电子' },
          { label: '定位', value: '训练/进阶' },
          { label: '制动', value: '碟刹兼容' },
        ],
      },
      {
        key: 'road-bike-frame',
        name: 'Aurora Carbon 公路车',
        specs: '碳纤维车架 · 竞赛几何',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=carbon%20road%20bike%20product%20photo%2C%20premium%20sports%20catalog%2C%20dark%20studio%20background%2C%20commercial%20app&image_size=landscape_4_3',
        description: '以轻量化和刚性平衡为核心，适合长距离巡航与高速破风训练使用。',
        highlights: ['碳纤维一体车架', '竞赛级几何设定', '支持内走线方案'],
        parameters: [
          { label: '材质', value: '碳纤维' },
          { label: '定位', value: '公路竞赛' },
          { label: '走线', value: '全内走线' },
          { label: '制动', value: '油压碟刹' },
        ],
      },
      {
        key: 'road-rx-flat-shifter',
        name: 'eRX 平把公路 电子指拨',
        specs: '平把指拨 · 公路通勤 · 电子控制',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=flat%20bar%20electronic%20road%20bike%20shifter%20product%20photo%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合平把公路与城市训练整车，兼顾操作直接性与电子变速的清晰反馈。',
        highlights: ['平把操作布局', '电子换挡控制', '适合城市与训练使用'],
        parameters: [
          { label: '类型', value: '电子指拨' },
          { label: '车型', value: '平把公路' },
          { label: '控制', value: '电子' },
          { label: '定位', value: '通勤/训练' },
        ],
      },
      {
        key: 'road-wheelset',
        name: 'Aero 碳刀轮组',
        specs: '50mm 刀高 · 真空兼容',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=carbon%20road%20bike%20wheelset%20product%20photo%2C%20premium%20cycling%20catalog%2C%20dark%20background&image_size=landscape_4_3',
        description: '针对高速巡航与平路训练优化，兼顾侧风稳定性与整车破风效率。',
        highlights: ['50mm 中高框设计', '支持真空胎系统', '提升高速巡航表现'],
        parameters: [
          { label: '刀高', value: '50mm' },
          { label: '兼容', value: 'Tubeless' },
          { label: '用途', value: '平路巡航' },
          { label: '刹车', value: '碟刹' },
        ],
      },
      {
        key: 'road-r9-front-derailleur',
        name: 'R9 公路前拨 2x',
        specs: '机械前拨 · 2x 结构 · 公路升级',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mechanical%20road%20bike%20front%20derailleur%20product%20photo%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合机械公路整车升级方案，满足双盘变速与日常训练需求。',
        highlights: ['双盘机械结构', '适合公路升级', '调节维护更直接'],
        parameters: [
          { label: '类型', value: '机械前拨' },
          { label: '档位', value: '2x' },
          { label: '定位', value: '公路训练' },
          { label: '安装', value: '焊接座/夹环' },
        ],
      },
      {
        key: 'road-brake',
        name: 'DISC 油压碟刹系统',
        specs: '双活塞卡钳 · 稳定制动',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=hydraulic%20disc%20brake%20road%20bike%20product%20photo%2C%20premium%20cycling%20component%2C%20dark%20studio%20background&image_size=landscape_4_3',
        description: '为公路整车提供更稳定的刹车手感与长下坡环境下的制动一致性。',
        highlights: ['双活塞卡钳', '油压制动系统', '湿滑路面更稳定'],
        parameters: [
          { label: '卡钳', value: '双活塞' },
          { label: '介质', value: '油压' },
          { label: '定位', value: '公路碟刹' },
          { label: '特性', value: '线性制动' },
        ],
      },
      {
        key: 'road-r7-crankset',
        name: 'R7 公路曲柄组',
        specs: '轻量曲柄 · 公路升级 · 稳定输出',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=road%20bike%20crankset%20product%20photo%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合入门到进阶公路整车的传动升级，兼顾轻量化和踩踏刚性表现。',
        highlights: ['轻量化曲柄结构', '适合公路升级', '踩踏反馈更直接'],
        parameters: [
          { label: '类型', value: '公路曲柄组' },
          { label: '定位', value: '公路升级' },
          { label: '特性', value: '轻量/高刚性' },
          { label: '兼容', value: '2x 系统' },
        ],
      },
      {
        key: 'road-r7-cable',
        name: 'L-TWOO 电源线（0.9m）',
        specs: '0.9m 线长 · 内走线适配',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=electric%20wire%20for%20bike%20electronic%20groupset%20product%20photo%2C%20premium%20cycling%20accessory%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于电子变速系统的线路连接，适合整车组装和升级改装时使用。',
        highlights: ['0.9m 线长', '适合内走线', '连接更稳定'],
        parameters: [
          { label: '类型', value: '电源线' },
          { label: '长度', value: '0.9m' },
          { label: '用途', value: '系统连接' },
          { label: '适配', value: '电子变速' },
        ],
      },
    ],
  },
  {
    key: 'gravel',
    label: 'GRAVEL',
    sublabel: '砾石',
    title: 'GRAVEL 砾石',
    subtitle: '多地形骑行整车、轮组与长途组件方案',
    heroImage:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20cycling%20category%20banner%2C%20cyclist%20riding%20on%20mountain%20road%2C%20premium%20outdoor%20sports%20campaign%2C%20commercial%20mobile%20app%20hero&image_size=landscape_16_9',
    items: [
      {
        key: 'gravel-bike',
        name: 'Terra Gravel 整车',
        specs: '铝合金车架 · 多地形稳定',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20product%20photo%2C%20premium%20cycling%20catalog%2C%20outdoor-inspired%20dark%20studio%20background&image_size=landscape_4_3',
        description: '适用于铺装、公路与碎石混合路线，强调舒适性、稳定性与长里程通过能力。',
        highlights: ['多地形适配', '更宽胎间隙', '长距离骑行更舒适'],
        parameters: [
          { label: '材质', value: '铝合金' },
          { label: '胎宽', value: '45C' },
          { label: '定位', value: '砾石骑行' },
          { label: '刹车', value: '油压碟刹' },
        ],
      },
      {
        key: 'gravel-frame',
        name: 'Terra Gravel 车架组',
        specs: '铝合金车架 · 多安装位',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20frameset%20product%20photo%2C%20premium%20cycling%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合长距离砾石与全路况骑行，保留更多货架、水壶架和补给安装扩展位。',
        highlights: ['多安装位设计', '宽胎兼容', '适合长距离骑行'],
        parameters: [
          { label: '类型', value: '车架组' },
          { label: '材质', value: '铝合金' },
          { label: '胎宽', value: '45C' },
          { label: '定位', value: 'Gravel' },
        ],
      },
      {
        key: 'gravel-fork',
        name: 'Terra Carbon 前叉',
        specs: '碳纤维前叉 · 轻量减震',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20carbon%20fork%20product%20photo%2C%20premium%20cycling%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '为 Gravel 车架提供更轻量的前端方案，兼顾舒适性和长途骑行效率。',
        highlights: ['碳纤维材质', '更轻前端重量', '提升碎石舒适性'],
        parameters: [
          { label: '类型', value: '碳纤维前叉' },
          { label: '材质', value: '碳纤维' },
          { label: '定位', value: 'Gravel' },
          { label: '制动', value: '碟刹' },
        ],
      },
      {
        key: 'gravel-groupset',
        name: 'GRX Adventure 套件',
        specs: '1x12 速 · 宽域飞轮',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20groupset%20product%20photo%2C%20premium%20cycling%20component%2C%20dark%20studio%20background&image_size=landscape_4_3',
        description: '专为 Adventure 与 Bikepacking 路线设计，在爬坡与复杂路面下保持可靠传动。',
        highlights: ['1x12 单盘结构', '宽域齿比覆盖', '复杂路况更稳定'],
        parameters: [
          { label: '档位', value: '1x12 速' },
          { label: '用途', value: 'Adventure' },
          { label: '飞轮', value: '10-51T' },
          { label: '特性', value: '防掉链' },
        ],
      },
      {
        key: 'gravel-grx-shifter',
        name: 'GRX Adventure 手变',
        specs: '1x12 手变 · 防滑握感',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20shifter%20product%20photo%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '针对复杂路况和长时间握持优化，适合砾石整车的刹变一体方案。',
        highlights: ['防滑握持设计', '适合颠簸路面', '长途操作更稳定'],
        parameters: [
          { label: '类型', value: '手变' },
          { label: '档位', value: '1x12' },
          { label: '定位', value: 'Adventure' },
          { label: '制动', value: '碟刹' },
        ],
      },
      {
        key: 'gravel-grx-rear-derailleur',
        name: 'GRX Adventure 后拨',
        specs: '1x12 后拨 · 宽域飞轮',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20rear%20derailleur%20product%20photo%2C%20premium%20cycling%20component%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '在碎石、爬坡和满载场景下保持稳定导链，适合 Adventure 路线使用。',
        highlights: ['宽域齿比兼容', '导链更稳定', '复杂路况不易掉链'],
        parameters: [
          { label: '类型', value: '后拨' },
          { label: '档位', value: '1x12' },
          { label: '飞轮', value: '10-51T' },
          { label: '定位', value: 'Gravel' },
        ],
      },
      {
        key: 'gravel-wheelset',
        name: 'Allroad 轮组',
        specs: 'Tubeless Ready · 砾石胎兼容',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=allroad%20gravel%20bike%20wheelset%20product%20photo%2C%20premium%20cycling%20catalog%2C%20dark%20studio%20background&image_size=landscape_4_3',
        description: '兼顾铺装效率与碎石稳定性，适合长距离全路况骑行配置。',
        highlights: ['宽内宽轮圈', '支持真空胎', '全路况更均衡'],
        parameters: [
          { label: '轮圈', value: '宽内宽' },
          { label: '兼容', value: 'Tubeless' },
          { label: '定位', value: 'Allroad' },
          { label: '刹车', value: '碟刹' },
        ],
      },
      {
        key: 'gravel-tire',
        name: 'Allroad 无内胎外胎',
        specs: '700x40C · 低滚阻 · 抗刺',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20tire%20product%20photo%2C%20premium%20cycling%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合碎石、公路混合地形，兼顾滚阻效率、抓地表现与抗刺性能。',
        highlights: ['低滚阻胎纹', '真空胎兼容', '兼顾抓地与耐用'],
        parameters: [
          { label: '尺寸', value: '700x40C' },
          { label: '类型', value: 'Tubeless Ready' },
          { label: '定位', value: 'Allroad' },
          { label: '特性', value: '抗刺' },
        ],
      },
      {
        key: 'gravel-handlebar',
        name: 'Allroad 外扩弯把',
        specs: '12° 外扩 · 长途控制',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20flare%20handlebar%20product%20photo%2C%20premium%20cycling%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '提升砾石骑行中的稳定控制和下把操控手感，适合长距离全路况骑行。',
        highlights: ['下把外扩设计', '复杂路面更稳', '长途骑行更舒适'],
        parameters: [
          { label: '类型', value: '外扩弯把' },
          { label: '外扩', value: '12°' },
          { label: '定位', value: 'Gravel' },
          { label: '材质', value: '铝合金' },
        ],
      },
      {
        key: 'gravel-bag',
        name: 'Bikepacking 座包',
        specs: '长途装载 · 防泼水',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bikepacking%20seat%20bag%20product%20photo%2C%20premium%20outdoor%20cycling%20catalog%2C%20dark%20background&image_size=landscape_4_3',
        description: '为长途露营与补给携带设计，兼顾固定稳定性与取放效率。',
        highlights: ['大容量结构', '防泼水面料', '固定安装更稳固'],
        parameters: [
          { label: '容量', value: '8L' },
          { label: '材质', value: '防泼水' },
          { label: '场景', value: '长途露营' },
          { label: '安装', value: '快拆绑带' },
        ],
      },
      {
        key: 'gravel-handlebar-bag',
        name: 'Bikepacking 车把包',
        specs: '前端装载 · 快取设计',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20handlebar%20bag%20product%20photo%2C%20premium%20outdoor%20cycling%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合露营、长途与补给装载，提供更方便的前端拿取体验。',
        highlights: ['前端快取结构', '适合长途补给', '防泼水面料'],
        parameters: [
          { label: '类型', value: '车把包' },
          { label: '容量', value: '5L' },
          { label: '材质', value: '防泼水' },
          { label: '场景', value: 'Bikepacking' },
        ],
      },
      {
        key: 'gravel-frame-bag',
        name: 'Bikepacking 车架包',
        specs: '中框收纳 · 稳定装载',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gravel%20bike%20frame%20bag%20product%20photo%2C%20premium%20outdoor%20cycling%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '更贴合车架结构的收纳方案，适合长途骑行中携带工具和补给物品。',
        highlights: ['贴合中框结构', '重心更稳定', '适合工具补给携带'],
        parameters: [
          { label: '类型', value: '车架包' },
          { label: '容量', value: '4L' },
          { label: '材质', value: '防泼水' },
          { label: '场景', value: 'Adventure' },
        ],
      },
    ],
  },
  {
    key: 'mtb',
    label: 'MTB',
    sublabel: '山地',
    title: 'MTB 山地',
    subtitle: '山地越野整车、避震与山地传动方案',
    heroImage:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20category%20banner%2C%20rider%20on%20trail%2C%20premium%20sports%20campaign%2C%20commercial%20mobile%20app%20hero&image_size=landscape_16_9',
    items: [
      {
        key: 'mtb-bike',
        name: 'Trail Pro 山地车',
        specs: '全避震 · 林道越野',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=full%20suspension%20mountain%20bike%20product%20photo%2C%20premium%20sports%20catalog%2C%20dark%20studio%20background&image_size=landscape_4_3',
        description: '针对林道与山地越野路线打造，提供更好的抓地力、通过性和操控反馈。',
        highlights: ['全避震结构', '越野通过性强', '技术路段更稳定'],
        parameters: [
          { label: '避震', value: '前后避震' },
          { label: '用途', value: 'Trail' },
          { label: '轮径', value: '29 寸' },
          { label: '刹车', value: '四活塞碟刹' },
        ],
      },
      {
        key: 'mtb-frame',
        name: 'Trail Pro 山地车架',
        specs: '铝合金车架 · Trail 几何',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20frame%20product%20photo%2C%20premium%20sports%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '为林道与起伏越野场景打造的车架平台，兼顾操控灵敏和稳定通过性。',
        highlights: ['Trail 几何设定', '适合 29er 轮径', '兼顾灵敏与稳定'],
        parameters: [
          { label: '类型', value: '山地车架' },
          { label: '材质', value: '铝合金' },
          { label: '轮径', value: '29 寸' },
          { label: '定位', value: 'Trail' },
        ],
      },
      {
        key: 'mtb-wheelset',
        name: 'Trail 29er 轮组',
        specs: '真空兼容 · 越野抓地',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%2029er%20wheelset%20product%20photo%2C%20premium%20sports%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合 Trail 和 XC 线路的 29er 轮组，提供更好的滚动效率和复杂路面通过性。',
        highlights: ['29er 轮径', '真空胎兼容', '复杂路况通过性更好'],
        parameters: [
          { label: '类型', value: '29er 轮组' },
          { label: '兼容', value: 'Tubeless' },
          { label: '定位', value: 'Trail/XC' },
          { label: '刹车', value: '碟刹' },
        ],
      },
      {
        key: 'mtb-fork',
        name: 'Air Fork 前叉',
        specs: '气压避震 · 120mm 行程',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20suspension%20fork%20product%20photo%2C%20premium%20cycling%20component%2C%20dark%20studio%20background&image_size=landscape_4_3',
        description: '针对技术林道与起伏地形设计，兼顾轻量化与避震支撑表现。',
        highlights: ['气压避震结构', '120mm 行程', '回弹可调'],
        parameters: [
          { label: '类型', value: '气压前叉' },
          { label: '行程', value: '120mm' },
          { label: '调节', value: '回弹/锁定' },
          { label: '用途', value: 'Trail' },
        ],
      },
      {
        key: 'mtb-fork-pro',
        name: 'Air Fork Pro 前叉',
        specs: '气压避震 · 140mm 行程',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20suspension%20fork%20pro%20product%20photo%2C%20premium%20sports%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合更激进的 Trail 与轻度 Enduro 使用，提供更大的前端吸震行程。',
        highlights: ['140mm 行程', '适合技术地形', '前端支撑更强'],
        parameters: [
          { label: '类型', value: '气压前叉' },
          { label: '行程', value: '140mm' },
          { label: '调节', value: '回弹/压缩' },
          { label: '定位', value: 'Trail/Enduro' },
        ],
      },
      {
        key: 'mtb-shock',
        name: 'Rear Shock 后避震',
        specs: '后胆避震 · 回弹可调',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20rear%20shock%20product%20photo%2C%20premium%20sports%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于全避震山地车架平台，改善碎石和技术路段的后轮抓地与舒适性。',
        highlights: ['后轮抓地更稳', '提升舒适性', '回弹可调'],
        parameters: [
          { label: '类型', value: '后避震' },
          { label: '调节', value: '回弹可调' },
          { label: '定位', value: 'Trail' },
          { label: '结构', value: '气压' },
        ],
      },
      {
        key: 'mtb-drivetrain',
        name: 'MTB 12 速传动',
        specs: '单盘系统 · 越野爬坡',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20drivetrain%20product%20photo%2C%20premium%20cycling%20component%2C%20dark%20background&image_size=landscape_4_3',
        description: '面向爬坡与复杂越野节奏设计，在大负荷输出下提供可靠传动切换。',
        highlights: ['单盘系统更简洁', '大齿比覆盖爬坡', '复杂路况更稳定'],
        parameters: [
          { label: '档位', value: '1x12 速' },
          { label: '飞轮', value: '10-52T' },
          { label: '用途', value: 'XC/Trail' },
          { label: '特性', value: '防掉链' },
        ],
      },
      {
        key: 'mtb-rear-derailleur',
        name: 'MTB 12 速后拨',
        specs: '后拨系统 · 越野稳定导链',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20rear%20derailleur%20product%20photo%2C%20premium%20sports%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合陡坡与颠簸地形下的后拨导链需求，提升越野换挡稳定性。',
        highlights: ['越野导链更稳', '适合陡坡爬升', '1x 系统兼容'],
        parameters: [
          { label: '类型', value: '后拨' },
          { label: '档位', value: '12 速' },
          { label: '飞轮', value: '10-52T' },
          { label: '定位', value: 'XC/Trail' },
        ],
      },
      {
        key: 'mtb-cassette',
        name: 'MTB 12 速飞轮',
        specs: '10-52T · 宽域飞轮',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20cassette%20product%20photo%2C%20premium%20sports%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '面向林道和爬坡地形的宽域飞轮配置，提供更充足的低档爬坡齿比。',
        highlights: ['10-52T 齿比覆盖', '爬坡更轻松', '适配 12 速传动'],
        parameters: [
          { label: '类型', value: '飞轮' },
          { label: '齿比', value: '10-52T' },
          { label: '档位', value: '12 速' },
          { label: '定位', value: '越野爬坡' },
        ],
      },
      {
        key: 'mtb-dropper',
        name: 'Dropper 升降座管',
        specs: '遥控升降 · 技术下坡',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dropper%20seatpost%20product%20photo%2C%20premium%20mountain%20bike%20component%2C%20dark%20studio%20background&image_size=landscape_4_3',
        description: '提升技术下坡与起伏地形中的身体重心控制，让姿态切换更高效。',
        highlights: ['遥控升降', '技术下坡更灵活', '提升车手动作空间'],
        parameters: [
          { label: '类型', value: '遥控升降' },
          { label: '行程', value: '150mm' },
          { label: '用途', value: 'Trail/Enduro' },
          { label: '布线', value: '内走线' },
        ],
      },
      {
        key: 'mtb-dropper-remote',
        name: 'Dropper 遥控拨杆',
        specs: '单手操作 · 下坡切换',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dropper%20seatpost%20remote%20lever%20product%20photo%2C%20premium%20sports%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于升降座管的遥控拨杆控制，提升技术路段中对身体重心的快速调整能力。',
        highlights: ['单手操作', '切换更直接', '适合技术地形'],
        parameters: [
          { label: '类型', value: '遥控拨杆' },
          { label: '用途', value: '升降座管控制' },
          { label: '定位', value: 'Trail/Enduro' },
          { label: '安装', value: '车把' },
        ],
      },
      {
        key: 'mtb-seatpost-clamp',
        name: 'Dropper 座管夹',
        specs: '轻量固定 · 稳定支撑',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mountain%20bike%20seatpost%20clamp%20product%20photo%2C%20premium%20sports%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '为升降座管系统提供稳定固定支撑，适合整车升级和维护使用。',
        highlights: ['轻量结构', '安装方便', '固定更稳定'],
        parameters: [
          { label: '类型', value: '座管夹' },
          { label: '用途', value: '升降座管固定' },
          { label: '材质', value: '铝合金' },
          { label: '定位', value: 'Trail' },
        ],
      },
    ],
  },
  {
    key: 'other',
    label: 'L-TWOO',
    sublabel: '其他',
    title: 'L-TWOO 其他',
    subtitle: '码表、传感器与通用骑行配件',
    heroImage:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cycling%20accessories%20category%20banner%2C%20bike%20computer%20and%20sensors%2C%20premium%20tech%20commercial%20mobile%20app%20hero&image_size=landscape_16_9',
    items: [
      {
        key: 'other-computer',
        name: '蓝图智能码表 Pro',
        specs: '2.4 寸彩屏 · 双频定位',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20cycling%20computer%20device%20product%20photo%2C%20dark%20background%2C%20premium%20tech%20style%2C%20commercial%20ecommerce%20card&image_size=landscape_4_3',
        description: '适合日常训练与户外导航，提供清晰显示、稳定定位与多设备联动体验。',
        highlights: ['2.4 寸彩屏', '双频定位', '支持蓝牙/ANT+' ],
        parameters: [
          { label: '屏幕', value: '2.4 寸' },
          { label: '定位', value: '双频 GNSS' },
          { label: '连接', value: '蓝牙/ANT+' },
          { label: '续航', value: '24 小时' },
        ],
      },
      {
        key: 'other-computer-mini',
        name: '蓝图智能码表 Mini',
        specs: '1.8 寸彩屏 · 轻量导航',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mini%20cycling%20computer%20device%20product%20photo%2C%20premium%20tech%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '轻量化码表方案，适合通勤、训练和入门导航骑行用户。',
        highlights: ['机身轻巧', '基础导航功能', '适合通勤训练'],
        parameters: [
          { label: '屏幕', value: '1.8 寸' },
          { label: '定位', value: 'GNSS' },
          { label: '连接', value: '蓝牙/ANT+' },
          { label: '续航', value: '18 小时' },
        ],
      },
      {
        key: 'other-computer-mount',
        name: '码表延伸支架',
        specs: '前置安装 · 稳定视角',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cycling%20computer%20mount%20product%20photo%2C%20premium%20tech%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于码表前置安装，提升骑行中数据查看角度和整车前端整洁度。',
        highlights: ['前置延伸安装', '视角更自然', '兼容多类把组'],
        parameters: [
          { label: '类型', value: '码表支架' },
          { label: '安装', value: '把立前置' },
          { label: '材质', value: '铝合金' },
          { label: '适配', value: 'L-TWOO 码表' },
        ],
      },
      {
        key: 'other-heart-rate',
        name: '心率带传感器',
        specs: '实时监测 · 蓝牙/ANT+',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=heart%20rate%20monitor%20chest%20strap%20product%20photo%2C%20premium%20fitness%20tech%20catalog%2C%20dark%20background&image_size=landscape_4_3',
        description: '用于训练强度区间监测和恢复控制，适合与码表、骑行台等设备联动使用。',
        highlights: ['实时心率采集', '支持双协议连接', '训练区间更直观'],
        parameters: [
          { label: '类型', value: '胸带式' },
          { label: '连接', value: '蓝牙/ANT+' },
          { label: '续航', value: '300 小时' },
          { label: '防护', value: 'IPX7' },
        ],
      },
      {
        key: 'other-heart-rate-strap',
        name: '心率带替换绑带',
        specs: '亲肤材质 · 快速更换',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=heart%20rate%20monitor%20replacement%20strap%20product%20photo%2C%20premium%20fitness%20tech%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于胸带传感器的日常替换和维护，适合高频训练用户长期使用。',
        highlights: ['亲肤弹性材质', '更换方便', '适合高频训练'],
        parameters: [
          { label: '类型', value: '替换绑带' },
          { label: '材质', value: '弹性织带' },
          { label: '用途', value: '心率带维护' },
          { label: '适配', value: '胸带式心率传感器' },
        ],
      },
      {
        key: 'other-cadence',
        name: '踏频传感器',
        specs: '骑行效率监测 · 轻量安装',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bicycle%20cadence%20sensor%20product%20photo%2C%20premium%20cycling%20tech%20catalog%2C%20dark%20background&image_size=landscape_4_3',
        description: '帮助车手掌握踏频节奏，适合通勤、训练与耐力骑行的效率优化。',
        highlights: ['踏频数据采集', '安装轻便', '适配多类曲柄'],
        parameters: [
          { label: '类型', value: '踏频传感器' },
          { label: '安装', value: '绑带式' },
          { label: '连接', value: '蓝牙/ANT+' },
          { label: '重量', value: '12g' },
        ],
      },
      {
        key: 'other-speed-sensor',
        name: '速度传感器',
        specs: '速度采集 · 轻量安装',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bicycle%20speed%20sensor%20product%20photo%2C%20premium%20cycling%20tech%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于补充轮速采集数据，适合隧道、林道等弱定位环境骑行记录使用。',
        highlights: ['轮速采集', '安装轻便', '提升记录完整性'],
        parameters: [
          { label: '类型', value: '速度传感器' },
          { label: '安装', value: '花鼓/轮组' },
          { label: '连接', value: '蓝牙/ANT+' },
          { label: '重量', value: '11g' },
        ],
      },
      {
        key: 'other-power-meter',
        name: '功率计曲柄组',
        specs: '功率输出监测 · 训练分析',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cycling%20power%20meter%20crankset%20product%20photo%2C%20premium%20sports%20technology%20catalog%2C%20dark%20background&image_size=landscape_4_3',
        description: '面向结构化训练与功率区间分析场景，适合追求更高训练精度的骑行用户。',
        highlights: ['功率实时输出', '训练分析更精准', '支持码表联动'],
        parameters: [
          { label: '类型', value: '曲柄功率计' },
          { label: '精度', value: '±1.5%' },
          { label: '连接', value: '蓝牙/ANT+' },
          { label: '续航', value: '120 小时' },
        ],
      },
      {
        key: 'other-power-pedal',
        name: '双边功率计脚踏',
        specs: '双边功率采集 · 训练进阶',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dual%20sided%20power%20meter%20pedals%20product%20photo%2C%20premium%20cycling%20tech%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '用于更精细的左右侧功率分析，适合进阶训练和功率结构评估用户。',
        highlights: ['双边功率采集', '左右平衡分析', '适合高阶训练'],
        parameters: [
          { label: '类型', value: '功率计脚踏' },
          { label: '采集', value: '双边' },
          { label: '精度', value: '±1.5%' },
          { label: '连接', value: '蓝牙/ANT+' },
        ],
      },
      {
        key: 'other-power-spider',
        name: 'Spider 功率计',
        specs: '盘爪功率采集 · 公路训练',
        image:
          'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cycling%20spider%20power%20meter%20product%20photo%2C%20premium%20sports%20technology%20catalog%2C%20light%20gray%20background&image_size=landscape_4_3',
        description: '适合公路训练与结构化功率分析，兼顾采集精度和整车适配能力。',
        highlights: ['盘爪采集结构', '采样更稳定', '适合公路训练'],
        parameters: [
          { label: '类型', value: 'Spider 功率计' },
          { label: '精度', value: '±1.5%' },
          { label: '连接', value: '蓝牙/ANT+' },
          { label: '定位', value: '公路训练' },
        ],
      },
    ],
  },
]

export const getProductMatrixCategory = (categoryKey: string) =>
  productMatrixCategories.find((item) => item.key === categoryKey)

export const getProductMatrixItem = (categoryKey: string, productKey: string) =>
  getProductMatrixCategory(categoryKey)?.items.find((item) => item.key === productKey)

export const recentRide = {
  title: '骑行概览',
  date: '2026-07-15 06:40',
  routeName: '环城晨骑',
  distance: '42.6km',
  duration: '1h 48m',
  avgSpeed: '23.5km/h',
  totalMileage: '1,284km',
  totalDuration: '96h',
  totalRides: '42',
  emptyTitle: '暂无骑行记录',
  emptyDescription: '',
}

export const quickActions: QuickAction[] = [
  { key: 'startRide', label: '开始骑行', icon: 'startRide' },
  { key: 'deviceDebug', label: '设备调试', icon: 'deviceDebug' },
  { key: 'routePlan', label: '路线规划', icon: 'routePlan' },
]

export const deviceStatusCards = [
  {
    key: 'connect',
    title: '外设连接状态',
    value: '2 台已连接',
    icon: 'connect',
    description: '',
  },
  {
    key: 'battery',
    title: '外设电量',
    value: '共 3 台外设',
    icon: 'battery',
    details: [
      { label: '电变', value: '86%', tone: 'normal' },
      { label: '码表', value: '72%', tone: 'normal' },
      { label: '功率计', value: '18%', tone: 'danger' },
    ],
  },
  {
    key: 'devices',
    title: '外设列表',
    value: '按外设分类查看',
    icon: 'devices',
    details: [
      { label: '电变', value: '已连接', tone: 'success' },
      { label: '码表', value: '已连接', tone: 'success' },
      { label: '功率计', value: '未连接', tone: 'muted' },
    ],
  },
]

export const tutorialEntry = {
  title: '设备与骑行帮助',
  description: '',
  buttonLabel: '查看',
}

export const tabItems = [
  { key: 'home', label: '首页', icon: 'home' },
  { key: 'data', label: '数据', icon: 'data' },
  { key: 'route', label: '路线', icon: 'route' },
  { key: 'device', label: '设备', icon: 'device' },
  { key: 'profile', label: '我的', icon: 'profile' },
]
