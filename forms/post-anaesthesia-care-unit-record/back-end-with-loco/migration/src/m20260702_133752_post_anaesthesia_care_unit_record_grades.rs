use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "post_anaesthesia_care_unit_record_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("activity_score", ColType::IntegerNull),
            ("respiration_score", ColType::IntegerNull),
            ("circulation_score", ColType::IntegerNull),
            ("consciousness_score", ColType::IntegerNull),
            ("oxygen_saturation_score", ColType::IntegerNull),
            ("aldrete_total", ColType::IntegerNull),
            ("discharge_ready", ColType::StringWithDefault(String::new())),
            ("padss_total", ColType::IntegerNull),
            ("padss_street_fit", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("post_anaesthesia_care_unit_record", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "post_anaesthesia_care_unit_record_grades").await
    }
}
