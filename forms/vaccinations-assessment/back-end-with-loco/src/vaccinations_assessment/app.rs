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
            .add_route(controllers::clinical_review::routes())
            .add_route(controllers::administration_record::routes())
            .add_route(controllers::consent_information::routes())
            .add_route(controllers::contraindications_allergies::routes())
            .add_route(controllers::occupational_vaccinations::routes())
            .add_route(controllers::travel_vaccinations::routes())
            .add_route(controllers::adult_vaccinations::routes())
            .add_route(controllers::childhood_vaccinations::routes())
            .add_route(controllers::immunization_history::routes())
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
            &format!("{}/src/vaccinations_assessment/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::clinicians::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/clinicians.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/patients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::assessments::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/assessments.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::administration_records::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/administration_records.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::adult_vaccinations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/adult_vaccinations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::childhood_vaccinations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/childhood_vaccinations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::clinical_reviews::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/clinical_reviews.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::consent_informations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/consent_informations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::contraindications_allergies::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/contraindications_allergies.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::immunization_histories::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/immunization_histories.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::occupational_vaccinations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/occupational_vaccinations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::travel_vaccinations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/vaccinations_assessment/fixtures/travel_vaccinations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}