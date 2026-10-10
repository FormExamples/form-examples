use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "products",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("name", ColType::Text),
                ("version", ColType::TextWithDefault(String::new())),
                ("description", ColType::TextWithDefault(String::new())),
                ("intended_purpose", ColType::TextWithDefault(String::new())),
                ("product_type", ColType::TextWithDefault(String::new())),
                (
                    "medical_device_class",
                    ColType::TextWithDefault(String::new()),
                ),
                (
                    "handles_patient_data",
                    ColType::TextWithDefault(String::new()),
                ),
                ("is_patient_facing", ColType::TextWithDefault(String::new())),
                ("supplier_id", ColType::Uuid),
            ],
            &[("supplier", "supplier_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE products ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "products").await
    }
}
