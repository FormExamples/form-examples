use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

use crate::engine::fp92a_rules::ELIGIBLE_CONDITION_CODES;
use crate::engine::types::{ApplicationData, GradeResult, QualifyingCondition};

/// Total wizard steps (Practitioner, Patient, Existing exemption, Age check,
/// Pregnancy check, Conditions, Condition detail, Attestation, Declaration,
/// Notes / sign-off).
pub const TOTAL_STEPS: u32 = 10;

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
                "permanent-fistula" => {
                    "Permanent fistula (continuous surgical dressing / appliance)"
                }
                "hypoadrenalism" => {
                    "Hypoadrenalism (e.g. Addison's disease) on substitution therapy"
                }
                "diabetes-insipidus-or-hypopituitarism" => {
                    "Diabetes insipidus / hypopituitarism"
                }
                "diabetes-mellitus-not-diet-only" => {
                    "Diabetes mellitus (insulin / oral hypoglycaemic)"
                }
                "hypoparathyroidism" => "Hypoparathyroidism",
                "myasthenia-gravis" => "Myasthenia gravis",
                "myxoedema" => "Myxoedema (hypothyroidism on thyroid replacement)",
                "epilepsy-on-anticonvulsant" => "Epilepsy on continuous anticonvulsant",
                "continuing-physical-disability" => {
                    "Continuing physical disability (cannot leave home unaided)"
                }
                "cancer-or-effects" => "Cancer or effects of cancer / treatment",
                _ => "",
            },
        })
        .collect()
}

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

/// Build a Tera context for rendering the single-page FP92A wizard. All
/// section partials share the same context.
pub fn build_assessment_context(data: &ApplicationData, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &TOTAL_STEPS);
    ctx.insert("data", data);
    ctx.insert("practitioner", &data.practitioner);
    ctx.insert("patient", &data.patient);
    ctx.insert("existing_exemption", &data.existing_exemption);
    ctx.insert("declaration", &data.declaration);
    ctx.insert("notes", &data.notes);
    ctx.insert("conditions_catalogue", &condition_catalogue());
    ctx.insert(
        "cond_permanent_fistula",
        &find_condition(data, "permanent-fistula"),
    );
    ctx.insert(
        "cond_hypoadrenalism",
        &find_condition(data, "hypoadrenalism"),
    );
    ctx.insert(
        "cond_diabetes_insipidus",
        &find_condition(data, "diabetes-insipidus-or-hypopituitarism"),
    );
    ctx.insert(
        "cond_diabetes_mellitus",
        &find_condition(data, "diabetes-mellitus-not-diet-only"),
    );
    ctx.insert(
        "cond_hypoparathyroidism",
        &find_condition(data, "hypoparathyroidism"),
    );
    ctx.insert(
        "cond_myasthenia_gravis",
        &find_condition(data, "myasthenia-gravis"),
    );
    ctx.insert("cond_myxoedema", &find_condition(data, "myxoedema"));
    ctx.insert(
        "cond_epilepsy",
        &find_condition(data, "epilepsy-on-anticonvulsant"),
    );
    ctx.insert(
        "cond_disability",
        &find_condition(data, "continuing-physical-disability"),
    );
    ctx.insert("cond_cancer", &find_condition(data, "cancer-or-effects"));
    ctx
}

/// Build the Tera context for the report after submission.
pub fn build_report_context(data: &ApplicationData, grade: &GradeResult, id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("data", data);
    ctx.insert("practitioner", &data.practitioner);
    ctx.insert("patient", &data.patient);
    ctx.insert("declaration", &data.declaration);
    ctx.insert("grade", grade);
    ctx.insert("outcome", &grade.outcome);
    ctx.insert("redirect_to", &grade.redirect_to);
    ctx.insert("result_category", &grade.result_category);
    ctx.insert("result_score", &grade.result_score);
    ctx.insert("result_notes", &grade.result_notes);
    ctx.insert("eligible_condition_codes", &grade.eligible_condition_codes);
    ctx.insert("fired_rules", &grade.fired_rules);
    ctx.insert("additional_flags", &grade.additional_flags);
    ctx.insert("valid_from", &grade.valid_from);
    ctx.insert("valid_until", &grade.valid_until);
    ctx.insert("validity_years", &grade.validity_years);
    ctx.insert("timestamp", &grade.timestamp);
    ctx.insert("conditions_catalogue", &condition_catalogue());
    ctx
}
