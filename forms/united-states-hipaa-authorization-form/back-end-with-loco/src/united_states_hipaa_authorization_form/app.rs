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
            .add_route(controllers::signature_witness::routes())
            .add_route(controllers::patient_rights_acknowledgement::routes())
            .add_route(controllers::expiration::routes())
            .add_route(controllers::purpose_of_disclosure::routes())
            .add_route(controllers::records_to_disclose::routes())
            .add_route(controllers::authorized_recipient::routes())
            .add_route(controllers::disclosing_source::routes())
            .add_route(controllers::signer::routes())
            .add_route(controllers::hipaa_authorization::routes())
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
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::patients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/patients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::hipaa_authorizations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/hipaa_authorizations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::authorized_recipients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/authorized_recipients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::disclosing_sources::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/disclosing_sources.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::expirations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/expirations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patient_rights_acknowledgements::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/patient_rights_acknowledgements.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::purpose_of_disclosures::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/purpose_of_disclosures.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::records_to_discloses::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/records_to_discloses.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::signature_witnesses::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/signature_witnesses.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::signers::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/signers.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::validation_results::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/validation_results.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::validation_additional_flags::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/validation_additional_flags.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::validation_fired_rules::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_states_hipaa_authorization_form/fixtures/validation_fired_rules.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}