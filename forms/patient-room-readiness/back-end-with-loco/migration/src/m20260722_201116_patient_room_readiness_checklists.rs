use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patient_room_readiness_checklists",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("building_name_or_number", ColType::String),
            ("room_name_or_number", ColType::String),
            ("patient_cot_mattress_side_railings", ColType::Boolean),
            ("attendant_cot_mattress", ColType::Boolean),
            ("call_bell", ColType::Boolean),
            ("cardiac_table_iv_stand", ColType::Boolean),
            ("hot_kettle_glasses", ColType::Boolean),
            ("linen_patient_dress", ColType::Boolean),
            ("landline_numbers", ColType::Boolean),
            ("refrigerator_fan", ColType::Boolean),
            ("television_remote", ColType::Boolean),
            ("dustbin", ColType::Boolean),
            ("bath_towel_handtowels", ColType::Boolean),
            ("wc_dustbins", ColType::Boolean),
            ("washbasin_and_fittings", ColType::Boolean),
            ("bucket_and_mug", ColType::Boolean),
            ("geyser", ColType::Boolean),
            ("soap_dispenser", ColType::Boolean),
            ("toilet_kit", ColType::Boolean),
            ("window_glass_grooves", ColType::Boolean),
            ("sidewalls", ColType::Boolean),
            ("curtain_blind", ColType::Boolean),
            ("chair_sofa", ColType::Boolean),
            ("wall_seepage_water_leakage", ColType::Boolean),
            ("electricity_points_lights", ColType::Boolean),
            ("ceiling_tiles", ColType::Boolean),
            ("door_knobs_stopper", ColType::Boolean),
            ("inspector_name", ColType::String),
            ("inspector_email", ColType::String),
            ("inspection_date", ColType::DateNull),
            ("inspection_time", ColType::StringNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patient_room_readiness_checklists").await
    }
}
