#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::bhutani_bilirubin_nomograms::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub infant_identifier: String,
    pub sex: String,
    pub born_at: Option<DateTimeWithTimeZone>,
    pub gestational_age_weeks: Option<f64>,
    pub age_hours: Option<f64>,
    pub total_serum_bilirubin_umol_l: Option<f64>,
    pub measurement_method: String,
    pub preterm_under_38: String,
    pub previous_sibling_jaundice: String,
    pub exclusive_breastfeeding: String,
    pub bruising: String,
    pub blood_group_incompatibility: String,
    pub early_onset_under_24h: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO bhutani_bilirubin_nomograms (patient_id, clinician_id, \
            clinician_name, clinician_role, assessed_at, care_setting, infant_identifier, \
            sex, born_at, gestational_age_weeks, age_hours, total_serum_bilirubin_umol_l, \
            measurement_method, preterm_under_38, previous_sibling_jaundice, \
            exclusive_breastfeeding, bruising, blood_group_incompatibility, \
            early_onset_under_24h, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.infant_identifier)
        .bind(&self.sex)
        .bind(self.born_at)
        .bind(self.gestational_age_weeks)
        .bind(self.age_hours)
        .bind(self.total_serum_bilirubin_umol_l)
        .bind(&self.measurement_method)
        .bind(&self.preterm_under_38)
        .bind(&self.previous_sibling_jaundice)
        .bind(&self.exclusive_breastfeeding)
        .bind(&self.bruising)
        .bind(&self.blood_group_incompatibility)
        .bind(&self.early_onset_under_24h)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE bhutani_bilirubin_nomograms SET patient_id = $2, clinician_id = $3, \
            clinician_name = $4, clinician_role = $5, assessed_at = $6, care_setting = \
            $7, infant_identifier = $8, sex = $9, born_at = $10, gestational_age_weeks = \
            $11, age_hours = $12, total_serum_bilirubin_umol_l = $13, measurement_method \
            = $14, preterm_under_38 = $15, previous_sibling_jaundice = $16, \
            exclusive_breastfeeding = $17, bruising = $18, blood_group_incompatibility = \
            $19, early_onset_under_24h = $20, clinical_note = $21, updated_at = now() \
            WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.infant_identifier)
        .bind(&self.sex)
        .bind(self.born_at)
        .bind(self.gestational_age_weeks)
        .bind(self.age_hours)
        .bind(self.total_serum_bilirubin_umol_l)
        .bind(&self.measurement_method)
        .bind(&self.preterm_under_38)
        .bind(&self.previous_sibling_jaundice)
        .bind(&self.exclusive_breastfeeding)
        .bind(&self.bruising)
        .bind(&self.blood_group_incompatibility)
        .bind(&self.early_onset_under_24h)
        .bind(&self.clinical_note)
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
        .prefix("api/bhutani_bilirubin_nomograms/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
