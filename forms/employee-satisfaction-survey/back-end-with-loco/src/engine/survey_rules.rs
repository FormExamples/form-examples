//! Survey rules module.

use super::types::{AssessmentData, LikertValue};

/// Static catalogue of all Likert survey items with their domain and label.
/// IDs preserve the canonical front-end identifiers (wl1..wl5, mg1..mg5, etc.).
pub struct SurveyItem {
    /// ID.
    pub id: &'static str,
    /// Domain.
    pub domain: &'static str,
    /// Label.
    pub label: &'static str,
    /// Accessor.
    pub accessor: fn(&AssessmentData) -> LikertValue,
}

/// All 36 graded Likert items, in canonical order.
pub fn survey_items() -> Vec<SurveyItem> {
    vec![
        // ───────── Workload & Work-Life Balance (5 items) ─────────
        SurveyItem { id: "wl1", domain: "workload", label: "My workload is manageable.",
            accessor: |d| d.workload.wl1 },
        SurveyItem { id: "wl2", domain: "workload", label: "I am able to maintain a healthy balance between work and my personal life.",
            accessor: |d| d.workload.wl2 },
        SurveyItem { id: "wl3", domain: "workload", label: "I rarely feel exhausted or burnt out at the end of the working week.",
            accessor: |d| d.workload.wl3 },
        SurveyItem { id: "wl4", domain: "workload", label: "I am able to take time off when I need it.",
            accessor: |d| d.workload.wl4 },
        SurveyItem { id: "wl5", domain: "workload", label: "My working hours are reasonable for the role I do.",
            accessor: |d| d.workload.wl5 },

        // ───────── Management & Leadership (5 items) ─────────
        SurveyItem { id: "mg1", domain: "management", label: "My line manager treats me with respect.",
            accessor: |d| d.management.mg1 },
        SurveyItem { id: "mg2", domain: "management", label: "My line manager gives me clear direction and constructive feedback.",
            accessor: |d| d.management.mg2 },
        SurveyItem { id: "mg3", domain: "management", label: "I trust the senior leadership of this organisation.",
            accessor: |d| d.management.mg3 },
        SurveyItem { id: "mg4", domain: "management", label: "Decisions made by leadership are communicated openly.",
            accessor: |d| d.management.mg4 },
        SurveyItem { id: "mg5", domain: "management", label: "My line manager supports my wellbeing.",
            accessor: |d| d.management.mg5 },

        // ───────── Growth & Development (4 items) ─────────
        SurveyItem { id: "gr1", domain: "growth", label: "I have meaningful opportunities to learn new skills here.",
            accessor: |d| d.growth.gr1 },
        SurveyItem { id: "gr2", domain: "growth", label: "I see a clear path for career progression.",
            accessor: |d| d.growth.gr2 },
        SurveyItem { id: "gr3", domain: "growth", label: "My manager actively supports my professional development.",
            accessor: |d| d.growth.gr3 },
        SurveyItem { id: "gr4", domain: "growth", label: "Training and development resources are available when I need them.",
            accessor: |d| d.growth.gr4 },

        // ───────── Compensation & Benefits (4 items) ─────────
        SurveyItem { id: "cb1", domain: "compensation", label: "I am paid fairly for the work I do.",
            accessor: |d| d.compensation.cb1 },
        SurveyItem { id: "cb2", domain: "compensation", label: "My benefits package meets my needs.",
            accessor: |d| d.compensation.cb2 },
        SurveyItem { id: "cb3", domain: "compensation", label: "Pay decisions in this organisation are made fairly.",
            accessor: |d| d.compensation.cb3 },
        SurveyItem { id: "cb4", domain: "compensation", label: "My total compensation is competitive with similar roles elsewhere.",
            accessor: |d| d.compensation.cb4 },

        // ───────── Culture & Inclusion (5 items) ─────────
        SurveyItem { id: "cu1", domain: "culture", label: "I feel a sense of belonging at this organisation.",
            accessor: |d| d.culture.cu1 },
        SurveyItem { id: "cu2", domain: "culture", label: "People from all backgrounds are treated fairly here.",
            accessor: |d| d.culture.cu2 },
        SurveyItem { id: "cu3", domain: "culture", label: "I can be myself at work.",
            accessor: |d| d.culture.cu3 },
        SurveyItem { id: "cu4", domain: "culture", label: "My colleagues collaborate well together.",
            accessor: |d| d.culture.cu4 },
        SurveyItem { id: "cu5", domain: "culture", label: "Inappropriate behaviour is addressed promptly when it occurs.",
            accessor: |d| d.culture.cu5 },

        // ───────── Environment & Resources (4 items) ─────────
        SurveyItem { id: "en1", domain: "environment", label: "I have the tools and equipment I need to do my job well.",
            accessor: |d| d.environment.en1 },
        SurveyItem { id: "en2", domain: "environment", label: "My work environment (on-site or remote) supports productive work.",
            accessor: |d| d.environment.en2 },
        SurveyItem { id: "en3", domain: "environment", label: "I have access to the information and systems I need.",
            accessor: |d| d.environment.en3 },
        SurveyItem { id: "en4", domain: "environment", label: "Health and safety in my workplace are taken seriously.",
            accessor: |d| d.environment.en4 },

        // ───────── Recognition & Engagement (4 items) ─────────
        SurveyItem { id: "rc1", domain: "recognition", label: "I receive meaningful recognition when I do good work.",
            accessor: |d| d.recognition.rc1 },
        SurveyItem { id: "rc2", domain: "recognition", label: "I feel motivated to go beyond what is strictly required.",
            accessor: |d| d.recognition.rc2 },
        SurveyItem { id: "rc3", domain: "recognition", label: "My contributions are valued by my team and manager.",
            accessor: |d| d.recognition.rc3 },
        SurveyItem { id: "rc4", domain: "recognition", label: "I find my day-to-day work engaging.",
            accessor: |d| d.recognition.rc4 },

        // ───────── Overall Experience (4 Likert items) ─────────
        SurveyItem { id: "ov1", domain: "overall", label: "I am proud to tell people I work here.",
            accessor: |d| d.overall.ov1 },
        SurveyItem { id: "ov2", domain: "overall", label: "I would recommend this organisation as a great place to work.",
            accessor: |d| d.overall.ov2 },
        SurveyItem { id: "ov3", domain: "overall", label: "Knowing what I know now, I would still choose to join this organisation.",
            accessor: |d| d.overall.ov3 },
        SurveyItem { id: "ov4", domain: "overall", label: "I expect to still be working here in twelve months.",
            accessor: |d| d.overall.ov4 },
    ]
}

/// Canonical display order for the eight graded domain keys.
pub const GRADED_DOMAIN_KEYS: [&str; 8] = [
    "workload",
    "management",
    "growth",
    "compensation",
    "culture",
    "environment",
    "recognition",
    "overall",
];
