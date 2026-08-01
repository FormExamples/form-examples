use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "audit_cs",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("administration_mode", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("item_1_frequency", ColType::IntegerNull),
            ("item_2_quantity", ColType::IntegerNull),
            ("item_3_binge_frequency", ColType::IntegerNull),
            ("context", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "audit_cs").await
    }
}
