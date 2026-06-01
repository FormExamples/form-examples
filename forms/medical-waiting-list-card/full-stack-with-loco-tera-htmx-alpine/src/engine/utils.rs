/// Display label for a Waiting Time Status band.
pub fn waiting_time_status_label(band: &str) -> String {
    match band {
        "within-target" => "Within target".to_string(),
        "approaching-breach" => "Approaching breach".to_string(),
        "breached" => "Breached".to_string(),
        "long-wait" => "Long wait (> 52 weeks)".to_string(),
        "" => "Not yet computed".to_string(),
        other => format!("Status: {other}"),
    }
}

/// Display label for a Clinical Priority.
pub fn clinical_priority_label(priority: &str) -> String {
    match priority {
        "P1a" => "P1a — Emergency (24 hours)".to_string(),
        "P1b" => "P1b — Urgent (72 hours)".to_string(),
        "P2" => "P2 — Cancer / time-critical (4 weeks)".to_string(),
        "P3" => "P3 — Substantial harm risk (12 weeks)".to_string(),
        "P4" => "P4 — Routine (18 weeks, RTT)".to_string(),
        "P5" => "P5 — Deferred (26 weeks)".to_string(),
        "P6" => "P6 — Removed from list".to_string(),
        "" => "Not yet recorded".to_string(),
        other => other.to_string(),
    }
}
