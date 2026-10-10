use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "perioperative_optimization_grade_domains",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("domain", ColType::String),
                ("status", ColType::StringWithDefault(String::new())),
                ("triggered", ColType::BooleanWithDefault(false)),
                ("lead_time_weeks", ColType::IntegerWithDefault(0)),
                ("weeks_shortfall", ColType::IntegerNull),
                ("rule_id", ColType::StringWithDefault(String::new())),
                ("finding", ColType::StringWithDefault(String::new())),
                ("intervention", ColType::StringWithDefault(String::new())),
                ("intervention_started", ColType::BooleanWithDefault(false)),
                ("referral_made", ColType::BooleanWithDefault(false)),
                ("target_value", ColType::StringWithDefault(String::new())),
                ("start_date", ColType::DateNull),
                ("perioperative_optimization_grade_id", ColType::Uuid),
            ],
            &[(
                "perioperative_optimization_grade",
                "perioperative_optimization_grade_id",
            )],
        )
        .await?;
        m.get_connection().execute_unprepared("ALTER TABLE perioperative_optimization_grade_domains ALTER COLUMN id SET DEFAULT gen_random_uuid()").await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "perioperative_optimization_grade_domains").await
    }
}
