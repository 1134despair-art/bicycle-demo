# Android Architecture

The Android application reuses the existing Vue 3 and Vite interface without duplicating screen code.

- Web application: Vue 3, Vue Router, Pinia, UnoCSS
- Native runtime: Capacitor 8
- Android application ID: `com.ltwoo.bicycle`
- Android web assets: generated from `dist/` and synchronized into `android/`
- Java toolchain: JDK 21
- Android SDK: compile/target API 36, minimum API 24
- Native behavior: real system bars with safe-area insets and Android hardware-back navigation

Use `npm run android:assets` after changing the brand logo, and `npm run android:apk` for an installable debug APK. A production release requires the company's permanent signing keystore and should use `npm run android:bundle` after signing is configured.
