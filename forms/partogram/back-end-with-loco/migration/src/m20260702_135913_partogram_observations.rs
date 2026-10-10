use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "partogram_observations",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("observed_at", ColType::TimestampWithTimeZoneNull),
                ("cervical_dilatation_cm", ColType::DoubleNull),
                ("descent_fifths", ColType::DoubleNull),
                ("contractions_per_10_min", ColType::DoubleNull),
                (
                    "contraction_duration_band",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "contraction_strength",
                    ColType::StringWithDefault(String::new()),
                ),
                ("fetal_heart_rate", ColType::IntegerNull),
                ("liquor_state", ColType::StringWithDefault(String::new())),
                ("moulding", ColType::StringWithDefault(String::new())),
                ("systolic_blood_pressure", ColType::IntegerNull),
                ("diastolic_blood_pressure", ColType::IntegerNull),
                ("pulse", ColType::IntegerNull),
                ("temperature", ColType::DoubleNull),
                ("urine_volume_ml", ColType::DoubleNull),
                ("urine_protein", ColType::StringWithDefault(String::new())),
                ("urine_ketones", ColType::StringWithDefault(String::new())),
                ("urine_glucose", ColType::StringWithDefault(String::new())),
                ("oxytocin_rate", ColType::DoubleNull),
                ("drugs_and_fluids", ColType::TextWithDefault(String::new())),
                ("partogram_id", ColType::Uuid),
            ],
            &[("partogram", "partogram_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE partogram_observations ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "partogram_observations").await
    }
}
