//! Cardiology-responses domain model: constructors, mappers, query helpers.

use serde::{Deserialize, Serialize};

use crate::engine::types::CardiologyResponse;
use crate::support::prelude::*;
use chrono::Utc;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
#[allow(clippy::struct_excessive_bools)] // mirrors the form's sql/ boolean columns (source of truth)
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at (soft-delete).
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Free-text reference back to the originating referral request.
    pub originating_request_reference: String,
    /// Response lifecycle status.
    pub response_status: String,
    /// Type of cardiology consultation.
    pub consultation_type: String,
    /// Date the patient was assessed / reviewed.
    pub assessed_date: Option<Date>,
    /// Date the response was authored / signed.
    pub responded_date: Option<Date>,
    /// Narrative clinical summary of the assessment.
    pub clinical_summary: String,
    /// Cardiovascular examination findings.
    pub examination_findings: String,
    /// Investigations performed or reviewed and their findings.
    pub investigations_performed: String,
    /// Structured finding: ischaemia or coronary artery disease.
    pub ischaemia_or_cad: bool,
    /// Structured finding: significant arrhythmia.
    pub significant_arrhythmia: bool,
    /// Structured finding: reduced left-ventricular ejection fraction.
    pub reduced_ejection_fraction: bool,
    /// Structured finding: significant valve disease.
    pub significant_valve_disease: bool,
    /// Structured finding: structural cardiac abnormality.
    pub structural_abnormality: bool,
    /// Structured finding: uncontrolled hypertension.
    pub uncontrolled_hypertension: bool,
    /// Structured finding: a non-cardiac cause was identified.
    pub non_cardiac_cause: bool,
    /// Primary diagnosis category.
    pub primary_diagnosis_category: String,
    /// Narrative diagnosis answering the referral clinical question.
    pub diagnosis_narrative: String,
    /// Left-ventricular ejection fraction percentage (0-100).
    pub lv_ejection_fraction_percent: Option<f64>,
    /// Management plan including investigations and treatment.
    pub management_plan: String,
    /// Medication changes recommended or made.
    pub medication_changes: String,
    /// Recommended follow-up.
    pub recommended_follow_up: String,
    /// Whether a critical / unexpected significant cardiac result is present.
    pub critical_result: bool,
    /// Whether the critical result was communicated to the referrer.
    pub critical_result_communicated: bool,
    /// Who the critical / urgent result was communicated to.
    pub reported_to: String,
    /// Foreign key to the patient.
    pub patient_id: Uuid,
    /// Foreign key to the responding clinician.
    pub clinician_id: Uuid,
}
/// Cardiology responses entity alias.
pub type CardiologyResponses = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM cardiology_responses WHERE deleted_at IS NULL ORDER BY id \
            LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM cardiology_responses WHERE deleted_at IS NULL",
        )
        .fetch_one(db)
        .await?;
        Ok((rows, total))
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM cardiology_responses WHERE id = $1 AND deleted_at IS NULL")
            .bind(id)
            .fetch_optional(db)
            .await
    }

    /// Delete the row with this id.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query(
            "WITH target AS (UPDATE cardiology_responses SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE cardiology_response_grades SET deleted_at = now(), \
            updated_at = now() WHERE cardiology_response_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            cardiology_response_grade_rules SET deleted_at = now(), updated_at = now() \
            WHERE cardiology_response_grade_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id), child3 AS (UPDATE cardiology_response_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE cardiology_response_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}

/// Parse an ISO-8601 `YYYY-MM-DD` string into a `Date`, or `None` if empty / invalid.
fn parse_date(s: &str) -> Option<Date> {
    if s.is_empty() {
        return None;
    }
    chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d").ok()
}

impl Model {
    /// Insert a row from an engine payload plus its foreign keys.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn insert_payload(
        db: &PgPool,
        patient_id: Uuid,
        clinician_id: Uuid,
        payload: &CardiologyResponse,
    ) -> sqlx::Result<Self> {
        let now = Utc::now();
        sqlx::query_as(
            "INSERT INTO cardiology_responses (created_at, updated_at, patient_id, \
            clinician_id, originating_request_reference, response_status, consultation_type, \
            assessed_date, responded_date, clinical_summary, examination_findings, \
            investigations_performed, ischaemia_or_cad, significant_arrhythmia, \
            reduced_ejection_fraction, significant_valve_disease, structural_abnormality, \
            uncontrolled_hypertension, non_cardiac_cause, primary_diagnosis_category, \
            diagnosis_narrative, lv_ejection_fraction_percent, management_plan, \
            medication_changes, recommended_follow_up, critical_result, \
            critical_result_communicated, reported_to) VALUES ($1, $2, $3, $4, $5, $6, $7, \
            $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, \
            $24, $25, $26, $27, $28) RETURNING *",
        )
        .bind(now)
        .bind(now)
        .bind(patient_id)
        .bind(clinician_id)
        .bind(payload.originating_request_reference.clone())
        .bind(payload.response_status.clone())
        .bind(payload.consultation_type.clone())
        .bind(parse_date(&payload.assessed_date))
        .bind(parse_date(&payload.responded_date))
        .bind(payload.clinical_summary.clone())
        .bind(payload.examination_findings.clone())
        .bind(payload.investigations_performed.clone())
        .bind(payload.ischaemia_or_cad)
        .bind(payload.significant_arrhythmia)
        .bind(payload.reduced_ejection_fraction)
        .bind(payload.significant_valve_disease)
        .bind(payload.structural_abnormality)
        .bind(payload.uncontrolled_hypertension)
        .bind(payload.non_cardiac_cause)
        .bind(payload.primary_diagnosis_category.clone())
        .bind(payload.diagnosis_narrative.clone())
        .bind(payload.lv_ejection_fraction_percent)
        .bind(payload.management_plan.clone())
        .bind(payload.medication_changes.clone())
        .bind(payload.recommended_follow_up.clone())
        .bind(payload.critical_result)
        .bind(payload.critical_result_communicated)
        .bind(payload.reported_to.clone())
        .fetch_one(db)
        .await
    }

    /// Overwrite a row from an engine payload, keeping its creation time.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn update_payload(
        db: &PgPool,
        id: Uuid,
        patient_id: Uuid,
        clinician_id: Uuid,
        payload: &CardiologyResponse,
    ) -> sqlx::Result<Self> {
        let now = Utc::now();
        sqlx::query_as(
            "UPDATE cardiology_responses SET updated_at = $2, patient_id = $3, \
            clinician_id = $4, originating_request_reference = $5, response_status = $6, \
            consultation_type = $7, assessed_date = $8, responded_date = $9, \
            clinical_summary = $10, examination_findings = $11, investigations_performed \
            = $12, ischaemia_or_cad = $13, significant_arrhythmia = $14, \
            reduced_ejection_fraction = $15, significant_valve_disease = $16, \
            structural_abnormality = $17, uncontrolled_hypertension = $18, \
            non_cardiac_cause = $19, primary_diagnosis_category = $20, \
            diagnosis_narrative = $21, lv_ejection_fraction_percent = $22, \
            management_plan = $23, medication_changes = $24, recommended_follow_up = \
            $25, critical_result = $26, critical_result_communicated = $27, reported_to \
            = $28 WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(now)
        .bind(patient_id)
        .bind(clinician_id)
        .bind(payload.originating_request_reference.clone())
        .bind(payload.response_status.clone())
        .bind(payload.consultation_type.clone())
        .bind(parse_date(&payload.assessed_date))
        .bind(parse_date(&payload.responded_date))
        .bind(payload.clinical_summary.clone())
        .bind(payload.examination_findings.clone())
        .bind(payload.investigations_performed.clone())
        .bind(payload.ischaemia_or_cad)
        .bind(payload.significant_arrhythmia)
        .bind(payload.reduced_ejection_fraction)
        .bind(payload.significant_valve_disease)
        .bind(payload.structural_abnormality)
        .bind(payload.uncontrolled_hypertension)
        .bind(payload.non_cardiac_cause)
        .bind(payload.primary_diagnosis_category.clone())
        .bind(payload.diagnosis_narrative.clone())
        .bind(payload.lv_ejection_fraction_percent)
        .bind(payload.management_plan.clone())
        .bind(payload.medication_changes.clone())
        .bind(payload.recommended_follow_up.clone())
        .bind(payload.critical_result)
        .bind(payload.critical_result_communicated)
        .bind(payload.reported_to.clone())
        .fetch_one(db)
        .await
    }

    /// Mark a row deleted.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn soft_delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query(
            "WITH target AS (UPDATE cardiology_responses SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE cardiology_response_grades SET deleted_at = now(), \
            updated_at = now() WHERE cardiology_response_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            cardiology_response_grade_rules SET deleted_at = now(), updated_at = now() \
            WHERE cardiology_response_grade_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id), child3 AS (UPDATE cardiology_response_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE cardiology_response_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}

impl Model {
    /// Project this row into the engine's [`CardiologyResponse`] payload so the
    /// four-axis grader can run over it.
    #[must_use]
    pub fn to_payload(&self) -> CardiologyResponse {
        CardiologyResponse {
            responding_clinician: String::new(),
            originating_request_reference: self.originating_request_reference.clone(),
            response_status: self.response_status.clone(),
            consultation_type: self.consultation_type.clone(),
            assessed_date: self
                .assessed_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            responded_date: self
                .responded_date
                .map(|d| d.to_string())
                .unwrap_or_default(),
            patient_name: String::new(),
            patient_nhs_number: String::new(),
            patient_birth_date: String::new(),
            clinical_summary: self.clinical_summary.clone(),
            examination_findings: self.examination_findings.clone(),
            investigations_performed: self.investigations_performed.clone(),
            ischaemia_or_cad: self.ischaemia_or_cad,
            significant_arrhythmia: self.significant_arrhythmia,
            reduced_ejection_fraction: self.reduced_ejection_fraction,
            significant_valve_disease: self.significant_valve_disease,
            structural_abnormality: self.structural_abnormality,
            uncontrolled_hypertension: self.uncontrolled_hypertension,
            non_cardiac_cause: self.non_cardiac_cause,
            primary_diagnosis_category: self.primary_diagnosis_category.clone(),
            diagnosis_narrative: self.diagnosis_narrative.clone(),
            lv_ejection_fraction_percent: self.lv_ejection_fraction_percent,
            management_plan: self.management_plan.clone(),
            medication_changes: self.medication_changes.clone(),
            recommended_follow_up: self.recommended_follow_up.clone(),
            critical_result: self.critical_result,
            critical_result_communicated: self.critical_result_communicated,
            reported_to: self.reported_to.clone(),
            clinician_notes: String::new(),
            signed: false,
        }
    }
}

/// Find a response by its UUID.
///
/// # Errors
/// Returns a database error if the query fails.
pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
    Model::find_by_id(db, id).await
}

/// One page of rows, newest first, and how many rows there are in all.
///
/// # Errors
/// Returns a database error if a query fails.
pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Model>, i64)> {
    let (limit, offset) = page.bounds();
    let rows = sqlx::query_as::<_, Model>(
        "SELECT * FROM cardiology_responses WHERE deleted_at IS NULL ORDER BY \
            created_at DESC, id LIMIT $1 OFFSET $2",
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(db)
    .await?;
    let total =
        sqlx::query_scalar("SELECT COUNT(*) FROM cardiology_responses WHERE deleted_at IS NULL")
            .fetch_one(db)
            .await?;
    Ok((rows, total))
}
