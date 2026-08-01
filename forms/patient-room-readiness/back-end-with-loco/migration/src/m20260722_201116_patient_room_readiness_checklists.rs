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
            ("building_name_or_number", ColType::StringWithDefault(String::new())),
            ("room_name_or_number", ColType::StringWithDefault(String::new())),
            ("patient_cot_mattress_side_railings", ColType::BooleanWithDefault(false)),
            ("attendant_cot_mattress", ColType::BooleanWithDefault(false)),
            ("call_bell", ColType::BooleanWithDefault(false)),
            ("cardiac_table_iv_stand", ColType::BooleanWithDefault(false)),
            ("hot_kettle_glasses", ColType::BooleanWithDefault(false)),
            ("linen_patient_dress", ColType::BooleanWithDefault(false)),
            ("landline_numbers", ColType::BooleanWithDefault(false)),
            ("refrigerator_fan", ColType::BooleanWithDefault(false)),
            ("television_remote", ColType::BooleanWithDefault(false)),
            ("dustbin", ColType::BooleanWithDefault(false)),
            ("bath_towel_handtowels", ColType::BooleanWithDefault(false)),
            ("wc_dustbins", ColType::BooleanWithDefault(false)),
            ("washbasin_and_fittings", ColType::BooleanWithDefault(false)),
            ("bucket_and_mug", ColType::BooleanWithDefault(false)),
            ("geyser", ColType::BooleanWithDefault(false)),
            ("soap_dispenser", ColType::BooleanWithDefault(false)),
            ("toilet_kit", ColType::BooleanWithDefault(false)),
            ("window_glass_grooves", ColType::BooleanWithDefault(false)),
            ("sidewalls", ColType::BooleanWithDefault(false)),
            ("curtain_blind", ColType::BooleanWithDefault(false)),
            ("chair_sofa", ColType::BooleanWithDefault(false)),
            ("wall_seepage_water_leakage", ColType::BooleanWithDefault(false)),
            ("electricity_points_lights", ColType::BooleanWithDefault(false)),
            ("ceiling_tiles", ColType::BooleanWithDefault(false)),
            ("door_knobs_stopper", ColType::BooleanWithDefault(false)),
            ("inspector_name", ColType::StringWithDefault(String::new())),
            ("inspector_email", ColType::StringWithDefault(String::new())),
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
