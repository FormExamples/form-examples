use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "agile_consulting_scorecard_for_hiring_helps",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("assessment_date", ColType::Date),
            ("submitted_at", ColType::TimestampWithTimeZoneNull),
            ("finalized_at", ColType::TimestampWithTimeZoneNull),
            ("m1_done", ColType::BooleanNull),
            ("m1_evidence", ColType::TextWithDefault(String::new())),
            ("m2_done", ColType::BooleanNull),
            ("m2_evidence", ColType::TextWithDefault(String::new())),
            ("m3_done", ColType::BooleanNull),
            ("m3_evidence", ColType::TextWithDefault(String::new())),
            ("m4_done", ColType::BooleanNull),
            ("m4_evidence", ColType::TextWithDefault(String::new())),
            ("p1_done", ColType::BooleanNull),
            ("p1_evidence", ColType::TextWithDefault(String::new())),
            ("p2_done", ColType::BooleanNull),
            ("p2_evidence", ColType::TextWithDefault(String::new())),
            ("p3_done", ColType::BooleanNull),
            ("p3_evidence", ColType::TextWithDefault(String::new())),
            ("p4_done", ColType::BooleanNull),
            ("p4_evidence", ColType::TextWithDefault(String::new())),
            ("p5_done", ColType::BooleanNull),
            ("p5_evidence", ColType::TextWithDefault(String::new())),
            ("p6_done", ColType::BooleanNull),
            ("p6_evidence", ColType::TextWithDefault(String::new())),
            ("p7_done", ColType::BooleanNull),
            ("p7_evidence", ColType::TextWithDefault(String::new())),
            ("p8_done", ColType::BooleanNull),
            ("p8_evidence", ColType::TextWithDefault(String::new())),
            ("p9_done", ColType::BooleanNull),
            ("p9_evidence", ColType::TextWithDefault(String::new())),
            ("p10_done", ColType::BooleanNull),
            ("p10_evidence", ColType::TextWithDefault(String::new())),
            ("p11_done", ColType::BooleanNull),
            ("p11_evidence", ColType::TextWithDefault(String::new())),
            ("p12_done", ColType::BooleanNull),
            ("p12_evidence", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("organization", ""),
            ("respondent", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "agile_consulting_scorecard_for_hiring_helps").await
    }
}
