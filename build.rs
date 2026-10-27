//! Build script for Minidash hub.
//!
//! Watches web-theme and web-admin static assets so cargo rebuilds when assets change.

use std::path::Path;

fn main() {
    println!("cargo:rerun-if-changed=web-theme/dist");
    println!("cargo:rerun-if-changed=web-theme/theme.json");
    println!("cargo:rerun-if-changed=web-theme/preview.png");
    println!("cargo:rerun-if-changed=web-admin/dist");

    // Check if web-theme/dist/index.html exists; if not, create a fallback placeholder
    // directory or notify the developer to run `npm run build` in web-theme.
    let theme_dist = Path::new("web-theme/dist");
    let theme_index = theme_dist.join("index.html");
    if !theme_index.exists() {
        std::fs::create_dir_all(theme_dist).ok();
        let placeholder = r#"<!doctype html><html><head><meta charset="utf-8"><title>Minidash</title></head><body><div id="root">Theme not built. Run 'cd web-theme && npm run build'.</div></body></html>"#;
        std::fs::write(&theme_index, placeholder).ok();
    }

    let admin_dist = Path::new("web-admin/dist");
    let admin_index = admin_dist.join("index.html");
    if !admin_index.exists() {
        std::fs::create_dir_all(admin_dist).ok();
        let placeholder = r#"<!doctype html><html><head><meta charset="utf-8"><title>Minidash Admin</title></head><body><div id="root">Admin panel not built. Run 'cd web-admin && npm run build'.</div></body></html>"#;
        std::fs::write(&admin_index, placeholder).ok();
    }
}
