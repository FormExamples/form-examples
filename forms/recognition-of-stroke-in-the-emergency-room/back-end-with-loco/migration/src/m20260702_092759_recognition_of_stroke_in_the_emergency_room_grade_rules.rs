use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "recognition_of_stroke_in_the_emergency_room_grade_rules",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("rule_id", ColType::String),
            ("criterion", ColType::String),
            ("points", ColType::IntegerNull),
            ("category", ColType::String),
            ("description", ColType::String),
            ],
            &[
            ("recognition_of_stroke_in_the_emergency_room_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "recognition_of_stroke_in_the_emergency_room_grade_rules").await
    }
}
