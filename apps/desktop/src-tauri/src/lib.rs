// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "linux")]
    apply_linux_webview_fixups();

    let mut builder = tauri::Builder::default();

    // Single instance must be registered first so deep links arriving
    // as new processes (Windows/Linux) are routed to the running app.
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                // Window can look frozen if minimized/hidden behind the new
                // process: restore before focusing.
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
        }));
    }

    builder
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|_app| {
            // Register schemes at runtime for installed apps (macOS needs
            // the bundle). Skipped in debug builds: xdg-desktop-menu / mime
            // IO has hung window creation on some Linux boxes (dead,
            // unclickable window). Release keeps it, log-only.
            #[cfg(all(any(windows, target_os = "linux"), not(debug_assertions)))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                if let Err(e) = _app.deep_link().register_all() {
                    eprintln!("[tickora][deep-link] register_all failed (continuing): {e}");
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Same fixups as main.rs (mobile entry point bypasses main()).
/// Keeps unset-vars-only semantics; see main.rs for rationale.
#[cfg(target_os = "linux")]
fn apply_linux_webview_fixups() {
    if std::env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() {
        unsafe { std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1") };
    }
    if std::env::var_os("__NV_DISABLE_EXPLICIT_SYNC").is_none() {
        unsafe { std::env::set_var("__NV_DISABLE_EXPLICIT_SYNC", "1") };
    }
    if std::env::var_os("WEBKIT_SKIA_ENABLE_CPU_RENDERING").is_none() {
        unsafe { std::env::set_var("WEBKIT_SKIA_ENABLE_CPU_RENDERING", "1") };
    }
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
