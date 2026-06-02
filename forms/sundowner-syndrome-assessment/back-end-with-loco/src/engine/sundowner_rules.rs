// CMAI item bank and NPI domain bank.
//
// CMAI: 29 observer-rated items, each scored 1-7 (range 29-203).
//   1 = Never
//   2 = Less than once a week
//   3 = Once or twice a week
//   4 = Several times a week
//   5 = Once or twice a day
//   6 = Several times a day
//   7 = Several times an hour
//
// NPI: 12 behavioural domains, each rated by frequency (1-4) and
// severity (1-3); domain score = frequency * severity (0-12). Total
// range is 0-144.

/// One CMAI item.
pub struct CmaiItem {
    pub id: &'static str,
    pub number: u32,
    pub label: &'static str,
}

/// One NPI domain.
pub struct NpiDomain {
    pub key: &'static str,
    pub label: &'static str,
}

/// All 29 CMAI items, in canonical order.
pub fn cmai_items() -> &'static [CmaiItem] {
    &[
        CmaiItem { id: "cmai01", number: 1,  label: "Pacing or aimless wandering" },
        CmaiItem { id: "cmai02", number: 2,  label: "Inappropriate dress or disrobing" },
        CmaiItem { id: "cmai03", number: 3,  label: "Spitting (including at meals)" },
        CmaiItem { id: "cmai04", number: 4,  label: "Cursing or verbal aggression" },
        CmaiItem { id: "cmai05", number: 5,  label: "Constant unwarranted requests for attention or help" },
        CmaiItem { id: "cmai06", number: 6,  label: "Repetitive sentences or questions" },
        CmaiItem { id: "cmai07", number: 7,  label: "Hitting (including self)" },
        CmaiItem { id: "cmai08", number: 8,  label: "Kicking" },
        CmaiItem { id: "cmai09", number: 9,  label: "Grabbing onto people" },
        CmaiItem { id: "cmai10", number: 10, label: "Pushing" },
        CmaiItem { id: "cmai11", number: 11, label: "Throwing things" },
        CmaiItem { id: "cmai12", number: 12, label: "Strange noises (weird laughter or crying)" },
        CmaiItem { id: "cmai13", number: 13, label: "Screaming" },
        CmaiItem { id: "cmai14", number: 14, label: "Biting" },
        CmaiItem { id: "cmai15", number: 15, label: "Scratching" },
        CmaiItem { id: "cmai16", number: 16, label: "Trying to get to a different place (e.g. out of the room)" },
        CmaiItem { id: "cmai17", number: 17, label: "Intentional falling" },
        CmaiItem { id: "cmai18", number: 18, label: "Complaining" },
        CmaiItem { id: "cmai19", number: 19, label: "Negativism" },
        CmaiItem { id: "cmai20", number: 20, label: "Eating or drinking inappropriate substances" },
        CmaiItem { id: "cmai21", number: 21, label: "Hurting self or others" },
        CmaiItem { id: "cmai22", number: 22, label: "Handling things inappropriately" },
        CmaiItem { id: "cmai23", number: 23, label: "Hiding things" },
        CmaiItem { id: "cmai24", number: 24, label: "Hoarding things" },
        CmaiItem { id: "cmai25", number: 25, label: "Tearing things or destroying property" },
        CmaiItem { id: "cmai26", number: 26, label: "Performing repetitive mannerisms" },
        CmaiItem { id: "cmai27", number: 27, label: "Making verbal sexual advances" },
        CmaiItem { id: "cmai28", number: 28, label: "Making physical sexual advances" },
        CmaiItem { id: "cmai29", number: 29, label: "General restlessness" },
    ]
}

/// The 12 NPI domains in canonical order.
pub fn npi_domains() -> &'static [NpiDomain] {
    &[
        NpiDomain { key: "delusions",            label: "Delusions" },
        NpiDomain { key: "hallucinations",       label: "Hallucinations" },
        NpiDomain { key: "agitationAggression",  label: "Agitation / aggression" },
        NpiDomain { key: "depressionDysphoria",  label: "Depression / dysphoria" },
        NpiDomain { key: "anxiety",              label: "Anxiety" },
        NpiDomain { key: "elationEuphoria",      label: "Elation / euphoria" },
        NpiDomain { key: "apathyIndifference",   label: "Apathy / indifference" },
        NpiDomain { key: "disinhibition",        label: "Disinhibition" },
        NpiDomain { key: "irritabilityLability", label: "Irritability / lability" },
        NpiDomain { key: "motorDisturbance",     label: "Aberrant motor disturbance" },
        NpiDomain { key: "sleep",                label: "Sleep / night-time behaviour" },
        NpiDomain { key: "appetiteEating",       label: "Appetite / eating change" },
    ]
}

/// Look up a CMAI item label by its 1-based number.
pub fn cmai_item_by_number(n: u32) -> Option<&'static CmaiItem> {
    cmai_items().iter().find(|it| it.number == n)
}
