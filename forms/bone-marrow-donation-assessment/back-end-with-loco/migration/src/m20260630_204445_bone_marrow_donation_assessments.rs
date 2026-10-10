use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "bone_marrow_donation_assessments",
            &[
                ("id", ColType::PkUuid),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("patient_id", ColType::Uuid),
            ],
            &[("patient", "patient_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE bone_marrow_donation_assessments ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bone_marrow_donation_assessments").await
    }
}
