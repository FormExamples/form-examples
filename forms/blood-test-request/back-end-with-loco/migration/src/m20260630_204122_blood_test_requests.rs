use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "blood_test_requests",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("site_name", ColType::StringWithDefault(String::new())),
                ("setting", ColType::StringWithDefault(String::new())),
                ("referral_date", ColType::DateNull),
                ("full_blood_count", ColType::BooleanWithDefault(false)),
                ("urea_electrolytes", ColType::BooleanWithDefault(false)),
                ("liver_function", ColType::BooleanWithDefault(false)),
                ("thyroid_function", ColType::BooleanWithDefault(false)),
                ("hba1c", ColType::BooleanWithDefault(false)),
                ("lipid_profile", ColType::BooleanWithDefault(false)),
                ("c_reactive_protein", ColType::BooleanWithDefault(false)),
                ("coagulation_screen", ColType::BooleanWithDefault(false)),
                ("bone_profile", ColType::BooleanWithDefault(false)),
                ("ferritin_iron", ColType::BooleanWithDefault(false)),
                ("vitamin_b12_folate", ColType::BooleanWithDefault(false)),
                ("vitamin_d", ColType::BooleanWithDefault(false)),
                ("hba1c_monitoring", ColType::BooleanWithDefault(false)),
                ("glucose", ColType::BooleanWithDefault(false)),
                ("inr", ColType::BooleanWithDefault(false)),
                ("blood_culture", ColType::BooleanWithDefault(false)),
                ("group_and_save", ColType::BooleanWithDefault(false)),
                ("crossmatch", ColType::BooleanWithDefault(false)),
                ("troponin", ColType::BooleanWithDefault(false)),
                ("d_dimer", ColType::BooleanWithDefault(false)),
                ("amylase_lipase", ColType::BooleanWithDefault(false)),
                (
                    "primary_indication",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "clinical_details",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "relevant_medications",
                    ColType::StringWithDefault(String::new()),
                ),
                ("fasting_required", ColType::BooleanWithDefault(false)),
                ("fasting_status", ColType::StringWithDefault(String::new())),
                (
                    "specimen_collected",
                    ColType::StringWithDefault(String::new()),
                ),
                ("collection_datetime", ColType::TimestampWithTimeZoneNull),
                (
                    "known_blood_borne_virus",
                    ColType::BooleanWithDefault(false),
                ),
                (
                    "difficult_venous_access",
                    ColType::BooleanWithDefault(false),
                ),
                ("urgency", ColType::StringWithDefault("routine".to_string())),
                (
                    "supervising_consultant",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "requester_contact",
                    ColType::StringWithDefault(String::new()),
                ),
                ("notes", ColType::StringWithDefault(String::new())),
                ("patient_id", ColType::Uuid),
                ("clinician_id", ColType::Uuid),
            ],
            &[("patient", "patient_id"), ("clinician", "clinician_id")],
        )
        .await?;
        m.get_connection()
            .execute_unprepared(
                "ALTER TABLE blood_test_requests ALTER COLUMN id SET DEFAULT gen_random_uuid()",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "blood_test_requests").await
    }
}
