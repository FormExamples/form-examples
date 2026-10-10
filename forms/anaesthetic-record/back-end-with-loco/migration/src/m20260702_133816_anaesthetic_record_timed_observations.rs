use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "anaesthetic_record_timed_observations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("observed_at", ColType::TimestampWithTimeZoneNull),
                ("systolic_blood_pressure", ColType::DoubleNull),
                ("diastolic_blood_pressure", ColType::DoubleNull),
                ("heart_rate", ColType::DoubleNull),
                ("spo2", ColType::DoubleNull),
                ("end_tidal_co2", ColType::DoubleNull),
                ("temperature", ColType::DoubleNull),
                ("agent_percent", ColType::DoubleNull),
                ("fresh_gas_flow_l", ColType::DoubleNull),
                ("anaesthetic_record_id", ColType::Uuid),
            ],
            &[("anaesthetic_record", "anaesthetic_record_id")],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE anaesthetic_record_timed_observations ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "anaesthetic_record_timed_observations").await
    }
}
