export type MyGender = '男' | '女' | '保密'

export type MyProfile = {
  avatar: string
  account: string
  accountType: string
  nickname: string
  phone: string
  totalMileage: string
  gender: MyGender
  height: string
  weight: string
  bikeWeight: string
}

export type MyStats = {
  weeklyRideCount: string
  weeklyRideDistance: string
  monthlyRideCount: string
  monthlyRideDistance: string
}

export type MyNotificationCategory = 'firmware' | 'push'

export type MyNotificationTarget = {
  type: 'device-firmware'
  deviceId: string
}

export type MyNotification = {
  id: string
  category: MyNotificationCategory
  title: string
  summary: string
  content: string
  time: string
  read: boolean
  target?: MyNotificationTarget
}

export type MyLanguage = 'follow-system' | 'zh-CN' | 'zh-TW' | 'en' | 'es' | 'ko'

export type MySettings = {
  language: MyLanguage
  notificationEnabled: boolean
}

export type MyPrivacySettings = {
  profileVisible: boolean
  rideDataSharable: boolean
  appNotificationAllowed: boolean
  locationAllowed: boolean
}

export type MyMenuEntryKey = 'profile' | 'firmware-notifications' | 'push-notifications' | 'anti-counterfeit' | 'privacy-agreement' | 'privacy-policy' | 'settings' | 'tutorial'

export type MyMenuEntry = {
  key: MyMenuEntryKey
  title: string
  description: string
}

export type MyAvatarOption = {
  key: string
  label: string
  image: string
}

export type TutorialItem = {
  key: string
  title: string
  icon: string
  targetType: 'video-group' | 'manual-list' | 'manual-detail' | 'troubleshooting-list' | 'video-hub'
}

export type TutorialSection = {
  key: string
  title: string
  items: TutorialItem[]
}

export type TutorialVideoItem = {
  key: string
  title: string
  bilibiliTitle: string
  creator: string
  cover: string
  duration: string
  bilibiliUrl: string
}

export type TutorialManualItem = {
  key: string
  title: string
  previewImage: string
}

export type TutorialListPage = {
  key: string
  title: string
  type: 'video' | 'manual'
  items: Array<TutorialVideoItem | TutorialManualItem>
}

export type TutorialExternalPage = {
  key: string
  title: string
  sourceLabel: string
  appName: string
  brandIcon: string
  openLabel: string
  heroTitle: string
  heroSubtitle: string
  heroCover: string
  relatedVideos: Array<{
    key: string
    title: string
    cover: string
    duration: string
  }>
}

export type TutorialManualPage = {
  key: string
  title: string
  image: string
}

export type TutorialTroubleshootingFaq = {
  key: string
  title: string
  steps: string[]
}

const MY_PROFILE_STORAGE_KEY = 'bicycle-demo:my-profile'
const MY_NOTIFICATIONS_STORAGE_KEY = 'bicycle-demo:my-notifications'
const MY_SETTINGS_STORAGE_KEY = 'bicycle-demo:my-settings'
const MY_PRIVACY_SETTINGS_STORAGE_KEY = 'bicycle-demo:my-privacy-settings'

export const myDefaultProfile: MyProfile = {
  avatar:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=asian%20female%20cyclist%20portrait%2C%20clean%20studio%20lighting%2C%20premium%20sports%20app%20profile%20avatar%2C%20soft%20gray%20background%2C%20realistic%20headshot&image_size=square_hd',
  account: 'ltwoo_rainy',
  accountType: '微信',
  nickname: '陈雨晴',
  phone: '13800138000',
  totalMileage: '2,486km',
  gender: '女',
  height: '168',
  weight: '52',
  bikeWeight: '8.1',
}

export const myStatsMock: MyStats = {
  weeklyRideCount: '4 次',
  weeklyRideDistance: '126.8km',
  monthlyRideCount: '11 次',
  monthlyRideDistance: '428.6km',
}

export const myMenuEntries: MyMenuEntry[] = [
  {
    key: 'firmware-notifications',
    title: '固件升级消息提醒',
    description: '查看设备新版本、升级状态与异常提醒',
  },
  {
    key: 'push-notifications',
    title: '后台推送消息',
    description: '查看活动、服务及运营后台推送内容',
  },
  {
    key: 'settings',
    title: '系统设置',
    description: '语言偏好、消息提醒与基础配置',
  },
  {
    key: 'tutorial',
    title: '教程',
    description: '设备绑定、骑行训练与常见问题',
  },
  {
    key: 'privacy-agreement',
    title: '隐私协议',
    description: '查看平台隐私协议及个人信息处理说明',
  },
  {
    key: 'privacy-policy',
    title: '隐私政策',
    description: '查看信息收集、使用、存储与保护政策',
  },
  {
    key: 'anti-counterfeit',
    title: '防伪扫码',
    description: '扫码查询产品真伪、SN 信息与设备归属',
  },
]

export const myAvatarOptions: MyAvatarOption[] = [
  {
    key: 'urban',
    label: '城市通勤',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=young%20asian%20urban%20cyclist%20portrait%2C%20premium%20mobile%20app%20avatar%2C%20soft%20daylight%2C%20clean%20background%2C%20realistic%20headshot&image_size=square_hd',
  },
  {
    key: 'road',
    label: '公路训练',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=asian%20road%20cyclist%20portrait%2C%20helmet%20and%20jersey%2C%20premium%20sports%20profile%20avatar%2C%20studio%20lighting%2C%20realistic&image_size=square_hd',
  },
  {
    key: 'mountain',
    label: '山地越野',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=asian%20mountain%20bike%20rider%20portrait%2C%20premium%20outdoor%20sports%20avatar%2C%20clean%20background%2C%20realistic%20headshot&image_size=square_hd',
  },
]

export const myNotificationMock: MyNotification[] = [
  {
    id: 'notice-firmware',
    category: 'firmware',
    title: '固件升级提醒',
    summary: '你的智能码表有新版本可更新，建议在下次骑行前完成升级。',
    content:
      '你的智能码表有新版本可更新，建议在下次骑行前完成升级，以获得更稳定的连接表现与路线同步体验。',
    time: '今天 09:30',
    read: false,
    target: {
      type: 'device-firmware',
      deviceId: 'device-bike-computer-pro',
    },
  },
  {
    id: 'notice-training',
    category: 'push',
    title: '训练计划已生成',
    summary: '系统已根据你本周骑行负荷生成新的 7 日训练建议。',
    content:
      '系统已根据你本周骑行负荷生成新的 7 日训练建议，打开训练中心即可查看耐力骑、间歇课与恢复骑安排。',
    time: '昨天 18:20',
    read: true,
  },
  {
    id: 'notice-service',
    category: 'push',
    title: '车辆保养建议',
    summary: '你已累计骑行 500km，建议检查链条磨损与轮胎胎压。',
    content:
      '你已累计骑行 500km，建议在下一次骑行前检查链条磨损、轮胎胎压以及刹车皮状态，保持整车传动与制动性能稳定。',
    time: '07-18 10:15',
    read: false,
  },
]

export const myLanguageOptions: Array<{ value: MyLanguage, label: string, description: string }> = [
  {
    value: 'follow-system',
    label: '跟随系统',
    description: '自动匹配手机当前系统语言',
  },
  {
    value: 'zh-CN',
    label: '简体中文',
    description: '适用于中国大陆地区',
  },
  {
    value: 'zh-TW',
    label: '繁体中文',
    description: '适用于港澳台地区',
  },
  {
    value: 'en',
    label: '英语',
    description: 'English',
  },
  {
    value: 'es',
    label: '西班牙语',
    description: 'Espanol',
  },
  {
    value: 'ko',
    label: '韩语',
    description: '한국어',
  },
]

export const myTutorialSections: TutorialSection[] = [
  {
    key: 'road-groupset',
    title: '公路电变套件',
    items: [
      { key: 'road-shifter', title: '手变', icon: '手', targetType: 'video-group' },
      { key: 'road-front-derailleur', title: '前拨', icon: '前', targetType: 'video-group' },
      { key: 'road-rear-derailleur', title: '后拨', icon: '后', targetType: 'video-group' },
      { key: 'road-caliper', title: '夹器', icon: '夹', targetType: 'video-group' },
      { key: 'road-more', title: '更多', icon: '更', targetType: 'video-group' },
    ],
  },
  {
    key: 'tt-groupset',
    title: 'TT 公路电变套件',
    items: [
      { key: 'tt-controller', title: '控制器', icon: '控', targetType: 'video-group' },
      { key: 'tt-front-derailleur', title: '前拨', icon: '前', targetType: 'video-group' },
      { key: 'tt-rear-derailleur', title: '后拨', icon: '后', targetType: 'video-group' },
      { key: 'tt-caliper', title: '夹器', icon: '夹', targetType: 'video-group' },
      { key: 'tt-more', title: '更多', icon: '更', targetType: 'video-group' },
    ],
  },
  {
    key: 'mtb-groupset',
    title: '山地电变',
    items: [
      { key: 'mtb-shifter', title: '指拨', icon: '指', targetType: 'video-group' },
      { key: 'mtb-rear-derailleur', title: '后拨', icon: '后', targetType: 'video-group' },
      { key: 'mtb-caliper', title: '夹器', icon: '夹', targetType: 'video-group' },
      { key: 'mtb-more', title: '更多', icon: '更', targetType: 'video-group' },
    ],
  },
  {
    key: 'other-tutorials',
    title: '其它',
    items: [
      { key: 'manual', title: '手册', icon: '册', targetType: 'manual-list' },
      { key: 'troubleshooting', title: '故障排查', icon: '障', targetType: 'troubleshooting-list' },
      { key: 'video', title: '视频', icon: '播', targetType: 'video-hub' },
    ],
  },
]

const buildCover = (prompt: string) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_16_9`

export const tutorialListPages: Record<string, TutorialListPage> = {
  'road-shifter': {
    key: 'road-shifter',
    title: '手变',
    type: 'video',
    items: [
      { key: 'road-shifter-install', title: '电子手变 - 安装教程', bilibiliTitle: '蓝图电子手变 - 安装教程', creator: '四蓝图变速', duration: '01:13', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('road bike electronic shifter installation tutorial thumbnail, premium cycling component close-up, dark background') },
      { key: 'road-shifter-battery-1', title: '电子手变 - 电池更换-方法一', bilibiliTitle: '蓝图电子手变 - 电池更换方法一', creator: '四蓝图变速', duration: '02:08', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('road bike shifter battery replacement tutorial thumbnail, cycling workshop, realistic product close-up') },
      { key: 'road-shifter-battery-2', title: '电子手变 - 电池更换-方法二', bilibiliTitle: '蓝图电子手变 - 电池更换方法二', creator: '四蓝图变速', duration: '02:15', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('electronic bike shifter battery replacement tutorial, premium app video cover, close-up component view') },
      { key: 'road-shifter-hood-1', title: '电子手变 - 胶套更换-方法一', bilibiliTitle: '蓝图电子手变 - 胶套更换方法一', creator: '四蓝图变速', duration: '01:48', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('bicycle shifter hood replacement tutorial, realistic component close-up, dark studio') },
      { key: 'road-shifter-hood-2', title: '电子手变 - 胶套更换-方法二', bilibiliTitle: '蓝图电子手变 - 胶套更换方法二', creator: '四蓝图变速', duration: '01:56', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('road bike shifter rubber hood replacement tutorial thumbnail, premium sports tech product') },
    ],
  },
  'road-front-derailleur': {
    key: 'road-front-derailleur',
    title: '前拨',
    type: 'video',
    items: [
      { key: 'road-front-install', title: '电子前拨 - 安装教程', bilibiliTitle: '蓝图电子前拨 - 安装教程', creator: '四蓝图变速', duration: '03:21', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('electronic front derailleur installation tutorial, road bike drivetrain close-up') },
      { key: 'road-front-limit', title: '电子前拨 - 限位调节', bilibiliTitle: '蓝图电子前拨 - 限位调节', creator: '四蓝图变速', duration: '02:34', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('front derailleur limit adjustment tutorial thumbnail, bicycle drivetrain close-up') },
      { key: 'road-front-pair', title: '电子前拨 - 对码连接', bilibiliTitle: '蓝图电子前拨 - 对码连接', creator: '四蓝图变速', duration: '01:59', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('electronic bike front derailleur pairing tutorial, modern cycling electronics') },
    ],
  },
  'road-rear-derailleur': {
    key: 'road-rear-derailleur',
    title: '后拨',
    type: 'video',
    items: [
      { key: 'road-rear-install', title: '电子后拨 - 安装教程', bilibiliTitle: '蓝图电子后拨 - 安装教程', creator: '四蓝图变速', duration: '03:05', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('electronic rear derailleur installation tutorial, premium bicycle drivetrain close-up') },
      { key: 'road-rear-adjust', title: '电子后拨 - 变速调节', bilibiliTitle: '蓝图电子后拨 - 变速调节', creator: '四蓝图变速', duration: '02:42', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('rear derailleur indexing tutorial thumbnail, road bike cassette close-up') },
      { key: 'road-rear-charge', title: '电子后拨 - 充电与维护', bilibiliTitle: '蓝图电子后拨 - 充电与维护', creator: '四蓝图变速', duration: '01:46', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('electronic rear derailleur charging tutorial, realistic cycling component photo') },
    ],
  },
  'road-caliper': {
    key: 'road-caliper',
    title: '夹器',
    type: 'video',
    items: [
      { key: 'road-caliper-install', title: '电子夹器 - 安装教程', bilibiliTitle: '蓝图电子夹器 - 安装教程', creator: '四蓝图变速', duration: '02:54', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('bike brake caliper installation tutorial thumbnail, premium disc brake close-up') },
      { key: 'road-caliper-pad', title: '电子夹器 - 来令片更换', bilibiliTitle: '蓝图电子夹器 - 来令片更换', creator: '四蓝图变速', duration: '02:18', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('disc brake pad replacement tutorial, road bike brake system close-up') },
    ],
  },
  'road-more': {
    key: 'road-more',
    title: '更多',
    type: 'video',
    items: [
      { key: 'road-more-app', title: '公路电变套件 - App 连接', bilibiliTitle: '公路电变套件 - App 连接教程', creator: '四蓝图变速', duration: '01:36', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('bike electronic groupset app pairing tutorial, smartphone and bike component') },
      { key: 'road-more-upgrade', title: '公路电变套件 - 固件升级', bilibiliTitle: '公路电变套件 - 固件升级教程', creator: '四蓝图变速', duration: '02:11', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('bike electronic groupset firmware upgrade tutorial thumbnail') },
    ],
  },
  'tt-controller': {
    key: 'tt-controller',
    title: '控制器',
    type: 'video',
    items: [
      { key: 'tt-controller-install', title: 'TT 控制器 - 安装教程', bilibiliTitle: 'TT 控制器 - 安装教程', creator: '四蓝图变速', duration: '02:28', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('time trial bike controller installation tutorial, premium cockpit component close-up') },
      { key: 'tt-controller-bind', title: 'TT 控制器 - 对码连接', bilibiliTitle: 'TT 控制器 - 对码连接', creator: '四蓝图变速', duration: '01:52', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('tt bike controller pairing tutorial, modern cycling electronics') },
    ],
  },
  'tt-front-derailleur': {
    key: 'tt-front-derailleur',
    title: '前拨',
    type: 'video',
    items: [
      { key: 'tt-front-install', title: 'TT 前拨 - 安装教程', bilibiliTitle: 'TT 前拨 - 安装教程', creator: '四蓝图变速', duration: '02:41', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('tt bike front derailleur installation tutorial, aerodynamic road bike drivetrain') },
    ],
  },
  'tt-rear-derailleur': {
    key: 'tt-rear-derailleur',
    title: '后拨',
    type: 'video',
    items: [
      { key: 'tt-rear-install', title: 'TT 后拨 - 安装教程', bilibiliTitle: 'TT 后拨 - 安装教程', creator: '四蓝图变速', duration: '02:47', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('tt bike rear derailleur installation tutorial, premium component close-up') },
    ],
  },
  'tt-caliper': {
    key: 'tt-caliper',
    title: '夹器',
    type: 'video',
    items: [
      { key: 'tt-caliper-install', title: 'TT 夹器 - 安装教程', bilibiliTitle: 'TT 夹器 - 安装教程', creator: '四蓝图变速', duration: '02:19', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('tt bike brake caliper installation tutorial thumbnail, performance cycling brake system') },
    ],
  },
  'tt-more': {
    key: 'tt-more',
    title: '更多',
    type: 'video',
    items: [
      { key: 'tt-more-wireless', title: 'TT 套件 - 无线连接教程', bilibiliTitle: 'TT 套件 - 无线连接教程', creator: '四蓝图变速', duration: '01:43', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('time trial bike wireless groupset connection tutorial thumbnail') },
    ],
  },
  'mtb-shifter': {
    key: 'mtb-shifter',
    title: '指拨',
    type: 'video',
    items: [
      { key: 'mtb-shifter-install', title: '山地指拨 - 安装教程', bilibiliTitle: '山地指拨 - 安装教程', creator: '四蓝图变速', duration: '02:24', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('mountain bike electronic shifter installation tutorial, realistic cockpit close-up') },
    ],
  },
  'mtb-rear-derailleur': {
    key: 'mtb-rear-derailleur',
    title: '后拨',
    type: 'video',
    items: [
      { key: 'mtb-rear-install', title: '山地后拨 - 安装教程', bilibiliTitle: '山地后拨 - 安装教程', creator: '四蓝图变速', duration: '02:58', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('mountain bike rear derailleur installation tutorial, realistic drivetrain photo') },
    ],
  },
  'mtb-caliper': {
    key: 'mtb-caliper',
    title: '夹器',
    type: 'video',
    items: [
      { key: 'mtb-caliper-install', title: '山地夹器 - 安装教程', bilibiliTitle: '山地夹器 - 安装教程', creator: '四蓝图变速', duration: '02:16', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('mountain bike brake caliper installation tutorial thumbnail, rugged bicycle brake close-up') },
    ],
  },
  'mtb-more': {
    key: 'mtb-more',
    title: '更多',
    type: 'video',
    items: [
      { key: 'mtb-more-sync', title: '山地电变 - 同步设置教程', bilibiliTitle: '山地电变 - 同步设置教程', creator: '四蓝图变速', duration: '01:41', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('mountain bike electronic shifting sync tutorial, premium sports tech thumbnail') },
    ],
  },
  manual: {
    key: 'manual',
    title: '手册',
    type: 'manual',
    items: [
      { key: 'manual-road', title: '公路电子变速套件-用户手册', previewImage: buildCover('road electronic groupset user manual cover page, premium document mockup') },
      { key: 'manual-tt', title: 'TT 公路电子变速套件-用户手册', previewImage: buildCover('time trial electronic groupset user manual cover, premium document page') },
      { key: 'manual-egr', title: 'eGR 砾石电子变速-用户手册', previewImage: buildCover('gravel bike electronic groupset user manual cover page') },
      { key: 'manual-etx', title: 'eTX 山地电子变速套件-用户手册', previewImage: buildCover('mountain bike electronic groupset user manual cover') },
      { key: 'manual-er9', title: 'eR9 折叠车电变-用户手册', previewImage: buildCover('folding bike electronic shifting user manual cover page') },
    ],
  },
  video: {
    key: 'video',
    title: '视频',
    type: 'video',
    items: [
      { key: 'video-hub-overview', title: '蓝图变速 - 热门视频合集', bilibiliTitle: '蓝图变速 - 热门视频合集', creator: '四蓝图变速', duration: '04:02', bilibiliUrl: 'https://www.bilibili.com/', cover: buildCover('cycling tutorial video hub thumbnail, premium sports tech collage') },
    ],
  },
}

export const tutorialManualPages: Record<string, TutorialManualPage> = {
  'manual-road': {
    key: 'manual-road',
    title: '公路电子变速套件',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=full%20page%20technical%20manual%20for%20road%20electronic%20bike%20groupset%2C%20black%20text%20on%20white%20document%2C%20bicycle%20diagram%2C%20product%20illustrations%2C%20user%20guide%20page&image_size=portrait_16_9',
  },
  'manual-tt': {
    key: 'manual-tt',
    title: 'TT 公路电子变速套件',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=technical%20manual%20page%20for%20time%20trial%20electronic%20bike%20groupset%2C%20clean%20white%20document%2C%20detailed%20diagram&image_size=portrait_16_9',
  },
  'manual-egr': {
    key: 'manual-egr',
    title: 'eGR 砾石电子变速',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=technical%20manual%20page%20for%20gravel%20bike%20electronic%20groupset%2C%20white%20document%20layout%20with%20diagrams&image_size=portrait_16_9',
  },
  'manual-etx': {
    key: 'manual-etx',
    title: 'eTX 山地电子变速套件',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=technical%20manual%20page%20for%20mountain%20bike%20electronic%20shifting%20system%2C%20white%20document%20with%20bike%20diagram&image_size=portrait_16_9',
  },
  'manual-er9': {
    key: 'manual-er9',
    title: 'eR9 折叠车电变',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=technical%20manual%20page%20for%20folding%20bike%20electronic%20shifting%20system%2C%20clean%20document%20layout&image_size=portrait_16_9',
  },
}

export const tutorialTroubleshootingFaqs: TutorialTroubleshootingFaq[] = [
  {
    key: 'piston-no-rebound',
    title: '活塞不可弹',
    steps: [
      '检查手变回弹速度是否正常，若手变回弹速度缓慢，有可能是手变活塞回弹慢导致夹器活塞无法回弹。',
      '使用撬胎棒等软质工具压动活塞，观察是否回位；如不回位，则可能为活塞卡滞。',
    ],
  },
  {
    key: 'weak-braking-force',
    title: '刹车制动力变小，或失去制动力',
    steps: [
      '检查手变顶部注油螺丝、排气螺丝，以及橄榄头连接位置是否存在滑牙或漏油情况。',
      '拧开排气螺丝观察制动力油液是否缺少，若液面较低则需要重新加注油液。',
      '检查夹器重新注油时是否将活塞回位，若未回位会导致油路空间释放较多，出现绵软制动力。',
      '拆下来令片检查背面是否漏油，同时查看夹器注油孔位附近是否有油污，以确认活塞是否漏油。',
      '若来令片磨损较大导致盘片间隙变大，需要更换来令片，或重新补油并排净油路内空气。',
      '按以上步骤排查后仍然手感疲软，建议联系售后进一步检查油封与密封组件。',
    ],
  },
  {
    key: 'cannot-fill-oil',
    title: '手变无法注油，或注油量非常小。',
    steps: [
      '确认注油口、排气口与油针规格匹配，并检查孔位是否被异物堵塞。',
      '若仍无法正常注油，建议停止操作并联系售后检测手变油路。',
    ],
  },
  {
    key: 'rear-derailleur-upgrade-failed',
    title: '电子后拨程序升级失败（变砖）',
    steps: [
      '确认电量充足、蓝牙连接稳定，并重新进入升级流程。',
      '如多次升级失败，请通过售后恢复流程重新刷写固件。',
    ],
  },
  {
    key: 'app-control-side',
    title: 'APP无法切换左右控制逻辑',
    steps: [
      '检查设备是否已完成配对，并确认当前固件版本支持左右控制逻辑切换。',
      '若页面无切换入口或切换失败，建议重新连接设备后再次尝试。',
    ],
  },
  {
    key: 'battery-drains-fast',
    title: '手变耗电速度快',
    steps: [
      '检查电池安装是否牢固，确认是否存在频繁唤醒、长时间连接异常等情况。',
      '若更换电池后仍耗电异常，建议联系售后检测主板与按键模块。',
    ],
  },
]

export const tutorialExternalPages: Record<string, TutorialExternalPage> = Object.fromEntries(
  Object.values(tutorialListPages)
    .flatMap((page) => page.type === 'video' ? page.items as TutorialVideoItem[] : [])
    .map((item) => [
      item.key,
      {
        key: item.key,
        title: item.title,
        sourceLabel: 'bilibili.com',
        appName: '哔哩哔哩',
        brandIcon: buildCover('pink bilibili style app icon, rounded square, clean app icon mockup'),
        openLabel: '打开',
        heroTitle: item.bilibiliTitle,
        heroSubtitle: item.creator,
        heroCover: item.cover,
        relatedVideos: [
          {
            key: `${item.key}-related-1`,
            title: '新手调变速器 - 后拨篇',
            cover: buildCover('bike derailleur tutorial related video thumbnail, yellow text on dark cycling image'),
            duration: '04:06',
          },
          {
            key: `${item.key}-related-2`,
            title: '调变速的口诀',
            cover: buildCover('bike shifting adjustment tutorial thumbnail, cycling workshop scene'),
            duration: '00:26',
          },
          {
            key: `${item.key}-related-3`,
            title: '蓝图油碟现状',
            cover: buildCover('bike hydraulic brake tutorial thumbnail, dark mechanic scene'),
            duration: '01:52',
          },
          {
            key: `${item.key}-related-4`,
            title: '蓝图无线后拨功能键介绍',
            cover: buildCover('wireless rear derailleur feature introduction thumbnail, premium product close-up'),
            duration: '03:11',
          },
        ],
      } satisfies TutorialExternalPage,
    ]),
)

export const myDefaultSettings: MySettings = {
  language: 'follow-system',
  notificationEnabled: true,
}

export const myDefaultPrivacySettings: MyPrivacySettings = {
  profileVisible: true,
  rideDataSharable: true,
  appNotificationAllowed: true,
  locationAllowed: true,
}

const cloneMyProfile = (profile: MyProfile): MyProfile => ({
  ...profile,
})

const mergeMyProfile = (profile: Partial<MyProfile>): MyProfile => ({
  ...myDefaultProfile,
  ...profile,
})

const cloneMyNotification = (notification: MyNotification): MyNotification => ({
  ...notification,
  target: notification.target ? { ...notification.target } : undefined,
})

const mergeMyNotification = (notification: MyNotification): MyNotification => {
  const fallback = myNotificationMock.find((item) => item.id === notification.id)

  return cloneMyNotification({
    ...fallback,
    ...notification,
    target: notification.target ?? fallback?.target,
  })
}

const cloneMySettings = (settings: MySettings): MySettings => ({
  ...settings,
})

const cloneMyPrivacySettings = (settings: MyPrivacySettings): MyPrivacySettings => ({
  ...settings,
})

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const isMyGender = (value: unknown): value is MyGender =>
  value === '男' || value === '女' || value === '保密'

const isMyProfile = (value: unknown): value is MyProfile => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const profile = value as MyProfile

  return typeof profile.avatar === 'string'
    && typeof profile.account === 'string'
    && typeof profile.accountType === 'string'
    && typeof profile.nickname === 'string'
    && typeof profile.phone === 'string'
    && typeof profile.totalMileage === 'string'
    && isMyGender(profile.gender)
    && typeof profile.height === 'string'
    && typeof profile.weight === 'string'
    && typeof profile.bikeWeight === 'string'
}

const isMyLanguage = (value: unknown): value is MyLanguage =>
  value === 'follow-system'
  || value === 'zh-CN'
  || value === 'zh-TW'
  || value === 'en'
  || value === 'es'
  || value === 'ko'

const isMyNotification = (value: unknown): value is MyNotification => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const notification = value as MyNotification
  const targetIsValid = notification.target === undefined
    || (typeof notification.target === 'object'
      && notification.target !== null
      && notification.target.type === 'device-firmware'
      && typeof notification.target.deviceId === 'string')

  return typeof notification.id === 'string'
    && (notification.category === 'firmware' || notification.category === 'push')
    && typeof notification.title === 'string'
    && typeof notification.summary === 'string'
    && typeof notification.content === 'string'
    && typeof notification.time === 'string'
    && typeof notification.read === 'boolean'
    && targetIsValid
}

const isMySettings = (value: unknown): value is MySettings => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const settings = value as MySettings

  return isMyLanguage(settings.language)
    && typeof settings.notificationEnabled === 'boolean'
}

const isMyPrivacySettings = (value: unknown): value is MyPrivacySettings => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const settings = value as MyPrivacySettings

  return typeof settings.profileVisible === 'boolean'
    && typeof settings.rideDataSharable === 'boolean'
    && typeof settings.appNotificationAllowed === 'boolean'
    && typeof settings.locationAllowed === 'boolean'
}

export const loadMyProfile = () => {
  if (!canUseStorage()) {
    return cloneMyProfile(myDefaultProfile)
  }

  try {
    const rawValue = window.localStorage.getItem(MY_PROFILE_STORAGE_KEY)
    if (!rawValue) {
      return cloneMyProfile(myDefaultProfile)
    }

    const parsedValue = JSON.parse(rawValue)
    return isMyProfile(parsedValue) ? mergeMyProfile(parsedValue) : cloneMyProfile(myDefaultProfile)
  }
  catch {
    return cloneMyProfile(myDefaultProfile)
  }
}

export const saveMyProfile = (profile: MyProfile) => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(MY_PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

export const loadMyNotifications = () => {
  if (!canUseStorage()) {
    return myNotificationMock.map(cloneMyNotification)
  }

  try {
    const rawValue = window.localStorage.getItem(MY_NOTIFICATIONS_STORAGE_KEY)
    if (!rawValue) {
      return myNotificationMock.map(cloneMyNotification)
    }

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue) || !parsedValue.every(isMyNotification)) {
      return myNotificationMock.map(cloneMyNotification)
    }

    return parsedValue.map(mergeMyNotification)
  }
  catch {
    return myNotificationMock.map(cloneMyNotification)
  }
}

export const saveMyNotifications = (notifications: MyNotification[]) => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(MY_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
}

export const markMyNotificationAsRead = (messageId: string) => {
  const notifications = loadMyNotifications()
  const nextNotifications = notifications.map((item) =>
    item.id === messageId ? { ...item, read: true } : item,
  )

  saveMyNotifications(nextNotifications)
  return nextNotifications.find((item) => item.id === messageId) ?? null
}

export const loadMySettings = () => {
  if (!canUseStorage()) {
    return cloneMySettings(myDefaultSettings)
  }

  try {
    const rawValue = window.localStorage.getItem(MY_SETTINGS_STORAGE_KEY)
    if (!rawValue) {
      return cloneMySettings(myDefaultSettings)
    }

    const parsedValue = JSON.parse(rawValue)
    return isMySettings(parsedValue) ? cloneMySettings(parsedValue) : cloneMySettings(myDefaultSettings)
  }
  catch {
    return cloneMySettings(myDefaultSettings)
  }
}

export const saveMySettings = (settings: MySettings) => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(MY_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export const loadMyPrivacySettings = () => {
  if (!canUseStorage()) {
    return cloneMyPrivacySettings(myDefaultPrivacySettings)
  }

  try {
    const rawValue = window.localStorage.getItem(MY_PRIVACY_SETTINGS_STORAGE_KEY)
    if (!rawValue) {
      return cloneMyPrivacySettings(myDefaultPrivacySettings)
    }

    const parsedValue = JSON.parse(rawValue)
    return isMyPrivacySettings(parsedValue)
      ? cloneMyPrivacySettings(parsedValue)
      : cloneMyPrivacySettings(myDefaultPrivacySettings)
  }
  catch {
    return cloneMyPrivacySettings(myDefaultPrivacySettings)
  }
}

export const saveMyPrivacySettings = (settings: MyPrivacySettings) => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(MY_PRIVACY_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}
