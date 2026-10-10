use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "uk_nhs_digital_technology_assessment_criteria_grades",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("outcome", ColType::StringWithDefault(String::new())),
                ("mandatory_total", ColType::IntegerWithDefault(0)),
                ("mandatory_met", ColType::IntegerWithDefault(0)),
                ("advisory_total", ColType::IntegerWithDefault(0)),
                ("advisory_met", ColType::IntegerWithDefault(0)),
                (
                    "section_a_result",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "section_b_result",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "section_c_result",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "section_d_result",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "section_e_result",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "section_f_result",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "section_g_result",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "assessor_override_reason",
                    ColType::StringWithDefault(String::new()),
                ),
                ("final_outcome", ColType::StringWithDefault(String::new())),
                ("signed_at", ColType::TimestampWithTimeZoneNull),
                ("graded_at", ColType::TimestampWithTimeZone),
                (
                    "uk_nhs_digital_technology_assessment_criteria_id",
                    ColType::Uuid,
                ),
            ],
            &[(
                "uk_nhs_digital_technology_assessment_criteria",
                "uk_nhs_digital_technology_assessment_criteria_id",
            )],
        )
        .await?;
        m.get_connection()
            .execute_unprepared("ALTER TABLE uk_nhs_digital_technology_assessment_criteria_grades ALTER COLUMN id SET DEFAULT gen_random_uuid()")
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "uk_nhs_digital_technology_assessment_criteria_grades").await
    }
}
