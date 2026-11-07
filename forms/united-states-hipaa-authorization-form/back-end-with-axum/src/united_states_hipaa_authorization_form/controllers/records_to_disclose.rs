#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::records_to_discloses::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub hipaa_authorization_id: Uuid,
    pub include_medical_health: String,
    pub medical_health_initials: String,
    pub include_mental_health: String,
    pub mental_health_initials: String,
    pub include_substance_use: String,
    pub substance_use_initials: String,
    pub part2_redisclosure_notice_included: String,
    pub include_hiv_aids: String,
    pub hiv_aids_initials: String,
    pub hiv_aids_state_consent_included: String,
    pub include_psychotherapy_notes: String,
    pub include_genetic_information: String,
    pub include_reproductive_health: String,
    pub section_7332_notice_included: String,
    pub date_range_specified: String,
    pub date_from: Option<Date>,
    pub date_to: Option<Date>,
    pub other_description: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO records_to_discloses (hipaa_authorization_id, \
            include_medical_health, medical_health_initials, include_mental_health, \
            mental_health_initials, include_substance_use, substance_use_initials, \
            part2_redisclosure_notice_included, include_hiv_aids, hiv_aids_initials, \
            hiv_aids_state_consent_included, include_psychotherapy_notes, \
            include_genetic_information, include_reproductive_health, \
            section_7332_notice_included, date_range_specified, date_from, date_to, \
            other_description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \
            $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *",
        )
        .bind(self.hipaa_authorization_id)
        .bind(&self.include_medical_health)
        .bind(&self.medical_health_initials)
        .bind(&self.include_mental_health)
        .bind(&self.mental_health_initials)
        .bind(&self.include_substance_use)
        .bind(&self.substance_use_initials)
        .bind(&self.part2_redisclosure_notice_included)
        .bind(&self.include_hiv_aids)
        .bind(&self.hiv_aids_initials)
        .bind(&self.hiv_aids_state_consent_included)
        .bind(&self.include_psychotherapy_notes)
        .bind(&self.include_genetic_information)
        .bind(&self.include_reproductive_health)
        .bind(&self.section_7332_notice_included)
        .bind(&self.date_range_specified)
        .bind(self.date_from)
        .bind(self.date_to)
        .bind(&self.other_description)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE records_to_discloses SET hipaa_authorization_id = $2, \
            include_medical_health = $3, medical_health_initials = $4, \
            include_mental_health = $5, mental_health_initials = $6, \
            include_substance_use = $7, substance_use_initials = $8, \
            part2_redisclosure_notice_included = $9, include_hiv_aids = $10, \
            hiv_aids_initials = $11, hiv_aids_state_consent_included = $12, \
            include_psychotherapy_notes = $13, include_genetic_information = $14, \
            include_reproductive_health = $15, section_7332_notice_included = $16, \
            date_range_specified = $17, date_from = $18, date_to = $19, \
            other_description = $20, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.hipaa_authorization_id)
        .bind(&self.include_medical_health)
        .bind(&self.medical_health_initials)
        .bind(&self.include_mental_health)
        .bind(&self.mental_health_initials)
        .bind(&self.include_substance_use)
        .bind(&self.substance_use_initials)
        .bind(&self.part2_redisclosure_notice_included)
        .bind(&self.include_hiv_aids)
        .bind(&self.hiv_aids_initials)
        .bind(&self.hiv_aids_state_consent_included)
        .bind(&self.include_psychotherapy_notes)
        .bind(&self.include_genetic_information)
        .bind(&self.include_reproductive_health)
        .bind(&self.section_7332_notice_included)
        .bind(&self.date_range_specified)
        .bind(self.date_from)
        .bind(self.date_to)
        .bind(&self.other_description)
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
    let page = params.resolve(PAGE_LIMITS)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    Ok(page.respond(total, rows))
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
        .prefix("api/records_to_discloses/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
