#![forbid(unsafe_code)]

use axa::Environment;
use axa::cli::DbCommand;
use axa::testing::prelude::*;
use neurodiversity_adjustment_review_axum_crate::app::App;

/// Nothing but the guard in `App::db` stops these against a live database.
#[tokio::test]
async fn destructive_db_commands_are_refused_in_production() {
    let mut ctx = App::boot_test().await.unwrap().app_context;
    App::truncate(&ctx).await.unwrap();

    ctx.environment = Environment::Production;
    for command in [
        DbCommand::Down { steps: 1 },
        DbCommand::Reset,
        DbCommand::Truncate,
    ] {
        let error = App::db(&ctx, command).await.unwrap_err();
        assert!(error.to_string().contains("refused"), "{error}");
    }
}
