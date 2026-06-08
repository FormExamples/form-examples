//! LP1H validity engine — Rust port of the SvelteKit / static-HTML engines.
//!
//! Rule identifiers (`R-MCA-S9-AGE`, …) are stable across all three
//! implementations so a row in `lpa_validity_fired_rule` is portable.

use chrono::{NaiveDate, Utc};

use crate::types::{
    AdditionalFlag, Attorney, FiredRule, LpaApplication, LpaValidityResult, RuleSeverity,
    Signature, ValidityStatus, ENGINE_VERSION,
};

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

fn parse_date(s: &str) -> Option<NaiveDate> {
    if s.is_empty() {
        return None;
    }
    NaiveDate::parse_from_str(&s[..s.len().min(10)], "%Y-%m-%d").ok()
}

fn age_years_at(birth_date: &str, at_date: &str) -> Option<i32> {
    let dob = parse_date(birth_date)?;
    let at = parse_date(at_date)?;
    let mut years = at.format("%Y").to_string().parse::<i32>().ok()?
        - dob.format("%Y").to_string().parse::<i32>().ok()?;
    if (at.format("%m%d").to_string()) < dob.format("%m%d").to_string() {
        years -= 1;
    }
    Some(years)
}

fn find_signature<'a>(app: &'a LpaApplication, role: &str) -> Option<&'a Signature> {
    app.signatures.iter().find(|s| s.signer_role == role)
}

fn signed_at(sig: &Signature) -> Option<NaiveDate> {
    parse_date(&sig.signed_at)
}

fn signed_before(a: &Signature, b: &Signature) -> bool {
    match (signed_at(a), signed_at(b)) {
        (Some(da), Some(db)) => da <= db,
        _ => false,
    }
}

fn fr(
    rule_id: &str,
    severity: RuleSeverity,
    rule_family: &str,
    source_citation: &str,
    description: String,
    suggested_correction: &str,
) -> FiredRule {
    FiredRule {
        rule_id: rule_id.to_string(),
        severity,
        rule_family: rule_family.to_string(),
        source_citation: source_citation.to_string(),
        description,
        suggested_correction: suggested_correction.to_string(),
    }
}

// ---------------------------------------------------------------------------
// rule families
// ---------------------------------------------------------------------------

fn apply_donor_rules(app: &LpaApplication) -> Vec<FiredRule> {
    let mut out = Vec::new();
    let d = &app.donor;
    let donor_sig = find_signature(app, "donor");
    let signing_date = donor_sig
        .map(|s| s.signed_at.clone())
        .filter(|s| !s.is_empty())
        .or_else(|| Some(d.capacity_declared_at.clone()).filter(|s| !s.is_empty()))
        .unwrap_or_else(|| Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string());

    if !d.birth_date.is_empty() {
        if let Some(age) = age_years_at(&d.birth_date, &signing_date) {
            if age < 18 {
                out.push(fr(
                    "R-MCA-S9-AGE",
                    RuleSeverity::Fatal,
                    "donor",
                    "MCA 2005 s.9(2)(c)",
                    format!("Donor age at signing is {}; must be 18 or older.", age),
                    "The donor must be at least 18 at the date of signing the LPA.",
                ));
            }
        }
    }
    if d.capacity_declared != "yes" {
        out.push(fr(
            "R-MCA-S10-CAP",
            RuleSeverity::Fatal,
            "donor",
            "MCA 2005 s.9(2)(b)",
            "Donor has not declared mental capacity at signing.".to_string(),
            "The donor must confirm they understand the LPA and have capacity at signing.",
        ));
    }
    if d.jurisdiction != "england" && d.jurisdiction != "wales" {
        out.push(fr(
            "R-MCA-DONOR-JURISDICTION",
            RuleSeverity::Fatal,
            "donor",
            "MCA 2005 (extent — England and Wales only)",
            "LP1H applies only to England and Wales; donor jurisdiction must be set.".to_string(),
            "Select England or Wales as the donor jurisdiction.",
        ));
    }
    if d.given_names.is_empty() || d.family_name.is_empty() {
        out.push(fr(
            "R-MCA-DONOR-NAME",
            RuleSeverity::High,
            "donor",
            "LP1H s.1",
            "Donor given names and family name must both be populated.".to_string(),
            "Enter the donor's full legal name.",
        ));
    }
    if d.postal_address_as_full_text.is_empty() {
        out.push(fr(
            "R-MCA-DONOR-ADDRESS",
            RuleSeverity::High,
            "donor",
            "LP1H s.1",
            "Donor postal address is required.".to_string(),
            "Enter the donor's current postal address.",
        ));
    }
    if d.birth_date.is_empty() {
        out.push(fr(
            "R-MCA-DONOR-DOB",
            RuleSeverity::High,
            "donor",
            "LP1H s.1",
            "Donor date of birth is required.".to_string(),
            "Enter the donor's date of birth.",
        ));
    }
    out
}

fn attorney_key(a: &Attorney) -> String {
    format!(
        "{}|{}|{}",
        a.given_names.trim().to_lowercase(),
        a.family_name.trim().to_lowercase(),
        a.birth_date,
    )
}

fn apply_attorney_rules(app: &LpaApplication) -> Vec<FiredRule> {
    let mut out = Vec::new();
    let signing_date = if app.donor.capacity_declared_at.is_empty() {
        Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string()
    } else {
        app.donor.capacity_declared_at.clone()
    };

    if app.attorneys.is_empty() {
        out.push(fr(
            "R-MCA-ATT-COUNT-MIN",
            RuleSeverity::Fatal,
            "attorney",
            "MCA 2005 s.10(1)",
            "At least one attorney must be named.".to_string(),
            "Name 1 to 4 attorneys on LP1H s.2.",
        ));
    }
    if app.attorneys.len() > 4 {
        out.push(fr(
            "R-MCA-ATT-COUNT-MAX",
            RuleSeverity::Fatal,
            "attorney",
            "LP1H s.2",
            format!("Too many attorneys: {}; maximum is 4.", app.attorneys.len()),
            "Reduce the number of attorneys to four or fewer.",
        ));
    }
    if app.replacement_attorneys.len() > 4 {
        out.push(fr(
            "R-MCA-REPL-COUNT-MAX",
            RuleSeverity::Fatal,
            "attorney",
            "LP1H s.4",
            format!(
                "Too many replacement attorneys: {}; maximum is 4.",
                app.replacement_attorneys.len()
            ),
            "Reduce the number of replacement attorneys to four or fewer.",
        ));
    }

    for (idx, a) in app.attorneys.iter().enumerate() {
        if !a.birth_date.is_empty() {
            if let Some(age) = age_years_at(&a.birth_date, &signing_date) {
                if age < 18 {
                    out.push(fr(
                        &format!("R-MCA-ATT-AGE#{}", idx + 1),
                        RuleSeverity::Fatal,
                        "attorney",
                        "MCA 2005 s.10(1)(a)",
                        format!("Attorney #{} is {} years old; must be 18 or older.", idx + 1, age),
                        "All attorneys must be at least 18 years old.",
                    ));
                }
            }
        }
        if a.capacity_declared != "yes" {
            out.push(fr(
                &format!("R-MCA-ATT-CAP#{}", idx + 1),
                RuleSeverity::Fatal,
                "attorney",
                "MCA 2005 s.10(1)(b)",
                format!("Attorney #{} has not declared capacity to act.", idx + 1),
                "Each attorney must confirm they have capacity to act.",
            ));
        }
    }

    let mut seen: std::collections::HashMap<String, Vec<usize>> = std::collections::HashMap::new();
    for (idx, a) in app.attorneys.iter().enumerate() {
        let key = attorney_key(a);
        if key != "||" {
            seen.entry(key).or_default().push(idx + 1);
        }
    }
    for (_, positions) in seen.iter() {
        if positions.len() > 1 {
            let pos_str = positions
                .iter()
                .map(|p| p.to_string())
                .collect::<Vec<_>>()
                .join(", ");
            out.push(fr(
                "R-MCA-ATT-DISTINCT",
                RuleSeverity::Fatal,
                "attorney",
                "LP1H s.2",
                format!("Duplicate attorney appears in positions {}.", pos_str),
                "Each attorney must be listed only once.",
            ));
            break;
        }
    }

    if app.decision_rule.is_empty() {
        out.push(fr(
            "R-MCA-JOINT-CHOICE",
            RuleSeverity::High,
            "attorney",
            "LP1H s.3",
            "The donor must choose how the attorneys decide together.".to_string(),
            "Select jointly, jointly-and-severally, or mixed on LP1H s.3.",
        ));
    }
    if app.decision_rule == "mixed" && app.joint_decision_set.trim().is_empty() {
        out.push(fr(
            "R-MCA-JOINT-MIXED-SCOPE",
            RuleSeverity::High,
            "attorney",
            "LPA Regs 2007 Sch.1",
            "Mixed decision-making was selected without specifying which decisions are joint."
                .to_string(),
            "List the decisions that must be made jointly.",
        ));
    }
    if app.decision_rule == "jointly" && !app.replacement_attorneys.is_empty() {
        out.push(fr(
            "R-MCA-JOINT-COLLAPSE",
            RuleSeverity::Medium,
            "attorney",
            "OPG LP12",
            "Jointly-acting attorneys collapse the whole LPA if any one drops out.".to_string(),
            "Consider jointly-and-severally or mixed if replacements should take over.",
        ));
    }

    out
}

fn apply_certificate_provider_rules(app: &LpaApplication) -> Vec<FiredRule> {
    let mut out = Vec::new();
    let cp = match &app.certificate_provider {
        Some(cp) => cp,
        None => {
            out.push(fr(
                "R-MCA-CP-PRESENT",
                RuleSeverity::Fatal,
                "certificate-provider",
                "LPA Regs 2007 Sch.1 Pt.2",
                "No certificate provider has been linked to this LPA.".to_string(),
                "Nominate an eligible certificate provider on LP1H s.10.",
            ));
            return out;
        }
    };

    if cp.declared_not_family != "yes" {
        out.push(fr(
            "R-MCA-CP-FAM",
            RuleSeverity::Fatal,
            "certificate-provider",
            "LPA Regs 2007 Sch.1 Pt.2",
            "Certificate provider has not declared they are not a family member.".to_string(),
            "Choose someone who is not a family member of donor or attorneys.",
        ));
    }
    if cp.declared_not_employee != "yes" {
        out.push(fr(
            "R-MCA-CP-EMP",
            RuleSeverity::Fatal,
            "certificate-provider",
            "LPA Regs 2007 Sch.1 Pt.2",
            "Certificate provider has not declared they are not a business partner or employee."
                .to_string(),
            "Choose someone with no business connection to donor or attorneys.",
        ));
    }
    if cp.declared_not_attorney != "yes" {
        out.push(fr(
            "R-MCA-CP-ATT",
            RuleSeverity::Fatal,
            "certificate-provider",
            "LPA Regs 2007 Sch.1 Pt.2",
            "Certificate provider has not declared they are not an attorney in this LPA."
                .to_string(),
            "The certificate provider cannot also be an attorney.",
        ));
    }

    match cp.route.as_str() {
        "skill-based" => {
            if cp.profession.is_empty() {
                out.push(fr(
                    "R-MCA-CP-ROUTE",
                    RuleSeverity::Fatal,
                    "certificate-provider",
                    "LPA Regs 2007 Sch.1 Pt.2",
                    "Skill-based certificate provider is missing a registered profession."
                        .to_string(),
                    "Choose the certificate provider's registered profession.",
                ));
            }
            if cp.profession_registration_number.trim().is_empty() {
                out.push(fr(
                    "R-MCA-CP-REGISTRATION",
                    RuleSeverity::High,
                    "certificate-provider",
                    "OPG guidance",
                    "Skill-based certificate provider should record a registration number."
                        .to_string(),
                    "Enter the SRA, GMC, NMC, HCPC, or equivalent registration number.",
                ));
            }
        }
        "knowledge-based" => {
            if cp.years_known_donor.map_or(true, |y| y < 2.0) {
                out.push(fr(
                    "R-MCA-CP-ROUTE",
                    RuleSeverity::Fatal,
                    "certificate-provider",
                    "LPA Regs 2007 Sch.1 Pt.2",
                    "Knowledge-based certificate provider must have known the donor personally for ≥ 2 years."
                        .to_string(),
                    "Confirm 2+ years of personal acquaintance or switch to the skill-based route.",
                ));
            }
        }
        _ => {
            out.push(fr(
                "R-MCA-CP-ROUTE",
                RuleSeverity::Fatal,
                "certificate-provider",
                "LPA Regs 2007 Sch.1 Pt.2",
                "Certificate provider eligibility route has not been set.".to_string(),
                "Select either the skill-based or knowledge-based eligibility route.",
            ));
        }
    }

    out
}

fn apply_signature_order_rules(app: &LpaApplication) -> Vec<FiredRule> {
    let mut out = Vec::new();
    let donor_sig = find_signature(app, "donor");
    let cp_sig = find_signature(app, "certificate-provider");
    let att_sigs: Vec<&Signature> = app
        .signatures
        .iter()
        .filter(|s| s.signer_role == "attorney")
        .collect();

    if donor_sig.map_or(true, |s| signed_at(s).is_none()) {
        out.push(fr(
            "R-MCA-SIG-DONOR",
            RuleSeverity::Fatal,
            "signature-order",
            "LP1H s.9",
            "Donor has not signed the LPA.".to_string(),
            "Capture the donor's signature and dated witness statement on LP1H s.9.",
        ));
    }
    if cp_sig.map_or(true, |s| signed_at(s).is_none()) {
        out.push(fr(
            "R-MCA-SIG-CP",
            RuleSeverity::Fatal,
            "signature-order",
            "LP1H s.10",
            "Certificate provider has not signed the LPA.".to_string(),
            "The certificate provider must sign before the attorneys.",
        ));
    }
    if att_sigs.is_empty() || att_sigs.iter().any(|s| signed_at(s).is_none()) {
        out.push(fr(
            "R-MCA-SIG-ATT-ALL",
            RuleSeverity::Fatal,
            "signature-order",
            "LP1H s.11",
            "Not every named attorney has signed and dated the LPA.".to_string(),
            "Every attorney must sign LP1H s.11 after the donor and certificate provider.",
        ));
    }
    if let (Some(d), Some(c)) = (donor_sig, cp_sig) {
        if !signed_before(d, c) {
            out.push(fr(
                "R-MCA-ORDER-DONOR-FIRST",
                RuleSeverity::Fatal,
                "signature-order",
                "LPA Regs 2007 Sch.1",
                "Donor must sign before the certificate provider.".to_string(),
                "Donor signs first, then certificate provider, then attorneys.",
            ));
        }
    }
    if let Some(c) = cp_sig {
        for a in &att_sigs {
            if !signed_before(c, a) {
                out.push(fr(
                    "R-MCA-ORDER-CP-BEFORE-ATT",
                    RuleSeverity::Fatal,
                    "signature-order",
                    "LPA Regs 2007 Sch.1",
                    "Certificate provider must sign before any attorney.".to_string(),
                    "Ensure the certificate-provider signature precedes every attorney signature.",
                ));
                break;
            }
        }
    }
    if app.signatures.iter().any(|s| s.witness_is_attorney == "yes") {
        out.push(fr(
            "R-MCA-WIT-NOT-ATT",
            RuleSeverity::Fatal,
            "signature-order",
            "LPA Regs 2007 Sch.1",
            "A signature witness must not be an attorney named in this LPA.".to_string(),
            "Choose a witness who is not an attorney.",
        ));
    }
    out
}

fn apply_instruction_rules(app: &LpaApplication) -> Vec<FiredRule> {
    let mut out = Vec::new();

    if app.lst_choice.is_empty() {
        out.push(fr(
            "R-MCA-LST-CHOICE",
            RuleSeverity::Fatal,
            "instruction",
            "MCA 2005 s.11(7)",
            "The donor must select Option A or Option B on life-sustaining treatment.".to_string(),
            "Choose Option A or Option B on LP1H s.5.",
        ));
    } else if app.lst_donor_initialled != "yes" {
        out.push(fr(
            "R-MCA-LST-INITIAL",
            RuleSeverity::Fatal,
            "instruction",
            "LP1H s.5",
            "The donor must personally initial the chosen life-sustaining-treatment option."
                .to_string(),
            "Have the donor initial the Option A or Option B box on LP1H s.5.",
        ));
    }

    for (idx, ins) in app.instructions.iter().enumerate() {
        if !ins.statement.trim().is_empty() && ins.lawfulness_assessed != "yes" {
            out.push(fr(
                &format!("R-MCA-INSTR-LAW#{}", idx + 1),
                RuleSeverity::High,
                "instruction",
                "MCA 2005 s.9(4)",
                format!("Instruction #{} has not been assessed as lawful.", idx + 1),
                "A solicitor or certificate provider should confirm the instruction is lawful.",
            ));
        }
        if ins.contradicts_adrt == "yes" {
            out.push(fr(
                &format!("R-MCA-INSTR-ADRT#{}", idx + 1),
                RuleSeverity::High,
                "instruction",
                "MCA 2005 s.25",
                format!(
                    "Instruction #{} contradicts a known Advance Decision to Refuse Treatment.",
                    idx + 1
                ),
                "Reconcile the LPA instruction with the existing ADRT.",
            ));
        }
    }

    out
}

fn apply_registration_rules(app: &LpaApplication) -> Vec<FiredRule> {
    let mut out = Vec::new();
    let reg = &app.registration;

    if app.people_to_notify.len() > 5 {
        out.push(fr(
            "R-MCA-NOTIFY-MAX",
            RuleSeverity::Fatal,
            "registration",
            "LPA Regs 2007",
            format!(
                "Too many persons to notify: {}; maximum is 5.",
                app.people_to_notify.len()
            ),
            "List no more than five persons to notify on LP1H s.6.",
        ));
    }
    if reg.applicant_role.is_empty() {
        out.push(fr(
            "R-MCA-REG-APPLICANT",
            RuleSeverity::Fatal,
            "registration",
            "LPA Regs 2007 reg.6",
            "The applicant for registration has not been identified.".to_string(),
            "Select whether the donor, one attorney, or all attorneys jointly are applying.",
        ));
    }
    if reg.applicant_signed_at.is_empty() {
        out.push(fr(
            "R-MCA-REG-SIGNED",
            RuleSeverity::Fatal,
            "registration",
            "LPA Regs 2007 reg.6",
            "The applicant has not signed Part C of LP1H.".to_string(),
            "The applicant must sign and date Part C before submission to the OPG.",
        ));
    }
    let remission_covers = reg.fee_remission == "half" || reg.fee_remission == "full-exempt";
    if reg.fee_amount_pounds <= 0.0 && !remission_covers {
        out.push(fr(
            "R-MCA-FEE",
            RuleSeverity::Fatal,
            "registration",
            "LPA Regs 2007 reg.6",
            "No registration fee recorded and no remission or exemption indicated.".to_string(),
            "Record the registration fee (currently £82) or indicate the remission basis.",
        ));
    }
    out
}

fn detect_additional_flags(app: &LpaApplication) -> Vec<AdditionalFlag> {
    let mut out = Vec::new();
    if app.donor.preferred_language == "cy" {
        out.push(AdditionalFlag {
            flag_id: "F-BILINGUAL-001".into(),
            category: "bilingual-donor".into(),
            priority: "low".into(),
            description: "Donor preferred language is Welsh.".into(),
            suggested_action: "Use the Welsh-language LP1H template.".into(),
        });
    }
    if !app.donor.country_as_iso_3166_1_alpha_2.is_empty()
        && app.donor.country_as_iso_3166_1_alpha_2.to_uppercase() != "GB"
    {
        out.push(AdditionalFlag {
            flag_id: "F-FOREIGN-DOMICILE-001".into(),
            category: "foreign-domicile".into(),
            priority: "medium".into(),
            description: "Donor habitual residence appears outside the United Kingdom.".into(),
            suggested_action: "Refer to a solicitor for jurisdictional advice.".into(),
        });
    }
    for (idx, a) in app.attorneys.iter().enumerate() {
        if a.is_bankrupt == "yes" {
            out.push(AdditionalFlag {
                flag_id: format!("F-ATT-BANKRUPT-{}", idx + 1),
                category: "attorney-bankrupt".into(),
                priority: "low".into(),
                description: format!(
                    "Attorney #{} is bankrupt. Bankruptcy bars P&FA LPAs, not H&W.",
                    idx + 1
                ),
                suggested_action: "Inform the attorney that the bar does not apply to H&W LPAs."
                    .into(),
            });
        }
    }
    if app.instructions.iter().any(|i| i.contradicts_adrt == "yes") {
        out.push(AdditionalFlag {
            flag_id: "F-ADRT-CONFLICT-001".into(),
            category: "adrt-conflict".into(),
            priority: "high".into(),
            description:
                "At least one instruction contradicts a known Advance Decision to Refuse Treatment."
                    .into(),
            suggested_action: "Reconcile LPA instructions with the donor's ADRT.".into(),
        });
    }
    out
}

// ---------------------------------------------------------------------------
// composite validator
// ---------------------------------------------------------------------------

fn severity_rank(s: RuleSeverity) -> u8 {
    match s {
        RuleSeverity::Fatal => 4,
        RuleSeverity::High => 3,
        RuleSeverity::Medium => 2,
        RuleSeverity::Informational => 1,
    }
}

fn worst_severity(rules: &[FiredRule]) -> Option<RuleSeverity> {
    rules
        .iter()
        .map(|r| r.severity)
        .max_by_key(|s| severity_rank(*s))
}

fn cascade(worst: Option<RuleSeverity>) -> ValidityStatus {
    match worst {
        Some(RuleSeverity::Fatal) => ValidityStatus::Invalid,
        Some(RuleSeverity::High) => ValidityStatus::NeedsCorrection,
        _ => ValidityStatus::ReadyToRegister,
    }
}

const REQUIRED_FIELD_COUNT: u32 = 18;

fn count_populated_required_fields(app: &LpaApplication) -> u32 {
    let d = &app.donor;
    let mut n = 0u32;
    if !d.given_names.is_empty() { n += 1; }
    if !d.family_name.is_empty() { n += 1; }
    if !d.birth_date.is_empty() { n += 1; }
    if !d.postal_address_as_full_text.is_empty() { n += 1; }
    if !d.jurisdiction.is_empty() { n += 1; }
    if d.capacity_declared == "yes" { n += 1; }
    if !app.attorneys.is_empty() { n += 1; }
    if !app.decision_rule.is_empty() { n += 1; }
    if !app.lst_choice.is_empty() { n += 1; }
    if app.lst_donor_initialled == "yes" { n += 1; }
    if app.certificate_provider.is_some() { n += 1; }
    if app
        .certificate_provider
        .as_ref()
        .map_or(false, |cp| !cp.route.is_empty())
    { n += 1; }
    if app
        .signatures
        .iter()
        .any(|s| s.signer_role == "donor" && !s.signed_at.is_empty())
    { n += 1; }
    if app
        .signatures
        .iter()
        .any(|s| s.signer_role == "certificate-provider" && !s.signed_at.is_empty())
    { n += 1; }
    if !app.attorneys.is_empty()
        && app.attorneys.iter().enumerate().all(|(idx, _)| {
            app.signatures.iter().any(|s| {
                s.signer_role == "attorney"
                    && s.signer_index as usize == idx
                    && !s.signed_at.is_empty()
            })
        })
    { n += 1; }
    if !app.registration.applicant_role.is_empty() { n += 1; }
    if !app.registration.applicant_signed_at.is_empty() { n += 1; }
    if app.registration.fee_amount_pounds > 0.0
        || app.registration.fee_remission == "half"
        || app.registration.fee_remission == "full-exempt"
    { n += 1; }
    n
}

/// Calculate LPA validity.
pub fn calculate_lpa_validity(app: &LpaApplication) -> LpaValidityResult {
    let mut fired_rules = Vec::new();
    fired_rules.extend(apply_donor_rules(app));
    fired_rules.extend(apply_attorney_rules(app));
    fired_rules.extend(apply_certificate_provider_rules(app));
    fired_rules.extend(apply_signature_order_rules(app));
    fired_rules.extend(apply_instruction_rules(app));
    fired_rules.extend(apply_registration_rules(app));

    let additional_flags = detect_additional_flags(app);

    let worst = worst_severity(&fired_rules);
    let validity_status = cascade(worst);
    let populated = count_populated_required_fields(app);
    let completeness_score = (populated * 100) / REQUIRED_FIELD_COUNT;

    let last_signature = app
        .signatures
        .iter()
        .filter_map(|s| {
            if s.signed_at.is_empty() {
                None
            } else {
                Some(s.signed_at.clone())
            }
        })
        .max();
    let effective_date = match (&validity_status, last_signature) {
        (ValidityStatus::ReadyToRegister, Some(d)) => parse_date(&d),
        _ => None,
    };

    LpaValidityResult {
        validity_status,
        completeness_score,
        effective_date,
        fired_rules,
        additional_flags,
        engine_version: ENGINE_VERSION.to_string(),
        computed_at: Utc::now(),
    }
}

// ---------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;
    use crate::types::{Attorney, CertificateProvider, RegistrationApplication, Signature};

    fn ready_app() -> LpaApplication {
        let mut app = LpaApplication::default();
        app.jurisdiction = "england".into();
        app.donor.given_names = "A".into();
        app.donor.family_name = "P".into();
        app.donor.birth_date = "1955-04-12".into();
        app.donor.postal_address_as_full_text = "1 X".into();
        app.donor.jurisdiction = "england".into();
        app.donor.capacity_declared = "yes".into();
        app.donor.capacity_declared_at = "2026-05-01T09:00:00Z".into();

        app.attorneys.push(Attorney {
            given_names: "B".into(),
            family_name: "P".into(),
            birth_date: "1990-01-01".into(),
            relationship_to_donor: "child".into(),
            is_bankrupt: "no".into(),
            capacity_declared: "yes".into(),
            ..Default::default()
        });
        app.certificate_provider = Some(CertificateProvider {
            given_names: "C".into(),
            family_name: "D".into(),
            route: "skill-based".into(),
            profession: "solicitor".into(),
            profession_registration_number: "SRA-12345".into(),
            declared_not_family: "yes".into(),
            declared_not_employee: "yes".into(),
            declared_not_attorney: "yes".into(),
            ..Default::default()
        });
        app.decision_rule = "jointly-and-severally".into();
        app.lst_choice = "option-a".into();
        app.lst_donor_initialled = "yes".into();
        app.signatures = vec![
            Signature {
                signer_role: "donor".into(),
                signer_index: 0,
                signed_at: "2026-05-01T09:00:00Z".into(),
                signature_method: "wet-ink".into(),
                witness_name: "W1".into(),
                witness_signed_at: "2026-05-01T09:00:00Z".into(),
                witness_is_attorney: "no".into(),
                ..Default::default()
            },
            Signature {
                signer_role: "certificate-provider".into(),
                signer_index: 0,
                signed_at: "2026-05-01T10:00:00Z".into(),
                witness_is_attorney: "no".into(),
                ..Default::default()
            },
            Signature {
                signer_role: "attorney".into(),
                signer_index: 0,
                signed_at: "2026-05-01T11:00:00Z".into(),
                witness_is_attorney: "no".into(),
                ..Default::default()
            },
        ];
        app.registration = RegistrationApplication {
            applicant_role: "donor".into(),
            applicant_signed_at: "2026-05-02T09:00:00Z".into(),
            fee_amount_pounds: 82.0,
            fee_remission: "none".into(),
            submission_channel: "post".into(),
            ..Default::default()
        };
        app
    }

    #[test]
    fn empty_application_is_invalid() {
        let r = calculate_lpa_validity(&LpaApplication::default());
        assert_eq!(r.validity_status, ValidityStatus::Invalid);
        assert!(r.fired_rules.iter().any(|x| x.severity == RuleSeverity::Fatal));
        assert_eq!(r.completeness_score, 0);
    }

    #[test]
    fn ready_application_is_ready_to_register() {
        let r = calculate_lpa_validity(&ready_app());
        let fatals: Vec<_> = r
            .fired_rules
            .iter()
            .filter(|x| x.severity == RuleSeverity::Fatal)
            .collect();
        let highs: Vec<_> = r
            .fired_rules
            .iter()
            .filter(|x| x.severity == RuleSeverity::High)
            .collect();
        assert!(fatals.is_empty(), "unexpected fatals: {:?}", fatals);
        assert!(highs.is_empty(), "unexpected highs: {:?}", highs);
        assert_eq!(r.validity_status, ValidityStatus::ReadyToRegister);
        assert!(r.completeness_score >= 90);
    }

    #[test]
    fn lst_choice_required() {
        let mut app = ready_app();
        app.lst_choice = String::new();
        app.lst_donor_initialled = String::new();
        let r = calculate_lpa_validity(&app);
        assert!(r.fired_rules.iter().any(|x| x.rule_id == "R-MCA-LST-CHOICE"));
        assert_eq!(r.validity_status, ValidityStatus::Invalid);
    }

    #[test]
    fn certificate_provider_family_block() {
        let mut app = ready_app();
        if let Some(cp) = app.certificate_provider.as_mut() {
            cp.declared_not_family = String::new();
        }
        let r = calculate_lpa_validity(&app);
        assert!(r.fired_rules.iter().any(|x| x.rule_id == "R-MCA-CP-FAM"));
    }

    #[test]
    fn sign_order_enforced() {
        let mut app = ready_app();
        for s in app.signatures.iter_mut() {
            if s.signer_role == "donor" {
                s.signed_at = "2026-05-01T12:00:00Z".into();
            }
            if s.signer_role == "certificate-provider" {
                s.signed_at = "2026-05-01T10:00:00Z".into();
            }
        }
        let r = calculate_lpa_validity(&app);
        assert!(r
            .fired_rules
            .iter()
            .any(|x| x.rule_id == "R-MCA-ORDER-DONOR-FIRST"));
    }

    #[test]
    fn rule_identifiers_are_unique_per_run() {
        let r = calculate_lpa_validity(&ready_app());
        let mut ids: Vec<&str> = r.fired_rules.iter().map(|x| x.rule_id.as_str()).collect();
        ids.sort();
        let len_before = ids.len();
        ids.dedup();
        assert_eq!(ids.len(), len_before);
    }
}
