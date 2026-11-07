//! Cardiology requests module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
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
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Status.
    pub status: String,
    /// Site name.
    pub site_name: String,
    /// Setting.
    pub setting: String,
    /// Referral date.
    pub referral_date: Option<Date>,
    /// Requested by date.
    pub requested_by_date: Option<Date>,
    /// Requested service.
    pub requested_service: String,
    /// Referral reason.
    pub referral_reason: String,
    /// Clinical question.
    pub clinical_question: String,
    /// Relevant history.
    pub relevant_history: String,
    /// Symptom chest pain.
    pub symptom_chest_pain: bool,
    /// Chest pain character.
    pub chest_pain_character: String,
    /// Symptom breathlessness.
    pub symptom_breathlessness: bool,
    /// Nyha class.
    pub nyha_class: String,
    /// Symptom palpitations.
    pub symptom_palpitations: bool,
    /// Symptom syncope.
    pub symptom_syncope: bool,
    /// Symptom oedema.
    pub symptom_oedema: bool,
    /// Suspected acs.
    pub suspected_acs: bool,
    /// Exertional syncope.
    pub exertional_syncope: bool,
    /// New onset heart failure.
    pub new_onset_heart_failure: bool,
    /// Ecg done.
    pub ecg_done: bool,
    /// Ecg findings.
    pub ecg_findings: String,
    /// Troponin status.
    pub troponin_status: String,
    /// Bnp status.
    pub bnp_status: String,
    /// Known coronary artery disease.
    pub known_coronary_artery_disease: bool,
    /// Previous mi.
    pub previous_mi: bool,
    /// Heart failure.
    pub heart_failure: bool,
    /// Valve disease.
    pub valve_disease: bool,
    /// Arrhythmia.
    pub arrhythmia: bool,
    /// Hypertension.
    pub hypertension: bool,
    /// Diabetes.
    pub diabetes: bool,
    /// Current medications.
    pub current_medications: String,
    /// Urgency.
    pub urgency: String,
    /// Supervising consultant.
    pub supervising_consultant: String,
    /// Requester contact.
    pub requester_contact: String,
    /// Notes.
    pub notes: String,
    /// Patient ID.
    pub patient_id: Uuid,
    /// Clinician ID.
    pub clinician_id: Uuid,
}
/// Cardiology requests.
pub type CardiologyRequests = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM cardiology_requests WHERE deleted_at IS NULL ORDER BY id LIMIT \
            $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total =
            sqlx::query_scalar("SELECT COUNT(*) FROM cardiology_requests WHERE deleted_at IS NULL")
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
        sqlx::query_as("SELECT * FROM cardiology_requests WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE cardiology_requests SET deleted_at = now(), \
            updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), \
            child1 AS (UPDATE cardiology_request_grades SET deleted_at = now(), \
            updated_at = now() WHERE cardiology_request_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            cardiology_request_grade_rules SET deleted_at = now(), updated_at = now() \
            WHERE cardiology_request_grade_id IN (SELECT id FROM child1) AND deleted_at \
            IS NULL RETURNING id), child3 AS (UPDATE cardiology_request_grade_flags SET \
            deleted_at = now(), updated_at = now() WHERE cardiology_request_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) \
            FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
