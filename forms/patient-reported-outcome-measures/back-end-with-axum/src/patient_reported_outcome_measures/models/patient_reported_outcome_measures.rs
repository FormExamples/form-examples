//! Patient reported outcome measures module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, sqlx::FromRow)]
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
    /// Subject ID.
    pub subject_id: String,
    /// Visit.
    pub visit: String,
    /// Assessment date.
    pub assessment_date: Option<Date>,
    /// General health.
    pub general_health: Option<i32>,
    /// Health change vs year ago.
    pub health_change_vs_year_ago: Option<i32>,
    /// Vigorous activities.
    pub vigorous_activities: Option<i32>,
    /// Moderate activities.
    pub moderate_activities: Option<i32>,
    /// Lifting carrying groceries.
    pub lifting_carrying_groceries: Option<i32>,
    /// Climbing several flights.
    pub climbing_several_flights: Option<i32>,
    /// Climbing one flight.
    pub climbing_one_flight: Option<i32>,
    /// Bending kneeling stooping.
    pub bending_kneeling_stooping: Option<i32>,
    /// Walking more than mile.
    pub walking_more_than_mile: Option<i32>,
    /// Walking several hundred yards.
    pub walking_several_hundred_yards: Option<i32>,
    /// Walking one hundred yards.
    pub walking_one_hundred_yards: Option<i32>,
    /// Bathing dressing.
    pub bathing_dressing: Option<i32>,
    /// Cut down time physical.
    pub cut_down_time_physical: Option<i32>,
    /// Accomplished less physical.
    pub accomplished_less_physical: Option<i32>,
    /// Limited in kind physical.
    pub limited_in_kind_physical: Option<i32>,
    /// Difficulty performing physical.
    pub difficulty_performing_physical: Option<i32>,
    /// Cut down time emotional.
    pub cut_down_time_emotional: Option<i32>,
    /// Accomplished less emotional.
    pub accomplished_less_emotional: Option<i32>,
    /// Less careful than usual.
    pub less_careful_than_usual: Option<i32>,
    /// Social activities interference.
    pub social_activities_interference: Option<i32>,
    /// Bodily pain.
    pub bodily_pain: Option<i32>,
    /// Pain interference with work.
    pub pain_interference_with_work: Option<i32>,
    /// Felt full of life.
    pub felt_full_of_life: Option<i32>,
    /// Very nervous.
    pub very_nervous: Option<i32>,
    /// So down in dumps.
    pub so_down_in_dumps: Option<i32>,
    /// Felt calm peaceful.
    pub felt_calm_peaceful: Option<i32>,
    /// Lot of energy.
    pub lot_of_energy: Option<i32>,
    /// Downhearted depressed.
    pub downhearted_depressed: Option<i32>,
    /// Felt worn out.
    pub felt_worn_out: Option<i32>,
    /// Been happy.
    pub been_happy: Option<i32>,
    /// Felt tired.
    pub felt_tired: Option<i32>,
    /// Social activities interference time.
    pub social_activities_interference_time: Option<i32>,
    /// Get sick easier.
    pub get_sick_easier: Option<i32>,
    /// As healthy as anybody.
    pub as_healthy_as_anybody: Option<i32>,
    /// Expect health worse.
    pub expect_health_worse: Option<i32>,
    /// Health excellent.
    pub health_excellent: Option<i32>,
    /// Ndi pain intensity.
    pub ndi_pain_intensity: Option<i32>,
    /// Ndi personal care.
    pub ndi_personal_care: Option<i32>,
    /// Ndi lifting.
    pub ndi_lifting: Option<i32>,
    /// Ndi reading.
    pub ndi_reading: Option<i32>,
    /// Ndi headache.
    pub ndi_headache: Option<i32>,
    /// Ndi concentration.
    pub ndi_concentration: Option<i32>,
    /// Ndi work.
    pub ndi_work: Option<i32>,
    /// Ndi driving.
    pub ndi_driving: Option<i32>,
    /// Ndi sleeping.
    pub ndi_sleeping: Option<i32>,
    /// Ndi recreation.
    pub ndi_recreation: Option<i32>,
    /// Mjoa motor arms.
    pub mjoa_motor_arms: Option<i32>,
    /// Mjoa motor legs.
    pub mjoa_motor_legs: Option<i32>,
    /// Mjoa sensation arms.
    pub mjoa_sensation_arms: Option<i32>,
    /// Mjoa sensation legs.
    pub mjoa_sensation_legs: Option<i32>,
    /// Mjoa sensation trunk.
    pub mjoa_sensation_trunk: Option<i32>,
    /// Mjoa bladder function.
    pub mjoa_bladder_function: Option<i32>,
    /// Eq5d mobility.
    pub eq5d_mobility: Option<i32>,
    /// Eq5d self care.
    pub eq5d_self_care: Option<i32>,
    /// Eq5d usual activities.
    pub eq5d_usual_activities: Option<i32>,
    /// Eq5d pain discomfort.
    pub eq5d_pain_discomfort: Option<i32>,
    /// Eq5d anxiety depression.
    pub eq5d_anxiety_depression: Option<i32>,
    /// Eq5d vas score.
    pub eq5d_vas_score: Option<f64>,
}
/// Patient reported outcome measures.
pub type PatientReportedOutcomeMeasures = Model;

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM patient_reported_outcome_measures WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM patient_reported_outcome_measures WHERE deleted_at IS \
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
            "SELECT * FROM patient_reported_outcome_measures WHERE id = $1 AND deleted_at \
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
            "WITH target AS (UPDATE patient_reported_outcome_measures SET deleted_at = \
            now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING \
            id), child1 AS (UPDATE patient_reported_outcome_measures_scores SET \
            deleted_at = now(), updated_at = now() WHERE \
            patient_reported_outcome_measures_id IN (SELECT id FROM target) AND \
            deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
