use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "assessment_cancer_history_items",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "relative_relationship",
                    ColType::StringWithDefault(String::new()),
                ),
                ("cancer_type", ColType::StringWithDefault(String::new())),
                ("age_at_diagnosis", ColType::IntegerNull),
                ("outcome", ColType::StringWithDefault(String::new())),
                ("sort_order", ColType::IntegerWithDefault(0)),
                ("assessment_cancer_history_id", ColType::Uuid),
            ],
            &[("assessment_cancer_history", "assessment_cancer_history_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE assessment_cancer_history_items ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessment_cancer_history_items").await
    }
}
