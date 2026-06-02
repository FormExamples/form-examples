//! Pure validation engine for the meeting form. Mirrors the
//! `validateMeeting()` rules described in ../AGENTS.md and implemented
//! verbatim in `front-end-form-with-html/js/scoring.js`.

use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Meeting {
    pub organizer_name: String,
    pub status: String,
    pub title: String,
    pub summary: String,
    pub scheduled_start_at: Option<DateTime<Utc>>,
    pub scheduled_end_at: Option<DateTime<Utc>>,
    pub actual_start_at: Option<DateTime<Utc>>,
    pub actual_end_at: Option<DateTime<Utc>>,
    pub recurring_frequency: String,
    pub recurring_series_count: Option<u32>,
    pub recurring_series_until: Option<DateTime<Utc>>,
    pub agenda: Vec<AgendaItem>,
    pub participants: Vec<Participant>,
    pub action_items: Vec<ActionItem>,
    pub outputs: Vec<MeetingOutput>,
    pub outcomes: Vec<MeetingOutcome>,
}

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", default)]
pub struct AgendaItem { pub title: String }

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Participant {
    pub name: String,
    pub response_status: String,
    pub attendance_status: String,
}

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", default)]
pub struct ActionItem {
    pub title: String,
    pub status: String,
    pub due_date: Option<NaiveDate>,
}

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", default)]
pub struct MeetingOutput { pub title: String }

#[derive(Debug, Default, Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", default)]
pub struct MeetingOutcome { pub title: String }

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: &'static str,
    pub instrument: &'static str,
    pub grade: &'static str,
    pub category: &'static str,
    pub description: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Flag {
    pub flag_id: &'static str,
    pub category: &'static str,
    pub priority: &'static str,
    pub description: String,
    pub suggested_action: &'static str,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationResult {
    pub duration_minutes: Option<i64>,
    pub participant_count: usize,
    pub accepted_count: usize,
    pub attended_count: usize,
    pub agenda_item_count: usize,
    pub action_item_count: usize,
    pub output_count: usize,
    pub outcome_count: usize,
    pub completion_status: &'static str,
    pub overall_health: &'static str,
    pub fired_rules: Vec<FiredRule>,
    pub flags: Vec<Flag>,
}

pub fn validate_meeting(m: &Meeting) -> ValidationResult {
    let participant_count = m.participants.len();
    let accepted_count = m.participants.iter()
        .filter(|p| p.response_status == "accepted").count();
    let attended_count = m.participants.iter()
        .filter(|p| matches!(p.attendance_status.as_str(),
            "present" | "late" | "remote" | "partial")).count();

    let is_completed = m.status == "completed";
    let duration_minutes = match (
        m.actual_start_at.or(m.scheduled_start_at),
        m.actual_end_at.or(m.scheduled_end_at),
    ) {
        (Some(a), Some(b)) if b >= a => Some((b - a).num_minutes()),
        _ => None,
    };

    let mut fired = Vec::<FiredRule>::new();
    let mut flags = Vec::<Flag>::new();

    let summary = m.summary.trim();
    let summary_len = summary.chars().count();
    if summary_len > 250 {
        fired.push(FiredRule {
            rule_id: "R-SUMMARY-OVER-LIMIT",
            instrument: "summary",
            grade: "red",
            category: "data-quality",
            description: format!("Summary exceeds 250 characters ({summary_len})."),
        });
        flags.push(Flag {
            flag_id: "F-SUMMARY-OVER-LIMIT",
            category: "summary-over-limit",
            priority: "high",
            description: format!("Summary is {summary_len} characters; spec caps at 250."),
            suggested_action: "Shorten summary to 250 characters.",
        });
    }

    if m.organizer_name.trim().is_empty() {
        fired.push(FiredRule {
            rule_id: "R-NO-ORGANIZER", instrument: "invitation",
            grade: "amber", category: "completeness",
            description: "No organiser identified.".into(),
        });
        flags.push(Flag {
            flag_id: "F-NO-ORGANIZER", category: "no-organizer",
            priority: "medium",
            description: "No organiser name supplied.".into(),
            suggested_action: "Add an organiser on step 1.",
        });
    }

    if participant_count == 0 {
        let grade = if is_completed { "red" } else { "amber" };
        fired.push(FiredRule {
            rule_id: "R-NO-PARTICIPANTS", instrument: "participants",
            grade, category: "completeness",
            description: "No participants recorded.".into(),
        });
        if is_completed {
            flags.push(Flag {
                flag_id: "F-NO-PARTICIPANTS", category: "no-participants",
                priority: "high",
                description: "Completed meeting has no participants.".into(),
                suggested_action: "Add at least one participant on step 5.",
            });
        }
    }

    if m.agenda.is_empty() {
        let grade = if is_completed { "red" } else { "amber" };
        fired.push(FiredRule {
            rule_id: "R-NO-AGENDA", instrument: "agenda",
            grade, category: "completeness",
            description: "No agenda items.".into(),
        });
        if is_completed {
            flags.push(Flag {
                flag_id: "F-NO-AGENDA", category: "no-agenda",
                priority: "medium",
                description: "Completed meeting has no agenda items.".into(),
                suggested_action: "Document what was discussed on step 4.",
            });
        }
    }

    if is_completed && m.outcomes.is_empty() {
        fired.push(FiredRule {
            rule_id: "R-NO-OUTCOMES", instrument: "outcomes",
            grade: "amber", category: "completeness",
            description: "Completed meeting recorded no outcomes.".into(),
        });
        flags.push(Flag {
            flag_id: "F-NO-OUTCOMES", category: "no-outcomes",
            priority: "medium",
            description: "No outcomes recorded for a completed meeting.".into(),
            suggested_action: "Add at least one outcome on step 9.",
        });
    }

    if is_completed && summary.is_empty() {
        fired.push(FiredRule {
            rule_id: "R-NO-SUMMARY", instrument: "summary",
            grade: "amber", category: "completeness",
            description: "Completed meeting has no summary.".into(),
        });
        flags.push(Flag {
            flag_id: "F-NO-SUMMARY", category: "no-summary",
            priority: "medium",
            description: "No summary recorded for a completed meeting.".into(),
            suggested_action: "Write a 250-char summary on step 8.",
        });
    }

    if let (Some(start), Some(end)) = (m.scheduled_start_at, m.scheduled_end_at) {
        if end < start {
            fired.push(FiredRule {
                rule_id: "R-START-AFTER-END", instrument: "invitation",
                grade: "red", category: "scheduling",
                description: "Scheduled end precedes scheduled start.".into(),
            });
            flags.push(Flag {
                flag_id: "F-START-AFTER-END", category: "start-after-end",
                priority: "high",
                description: "Scheduled end is earlier than scheduled start.".into(),
                suggested_action: "Correct the start / end times on step 3.",
            });
        }
    }

    let freq = m.recurring_frequency.as_str();
    let has_recurrence = !freq.is_empty() && freq != "none";
    if has_recurrence {
        let has_end = m.recurring_series_count.unwrap_or(0) > 0
            || m.recurring_series_until.is_some();
        if !has_end {
            fired.push(FiredRule {
                rule_id: "R-RECURRING-WITHOUT-UNTIL", instrument: "recurrence",
                grade: "amber", category: "scheduling",
                description: "Recurring rule has neither a count nor an until.".into(),
            });
            flags.push(Flag {
                flag_id: "F-RECURRING-WITHOUT-UNTIL", category: "recurring-without-until",
                priority: "medium",
                description: "Open-ended recurring meeting.".into(),
                suggested_action: "Add a series count or series until on step 7.",
            });
        }
    }

    let today = chrono::Utc::now().date_naive();
    let overdue = m.action_items.iter().filter(|a| {
        a.status != "done" && a.status != "cancelled"
            && a.due_date.is_some_and(|d| d < today)
    }).count();
    if overdue > 0 {
        fired.push(FiredRule {
            rule_id: "R-ACTION-ITEM-OVERDUE", instrument: "action-items",
            grade: "red", category: "follow-up",
            description: format!("{overdue} overdue action item(s)."),
        });
        flags.push(Flag {
            flag_id: "F-ACTION-ITEM-OVERDUE", category: "action-item-overdue",
            priority: "high",
            description: format!("{overdue} action item(s) past due."),
            suggested_action: "Chase the owner or reset the due date on step 9.",
        });
    }

    if participant_count > 0 && (accepted_count as f64) / (participant_count as f64) < 0.5 {
        fired.push(FiredRule {
            rule_id: "R-LOW-ACCEPTANCE-RATE", instrument: "participants",
            grade: "amber", category: "engagement",
            description: "Fewer than half of participants accepted.".into(),
        });
        flags.push(Flag {
            flag_id: "F-LOW-ACCEPTANCE-RATE", category: "low-acceptance-rate",
            priority: "low",
            description: format!(
                "Acceptance rate is below 50 % ({accepted_count}/{participant_count})."
            ),
            suggested_action: "Confirm with required participants before the meeting.",
        });
    }

    let completion_status = if is_completed {
        if !m.outcomes.is_empty() && !summary.is_empty() { "complete" } else { "incomplete" }
    } else if m.status == "in-progress" {
        "in-progress"
    } else {
        "planned"
    };

    let overall_health = if flags.iter().any(|f| f.priority == "high") {
        "red"
    } else if !flags.is_empty() {
        "amber"
    } else {
        "green"
    };

    ValidationResult {
        duration_minutes,
        participant_count,
        accepted_count,
        attended_count,
        agenda_item_count: m.agenda.len(),
        action_item_count: m.action_items.len(),
        output_count: m.outputs.len(),
        outcome_count: m.outcomes.len(),
        completion_status,
        overall_health,
        fired_rules: fired,
        flags,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_draft_is_planned_amber() {
        let r = validate_meeting(&Meeting::default());
        assert_eq!(r.completion_status, "planned");
        assert!(r.flags.iter().any(|f| f.category == "no-organizer"));
    }

    #[test]
    fn summary_over_limit_fires_flag() {
        let m = Meeting {
            summary: "x".repeat(260),
            ..Default::default()
        };
        let r = validate_meeting(&m);
        assert!(r.flags.iter().any(|f| f.category == "summary-over-limit"));
        assert_eq!(r.overall_health, "red");
    }

    #[test]
    fn completed_with_summary_and_outcome_is_complete() {
        let m = Meeting {
            status: "completed".into(),
            organizer_name: "Test".into(),
            summary: "Good meeting.".into(),
            agenda: vec![AgendaItem { title: "x".into() }],
            participants: vec![Participant {
                name: "p".into(),
                response_status: "accepted".into(),
                attendance_status: "present".into(),
            }],
            outcomes: vec![MeetingOutcome { title: "o".into() }],
            ..Default::default()
        };
        let r = validate_meeting(&m);
        assert_eq!(r.completion_status, "complete");
    }
}
