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
        database: "united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions",
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
            "donors",
            "attorneys",
            "replacement_attorneys",
            "certificate_providers",
            "person_to_notifies",
            "lpas",
            "lpa_attorneys",
            "lpa_replacement_attorneys",
            "lpa_person_to_notifies",
            "lpa_decision_rules",
            "lpa_lst_choices",
            "lpa_preferences",
            "lpa_instructions",
            "lpa_signatures",
            "lpa_registration_applications",
            "lpa_validities",
            "lpa_validity_fired_rules",
            "lpa_validity_additional_flags",
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
        support::seed(&pool, "attorneys", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/attorneys.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "certificate_providers", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/certificate_providers.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "donors", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/donors.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "person_to_notifies", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/person_to_notifies.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "replacement_attorneys", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/replacement_attorneys.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpas", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpas.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_attorneys", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_attorneys.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_decision_rules", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_decision_rules.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_instructions", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_instructions.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_lst_choices", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_lst_choices.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_person_to_notifies", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_person_to_notifies.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_preferences", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_preferences.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_registration_applications", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_registration_applications.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_replacement_attorneys", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_replacement_attorneys.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_signatures", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_signatures.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_validities", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_validities.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_validity_additional_flags", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_validity_additional_flags.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
        support::seed(&pool, "lpa_validity_fired_rules", &format!("{}/src/united_kingdom_lasting_power_of_attorney_for_health_and_care_decisions/fixtures/lpa_validity_fired_rules.yaml", env!("CARGO_MANIFEST_DIR"))).await?;
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

    /// Build the full router: the routes, a request limit per client, and the
    /// standard middleware. The limit sits inside the standard stack, which
    /// works out the client's address and gives a refusal its request id and
    /// security headers.
    ///
    /// # Errors
    ///
    /// Fails when a configured CORS origin is invalid.
    pub fn router(ctx: &AppContext) -> Result<Router> {
        let limiter = axa::ratelimit::Limiter::new(
            support::RATE_LIMIT_REQUESTS,
            support::RATE_LIMIT_WINDOW_SECONDS,
        );
        let limit = axum::middleware::from_fn_with_state(limiter, axa::ratelimit::by_client);
        let routes = Self::routes(ctx).into_router(ctx.clone()).layer(limit);
        axa::middleware::apply(routes, &ctx.config.http)
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
    fn development_only(&self) -> bool {
        true
    }

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
