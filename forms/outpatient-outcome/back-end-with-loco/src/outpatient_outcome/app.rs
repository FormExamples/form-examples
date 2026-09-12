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
            .add_route(controllers::outpatient_outcome_followup::routes())
            .add_route(controllers::outpatient_outcome_prem_fft::routes())
            .add_route(controllers::outpatient_outcome_prom_promis::routes())
            .add_route(controllers::outpatient_outcome_prom_grc::routes())
            .add_route(controllers::outpatient_outcome_prom_eq5d5l::routes())
            .add_route(controllers::outpatient_outcome_clinical::routes())
            .add_route(controllers::outpatient_outcome_operational::routes())
            .add_route(controllers::outpatient_outcome_encounter::routes())
            .add_route(controllers::outpatient_outcome::routes())
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
            &format!("{}/src/outpatient_outcome/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::clinicians::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/clinicians.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/patients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcomes::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcomes.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcome_clinicals::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcome_clinicals.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcome_encounters::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcome_encounters.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcome_followups::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcome_followups.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcome_operationals::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcome_operationals.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcome_prem_ffts::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcome_prem_ffts.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcome_prom_eq5d5ls::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcome_prom_eq5d5ls.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcome_prom_grcs::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcome_prom_grcs.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::outpatient_outcome_prom_promis::ActiveModel>(
            &ctx.db,
            &format!("{}/src/outpatient_outcome/fixtures/outpatient_outcome_prom_promis.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}