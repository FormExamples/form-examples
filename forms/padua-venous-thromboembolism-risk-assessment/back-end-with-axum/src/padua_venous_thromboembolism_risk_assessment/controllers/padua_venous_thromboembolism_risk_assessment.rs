#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::padua_venous_thromboembolism_risk_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub admission_reason: String,
    pub patient_identifier: String,
    pub age_years: Option<f64>,
    pub sex: String,
    pub active_cancer: String,
    pub previous_vte: String,
    pub reduced_mobility: String,
    pub known_thrombophilia: String,
    pub recent_trauma_or_surgery: String,
    pub heart_or_respiratory_failure: String,
    pub acute_mi_or_ischaemic_stroke: String,
    pub acute_infection_or_rheumatological: String,
    pub body_mass_index: Option<f64>,
    pub ongoing_hormonal_treatment: String,
    pub active_bleeding: String,
    pub high_bleeding_risk: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO padua_venous_thromboembolism_risk_assessments (patient_id, \
            clinician_id, clinician_name, clinician_role, assessed_at, care_setting, \
            admission_reason, patient_identifier, age_years, sex, active_cancer, \
            previous_vte, reduced_mobility, known_thrombophilia, recent_trauma_or_surgery, \
            heart_or_respiratory_failure, acute_mi_or_ischaemic_stroke, \
            acute_infection_or_rheumatological, body_mass_index, ongoing_hormonal_treatment, \
            active_bleeding, high_bleeding_risk, clinical_note) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.admission_reason)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.active_cancer)
        .bind(&self.previous_vte)
        .bind(&self.reduced_mobility)
        .bind(&self.known_thrombophilia)
        .bind(&self.recent_trauma_or_surgery)
        .bind(&self.heart_or_respiratory_failure)
        .bind(&self.acute_mi_or_ischaemic_stroke)
        .bind(&self.acute_infection_or_rheumatological)
        .bind(self.body_mass_index)
        .bind(&self.ongoing_hormonal_treatment)
        .bind(&self.active_bleeding)
        .bind(&self.high_bleeding_risk)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE padua_venous_thromboembolism_risk_assessments SET patient_id = $2, \
            clinician_id = $3, clinician_name = $4, clinician_role = $5, assessed_at = \
            $6, care_setting = $7, admission_reason = $8, patient_identifier = $9, \
            age_years = $10, sex = $11, active_cancer = $12, previous_vte = $13, \
            reduced_mobility = $14, known_thrombophilia = $15, recent_trauma_or_surgery \
            = $16, heart_or_respiratory_failure = $17, acute_mi_or_ischaemic_stroke = \
            $18, acute_infection_or_rheumatological = $19, body_mass_index = $20, \
            ongoing_hormonal_treatment = $21, active_bleeding = $22, high_bleeding_risk \
            = $23, clinical_note = $24, updated_at = now() WHERE id = $1 AND deleted_at \
            IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.admission_reason)
        .bind(&self.patient_identifier)
        .bind(self.age_years)
        .bind(&self.sex)
        .bind(&self.active_cancer)
        .bind(&self.previous_vte)
        .bind(&self.reduced_mobility)
        .bind(&self.known_thrombophilia)
        .bind(&self.recent_trauma_or_surgery)
        .bind(&self.heart_or_respiratory_failure)
        .bind(&self.acute_mi_or_ischaemic_stroke)
        .bind(&self.acute_infection_or_rheumatological)
        .bind(self.body_mass_index)
        .bind(&self.ongoing_hormonal_treatment)
        .bind(&self.active_bleeding)
        .bind(&self.high_bleeding_risk)
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
        .prefix("api/padua_venous_thromboembolism_risk_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
