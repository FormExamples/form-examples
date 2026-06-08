//! Types module.

use serde::{Deserialize, Serialize};

// `Answer` represents a yes/no/unanswered checklist response.
// `None` = unanswered; `Some(true)` = yes; `Some(false)` = no.
/// Answer.
pub type Answer = Option<bool>;

/// Checklist item.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct ChecklistItem {
    /// Done.
    pub done: Answer,
    /// Evidence.
    pub evidence: String,
}

/// Organization metadata.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct OrganizationMetadata {
    /// Organization name.
    pub organization_name: String,
    /// Legal name.
    pub legal_name: String,
    /// Sector.
    pub sector: String,
    /// Size band.
    pub size_band: String,
    /// Headcount.
    pub headcount: Option<i64>,
    /// Country.
    pub country: String,
    /// Region.
    pub region: String,
    /// Website.
    pub website: String,
}

/// Respondent metadata.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct RespondentMetadata {
    /// Respondent name.
    pub respondent_name: String,
    /// Respondent email.
    pub respondent_email: String,
    /// Respondent phone.
    pub respondent_phone: String,
    /// Role.
    pub role: String,
    /// Department.
    pub department: String,
    /// Seniority.
    pub seniority: String,
    /// Timezone.
    pub timezone: String,
    /// Preferred contact.
    pub preferred_contact: String,
}

/// Assessment metadata.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AssessmentMetadata {
    /// Assessment date.
    pub assessment_date: String,
    /// Status.
    pub status: String,
}

/// Manifesto items.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct ManifestoItems {
    /// M1.
    pub m1: ChecklistItem,
    /// M2.
    pub m2: ChecklistItem,
    /// M3.
    pub m3: ChecklistItem,
    /// M4.
    pub m4: ChecklistItem,
}

/// Principles items.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct PrinciplesItems {
    /// P1.
    pub p1: ChecklistItem,
    /// P2.
    pub p2: ChecklistItem,
    /// P3.
    pub p3: ChecklistItem,
    /// P4.
    pub p4: ChecklistItem,
    /// P5.
    pub p5: ChecklistItem,
    /// P6.
    pub p6: ChecklistItem,
    /// P7.
    pub p7: ChecklistItem,
    /// P8.
    pub p8: ChecklistItem,
    /// P9.
    pub p9: ChecklistItem,
    /// P10.
    pub p10: ChecklistItem,
    /// P11.
    pub p11: ChecklistItem,
    /// P12.
    pub p12: ChecklistItem,
}

/// Agile consulting scorecard assessment.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AgileConsultingScorecardAssessment {
    /// Organization.
    pub organization: OrganizationMetadata,
    /// Respondent.
    pub respondent: RespondentMetadata,
    /// Assessment.
    pub assessment: AssessmentMetadata,
    /// Manifesto.
    pub manifesto: ManifestoItems,
    /// Principles.
    pub principles: PrinciplesItems,
}

/// Band.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Band {
    /// Low.
    Low,
    /// Borderline.
    Borderline,
    /// Medium.
    Medium,
    /// High.
    High,
}

impl Band {
    /// As str.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Low => "low",
            Self::Borderline => "borderline",
            Self::Medium => "medium",
            Self::High => "high",
        }
    }
}

/// Instrument.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Instrument {
    /// Manifesto.
    Manifesto,
    /// Principles.
    Principles,
    /// Composite.
    Composite,
}

/// Item answer grade.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ItemAnswerGrade {
    /// Yes.
    Yes,
    /// No.
    No,
    /// Unanswered.
    Unanswered,
}

/// Fired rule.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    /// Rule ID.
    pub rule_id: String,
    /// Instrument.
    pub instrument: Instrument,
    /// 1..16 for item rules; `None` for composite rules.
    pub item_number: Option<u8>,
    /// Grade.
    pub grade: String,
    /// Points awarded.
    pub points_awarded: u8,
    /// Category.
    pub category: String,
    /// Description.
    pub description: String,
}

/// Flag priority.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagPriority {
    /// Low.
    Low,
    /// Medium.
    Medium,
    /// High.
    High,
}

/// Flag category.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagCategory {
    /// No senior leadership buyin.
    NoSeniorLeadershipBuyin,
    /// No customer contact.
    NoCustomerContact,
    /// No working software.
    NoWorkingSoftware,
    /// No sustainable budget.
    NoSustainableBudget,
    /// No self organization.
    NoSelfOrganization,
    /// No reflection culture.
    NoReflectionCulture,
    /// Other.
    Other,
}

/// Additional flag.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    /// Flag ID.
    pub flag_id: String,
    /// Category.
    pub category: FlagCategory,
    /// Priority.
    pub priority: FlagPriority,
    /// Description.
    pub description: String,
    /// Suggested action.
    pub suggested_action: String,
}

/// Recommendation.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Recommendation {
    /// Do not hire yet.
    DoNotHireYet,
    /// Do homework first.
    DoHomeworkFirst,
    /// Trial engagement.
    TrialEngagement,
    /// Hire with focus areas.
    HireWithFocusAreas,
    /// Reassess in3 months.
    ReassessIn3Months,
}

/// Grade result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResult {
    /// Score total.
    pub score_total: u8,
    /// Manifesto subtotal.
    pub manifesto_subtotal: u8,
    /// Principles subtotal.
    pub principles_subtotal: u8,
    /// Computed band.
    pub computed_band: Band,
    /// Recommendation.
    pub recommendation: Recommendation,
    /// Fired rules.
    pub fired_rules: Vec<FiredRule>,
    /// Additional flags.
    pub additional_flags: Vec<AdditionalFlag>,
}
