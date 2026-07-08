use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ottawa_ankle_rules_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),

            ("unable_to_bear_weight", ColType::String),
            ("ankle_xray_indicated", ColType::String),
            ("foot_xray_indicated", ColType::String),
            ("recommended_action", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("ottawa_ankle_rules", "ottawa_ankle_rules_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ottawa_ankle_rules_grades").await
    }
}
