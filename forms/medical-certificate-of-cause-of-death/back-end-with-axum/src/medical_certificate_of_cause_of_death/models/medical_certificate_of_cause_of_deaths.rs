//! medical_certificate_of_cause_of_deaths model.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// One row.
#[allow(missing_docs)]
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub id: Uuid,
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    pub certifying_doctor_name: String,
    pub certifying_doctor_grade: String,
    pub gmc_reference: String,
    pub place_of_certification: String,
    pub certification_date: Option<Date>,
    pub attended_deceased: String,
    pub last_seen_alive_date: Option<Date>,
    pub deceased_name: String,
    pub sex: String,
    pub date_of_birth: Option<Date>,
    pub age_years: Option<i32>,
    pub patient_identifier: String,
    pub date_of_death: Option<Date>,
    pub time_of_death: Option<String>,
    pub place_of_death: String,
    pub seen_after_death_by: String,
    pub cause_ia_condition: String,
    pub cause_ia_interval: String,
    pub cause_ib_condition: String,
    pub cause_ib_interval: String,
    pub cause_ic_condition: String,
    pub cause_ic_interval: String,
    pub part_ii_conditions: String,
    pub part_ii_interval: String,
    pub referred_to_coroner: String,
    pub coroner_reason: String,
    pub medical_examiner_status: String,
    pub certifier_note: String,
    pub patient_id: Uuid,
    pub clinician_id: Option<Uuid>,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = crate::support::paging::bounds(page);
        let rows = sqlx::query_as(
            "SELECT * FROM medical_certificate_of_cause_of_deaths WHERE deleted_at IS \
            NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM medical_certificate_of_cause_of_deaths WHERE deleted_at \
            IS NULL",
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
        sqlx::query_as(
            "SELECT * FROM medical_certificate_of_cause_of_deaths WHERE id = $1 AND \
            deleted_at IS NULL",
        )
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
            "WITH target AS (UPDATE medical_certificate_of_cause_of_deaths SET deleted_at \
            = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE medical_certificate_of_cause_of_death_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            medical_certificate_of_cause_of_death_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            medical_certificate_of_cause_of_death_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE medical_certificate_of_cause_of_death_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE medical_certificate_of_cause_of_death_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            medical_certificate_of_cause_of_death_grade_id IN (SELECT id FROM child1) \
            AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
