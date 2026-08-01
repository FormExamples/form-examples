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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("is_anonymous", ColType::BooleanWithDefault(false)),
            ("assessment_date", ColType::DateNull),
            ("assessment_period", ColType::StringWithDefault(String::new())),
            ("p01_customer_satisfaction", ColType::IntegerNull),
            ("p01_comment", ColType::TextWithDefault(String::new())),
            ("p01_weight", ColType::DoubleWithDefault(1.00)),
            ("p02_welcome_change", ColType::IntegerNull),
            ("p02_comment", ColType::TextWithDefault(String::new())),
            ("p02_weight", ColType::DoubleWithDefault(1.00)),
            ("p03_deliver_frequently", ColType::IntegerNull),
            ("p03_comment", ColType::TextWithDefault(String::new())),
            ("p03_weight", ColType::DoubleWithDefault(1.00)),
            ("p04_collaboration", ColType::IntegerNull),
            ("p04_comment", ColType::TextWithDefault(String::new())),
            ("p04_weight", ColType::DoubleWithDefault(1.00)),
            ("p05_motivated_individuals", ColType::IntegerNull),
            ("p05_comment", ColType::TextWithDefault(String::new())),
            ("p05_weight", ColType::DoubleWithDefault(1.00)),
            ("p06_face_to_face", ColType::IntegerNull),
            ("p06_comment", ColType::TextWithDefault(String::new())),
            ("p06_weight", ColType::DoubleWithDefault(1.00)),
            ("p07_working_software", ColType::IntegerNull),
            ("p07_comment", ColType::TextWithDefault(String::new())),
            ("p07_weight", ColType::DoubleWithDefault(1.00)),
            ("p08_sustainable_development", ColType::IntegerNull),
            ("p08_comment", ColType::TextWithDefault(String::new())),
            ("p08_weight", ColType::DoubleWithDefault(1.00)),
            ("p09_technical_excellence", ColType::IntegerNull),
            ("p09_comment", ColType::TextWithDefault(String::new())),
            ("p09_weight", ColType::DoubleWithDefault(1.00)),
            ("p10_simplicity", ColType::IntegerNull),
            ("p10_comment", ColType::TextWithDefault(String::new())),
            ("p10_weight", ColType::DoubleWithDefault(1.00)),
            ("p11_self_organising_teams", ColType::IntegerNull),
            ("p11_comment", ColType::TextWithDefault(String::new())),
            ("p11_weight", ColType::DoubleWithDefault(1.00)),
            ("p12_regular_reflection", ColType::IntegerNull),
            ("p12_comment", ColType::TextWithDefault(String::new())),
            ("p12_weight", ColType::DoubleWithDefault(1.00)),
            ("overall_notes", ColType::TextWithDefault(String::new())),
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
