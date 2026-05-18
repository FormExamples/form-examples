use serde::Serialize;
use std::collections::HashMap;

const VALID: &[&str] = &[
    "optimising",
    "mature",
    "developing",
    "initial",
    "ad-hoc",
    "insufficient-data",
];
const HIGH: &[&str] = &["optimising", "mature"];

fn coerce_maturity(s: &str) -> String {
    if VALID.contains(&s) { s.to_string() } else { "insufficient-data".to_string() }
}

fn is_high(s: &str) -> bool {
    HIGH.contains(&s)
}

pub fn quadrant_for(principles: &str, behaviour: &str) -> &'static str {
    if principles == "insufficient-data" || behaviour == "insufficient-data" {
        return "insufficient-data";
    }
    let p = is_high(principles);
    let b = is_high(behaviour);
    match (p, b) {
        (true, true) => "healthy-adoption",
        (true, false) => "aspirational-gap",
        (false, true) => "cargo-cult",
        (false, false) => "pre-agile",
    }
}

pub fn quadrant_label(q: &str) -> &'static str {
    match q {
        "healthy-adoption" => "Healthy adoption",
        "aspirational-gap" => "Aspirational gap",
        "cargo-cult" => "Cargo-cult agile",
        "pre-agile" => "Pre-agile / waterfall",
        _ => "Insufficient data",
    }
}

pub fn quadrant_description(q: &str) -> &'static str {
    match q {
        "healthy-adoption" => "Believes in agile and acts on it. Coaching focuses on the few weak spots.",
        "aspirational-gap" => "Says it values agility but the day-to-day reality is different. Most common failure mode.",
        "cargo-cult" => "Does the rituals but doesn’t believe the principles. Address the why before adding more what.",
        "pre-agile" => "Honest about being non-agile. Decide whether agility is the right fit before investing.",
        _ => "At least one form has too few answers to classify the team.",
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SisterRow {
    pub team: String,
    pub organisation: String,
    pub date: String,
    pub maturity: String,
    pub score: Option<f64>,
    pub score_display: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ComparisonPair {
    pub team: String,
    pub organisation: String,
    pub principles: Option<SisterRow>,
    pub behaviour: Option<SisterRow>,
    pub quadrant: String,
    pub quadrant_label: String,
    pub quadrant_description: String,
    pub spark_x: Option<f64>,
    pub spark_y: Option<f64>,
    pub spark_color: String,
}

/// RFC4180-ish: handles "quoted,values" and ""escaped"" quotes plus CRLF.
fn parse_csv(text: &str) -> Vec<Vec<String>> {
    let mut out: Vec<Vec<String>> = Vec::new();
    let mut row: Vec<String> = Vec::new();
    let mut field = String::new();
    let mut in_quotes = false;
    let bytes: Vec<char> = text.chars().collect();
    let mut i = 0;
    while i < bytes.len() {
        let c = bytes[i];
        if in_quotes {
            if c == '"' {
                if i + 1 < bytes.len() && bytes[i + 1] == '"' {
                    field.push('"');
                    i += 1;
                } else {
                    in_quotes = false;
                }
            } else {
                field.push(c);
            }
        } else if c == '"' {
            in_quotes = true;
        } else if c == ',' {
            row.push(std::mem::take(&mut field));
        } else if c == '\n' {
            row.push(std::mem::take(&mut field));
            out.push(std::mem::take(&mut row));
        } else if c == '\r' {
            // skip
        } else {
            field.push(c);
        }
        i += 1;
    }
    if !field.is_empty() || !row.is_empty() {
        row.push(std::mem::take(&mut field));
        out.push(std::mem::take(&mut row));
    }
    out.into_iter()
        .filter(|r| r.len() > 1 || (r.len() == 1 && !r[0].is_empty()))
        .collect()
}

pub fn read_sister_csv(text: &str) -> Result<Vec<SisterRow>, String> {
    let rows = parse_csv(text);
    if rows.is_empty() {
        return Err("empty CSV".to_string());
    }
    let headers: Vec<String> = rows[0].iter().map(|h| h.trim().to_string()).collect();
    let idx: HashMap<&str, usize> = headers
        .iter()
        .enumerate()
        .map(|(i, h)| (h.as_str(), i))
        .collect();
    for required in &["team", "organisation", "maturity"] {
        if !idx.contains_key(required) {
            return Err(format!("missing required column: {required}"));
        }
    }
    let date_idx = idx.get("date").copied();
    let mean_idx = idx.get("meanScore").copied();
    let overall_idx = idx.get("overallPercent").copied();
    let team_idx = idx["team"];
    let org_idx = idx["organisation"];
    let maturity_idx = idx["maturity"];

    let out: Vec<SisterRow> = rows
        .iter()
        .skip(1)
        .map(|row| {
            let team = row.get(team_idx).cloned().unwrap_or_default().trim().to_string();
            let organisation = row.get(org_idx).cloned().unwrap_or_default().trim().to_string();
            let date = date_idx
                .and_then(|i| row.get(i))
                .cloned()
                .unwrap_or_default()
                .trim()
                .to_string();
            let raw_maturity = row.get(maturity_idx).cloned().unwrap_or_default();
            let maturity = coerce_maturity(raw_maturity.trim());
            let (score, score_display) = if let Some(i) = mean_idx
                && let Some(v) = row.get(i)
                && !v.is_empty()
                && let Ok(n) = v.parse::<f64>()
            {
                (Some(n), format!("{n:.2}"))
            } else if let Some(i) = overall_idx
                && let Some(v) = row.get(i)
                && !v.is_empty()
                && let Ok(n) = v.parse::<f64>()
            {
                (Some(n), format!("{}%", n.round() as i64))
            } else {
                (None, "—".to_string())
            };
            SisterRow {
                team,
                organisation,
                date,
                maturity,
                score,
                score_display,
            }
        })
        .collect();
    Ok(out)
}

fn latest_by_team(rows: Vec<SisterRow>) -> HashMap<String, SisterRow> {
    let mut map: HashMap<String, SisterRow> = HashMap::new();
    for r in rows {
        let key = format!("{}\u{0}{}", r.team, r.organisation);
        match map.get(&key) {
            Some(prior) if prior.date >= r.date => {}
            _ => {
                map.insert(key, r);
            }
        }
    }
    map
}

fn spark_color(q: &str) -> &'static str {
    match q {
        "healthy-adoption" => "#15803d",
        "aspirational-gap" => "#ca8a04",
        "cargo-cult" => "#ea580c",
        "pre-agile" => "#dc2626",
        _ => "#94a3b8",
    }
}

pub fn pair_submissions(
    principles_rows: Vec<SisterRow>,
    behaviour_rows: Vec<SisterRow>,
) -> Vec<ComparisonPair> {
    let principles = latest_by_team(principles_rows);
    let behaviour = latest_by_team(behaviour_rows);
    let mut keys: Vec<String> = principles
        .keys()
        .chain(behaviour.keys())
        .cloned()
        .collect::<std::collections::HashSet<String>>()
        .into_iter()
        .collect();
    keys.sort();
    let mut out: Vec<ComparisonPair> = keys
        .into_iter()
        .map(|key| {
            let p = principles.get(&key).cloned();
            let b = behaviour.get(&key).cloned();
            let sample = p.clone().or_else(|| b.clone()).unwrap();
            let q = match (&p, &b) {
                (Some(p), Some(b)) => quadrant_for(&p.maturity, &b.maturity).to_string(),
                _ => "insufficient-data".to_string(),
            };
            let (sx, sy) = match (&p, &b) {
                (Some(p), Some(b)) => {
                    if let (Some(ps), Some(bs)) = (p.score, b.score) {
                        let x = ((ps - 1.0) / 4.0 * 100.0).clamp(0.0, 100.0);
                        let y = bs.clamp(0.0, 100.0);
                        (Some(x), Some(y))
                    } else {
                        (None, None)
                    }
                }
                _ => (None, None),
            };
            ComparisonPair {
                team: sample.team,
                organisation: sample.organisation,
                principles: p,
                behaviour: b,
                quadrant: q.clone(),
                quadrant_label: quadrant_label(&q).to_string(),
                quadrant_description: quadrant_description(&q).to_string(),
                spark_x: sx,
                spark_y: sy,
                spark_color: spark_color(&q).to_string(),
            }
        })
        .collect();
    out.sort_by(|a, b| {
        a.team
            .cmp(&b.team)
            .then_with(|| a.organisation.cmp(&b.organisation))
    });
    out
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Totals {
    pub healthy_adoption: usize,
    pub aspirational_gap: usize,
    pub cargo_cult: usize,
    pub pre_agile: usize,
    pub insufficient_data: usize,
}

pub fn totals(pairs: &[ComparisonPair]) -> Totals {
    let mut t = Totals {
        healthy_adoption: 0,
        aspirational_gap: 0,
        cargo_cult: 0,
        pre_agile: 0,
        insufficient_data: 0,
    };
    for p in pairs {
        match p.quadrant.as_str() {
            "healthy-adoption" => t.healthy_adoption += 1,
            "aspirational-gap" => t.aspirational_gap += 1,
            "cargo-cult" => t.cargo_cult += 1,
            "pre-agile" => t.pre_agile += 1,
            _ => t.insufficient_data += 1,
        }
    }
    t
}

#[cfg(test)]
mod tests {
    use super::*;

    fn r(team: &str, date: &str, maturity: &str, score: f64) -> SisterRow {
        SisterRow {
            team: team.into(),
            organisation: "Acme".into(),
            date: date.into(),
            maturity: maturity.into(),
            score: Some(score),
            score_display: format!("{score:.2}"),
        }
    }

    #[test]
    fn classifies_four_quadrants() {
        assert_eq!(quadrant_for("mature", "mature"), "healthy-adoption");
        assert_eq!(quadrant_for("mature", "initial"), "aspirational-gap");
        assert_eq!(quadrant_for("initial", "mature"), "cargo-cult");
        assert_eq!(quadrant_for("initial", "initial"), "pre-agile");
        assert_eq!(quadrant_for("insufficient-data", "mature"), "insufficient-data");
    }

    #[test]
    fn reads_principles_csv() {
        let csv = "id,date,respondent,role,team,organisation,answered,meanScore,maturity,weakPrinciples,flags\n\
                   A1,2026-01-01,Alice,scrum-master,Aurora,Acme,12,4.25,mature,,\n";
        let rows = read_sister_csv(csv).unwrap();
        assert_eq!(rows.len(), 1);
        assert_eq!(rows[0].team, "Aurora");
        assert_eq!(rows[0].score, Some(4.25));
        assert_eq!(rows[0].score_display, "4.25");
    }

    #[test]
    fn reads_checklist_csv() {
        let csv = "id,date,team,organisation,answered,overallPercent,maturity\n\
                   B1,2026-01-01,Aurora,Acme,57,85,mature\n";
        let rows = read_sister_csv(csv).unwrap();
        assert_eq!(rows[0].score, Some(85.0));
        assert_eq!(rows[0].score_display, "85%");
    }

    #[test]
    fn missing_column_errors() {
        let err = read_sister_csv("foo,bar\n1,2").unwrap_err();
        assert!(err.contains("required column"));
    }

    #[test]
    fn pairs_by_team() {
        let pairs = pair_submissions(
            vec![r("Aurora", "2026-01-01", "mature", 4.0)],
            vec![r("Aurora", "2026-01-01", "developing", 60.0)],
        );
        assert_eq!(pairs.len(), 1);
        assert_eq!(pairs[0].quadrant, "aspirational-gap");
    }

    #[test]
    fn unpaired_team_is_insufficient_data() {
        let pairs = pair_submissions(
            vec![r("Aurora", "2026-01-01", "mature", 4.0), r("Borealis", "2026-01-01", "mature", 4.0)],
            vec![r("Aurora", "2026-01-01", "developing", 60.0)],
        );
        let borealis = pairs.iter().find(|p| p.team == "Borealis").unwrap();
        assert!(borealis.behaviour.is_none());
        assert_eq!(borealis.quadrant, "insufficient-data");
    }

    #[test]
    fn latest_date_wins() {
        let pairs = pair_submissions(
            vec![
                r("Aurora", "2025-01-01", "initial", 2.0),
                r("Aurora", "2026-05-01", "mature", 4.5),
            ],
            vec![r("Aurora", "2026-05-01", "mature", 85.0)],
        );
        assert_eq!(pairs[0].principles.as_ref().unwrap().date, "2026-05-01");
        assert_eq!(pairs[0].quadrant, "healthy-adoption");
    }
}
