#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_investigations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub casualty_card_id: Uuid,
    pub blood_tests: String,
    pub urinalysis: String,
    pub pregnancy_test: String,
    pub ecg_performed: String,
    pub ecg_findings: String,
    pub other_investigations: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_investigations (casualty_card_id, blood_tests, \
            urinalysis, pregnancy_test, ecg_performed, ecg_findings, \
            other_investigations) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        )
        .bind(self.casualty_card_id)
        .bind(&self.blood_tests)
        .bind(&self.urinalysis)
        .bind(&self.pregnancy_test)
        .bind(&self.ecg_performed)
        .bind(&self.ecg_findings)
        .bind(&self.other_investigations)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_investigations SET casualty_card_id = $2, blood_tests = \
            $3, urinalysis = $4, pregnancy_test = $5, ecg_performed = $6, ecg_findings = \
            $7, other_investigations = $8, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.casualty_card_id)
        .bind(&self.blood_tests)
        .bind(&self.urinalysis)
        .bind(&self.pregnancy_test)
        .bind(&self.ecg_performed)
        .bind(&self.ecg_findings)
        .bind(&self.other_investigations)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    OriginalUri(uri): OriginalUri,
) -> Result<Response> {
    let page = cursor_page(&ctx, &uri)?;
    let rows = Model::page(&db(&ctx), &page).await?;
    Ok(page.respond(rows))
}

#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/casualty_card_investigations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
