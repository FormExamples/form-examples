use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "agile_principles_assessments",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("is_anonymous", ColType::Boolean),
            ("assessment_date", ColType::DateNull),
            ("assessment_period", ColType::String),
            ("p01_customer_satisfaction", ColType::IntegerNull),
            ("p01_comment", ColType::Text),
            ("p01_weight", ColType::Double),
            ("p02_welcome_change", ColType::IntegerNull),
            ("p02_comment", ColType::Text),
            ("p02_weight", ColType::Double),
            ("p03_deliver_frequently", ColType::IntegerNull),
            ("p03_comment", ColType::Text),
            ("p03_weight", ColType::Double),
            ("p04_collaboration", ColType::IntegerNull),
            ("p04_comment", ColType::Text),
            ("p04_weight", ColType::Double),
            ("p05_motivated_individuals", ColType::IntegerNull),
            ("p05_comment", ColType::Text),
            ("p05_weight", ColType::Double),
            ("p06_face_to_face", ColType::IntegerNull),
            ("p06_comment", ColType::Text),
            ("p06_weight", ColType::Double),
            ("p07_working_software", ColType::IntegerNull),
            ("p07_comment", ColType::Text),
            ("p07_weight", ColType::Double),
            ("p08_sustainable_development", ColType::IntegerNull),
            ("p08_comment", ColType::Text),
            ("p08_weight", ColType::Double),
            ("p09_technical_excellence", ColType::IntegerNull),
            ("p09_comment", ColType::Text),
            ("p09_weight", ColType::Double),
            ("p10_simplicity", ColType::IntegerNull),
            ("p10_comment", ColType::Text),
            ("p10_weight", ColType::Double),
            ("p11_self_organising_teams", ColType::IntegerNull),
            ("p11_comment", ColType::Text),
            ("p11_weight", ColType::Double),
            ("p12_regular_reflection", ColType::IntegerNull),
            ("p12_comment", ColType::Text),
            ("p12_weight", ColType::Double),
            ("overall_notes", ColType::Text),
            ],
            &[
            ("respondent", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_principles_assessments").await
    }
}
