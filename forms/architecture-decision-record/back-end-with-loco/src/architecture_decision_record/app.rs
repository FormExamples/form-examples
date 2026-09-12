//! Loco application hooks: route registration, workers, tasks, and lifecycle.

use std::path::Path;

use async_trait::async_trait;
use loco_rs::{
    app::{AppContext, Hooks, Initializer},
    bgworker::Queue,
    boot::{create_app, BootResult, StartMode},
    config::Config,
    controller::AppRoutes,
    db::truncate_table,
    environment::Environment,
    task::Tasks,
    Result,
};
use migration::Migrator;

use crate::models::_entities::{
    architecture_decision_record_notes, architecture_decision_record_positions,
    architecture_decision_records, authors, organizations,
};

/// App.
pub struct App;

#[async_trait]
impl Hooks for App {
    fn app_name() -> &'static str {
        env!("CARGO_CRATE_NAME")
    }

    fn app_version() -> String {
        format!(
            "{} ({})",
            env!("CARGO_PKG_VERSION"),
            option_env!("BUILD_SHA")
                .or(option_env!("GITHUB_SHA"))
                .unwrap_or("dev")
        )
    }

    async fn boot(
        mode: StartMode,
        environment: &Environment,
        config: Config,
    ) -> Result<BootResult> {
        create_app::<Self, Migrator>(mode, environment, config).await
    }

    async fn initializers(_ctx: &AppContext) -> Result<Vec<Box<dyn Initializer>>> {
        Ok(vec![])
    }

    fn routes(_ctx: &AppContext) -> AppRoutes {
        AppRoutes::with_default_routes()
            .add_route(crate::controllers::architecture_decision_record::routes())
            .add_route(crate::controllers::architecture_decision_record::api_routes())
    }

    async fn connect_workers(_ctx: &AppContext, _queue: &Queue) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    fn register_tasks(tasks: &mut Tasks) {}

    async fn truncate(ctx: &AppContext) -> Result<()> {
        // Delete children before parents to satisfy FK constraints.
        truncate_table(&ctx.db, architecture_decision_record_notes::Entity).await?;
        truncate_table(&ctx.db, architecture_decision_record_positions::Entity).await?;
        truncate_table(&ctx.db, architecture_decision_records::Entity).await?;
        truncate_table(&ctx.db, authors::Entity).await?;
        truncate_table(&ctx.db, organizations::Entity).await?;
        Ok(())
    }

    async fn seed(ctx: &AppContext, _base: &Path) -> Result<()> {
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::authors::ActiveModel>(
            &ctx.db,
            &format!("{}/src/architecture_decision_record/fixtures/authors.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::organizations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/architecture_decision_record/fixtures/organizations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::architecture_decision_records::ActiveModel>(
            &ctx.db,
            &format!("{}/src/architecture_decision_record/fixtures/architecture_decision_records.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::architecture_decision_record_notes::ActiveModel>(
            &ctx.db,
            &format!("{}/src/architecture_decision_record/fixtures/architecture_decision_record_notes.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::architecture_decision_record_positions::ActiveModel>(
            &ctx.db,
            &format!("{}/src/architecture_decision_record/fixtures/architecture_decision_record_positions.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}
