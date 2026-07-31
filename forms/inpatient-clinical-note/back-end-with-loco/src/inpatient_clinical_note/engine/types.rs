//! Engine types for the inpatient clinical note.
//!
//! The `serde(rename_all = "camelCase")` attributes keep the wire shape aligned
//! with the TypeScript and plain-JavaScript engines in the two front-ends.

use serde::{Deserialize, Serialize};

/// Which of the eight note types this entry is. Drives the required-component
/// set (spec §4.2).
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum NoteType {
    /// First full assessment on admission.
    AdmissionClerking,
    /// Routine interval progress entry.
    #[default]
    Progress,
    /// Specialty opinion requested by the parent team.
    Consult,
    /// Acute deterioration or clinical incident.
    Event,
    /// Bedside procedure performed on the ward.
    Procedure,
    /// End-of-shift handover entry.
    Handover,
    /// Inter-ward or inter-hospital transfer.
    Transfer,
    /// Discharge readiness and arrangements.
    DischargePlanning,
}

impl NoteType {
    /// The wire / database spelling, identical to the `serde` representation.
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::AdmissionClerking => "admission-clerking",
            Self::Progress => "progress",
            Self::Consult => "consult",
            Self::Event => "event",
            Self::Procedure => "procedure",
            Self::Handover => "handover",
            Self::Transfer => "transfer",
            Self::DischargePlanning => "discharge-planning",
        }
    }

    /// Parse the wire / database spelling. Returns `None` for an unset or
    /// unrecognised value, which the header component then reads as undocumented.
    #[must_use]
    pub fn from_wire(s: &str) -> Option<Self> {
        match s {
            "admission-clerking" => Some(Self::AdmissionClerking),
            "progress" => Some(Self::Progress),
            "consult" => Some(Self::Consult),
            "event" => Some(Self::Event),
            "procedure" => Some(Self::Procedure),
            "handover" => Some(Self::Handover),
            "transfer" => Some(Self::Transfer),
            "discharge-planning" => Some(Self::DischargePlanning),
            _ => None,
        }
    }
}

/// Documentation-completeness status. Never overridable — it is a mechanical
/// property of the record, not a clinical judgement.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum CompletenessStatus {
    /// Every required component for this note type is documented.
    Complete,
    /// Header, impression, and plan present, and at least half the required set.
    Partial,
    /// Header, impression, or plan missing, or fewer than half the required set.
    #[default]
    Incomplete,
}

impl CompletenessStatus {
    /// The wire / database spelling, identical to the `serde` representation.
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Complete => "complete",
            Self::Partial => "partial",
            Self::Incomplete => "incomplete",
        }
    }
}

/// Clinical acuity band, assigned by max-band over the acuity rules.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum AcuityBand {
    /// NEWS2 0–4 with no single parameter scoring 3, no deterioration markers.
    #[default]
    Stable,
    /// NEWS2 5–6, a single parameter scoring 3, or a worsening trend.
    Watch,
    /// NEWS2 >= 7, or a deterioration marker.
    Escalate,
    /// Arrest, critical-care referral, NEWS2 >= 9, or new organ support.
    Critical,
}

impl AcuityBand {
    /// The wire / database spelling, identical to the `serde` representation.
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Stable => "stable",
            Self::Watch => "watch",
            Self::Escalate => "escalate",
            Self::Critical => "critical",
        }
    }

    /// Parse the wire / database spelling. Returns `None` for an unset or
    /// unrecognised value, which the acuity engine reads as "no override".
    #[must_use]
    pub fn from_wire(s: &str) -> Option<Self> {
        match s {
            "stable" => Some(Self::Stable),
            "watch" => Some(Self::Watch),
            "escalate" => Some(Self::Escalate),
            "critical" => Some(Self::Critical),
            _ => None,
        }
    }
}

/// One of the twelve note components the completeness engine grades.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ComponentKey {
    /// Note type, date and time, author name and grade.
    Header,
    /// Events since the last entry, or an explicit negative.
    IntervalHistory,
    /// A NEWS2 total, or the full set of seven parameters.
    Observations,
    /// At least one system examined.
    Examination,
    /// At least one result reviewed, or an explicit negative.
    Investigations,
    /// At least one problem on the list.
    Problems,
    /// At least one prescribing change, or an explicit negative.
    Medications,
    /// VTE status recorded (NICE NG89).
    RiskAssessments,
    /// A clinical impression.
    Impression,
    /// A narrative plan, or at least one job.
    Plan,
    /// An escalation status and a ceiling of care.
    Escalation,
    /// Family, patient, or team communication.
    Communication,
}

impl ComponentKey {
    /// The wire / database spelling, identical to the `serde` representation and
    /// to the `component` CHECK constraint on
    /// `inpatient_clinical_note_grade_rule`. Never use the `Debug` form here —
    /// it is `PascalCase` and both the schema and the front-end engines are
    /// kebab-case.
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Header => "header",
            Self::IntervalHistory => "interval-history",
            Self::Observations => "observations",
            Self::Examination => "examination",
            Self::Investigations => "investigations",
            Self::Problems => "problems",
            Self::Medications => "medications",
            Self::RiskAssessments => "risk-assessments",
            Self::Impression => "impression",
            Self::Plan => "plan",
            Self::Escalation => "escalation",
            Self::Communication => "communication",
        }
    }

    /// Human-readable label.
    #[must_use]
    pub const fn label(self) -> &'static str {
        match self {
            Self::Header => "Note header",
            Self::IntervalHistory => "Interval history",
            Self::Observations => "Observations and NEWS2",
            Self::Examination => "Examination",
            Self::Investigations => "Investigations reviewed",
            Self::Problems => "Problem list",
            Self::Medications => "Medications",
            Self::RiskAssessments => "Risk assessments",
            Self::Impression => "Clinical impression",
            Self::Plan => "Plan and jobs",
            Self::Escalation => "Escalation status",
            Self::Communication => "Communication",
        }
    }
}

/// Priority of a safety flag.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagPriority {
    /// Act now.
    High,
    /// Act this shift.
    Medium,
    /// Record-quality issue.
    Low,
}

impl FlagPriority {
    /// The wire / database spelling, identical to the `serde` representation.
    #[must_use]
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::High => "high",
            Self::Medium => "medium",
            Self::Low => "low",
        }
    }
}

/// Per-component presence row.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ComponentStatus {
    /// Which component.
    pub component: ComponentKey,
    /// Human-readable label.
    pub label: String,
    /// Whether this component is required for THIS note's type.
    pub required: bool,
    /// Whether it is documented.
    pub present: bool,
}

/// One rule firing, from either engine. Mirrors
/// `inpatient_clinical_note_grade_rule`.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Stable rule identifier, e.g. `A-NEWS2-HIGH`.
    pub id: String,
    /// Which engine fired it: `completeness` or `acuity`.
    pub engine: String,
    /// The component it concerns.
    pub component: String,
    /// For an acuity rule, the band proposed.
    pub band: Option<AcuityBand>,
    /// Subject category.
    pub category: String,
    /// Why it fired.
    pub description: String,
}

/// One safety flag. Mirrors `inpatient_clinical_note_grade_flag`.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlaggedIssue {
    /// Stable flag identifier.
    pub id: String,
    /// Flag category.
    pub category: String,
    /// Priority.
    pub priority: FlagPriority,
    /// What fired it.
    pub description: String,
    /// Suggested clinical or governance action.
    pub suggested_action: String,
}

/// The observation set, carrying the seven NEWS2 parameters.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Observations {
    /// Respiratory rate, breaths per minute.
    pub respiratory_rate: Option<i32>,
    /// Peripheral oxygen saturation, percent.
    pub oxygen_saturation: Option<i32>,
    /// `scale-1` (default) or `scale-2`.
    pub spo2_scale: String,
    /// Delivery device, or `air` on room air.
    pub oxygen_delivery: String,
    /// Systolic blood pressure, mmHg.
    pub systolic_blood_pressure: Option<i32>,
    /// Pulse, beats per minute.
    pub pulse_rate: Option<i32>,
    /// Consciousness on ACVPU.
    pub acvpu: String,
    /// Temperature, degrees Celsius.
    pub temperature_celsius: Option<f64>,
    /// NEWS2 aggregate as entered from the ward chart.
    pub news2_total: Option<i32>,
    /// `improving`, `stable`, `worsening`, or `unknown`.
    pub news2_trend: String,
}

/// One investigations-reviewed row.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct InvestigationRow {
    /// Test name.
    pub test_name: String,
    /// Whether the result is abnormal (`yes` / `no` / empty).
    pub abnormal: String,
    /// Whether it has been actioned (`yes` / `no` / empty).
    pub actioned: String,
}

/// One prescribing-change row.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct MedicationRow {
    /// Drug name.
    pub drug_name: String,
    /// `started`, `stopped`, `dose-changed`, `held`, `continued`, `switched`.
    pub action: String,
    /// Whether the drug is an antimicrobial (`yes` / `no` / empty).
    pub is_antimicrobial: String,
}

/// The note the engines grade. Only the fields the engines actually read are
/// modelled here; the full record lives in the database entities.
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct InpatientClinicalNote {
    /// Which of the eight note types.
    pub note_type: Option<NoteType>,
    /// When the clinical events occurred.
    pub note_at: String,
    /// Author name.
    pub author_name: String,
    /// Author grade.
    pub author_grade: String,
    /// When the admission episode began.
    pub admission_at: String,

    /// Events since the last entry.
    pub interval_history: String,
    /// Explicit "no interval events" negative.
    pub no_interval_events: String,

    /// The observation set.
    pub observations: Observations,

    /// Any non-empty examination field documents the examination component.
    pub examination_documented: bool,

    /// Investigations reviewed.
    pub investigations: Vec<InvestigationRow>,
    /// Explicit "no investigations reviewed" negative.
    pub no_investigations_reviewed: String,

    /// Number of problems on the list.
    pub problem_count: usize,

    /// Prescribing changes.
    pub medications: Vec<MedicationRow>,
    /// Explicit "no medication changes" negative.
    pub no_medication_changes: String,
    /// Whether the allergy status was checked.
    pub allergy_checked: String,
    /// `not-applicable`, `due`, `done`, or `overdue`.
    pub antimicrobial_review_status: String,

    /// VTE assessment status — the sole predicate for the risk component.
    pub vte_status: String,

    /// Clinical impression.
    pub clinical_impression: String,
    /// Whether a new oxygen requirement was recorded.
    pub new_oxygen_requirement: String,
    /// Whether the confusion is new.
    pub new_confusion: String,
    /// `positive`, `negative`, or `not-done`.
    pub sepsis_screen: String,
    /// `none`, `cardiac`, `respiratory`, or `peri-arrest`.
    pub arrest_call: String,
    /// Whether a critical-care referral was made.
    pub critical_care_referral: String,
    /// New organ support started.
    pub new_organ_support: String,

    /// Narrative plan.
    pub plan: String,
    /// Number of jobs.
    pub job_count: usize,
    /// Escalation status.
    pub escalation_status: String,
    /// Escalation action actually taken.
    pub escalation_action: String,
    /// Agreed ceiling of care.
    pub ceiling_of_care: String,
    /// Named senior reviewer.
    pub senior_review_by: String,
    /// Estimated date of discharge.
    pub estimated_discharge_date: String,

    /// Family / next-of-kin communication.
    pub family_communication: String,
    /// Patient communication.
    pub patient_communication: String,
    /// Handover to the incoming team.
    pub team_handover: String,
    /// Consent basis.
    pub consent_status: String,
    /// Whether capacity was assessed.
    pub capacity_assessed: String,

    /// Author override of the computed acuity band.
    pub author_override_acuity: Option<AcuityBand>,
    /// Reason for the override. An override without one is ignored.
    pub author_override_reason: String,
}

/// The full grading result: both engines plus the safety flags.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoteGrade {
    /// Completeness status.
    pub status: CompletenessStatus,
    /// Completeness percentage, 0..=100.
    pub completeness_percent: i32,
    /// Final acuity band, after any author override.
    pub acuity_band: AcuityBand,
    /// What the acuity engine computed, retained for audit.
    pub computed_acuity_band: AcuityBand,
    /// Whether the author overrode the band.
    pub acuity_overridden: bool,
    /// The NEWS2 total the band was computed from.
    pub news2_total: Option<i32>,
    /// The total derived from the seven parameters.
    pub news2_derived_total: Option<i32>,
    /// Per-component presence, all twelve components.
    pub component_statuses: Vec<ComponentStatus>,
    /// Number of required components documented.
    pub documented_required: usize,
    /// Number of components required for this note type.
    pub total_required: usize,
    /// Audit trail from both engines.
    pub fired_rules: Vec<FiredRule>,
    /// Safety flags.
    pub flags: Vec<FlaggedIssue>,
}
