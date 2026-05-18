//! Validation engine for the WHO International Certificate of Vaccination
//! or Prophylaxis (ICVP). Mirrors the TypeScript engine in
//! `front-end-form-with-svelte/src/lib/engine/validation-rules.ts`.

use chrono::{Datelike, Duration, NaiveDate, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Severity {
    Error,
    Warning,
    Info,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub code: String,
    pub severity: Severity,
    pub message: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Certificate {
    pub primary_language_as_bcp_47: String,
    pub secondary_language_as_bcp_47: String,
    pub declared_pregnancy: String,
    pub declared_breastfeeding: String,
    pub declared_immunosuppression: String,
    pub patient_birth_date: Option<NaiveDate>,
    pub entries: Vec<Entry>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub disease: String,
    pub vaccination_date: Option<NaiveDate>,
    pub manufacturer: String,
    pub batch_number: String,
    pub administering_clinician_signature_data_url: String,
    pub centre_stamp_image_data_url: String,
    pub validity_starts_on: Option<NaiveDate>,
    pub validity_ends_on: Option<NaiveDate>,
    pub validity_is_lifetime: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ValidationReport {
    pub overall_valid: bool,
    pub fired_rules: Vec<FiredRule>,
}

fn fire(code: &str, severity: Severity, message: impl Into<String>) -> FiredRule {
    FiredRule {
        code: code.to_string(),
        severity,
        message: message.into(),
    }
}

pub fn validate_certificate(cert: &Certificate) -> ValidationReport {
    let mut fired = Vec::new();
    let today = Utc::now().date_naive();

    // VAL012 — primary + secondary language must include English or French.
    let langs = [
        cert.primary_language_as_bcp_47.as_str(),
        cert.secondary_language_as_bcp_47.as_str(),
    ];
    let has_en_or_fr = langs
        .iter()
        .any(|l| l.starts_with("en") || l.starts_with("fr"));
    if !has_en_or_fr {
        fired.push(fire(
            "VAL012",
            Severity::Error,
            "Certificate languages must include English or French (IHR Annex 6).",
        ));
    }

    for (idx, entry) in cert.entries.iter().enumerate() {
        let label = format!("entry {}", idx + 1);

        // VAL001 — vaccination date not in the future
        if let Some(d) = entry.vaccination_date {
            if d > today {
                fired.push(fire(
                    "VAL001",
                    Severity::Error,
                    format!("{}: vaccination date is in the future.", label),
                ));
            }
        }

        // VAL002 — validity start >= vaccination date
        if let (Some(vd), Some(vs)) = (entry.vaccination_date, entry.validity_starts_on) {
            if vs < vd {
                fired.push(fire(
                    "VAL002",
                    Severity::Error,
                    format!("{}: validity start is before vaccination date.", label),
                ));
            }
        }

        // VAL003 — yellow fever validity start = vaccination + 10 days
        if entry.disease == "yellow-fever" {
            if let (Some(vd), Some(vs)) = (entry.vaccination_date, entry.validity_starts_on) {
                if vs != vd + Duration::days(10) {
                    fired.push(fire(
                        "VAL003",
                        Severity::Error,
                        format!(
                            "{}: yellow-fever validity start must be vaccination date + 10 days.",
                            label
                        ),
                    ));
                }
            }
        }

        // VAL004 — yellow fever validity end overridden to lifetime when blank
        if entry.disease == "yellow-fever"
            && entry.validity_ends_on.is_none()
            && entry.validity_is_lifetime != "yes"
        {
            fired.push(fire(
                "VAL004",
                Severity::Warning,
                format!(
                    "{}: yellow-fever validity end is overridden to lifetime per 2016 IHR amendment.",
                    label
                ),
            ));
        }

        // VAL005 — manufacturer and batch number both required
        if entry.manufacturer.is_empty() || entry.batch_number.is_empty() {
            fired.push(fire(
                "VAL005",
                Severity::Error,
                format!("{}: manufacturer and batch number are required.", label),
            ));
        }

        // VAL006 — clinician signature must be present
        if entry.administering_clinician_signature_data_url.is_empty() {
            fired.push(fire(
                "VAL006",
                Severity::Error,
                format!(
                    "{}: supervising clinician handwritten signature is required.",
                    label
                ),
            ));
        }

        // VAL007 — centre stamp must be present
        if entry.centre_stamp_image_data_url.is_empty() {
            fired.push(fire(
                "VAL007",
                Severity::Error,
                format!("{}: official centre stamp is required.", label),
            ));
        }

        // VAL008 / VAL009 — yellow fever age window (9 months .. 60 years)
        if entry.disease == "yellow-fever" {
            if let (Some(b), Some(v)) = (cert.patient_birth_date, entry.vaccination_date) {
                let months = (v.year() - b.year()) as i64 * 12
                    + (v.month() as i64 - b.month() as i64);
                if months < 9 {
                    fired.push(fire(
                        "VAL008",
                        Severity::Warning,
                        format!(
                            "{}: vaccinee is younger than 9 months; yellow-fever vaccination is contraindicated.",
                            label
                        ),
                    ));
                }
                let years = months / 12;
                if years > 60 {
                    fired.push(fire(
                        "VAL009",
                        Severity::Warning,
                        format!(
                            "{}: vaccinee is older than 60 years; yellow-fever vaccination needs clinician review.",
                            label
                        ),
                    ));
                }
            }
        }
    }

    // VAL010 — declared pregnancy/breastfeeding
    if cert.declared_pregnancy == "yes" || cert.declared_breastfeeding == "yes" {
        fired.push(fire(
            "VAL010",
            Severity::Warning,
            "Vaccinee declared pregnancy or breastfeeding; yellow-fever vaccination is contraindicated.",
        ));
    }

    // VAL011 — declared immunosuppression
    if cert.declared_immunosuppression == "yes" {
        fired.push(fire(
            "VAL011",
            Severity::Warning,
            "Vaccinee declared immunosuppression; yellow-fever vaccination is contraindicated.",
        ));
    }

    let overall_valid = fired
        .iter()
        .all(|r| r.severity != Severity::Error);

    ValidationReport {
        overall_valid,
        fired_rules: fired,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::NaiveDate;

    fn yellow_fever_entry(date: NaiveDate) -> Entry {
        Entry {
            disease: "yellow-fever".into(),
            vaccination_date: Some(date),
            manufacturer: "Sanofi".into(),
            batch_number: "YF-2026-001".into(),
            administering_clinician_signature_data_url: "data:image/png;base64,abc".into(),
            centre_stamp_image_data_url: "data:image/png;base64,xyz".into(),
            validity_starts_on: Some(date + Duration::days(10)),
            validity_ends_on: None,
            validity_is_lifetime: "yes".into(),
        }
    }

    fn cert_with(entry: Entry) -> Certificate {
        Certificate {
            primary_language_as_bcp_47: "en".into(),
            secondary_language_as_bcp_47: "fr".into(),
            patient_birth_date: Some(NaiveDate::from_ymd_opt(1990, 1, 1).unwrap()),
            entries: vec![entry],
            ..Default::default()
        }
    }

    #[test]
    fn valid_yellow_fever_passes() {
        let date = NaiveDate::from_ymd_opt(2026, 1, 1).unwrap();
        let report = validate_certificate(&cert_with(yellow_fever_entry(date)));
        assert!(report.overall_valid, "got: {:?}", report.fired_rules);
    }

    #[test]
    fn future_vaccination_date_fires_val001() {
        let future = Utc::now().date_naive() + Duration::days(30);
        let report = validate_certificate(&cert_with(yellow_fever_entry(future)));
        assert!(report.fired_rules.iter().any(|r| r.code == "VAL001"));
    }

    #[test]
    fn wrong_validity_start_fires_val003() {
        let date = NaiveDate::from_ymd_opt(2026, 1, 1).unwrap();
        let mut entry = yellow_fever_entry(date);
        entry.validity_starts_on = Some(date + Duration::days(7));
        let report = validate_certificate(&cert_with(entry));
        assert!(report.fired_rules.iter().any(|r| r.code == "VAL003"));
    }

    #[test]
    fn missing_manufacturer_fires_val005() {
        let date = NaiveDate::from_ymd_opt(2026, 1, 1).unwrap();
        let mut entry = yellow_fever_entry(date);
        entry.manufacturer = String::new();
        let report = validate_certificate(&cert_with(entry));
        assert!(report.fired_rules.iter().any(|r| r.code == "VAL005"));
    }

    #[test]
    fn missing_signature_fires_val006() {
        let date = NaiveDate::from_ymd_opt(2026, 1, 1).unwrap();
        let mut entry = yellow_fever_entry(date);
        entry.administering_clinician_signature_data_url = String::new();
        let report = validate_certificate(&cert_with(entry));
        assert!(report.fired_rules.iter().any(|r| r.code == "VAL006"));
    }

    #[test]
    fn missing_stamp_fires_val007() {
        let date = NaiveDate::from_ymd_opt(2026, 1, 1).unwrap();
        let mut entry = yellow_fever_entry(date);
        entry.centre_stamp_image_data_url = String::new();
        let report = validate_certificate(&cert_with(entry));
        assert!(report.fired_rules.iter().any(|r| r.code == "VAL007"));
    }

    #[test]
    fn declared_pregnancy_fires_val010() {
        let date = NaiveDate::from_ymd_opt(2026, 1, 1).unwrap();
        let mut cert = cert_with(yellow_fever_entry(date));
        cert.declared_pregnancy = "yes".into();
        let report = validate_certificate(&cert);
        assert!(report.fired_rules.iter().any(|r| r.code == "VAL010"));
    }

    #[test]
    fn english_french_required_val012() {
        let date = NaiveDate::from_ymd_opt(2026, 1, 1).unwrap();
        let mut cert = cert_with(yellow_fever_entry(date));
        cert.primary_language_as_bcp_47 = "es".into();
        cert.secondary_language_as_bcp_47 = "pt".into();
        let report = validate_certificate(&cert);
        assert!(report.fired_rules.iter().any(|r| r.code == "VAL012"));
    }
}
