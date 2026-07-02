use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "bhutani_bilirubin_nomograms",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("infant_identifier", ColType::String),
            ("sex", ColType::String),
            ("born_at", ColType::TimestampWithTimeZoneNull),
            ("gestational_age_weeks", ColType::DoubleNull),
            ("age_hours", ColType::DoubleNull),
            ("total_serum_bilirubin_umol_l", ColType::DoubleNull),
            ("measurement_method", ColType::String),
            ("preterm_under_38", ColType::String),
            ("previous_sibling_jaundice", ColType::String),
            ("exclusive_breastfeeding", ColType::String),
            ("bruising", ColType::String),
            ("blood_group_incompatibility", ColType::String),
            ("early_onset_under_24h", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bhutani_bilirubin_nomograms").await
    }
}
