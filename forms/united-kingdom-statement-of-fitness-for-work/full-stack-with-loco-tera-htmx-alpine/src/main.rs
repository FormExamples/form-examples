//! Binary entry point for the UK Statement of Fitness for Work
//! (Med 3 / fit note) full-stack application. All implementation lives
//! in the sibling `lib.rs`.

#[tokio::main]
async fn main() {
    uk_fit_note_tera_crate::run().await;
}
