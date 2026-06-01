use super::types::AssessmentData;

/// A declarative endometriosis grading rule. Grade 1 = minimal,
/// 2 = mild, 3 = moderate/significant, 4 = severe/critical.
pub struct EndoRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub grade: i32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All endometriosis grading rules — verbatim port of `endo-rules.js`.
pub fn all_rules() -> Vec<EndoRule> {
    vec![
        // ─── MENSTRUAL HISTORY ──────────────────────────────────────
        EndoRule {
            id: "MH-001",
            category: "Menstrual",
            description: "Severe dysmenorrhoea",
            grade: 3,
            evaluate: |d| d.menstrual_history.dysmenorrhoea_severity == "severe",
        },
        EndoRule {
            id: "MH-002",
            category: "Menstrual",
            description: "Moderate dysmenorrhoea",
            grade: 2,
            evaluate: |d| d.menstrual_history.dysmenorrhoea_severity == "moderate",
        },
        EndoRule {
            id: "MH-003",
            category: "Menstrual",
            description: "Very heavy menstrual flow",
            grade: 2,
            evaluate: |d| d.menstrual_history.flow_heaviness == "very-heavy",
        },
        EndoRule {
            id: "MH-004",
            category: "Menstrual",
            description: "Significant days off work per cycle (>=3)",
            grade: 3,
            evaluate: |d| {
                d.menstrual_history
                    .days_off_work_per_cycle
                    .map(|n| n >= 3)
                    .unwrap_or(false)
            },
        },
        EndoRule {
            id: "MH-005",
            category: "Menstrual",
            description: "Irregular or absent menstrual cycles",
            grade: 1,
            evaluate: |d| {
                d.menstrual_history.cycle_regularity == "irregular"
                    || d.menstrual_history.cycle_regularity == "absent"
            },
        },
        // ─── PAIN ASSESSMENT ────────────────────────────────────────
        EndoRule {
            id: "PAIN-001",
            category: "Pain",
            description: "Severe pelvic pain (VAS 8-10)",
            grade: 4,
            evaluate: |d| {
                d.pain_assessment.has_pelvic_pain == "yes"
                    && d.pain_assessment
                        .pelvic_pain_severity
                        .map(|n| n >= 8)
                        .unwrap_or(false)
            },
        },
        EndoRule {
            id: "PAIN-002",
            category: "Pain",
            description: "Moderate pelvic pain (VAS 5-7)",
            grade: 2,
            evaluate: |d| {
                d.pain_assessment.has_pelvic_pain == "yes"
                    && d.pain_assessment
                        .pelvic_pain_severity
                        .map(|n| (5..8).contains(&n))
                        .unwrap_or(false)
            },
        },
        EndoRule {
            id: "PAIN-003",
            category: "Pain",
            description: "Constant pelvic pain",
            grade: 3,
            evaluate: |d| {
                d.pain_assessment.has_pelvic_pain == "yes"
                    && d.pain_assessment.pelvic_pain_timing == "constant"
            },
        },
        EndoRule {
            id: "PAIN-004",
            category: "Pain",
            description: "Deep dyspareunia",
            grade: 3,
            evaluate: |d| {
                d.pain_assessment.dyspareunia == "deep"
                    || d.pain_assessment.dyspareunia == "both"
            },
        },
        EndoRule {
            id: "PAIN-005",
            category: "Pain",
            description: "Dyschezia (painful defecation)",
            grade: 2,
            evaluate: |d| d.pain_assessment.dyschezia == "yes",
        },
        EndoRule {
            id: "PAIN-006",
            category: "Pain",
            description: "Cyclical dyschezia suggesting bowel endometriosis",
            grade: 3,
            evaluate: |d| {
                d.pain_assessment.dyschezia == "yes"
                    && d.pain_assessment.dyschezia_cyclical == "yes"
            },
        },
        // ─── GI SYMPTOMS ────────────────────────────────────────────
        EndoRule {
            id: "GI-001",
            category: "Gastrointestinal",
            description: "Bowel obstruction symptoms",
            grade: 4,
            evaluate: |d| d.gastrointestinal_symptoms.bowel_obstruction_symptoms == "yes",
        },
        EndoRule {
            id: "GI-002",
            category: "Gastrointestinal",
            description: "Cyclical rectal bleeding",
            grade: 3,
            evaluate: |d| {
                d.gastrointestinal_symptoms.rectal_bleeding == "yes"
                    && d.gastrointestinal_symptoms.rectal_bleeding_cyclical == "yes"
            },
        },
        EndoRule {
            id: "GI-003",
            category: "Gastrointestinal",
            description: "Cyclical bloating",
            grade: 1,
            evaluate: |d| {
                d.gastrointestinal_symptoms.bloating == "yes"
                    && d.gastrointestinal_symptoms.bloating_cyclical == "yes"
            },
        },
        EndoRule {
            id: "GI-004",
            category: "Gastrointestinal",
            description: "Alternating bowel habit",
            grade: 1,
            evaluate: |d| d.gastrointestinal_symptoms.alternating_bowel_habit == "yes",
        },
        // ─── URINARY SYMPTOMS ───────────────────────────────────────
        EndoRule {
            id: "UR-001",
            category: "Urinary",
            description: "Urinary obstruction symptoms",
            grade: 4,
            evaluate: |d| d.urinary_symptoms.urinary_obstruction_symptoms == "yes",
        },
        EndoRule {
            id: "UR-002",
            category: "Urinary",
            description: "Cyclical haematuria suggesting bladder endometriosis",
            grade: 3,
            evaluate: |d| {
                d.urinary_symptoms.haematuria == "yes"
                    && d.urinary_symptoms.haematuria_cyclical == "yes"
            },
        },
        EndoRule {
            id: "UR-003",
            category: "Urinary",
            description: "Dysuria",
            grade: 1,
            evaluate: |d| d.urinary_symptoms.dysuria == "yes",
        },
        // ─── FERTILITY ──────────────────────────────────────────────
        EndoRule {
            id: "FERT-001",
            category: "Fertility",
            description: "Infertility (trying >12 months)",
            grade: 3,
            evaluate: |d| {
                d.fertility_assessment.trying_to_conceive == "yes"
                    && d.fertility_assessment
                        .duration_trying_months
                        .map(|n| n > 12)
                        .unwrap_or(false)
            },
        },
        EndoRule {
            id: "FERT-002",
            category: "Fertility",
            description: "History of ectopic pregnancy",
            grade: 3,
            evaluate: |d| {
                d.fertility_assessment
                    .ectopic_pregnancies
                    .map(|n| n > 0)
                    .unwrap_or(false)
            },
        },
        EndoRule {
            id: "FERT-003",
            category: "Fertility",
            description: "Low AMH level (<5.4 pmol/L)",
            grade: 3,
            evaluate: |d| {
                d.fertility_assessment
                    .amh_level
                    .map(|n| n < 5.4)
                    .unwrap_or(false)
            },
        },
        EndoRule {
            id: "FERT-004",
            category: "Fertility",
            description: "Future fertility concerns",
            grade: 2,
            evaluate: |d| d.fertility_assessment.future_fertility_concerns == "yes",
        },
        // ─── SURGICAL HISTORY ───────────────────────────────────────
        EndoRule {
            id: "SURG-001",
            category: "Surgical",
            description: "ASRM Stage IV at surgery",
            grade: 4,
            evaluate: |d| d.surgical_history.asrm_stage_at_surgery == "IV",
        },
        EndoRule {
            id: "SURG-002",
            category: "Surgical",
            description: "ASRM Stage III at surgery",
            grade: 3,
            evaluate: |d| d.surgical_history.asrm_stage_at_surgery == "III",
        },
        EndoRule {
            id: "SURG-003",
            category: "Surgical",
            description: "Previous bowel surgery for endometriosis",
            grade: 3,
            evaluate: |d| d.surgical_history.bowel_surgery == "yes",
        },
        EndoRule {
            id: "SURG-004",
            category: "Surgical",
            description: "Previous bladder surgery for endometriosis",
            grade: 3,
            evaluate: |d| d.surgical_history.bladder_surgery == "yes",
        },
        EndoRule {
            id: "SURG-005",
            category: "Surgical",
            description: "Multiple laparoscopies (>=3)",
            grade: 2,
            evaluate: |d| {
                d.surgical_history
                    .number_of_laparoscopies
                    .map(|n| n >= 3)
                    .unwrap_or(false)
            },
        },
        EndoRule {
            id: "SURG-006",
            category: "Surgical",
            description: "Endometrioma documented",
            grade: 2,
            evaluate: |d| d.surgical_history.endometrioma_drained == "yes",
        },
        // ─── PREVIOUS TREATMENTS ────────────────────────────────────
        EndoRule {
            id: "TX-001",
            category: "Treatment",
            description: "Current opioid use",
            grade: 3,
            evaluate: |d| d.previous_treatments.opioids_current == "yes",
        },
        EndoRule {
            id: "TX-002",
            category: "Treatment",
            description: "Failed multiple hormonal treatments",
            grade: 2,
            evaluate: |d| {
                let mut failed = 0;
                if d.previous_treatments.combined_pill_tried == "yes"
                    && d.previous_treatments.combined_pill_effective == "ineffective"
                {
                    failed += 1;
                }
                if d.previous_treatments.progesterone_tried == "yes" {
                    failed += 1;
                }
                if d.previous_treatments.gnrh_agonist_tried == "yes" {
                    failed += 1;
                }
                if d.previous_treatments.mirena_ius_tried == "yes" {
                    failed += 1;
                }
                failed >= 2
            },
        },
        // ─── QUALITY OF LIFE ────────────────────────────────────────
        EndoRule {
            id: "QOL-001",
            category: "Quality of Life",
            description: "Severe quality of life impact (EHP-30 pain domain >75)",
            grade: 3,
            evaluate: |d| {
                d.quality_of_life
                    .pain_domain_score
                    .map(|n| n > 75)
                    .unwrap_or(false)
            },
        },
        EndoRule {
            id: "QOL-002",
            category: "Quality of Life",
            description: "Unable to work due to endometriosis",
            grade: 4,
            evaluate: |d| d.quality_of_life.work_impact == "unable-to-work",
        },
        EndoRule {
            id: "QOL-003",
            category: "Quality of Life",
            description: "Severe mental health impact",
            grade: 3,
            evaluate: |d| d.quality_of_life.mental_health_impact == "severe",
        },
        EndoRule {
            id: "QOL-004",
            category: "Quality of Life",
            description: "Severe sleep impact",
            grade: 2,
            evaluate: |d| d.quality_of_life.sleep_impact == "severe",
        },
    ]
}
