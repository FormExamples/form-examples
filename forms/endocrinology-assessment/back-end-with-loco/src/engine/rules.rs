use super::types::{AssessmentData, AxisStatus};
use super::utils::max_status;

/// A declarative axis-grading rule. Each rule evaluates the assessment and
/// returns a status plus contributing findings.
pub struct AxisRule {
    pub id: &'static str,
    pub axis: &'static str,
    pub description: &'static str,
    pub evaluate: fn(&AssessmentData) -> (AxisStatus, Vec<String>),
}

/// All endocrinology axis rules (ported verbatim from
/// `front-end-form-with-html/js/rules.js`).
pub fn axis_rules() -> Vec<AxisRule> {
    vec![
        AxisRule {
            id: "AXIS-THY",
            axis: "Thyroid",
            description: "Thyroid axis grading from TSH/FT4/FT3 and clinical features.",
            evaluate: thyroid,
        },
        AxisRule {
            id: "AXIS-ADR",
            axis: "Adrenal",
            description: "Adrenal axis grading from cortisol/ACTH/aldosterone and clinical features.",
            evaluate: adrenal,
        },
        AxisRule {
            id: "AXIS-GLU",
            axis: "Glucose",
            description: "Glucose metabolism grading from HbA1c, fasting glucose, and history.",
            evaluate: glucose,
        },
        AxisRule {
            id: "AXIS-REP",
            axis: "Reproductive",
            description: "Reproductive axis grading from gonadotropins, sex steroids, and history.",
            evaluate: reproductive,
        },
        AxisRule {
            id: "AXIS-PIT",
            axis: "Pituitary",
            description: "Pituitary grading from prolactin/IGF-1/GH and visual / mass effect features.",
            evaluate: pituitary,
        },
        AxisRule {
            id: "AXIS-BON",
            axis: "Bone & Calcium",
            description: "Bone and calcium grading from PTH, vitamin D, calcium, and skeletal events.",
            evaluate: bone_calcium,
        },
    ]
}

fn thyroid(d: &AssessmentData) -> (AxisStatus, Vec<String>) {
    let mut findings: Vec<String> = Vec::new();
    let mut status = String::new();
    let t = &d.thyroid_axis;

    if let Some(tsh) = t.tsh {
        if tsh > 10.0 {
            findings.push(format!("TSH {tsh} mIU/L — overt hypothyroidism range."));
            status = max_status(&status, "severe");
        } else if tsh > 4.0 {
            findings.push(format!("TSH {tsh} mIU/L — elevated."));
            status = max_status(&status, "mild");
        } else if tsh < 0.1 {
            findings.push(format!(
                "TSH {tsh} mIU/L — markedly suppressed (overt hyperthyroidism range)."
            ));
            status = max_status(&status, "severe");
        } else if tsh < 0.4 {
            findings.push(format!("TSH {tsh} mIU/L — suppressed."));
            status = max_status(&status, "mild");
        }
    }

    if let Some(ft4) = t.ft4 {
        if ft4 < 9.0 {
            findings.push(format!("FT4 {ft4} pmol/L — low."));
            status = max_status(&status, "moderate");
        } else if ft4 > 25.0 {
            findings.push(format!("FT4 {ft4} pmol/L — high."));
            status = max_status(&status, "moderate");
        }
    }

    if let Some(ft3) = t.ft3 {
        if ft3 < 3.5 {
            findings.push(format!("FT3 {ft3} pmol/L — low."));
            status = max_status(&status, "moderate");
        } else if ft3 > 6.5 {
            findings.push(format!("FT3 {ft3} pmol/L — high."));
            status = max_status(&status, "moderate");
        }
    }

    if t.antibodies_positive == "yes" {
        findings.push("Positive thyroid autoantibodies.".to_string());
        status = max_status(&status, "subclinical");
    }
    if t.goitre == "yes" {
        findings.push("Goitre present on examination.".to_string());
        status = max_status(&status, "mild");
    }

    // Promote subclinical -> mild when symptoms coexist with biochemistry.
    let sx = &d.presenting_symptoms;
    let symptomatic = sx.heat_intolerance == "yes"
        || sx.cold_intolerance == "yes"
        || sx.palpitations == "yes"
        || sx.tremor == "yes";
    if status == "subclinical" && symptomatic {
        status = "mild".to_string();
        findings.push("Coexisting thyroid-related symptoms.".to_string());
    }

    if status.is_empty() {
        status = if thyroid_any_answered(t) {
            "normal".to_string()
        } else {
            String::new()
        };
    }
    (status, findings)
}

fn adrenal(d: &AssessmentData) -> (AxisStatus, Vec<String>) {
    let mut findings: Vec<String> = Vec::new();
    let mut status = String::new();
    let a = &d.adrenal_axis;

    if let Some(c) = a.morning_cortisol {
        if c < 100.0 {
            findings.push(format!(
                "Morning cortisol {c} nmol/L — adrenal insufficiency suspected."
            ));
            status = max_status(&status, "severe");
        } else if c < 140.0 {
            findings.push(format!(
                "Morning cortisol {c} nmol/L — borderline, dynamic testing required."
            ));
            status = max_status(&status, "moderate");
        } else if c > 700.0 {
            findings.push(format!("Morning cortisol {c} nmol/L — elevated."));
            status = max_status(&status, "mild");
        }
    }
    if let Some(v) = a.acth {
        if v > 22.0 {
            findings.push(format!(
                "ACTH {v} pmol/L — elevated (suggests primary adrenal failure or ectopic)."
            ));
            status = max_status(&status, "moderate");
        } else if v < 2.0 {
            findings.push(format!("ACTH {v} pmol/L — suppressed."));
            status = max_status(&status, "mild");
        }
    }
    if a.hyperpigmentation == "yes" {
        findings.push("Hyperpigmentation on examination.".to_string());
        status = max_status(&status, "moderate");
    }
    if a.cushingoid_features == "yes" {
        findings.push("Cushingoid features on examination.".to_string());
        status = max_status(&status, "moderate");
    }
    if a.postural_hypotension == "yes" {
        findings.push("Postural hypotension.".to_string());
        status = max_status(&status, "mild");
    }

    if status.is_empty() {
        status = if adrenal_any_answered(a) {
            "normal".to_string()
        } else {
            String::new()
        };
    }
    (status, findings)
}

fn glucose(d: &AssessmentData) -> (AxisStatus, Vec<String>) {
    let mut findings: Vec<String> = Vec::new();
    let mut status = String::new();
    let g = &d.glucose_metabolism;

    if let Some(v) = g.hba1c {
        if v >= 75.0 {
            findings.push(format!(
                "HbA1c {v} mmol/mol — markedly elevated diabetes range."
            ));
            status = max_status(&status, "severe");
        } else if v >= 58.0 {
            findings.push(format!(
                "HbA1c {v} mmol/mol — sub-optimally controlled diabetes range."
            ));
            status = max_status(&status, "moderate");
        } else if v >= 48.0 {
            findings.push(format!("HbA1c {v} mmol/mol — diabetes range."));
            status = max_status(&status, "mild");
        } else if v >= 42.0 {
            findings.push(format!("HbA1c {v} mmol/mol — pre-diabetes range."));
            status = max_status(&status, "subclinical");
        }
    }

    if let Some(v) = g.fasting_glucose {
        if v >= 11.1 {
            findings.push(format!(
                "Fasting glucose {v} mmol/L — markedly elevated."
            ));
            status = max_status(&status, "severe");
        } else if v >= 7.0 {
            findings.push(format!("Fasting glucose {v} mmol/L — diabetes range."));
            status = max_status(&status, "moderate");
        } else if v >= 5.6 {
            findings.push(format!(
                "Fasting glucose {v} mmol/L — impaired fasting glucose."
            ));
            status = max_status(&status, "subclinical");
        }
    }

    if let Some(v) = g.random_glucose {
        if v >= 11.1 {
            findings.push(format!("Random glucose {v} mmol/L — diabetes range."));
            status = max_status(&status, "moderate");
        }
    }

    if g.hypoglycaemia_episodes == "yes" {
        findings.push("History of hypoglycaemic episodes.".to_string());
        status = max_status(&status, "mild");
    }

    if g.known_diabetes == "yes" && status.is_empty() {
        findings.push("Known diabetes — ongoing review required.".to_string());
        status = "mild".to_string();
    }

    if status.is_empty() {
        status = if glucose_any_answered(g) {
            "normal".to_string()
        } else {
            String::new()
        };
    }
    (status, findings)
}

fn reproductive(d: &AssessmentData) -> (AxisStatus, Vec<String>) {
    let mut findings: Vec<String> = Vec::new();
    let mut status = String::new();
    let r = &d.reproductive_axis;

    if r.menstrual_irregularity == "yes" {
        findings.push("Menstrual irregularity reported.".to_string());
        status = max_status(&status, "mild");
    }
    if r.infertility == "yes" {
        findings.push("Infertility concern.".to_string());
        status = max_status(&status, "moderate");
    }
    if r.libido_change == "yes" {
        findings.push("Libido change reported.".to_string());
        status = max_status(&status, "mild");
    }
    if r.galactorrhoea == "yes" {
        findings.push("Galactorrhoea reported.".to_string());
        status = max_status(&status, "moderate");
    }
    if let Some(v) = r.fsh {
        if v > 25.0 {
            findings.push(format!(
                "FSH {v} IU/L — suggests primary gonadal failure."
            ));
            status = max_status(&status, "moderate");
        }
    }
    if let Some(v) = r.lh {
        if v > 25.0 {
            findings.push(format!("LH {v} IU/L — elevated."));
            status = max_status(&status, "mild");
        }
    }
    if d.demographics.sex == "male" {
        if let Some(v) = r.testosterone {
            if v < 8.0 {
                findings.push(format!(
                    "Testosterone {v} nmol/L — low (hypogonadism range)."
                ));
                status = max_status(&status, "moderate");
            }
        }
    }
    if d.demographics.sex == "female" {
        if let Some(v) = r.testosterone {
            if v > 2.5 {
                findings.push(format!(
                    "Testosterone {v} nmol/L — elevated for female reference."
                ));
                status = max_status(&status, "mild");
            }
        }
    }

    if status.is_empty() {
        status = if reproductive_any_answered(r) {
            "normal".to_string()
        } else {
            String::new()
        };
    }
    (status, findings)
}

fn pituitary(d: &AssessmentData) -> (AxisStatus, Vec<String>) {
    let mut findings: Vec<String> = Vec::new();
    let mut status = String::new();
    let p = &d.pituitary_function;

    if let Some(v) = p.prolactin {
        if v > 5000.0 {
            findings.push(format!(
                "Prolactin {v} mU/L — macroprolactinoma range."
            ));
            status = max_status(&status, "severe");
        } else if v > 1000.0 {
            findings.push(format!("Prolactin {v} mU/L — prolactinoma range."));
            status = max_status(&status, "moderate");
        } else if v > 500.0 {
            findings.push(format!("Prolactin {v} mU/L — mildly elevated."));
            status = max_status(&status, "mild");
        }
    }
    if let Some(v) = p.igf1 {
        if v > 50.0 {
            findings.push(format!(
                "IGF-1 {v} nmol/L — elevated (acromegaly screening)."
            ));
            status = max_status(&status, "moderate");
        }
    }
    if let Some(v) = p.growth_hormone {
        if v > 5.0 {
            findings.push(format!("GH {v} ng/mL — elevated."));
            status = max_status(&status, "mild");
        }
    }
    if p.visual_disturbance == "yes" {
        findings.push("Visual disturbance — possible chiasmal compression.".to_string());
        status = max_status(&status, "severe");
    }
    if p.headaches == "yes" {
        findings.push("Headaches reported.".to_string());
        status = max_status(&status, "mild");
    }
    if p.acromegalic_features == "yes" {
        findings.push("Acromegalic features on examination.".to_string());
        status = max_status(&status, "moderate");
    }

    if status.is_empty() {
        status = if pituitary_any_answered(p) {
            "normal".to_string()
        } else {
            String::new()
        };
    }
    (status, findings)
}

fn bone_calcium(d: &AssessmentData) -> (AxisStatus, Vec<String>) {
    let mut findings: Vec<String> = Vec::new();
    let mut status = String::new();
    let b = &d.bone_calcium;

    if let Some(v) = b.calcium_corrected {
        if v > 3.0 || v < 1.9 {
            findings.push(format!(
                "Corrected calcium {v} mmol/L — markedly out of range."
            ));
            status = max_status(&status, "severe");
        } else if v > 2.6 {
            findings.push(format!(
                "Corrected calcium {v} mmol/L — hypercalcaemia."
            ));
            status = max_status(&status, "moderate");
        } else if v < 2.2 {
            findings.push(format!(
                "Corrected calcium {v} mmol/L — hypocalcaemia."
            ));
            status = max_status(&status, "moderate");
        }
    }
    if let Some(v) = b.pth {
        if v > 6.9 {
            findings.push(format!("PTH {v} pmol/L — elevated."));
            status = max_status(&status, "mild");
        } else if v < 1.6 {
            findings.push(format!("PTH {v} pmol/L — suppressed."));
            status = max_status(&status, "mild");
        }
    }
    if let Some(v) = b.vitamin_d {
        if v < 25.0 {
            findings.push(format!("Vitamin D {v} nmol/L — deficient."));
            status = max_status(&status, "moderate");
        } else if v < 50.0 {
            findings.push(format!("Vitamin D {v} nmol/L — insufficient."));
            status = max_status(&status, "mild");
        }
    }
    if b.fragility_fracture == "yes" {
        findings.push("Fragility fracture history.".to_string());
        status = max_status(&status, "moderate");
    }
    if b.bone_pain == "yes" {
        findings.push("Bone pain reported.".to_string());
        status = max_status(&status, "mild");
    }

    if status.is_empty() {
        status = if bone_any_answered(b) {
            "normal".to_string()
        } else {
            String::new()
        };
    }
    (status, findings)
}

// "Any answered?" helpers — true when a section has at least one non-default
// value. Mirrors the JS `anyAnswered` helper but per typed section.

fn thyroid_any_answered(t: &super::types::ThyroidAxis) -> bool {
    t.tsh.is_some()
        || t.ft4.is_some()
        || t.ft3.is_some()
        || !t.antibodies_positive.is_empty()
        || !t.goitre.is_empty()
        || !t.family_history_thyroid.is_empty()
        || !t.thyroid_notes.is_empty()
}

fn adrenal_any_answered(a: &super::types::AdrenalAxis) -> bool {
    a.morning_cortisol.is_some()
        || a.acth.is_some()
        || a.aldosterone.is_some()
        || a.renin.is_some()
        || !a.hyperpigmentation.is_empty()
        || !a.cushingoid_features.is_empty()
        || !a.postural_hypotension.is_empty()
        || !a.adrenal_notes.is_empty()
}

fn glucose_any_answered(g: &super::types::GlucoseMetabolism) -> bool {
    g.hba1c.is_some()
        || g.fasting_glucose.is_some()
        || g.random_glucose.is_some()
        || !g.known_diabetes.is_empty()
        || !g.diabetes_type.is_empty()
        || !g.hypoglycaemia_episodes.is_empty()
        || !g.glucose_notes.is_empty()
}

fn reproductive_any_answered(r: &super::types::ReproductiveAxis) -> bool {
    r.fsh.is_some()
        || r.lh.is_some()
        || r.testosterone.is_some()
        || r.oestradiol.is_some()
        || !r.menstrual_irregularity.is_empty()
        || !r.infertility.is_empty()
        || !r.libido_change.is_empty()
        || !r.galactorrhoea.is_empty()
        || !r.reproductive_notes.is_empty()
}

fn pituitary_any_answered(p: &super::types::PituitaryFunction) -> bool {
    p.prolactin.is_some()
        || p.igf1.is_some()
        || p.growth_hormone.is_some()
        || !p.headaches.is_empty()
        || !p.visual_disturbance.is_empty()
        || !p.acromegalic_features.is_empty()
        || !p.pituitary_imaging_done.is_empty()
        || !p.pituitary_imaging_findings.is_empty()
        || !p.pituitary_notes.is_empty()
}

fn bone_any_answered(b: &super::types::BoneCalcium) -> bool {
    b.pth.is_some()
        || b.vitamin_d.is_some()
        || b.calcium_corrected.is_some()
        || b.phosphate.is_some()
        || !b.fragility_fracture.is_empty()
        || !b.bone_pain.is_empty()
        || !b.dexa_scan_done.is_empty()
        || !b.dexa_result.is_empty()
        || !b.bone_notes.is_empty()
}
