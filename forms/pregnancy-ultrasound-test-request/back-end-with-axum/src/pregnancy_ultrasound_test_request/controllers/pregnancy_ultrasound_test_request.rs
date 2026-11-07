#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::pregnancy_ultrasound_test_requests::Model;

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
    pub last_menstrual_period_date: Option<Date>,
    pub last_menstrual_period_reliability: String,
    pub estimated_due_date: Option<Date>,
    pub estimated_due_date_method: String,
    pub gestational_age_weeks: Option<i32>,
    pub gestational_age_days: Option<i32>,
    pub gravida: Option<i32>,
    pub para: Option<i32>,
    pub plurality: String,
    pub chorionicity: String,
    pub conception_method: String,
    pub rhesus_status: String,
    pub body_mass_index: Option<f64>,
    pub requested_scan_type: String,
    pub primary_indication: String,
    pub clinical_question: String,
    pub relevant_history: String,
    pub previous_scan_finding: String,
    pub previous_scan_date: Option<Date>,
    pub vaginal_bleeding: String,
    pub abdominal_pain: String,
    pub reduced_fetal_movements: bool,
    pub suspected_ectopic: bool,
    pub haemodynamically_unstable: bool,
    pub hypertension: bool,
    pub diabetes: bool,
    pub previous_growth_restriction: bool,
    pub previous_preterm_birth: bool,
    pub previous_caesarean: bool,
    pub smoker: bool,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub interpreter_required: bool,
    pub notes: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO pregnancy_ultrasound_test_requests (patient_id, clinician_id, \
            status, site_name, setting, referral_date, requested_by_date, \
            last_menstrual_period_date, last_menstrual_period_reliability, \
            estimated_due_date, estimated_due_date_method, gestational_age_weeks, \
            gestational_age_days, gravida, para, plurality, chorionicity, \
            conception_method, rhesus_status, body_mass_index, requested_scan_type, \
            primary_indication, clinical_question, relevant_history, \
            previous_scan_finding, previous_scan_date, vaginal_bleeding, abdominal_pain, \
            reduced_fetal_movements, suspected_ectopic, haemodynamically_unstable, \
            hypertension, diabetes, previous_growth_restriction, previous_preterm_birth, \
            previous_caesarean, smoker, urgency, supervising_consultant, \
            requester_contact, interpreter_required, notes) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, \
            $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, \
            $37, $38, $39, $40, $41, $42) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.last_menstrual_period_date)
        .bind(&self.last_menstrual_period_reliability)
        .bind(self.estimated_due_date)
        .bind(&self.estimated_due_date_method)
        .bind(self.gestational_age_weeks)
        .bind(self.gestational_age_days)
        .bind(self.gravida)
        .bind(self.para)
        .bind(&self.plurality)
        .bind(&self.chorionicity)
        .bind(&self.conception_method)
        .bind(&self.rhesus_status)
        .bind(self.body_mass_index)
        .bind(&self.requested_scan_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.previous_scan_finding)
        .bind(self.previous_scan_date)
        .bind(&self.vaginal_bleeding)
        .bind(&self.abdominal_pain)
        .bind(self.reduced_fetal_movements)
        .bind(self.suspected_ectopic)
        .bind(self.haemodynamically_unstable)
        .bind(self.hypertension)
        .bind(self.diabetes)
        .bind(self.previous_growth_restriction)
        .bind(self.previous_preterm_birth)
        .bind(self.previous_caesarean)
        .bind(self.smoker)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(self.interpreter_required)
        .bind(&self.notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE pregnancy_ultrasound_test_requests SET patient_id = $2, clinician_id \
            = $3, status = $4, site_name = $5, setting = $6, referral_date = $7, \
            requested_by_date = $8, last_menstrual_period_date = $9, \
            last_menstrual_period_reliability = $10, estimated_due_date = $11, \
            estimated_due_date_method = $12, gestational_age_weeks = $13, \
            gestational_age_days = $14, gravida = $15, para = $16, plurality = $17, \
            chorionicity = $18, conception_method = $19, rhesus_status = $20, \
            body_mass_index = $21, requested_scan_type = $22, primary_indication = $23, \
            clinical_question = $24, relevant_history = $25, previous_scan_finding = \
            $26, previous_scan_date = $27, vaginal_bleeding = $28, abdominal_pain = $29, \
            reduced_fetal_movements = $30, suspected_ectopic = $31, \
            haemodynamically_unstable = $32, hypertension = $33, diabetes = $34, \
            previous_growth_restriction = $35, previous_preterm_birth = $36, \
            previous_caesarean = $37, smoker = $38, urgency = $39, \
            supervising_consultant = $40, requester_contact = $41, interpreter_required \
            = $42, notes = $43, updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.status)
        .bind(&self.site_name)
        .bind(&self.setting)
        .bind(self.referral_date)
        .bind(self.requested_by_date)
        .bind(self.last_menstrual_period_date)
        .bind(&self.last_menstrual_period_reliability)
        .bind(self.estimated_due_date)
        .bind(&self.estimated_due_date_method)
        .bind(self.gestational_age_weeks)
        .bind(self.gestational_age_days)
        .bind(self.gravida)
        .bind(self.para)
        .bind(&self.plurality)
        .bind(&self.chorionicity)
        .bind(&self.conception_method)
        .bind(&self.rhesus_status)
        .bind(self.body_mass_index)
        .bind(&self.requested_scan_type)
        .bind(&self.primary_indication)
        .bind(&self.clinical_question)
        .bind(&self.relevant_history)
        .bind(&self.previous_scan_finding)
        .bind(self.previous_scan_date)
        .bind(&self.vaginal_bleeding)
        .bind(&self.abdominal_pain)
        .bind(self.reduced_fetal_movements)
        .bind(self.suspected_ectopic)
        .bind(self.haemodynamically_unstable)
        .bind(self.hypertension)
        .bind(self.diabetes)
        .bind(self.previous_growth_restriction)
        .bind(self.previous_preterm_birth)
        .bind(self.previous_caesarean)
        .bind(self.smoker)
        .bind(&self.urgency)
        .bind(&self.supervising_consultant)
        .bind(&self.requester_contact)
        .bind(self.interpreter_required)
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
        .prefix("api/pregnancy_ultrasound_test_requests/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
