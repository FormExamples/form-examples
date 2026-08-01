use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "bowel_cancer_screening_fit_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("result_class", ColType::StringWithDefault(String::new())),
            ("management_action", ColType::StringWithDefault(String::new())),
            ("symptomatic_pathway", ColType::BooleanWithDefault(false)),
            ("status", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("bowel_cancer_screening_fit", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bowel_cancer_screening_fit_grades").await
    }
}
