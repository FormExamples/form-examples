use agile_consulting_scorecard_for_hiring_help::app::App;
use axa::cli::DbCommand;
use axa_test::prelude::*;
use axa::Environment;
use serial_test::serial;

/// `cli::parse` refuses these on the command line. This is for a call that
/// reaches `App::db` any other way.
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
