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
            ("status", ColType::String),
            ("assessment_date", ColType::Date),
            ("submitted_at", ColType::TimestampWithTimeZoneNull),
            ("finalized_at", ColType::TimestampWithTimeZoneNull),
            ("m1_done", ColType::BooleanNull),
            ("m1_evidence", ColType::Text),
            ("m2_done", ColType::BooleanNull),
            ("m2_evidence", ColType::Text),
            ("m3_done", ColType::BooleanNull),
            ("m3_evidence", ColType::Text),
            ("m4_done", ColType::BooleanNull),
            ("m4_evidence", ColType::Text),
            ("p1_done", ColType::BooleanNull),
            ("p1_evidence", ColType::Text),
            ("p2_done", ColType::BooleanNull),
            ("p2_evidence", ColType::Text),
            ("p3_done", ColType::BooleanNull),
            ("p3_evidence", ColType::Text),
            ("p4_done", ColType::BooleanNull),
            ("p4_evidence", ColType::Text),
            ("p5_done", ColType::BooleanNull),
            ("p5_evidence", ColType::Text),
            ("p6_done", ColType::BooleanNull),
            ("p6_evidence", ColType::Text),
            ("p7_done", ColType::BooleanNull),
            ("p7_evidence", ColType::Text),
            ("p8_done", ColType::BooleanNull),
            ("p8_evidence", ColType::Text),
            ("p9_done", ColType::BooleanNull),
            ("p9_evidence", ColType::Text),
            ("p10_done", ColType::BooleanNull),
            ("p10_evidence", ColType::Text),
            ("p11_done", ColType::BooleanNull),
            ("p11_evidence", ColType::Text),
            ("p12_done", ColType::BooleanNull),
            ("p12_evidence", ColType::Text),
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
