use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "child_pugh_score_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("bilirubin_points", ColType::IntegerNull),
            ("albumin_points", ColType::IntegerNull),
            ("coagulation_points", ColType::IntegerNull),
            ("ascites_points", ColType::IntegerNull),
            ("encephalopathy_points", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("child_pugh_class", ColType::String),
            ("one_year_survival", ColType::String),
            ("two_year_survival", ColType::String),
            ("surgical_risk", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("child_pugh_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "child_pugh_score_grades").await
    }
}
