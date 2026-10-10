//! Downloader module.

use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

/// Download worker.
pub struct DownloadWorker {
    /// Ctx.
    pub ctx: AppContext,
}

/// Download worker args.
#[derive(Deserialize, Debug, Serialize)]
pub struct DownloadWorkerArgs {
    /// User guid.
    pub user_guid: String,
}

#[async_trait]
impl BackgroundWorker<DownloadWorkerArgs> for DownloadWorker {
    fn build(ctx: &AppContext) -> Self {
        Self { ctx: ctx.clone() }
    }
    async fn perform(&self, _args: DownloadWorkerArgs) -> Result<()> {
        // TODO: Some actual work goes here...

        Ok(())
    }
}
