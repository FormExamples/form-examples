#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::curb_65_pneumonia_severity_scores::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub patient_identifier: String,
    pub sex: String,
    pub age_years: Option<i32>,
    pub confusion_present: String,
    pub amt_score: Option<i32>,
    pub urea_measured: String,
    pub urea_mmol_l: Option<f64>,
    pub respiratory_rate: Option<i32>,
    pub systolic_bp: Option<i32>,
    pub diastolic_bp: Option<i32>,
    pub oxygen_saturation: Option<i32>,
    pub temperature_c: Option<f64>,
    pub significant_comorbidity: String,
    pub multilobar_changes: String,
    pub clinician_override_band: String,
    pub override_reason: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO curb_65_pneumonia_severity_scores (patient_id, clinician_id, \
            clinician_name, clinician_role, assessed_at, care_setting, patient_identifier, \
            sex, age_years, confusion_present, amt_score, urea_measured, urea_mmol_l, \
            respiratory_rate, systolic_bp, diastolic_bp, oxygen_saturation, temperature_c, \
            significant_comorbidity, multilobar_changes, clinician_override_band, \
            override_reason, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.patient_identifier)
        .bind(&self.sex)
        .bind(self.age_years)
        .bind(&self.confusion_present)
        .bind(self.amt_score)
        .bind(&self.urea_measured)
        .bind(self.urea_mmol_l)
        .bind(self.respiratory_rate)
        .bind(self.systolic_bp)
        .bind(self.diastolic_bp)
        .bind(self.oxygen_saturation)
        .bind(self.temperature_c)
        .bind(&self.significant_comorbidity)
        .bind(&self.multilobar_changes)
        .bind(&self.clinician_override_band)
        .bind(&self.override_reason)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE curb_65_pneumonia_severity_scores SET patient_id = $2, clinician_id = $3, \
            clinician_name = $4, clinician_role = $5, assessed_at = $6, care_setting = $7, \
            patient_identifier = $8, sex = $9, age_years = $10, confusion_present = $11, \
            amt_score = $12, urea_measured = $13, urea_mmol_l = $14, respiratory_rate = $15, \
            systolic_bp = $16, diastolic_bp = $17, oxygen_saturation = $18, temperature_c = \
            $19, significant_comorbidity = $20, multilobar_changes = $21, \
            clinician_override_band = $22, override_reason = $23, clinical_note = $24, \
            updated_at = now() WHERE id = $1 RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.patient_identifier)
        .bind(&self.sex)
        .bind(self.age_years)
        .bind(&self.confusion_present)
        .bind(self.amt_score)
        .bind(&self.urea_measured)
        .bind(self.urea_mmol_l)
        .bind(self.respiratory_rate)
        .bind(self.systolic_bp)
        .bind(self.diastolic_bp)
        .bind(self.oxygen_saturation)
        .bind(self.temperature_c)
        .bind(&self.significant_comorbidity)
        .bind(&self.multilobar_changes)
        .bind(&self.clinician_override_band)
        .bind(&self.override_reason)
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
        .prefix("api/curb_65_pneumonia_severity_scores/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
