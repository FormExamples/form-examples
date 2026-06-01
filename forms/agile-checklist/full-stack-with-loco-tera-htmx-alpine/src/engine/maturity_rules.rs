use super::items::Section;
use super::types::{Band, FiredRule, SectionScore};
use super::utils::capitalise;

/// Coaching narrative for each (section, band) combination.
pub fn coaching_for(section: Section, band: Band) -> &'static str {
    match (section, band) {
        (Section::Teams, Band::High) => "Teams have strong agile habits — autonomy, learning, and finishing. Preserve psychological safety as the team grows.",
        (Section::Teams, Band::Mid) => "Team behaviours are uneven. Identify two or three weak items and turn them into named retrospective experiments.",
        (Section::Teams, Band::Low) => "Teams are not yet operating with agile habits. Start with autonomy, finishing work, and dissent-safety; coaching is needed.",
        (Section::Stakeholders, Band::High) => "Stakeholders trust and support the team. Continue investing in transparency and shared goals.",
        (Section::Stakeholders, Band::Mid) => "Stakeholder support is partial. Audit which decisions sponsors still take back at the first sign of trouble.",
        (Section::Stakeholders, Band::Low) => "Stakeholder behaviour is the binding constraint. No team can outrun a sponsor who revokes authority and punishes experiments.",
        (Section::Practices, Band::High) => "Operating practices are healthy — quick decisions, finished-work focus, blame-free culture. Keep watching for over-engineering.",
        (Section::Practices, Band::Mid) => "Practices are partly in place. Pick the two weakest items and address them at the system level, not the team level.",
        (Section::Practices, Band::Low) => "Operating practices are working against agility. Address finished-over-WIP, quality-over-deadline, and blame culture before adding rituals.",
        (_, Band::Unanswered) => "",
    }
}

fn band_from_slug(slug: &str) -> Band {
    match slug {
        "high" => Band::High,
        "mid" => Band::Mid,
        "low" => Band::Low,
        _ => Band::Unanswered,
    }
}

fn section_from_slug(slug: &str) -> Option<Section> {
    match slug {
        "teams" => Some(Section::Teams),
        "stakeholders" => Some(Section::Stakeholders),
        "practices" => Some(Section::Practices),
        _ => None,
    }
}

/// Emit one fired rule per section (Teams, Stakeholders, Practices) carrying
/// the band-specific coaching narrative.
pub fn apply_maturity_rules(
    teams: &SectionScore,
    stakeholders: &SectionScore,
    practices: &SectionScore,
) -> Vec<FiredRule> {
    let mut fired = Vec::with_capacity(3);
    for score in [teams, stakeholders, practices] {
        let band = band_from_slug(&score.band);
        let section = section_from_slug(&score.section);
        let description = if band == Band::Unanswered {
            format!("{} section was not answered.", capitalise(&score.section))
        } else if let Some(s) = section {
            coaching_for(s, band).to_string()
        } else {
            String::new()
        };
        fired.push(FiredRule {
            rule_id: format!(
                "R-{}-{}",
                score.section.to_uppercase(),
                score.band.to_uppercase()
            ),
            section: score.section.clone(),
            band: score.band.clone(),
            description,
        });
    }
    fired
}
