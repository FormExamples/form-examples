//! blood_cross_match_test_requests model.

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
    pub site_name: String,
    pub setting: String,
    pub referral_date: Option<Date>,
    pub requested_by_date: Option<Date>,
    pub request_type: String,
    pub component: String,
    pub units_required: Option<i32>,
    pub primary_indication: String,
    pub clinical_details: String,
    pub patient_blood_group: String,
    pub known_antibodies: bool,
    pub antibody_detail: String,
    pub previous_transfusion: bool,
    pub previous_transfusion_reaction: bool,
    pub pregnant: bool,
    pub sample_collected: String,
    pub collection_datetime: Option<DateTimeWithTimeZone>,
    pub two_sample_rule_met: bool,
    pub required_by_datetime: Option<DateTimeWithTimeZone>,
    pub urgency: String,
    pub supervising_consultant: String,
    pub requester_contact: String,
    pub notes: String,
    pub patient_id: Uuid,
    pub clinician_id: Uuid,
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
            "SELECT * FROM blood_cross_match_test_requests WHERE deleted_at IS NULL ORDER \
            BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM blood_cross_match_test_requests WHERE deleted_at IS \
            NULL",
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
            "SELECT * FROM blood_cross_match_test_requests WHERE id = $1 AND deleted_at \
            IS NULL",
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
            "WITH target AS (UPDATE blood_cross_match_test_requests SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE blood_cross_match_test_request_grades SET deleted_at \
            = now(), updated_at = now() WHERE blood_cross_match_test_request_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE blood_cross_match_test_request_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE blood_cross_match_test_request_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            blood_cross_match_test_request_grade_flags SET deleted_at = now(), \
            updated_at = now() WHERE blood_cross_match_test_request_grade_id IN (SELECT \
            id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM \
            target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
