package com.example.whiteboard_app

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.File
import java.security.MessageDigest
import java.util.concurrent.Executors

class MainActivity : FlutterActivity() {
    companion object {
        private const val UPDATER_CHANNEL = "com.example.whiteboard_app/updater"
    }

    private val ioExecutor = Executors.newSingleThreadExecutor()

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, UPDATER_CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "getAppInfo" -> {
                        try {
                            val packageInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                                packageManager.getPackageInfo(
                                    packageName,
                                    PackageManager.PackageInfoFlags.of(0),
                                )
                            } else {
                                @Suppress("DEPRECATION")
                                packageManager.getPackageInfo(packageName, 0)
                            }
                            val versionName = packageInfo.versionName ?: "1.0.0"
                            val buildNumber = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                                packageInfo.longVersionCode
                            } else {
                                @Suppress("DEPRECATION")
                                packageInfo.versionCode.toLong()
                            }
                            result.success(
                                mapOf(
                                    "versionName" to versionName,
                                    "buildNumber" to buildNumber.toInt(),
                                    "packageName" to packageName,
                                ),
                            )
                        } catch (e: Exception) {
                            result.error("APP_INFO_ERROR", e.message, null)
                        }
                    }

                    "getUpdateCacheDir" -> {
                        try {
                            val dir = File(cacheDir, "updates")
                            if (!dir.exists()) {
                                dir.mkdirs()
                            }
                            result.success(dir.absolutePath)
                        } catch (e: Exception) {
                            result.error("CACHE_DIR_ERROR", e.message, null)
                        }
                    }

                    "verifySha256" -> {
                        val filePath = call.argument<String>("filePath")
                        val expectedSha256 = call.argument<String>("expectedSha256")
                        if (filePath.isNullOrBlank() || expectedSha256.isNullOrBlank()) {
                            result.error(
                                "INVALID_ARGS",
                                "filePath and expectedSha256 are required",
                                null,
                            )
                            return@setMethodCallHandler
                        }
                        ioExecutor.execute {
                            try {
                                val file = File(filePath)
                                if (!file.exists()) {
                                    runOnUiThread { result.success(false) }
                                    return@execute
                                }
                                val digest = MessageDigest.getInstance("SHA-256")
                                val buffer = ByteArray(64 * 1024)
                                file.inputStream().use { input ->
                                    while (true) {
                                        val read = input.read(buffer)
                                        if (read <= 0) break
                                        digest.update(buffer, 0, read)
                                    }
                                }
                                val actual = digest.digest().joinToString("") { "%02x".format(it) }
                                val matched = actual.equals(
                                    expectedSha256.trim(),
                                    ignoreCase = true,
                                )
                                runOnUiThread { result.success(matched) }
                            } catch (e: Exception) {
                                runOnUiThread { result.error("HASH_ERROR", e.message, null) }
                            }
                        }
                    }

                    "canRequestPackageInstalls" -> {
                        val allowed = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            packageManager.canRequestPackageInstalls()
                        } else {
                            true
                        }
                        result.success(allowed)
                    }

                    "openInstallPermissionSettings" -> {
                        try {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                val intent = Intent(
                                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                                    Uri.parse("package:$packageName"),
                                ).apply {
                                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                }
                                startActivity(intent)
                            }
                            result.success(true)
                        } catch (e: Exception) {
                            result.error("SETTINGS_ERROR", e.message, null)
                        }
                    }

                    "installApk" -> {
                        val filePath = call.argument<String>("filePath")
                        if (filePath.isNullOrBlank()) {
                            result.error("INVALID_ARGS", "filePath is required", null)
                            return@setMethodCallHandler
                        }
                        try {
                            val file = File(filePath)
                            if (!file.exists()) {
                                result.error(
                                    "FILE_NOT_FOUND",
                                    "APK file not found: $filePath",
                                    null,
                                )
                                return@setMethodCallHandler
                            }
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O &&
                                !packageManager.canRequestPackageInstalls()
                            ) {
                                result.success("permission_required")
                                return@setMethodCallHandler
                            }
                            val apkUri = FileProvider.getUriForFile(
                                this,
                                "$packageName.fileprovider",
                                file,
                            )
                            val installIntent = Intent(Intent.ACTION_VIEW).apply {
                                setDataAndType(
                                    apkUri,
                                    "application/vnd.android.package-archive",
                                )
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                            }
                            startActivity(installIntent)
                            result.success("launched")
                        } catch (e: Exception) {
                            result.error("INSTALL_ERROR", e.message, null)
                        }
                    }

                    "openUrl" -> {
                        val url = call.argument<String>("url")
                        if (url.isNullOrBlank()) {
                            result.error("INVALID_ARGS", "url is required", null)
                            return@setMethodCallHandler
                        }
                        try {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            }
                            startActivity(intent)
                            result.success(true)
                        } catch (e: Exception) {
                            result.error("OPEN_URL_ERROR", e.message, null)
                        }
                    }

                    else -> result.notImplemented()
                }
            }
    }

    override fun onDestroy() {
        ioExecutor.shutdownNow()
        super.onDestroy()
    }
}
