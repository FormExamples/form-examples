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
            .add_route(controllers::validation_additional_flag::routes())
            .add_route(controllers::validation_fired_rule::routes())
            .add_route(controllers::validation_result::routes())
            .add_route(controllers::signature_consent::routes())
            .add_route(controllers::patient_rights::routes())
            .add_route(controllers::restrictions_limitations::routes())
            .add_route(controllers::authorization_period::routes())
            .add_route(controllers::purpose_of_release::routes())
            .add_route(controllers::records_to_release::routes())
            .add_route(controllers::authorized_recipient::routes())
            .add_route(controllers::release_form::routes())
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
            &format!("{}/src/medical_records_release_permission/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::clinicians::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/clinicians.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/patients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::release_forms::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/release_forms.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::authorization_periods::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/authorization_periods.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::authorized_recipients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/authorized_recipients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patient_rights::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/patient_rights.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::purpose_of_releases::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/purpose_of_releases.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::records_to_releases::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/records_to_releases.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::restrictions_limitations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/restrictions_limitations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::signature_consents::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/signature_consents.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::validation_results::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/validation_results.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::validation_additional_flags::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/validation_additional_flags.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::validation_fired_rules::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_records_release_permission/fixtures/validation_fired_rules.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}