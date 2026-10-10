use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "lpa_lst_choices",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("lst_choice", ColType::StringWithDefault(String::new())),
                (
                    "donor_initialled",
                    ColType::StringWithDefault(String::new()),
                ),
                ("initialled_at", ColType::TimestampWithTimeZoneNull),
                ("lpa_id", ColType::Uuid),
            ],
            &[("lpa", "lpa_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE lpa_lst_choices ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpa_lst_choices").await
    }
}
