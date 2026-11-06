#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::hernia_diagnostic_evaluation_grades::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub hernia_diagnostic_evaluation_id: Uuid,
    pub hernia_type: String,
    pub hernia_subtype: String,
    pub ehs_classification: String,
    pub ehs_size_grade: String,
    pub reducibility_status: String,
    pub computed_urgency: String,
    pub final_urgency: String,
    pub override_reason: String,
    pub recommendation: String,
    pub clinician_notes: String,
    pub signed_by_name: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
    pub graded_at: DateTimeWithTimeZone,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO hernia_diagnostic_evaluation_grades (deleted_at, \
            hernia_diagnostic_evaluation_id, hernia_type, hernia_subtype, ehs_classification, \
            ehs_size_grade, reducibility_status, computed_urgency, final_urgency, \
            override_reason, recommendation, clinician_notes, signed_by_name, signed_at, \
            graded_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, \
            $15) RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.hernia_diagnostic_evaluation_id)
        .bind(&self.hernia_type)
        .bind(&self.hernia_subtype)
        .bind(&self.ehs_classification)
        .bind(&self.ehs_size_grade)
        .bind(&self.reducibility_status)
        .bind(&self.computed_urgency)
        .bind(&self.final_urgency)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.clinician_notes)
        .bind(&self.signed_by_name)
        .bind(self.signed_at)
        .bind(self.graded_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE hernia_diagnostic_evaluation_grades SET deleted_at = $2, \
            hernia_diagnostic_evaluation_id = $3, hernia_type = $4, hernia_subtype = $5, \
            ehs_classification = $6, ehs_size_grade = $7, reducibility_status = $8, \
            computed_urgency = $9, final_urgency = $10, override_reason = $11, recommendation \
            = $12, clinician_notes = $13, signed_by_name = $14, signed_at = $15, graded_at = \
            $16, updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.hernia_diagnostic_evaluation_id)
        .bind(&self.hernia_type)
        .bind(&self.hernia_subtype)
        .bind(&self.ehs_classification)
        .bind(&self.ehs_size_grade)
        .bind(&self.reducibility_status)
        .bind(&self.computed_urgency)
        .bind(&self.final_urgency)
        .bind(&self.override_reason)
        .bind(&self.recommendation)
        .bind(&self.clinician_notes)
        .bind(&self.signed_by_name)
        .bind(self.signed_at)
        .bind(self.graded_at)
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
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
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
        .prefix("api/hernia_diagnostic_evaluation_grades/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
