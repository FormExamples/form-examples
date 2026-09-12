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
            .add_route(controllers::flagged_issue::routes())
            .add_route(controllers::satisfaction_result::routes())
            .add_route(controllers::overall_satisfaction::routes())
            .add_route(controllers::environment::routes())
            .add_route(controllers::care_quality::routes())
            .add_route(controllers::staff_professionalism::routes())
            .add_route(controllers::communication::routes())
            .add_route(controllers::access_scheduling::routes())
            .add_route(controllers::visit_information::routes())
            .add_route(controllers::encounter_satisfaction::routes())
            .add_route(controllers::clinician::routes())
            .add_route(controllers::patient::routes())
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
            &format!("{}/src/encounter_satisfaction/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::clinicians::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/clinicians.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/patients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::encounter_satisfactions::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/encounter_satisfactions.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::access_schedulings::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/access_schedulings.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::care_qualities::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/care_qualities.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::communications::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/communications.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::environments::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/environments.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::overall_satisfactions::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/overall_satisfactions.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::satisfaction_results::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/satisfaction_results.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::staff_professionalisms::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/staff_professionalisms.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::visit_informations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/visit_informations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::flagged_issues::ActiveModel>(
            &ctx.db,
            &format!("{}/src/encounter_satisfaction/fixtures/flagged_issues.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}