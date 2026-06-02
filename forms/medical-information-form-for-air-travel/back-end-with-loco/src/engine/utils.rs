use chrono::{NaiveDate, Utc};

/// Priority order for the max-grade engine. Worst band wins.
pub fn band_rank(band: &str) -> u8 {
    match band {
        "fit" => 0,
        "fit-with-conditions" => 1,
        "requires-review" => 2,
        "unfit-to-fly" => 3,
        _ => 0,
    }
}

/// Return the worse-of-two bands.
pub fn worse_band(a: &str, b: &str) -> String {
    if band_rank(a) >= band_rank(b) {
        a.to_string()
    } else {
        b.to_string()
    }
}

pub fn band_label(band: &str) -> String {
    match band {
        "fit" => "Fit to fly".to_string(),
        "fit-with-conditions" => "Fit with conditions".to_string(),
        "requires-review" => "Requires airline-medical-desk review".to_string(),
        "unfit-to-fly" => "Unfit to fly".to_string(),
        _ => format!("Band: {band}"),
    }
}

pub fn desk_recommendation(band: &str) -> String {
    match band {
        "fit" => "Proceed; no medical clearance needed beyond this form.".to_string(),
        "fit-with-conditions" =>
            "Clear with documented conditions (oxygen flow rate, seat allocation, etc.).".to_string(),
        "requires-review" =>
            "Submit to airline medical desk; senior physician review required.".to_string(),
        "unfit-to-fly" =>
            "Do not fly until reassessed by the treating physician.".to_string(),
        _ => String::new(),
    }
}

/// Days between an ISO yyyy-mm-dd string and today (UTC); None if not parseable.
pub fn days_ago(iso_date: &str) -> Option<i64> {
    if iso_date.trim().is_empty() {
        return None;
    }
    let trimmed = iso_date.trim();
    // Allow both 'YYYY-MM-DD' and 'YYYY-MM-DDTHH:MM' forms by trimming time.
    let date_part = trimmed.split('T').next().unwrap_or(trimmed);
    let then = NaiveDate::parse_from_str(date_part, "%Y-%m-%d").ok()?;
    let now = Utc::now().date_naive();
    Some((now - then).num_days())
}

/// Add N days to today's ISO date (YYYY-MM-DD).
pub fn iso_today_plus(offset_days: i64) -> String {
    let d = Utc::now().date_naive() + chrono::Duration::days(offset_days);
    d.format("%Y-%m-%d").to_string()
}
