#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::colonoscopy_test_requests::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
    pub status: String,
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub procedure: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub red_flag_weight_loss: bool,
    pub red_flag_anaemia: bool,
    pub red_flag_abdominal_mass: bool,
    pub red_flag_rectal_bleeding: bool,
    pub fit_result_ug_g: Option<f64>,
    pub haemoglobin_g_l: Option<f64>,
    pub taking_anticoagulant: bool,
    pub anticoagulant_agent: String,
    pub taking_antiplatelet: bool,
    pub antiplatelet_agent: String,
    pub diabetes_medication: String,
    pub fit_for_bowel_prep: bool,
    pub bowel_prep_agent: String,
    pub chronic_kidney_disease: bool,
    pub egfr_ml_min: Option<f64>,
    pub asa_grade: String,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO colonoscopy_test_requests (patient_id, clinician_id, status, \
            site_name, setting, referral_date, requested_by_date, procedure, \
            primary_indication, clinical_question, relevant_history, \
            red_flag_weight_loss, red_flag_anaemia, red_flag_abdominal_mass, \
            red_flag_rectal_bleeding, fit_result_ug_g, haemoglobin_g_l, \
            taking_anticoagulant, anticoagulant_agent, taking_antiplatelet, \
            antiplatelet_agent, diabetes_medication, fit_for_bowel_prep, \
            bowel_prep_agent, chronic_kidney_disease, egfr_ml_min, asa_grade, urgency, \
            supervising_consultant, requester_contact, notes) VALUES ($1, $2, $3, $4, \
            $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.procedure)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.red_flag_weight_loss)
        .bind(self.red_flag_anaemia)
        .bind(self.red_flag_abdominal_mass)
        .bind(self.red_flag_rectal_bleeding)
        .bind(self.fit_result_ug_g)
        .bind(self.haemoglobin_g_l)
        .bind(self.taking_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.taking_antiplatelet)
        .bind(&self.antiplatelet_agent)
        .bind(&self.diabetes_medication)
        .bind(self.fit_for_bowel_prep)
        .bind(&self.bowel_prep_agent)
        .bind(self.chronic_kidney_disease)
        .bind(self.egfr_ml_min)
        .bind(&self.asa_grade)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE colonoscopy_test_requests SET patient_id = $2, clinician_id = $3, \
            status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, procedure = $9, primary_indication = $10, \
            clinical_question = $11, relevant_history = $12, red_flag_weight_loss = $13, \
            red_flag_anaemia = $14, red_flag_abdominal_mass = $15, \
            red_flag_rectal_bleeding = $16, fit_result_ug_g = $17, haemoglobin_g_l = \
            $18, taking_anticoagulant = $19, anticoagulant_agent = $20, \
            taking_antiplatelet = $21, antiplatelet_agent = $22, diabetes_medication = \
            $23, fit_for_bowel_prep = $24, bowel_prep_agent = $25, \
            chronic_kidney_disease = $26, egfr_ml_min = $27, asa_grade = $28, urgency = \
            $29, supervising_consultant = $30, requester_contact = $31, notes = $32, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(&self.procedure)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(self.red_flag_weight_loss)
        .bind(self.red_flag_anaemia)
        .bind(self.red_flag_abdominal_mass)
        .bind(self.red_flag_rectal_bleeding)
        .bind(self.fit_result_ug_g)
        .bind(self.haemoglobin_g_l)
        .bind(self.taking_anticoagulant)
        .bind(&self.anticoagulant_agent)
        .bind(self.taking_antiplatelet)
        .bind(&self.antiplatelet_agent)
        .bind(&self.diabetes_medication)
        .bind(self.fit_for_bowel_prep)
        .bind(&self.bowel_prep_agent)
        .bind(self.chronic_kidney_disease)
        .bind(self.egfr_ml_min)
        .bind(&self.asa_grade)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(&self.notes)
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
        .prefix("api/colonoscopy_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
