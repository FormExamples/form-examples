use async_trait::async_trait;
use loco_rs::{
    app::{AppContext, Hooks, Initializer},
    bgworker::{BackgroundWorker, Queue},
    boot::{create_app, BootResult, StartMode},
    config::Config,
    controller::AppRoutes,
    db::{self, truncate_table},
    environment::Environment,
    task::Tasks,
    Result,
};
use migration::Migrator;
use std::path::Path;

#[allow(unused_imports)]
use crate::{controllers, models::_entities::users, tasks, workers::downloader::DownloadWorker};

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
        AppRoutes::with_default_routes() // controller routes below
            .add_route(crate::controllers::openapi::routes())
            .add_route(controllers::technology_decision::routes())
            .add_route(controllers::context_partner::routes())
            .add_route(controllers::constraint_item::routes())
            .add_route(controllers::stakeholder::routes())
            .add_route(controllers::quality_goal::routes())
            .add_route(controllers::business_goal::routes())
            .add_route(controllers::arc42_documentation::routes())
            .add_route(controllers::architecture::routes())
            .add_route(controllers::auth::routes())
    }
    async fn connect_workers(ctx: &AppContext, queue: &Queue) -> Result<()> {
        queue.register(DownloadWorker::build(ctx)).await?;
        Ok(())
    }

    #[allow(unused_variables)]
    fn register_tasks(tasks: &mut Tasks) {
        // tasks-inject (do not remove)
    }
    async fn truncate(ctx: &AppContext) -> Result<()> {
        truncate_table(&ctx.db, users::Entity).await?;
        Ok(())
    }
    async fn seed(ctx: &AppContext, _base: &Path) -> Result<()> {
        db::seed::<users::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::architectures::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/architectures.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::arc42_documentations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/arc42_documentations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::business_goals::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/business_goals.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::constraint_items::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/constraint_items.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::context_partners::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/context_partners.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::quality_goals::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/quality_goals.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::stakeholders::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/stakeholders.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::technology_decisions::ActiveModel>(
            &ctx.db,
            &format!("{}/src/arc42/fixtures/technology_decisions.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}