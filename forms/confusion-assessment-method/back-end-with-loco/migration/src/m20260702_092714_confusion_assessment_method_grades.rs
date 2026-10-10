use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "confusion_assessment_method_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("classification", ColType::StringWithDefault(String::new())),
                ("delirium_present", ColType::BooleanNull),
                ("feature_1_positive", ColType::BooleanNull),
                ("feature_2_positive", ColType::BooleanNull),
                ("feature_3_positive", ColType::BooleanNull),
                ("feature_4_positive", ColType::BooleanNull),
                ("positive_features", ColType::TextWithDefault(String::new())),
                ("motoric_subtype", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("confusion_assessment_method_id", ColType::Uuid),
            ],
            &[(
                "confusion_assessment_method",
                "confusion_assessment_method_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE confusion_assessment_method_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "confusion_assessment_method_grades").await
    }
}
