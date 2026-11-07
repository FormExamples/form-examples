#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::orthopaedics_waiting_list_cards::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub practitioner_id: Uuid,
    pub status: String,
    pub entry_date: Option<Date>,
    pub entry_time: Option<String>,
    pub referral_source: String,
    pub referral_date: Option<Date>,
    pub referral_letter_reference: String,
    pub reason_for_referral: String,
    pub presenting_condition: String,
    pub icd_10_code: String,
    pub snomed_ct_code: String,
    pub suspected_cancer: String,
    pub list_name: String,
    pub specialty: String,
    pub sub_specialty: String,
    pub procedure_description: String,
    pub opcs_4_code: String,
    pub clinical_priority: String,
    pub rtt_clock_start_date: Option<Date>,
    pub expected_procedure_type: String,
    pub expected_wait_weeks: Option<i32>,
    pub consent_to_reminders: String,
    pub communication_notes: String,
    pub additional_notes: String,
    pub signed_at: Option<DateTimeWithTimeZone>,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO orthopaedics_waiting_list_cards (patient_id, practitioner_id, \
            status, entry_date, entry_time, referral_source, referral_date, \
            referral_letter_reference, reason_for_referral, presenting_condition, \
            icd_10_code, snomed_ct_code, suspected_cancer, list_name, specialty, \
            sub_specialty, procedure_description, opcs_4_code, clinical_priority, \
            rtt_clock_start_date, expected_procedure_type, expected_wait_weeks, \
            consent_to_reminders, communication_notes, additional_notes, signed_at) \
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, \
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.practitioner_id)
        .bind(&self.status)
        .bind(self.entry_date)
        .bind(&self.entry_time)
        .bind(&self.referral_source)
        .bind(self.referral_date)
        .bind(&self.referral_letter_reference)
        .bind(&self.reason_for_referral)
        .bind(&self.presenting_condition)
        .bind(&self.icd_10_code)
        .bind(&self.snomed_ct_code)
        .bind(&self.suspected_cancer)
        .bind(&self.list_name)
        .bind(&self.specialty)
        .bind(&self.sub_specialty)
        .bind(&self.procedure_description)
        .bind(&self.opcs_4_code)
        .bind(&self.clinical_priority)
        .bind(self.rtt_clock_start_date)
        .bind(&self.expected_procedure_type)
        .bind(self.expected_wait_weeks)
        .bind(&self.consent_to_reminders)
        .bind(&self.communication_notes)
        .bind(&self.additional_notes)
        .bind(self.signed_at)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE orthopaedics_waiting_list_cards SET patient_id = $2, practitioner_id \
            = $3, status = $4, entry_date = $5, entry_time = $6, referral_source = $7, \
            referral_date = $8, referral_letter_reference = $9, reason_for_referral = \
            $10, presenting_condition = $11, icd_10_code = $12, snomed_ct_code = $13, \
            suspected_cancer = $14, list_name = $15, specialty = $16, sub_specialty = \
            $17, procedure_description = $18, opcs_4_code = $19, clinical_priority = \
            $20, rtt_clock_start_date = $21, expected_procedure_type = $22, \
            expected_wait_weeks = $23, consent_to_reminders = $24, communication_notes = \
            $25, additional_notes = $26, signed_at = $27, updated_at = now() WHERE id = \
            $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.practitioner_id)
        .bind(&self.status)
        .bind(self.entry_date)
        .bind(&self.entry_time)
        .bind(&self.referral_source)
        .bind(self.referral_date)
        .bind(&self.referral_letter_reference)
        .bind(&self.reason_for_referral)
        .bind(&self.presenting_condition)
        .bind(&self.icd_10_code)
        .bind(&self.snomed_ct_code)
        .bind(&self.suspected_cancer)
        .bind(&self.list_name)
        .bind(&self.specialty)
        .bind(&self.sub_specialty)
        .bind(&self.procedure_description)
        .bind(&self.opcs_4_code)
        .bind(&self.clinical_priority)
        .bind(self.rtt_clock_start_date)
        .bind(&self.expected_procedure_type)
        .bind(self.expected_wait_weeks)
        .bind(&self.consent_to_reminders)
        .bind(&self.communication_notes)
        .bind(&self.additional_notes)
        .bind(self.signed_at)
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
        .prefix("api/orthopaedics_waiting_list_cards/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
