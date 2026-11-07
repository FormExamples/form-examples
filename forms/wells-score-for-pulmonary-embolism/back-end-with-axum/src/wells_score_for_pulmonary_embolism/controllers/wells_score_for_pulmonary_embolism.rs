#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::wells_score_for_pulmonary_embolisms::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub status: String,
    pub patient_identifier: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub age_band: String,
    pub haemodynamic_status: String,
    pub clinical_signs_of_dvt: String,
    pub pe_most_likely: String,
    pub heart_rate_over_100: String,
    pub immobilisation_or_surgery: String,
    pub previous_dvt_pe: String,
    pub haemoptysis: String,
    pub malignancy: String,
    pub clinical_notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO wells_score_for_pulmonary_embolisms (patient_id, clinician_id, \
            status, patient_identifier, assessed_at, care_setting, age_band, \
            haemodynamic_status, clinical_signs_of_dvt, pe_most_likely, heart_rate_over_100, \
            immobilisation_or_surgery, previous_dvt_pe, haemoptysis, malignancy, \
            clinical_notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.age_band)
        .bind(&self.haemodynamic_status)
        .bind(&self.clinical_signs_of_dvt)
        .bind(&self.pe_most_likely)
        .bind(&self.heart_rate_over_100)
        .bind(&self.immobilisation_or_surgery)
        .bind(&self.previous_dvt_pe)
        .bind(&self.haemoptysis)
        .bind(&self.malignancy)
        .bind(&self.clinical_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE wells_score_for_pulmonary_embolisms SET patient_id = $2, clinician_id \
            = $3, status = $4, patient_identifier = $5, assessed_at = $6, care_setting = \
            $7, age_band = $8, haemodynamic_status = $9, clinical_signs_of_dvt = $10, \
            pe_most_likely = $11, heart_rate_over_100 = $12, immobilisation_or_surgery = \
            $13, previous_dvt_pe = $14, haemoptysis = $15, malignancy = $16, \
            clinical_notes = $17, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.patient_identifier)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.age_band)
        .bind(&self.haemodynamic_status)
        .bind(&self.clinical_signs_of_dvt)
        .bind(&self.pe_most_likely)
        .bind(&self.heart_rate_over_100)
        .bind(&self.immobilisation_or_surgery)
        .bind(&self.previous_dvt_pe)
        .bind(&self.haemoptysis)
        .bind(&self.malignancy)
        .bind(&self.clinical_notes)
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
        .prefix("api/wells_score_for_pulmonary_embolisms/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
