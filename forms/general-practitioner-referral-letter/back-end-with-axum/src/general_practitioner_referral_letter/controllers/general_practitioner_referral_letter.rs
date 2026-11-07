#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::general_practitioner_referral_letters::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub patient_identifier: String,
    pub referrer_role: String,
    pub referring_practice: String,
    pub referral_date: Option<Date>,
    pub access_needs: String,
    pub referral_specialty: String,
    pub named_clinician: String,
    pub receiving_organisation: String,
    pub urgency: String,
    pub urgency_reason: String,
    pub suspected_cancer_criterion: String,
    pub suspected_cancer_pathway: String,
    pub reason_for_referral: String,
    pub relevant_history: String,
    pub presenting_problem: String,
    pub symptom_duration: String,
    pub red_flag_symptoms: String,
    pub examination_findings: String,
    pub investigation_results: String,
    pub current_medications: String,
    pub allergies: String,
    pub patient_expectations: String,
    pub consent_to_share: String,
    pub safety_netting: String,
    pub clinical_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO general_practitioner_referral_letters (patient_id, clinician_id, \
            patient_identifier, referrer_role, referring_practice, referral_date, \
            access_needs, referral_specialty, named_clinician, receiving_organisation, \
            urgency, urgency_reason, suspected_cancer_criterion, suspected_cancer_pathway, \
            reason_for_referral, relevant_history, presenting_problem, symptom_duration, \
            red_flag_symptoms, examination_findings, investigation_results, \
            current_medications, allergies, patient_expectations, consent_to_share, \
            safety_netting, clinical_note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, \
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, \
            $27) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.patient_identifier)
        .bind(&self.referrer_role)
        .bind(&self.referring_practice)
        .bind(self.referral_date)
        .bind(&self.access_needs)
        .bind(&self.referral_specialty)
        .bind(&self.named_clinician)
        .bind(&self.receiving_organisation)
        .bind(&self.urgency)
        .bind(&self.urgency_reason)
        .bind(&self.suspected_cancer_criterion)
        .bind(&self.suspected_cancer_pathway)
        .bind(&self.reason_for_referral)
        .bind(&self.relevant_history)
        .bind(&self.presenting_problem)
        .bind(&self.symptom_duration)
        .bind(&self.red_flag_symptoms)
        .bind(&self.examination_findings)
        .bind(&self.investigation_results)
        .bind(&self.current_medications)
        .bind(&self.allergies)
        .bind(&self.patient_expectations)
        .bind(&self.consent_to_share)
        .bind(&self.safety_netting)
        .bind(&self.clinical_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE general_practitioner_referral_letters SET patient_id = $2, \
            clinician_id = $3, patient_identifier = $4, referrer_role = $5, \
            referring_practice = $6, referral_date = $7, access_needs = $8, \
            referral_specialty = $9, named_clinician = $10, receiving_organisation = \
            $11, urgency = $12, urgency_reason = $13, suspected_cancer_criterion = $14, \
            suspected_cancer_pathway = $15, reason_for_referral = $16, relevant_history \
            = $17, presenting_problem = $18, symptom_duration = $19, red_flag_symptoms = \
            $20, examination_findings = $21, investigation_results = $22, \
            current_medications = $23, allergies = $24, patient_expectations = $25, \
            consent_to_share = $26, safety_netting = $27, clinical_note = $28, \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(&self.patient_identifier)
        .bind(&self.referrer_role)
        .bind(&self.referring_practice)
        .bind(self.referral_date)
        .bind(&self.access_needs)
        .bind(&self.referral_specialty)
        .bind(&self.named_clinician)
        .bind(&self.receiving_organisation)
        .bind(&self.urgency)
        .bind(&self.urgency_reason)
        .bind(&self.suspected_cancer_criterion)
        .bind(&self.suspected_cancer_pathway)
        .bind(&self.reason_for_referral)
        .bind(&self.relevant_history)
        .bind(&self.presenting_problem)
        .bind(&self.symptom_duration)
        .bind(&self.red_flag_symptoms)
        .bind(&self.examination_findings)
        .bind(&self.investigation_results)
        .bind(&self.current_medications)
        .bind(&self.allergies)
        .bind(&self.patient_expectations)
        .bind(&self.consent_to_share)
        .bind(&self.safety_netting)
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
        .prefix("api/general_practitioner_referral_letters/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
