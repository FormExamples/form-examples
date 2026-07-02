use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ottawa_ankle_rules",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),

            ("status", ColType::String),
            ("patient_identifier", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("injured_side", ColType::String),
            ("hours_since_injury", ColType::DoubleNull),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::String),
            ("assessment_reliable", ColType::String),
            ("malleolar_zone_pain", ColType::String),
            ("lateral_malleolus_tenderness", ColType::String),
            ("medial_malleolus_tenderness", ColType::String),
            ("midfoot_zone_pain", ColType::String),
            ("fifth_metatarsal_base_tenderness", ColType::String),
            ("navicular_tenderness", ColType::String),
            ("able_to_bear_weight_immediately", ColType::String),
            ("able_to_bear_weight_now", ColType::String),
            ("clinical_notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ottawa_ankle_rules").await
    }
}
