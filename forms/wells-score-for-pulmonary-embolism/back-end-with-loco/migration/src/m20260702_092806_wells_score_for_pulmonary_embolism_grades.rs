use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "wells_score_for_pulmonary_embolism_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("wells_score", ColType::DoubleNull),
            ("two_level_band", ColType::StringWithDefault(String::new())),
            ("three_level_band", ColType::StringWithDefault(String::new())),
            ("recommended_pathway", ColType::TextWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("wells_score_for_pulmonary_embolism", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "wells_score_for_pulmonary_embolism_grades").await
    }
}
