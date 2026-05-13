use serde::{Deserialize, Serialize};

// `Answer` represents a yes/no/unanswered checklist response.
// `None` = unanswered; `Some(true)` = yes; `Some(false)` = no.
pub type Answer = Option<bool>;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct ChecklistItem {
    pub done: Answer,
    pub evidence: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct OrganizationMetadata {
    pub organization_name: String,
    pub legal_name: String,
    pub sector: String,
    pub size_band: String,
    pub headcount: Option<i64>,
    pub country: String,
    pub region: String,
    pub website: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct RespondentMetadata {
    pub respondent_name: String,
    pub respondent_email: String,
    pub respondent_phone: String,
    pub role: String,
    pub department: String,
    pub seniority: String,
    pub timezone: String,
    pub preferred_contact: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AssessmentMetadata {
    pub assessment_date: String,
    pub status: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct ManifestoItems {
    pub m1: ChecklistItem,
    pub m2: ChecklistItem,
    pub m3: ChecklistItem,
    pub m4: ChecklistItem,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct PrinciplesItems {
    pub p1: ChecklistItem,
    pub p2: ChecklistItem,
    pub p3: ChecklistItem,
    pub p4: ChecklistItem,
    pub p5: ChecklistItem,
    pub p6: ChecklistItem,
    pub p7: ChecklistItem,
    pub p8: ChecklistItem,
    pub p9: ChecklistItem,
    pub p10: ChecklistItem,
    pub p11: ChecklistItem,
    pub p12: ChecklistItem,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AgileConsultingScorecardAssessment {
    pub organization: OrganizationMetadata,
    pub respondent: RespondentMetadata,
    pub assessment: AssessmentMetadata,
    pub manifesto: ManifestoItems,
    pub principles: PrinciplesItems,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Band {
    Low,
    Borderline,
    Medium,
    High,
}

impl Band {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Low => "low",
            Self::Borderline => "borderline",
            Self::Medium => "medium",
            Self::High => "high",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Instrument {
    Manifesto,
    Principles,
    Composite,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ItemAnswerGrade {
    Yes,
    No,
    Unanswered,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    pub instrument: Instrument,
    /// 1..16 for item rules; `None` for composite rules.
    pub item_number: Option<u8>,
    pub grade: String,
    pub points_awarded: u8,
    pub category: String,
    pub description: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagPriority {
    Low,
    Medium,
    High,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FlagCategory {
    NoSeniorLeadershipBuyin,
    NoCustomerContact,
    NoWorkingSoftware,
    NoSustainableBudget,
    NoSelfOrganization,
    NoReflectionCulture,
    Other,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub flag_id: String,
    pub category: FlagCategory,
    pub priority: FlagPriority,
    pub description: String,
    pub suggested_action: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Recommendation {
    DoNotHireYet,
    DoHomeworkFirst,
    TrialEngagement,
    HireWithFocusAreas,
    ReassessIn3Months,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GradeResult {
    pub score_total: u8,
    pub manifesto_subtotal: u8,
    pub principles_subtotal: u8,
    pub computed_band: Band,
    pub recommendation: Recommendation,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
}
