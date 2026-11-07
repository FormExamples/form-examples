#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::mental_health_act_assessments::Model;

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
    pub assessed_at: Option<DateTimeWithTimeZone>,
    pub location: String,
    pub referral_source: String,
    pub reason_for_assessment: String,
    pub person_identifier: String,
    pub age_band: String,
    pub sex: String,
    pub first_language: String,
    pub amhp_name: String,
    pub amhp_approved: String,
    pub doctor1_name: String,
    pub doctor1_gmc_number: String,
    pub doctor1_section12_approved: String,
    pub doctor1_examined_at: Option<DateTimeWithTimeZone>,
    pub doctor2_name: String,
    pub doctor2_gmc_number: String,
    pub doctor2_section12_approved: String,
    pub doctor2_examined_at: Option<DateTimeWithTimeZone>,
    pub prior_acquaintance: String,
    pub mental_disorder_present: String,
    pub mental_disorder_evidence: String,
    pub risk_to_own_health: String,
    pub risk_to_own_safety: String,
    pub risk_to_others: String,
    pub risk_evidence: String,
    pub risk_imminence: String,
    pub least_restrictive_met: String,
    pub alternatives_considered: String,
    pub appropriate_treatment_available: String,
    pub treatment_plan_summary: String,
    pub nearest_relative_identified: String,
    pub nearest_relative_consulted: String,
    pub nearest_relative_objection: String,
    pub consultation_record: String,
    pub recommended_section: String,
    pub outcome: String,
    pub bed_identified: String,
    pub conveyance: String,
    pub clinical_legal_note: String,
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO mental_health_act_assessments (patient_id, clinician_id, assessed_at, \
            location, referral_source, reason_for_assessment, person_identifier, age_band, \
            sex, first_language, amhp_name, amhp_approved, doctor1_name, doctor1_gmc_number, \
            doctor1_section12_approved, doctor1_examined_at, doctor2_name, \
            doctor2_gmc_number, doctor2_section12_approved, doctor2_examined_at, \
            prior_acquaintance, mental_disorder_present, mental_disorder_evidence, \
            risk_to_own_health, risk_to_own_safety, risk_to_others, risk_evidence, \
            risk_imminence, least_restrictive_met, alternatives_considered, \
            appropriate_treatment_available, treatment_plan_summary, \
            nearest_relative_identified, nearest_relative_consulted, \
            nearest_relative_objection, consultation_record, recommended_section, outcome, \
            bed_identified, conveyance, clinical_legal_note) VALUES ($1, $2, $3, $4, $5, $6, \
            $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, \
            $40, $41) RETURNING *",
        )
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.assessed_at)
        .bind(&self.location)
        .bind(&self.referral_source)
        .bind(&self.reason_for_assessment)
        .bind(&self.person_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.first_language)
        .bind(&self.amhp_name)
        .bind(&self.amhp_approved)
        .bind(&self.doctor1_name)
        .bind(&self.doctor1_gmc_number)
        .bind(&self.doctor1_section12_approved)
        .bind(self.doctor1_examined_at)
        .bind(&self.doctor2_name)
        .bind(&self.doctor2_gmc_number)
        .bind(&self.doctor2_section12_approved)
        .bind(self.doctor2_examined_at)
        .bind(&self.prior_acquaintance)
        .bind(&self.mental_disorder_present)
        .bind(&self.mental_disorder_evidence)
        .bind(&self.risk_to_own_health)
        .bind(&self.risk_to_own_safety)
        .bind(&self.risk_to_others)
        .bind(&self.risk_evidence)
        .bind(&self.risk_imminence)
        .bind(&self.least_restrictive_met)
        .bind(&self.alternatives_considered)
        .bind(&self.appropriate_treatment_available)
        .bind(&self.treatment_plan_summary)
        .bind(&self.nearest_relative_identified)
        .bind(&self.nearest_relative_consulted)
        .bind(&self.nearest_relative_objection)
        .bind(&self.consultation_record)
        .bind(&self.recommended_section)
        .bind(&self.outcome)
        .bind(&self.bed_identified)
        .bind(&self.conveyance)
        .bind(&self.clinical_legal_note)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE mental_health_act_assessments SET patient_id = $2, clinician_id = $3, \
            assessed_at = $4, location = $5, referral_source = $6, reason_for_assessment \
            = $7, person_identifier = $8, age_band = $9, sex = $10, first_language = \
            $11, amhp_name = $12, amhp_approved = $13, doctor1_name = $14, \
            doctor1_gmc_number = $15, doctor1_section12_approved = $16, \
            doctor1_examined_at = $17, doctor2_name = $18, doctor2_gmc_number = $19, \
            doctor2_section12_approved = $20, doctor2_examined_at = $21, \
            prior_acquaintance = $22, mental_disorder_present = $23, \
            mental_disorder_evidence = $24, risk_to_own_health = $25, risk_to_own_safety \
            = $26, risk_to_others = $27, risk_evidence = $28, risk_imminence = $29, \
            least_restrictive_met = $30, alternatives_considered = $31, \
            appropriate_treatment_available = $32, treatment_plan_summary = $33, \
            nearest_relative_identified = $34, nearest_relative_consulted = $35, \
            nearest_relative_objection = $36, consultation_record = $37, \
            recommended_section = $38, outcome = $39, bed_identified = $40, conveyance = \
            $41, clinical_legal_note = $42, updated_at = now() WHERE id = $1 AND \
            deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.patient_id)
        .bind(self.clinician_id)
        .bind(self.assessed_at)
        .bind(&self.location)
        .bind(&self.referral_source)
        .bind(&self.reason_for_assessment)
        .bind(&self.person_identifier)
        .bind(&self.age_band)
        .bind(&self.sex)
        .bind(&self.first_language)
        .bind(&self.amhp_name)
        .bind(&self.amhp_approved)
        .bind(&self.doctor1_name)
        .bind(&self.doctor1_gmc_number)
        .bind(&self.doctor1_section12_approved)
        .bind(self.doctor1_examined_at)
        .bind(&self.doctor2_name)
        .bind(&self.doctor2_gmc_number)
        .bind(&self.doctor2_section12_approved)
        .bind(self.doctor2_examined_at)
        .bind(&self.prior_acquaintance)
        .bind(&self.mental_disorder_present)
        .bind(&self.mental_disorder_evidence)
        .bind(&self.risk_to_own_health)
        .bind(&self.risk_to_own_safety)
        .bind(&self.risk_to_others)
        .bind(&self.risk_evidence)
        .bind(&self.risk_imminence)
        .bind(&self.least_restrictive_met)
        .bind(&self.alternatives_considered)
        .bind(&self.appropriate_treatment_available)
        .bind(&self.treatment_plan_summary)
        .bind(&self.nearest_relative_identified)
        .bind(&self.nearest_relative_consulted)
        .bind(&self.nearest_relative_objection)
        .bind(&self.consultation_record)
        .bind(&self.recommended_section)
        .bind(&self.outcome)
        .bind(&self.bed_identified)
        .bind(&self.conveyance)
        .bind(&self.clinical_legal_note)
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
        .prefix("api/mental_health_act_assessments/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
