use axa::cli::DbCommand;
use axa::testing::prelude::*;
use axa::Environment;
use rheumatology_waiting_list_card::app::App;
use serial_test::serial;

/// Nothing but the guard in `App::db` stops these against a live database.
#[tokio::test]
#[serial]
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
