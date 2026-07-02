use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "columbia_suicide_severity_rating_scale_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("ideation_level", ColType::IntegerNull),
            ("any_behaviour", ColType::String),
            ("recent_behaviour", ColType::String),
            ("risk_tier", ColType::String),
            ("positive_features", ColType::Text),
            ("management_recommendation", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("columbia_suicide_severity_rating_scale", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "columbia_suicide_severity_rating_scale_grades").await
    }
}
