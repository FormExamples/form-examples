use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "centor_score_for_streptococcal_pharyngitis_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("centor_score", ColType::IntegerNull),
            ("age_modifier", ColType::IntegerNull),
            ("mcisaac_score", ColType::IntegerNull),
            ("risk_band", ColType::String),
            ("management", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("centor_score_for_streptococcal_pharyngitis", "centor_score_for_streptococcal_pharyngitis_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "centor_score_for_streptococcal_pharyngitis_grades").await
    }
}
