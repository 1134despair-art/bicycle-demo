import { createRouter, createWebHashHistory } from 'vue-router'

import AuthCodeConfirmPage from '../pages/AuthCodeConfirmPage.vue'
import AuthEntryPage from '../pages/AuthEntryPage.vue'
import AppleLoginPage from '../pages/AppleLoginPage.vue'
import AuthPasswordLoginPage from '../pages/AuthPasswordLoginPage.vue'
import AuthRegisterPage from '../pages/AuthRegisterPage.vue'
import AuthVerifyLoginPage from '../pages/AuthVerifyLoginPage.vue'
import DeviceAltitudeCalibrationPage from '../pages/DeviceAltitudeCalibrationPage.vue'
import DeviceAlertSettingsPage from '../pages/DeviceAlertSettingsPage.vue'
import DeviceCategoryPage from '../pages/DeviceCategoryPage.vue'
import DeviceDataManagementPage from '../pages/DeviceDataManagementPage.vue'
import DeviceDetailPage from '../pages/DeviceDetailPage.vue'
import DeviceDerailleurSettingsPage from '../pages/DeviceDerailleurSettingsPage.vue'
import DeviceFirmwarePage from '../pages/DeviceFirmwarePage.vue'
import DeviceLanguagePage from '../pages/DeviceLanguagePage.vue'
import DeviceMorePage from '../pages/DeviceMorePage.vue'
import DeviceOtherSettingsPage from '../pages/DeviceOtherSettingsPage.vue'
import DevicePageSettingsPage from '../pages/DevicePageSettingsPage.vue'
import DevicePage from '../pages/DevicePage.vue'
import DevicePowerManagementPage from '../pages/DevicePowerManagementPage.vue'
import DeviceSensorSearchPage from '../pages/DeviceSensorSearchPage.vue'
import DeviceSensorsPage from '../pages/DeviceSensorsPage.vue'
import DataHistoryPage from '../pages/DataHistoryPage.vue'
import DataPage from '../pages/DataPage.vue'
import ForgotPasswordPage from '../pages/ForgotPasswordPage.vue'
import GoogleLoginPage from '../pages/GoogleLoginPage.vue'
import HomePage from '../pages/HomePage.vue'
import LiveRidePage from '../pages/LiveRidePage.vue'
import MyNotificationDetailPage from '../pages/MyNotificationDetailPage.vue'
import MyNotificationsPage from '../pages/MyNotificationsPage.vue'
import MyAntiCounterfeitResultPage from '../pages/MyAntiCounterfeitResultPage.vue'
import MyAntiCounterfeitScanPage from '../pages/MyAntiCounterfeitScanPage.vue'
import MyPage from '../pages/MyPage.vue'
import MyPrivacyPage from '../pages/MyPrivacyPage.vue'
import MyProfilePage from '../pages/MyProfilePage.vue'
import MySettingsPage from '../pages/MySettingsPage.vue'
import MyTutorialListPage from '../pages/MyTutorialListPage.vue'
import MyTutorialManualDetailPage from '../pages/MyTutorialManualDetailPage.vue'
import MyTutorialPage from '../pages/MyTutorialPage.vue'
import MyTutorialTroubleshootingPage from '../pages/MyTutorialTroubleshootingPage.vue'
import MyTutorialVideoPage from '../pages/MyTutorialVideoPage.vue'
import ProductDetailPage from '../pages/ProductDetailPage.vue'
import ProductMatrixPage from '../pages/ProductMatrixPage.vue'
import ProductRecommendedListPage from '../pages/ProductRecommendedListPage.vue'
import ResetPasswordSuccessPage from '../pages/ResetPasswordSuccessPage.vue'
import ResetPasswordVerifyPage from '../pages/ResetPasswordVerifyPage.vue'
import RideDetailPage from '../pages/RideDetailPage.vue'
import RouteDetailPage from '../pages/RouteDetailPage.vue'
import RouteHistoryGeneratePage from '../pages/RouteHistoryGeneratePage.vue'
import RouteImportPage from '../pages/RouteImportPage.vue'
import RouteMapCreatePage from '../pages/RouteMapCreatePage.vue'
import RoutePage from '../pages/RoutePage.vue'
import RouteSavePage from '../pages/RouteSavePage.vue'
import WechatLoginPage from '../pages/WechatLoginPage.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'auth-entry',
      component: AuthEntryPage,
    },
    {
      path: '/auth/verify-login',
      name: 'auth-verify-login',
      component: AuthVerifyLoginPage,
    },
    {
      path: '/auth/code',
      name: 'auth-code-confirm',
      component: AuthCodeConfirmPage,
    },
    {
      path: '/auth/password',
      name: 'auth-password-login',
      component: AuthPasswordLoginPage,
    },
    {
      path: '/auth/register',
      name: 'auth-register',
      component: AuthRegisterPage,
    },
    {
      path: '/auth/forgot-password',
      name: 'auth-forgot-password',
      component: ForgotPasswordPage,
    },
    {
      path: '/auth/reset-password-verify',
      name: 'auth-reset-password-verify',
      component: ResetPasswordVerifyPage,
    },
    {
      path: '/auth/reset-password-success',
      name: 'auth-reset-password-success',
      component: ResetPasswordSuccessPage,
    },
    {
      path: '/auth/third-party/wechat',
      name: 'auth-third-party-wechat',
      component: WechatLoginPage,
    },
    {
      path: '/auth/third-party/apple',
      name: 'auth-third-party-apple',
      component: AppleLoginPage,
    },
    {
      path: '/auth/third-party/google',
      name: 'auth-third-party-google',
      component: GoogleLoginPage,
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/my',
      name: 'my',
      component: MyPage,
    },
    {
      path: '/my/profile',
      name: 'my-profile',
      component: MyProfilePage,
    },
    {
      path: '/my/notifications',
      name: 'my-notifications',
      component: MyNotificationsPage,
    },
    {
      path: '/my/notifications/:messageId',
      name: 'my-notification-detail',
      component: MyNotificationDetailPage,
    },
    {
      path: '/my/anti-counterfeit',
      name: 'my-anti-counterfeit-scan',
      component: MyAntiCounterfeitScanPage,
    },
    {
      path: '/my/anti-counterfeit/result',
      name: 'my-anti-counterfeit-result',
      component: MyAntiCounterfeitResultPage,
    },
    {
      path: '/my/settings',
      name: 'my-settings',
      component: MySettingsPage,
    },
    {
      path: '/my/privacy',
      redirect: '/my/privacy/agreement',
    },
    {
      path: '/my/privacy/:documentType',
      name: 'my-privacy-document',
      component: MyPrivacyPage,
    },
    {
      path: '/my/tutorials',
      name: 'my-tutorials',
      component: MyTutorialPage,
    },
    {
      path: '/my/tutorials/troubleshooting',
      name: 'my-tutorial-troubleshooting',
      component: MyTutorialTroubleshootingPage,
    },
    {
      path: '/my/tutorials/list/:listKey',
      name: 'my-tutorial-list',
      component: MyTutorialListPage,
    },
    {
      path: '/my/tutorials/manual/:manualKey',
      name: 'my-tutorial-manual-detail',
      component: MyTutorialManualDetailPage,
    },
    {
      path: '/my/tutorials/video/:videoKey',
      name: 'my-tutorial-video',
      component: MyTutorialVideoPage,
    },
    {
      path: '/products/:category',
      name: 'product-matrix',
      component: ProductMatrixPage,
    },
    {
      path: '/products/recommended/list',
      name: 'product-recommended-list',
      component: ProductRecommendedListPage,
    },
    {
      path: '/products/:category/:product',
      name: 'product-detail',
      component: ProductDetailPage,
    },
    {
      path: '/device',
      name: 'device',
      component: DevicePage,
    },
    {
      path: '/device/more',
      name: 'device-more',
      component: DeviceMorePage,
    },
    {
      path: '/device/more/:categoryKey',
      name: 'device-category',
      component: DeviceCategoryPage,
    },
    {
      path: '/device/:deviceId',
      name: 'device-detail',
      component: DeviceDetailPage,
    },
    {
      path: '/device/:deviceId/data-management',
      name: 'device-data-management',
      component: DeviceDataManagementPage,
    },
    {
      path: '/device/:deviceId/sensors',
      name: 'device-sensors',
      component: DeviceSensorsPage,
    },
    {
      path: '/device/:deviceId/sensors/search',
      name: 'device-sensor-search',
      component: DeviceSensorSearchPage,
    },
    {
      path: '/device/:deviceId/altitude-calibration',
      name: 'device-altitude-calibration',
      component: DeviceAltitudeCalibrationPage,
    },
    {
      path: '/device/:deviceId/firmware',
      name: 'device-firmware',
      component: DeviceFirmwarePage,
    },
    {
      path: '/device/:deviceId/derailleur-settings',
      name: 'device-derailleur-settings',
      component: DeviceDerailleurSettingsPage,
    },
    {
      path: '/device/:deviceId/page-settings',
      name: 'device-page-settings',
      component: DevicePageSettingsPage,
    },
    {
      path: '/device/:deviceId/alert-settings',
      name: 'device-alert-settings',
      component: DeviceAlertSettingsPage,
    },
    {
      path: '/device/:deviceId/power-management',
      name: 'device-power-management',
      component: DevicePowerManagementPage,
    },
    {
      path: '/device/:deviceId/language',
      name: 'device-language',
      component: DeviceLanguagePage,
    },
    {
      path: '/device/:deviceId/other-settings',
      name: 'device-other-settings',
      component: DeviceOtherSettingsPage,
    },
    {
      path: '/data',
      name: 'data',
      component: DataPage,
    },
    {
      path: '/data/history',
      name: 'data-history',
      component: DataHistoryPage,
    },
    {
      path: '/data/ride/:rideId',
      name: 'ride-detail',
      component: RideDetailPage,
    },
    {
      path: '/data/live',
      name: 'live-ride',
      component: LiveRidePage,
    },
    {
      path: '/routes',
      name: 'routes',
      component: RoutePage,
    },
    {
      path: '/routes/create/map',
      name: 'route-create-map',
      component: RouteMapCreatePage,
    },
    {
      path: '/routes/create/history',
      name: 'route-create-history',
      component: RouteHistoryGeneratePage,
    },
    {
      path: '/routes/create/import',
      name: 'route-create-import',
      component: RouteImportPage,
    },
    {
      path: '/routes/save',
      name: 'route-save',
      component: RouteSavePage,
    },
    {
      path: '/routes/:routeId',
      name: 'route-detail',
      component: RouteDetailPage,
    },
  ],
})
