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
            .add_route(controllers::smoking_alcohol::routes())
            .add_route(controllers::family_history::routes())
            .add_route(controllers::medical_conditions::routes())
            .add_route(controllers::cholesterol::routes())
            .add_route(controllers::blood_pressure::routes())
            .add_route(controllers::demographics_ethnicity::routes())
            .add_route(controllers::assessment::routes())
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
            &format!("{}/src/heart_health_check/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::clinicians::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/clinicians.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/patients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::assessments::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/assessments.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::blood_pressures::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/blood_pressures.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::cholesterols::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/cholesterols.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::demographics_ethnicities::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/demographics_ethnicities.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::family_histories::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/family_histories.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_conditions::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/medical_conditions.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::smoking_alcohols::ActiveModel>(
            &ctx.db,
            &format!("{}/src/heart_health_check/fixtures/smoking_alcohols.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}