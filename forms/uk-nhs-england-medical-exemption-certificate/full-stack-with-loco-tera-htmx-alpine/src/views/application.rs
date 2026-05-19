//! Tera context builders for the UK NHS England FP92A application.

use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

use crate::engine::fp92a_rules::ELIGIBLE_CONDITION_CODES;
use crate::engine::fp92a_validator::validate_fp92a;
use crate::engine::types::{ApplicationData, GradeResult, QualifyingCondition};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReportResult {
    pub grade: GradeResult,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConditionLabel {
    pub code: &'static str,
    pub label: &'static str,
}

pub fn condition_catalogue() -> Vec<ConditionLabel> {
    ELIGIBLE_CONDITION_CODES
        .iter()
        .map(|c| ConditionLabel {
            code: c,
            label: match *c {
                "permanent-fistula" => "Permanent fistula (continuous surgical dressing / appliance)",
                "hypoadrenalism" => "Hypoadrenalism (e.g. Addison's disease) on substitution therapy",
                "diabetes-insipidus-or-hypopituitarism" => "Diabetes insipidus / hypopituitarism",
                "diabetes-mellitus-not-diet-only" => "Diabetes mellitus (insulin / oral hypoglycaemic)",
                "hypoparathyroidism" => "Hypoparathyroidism",
                "myasthenia-gravis" => "Myasthenia gravis",
                "myxoedema" => "Myxoedema (hypothyroidism on thyroid replacement)",
                "epilepsy-on-anticonvulsant" => "Epilepsy on continuous anticonvulsant",
                "continuing-physical-disability" => "Continuing physical disability (cannot leave home unaided)",
                "cancer-or-effects" => "Cancer or effects of cancer / treatment",
                _ => "",
            },
        })
        .collect()
}

/// Helper: look up a condition by code, returning a default if not yet captured.
fn find_condition(data: &ApplicationData, code: &str) -> QualifyingCondition {
    data.conditions
        .iter()
        .find(|c| c.code == code)
        .cloned()
        .unwrap_or_else(|| QualifyingCondition {
            code: code.to_string(),
            ..Default::default()
        })
}

/// Build the Tera context for the single-page wizard.
pub fn build_application_context(data: &ApplicationData, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &10usize);
    ctx.insert("data", data);
    ctx.insert("conditions_catalogue", &condition_catalogue());

    // Insert each condition under a stable, dot-accessible variable name so
    // the template can do `cond_epilepsy.continuousAnticonvulsantTherapy`
    // instead of relying on dynamic `[]` map indexing.
    ctx.insert("cond_permanent_fistula", &find_condition(data, "permanent-fistula"));
    ctx.insert("cond_hypoadrenalism", &find_condition(data, "hypoadrenalism"));
    ctx.insert(
        "cond_diabetes_insipidus",
        &find_condition(data, "diabetes-insipidus-or-hypopituitarism"),
    );
    ctx.insert(
        "cond_diabetes_mellitus",
        &find_condition(data, "diabetes-mellitus-not-diet-only"),
    );
    ctx.insert("cond_hypoparathyroidism", &find_condition(data, "hypoparathyroidism"));
    ctx.insert("cond_myasthenia_gravis", &find_condition(data, "myasthenia-gravis"));
    ctx.insert("cond_myxoedema", &find_condition(data, "myxoedema"));
    ctx.insert("cond_epilepsy", &find_condition(data, "epilepsy-on-anticonvulsant"));
    ctx.insert("cond_disability", &find_condition(data, "continuing-physical-disability"));
    ctx.insert("cond_cancer", &find_condition(data, "cancer-or-effects"));
    ctx
}

/// Build the Tera context for the report after submission.
pub fn build_report_context(data: &ApplicationData, id: Uuid) -> Context {
    let grade = validate_fp92a(data);
    let timestamp = grade.timestamp.clone();

    let result = ReportResult {
        grade,
        timestamp: timestamp.clone(),
    };

    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("data", data);
    ctx.insert("result", &result);
    ctx.insert("timestamp", &timestamp);
    ctx.insert("conditions_catalogue", &condition_catalogue());
    ctx
}
