use async_trait::async_trait;
use axum::{Extension, Router as AxumRouter};
use fluent_templates::{ArcLoader, FluentLoader};
use loco_rs::{
    app::{AppContext, Initializer},
    controller::views::{engines, ViewEngine},
    Error, Result,
};
use tracing::info;

const I18N_DIR: &str = "assets/i18n";
const I18N_SHARED: &str = "assets/i18n/shared.ftl";
#[allow(clippy::module_name_repetitions)]
pub struct ViewEngineInitializer;

#[async_trait]
impl Initializer for ViewEngineInitializer {
    fn name(&self) -> String {
        "view-engine".to_string()
    }

    async fn after_routes(&self, router: AxumRouter, _ctx: &AppContext) -> Result<AxumRouter> {
        // Attempt to load Fluent i18n resources. If they fail (parse error,
        // duplicate identifier, missing dir), fall back to a plain Tera
        // engine so the app still boots. The medical-operation-note
        // wizard does not depend on the `t` Tera function.
        let tera_engine = if std::path::Path::new(I18N_DIR).exists() {
            let loader = ArcLoader::builder(&I18N_DIR, unic_langid::langid!("en-US"))
                .shared_resources(Some(&[I18N_SHARED.into()]))
                .customize(|bundle| bundle.set_use_isolating(false))
                .build();

            match loader {
                Ok(arc_loader) => {
                    info!("locales loaded");
                    let arc = std::sync::Arc::new(arc_loader);
                    engines::TeraView::build()?.post_process(move |tera| {
                        tera.register_function("t", FluentLoader::new(arc.clone()));
                        Ok(())
                    })?
                }
                Err(e) => {
                    tracing::warn!("i18n load failed ({e}); continuing without Fluent");
                    engines::TeraView::build()?
                }
            }
        } else {
            engines::TeraView::build()?
        };

        // Silence the unused import warning when i18n is degraded.
        let _ = Error::string("noop");
        Ok(router.layer(Extension(ViewEngine::from(tera_engine))))
    }
}
