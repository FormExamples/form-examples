//! Rebuild when a migration changes, because `sqlx::migrate!` embeds them.

#![forbid(unsafe_code)]

fn main() {
    println!("cargo:rerun-if-changed=migrations");
}
