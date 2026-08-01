use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "newborn_blood_spot_screening_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("overall_outcome", ColType::StringWithDefault(String::new())),
            ("referral_status", ColType::StringWithDefault(String::new())),
            ("sample_adequate", ColType::BooleanNull),
            ("within_window", ColType::BooleanNull),
            ("avoidable_repeat", ColType::BooleanNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("newborn_blood_spot_screening", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "newborn_blood_spot_screening_grades").await
    }
}
