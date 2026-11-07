//! patient_room_readiness_checklists model.

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
    pub building_name_or_number: String,
    pub room_name_or_number: String,
    pub patient_cot_mattress_side_railings: bool,
    pub attendant_cot_mattress: bool,
    pub call_bell: bool,
    pub cardiac_table_iv_stand: bool,
    pub hot_kettle_glasses: bool,
    pub linen_patient_dress: bool,
    pub landline_numbers: bool,
    pub refrigerator_fan: bool,
    pub television_remote: bool,
    pub dustbin: bool,
    pub bath_towel_handtowels: bool,
    pub wc_dustbins: bool,
    pub washbasin_and_fittings: bool,
    pub bucket_and_mug: bool,
    pub geyser: bool,
    pub soap_dispenser: bool,
    pub toilet_kit: bool,
    pub window_glass_grooves: bool,
    pub sidewalls: bool,
    pub curtain_blind: bool,
    pub chair_sofa: bool,
    pub wall_seepage_water_leakage: bool,
    pub electricity_points_lights: bool,
    pub ceiling_tiles: bool,
    pub door_knobs_stopper: bool,
    pub inspector_name: String,
    pub inspector_email: String,
    pub inspection_date: Option<Date>,
    pub inspection_time: Option<String>,
}

impl Model {
    /// One page of rows in a stable order, and how many rows there are in all.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: axa::pagination::Page) -> sqlx::Result<(Vec<Self>, i64)> {
        let (limit, offset) = page.bounds();
        let rows = sqlx::query_as(
            "SELECT * FROM patient_room_readiness_checklists WHERE deleted_at IS NULL \
            ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await?;
        let total = sqlx::query_scalar(
            "SELECT COUNT(*) FROM patient_room_readiness_checklists WHERE deleted_at IS \
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
            "SELECT * FROM patient_room_readiness_checklists WHERE id = $1 AND deleted_at \
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
            "UPDATE patient_room_readiness_checklists SET deleted_at = now(), updated_at \
            = now() WHERE id = $1 AND deleted_at IS NULL",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
