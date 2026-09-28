// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(target_os = "linux")]
    apply_linux_webview_fixups();
    desktop_lib::run()
}

/// Linux WebView fixups. Must run before any Tauri/WebKit code.
///
/// Covers (Tauri v2 + WebKit2GTK): blank/frozen window while
/// http://localhost:1420 works in Chrome, GBM/DMA-BUF errors, AMD Mesa +
/// webkit2gtk 2.52 no-paint, and the proxy trap where WebKit routes devUrl
/// through http_proxy but Chrome bypasses localhost (tauri-apps/tauri#15050).
///
/// Only fills unset vars so power users still win. Deliberately does NOT
/// force GDK_BACKEND or WEBKIT_DISABLE_COMPOSITING_MODE by default.
#[cfg(target_os = "linux")]
fn apply_linux_webview_fixups() {
    if std::env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() {
        // Official Tauri workaround for blank window (v2.tauri.app/develop/debug/linux-graphics).
        unsafe { std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1") };
    }
    if std::env::var_os("__NV_DISABLE_EXPLICIT_SYNC").is_none() {
        // NVIDIA Wayland `Error 71 dispatching to Wayland display` crash.
        unsafe { std::env::set_var("__NV_DISABLE_EXPLICIT_SYNC", "1") };
    }
    if std::env::var_os("WEBKIT_SKIA_ENABLE_CPU_RENDERING").is_none() {
        // AMD Mesa + webkit2gtk 2.52: Skia GPU path can leave an opaque
        // blank window; CPU rasterization paints reliably.
        unsafe { std::env::set_var("WEBKIT_SKIA_ENABLE_CPU_RENDERING", "1") };
    }
    ensure_no_proxy_bypasses_localhost();
}

#[cfg(target_os = "linux")]
fn ensure_no_proxy_bypasses_localhost() {
    for key in ["NO_PROXY", "no_proxy"] {
        let current = std::env::var(key).unwrap_or_default();
        let mut parts: Vec<String> = current
            .split(',')
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .map(ToString::to_string)
            .collect();
        let mut changed = false;
        for need in ["localhost", "127.0.0.1"] {
            if !parts.iter().any(|p| p == need || p == "*" || p.ends_with("localhost")) {
                parts.push(need.to_string());
                changed = true;
            }
        }
        if changed {
            unsafe { std::env::set_var(key, parts.join(",")) };
        }
    }
}
