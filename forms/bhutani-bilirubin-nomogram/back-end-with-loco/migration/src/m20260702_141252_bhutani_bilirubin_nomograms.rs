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
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("infant_identifier", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("born_at", ColType::TimestampWithTimeZoneNull),
            ("gestational_age_weeks", ColType::DoubleNull),
            ("age_hours", ColType::DoubleNull),
            ("total_serum_bilirubin_umol_l", ColType::DoubleNull),
            ("measurement_method", ColType::StringWithDefault(String::new())),
            ("preterm_under_38", ColType::StringWithDefault(String::new())),
            ("previous_sibling_jaundice", ColType::StringWithDefault(String::new())),
            ("exclusive_breastfeeding", ColType::StringWithDefault(String::new())),
            ("bruising", ColType::StringWithDefault(String::new())),
            ("blood_group_incompatibility", ColType::StringWithDefault(String::new())),
            ("early_onset_under_24h", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
