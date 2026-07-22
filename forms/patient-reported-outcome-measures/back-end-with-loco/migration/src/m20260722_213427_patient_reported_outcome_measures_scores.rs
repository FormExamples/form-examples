use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patient_reported_outcome_measures_scores",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("sf36_pf", ColType::DoubleNull),
            ("sf36_rp", ColType::DoubleNull),
            ("sf36_bp", ColType::DoubleNull),
            ("sf36_gh", ColType::DoubleNull),
            ("sf36_vt", ColType::DoubleNull),
            ("sf36_sf", ColType::DoubleNull),
            ("sf36_re", ColType::DoubleNull),
            ("sf36_mh", ColType::DoubleNull),
            ("sf36_pcs_approx", ColType::DoubleNull),
            ("sf36_mcs_approx", ColType::DoubleNull),
            ("ndi_raw_score", ColType::IntegerNull),
            ("ndi_answered_sections", ColType::IntegerNull),
            ("ndi_percentage_score", ColType::DoubleNull),
            ("ndi_band", ColType::String),
            ("mjoa_total_score", ColType::IntegerNull),
            ("mjoa_band", ColType::String),
            ("eq5d_health_state_descriptor", ColType::String),
            ("eq5d_uk_index_value", ColType::DoubleNull),
            ("eq5d_vas_score", ColType::DoubleNull),
            ],
            &[
            // Explicit column name override: the default `references()`
            // helper singularizes the from-table name (dropping the
            // trailing "s" of "measures"), which would produce
            // `patient_reported_outcome_measure_id` and no longer match
            // the hand-written SQL schema's
            // `patient_reported_outcome_measures_id` column. Pin the
            // exact name here instead.
            ("patient_reported_outcome_measures", "patient_reported_outcome_measures_id"),
            ]
        ).await?;

        // The parent/child relationship is 1:1 (enforced in the
        // hand-written SQL via `UNIQUE REFERENCES`), not 1:many, so add a
        // unique index on the FK column to enforce it here too.
        m.create_index(
            Index::create()
                .name("idx-patient_reported_outcome_measures_scores-patient_reported_outcome_measures_id")
                .table(Alias::new("patient_reported_outcome_measures_scores"))
                .col(Alias::new("patient_reported_outcome_measures_id"))
                .unique()
                .to_owned(),
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patient_reported_outcome_measures_scores").await
    }
}
