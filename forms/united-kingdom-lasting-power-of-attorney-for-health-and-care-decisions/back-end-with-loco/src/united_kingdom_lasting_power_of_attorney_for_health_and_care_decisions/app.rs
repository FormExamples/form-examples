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
            .add_route(controllers::lpa_validity_additional_flag::routes())
            .add_route(controllers::lpa_validity_fired_rule::routes())
            .add_route(controllers::lpa_validity::routes())
            .add_route(controllers::lpa_registration_application::routes())
            .add_route(controllers::lpa_signature::routes())
            .add_route(controllers::lpa_instruction::routes())
            .add_route(controllers::lpa_preference::routes())
            .add_route(controllers::lpa_lst_choice::routes())
            .add_route(controllers::lpa_decision_rule::routes())
            .add_route(controllers::lpa_person_to_notify::routes())
            .add_route(controllers::lpa_replacement_attorney::routes())
            .add_route(controllers::lpa_attorney::routes())
            .add_route(controllers::lpa::routes())
            .add_route(controllers::person_to_notify::routes())
            .add_route(controllers::certificate_provider::routes())
            .add_route(controllers::replacement_attorney::routes())
            .add_route(controllers::attorney::routes())
            .add_route(controllers::donor::routes())
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
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::attorneys::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/attorneys.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::certificate_providers::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/certificate_providers.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::donors::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/donors.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::person_to_notifies::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/person_to_notifies.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::replacement_attorneys::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/replacement_attorneys.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpas::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpas.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_attorneys::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_attorneys.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_decision_rules::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_decision_rules.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_instructions::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_instructions.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_lst_choices::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_lst_choices.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_person_to_notifies::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_person_to_notifies.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_preferences::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_preferences.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_registration_applications::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_registration_applications.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_replacement_attorneys::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_replacement_attorneys.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_signatures::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_signatures.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_validities::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_validities.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_validity_additional_flags::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_validity_additional_flags.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::lpa_validity_fired_rules::ActiveModel>(
            &ctx.db,
            &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_validity_fired_rules.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}