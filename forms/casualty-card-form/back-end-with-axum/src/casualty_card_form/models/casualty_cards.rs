//! casualty_cards model.

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
    pub status: String,
    pub attendance_date: Option<Date>,
    pub arrival_time: Option<DateTimeWithTimeZone>,
    pub patient_id: Uuid,
}

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM casualty_cards WHERE deleted_at IS NULL ORDER BY id LIMIT $1 \
            OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as("SELECT * FROM casualty_cards WHERE id = $1 AND deleted_at IS NULL")
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
            "WITH target AS (UPDATE casualty_cards SET deleted_at = now(), updated_at = \
            now() WHERE id = $1 AND deleted_at IS NULL RETURNING id), child1 AS (UPDATE \
            casualty_card_demographics SET deleted_at = now(), updated_at = now() WHERE \
            casualty_card_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child2 AS (UPDATE casualty_card_next_of_kins SET deleted_at = now(), \
            updated_at = now() WHERE casualty_card_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child3 AS (UPDATE casualty_card_gps SET \
            deleted_at = now(), updated_at = now() WHERE casualty_card_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child4 AS (UPDATE \
            casualty_card_arrival_triages SET deleted_at = now(), updated_at = now() \
            WHERE casualty_card_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child5 AS (UPDATE casualty_card_presenting_complaints SET \
            deleted_at = now(), updated_at = now() WHERE casualty_card_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child6 AS (UPDATE \
            casualty_card_pain_assessments SET deleted_at = now(), updated_at = now() \
            WHERE casualty_card_id IN (SELECT id FROM target) AND deleted_at IS NULL \
            RETURNING id), child7 AS (UPDATE casualty_card_medical_histories SET \
            deleted_at = now(), updated_at = now() WHERE casualty_card_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child8 AS (UPDATE \
            casualty_card_medications SET deleted_at = now(), updated_at = now() WHERE \
            casualty_card_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child9 AS (UPDATE casualty_card_allergies SET deleted_at = now(), \
            updated_at = now() WHERE casualty_card_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child10 AS (UPDATE \
            casualty_card_vital_signs SET deleted_at = now(), updated_at = now() WHERE \
            casualty_card_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child11 AS (UPDATE casualty_card_primary_surveys SET deleted_at = \
            now(), updated_at = now() WHERE casualty_card_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child12 AS (UPDATE \
            casualty_card_clinical_examinations SET deleted_at = now(), updated_at = \
            now() WHERE casualty_card_id IN (SELECT id FROM target) AND deleted_at IS \
            NULL RETURNING id), child13 AS (UPDATE casualty_card_investigations SET \
            deleted_at = now(), updated_at = now() WHERE casualty_card_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child14 AS (UPDATE \
            casualty_card_treatments SET deleted_at = now(), updated_at = now() WHERE \
            casualty_card_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child15 AS (UPDATE casualty_card_assessment_plans SET deleted_at = \
            now(), updated_at = now() WHERE casualty_card_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child16 AS (UPDATE \
            casualty_card_dispositions SET deleted_at = now(), updated_at = now() WHERE \
            casualty_card_id IN (SELECT id FROM target) AND deleted_at IS NULL RETURNING \
            id), child17 AS (UPDATE casualty_card_safeguarding_consents SET deleted_at = \
            now(), updated_at = now() WHERE casualty_card_id IN (SELECT id FROM target) \
            AND deleted_at IS NULL RETURNING id), child18 AS (UPDATE news2_results SET \
            deleted_at = now(), updated_at = now() WHERE casualty_card_id IN (SELECT id \
            FROM target) AND deleted_at IS NULL RETURNING id), child19 AS (UPDATE \
            flagged_issues SET deleted_at = now(), updated_at = now() WHERE \
            news2_result_id IN (SELECT id FROM child18) AND deleted_at IS NULL RETURNING \
            id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
