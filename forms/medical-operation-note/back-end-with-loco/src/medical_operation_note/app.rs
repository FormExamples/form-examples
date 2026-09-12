//! Loco application hooks: route registration, workers, tasks, and lifecycle.

use std::path::Path;

use async_trait::async_trait;
use loco_rs::{
    app::{AppContext, Hooks, Initializer},
    bgworker::Queue,
    boot::{create_app, BootResult, StartMode},
    config::Config,
    controller::AppRoutes,
    db::{self, truncate_table},
    environment::Environment,
    task::Tasks,
    Result,
};
use migration::Migrator;

use crate::models::_entities::users;

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
            .add_route(crate::controllers::openapi::routes())
            .add_route(crate::controllers::medical_operation_note_grade_flag::routes())
            .add_route(crate::controllers::medical_operation_note_grade_rule::routes())
            .add_route(crate::controllers::medical_operation_note_grade::routes())
            .add_route(crate::controllers::medical_operation_note_team_member::routes())
            .add_route(crate::controllers::medical_operation_note_procedure::routes())
            .add_route(crate::controllers::medical_operation_note_step::routes())
            .add_route(crate::controllers::medical_operation_note_specimen::routes())
            .add_route(crate::controllers::medical_operation_note_complication::routes())
            .add_route(crate::controllers::medical_operation_note_implant::routes())
            .add_route(crate::controllers::medical_operation_note_drain::routes())
            .add_route(crate::controllers::medical_operation_note::routes())
            .add_route(crate::controllers::clinician::routes())
            .add_route(crate::controllers::patient::routes())
            .add_route(crate::controllers::auth::routes())
    }

    async fn connect_workers(_ctx: &AppContext, _queue: &Queue) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    fn register_tasks(tasks: &mut Tasks) {}

    async fn truncate(ctx: &AppContext) -> Result<()> {
        truncate_table(&ctx.db, users::Entity).await?;
        Ok(())
    }

    async fn seed(ctx: &AppContext, _base: &Path) -> Result<()> {
        db::seed::<users::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/users.yaml", env!("CARGO_MANIFEST_DIR")),
        )
            .await?;
        // BEGIN bin/loco-seed-data-rollout -- do not hand-edit this block; re-run the tool after a schema change.
        loco_rs::db::seed::<crate::models::_entities::clinicians::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/clinicians.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::patients::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/patients.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_notes::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_notes.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_complications::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_complications.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_drains::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_drains.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_grades::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_grades.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_implants::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_implants.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_procedures::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_procedures.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_specimens::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_specimens.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_steps::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_steps.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_team_members::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_team_members.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_grade_flags::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_grade_flags.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        loco_rs::db::seed::<crate::models::_entities::medical_operation_note_grade_rules::ActiveModel>(
            &ctx.db,
            &format!("{}/src/medical_operation_note/fixtures/medical_operation_note_grade_rules.yaml", env!("CARGO_MANIFEST_DIR")),
        )
        .await?;
        // END bin/loco-seed-data-rollout
        Ok(())
    }
}
