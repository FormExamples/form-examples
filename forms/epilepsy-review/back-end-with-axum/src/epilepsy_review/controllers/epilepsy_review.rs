#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::epilepsy_reviews::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub reviewer_name: String,
    pub reviewer_role: String,
    pub reviewed_at: Option<Date>,
    pub care_setting: String,
    pub review_type: String,
    pub months_since_last_review: Option<f64>,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub epilepsy_type: String,
    pub age_at_onset: Option<f64>,
    pub years_since_diagnosis: Option<f64>,
    pub learning_disability: String,
    pub seizure_types: String,
    pub seizure_frequency: String,
    pub last_seizure_date: Option<Date>,
    pub seizure_free_months: Option<f64>,
    pub seizure_trend: String,
    pub current_asms: String,
    pub asm_adherence: String,
    pub asm_side_effects: String,
    pub drug_level: Option<f64>,
    pub triggers: String,
    pub sudep_discussed: String,
    pub status_epilepticus: String,
    pub seizure_injury: String,
    pub dvla_eligible: String,
    pub currently_driving: String,
    pub bathing_advice_given: String,
    pub woman_of_childbearing_potential: String,
    pub on_valproate: String,
    pub pregnancy_prevention_programme: String,
    pub folic_acid: String,
    pub contraception_interaction_reviewed: String,
    pub mental_health_concern: String,
    pub specialist_review_needed: String,
    pub next_review_due: Option<Date>,
    pub care_plan: String,
    pub review_context: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO epilepsy_reviews (reviewer_name, reviewer_role, reviewed_at, \
            care_setting, review_type, months_since_last_review, patient_identifier, \
            age_band, sex, epilepsy_type, age_at_onset, years_since_diagnosis, \
            learning_disability, seizure_types, seizure_frequency, last_seizure_date, \
            seizure_free_months, seizure_trend, current_asms, asm_adherence, \
            asm_side_effects, drug_level, triggers, sudep_discussed, status_epilepticus, \
            seizure_injury, dvla_eligible, currently_driving, bathing_advice_given, \
            woman_of_childbearing_potential, on_valproate, pregnancy_prevention_programme, \
            folic_acid, contraception_interaction_reviewed, mental_health_concern, \
            specialist_review_needed, next_review_due, care_plan, review_context, patient_id, \
            clinician_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, \
            $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, \
            $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41) RETURNING *",
        )
        .bind(&self.reviewer_name)
        .bind(&self.reviewer_role)
        .bind(self.reviewed_at)
        .bind(&self.care_setting)
        .bind(&self.review_type)
        .bind(self.months_since_last_review)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.epilepsy_type)
        .bind(self.age_at_onset)
        .bind(self.years_since_diagnosis)
        .bind(&self.learning_disability)
        .bind(&self.seizure_types)
        .bind(&self.seizure_frequency)
        .bind(self.last_seizure_date)
        .bind(self.seizure_free_months)
        .bind(&self.seizure_trend)
        .bind(&self.current_asms)
        .bind(&self.asm_adherence)
        .bind(&self.asm_side_effects)
        .bind(self.drug_level)
        .bind(&self.triggers)
        .bind(&self.sudep_discussed)
        .bind(&self.status_epilepticus)
        .bind(&self.seizure_injury)
        .bind(&self.dvla_eligible)
        .bind(&self.currently_driving)
        .bind(&self.bathing_advice_given)
        .bind(&self.woman_of_childbearing_potential)
        .bind(&self.on_valproate)
        .bind(&self.pregnancy_prevention_programme)
        .bind(&self.folic_acid)
        .bind(&self.contraception_interaction_reviewed)
        .bind(&self.mental_health_concern)
        .bind(&self.specialist_review_needed)
        .bind(self.next_review_due)
        .bind(&self.care_plan)
        .bind(&self.review_context)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE epilepsy_reviews SET reviewer_name = $2, reviewer_role = $3, \
            reviewed_at = $4, care_setting = $5, review_type = $6, \
            months_since_last_review = $7, patient_identifier = $8, age_band = $9, sex = \
            $10, epilepsy_type = $11, age_at_onset = $12, years_since_diagnosis = $13, \
            learning_disability = $14, seizure_types = $15, seizure_frequency = $16, \
            last_seizure_date = $17, seizure_free_months = $18, seizure_trend = $19, \
            current_asms = $20, asm_adherence = $21, asm_side_effects = $22, drug_level \
            = $23, triggers = $24, sudep_discussed = $25, status_epilepticus = $26, \
            seizure_injury = $27, dvla_eligible = $28, currently_driving = $29, \
            bathing_advice_given = $30, woman_of_childbearing_potential = $31, \
            on_valproate = $32, pregnancy_prevention_programme = $33, folic_acid = $34, \
            contraception_interaction_reviewed = $35, mental_health_concern = $36, \
            specialist_review_needed = $37, next_review_due = $38, care_plan = $39, \
            review_context = $40, patient_id = $41, clinician_id = $42, updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(&self.reviewer_name)
        .bind(&self.reviewer_role)
        .bind(self.reviewed_at)
        .bind(&self.care_setting)
        .bind(&self.review_type)
        .bind(self.months_since_last_review)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.epilepsy_type)
        .bind(self.age_at_onset)
        .bind(self.years_since_diagnosis)
        .bind(&self.learning_disability)
        .bind(&self.seizure_types)
        .bind(&self.seizure_frequency)
        .bind(self.last_seizure_date)
        .bind(self.seizure_free_months)
        .bind(&self.seizure_trend)
        .bind(&self.current_asms)
        .bind(&self.asm_adherence)
        .bind(&self.asm_side_effects)
        .bind(self.drug_level)
        .bind(&self.triggers)
        .bind(&self.sudep_discussed)
        .bind(&self.status_epilepticus)
        .bind(&self.seizure_injury)
        .bind(&self.dvla_eligible)
        .bind(&self.currently_driving)
        .bind(&self.bathing_advice_given)
        .bind(&self.woman_of_childbearing_potential)
        .bind(&self.on_valproate)
        .bind(&self.pregnancy_prevention_programme)
        .bind(&self.folic_acid)
        .bind(&self.contraception_interaction_reviewed)
        .bind(&self.mental_health_concern)
        .bind(&self.specialist_review_needed)
        .bind(self.next_review_due)
        .bind(&self.care_plan)
        .bind(&self.review_context)
        .bind(self.patient_id)
        .bind(self.clinician_id)
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
        .prefix("api/epilepsy_reviews/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
