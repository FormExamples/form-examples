use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "confusion_assessment_method_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("classification", ColType::String),
            ("delirium_present", ColType::BooleanNull),
            ("feature_1_positive", ColType::BooleanNull),
            ("feature_2_positive", ColType::BooleanNull),
            ("feature_3_positive", ColType::BooleanNull),
            ("feature_4_positive", ColType::BooleanNull),
            ("positive_features", ColType::Text),
            ("motoric_subtype", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("confusion_assessment_method", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "confusion_assessment_method_grades").await
    }
}
