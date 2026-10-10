use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "bowel_cancer_screening_fit_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("result_class", ColType::StringWithDefault(String::new())),
                (
                    "management_action",
                    ColType::StringWithDefault(String::new()),
                ),
                ("symptomatic_pathway", ColType::BooleanWithDefault(false)),
                ("status", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("bowel_cancer_screening_fit_id", ColType::Uuid),
            ],
            &[(
                "bowel_cancer_screening_fit",
                "bowel_cancer_screening_fit_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE bowel_cancer_screening_fit_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bowel_cancer_screening_fit_grades").await
    }
}
