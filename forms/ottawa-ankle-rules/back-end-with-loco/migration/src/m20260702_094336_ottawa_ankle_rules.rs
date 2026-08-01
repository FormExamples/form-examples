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

            ("status", ColType::StringWithDefault("draft".to_string())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("injured_side", ColType::StringWithDefault(String::new())),
            ("hours_since_injury", ColType::DoubleNull),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("assessment_reliable", ColType::StringWithDefault(String::new())),
            ("malleolar_zone_pain", ColType::StringWithDefault(String::new())),
            ("lateral_malleolus_tenderness", ColType::StringWithDefault(String::new())),
            ("medial_malleolus_tenderness", ColType::StringWithDefault(String::new())),
            ("midfoot_zone_pain", ColType::StringWithDefault(String::new())),
            ("fifth_metatarsal_base_tenderness", ColType::StringWithDefault(String::new())),
            ("navicular_tenderness", ColType::StringWithDefault(String::new())),
            ("able_to_bear_weight_immediately", ColType::StringWithDefault(String::new())),
            ("able_to_bear_weight_now", ColType::StringWithDefault(String::new())),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
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
