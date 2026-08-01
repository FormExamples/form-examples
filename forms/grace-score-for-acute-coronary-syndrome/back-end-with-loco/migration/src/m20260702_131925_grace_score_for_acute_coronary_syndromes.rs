use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "grace_score_for_acute_coronary_syndromes",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("presentation_type", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("heart_rate", ColType::IntegerNull),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("serum_creatinine", ColType::DoubleNull),
            ("serum_creatinine_unit", ColType::StringWithDefault(String::new())),
            ("killip_class", ColType::StringWithDefault(String::new())),
            ("cardiac_arrest_at_admission", ColType::StringWithDefault(String::new())),
            ("st_segment_deviation", ColType::StringWithDefault(String::new())),
            ("elevated_cardiac_enzymes", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grace_score_for_acute_coronary_syndromes").await
    }
}
