#![forbid(unsafe_code)]

use four_a_test_for_delirium::app::App;

#[tokio::main]
async fn main() -> axa::Result<()> {
    App::run(axa::cli::parse(
        env!("CARGO_PKG_NAME"),
        env!("CARGO_PKG_VERSION"),
        env!("CARGO_PKG_DESCRIPTION"),
    ))
    .await
}
