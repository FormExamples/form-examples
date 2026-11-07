#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::consent_informations::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub assessment_id: Uuid,
    pub information_provided: Option<i32>,
    pub risks_explained: Option<i32>,
    pub benefits_explained: Option<i32>,
    pub questions_answered: Option<i32>,
    pub consent_given: String,
    pub consent_date: Option<Date>,
    pub guardian_consent: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO consent_informations (assessment_id, information_provided, \
            risks_explained, benefits_explained, questions_answered, consent_given, \
            consent_date, guardian_consent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) \
            RETURNING *",
        )
        .bind(self.assessment_id)
        .bind(self.information_provided)
        .bind(self.risks_explained)
        .bind(self.benefits_explained)
        .bind(self.questions_answered)
        .bind(&self.consent_given)
        .bind(self.consent_date)
        .bind(&self.guardian_consent)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE consent_informations SET assessment_id = $2, information_provided = \
            $3, risks_explained = $4, benefits_explained = $5, questions_answered = $6, \
            consent_given = $7, consent_date = $8, guardian_consent = $9, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.assessment_id)
        .bind(self.information_provided)
        .bind(self.risks_explained)
        .bind(self.benefits_explained)
        .bind(self.questions_answered)
        .bind(&self.consent_given)
        .bind(self.consent_date)
        .bind(&self.guardian_consent)
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
        .prefix("api/consent_informations/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
