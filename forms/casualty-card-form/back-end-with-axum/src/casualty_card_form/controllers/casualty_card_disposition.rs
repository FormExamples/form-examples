#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::casualty_card_dispositions::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub casualty_card_id: Uuid,
    pub disposition: String,
    pub admitting_specialty: String,
    pub admitting_consultant: String,
    pub ward: String,
    pub level_of_care: String,
    pub discharge_diagnosis: String,
    pub discharge_medications: String,
    pub discharge_instructions: String,
    pub follow_up: String,
    pub return_precautions: String,
    pub receiving_hospital: String,
    pub reason_for_transfer: String,
    pub mode_of_transfer: String,
    pub discharge_time: Option<DateTimeWithTimeZone>,
    pub total_time_in_department: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO casualty_card_dispositions (casualty_card_id, disposition, \
            admitting_specialty, admitting_consultant, ward, level_of_care, \
            discharge_diagnosis, discharge_medications, discharge_instructions, \
            follow_up, return_precautions, receiving_hospital, reason_for_transfer, \
            mode_of_transfer, discharge_time, total_time_in_department) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *",
        )
        .bind(self.casualty_card_id)
        .bind(&self.disposition)
        .bind(&self.admitting_specialty)
        .bind(&self.admitting_consultant)
        .bind(&self.ward)
        .bind(&self.level_of_care)
        .bind(&self.discharge_diagnosis)
        .bind(&self.discharge_medications)
        .bind(&self.discharge_instructions)
        .bind(&self.follow_up)
        .bind(&self.return_precautions)
        .bind(&self.receiving_hospital)
        .bind(&self.reason_for_transfer)
        .bind(&self.mode_of_transfer)
        .bind(self.discharge_time)
        .bind(&self.total_time_in_department)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE casualty_card_dispositions SET casualty_card_id = $2, disposition = \
            $3, admitting_specialty = $4, admitting_consultant = $5, ward = $6, \
            level_of_care = $7, discharge_diagnosis = $8, discharge_medications = $9, \
            discharge_instructions = $10, follow_up = $11, return_precautions = $12, \
            receiving_hospital = $13, reason_for_transfer = $14, mode_of_transfer = $15, \
            discharge_time = $16, total_time_in_department = $17, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.casualty_card_id)
        .bind(&self.disposition)
        .bind(&self.admitting_specialty)
        .bind(&self.admitting_consultant)
        .bind(&self.ward)
        .bind(&self.level_of_care)
        .bind(&self.discharge_diagnosis)
        .bind(&self.discharge_medications)
        .bind(&self.discharge_instructions)
        .bind(&self.follow_up)
        .bind(&self.return_precautions)
        .bind(&self.receiving_hospital)
        .bind(&self.reason_for_transfer)
        .bind(&self.mode_of_transfer)
        .bind(self.discharge_time)
        .bind(&self.total_time_in_department)
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
        .prefix("api/casualty_card_dispositions/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
