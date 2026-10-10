use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "bhutani_bilirubin_nomogram_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("risk_zone", ColType::StringWithDefault(String::new())),
                ("percentile_band", ColType::StringWithDefault(String::new())),
                ("phototherapy_threshold_umol_l", ColType::DoubleNull),
                ("exchange_threshold_umol_l", ColType::DoubleNull),
                (
                    "above_phototherapy_threshold",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "above_exchange_threshold",
                    ColType::StringWithDefault(String::new()),
                ),
                ("graded_at", ColType::TimestampWithTimeZone),
                ("bhutani_bilirubin_nomogram_id", ColType::Uuid),
            ],
            &[(
                "bhutani_bilirubin_nomogram",
                "bhutani_bilirubin_nomogram_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE bhutani_bilirubin_nomogram_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bhutani_bilirubin_nomogram_grades").await
    }
}
