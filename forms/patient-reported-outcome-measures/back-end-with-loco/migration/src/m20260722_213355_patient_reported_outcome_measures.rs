use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patient_reported_outcome_measures",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("subject_id", ColType::String),
            ("visit", ColType::String),
            ("assessment_date", ColType::DateNull),
            ("general_health", ColType::IntegerNull),
            ("health_change_vs_year_ago", ColType::IntegerNull),
            ("vigorous_activities", ColType::IntegerNull),
            ("moderate_activities", ColType::IntegerNull),
            ("lifting_carrying_groceries", ColType::IntegerNull),
            ("climbing_several_flights", ColType::IntegerNull),
            ("climbing_one_flight", ColType::IntegerNull),
            ("bending_kneeling_stooping", ColType::IntegerNull),
            ("walking_more_than_mile", ColType::IntegerNull),
            ("walking_several_hundred_yards", ColType::IntegerNull),
            ("walking_one_hundred_yards", ColType::IntegerNull),
            ("bathing_dressing", ColType::IntegerNull),
            ("cut_down_time_physical", ColType::IntegerNull),
            ("accomplished_less_physical", ColType::IntegerNull),
            ("limited_in_kind_physical", ColType::IntegerNull),
            ("difficulty_performing_physical", ColType::IntegerNull),
            ("cut_down_time_emotional", ColType::IntegerNull),
            ("accomplished_less_emotional", ColType::IntegerNull),
            ("less_careful_than_usual", ColType::IntegerNull),
            ("social_activities_interference", ColType::IntegerNull),
            ("bodily_pain", ColType::IntegerNull),
            ("pain_interference_with_work", ColType::IntegerNull),
            ("felt_full_of_life", ColType::IntegerNull),
            ("very_nervous", ColType::IntegerNull),
            ("so_down_in_dumps", ColType::IntegerNull),
            ("felt_calm_peaceful", ColType::IntegerNull),
            ("lot_of_energy", ColType::IntegerNull),
            ("downhearted_depressed", ColType::IntegerNull),
            ("felt_worn_out", ColType::IntegerNull),
            ("been_happy", ColType::IntegerNull),
            ("felt_tired", ColType::IntegerNull),
            ("social_activities_interference_time", ColType::IntegerNull),
            ("get_sick_easier", ColType::IntegerNull),
            ("as_healthy_as_anybody", ColType::IntegerNull),
            ("expect_health_worse", ColType::IntegerNull),
            ("health_excellent", ColType::IntegerNull),
            ("ndi_pain_intensity", ColType::IntegerNull),
            ("ndi_personal_care", ColType::IntegerNull),
            ("ndi_lifting", ColType::IntegerNull),
            ("ndi_reading", ColType::IntegerNull),
            ("ndi_headache", ColType::IntegerNull),
            ("ndi_concentration", ColType::IntegerNull),
            ("ndi_work", ColType::IntegerNull),
            ("ndi_driving", ColType::IntegerNull),
            ("ndi_sleeping", ColType::IntegerNull),
            ("ndi_recreation", ColType::IntegerNull),
            ("mjoa_motor_arms", ColType::IntegerNull),
            ("mjoa_motor_legs", ColType::IntegerNull),
            ("mjoa_sensation_arms", ColType::IntegerNull),
            ("mjoa_sensation_legs", ColType::IntegerNull),
            ("mjoa_sensation_trunk", ColType::IntegerNull),
            ("mjoa_bladder_function", ColType::IntegerNull),
            ("eq5d_mobility", ColType::IntegerNull),
            ("eq5d_self_care", ColType::IntegerNull),
            ("eq5d_usual_activities", ColType::IntegerNull),
            ("eq5d_pain_discomfort", ColType::IntegerNull),
            ("eq5d_anxiety_depression", ColType::IntegerNull),
            ("eq5d_vas_score", ColType::DoubleNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patient_reported_outcome_measures").await
    }
}
