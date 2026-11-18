plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.whiteboard_app"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.example.whiteboard_app"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        // Uses the version code from pubspec.yaml. When using split APKs, 1000 * ABI_VERSION
        // is added automatically by Flutter. (https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)
        // You can force using the value of versionCode by specifying the `-P force-version-code-ignoring-abi=true`
        // flag during build.
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    signingConfigs {
        val keystoreProperties = java.util.Properties()
        val keystorePropertiesFile = rootProject.file("key.properties")
        if (keystorePropertiesFile.exists()) {
            keystorePropertiesFile.inputStream().use { keystoreProperties.load(it) }
        }

        val keystorePath = System.getenv("ANDROID_KEYSTORE_PATH")
            ?: keystoreProperties.getProperty("storeFile")
            ?: if (file("release-keystore.jks").exists()) "release-keystore.jks" else null
        val keystorePassword = System.getenv("ANDROID_KEYSTORE_PASSWORD")
            ?: keystoreProperties.getProperty("storePassword")
        val keyAlias = System.getenv("ANDROID_KEY_ALIAS")
            ?: keystoreProperties.getProperty("keyAlias")
        val keyPassword = System.getenv("ANDROID_KEY_PASSWORD")
            ?: keystoreProperties.getProperty("keyPassword")
            ?: keystorePassword

        if (keystorePath != null &&
            !keystorePassword.isNullOrEmpty() &&
            !keyAlias.isNullOrEmpty() &&
            !keyPassword.isNullOrEmpty()
        ) {
            create("release") {
                storeFile = file(keystorePath)
                storePassword = keystorePassword
                this.keyAlias = keyAlias
                this.keyPassword = keyPassword
            }
        }
    }

    buildTypes {
        release {
            // Uses release keystore when configured via CI secrets or key.properties;
            // falls back to debug keystore for local testing.
            signingConfig = signingConfigs.findByName("release")
                ?: signingConfigs.getByName("debug")
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
