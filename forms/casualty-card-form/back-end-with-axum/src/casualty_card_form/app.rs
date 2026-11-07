//! Application wiring: configuration, routes, workers, tasks, the command
//! line, and the boot used by tests. Everything here is an ordinary function.

use axa::{
    AppContext, Environment, Error, Result,
    boot::{BootResult, TestApp},
    cli::{Cli, Command, DbCommand, parse_vars},
    config::{Config, Defaults},
    queue::{Queue, QueueOptions},
    routes::AppRoutes,
    server,
    sqlx::{dangerously_recreate, migrate, revert, status, truncate},
    task::Tasks,
    worker::WorkerMode,
};
use axum::Router;
use sqlx::migrate::Migrator;

#[allow(unused_imports)]
use crate::{
    controllers,
    support::{self, db},
};

/// The schema, from `migrations/`.
static MIGRATOR: Migrator = sqlx::migrate!();

/// Service defaults. The environment overrides them; see `axa::config`.
fn defaults() -> Defaults {
    Defaults {
        database: "casualty_card_form",
        port: 5150,
        ..Defaults::default()
    }
}

/// The application.
pub struct App;

impl App {
    /// The service's route table.
    #[must_use]
    pub fn routes(_ctx: &AppContext) -> AppRoutes {
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
    }

    /// Register background workers.
    ///
    /// # Errors
    ///
    /// Fails when a worker cannot be registered.
    #[allow(unused_variables)]
    pub fn connect_workers(ctx: &AppContext, queue: &mut Queue) -> Result<()> {
        Ok(())
    }

    /// Register command-line tasks.
    #[allow(unused_variables)]
    pub fn register_tasks(tasks: &mut Tasks) {
        tasks.register(SeedTask);
        // tasks-inject (do not remove)
    }

    /// Empty the tables.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn truncate(ctx: &AppContext) -> Result<()> {
        let tables: &[&str] = &[
            "patients",
            "clinicians",
            "casualty_cards",
            "casualty_card_demographics",
            "casualty_card_next_of_kins",
            "casualty_card_gps",
            "casualty_card_arrival_triages",
            "casualty_card_presenting_complaints",
            "casualty_card_pain_assessments",
            "casualty_card_medical_histories",
            "casualty_card_medications",
            "casualty_card_allergies",
            "casualty_card_vital_signs",
            "casualty_card_primary_surveys",
            "casualty_card_clinical_examinations",
            "casualty_card_investigations",
            "casualty_card_treatments",
            "casualty_card_assessment_plans",
            "casualty_card_dispositions",
            "casualty_card_safeguarding_consents",
            "news2_results",
            "flagged_issues",
        ];
        truncate(&db(ctx), tables).await?;
        Ok(())
    }

    /// Load the fixtures.
    ///
    /// # Errors
    ///
    /// Fails when a fixture cannot be read or inserted.
    pub async fn seed(ctx: &AppContext) -> Result<()> {
        let pool = db(ctx);
        support::seed(
            &pool,
            "clinicians",
            &format!(
                "{}/src/casualty_card_form/fixtures/clinicians.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "patients",
            &format!(
                "{}/src/casualty_card_form/fixtures/patients.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_cards",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_cards.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_allergies",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_allergies.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_arrival_triages",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_arrival_triages.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_assessment_plans",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_assessment_plans.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_clinical_examinations",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_clinical_examinations.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_demographics",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_demographics.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_dispositions",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_dispositions.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_gps",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_gps.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_investigations",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_investigations.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_medical_histories",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_medical_histories.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_medications",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_medications.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_next_of_kins",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_next_of_kins.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_pain_assessments",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_pain_assessments.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_presenting_complaints",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_presenting_complaints.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_primary_surveys",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_primary_surveys.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_safeguarding_consents",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_safeguarding_consents.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_treatments",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_treatments.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "casualty_card_vital_signs",
            &format!(
                "{}/src/casualty_card_form/fixtures/casualty_card_vital_signs.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "news2_results",
            &format!(
                "{}/src/casualty_card_form/fixtures/news2_results.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        support::seed(
            &pool,
            "flagged_issues",
            &format!(
                "{}/src/casualty_card_form/fixtures/flagged_issues.yaml",
                env!("CARGO_MANIFEST_DIR")
            ),
        )
        .await?;
        Ok(())
    }

    /// Connect the database and build the context.
    ///
    /// # Errors
    ///
    /// Fails when the database or the job queue cannot be reached.
    pub async fn context(environment: Environment, config: Config) -> Result<AppContext> {
        let pool = axa::db::connect(&config.database).await?;
        let mut ctx = AppContext::new(environment, pool, config);
        if ctx.config.workers == WorkerMode::BackgroundQueue {
            let mut queue =
                Queue::connect(&ctx.config.database.uri, QueueOptions::default()).await?;
            Self::connect_workers(&ctx, &mut queue)?;
            ctx.queue_provider = Some(std::sync::Arc::new(queue));
        }
        Ok(ctx)
    }

    /// Build the full router under the standard middleware.
    ///
    /// # Errors
    ///
    /// Fails when a configured CORS origin is invalid.
    pub fn router(ctx: &AppContext) -> Result<Router> {
        support::problem::apply(Self::routes(ctx), ctx)
    }

    /// Run a database command.
    ///
    /// # Errors
    ///
    /// Refuses in production anything that destroys data, and otherwise
    /// propagates the database error.
    pub async fn db(ctx: &AppContext, command: DbCommand) -> Result<()> {
        if command.destroys_data() && ctx.environment.is_production_like() {
            return Err(Error::string(
                "db down, reset, and truncate are refused in production",
            ));
        }
        let pool = db(ctx);
        match command {
            DbCommand::Migrate => migrate(&pool, &MIGRATOR).await.map_err(Error::wrap)?,
            DbCommand::Down { steps } => {
                revert(&pool, &MIGRATOR, steps).await.map_err(Error::wrap)?;
            }
            DbCommand::Reset => {
                dangerously_recreate(&pool, &MIGRATOR)
                    .await
                    .map_err(Error::wrap)?;
            }
            DbCommand::Status => {
                for migration in status(&pool, &MIGRATOR).await? {
                    let state = if migration.applied {
                        "applied"
                    } else {
                        "pending"
                    };
                    println!("{}\t{state}\t{}", migration.version, migration.description);
                }
            }
            DbCommand::Truncate => Self::truncate(ctx).await?,
        }
        Ok(())
    }

    /// Run the command line.
    ///
    /// # Errors
    ///
    /// Fails when boot, a command, or the server fails.
    pub async fn run(cli: Cli) -> Result<()> {
        let environment = cli
            .environment
            .as_deref()
            .map_or_else(Environment::from_env, Environment::parse);
        if matches!(cli.command, Command::Check) {
            return axa::cli::check(&environment, &defaults());
        }
        let mut config = Config::from_env(&environment, &defaults())?;
        config.apply_cli(&cli);
        let ctx = Self::context(environment, config).await?;
        axa::logger::init(env!("CARGO_CRATE_NAME"), &ctx.config.logger);
        if ctx.config.database.auto_migrate && !matches!(cli.command, Command::Db { .. }) {
            migrate(&db(&ctx), &MIGRATOR).await.map_err(Error::wrap)?;
        }
        match cli.command {
            Command::Start { worker, all, .. } => {
                let router = if worker {
                    None
                } else {
                    Some(Self::router(&ctx)?)
                };
                let queue = (worker || all)
                    .then(|| ctx.queue_provider.clone())
                    .flatten();
                server::run(router, queue, &ctx.config.server).await
            }
            // Answered above, before anything connects.
            Command::Check => Ok(()),
            Command::Db { command } => Self::db(&ctx, command).await,
            Command::Task { name, params } => {
                let mut tasks = Tasks::default();
                Self::register_tasks(&mut tasks);
                let Some(name) = name else {
                    for task in tasks.list() {
                        println!("{}\t{}", task.name, task.detail);
                    }
                    return Ok(());
                };
                tasks.run(&name, &ctx, &parse_vars(&params)?).await
            }
        }
    }
}

/// The `seed` command-line task.
struct SeedTask;

#[async_trait::async_trait]
impl axa::task::Task for SeedTask {
    fn task(&self) -> axa::task::TaskInfo {
        axa::task::TaskInfo {
            name: "seed".to_string(),
            detail: "Load the fixtures".to_string(),
        }
    }

    async fn run(&self, ctx: &AppContext, _vars: &axa::task::Vars) -> Result<()> {
        App::seed(ctx).await
    }
}

impl TestApp for App {
    async fn boot_test() -> Result<BootResult> {
        let environment = Environment::Test;
        let mut config = Config::from_env(&environment, &defaults())?;
        // Test databases are busy, and CI runs shards side by side.
        config.database.connect_timeout = config.database.connect_timeout.max(10_000);
        let ctx = Self::context(environment, config).await?;
        // Every boot starts from an empty, freshly migrated schema, so no
        // table can carry rows from an earlier test.
        dangerously_recreate(&db(&ctx), &MIGRATOR)
            .await
            .map_err(Error::wrap)?;
        let router = Self::router(&ctx)?;
        Ok(BootResult {
            app_context: ctx,
            router: Some(router),
        })
    }
}
