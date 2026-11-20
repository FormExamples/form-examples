//! Property tax exemption applications module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
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
    /// Applicant id.
    pub applicant_id: Uuid,
    /// Assessor id.
    pub assessor_id: Option<Uuid>,
    /// Applicant name.
    pub applicant_name: String,
    /// Date of birth.
    pub date_of_birth: Option<Date>,
    /// Age on assessment date.
    pub age_on_assessment_date: Option<i32>,
    /// Mailing address.
    pub mailing_address: String,
    /// State.
    pub state: String,
    /// County.
    pub county: String,
    /// Parcel number.
    pub parcel_number: String,
    /// Property address.
    pub property_address: String,
    /// Property type.
    pub property_type: String,
    /// Ownership type.
    pub ownership_type: String,
    /// Owner on assessment date.
    pub owner_on_assessment_date: String,
    /// Occupied as primary residence.
    pub occupied_as_primary_residence: String,
    /// Occupancy start date.
    pub occupancy_start_date: Option<Date>,
    /// Other homestead claimed.
    pub other_homestead_claimed: String,
    /// Claim homestead.
    pub claim_homestead: String,
    /// Claim senior.
    pub claim_senior: String,
    /// Claim disability.
    pub claim_disability: String,
    /// Claim veteran.
    pub claim_veteran: String,
    /// Claim circuit breaker.
    pub claim_circuit_breaker: String,
    /// Veteran disability percent.
    pub veteran_disability_percent: Option<i32>,
    /// Household income dollars.
    pub household_income_dollars: Option<i32>,
    /// Income tax year.
    pub income_tax_year: Option<i32>,
    /// Assessment year.
    pub assessment_year: Option<i32>,
    /// Filing date.
    pub filing_date: Option<Date>,
    /// Application type.
    pub application_type: String,
    /// Proof of ownership.
    pub proof_of_ownership: String,
    /// Proof of residency.
    pub proof_of_residency: String,
    /// Proof of age.
    pub proof_of_age: String,
    /// Proof of income.
    pub proof_of_income: String,
    /// Proof of disability.
    pub proof_of_disability: String,
    /// Appeal requested.
    pub appeal_requested: String,
    /// Notice of value date.
    pub notice_of_value_date: Option<Date>,
    /// Appeal filed.
    pub appeal_filed: String,
    /// Penalty acknowledged.
    pub penalty_acknowledged: String,
    /// Signed by applicant.
    pub signed_by_applicant: String,
    /// Signature date.
    pub signature_date: Option<Date>,
}
/// Property tax exemption applications.
pub type PropertyTaxExemptionApplications = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as("SELECT * FROM property_tax_exemption_applications WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2")
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
        sqlx::query_as("SELECT * FROM property_tax_exemption_applications WHERE id = $1 AND \
            deleted_at IS NULL")
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
        sqlx::query("WITH target AS (UPDATE property_tax_exemption_applications SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE property_tax_exemption_application_grades SET \
            deleted_at = now(), updated_at = now() WHERE \
            property_tax_exemption_application_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id), child2 AS (UPDATE \
            property_tax_exemption_application_grade_rules SET deleted_at = now(), \
            updated_at = now() WHERE property_tax_exemption_application_grade_id IN \
            (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id), child3 AS \
            (UPDATE property_tax_exemption_application_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE property_tax_exemption_application_grade_id \
            IN (SELECT id FROM child1) AND deleted_at IS NULL RETURNING id) SELECT \
            count(*) FROM target")
            .bind(id)
            .execute(db)
            .await?;
        Ok(())
    }
}
