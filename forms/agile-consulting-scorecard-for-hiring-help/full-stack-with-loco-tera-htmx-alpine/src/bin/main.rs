// Agile Consulting Scorecard for Hiring Help — Loco CLI entrypoint.
//
// Standard Loco runner. Subcommands include `start` (boots the HTTP
// server with the SeaORM/scorecards backend), `db migrate`, `db reset`,
// `routes`, and the rest of Loco's built-in CLI. Run with `--help`
// for the full list.

use agile_consulting_scorecard_for_hiring_help::app::App;
use loco_rs::cli;
use migration::Migrator;

#[tokio::main]
async fn main() -> loco_rs::Result<()> {
    cli::main::<App, Migrator>().await
}
