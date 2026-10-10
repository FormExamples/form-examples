use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "qrisk3_cardiovascular_disease_risk_score_grade_rules",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("rule_id", ColType::String),
                ("component", ColType::String),
                ("contribution", ColType::DoubleNull),
                ("category", ColType::StringWithDefault(String::new())),
                ("description", ColType::StringWithDefault(String::new())),
                (
                    "qrisk3_cardiovascular_disease_risk_score_grade_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "qrisk3_cardiovascular_disease_risk_score_grade",
                "qrisk3_cardiovascular_disease_risk_score_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE qrisk3_cardiovascular_disease_risk_score_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "qrisk3_cardiovascular_disease_risk_score_grade_rules").await
    }
}
