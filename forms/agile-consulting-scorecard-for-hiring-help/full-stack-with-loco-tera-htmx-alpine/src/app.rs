use std::path::Path;
use std::sync::Arc;

use async_trait::async_trait;
use axum::Extension;
use loco_rs::{
    Result,
    app::{AppContext, Hooks, Initializer},
    bgworker::Queue,
    boot::{BootResult, StartMode, create_app},
    config::Config,
    controller::AppRoutes,
    environment::Environment,
    task::Tasks,
};
use migration::Migrator;
use tera::Tera;

use crate::controllers;

pub struct App;

fn init_tera() -> Tera {
    let template_dir = std::env::current_dir()
        .unwrap()
        .join("templates/**/*")
        .to_string_lossy()
        .to_string();
    match Tera::new(&template_dir) {
        Ok(t) => t,
        Err(e) => {
            tracing::error!("failed to initialise Tera templates: {e}");
            std::process::exit(1);
        }
    }
}

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
        let tera = Arc::new(init_tera());
        AppRoutes::with_default_routes()
            .add_route(controllers::home::routes())
            .add_route(controllers::scorecards::routes())
            .add_route(controllers::html::routes().layer(Extension(tera)))
    }

    async fn connect_workers(_ctx: &AppContext, _queue: &Queue) -> Result<()> {
        Ok(())
    }

    #[allow(unused_variables)]
    fn register_tasks(tasks: &mut Tasks) {}

    async fn truncate(_ctx: &AppContext) -> Result<()> {
        Ok(())
    }

    async fn seed(_ctx: &AppContext, _base: &Path) -> Result<()> {
        Ok(())
    }
}
