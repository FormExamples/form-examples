use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "has_bled_score_for_major_bleeding_risks",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("anticoagulation_status", ColType::StringWithDefault(String::new())),
            ("cha_ds_vasc_score", ColType::IntegerNull),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("hypertension_uncontrolled", ColType::StringWithDefault(String::new())),
            ("abnormal_renal_function", ColType::StringWithDefault(String::new())),
            ("abnormal_liver_function", ColType::StringWithDefault(String::new())),
            ("stroke_history", ColType::StringWithDefault(String::new())),
            ("bleeding_history", ColType::StringWithDefault(String::new())),
            ("labile_inr", ColType::StringWithDefault(String::new())),
            ("antiplatelet_or_nsaid", ColType::StringWithDefault(String::new())),
            ("alcohol_units_per_week", ColType::DoubleNull),
            ("clinical_note", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "has_bled_score_for_major_bleeding_risks").await
    }
}
