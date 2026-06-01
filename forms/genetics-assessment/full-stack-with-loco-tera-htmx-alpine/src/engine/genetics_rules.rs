use super::types::{AssessmentData, GraderContext, RiskLevel};

/// A declarative genetics rule.
///
/// `evaluate` returns one of "low", "moderate", "high" when the rule fires,
/// or an empty string when it does not.
pub struct GeneticsRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub evaluate: fn(&AssessmentData, &GraderContext) -> RiskLevel,
}

/// All genetics rules. Rule IDs and severities mirror the JS engine verbatim.
pub fn all_rules() -> Vec<GeneticsRule> {
    vec![
        // ─── Manchester Score thresholds (BRCA1/2) ────────────────
        GeneticsRule {
            id: "GEN-MAN-001",
            category: "Manchester Score",
            description: "Manchester score >= 15 — consider BRCA1/2 testing.",
            evaluate: |_d, ctx| {
                if ctx.manchester_score >= 15 && ctx.manchester_score < 20 {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-MAN-002",
            category: "Manchester Score",
            description: "Manchester score >= 20 — moderate probability of BRCA1/2 mutation.",
            evaluate: |_d, ctx| {
                if ctx.manchester_score >= 20 && ctx.manchester_score < 30 {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-MAN-003",
            category: "Manchester Score",
            description: "Manchester score >= 30 — high probability of BRCA1/2 mutation; testing strongly indicated.",
            evaluate: |_d, ctx| {
                if ctx.manchester_score >= 30 {
                    "high".to_string()
                } else {
                    String::new()
                }
            },
        },
        // ─── Bethesda criteria (Lynch syndrome) ───────────────────
        GeneticsRule {
            id: "GEN-BET-001",
            category: "Bethesda",
            description: "At least one Revised Bethesda criterion met — MMR IHC / MSI testing indicated.",
            evaluate: |_d, ctx| {
                if ctx.bethesda_met >= 1 {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-BET-002",
            category: "Bethesda",
            description: "Two or more Revised Bethesda criteria met — strong indication for Lynch syndrome workup.",
            evaluate: |_d, ctx| {
                if ctx.bethesda_met >= 2 {
                    "high".to_string()
                } else {
                    String::new()
                }
            },
        },
        // ─── PREMM5 threshold ─────────────────────────────────────
        GeneticsRule {
            id: "GEN-PREMM5-001",
            category: "PREMM5",
            description: "PREMM5 score >= 5% — Lynch syndrome germline testing indicated.",
            evaluate: |_d, ctx| match ctx.premm5_score {
                Some(p) if p >= 5.0 => "high".to_string(),
                _ => String::new(),
            },
        },
        // ─── Tyrer-Cuzick (IBIS) lifetime risk ────────────────────
        GeneticsRule {
            id: "GEN-TC-001",
            category: "Tyrer-Cuzick",
            description: "Tyrer-Cuzick lifetime risk >= 17% — moderate-risk breast surveillance per NICE FH.",
            evaluate: |_d, ctx| {
                if ctx.tyrer_cuzick_lifetime >= 17.0 && ctx.tyrer_cuzick_lifetime < 30.0 {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-TC-002",
            category: "Tyrer-Cuzick",
            description: "Tyrer-Cuzick lifetime risk >= 30% — high-risk breast surveillance per NICE FH.",
            evaluate: |_d, ctx| {
                if ctx.tyrer_cuzick_lifetime >= 30.0 {
                    "high".to_string()
                } else {
                    String::new()
                }
            },
        },
        // ─── Family history burden ────────────────────────────────
        GeneticsRule {
            id: "GEN-FAM-001",
            category: "Family History",
            description: ">= 3 affected first-degree relatives — significant familial cancer burden.",
            evaluate: |_d, ctx| {
                if ctx.affected_first_degree >= 3 {
                    "high".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-FAM-002",
            category: "Family History",
            description: ">= 2 affected first-degree relatives — moderate familial cancer burden.",
            evaluate: |_d, ctx| {
                if ctx.affected_first_degree == 2 {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-FAM-003",
            category: "Family History",
            description: "Multiple early-onset cancers (<=50) in the family — strongly suggestive of hereditary syndrome.",
            evaluate: |_d, ctx| {
                if ctx.early_onset_under50 >= 2 {
                    "high".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-FAM-004",
            category: "Family History",
            description: "Paediatric cancer cluster — at least one paediatric (<18) cancer in close relatives.",
            evaluate: |_d, ctx| {
                if ctx.paediatric_cancers >= 1 {
                    "high".to_string()
                } else {
                    String::new()
                }
            },
        },
        // ─── Specific tumour-type signals ─────────────────────────
        GeneticsRule {
            id: "GEN-TUM-001",
            category: "Tumour Spectrum",
            description: "Male breast cancer in family — consider BRCA2 testing.",
            evaluate: |_d, ctx| {
                if ctx.has_male_breast {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-TUM-002",
            category: "Tumour Spectrum",
            description: "Ovarian cancer (any age) in family — BRCA1/2 testing indicated per NICE/NCCN.",
            evaluate: |_d, ctx| {
                if ctx.has_ovarian {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-TUM-003",
            category: "Tumour Spectrum",
            description: "Pancreatic cancer in family — consider hereditary pancreatic cancer syndromes.",
            evaluate: |_d, ctx| {
                if ctx.has_pancreatic {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-TUM-004",
            category: "Tumour Spectrum",
            description: "Bilateral breast cancer — strong indication for BRCA1/2 testing.",
            evaluate: |_d, ctx| {
                if ctx.has_bilateral_breast {
                    "high".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-TUM-005",
            category: "Proband History",
            description: "Multiple primary cancers in proband — pathogenic-variant pre-test probability elevated.",
            evaluate: |_d, ctx| {
                if ctx.has_multiple_primaries {
                    "high".to_string()
                } else {
                    String::new()
                }
            },
        },
        // ─── Ancestry-based risk modifiers ────────────────────────
        GeneticsRule {
            id: "GEN-ANC-001",
            category: "Ancestry",
            description: "Ashkenazi Jewish ancestry plus breast / ovarian / pancreatic cancer in proband or family — BRCA founder mutation testing recommended.",
            evaluate: |d, ctx| {
                if d.consanguinity_ancestry.ashkenazi_jewish != "yes" {
                    return String::new();
                }
                let proband_has_bop = d.personal_medical_history.cancers.iter().any(|c| {
                    let t = c.kind.to_lowercase();
                    t.contains("breast") || t.contains("ovar") || t.contains("pancrea")
                });
                let family_has_bop = ctx.has_ovarian || ctx.has_male_breast || ctx.has_pancreatic;
                if proband_has_bop || family_has_bop {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-ANC-002",
            category: "Ancestry",
            description: "Consanguinity reported — increased risk of recessive conditions; carrier-screening relevant.",
            evaluate: |d, _ctx| {
                if d.consanguinity_ancestry.consanguinity == "yes" {
                    "low".to_string()
                } else {
                    String::new()
                }
            },
        },
        GeneticsRule {
            id: "GEN-ANC-003",
            category: "Ancestry",
            description: "Founding-population ancestry reported — population-specific founder variants may apply.",
            evaluate: |d, _ctx| {
                if d.consanguinity_ancestry.founding_population == "yes" {
                    "low".to_string()
                } else {
                    String::new()
                }
            },
        },
        // ─── Suspected syndrome (clinician-entered) ───────────────
        GeneticsRule {
            id: "GEN-SYN-001",
            category: "Suspected Syndrome",
            description: "Referring clinician has named a suspected syndrome — formal genetics review indicated.",
            evaluate: |d, _ctx| {
                if !d.presenting_concern.suspected_syndrome.trim().is_empty() {
                    "moderate".to_string()
                } else {
                    String::new()
                }
            },
        },
        // ─── Lifestyle / general counselling ──────────────────────
        GeneticsRule {
            id: "GEN-COUN-001",
            category: "General Counselling",
            description: "Patient has reproductive concerns — preconception / prenatal genetic counselling relevant.",
            evaluate: |d, _ctx| {
                if d.patient_understanding_concerns.reproductive_implications == "yes" {
                    "low".to_string()
                } else {
                    String::new()
                }
            },
        },
    ]
}
