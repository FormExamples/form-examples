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
            .add_route(controllers::news2_result::routes())
            .add_route(controllers::casualty_card_safeguarding_consent::routes())
            .add_route(controllers::casualty_card_disposition::routes())
            .add_route(controllers::casualty_card_assessment_plan::routes())
            .add_route(controllers::casualty_card_treatment::routes())
            .add_route(controllers::casualty_card_investigations::routes())
            .add_route(controllers::casualty_card_clinical_examination::routes())
            .add_route(controllers::casualty_card_primary_survey::routes())
            .add_route(controllers::casualty_card_vital_signs::routes())
            .add_route(controllers::casualty_card_allergy::routes())
            .add_route(controllers::casualty_card_medication::routes())
            .add_route(controllers::casualty_card_medical_history::routes())
            .add_route(controllers::casualty_card_pain_assessment::routes())
            .add_route(controllers::casualty_card_presenting_complaint::routes())
            .add_route(controllers::casualty_card_arrival_triage::routes())
            .add_route(controllers::casualty_card_gp::routes())
            .add_route(controllers::casualty_card_next_of_kin::routes())
            .add_route(controllers::casualty_card_demographics::routes())
            .add_route(controllers::casualty_card::routes())
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
            &format!("{}/src/casualty_card_form/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::clinicians::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/clinicians.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/patients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_cards::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_cards.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_allergies::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_allergies.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_arrival_triages::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_arrival_triages.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_assessment_plans::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_assessment_plans.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_clinical_examinations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_clinical_examinations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_demographics::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_demographics.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_dispositions::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_dispositions.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_gps::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_gps.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_investigations::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_investigations.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_medical_histories::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_medical_histories.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_medications::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_medications.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_next_of_kins::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_next_of_kins.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_pain_assessments::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_pain_assessments.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_presenting_complaints::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_presenting_complaints.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_primary_surveys::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_primary_surveys.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_safeguarding_consents::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_safeguarding_consents.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_treatments::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_treatments.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::casualty_card_vital_signs::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/casualty_card_vital_signs.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::news2_results::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/news2_results.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::flagged_issues::ActiveModel>(
            &ctx.db,
            &format!("{}/src/casualty_card_form/fixtures/flagged_issues.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}