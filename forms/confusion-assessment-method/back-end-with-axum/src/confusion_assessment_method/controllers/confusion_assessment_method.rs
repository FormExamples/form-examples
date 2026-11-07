#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::confusion_assessment_methods::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub assessor_name: String,
    pub assessor_role: String,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub ward_unit: String,
    pub cam_variant: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub cognitive_baseline: String,
    pub collateral_source: String,
    pub feature_acute_onset_fluctuating: String,
    pub onset_timing: String,
    pub feature_inattention: String,
    pub attention_test: String,
    pub feature_disorganised_thinking: String,
    pub feature_altered_consciousness: String,
    pub consciousness_level: String,
    pub rass_score: Option<i32>,
    pub motoric_subtype: String,
    pub hallucinations: bool,
    pub delusions: bool,
    pub sleep_wake_disturbance: bool,
    pub deliriogenic_medication: bool,
    pub deliriogenic_medication_detail: String,
    pub suspected_precipitants: String,
    pub recommended_actions: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO confusion_assessment_methods (patient_id, clinician_id, \
            assessor_name, assessor_role, assessed_at, ward_unit, cam_variant, \
            patient_identifier, age_band, sex, cognitive_baseline, collateral_source, \
            feature_acute_onset_fluctuating, onset_timing, feature_inattention, \
            attention_test, feature_disorganised_thinking, feature_altered_consciousness, \
            consciousness_level, rass_score, motoric_subtype, hallucinations, delusions, \
            sleep_wake_disturbance, deliriogenic_medication, deliriogenic_medication_detail, \
            suspected_precipitants, recommended_actions, clinical_note) VALUES ($1, $2, $3, \
            $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, \
            $21, $22, $23, $24, $25, $26, $27, $28, $29) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.assessor_name)
        .bind(&self.assessor_role)
        .bind(self.assessed_at)
        .bind(&self.ward_unit)
        .bind(&self.cam_variant)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.cognitive_baseline)
        .bind(&self.collateral_source)
        .bind(&self.feature_acute_onset_fluctuating)
        .bind(&self.onset_timing)
        .bind(&self.feature_inattention)
        .bind(&self.attention_test)
        .bind(&self.feature_disorganised_thinking)
        .bind(&self.feature_altered_consciousness)
        .bind(&self.consciousness_level)
        .bind(self.rass_score)
        .bind(&self.motoric_subtype)
        .bind(self.hallucinations)
        .bind(self.delusions)
        .bind(self.sleep_wake_disturbance)
        .bind(self.deliriogenic_medication)
        .bind(&self.deliriogenic_medication_detail)
        .bind(&self.suspected_precipitants)
        .bind(&self.recommended_actions)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE confusion_assessment_methods SET patient_id = $2, clinician_id = $3, \
            assessor_name = $4, assessor_role = $5, assessed_at = $6, ward_unit = $7, \
            cam_variant = $8, patient_identifier = $9, age_band = $10, sex = $11, \
            cognitive_baseline = $12, collateral_source = $13, \
            feature_acute_onset_fluctuating = $14, onset_timing = $15, \
            feature_inattention = $16, attention_test = $17, \
            feature_disorganised_thinking = $18, feature_altered_consciousness = $19, \
            consciousness_level = $20, rass_score = $21, motoric_subtype = $22, \
            hallucinations = $23, delusions = $24, sleep_wake_disturbance = $25, \
            deliriogenic_medication = $26, deliriogenic_medication_detail = $27, \
            suspected_precipitants = $28, recommended_actions = $29, clinical_note = \
            $30, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.assessor_name)
        .bind(&self.assessor_role)
        .bind(self.assessed_at)
        .bind(&self.ward_unit)
        .bind(&self.cam_variant)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.cognitive_baseline)
        .bind(&self.collateral_source)
        .bind(&self.feature_acute_onset_fluctuating)
        .bind(&self.onset_timing)
        .bind(&self.feature_inattention)
        .bind(&self.attention_test)
        .bind(&self.feature_disorganised_thinking)
        .bind(&self.feature_altered_consciousness)
        .bind(&self.consciousness_level)
        .bind(self.rass_score)
        .bind(&self.motoric_subtype)
        .bind(self.hallucinations)
        .bind(self.delusions)
        .bind(self.sleep_wake_disturbance)
        .bind(self.deliriogenic_medication)
        .bind(&self.deliriogenic_medication_detail)
        .bind(&self.suspected_precipitants)
        .bind(&self.recommended_actions)
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
        .prefix("api/confusion_assessment_methods/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
