use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ChecklistRow {
    pub id: &'static str,
    pub date: &'static str,
    pub respondent: &'static str,
    pub role: &'static str,
    pub team: &'static str,
    pub organisation: &'static str,
    pub answered: u8,
    pub teams_percent: Option<u8>,
    pub stakeholders_percent: Option<u8>,
    pub practices_percent: Option<u8>,
    pub overall_percent: Option<u8>,
    pub maturity: &'static str,
    pub maturity_class: &'static str,
    pub weak_sections: Vec<&'static str>,
    pub flags: Vec<&'static str>,
    pub is_anonymous: bool,
}

const fn row(
    id: &'static str,
    date: &'static str,
    respondent: &'static str,
    role: &'static str,
    team: &'static str,
    org: &'static str,
    answered: u8,
    teams: Option<u8>,
    stakeholders: Option<u8>,
    practices: Option<u8>,
    overall: Option<u8>,
    maturity: &'static str,
    weak: &'static [&'static str],
    flags: &'static [&'static str],
    anonymous: bool,
) -> RowSeed {
    RowSeed {
        id,
        date,
        respondent,
        role,
        team,
        organisation: org,
        answered,
        teams_percent: teams,
        stakeholders_percent: stakeholders,
        practices_percent: practices,
        overall_percent: overall,
        maturity,
        weak_sections: weak,
        flags,
        is_anonymous: anonymous,
    }
}

struct RowSeed {
    id: &'static str,
    date: &'static str,
    respondent: &'static str,
    role: &'static str,
    team: &'static str,
    organisation: &'static str,
    answered: u8,
    teams_percent: Option<u8>,
    stakeholders_percent: Option<u8>,
    practices_percent: Option<u8>,
    overall_percent: Option<u8>,
    maturity: &'static str,
    weak_sections: &'static [&'static str],
    flags: &'static [&'static str],
    is_anonymous: bool,
}

static SEEDS: &[RowSeed] = &[
    row("C001", "2025-07-15", "Alice Hopper", "scrum-master", "Aurora", "Acme Engineering", 57, Some(72), Some(64), Some(56), Some(64), "developing", &["Practices"], &["finished-work-risk"], false),
    row("C002", "2025-10-15", "Alice Hopper", "scrum-master", "Aurora", "Acme Engineering", 57, Some(80), Some(71), Some(67), Some(73), "developing", &[], &[], false),
    row("C003", "2026-01-15", "Alice Hopper", "scrum-master", "Aurora", "Acme Engineering", 57, Some(88), Some(79), Some(78), Some(82), "mature", &[], &[], false),
    row("C004", "2026-04-12", "Alice Hopper", "scrum-master", "Aurora", "Acme Engineering", 57, Some(96), Some(86), Some(89), Some(90), "optimising", &[], &[], false),
    row("C005", "2025-10-13", "Ben Carter", "engineering-manager", "Borealis", "Acme Engineering", 57, Some(80), Some(79), Some(72), Some(77), "mature", &[], &[], false),
    row("C006", "2026-01-13", "Ben Carter", "engineering-manager", "Borealis", "Acme Engineering", 57, Some(80), Some(79), Some(72), Some(77), "mature", &[], &[], false),
    row("C007", "2026-04-13", "Ben Carter", "engineering-manager", "Borealis", "Acme Engineering", 57, Some(84), Some(79), Some(72), Some(78), "mature", &[], &[], false),
    row("C008", "2025-10-15", "Chris Diaz", "product-owner", "Cygnus", "Acme Engineering", 57, Some(84), Some(71), Some(78), Some(78), "mature", &[], &[], false),
    row("C009", "2026-01-15", "Chris Diaz", "product-owner", "Cygnus", "Acme Engineering", 57, Some(76), Some(57), Some(67), Some(67), "developing", &[], &[], false),
    row("C010", "2026-04-15", "Chris Diaz", "product-owner", "Cygnus", "Acme Engineering", 57, Some(68), Some(43), Some(50), Some(54), "developing", &["Stakeholders"], &["stakeholders-trust-risk"], false),
    row("C011", "2026-01-16", "Dana Patel", "agile-coach", "Draco", "Acme Engineering", 57, Some(60), Some(29), Some(44), Some(44), "initial", &["Stakeholders", "Practices"], &["stakeholders-trust-risk", "practices-discipline-risk", "experimentation-blocked"], false),
    row("C012", "2026-04-16", "Dana Patel", "agile-coach", "Draco", "Acme Engineering", 57, Some(52), Some(21), Some(39), Some(37), "initial", &["Stakeholders", "Practices"], &["stakeholders-trust-risk", "practices-discipline-risk", "experimentation-blocked", "psychological-safety-risk"], false),
    row("C013", "2026-04-17", "Eli Singh", "team-member", "Eridanus", "Acme Engineering", 57, Some(32), Some(14), Some(22), Some(23), "ad-hoc", &["Teams", "Stakeholders", "Practices"], &["teams-autonomy-risk", "stakeholders-trust-risk", "practices-discipline-risk", "finished-work-risk", "experimentation-blocked", "psychological-safety-risk"], false),
    row("C013b", "2026-04-19", "Anonymous", "", "Eridanus", "Acme Engineering", 57, Some(36), Some(21), Some(28), Some(28), "initial", &["Teams", "Stakeholders", "Practices"], &["teams-autonomy-risk", "psychological-safety-risk"], true),
    row("C014", "2026-04-18", "Farah Lopez", "team-lead", "Fornax", "Acme Engineering", 18, Some(75), None, None, None, "insufficient-data", &[], &["insufficient-data"], false),
];

pub fn sample_rows() -> Vec<ChecklistRow> {
    SEEDS
        .iter()
        .map(|s| ChecklistRow {
            id: s.id,
            date: s.date,
            respondent: s.respondent,
            role: s.role,
            team: s.team,
            organisation: s.organisation,
            answered: s.answered,
            teams_percent: s.teams_percent,
            stakeholders_percent: s.stakeholders_percent,
            practices_percent: s.practices_percent,
            overall_percent: s.overall_percent,
            maturity: s.maturity,
            maturity_class: s.maturity,
            weak_sections: s.weak_sections.to_vec(),
            flags: s.flags.to_vec(),
            is_anonymous: s.is_anonymous,
        })
        .collect()
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TrendPoint {
    pub date: &'static str,
    pub overall_percent: u8,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamAggregate {
    pub team: &'static str,
    pub organisation: &'static str,
    pub count: usize,
    pub mean_of_means: Option<f64>,
    pub maturity: &'static str,
    pub maturity_class: &'static str,
    pub top_flags: Vec<&'static str>,
    pub trend: Vec<TrendPoint>,
    pub spark_path: Option<String>,
    pub spark_last_x: f64,
    pub spark_last_y: f64,
    pub spark_color: &'static str,
}

fn derive_maturity(overall: Option<f64>) -> &'static str {
    match overall {
        None => "insufficient-data",
        Some(p) if p >= 90.0 => "optimising",
        Some(p) if p >= 75.0 => "mature",
        Some(p) if p >= 50.0 => "developing",
        Some(p) if p >= 25.0 => "initial",
        Some(_) => "ad-hoc",
    }
}

fn spark_color(m: &str) -> &'static str {
    match m {
        "optimising" => "#15803d",
        "mature" => "#16a34a",
        "developing" => "#ca8a04",
        "initial" => "#ea580c",
        "ad-hoc" => "#dc2626",
        _ => "#94a3b8",
    }
}

fn sparkline_path(trend: &[TrendPoint]) -> Option<(String, f64, f64)> {
    if trend.is_empty() {
        return None;
    }
    let width = 100.0;
    let height = 28.0;
    let padding = 2.0;
    let inner_w = width - padding * 2.0;
    let inner_h = height - padding * 2.0;
    let n = trend.len() as f64;
    let x_step = if trend.len() == 1 { 0.0 } else { inner_w / (n - 1.0) };
    let mut d = String::new();
    let mut last = (0.0, 0.0);
    for (i, p) in trend.iter().enumerate() {
        let x = if trend.len() == 1 {
            padding + inner_w / 2.0
        } else {
            padding + (i as f64) * x_step
        };
        let y = padding + inner_h - (p.overall_percent as f64 / 100.0) * inner_h;
        if i == 0 {
            d.push_str(&format!("M{x},{y}"));
        } else {
            d.push_str(&format!(" L{x},{y}"));
        }
        last = (x, y);
    }
    Some((d, last.0, last.1))
}

pub fn aggregate_by_team(rows: &[ChecklistRow]) -> Vec<TeamAggregate> {
    let mut groups: HashMap<(&'static str, &'static str), Vec<&ChecklistRow>> = HashMap::new();
    for r in rows {
        groups.entry((r.team, r.organisation)).or_default().push(r);
    }
    let mut out: Vec<TeamAggregate> = groups
        .into_iter()
        .map(|((team, org), list)| {
            let scored: Vec<&ChecklistRow> =
                list.iter().filter(|r| r.overall_percent.is_some()).copied().collect();
            let mean_of_means = if scored.is_empty() {
                None
            } else {
                let s: f64 = scored
                    .iter()
                    .map(|r| r.overall_percent.unwrap() as f64)
                    .sum();
                Some((s / scored.len() as f64 * 100.0).round() / 100.0)
            };
            let maturity = derive_maturity(mean_of_means);

            let mut flag_counts: HashMap<&'static str, usize> = HashMap::new();
            for r in &list {
                for f in &r.flags {
                    *flag_counts.entry(*f).or_insert(0) += 1;
                }
            }
            let mut top_flags: Vec<(&'static str, usize)> = flag_counts.into_iter().collect();
            top_flags.sort_by(|a, b| b.1.cmp(&a.1));
            let top_flags: Vec<&'static str> =
                top_flags.into_iter().take(3).map(|(f, _)| f).collect();

            let mut trend: Vec<TrendPoint> = scored
                .iter()
                .map(|r| TrendPoint {
                    date: r.date,
                    overall_percent: r.overall_percent.unwrap(),
                })
                .collect();
            trend.sort_by(|a, b| a.date.cmp(b.date));

            let (path, lx, ly) = match sparkline_path(&trend) {
                Some((d, x, y)) => (Some(d), x, y),
                None => (None, 0.0, 0.0),
            };

            TeamAggregate {
                team,
                organisation: org,
                count: list.len(),
                mean_of_means,
                maturity,
                maturity_class: maturity,
                top_flags,
                trend,
                spark_path: path,
                spark_last_x: lx,
                spark_last_y: ly,
                spark_color: spark_color(maturity),
            }
        })
        .collect();
    out.sort_by(|a, b| a.team.cmp(b.team));
    out
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Totals {
    pub optimising: usize,
    pub mature: usize,
    pub developing: usize,
    pub initial: usize,
    pub ad_hoc: usize,
    pub insufficient_data: usize,
}

pub fn totals(rows: &[ChecklistRow]) -> Totals {
    let mut t = Totals {
        optimising: 0,
        mature: 0,
        developing: 0,
        initial: 0,
        ad_hoc: 0,
        insufficient_data: 0,
    };
    for r in rows {
        match r.maturity {
            "optimising" => t.optimising += 1,
            "mature" => t.mature += 1,
            "developing" => t.developing += 1,
            "initial" => t.initial += 1,
            "ad-hoc" => t.ad_hoc += 1,
            "insufficient-data" => t.insufficient_data += 1,
            _ => {}
        }
    }
    t
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sample_data_has_15_rows() {
        assert_eq!(sample_rows().len(), 15);
    }

    #[test]
    fn aggregates_into_6_teams() {
        let agg = aggregate_by_team(&sample_rows());
        assert_eq!(agg.len(), 6);
        let names: Vec<&str> = agg.iter().map(|t| t.team).collect();
        assert!(names.contains(&"Aurora"));
        assert!(names.contains(&"Fornax"));
    }

    #[test]
    fn fornax_has_no_sparkline_path() {
        let agg = aggregate_by_team(&sample_rows());
        let fornax = agg.iter().find(|t| t.team == "Fornax").unwrap();
        assert!(fornax.spark_path.is_none());
    }

    #[test]
    fn aurora_trend_is_ascending() {
        let agg = aggregate_by_team(&sample_rows());
        let aurora = agg.iter().find(|t| t.team == "Aurora").unwrap();
        let dates: Vec<&str> = aurora.trend.iter().map(|p| p.date).collect();
        let mut sorted = dates.clone();
        sorted.sort();
        assert_eq!(dates, sorted);
    }

    #[test]
    fn totals_match_15_rows() {
        let t = totals(&sample_rows());
        assert_eq!(
            t.optimising + t.mature + t.developing + t.initial + t.ad_hoc + t.insufficient_data,
            15
        );
        assert_eq!(t.optimising, 1);
        assert_eq!(t.mature, 5);
        assert_eq!(t.developing, 4);
        assert_eq!(t.initial, 3);
        assert_eq!(t.ad_hoc, 1);
        assert_eq!(t.insufficient_data, 1);
    }
}
