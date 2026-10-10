use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "edinburgh_postnatal_depression_scale_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("total_score", ColType::IntegerNull),
                ("interpretation", ColType::StringWithDefault(String::new())),
                ("item_10_score", ColType::IntegerNull),
                ("self_harm_flag", ColType::StringWithDefault(String::new())),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("edinburgh_postnatal_depression_scale_id", ColType::Uuid),
            ],
            &[(
                "edinburgh_postnatal_depression_scale",
                "edinburgh_postnatal_depression_scale_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE edinburgh_postnatal_depression_scale_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "edinburgh_postnatal_depression_scale_grades").await
    }
}
