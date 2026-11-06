#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::assessment_current_medications::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub assessment_id: Uuid,
    pub takes_respiratory_medications: String,
    pub inhaler_use: String,
    pub inhaler_technique_assessed: String,
    pub inhaler_technique_adequate: String,
    pub long_term_oxygen_therapy: String,
    pub nebuliser_use: String,
    pub takes_other_medications: String,
    pub medication_adherence: String,
    pub adverse_drug_reactions: String,
    pub additional_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO assessment_current_medications (deleted_at, assessment_id, \
            takes_respiratory_medications, inhaler_use, inhaler_technique_assessed, \
            inhaler_technique_adequate, long_term_oxygen_therapy, nebuliser_use, \
            takes_other_medications, medication_adherence, adverse_drug_reactions, \
            additional_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) \
            RETURNING *",
        )
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(&self.takes_respiratory_medications)
        .bind(&self.inhaler_use)
        .bind(&self.inhaler_technique_assessed)
        .bind(&self.inhaler_technique_adequate)
        .bind(&self.long_term_oxygen_therapy)
        .bind(&self.nebuliser_use)
        .bind(&self.takes_other_medications)
        .bind(&self.medication_adherence)
        .bind(&self.adverse_drug_reactions)
        .bind(&self.additional_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE assessment_current_medications SET deleted_at = $2, assessment_id = $3, \
            takes_respiratory_medications = $4, inhaler_use = $5, inhaler_technique_assessed \
            = $6, inhaler_technique_adequate = $7, long_term_oxygen_therapy = $8, \
            nebuliser_use = $9, takes_other_medications = $10, medication_adherence = $11, \
            adverse_drug_reactions = $12, additional_notes = $13, updated_at = now() WHERE id \
            = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.deleted_at)
        .bind(self.assessment_id)
        .bind(&self.takes_respiratory_medications)
        .bind(&self.inhaler_use)
        .bind(&self.inhaler_technique_assessed)
        .bind(&self.inhaler_technique_adequate)
        .bind(&self.long_term_oxygen_therapy)
        .bind(&self.nebuliser_use)
        .bind(&self.takes_other_medications)
        .bind(&self.medication_adherence)
        .bind(&self.adverse_drug_reactions)
        .bind(&self.additional_notes)
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
        .prefix("api/assessment_current_medications/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
