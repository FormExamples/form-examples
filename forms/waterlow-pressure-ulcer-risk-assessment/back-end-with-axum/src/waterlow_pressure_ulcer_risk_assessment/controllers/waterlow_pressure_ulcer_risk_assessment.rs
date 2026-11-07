#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::waterlow_pressure_ulcer_risk_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub nurse_name: String,
    pub nurse_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub assessment_reason: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub build_weight_for_height: String,
    pub skin_type: String,
    pub continence: String,
    pub mobility: String,
    pub tissue_malnutrition: String,
    pub neurological_deficit: String,
    pub major_surgery_trauma: String,
    pub medication: String,
    pub existing_pressure_damage: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO waterlow_pressure_ulcer_risk_assessments (patient_id, \
            clinician_id, nurse_name, nurse_role, assessed_at, care_setting, \
            assessment_reason, patient_identifier, age_band, sex, \
            build_weight_for_height, skin_type, continence, mobility, \
            tissue_malnutrition, neurological_deficit, major_surgery_trauma, medication, \
            existing_pressure_damage, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.nurse_name)
        .bind(&self.nurse_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.assessment_reason)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.build_weight_for_height)
        .bind(&self.skin_type)
        .bind(&self.continence)
        .bind(&self.mobility)
        .bind(&self.tissue_malnutrition)
        .bind(&self.neurological_deficit)
        .bind(&self.major_surgery_trauma)
        .bind(&self.medication)
        .bind(&self.existing_pressure_damage)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE waterlow_pressure_ulcer_risk_assessments SET patient_id = $2, \
            clinician_id = $3, nurse_name = $4, nurse_role = $5, assessed_at = $6, \
            care_setting = $7, assessment_reason = $8, patient_identifier = $9, age_band \
            = $10, sex = $11, build_weight_for_height = $12, skin_type = $13, continence \
            = $14, mobility = $15, tissue_malnutrition = $16, neurological_deficit = \
            $17, major_surgery_trauma = $18, medication = $19, existing_pressure_damage \
            = $20, clinical_note = $21, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.nurse_name)
        .bind(&self.nurse_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.assessment_reason)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.build_weight_for_height)
        .bind(&self.skin_type)
        .bind(&self.continence)
        .bind(&self.mobility)
        .bind(&self.tissue_malnutrition)
        .bind(&self.neurological_deficit)
        .bind(&self.major_surgery_trauma)
        .bind(&self.medication)
        .bind(&self.existing_pressure_damage)
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
        .prefix("api/waterlow_pressure_ulcer_risk_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
