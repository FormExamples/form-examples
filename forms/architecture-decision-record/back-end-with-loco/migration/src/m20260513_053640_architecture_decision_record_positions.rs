use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "architecture_decision_record_positions",
            &[
                ("id", ColType::PkUuid),
                ("ordinal", ColType::IntegerWithDefault(0)),
                ("name", ColType::String),
                ("description", ColType::TextWithDefault(String::new())),
                (
                    "model_or_diagram_url",
                    ColType::StringWithDefault(String::new()),
                ),
                ("is_chosen", ColType::BooleanWithDefault(false)),
                ("pros", ColType::TextWithDefault(String::new())),
                ("cons", ColType::TextWithDefault(String::new())),
                ("architecture_decision_record_id", ColType::Uuid),
            ],
            &[(
                "architecture_decision_record",
                "architecture_decision_record_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE architecture_decision_record_positions ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "architecture_decision_record_positions").await
    }
}
