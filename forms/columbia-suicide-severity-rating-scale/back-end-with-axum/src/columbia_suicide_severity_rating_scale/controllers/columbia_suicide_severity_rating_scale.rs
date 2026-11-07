#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::columbia_suicide_severity_rating_scales::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub clinician_name: String,
    pub clinician_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub care_setting: String,
    pub scale_version: String,
    pub reason_for_assessment: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub wish_to_be_dead: String,
    pub non_specific_active_thoughts: String,
    pub active_ideation_methods: String,
    pub active_ideation_intent: String,
    pub active_ideation_plan: String,
    pub ideation_timeframe: String,
    pub ideation_frequency: Option<i32>,
    pub ideation_duration: Option<i32>,
    pub ideation_controllability: Option<i32>,
    pub ideation_deterrents: Option<i32>,
    pub ideation_reasons: Option<i32>,
    pub actual_attempt: String,
    pub interrupted_attempt: String,
    pub aborted_attempt: String,
    pub preparatory_acts: String,
    pub non_suicidal_self_injury: String,
    pub behaviour_recency: String,
    pub lifetime_attempt_count: Option<i32>,
    pub most_recent_attempt_date: Option<Date>,
    pub actual_lethality: Option<i32>,
    pub potential_lethality: Option<i32>,
    pub access_to_lethal_means: String,
    pub protective_factors: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO columbia_suicide_severity_rating_scales (patient_id, clinician_id, \
            clinician_name, clinician_role, assessed_at, care_setting, scale_version, \
            reason_for_assessment, patient_identifier, age_band, sex, wish_to_be_dead, \
            non_specific_active_thoughts, active_ideation_methods, active_ideation_intent, \
            active_ideation_plan, ideation_timeframe, ideation_frequency, ideation_duration, \
            ideation_controllability, ideation_deterrents, ideation_reasons, actual_attempt, \
            interrupted_attempt, aborted_attempt, preparatory_acts, non_suicidal_self_injury, \
            behaviour_recency, lifetime_attempt_count, most_recent_attempt_date, \
            actual_lethality, potential_lethality, access_to_lethal_means, \
            protective_factors, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, \
            $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, \
            $26, $27, $28, $29, $30, $31, $32, $33, $34, $35) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.scale_version)
        .bind(&self.reason_for_assessment)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.wish_to_be_dead)
        .bind(&self.non_specific_active_thoughts)
        .bind(&self.active_ideation_methods)
        .bind(&self.active_ideation_intent)
        .bind(&self.active_ideation_plan)
        .bind(&self.ideation_timeframe)
        .bind(self.ideation_frequency)
        .bind(self.ideation_duration)
        .bind(self.ideation_controllability)
        .bind(self.ideation_deterrents)
        .bind(self.ideation_reasons)
        .bind(&self.actual_attempt)
        .bind(&self.interrupted_attempt)
        .bind(&self.aborted_attempt)
        .bind(&self.preparatory_acts)
        .bind(&self.non_suicidal_self_injury)
        .bind(&self.behaviour_recency)
        .bind(self.lifetime_attempt_count)
        .bind(self.most_recent_attempt_date)
        .bind(self.actual_lethality)
        .bind(self.potential_lethality)
        .bind(&self.access_to_lethal_means)
        .bind(&self.protective_factors)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE columbia_suicide_severity_rating_scales SET patient_id = $2, \
            clinician_id = $3, clinician_name = $4, clinician_role = $5, assessed_at = \
            $6, care_setting = $7, scale_version = $8, reason_for_assessment = $9, \
            patient_identifier = $10, age_band = $11, sex = $12, wish_to_be_dead = $13, \
            non_specific_active_thoughts = $14, active_ideation_methods = $15, \
            active_ideation_intent = $16, active_ideation_plan = $17, ideation_timeframe \
            = $18, ideation_frequency = $19, ideation_duration = $20, \
            ideation_controllability = $21, ideation_deterrents = $22, ideation_reasons \
            = $23, actual_attempt = $24, interrupted_attempt = $25, aborted_attempt = \
            $26, preparatory_acts = $27, non_suicidal_self_injury = $28, \
            behaviour_recency = $29, lifetime_attempt_count = $30, \
            most_recent_attempt_date = $31, actual_lethality = $32, potential_lethality \
            = $33, access_to_lethal_means = $34, protective_factors = $35, clinical_note \
            = $36, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.clinician_name)
        .bind(&self.clinician_role)
        .bind(self.assessed_at)
        .bind(&self.care_setting)
        .bind(&self.scale_version)
        .bind(&self.reason_for_assessment)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.wish_to_be_dead)
        .bind(&self.non_specific_active_thoughts)
        .bind(&self.active_ideation_methods)
        .bind(&self.active_ideation_intent)
        .bind(&self.active_ideation_plan)
        .bind(&self.ideation_timeframe)
        .bind(self.ideation_frequency)
        .bind(self.ideation_duration)
        .bind(self.ideation_controllability)
        .bind(self.ideation_deterrents)
        .bind(self.ideation_reasons)
        .bind(&self.actual_attempt)
        .bind(&self.interrupted_attempt)
        .bind(&self.aborted_attempt)
        .bind(&self.preparatory_acts)
        .bind(&self.non_suicidal_self_injury)
        .bind(&self.behaviour_recency)
        .bind(self.lifetime_attempt_count)
        .bind(self.most_recent_attempt_date)
        .bind(self.actual_lethality)
        .bind(self.potential_lethality)
        .bind(&self.access_to_lethal_means)
        .bind(&self.protective_factors)
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
        .prefix("api/columbia_suicide_severity_rating_scales/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
