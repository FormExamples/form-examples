//! Loco application hooks: route registration, workers, tasks, and lifecycle.

use std::path::Path;

use async_trait::async_trait;
use loco_rs::{
    app::{AppContext, Hooks, Initializer},
    bgworker::Queue,
    boot::{create_app, BootResult, StartMode},
    config::Config,
    controller::AppRoutes,
    environment::Environment,
    task::Tasks,
    Result,
};
use migration::Migrator;

use crate::controllers;

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
            .add_route(controllers::neurodiversity_adjustment_request::routes())
            .add_route(controllers::dashboard::routes())
    }

    async fn connect_workers(_ctx: &AppContext, _queue: &Queue) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    fn register_tasks(tasks: &mut Tasks) {}

    async fn truncate(_ctx: &AppContext) -> Result<()> {
        Ok(())
    }

    async fn seed(ctx: &AppContext, _base: &Path) -> Result<()> {
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::managers::ActiveModel>(
            &ctx.db,
            &format!("{}/src/neurodiversity_adjustment_request/fixtures/managers.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::workers::ActiveModel>(
            &ctx.db,
            &format!("{}/src/neurodiversity_adjustment_request/fixtures/workers.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::neurodiversity_adjustment_requests::ActiveModel>(
            &ctx.db,
            &format!("{}/src/neurodiversity_adjustment_request/fixtures/neurodiversity_adjustment_requests.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::neurodiversity_adjustment_request_grades::ActiveModel>(
            &ctx.db,
            &format!("{}/src/neurodiversity_adjustment_request/fixtures/neurodiversity_adjustment_request_grades.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::neurodiversity_adjustment_request_grade_flags::ActiveModel>(
            &ctx.db,
            &format!("{}/src/neurodiversity_adjustment_request/fixtures/neurodiversity_adjustment_request_grade_flags.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::neurodiversity_adjustment_request_grade_rules::ActiveModel>(
            &ctx.db,
            &format!("{}/src/neurodiversity_adjustment_request/fixtures/neurodiversity_adjustment_request_grade_rules.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}
