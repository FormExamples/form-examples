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
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("presentation_type", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::String),
            ("heart_rate", ColType::IntegerNull),
            ("systolic_blood_pressure", ColType::IntegerNull),
            ("serum_creatinine", ColType::DoubleNull),
            ("serum_creatinine_unit", ColType::String),
            ("killip_class", ColType::String),
            ("cardiac_arrest_at_admission", ColType::String),
            ("st_segment_deviation", ColType::String),
            ("elevated_cardiac_enzymes", ColType::String),
            ("clinical_note", ColType::Text),
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
