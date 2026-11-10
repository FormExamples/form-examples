#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::post_anaesthesia_care_unit_records::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub nurse_name: String,
    pub nurse_role: String,
    pub anaesthetist_name: String,
    pub admitted_at: Option<DateTimeWithTimeZone>,
    pub anaesthetic_technique: String,
    pub procedure: String,
    pub patient_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub asa_status: String,
    pub baseline_systolic_bp: Option<f64>,
    pub ambulatory_case: String,
    pub activity: String,
    pub respiration: String,
    pub circulation: String,
    pub consciousness: String,
    pub oxygen_saturation: String,
    pub airway_status: String,
    pub pain_score: Option<f64>,
    pub ponv_severity: String,
    pub analgesia_given: String,
    pub antiemetics_given: String,
    pub padss_vital_signs: String,
    pub padss_ambulation: String,
    pub padss_nausea_vomiting: String,
    pub padss_pain: String,
    pub padss_surgical_bleeding: String,
    pub recovery_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO post_anaesthesia_care_unit_records (patient_id, clinician_id, \
            nurse_name, nurse_role, anaesthetist_name, admitted_at, anaesthetic_technique, \
            procedure, patient_identifier, age_band, sex, asa_status, baseline_systolic_bp, \
            ambulatory_case, activity, respiration, circulation, consciousness, \
            oxygen_saturation, airway_status, pain_score, ponv_severity, analgesia_given, \
            antiemetics_given, padss_vital_signs, padss_ambulation, padss_nausea_vomiting, \
            padss_pain, padss_surgical_bleeding, recovery_note) VALUES ($1, $2, $3, $4, $5, \
            $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, \
            $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.nurse_name)
        .bind(&self.nurse_role)
        .bind(&self.anaesthetist_name)
        .bind(self.admitted_at)
        .bind(&self.anaesthetic_technique)
        .bind(&self.procedure)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.asa_status)
        .bind(self.baseline_systolic_bp)
        .bind(&self.ambulatory_case)
        .bind(&self.activity)
        .bind(&self.respiration)
        .bind(&self.circulation)
        .bind(&self.consciousness)
        .bind(&self.oxygen_saturation)
        .bind(&self.airway_status)
        .bind(self.pain_score)
        .bind(&self.ponv_severity)
        .bind(&self.analgesia_given)
        .bind(&self.antiemetics_given)
        .bind(&self.padss_vital_signs)
        .bind(&self.padss_ambulation)
        .bind(&self.padss_nausea_vomiting)
        .bind(&self.padss_pain)
        .bind(&self.padss_surgical_bleeding)
        .bind(&self.recovery_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE post_anaesthesia_care_unit_records SET patient_id = $2, clinician_id \
            = $3, nurse_name = $4, nurse_role = $5, anaesthetist_name = $6, admitted_at \
            = $7, anaesthetic_technique = $8, procedure = $9, patient_identifier = $10, \
            age_band = $11, sex = $12, asa_status = $13, baseline_systolic_bp = $14, \
            ambulatory_case = $15, activity = $16, respiration = $17, circulation = $18, \
            consciousness = $19, oxygen_saturation = $20, airway_status = $21, \
            pain_score = $22, ponv_severity = $23, analgesia_given = $24, \
            antiemetics_given = $25, padss_vital_signs = $26, padss_ambulation = $27, \
            padss_nausea_vomiting = $28, padss_pain = $29, padss_surgical_bleeding = \
            $30, recovery_note = $31, updated_at = now() WHERE id = $1 AND deleted_at IS \
            NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.nurse_name)
        .bind(&self.nurse_role)
        .bind(&self.anaesthetist_name)
        .bind(self.admitted_at)
        .bind(&self.anaesthetic_technique)
        .bind(&self.procedure)
        .bind(&self.patient_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.asa_status)
        .bind(self.baseline_systolic_bp)
        .bind(&self.ambulatory_case)
        .bind(&self.activity)
        .bind(&self.respiration)
        .bind(&self.circulation)
        .bind(&self.consciousness)
        .bind(&self.oxygen_saturation)
        .bind(&self.airway_status)
        .bind(self.pain_score)
        .bind(&self.ponv_severity)
        .bind(&self.analgesia_given)
        .bind(&self.antiemetics_given)
        .bind(&self.padss_vital_signs)
        .bind(&self.padss_ambulation)
        .bind(&self.padss_nausea_vomiting)
        .bind(&self.padss_pain)
        .bind(&self.padss_surgical_bleeding)
        .bind(&self.recovery_note)
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
        .prefix("api/post_anaesthesia_care_unit_records/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
