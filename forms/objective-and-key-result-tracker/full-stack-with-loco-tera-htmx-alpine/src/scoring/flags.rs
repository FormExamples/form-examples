use crate::scoring::types::{
    FiredFlag, FlagCode, FlagPriority, ObjectiveAssessment,
};

pub fn compute(a: &ObjectiveAssessment) -> Vec<FiredFlag> {
    let mut flags: Vec<FiredFlag> = Vec::new();
    let s = &a.scores;
    let c = &a.context;

    if let Some(g) = s.alignment_grade { if g <= 2 {
        flags.push(FiredFlag { flag_code: FlagCode::MisAligned, priority: FlagPriority::High, description: format!("Alignment grade {g}/5 — mis-aligned.") });
    }}
    if matches!(c.level.as_str(), "individual" | "team" | "department") && c.parent_objective_id.is_none() {
        flags.push(FiredFlag { flag_code: FlagCode::Orphaned, priority: FlagPriority::High, description: format!("Level {} but no parent.", c.level) });
    }
    if let Some(q) = s.smart_quality { if q <= 1 {
        flags.push(FiredFlag { flag_code: FlagCode::NonSmart, priority: FlagPriority::High, description: format!("SMART quality {q}/5.") });
    }}
    if !a.key_results.is_empty() && !a.key_results.iter().any(|k| k.kr_type == "numeric" || k.kr_type == "milestone") {
        flags.push(FiredFlag { flag_code: FlagCode::Unmeasurable, priority: FlagPriority::High, description: "No KR is numeric or milestone.".into() });
    }
    if !c.dri_present {
        flags.push(FiredFlag { flag_code: FlagCode::NoDri, priority: FlagPriority::High, description: "No DRI assigned.".into() });
    }
    if let (Some(1), Some(p), Some(start), Some(end)) = (s.stretch_tier, s.progress_percent, c.cycle_start_date.as_ref(), c.cycle_end_date.as_ref()) {
        if p < 50.0 {
            if let (Ok(elapsed), Ok(total)) = (days_between(start, &a.now), days_between(start, end)) {
                if total > 0 && elapsed as f64 / total as f64 >= 0.5 {
                    flags.push(FiredFlag { flag_code: FlagCode::CommittedAtRisk, priority: FlagPriority::High, description: "Committed objective behind ≥50% of cycle.".into() });
                }
            }
        }
    }
    if let Some(d) = s.pace_deviation_percent { if d <= -50.0 {
        flags.push(FiredFlag { flag_code: FlagCode::PaceCollapse, priority: FlagPriority::High, description: format!("Pace deviation {d}%.") });
    }}
    if let (Some(prev), Some(cur)) = (c.previous_confidence_decile, s.confidence_decile) { if prev - cur >= 3 {
        flags.push(FiredFlag { flag_code: FlagCode::ConfidenceCollapse, priority: FlagPriority::Medium, description: format!("Confidence dropped {} deciles.", prev - cur) });
    }}
    if let (Some(checked), Some(start), Some(end)) = (c.checked_in_at.as_ref(), c.cycle_start_date.as_ref(), c.cycle_end_date.as_ref()) {
        if let (Ok(since), Ok(total)) = (days_between(checked, &a.now), days_between(start, end)) {
            let threshold = std::cmp::max(14, (total as f64 * 0.25).round() as i64);
            if since > threshold {
                flags.push(FiredFlag { flag_code: FlagCode::StaleCheckIn, priority: FlagPriority::Medium, description: format!("{since} days since last check-in (threshold {threshold}).") });
            }
        }
    }
    if let Some(status) = c.parent_objective_status.as_deref() {
        if matches!(status, "retired" | "cancelled" | "missed") {
            flags.push(FiredFlag { flag_code: FlagCode::CascadingBroken, priority: FlagPriority::Medium, description: format!("Parent is {status}.") });
        }
    }
    if a.key_results.len() > 5 {
        flags.push(FiredFlag { flag_code: FlagCode::OverScoped, priority: FlagPriority::Low, description: format!("{} KRs — exceeds cap.", a.key_results.len()) });
    }
    if let (Some(3), Some(p)) = (s.stretch_tier, s.progress_percent) { if p >= 70.0 {
        flags.push(FiredFlag { flag_code: FlagCode::MoonshotProgress, priority: FlagPriority::Low, description: format!("Moonshot at {p}% — recognise.") });
    }}
    flags
}

fn days_between(a: &str, b: &str) -> Result<i64, ()> {
    fn parse(s: &str) -> Result<i64, ()> {
        // Accept ISO date 'YYYY-MM-DD' or full 'YYYY-MM-DDThh:mm:ssZ'.
        let date_part = &s[..10];
        let mut it = date_part.split('-');
        let y: i64 = it.next().ok_or(())?.parse().map_err(|_| ())?;
        let m: i64 = it.next().ok_or(())?.parse().map_err(|_| ())?;
        let d: i64 = it.next().ok_or(())?.parse().map_err(|_| ())?;
        Ok(julian_day(y, m, d))
    }
    Ok(parse(b)? - parse(a)?)
}

// Fliegel-Van Flandern Julian Day Number (no chrono dep needed).
fn julian_day(y: i64, m: i64, d: i64) -> i64 {
    let a = (14 - m) / 12;
    let yy = y + 4800 - a;
    let mm = m + 12 * a - 3;
    d + (153 * mm + 2) / 5 + 365 * yy + yy / 4 - yy / 100 + yy / 400 - 32045
}
