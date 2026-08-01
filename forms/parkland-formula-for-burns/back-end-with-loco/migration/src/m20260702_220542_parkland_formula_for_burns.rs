use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "parkland_formula_for_burns",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("weight_kg", ColType::DoubleNull),
            ("tbsa_percent", ColType::DoubleNull),
            ("tbsa_method", ColType::StringWithDefault(String::new())),
            ("injury_at", ColType::TimestampWithTimeZoneNull),
            ("injury_time_known", ColType::StringWithDefault(String::new())),
            ("inhalation_suspected", ColType::StringWithDefault(String::new())),
            ("circumferential_or_deep", ColType::StringWithDefault(String::new())),
            ("mechanism", ColType::StringWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "parkland_formula_for_burns").await
    }
}
