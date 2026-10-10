use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                (
                    "eligibility_status",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "absolute_contraindication_count",
                    ColType::IntegerWithDefault(0),
                ),
                (
                    "relative_contraindication_count",
                    ColType::IntegerWithDefault(0),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("assessment_id", ColType::Uuid),
            ],
            &[("assessment", "assessment_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared("ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid()")
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "grades").await
    }
}
