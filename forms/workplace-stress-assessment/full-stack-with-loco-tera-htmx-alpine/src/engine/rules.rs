// HSE Management Standards Indicator Tool — items registry and benchmarks.
//
// 35 statements across seven domains, each rated on a 1-5 Likert scale.
// Negatively-worded items are reverse-scored before computing the domain
// mean, so a higher mean is *always* more favourable.
//
// Domain benchmarks below come from the HSE 2007 norms (indicative 20th /
// 50th / 80th percentile cut-offs).

use super::types::AssessmentData;

#[derive(Debug, Clone, Copy)]
pub enum LikertScale {
    Frequency,
    Agreement,
}

#[derive(Debug, Clone)]
pub struct StressItem {
    pub id: &'static str,
    pub domain: &'static str,
    pub label: &'static str,
    pub scale: LikertScale,
    pub reverse_scored: bool,
}

#[derive(Debug, Clone, Copy)]
pub struct DomainBenchmark {
    pub good_at: f64,
    pub moderate_at: f64,
    pub high_at: f64,
}

#[derive(Debug, Clone, Copy)]
pub struct DomainMeta {
    pub key: &'static str,
    pub title: &'static str,
    pub step_number: u32,
    pub description: &'static str,
}

pub fn domains() -> Vec<DomainMeta> {
    vec![
        DomainMeta {
            key: "demands",
            title: "Demands",
            step_number: 2,
            description: "Workload, work patterns, and the physical or emotional demands placed on you.",
        },
        DomainMeta {
            key: "control",
            title: "Control",
            step_number: 3,
            description: "How much say you have over the way you do your work.",
        },
        DomainMeta {
            key: "managerSupport",
            title: "Manager Support",
            step_number: 4,
            description: "Encouragement, sponsorship and resources provided by line management.",
        },
        DomainMeta {
            key: "peerSupport",
            title: "Peer Support",
            step_number: 5,
            description: "Encouragement, sponsorship and resources provided by colleagues.",
        },
        DomainMeta {
            key: "relationships",
            title: "Relationships",
            step_number: 6,
            description: "Promoting positive working to avoid conflict and dealing with unacceptable behaviour.",
        },
        DomainMeta {
            key: "role",
            title: "Role Clarity",
            step_number: 7,
            description: "Whether you understand your role and the organisation ensures roles do not conflict.",
        },
        DomainMeta {
            key: "change",
            title: "Organisational Change",
            step_number: 8,
            description: "How organisational change (large or small) is managed and communicated.",
        },
    ]
}

/// HSE benchmarks (mean cut-offs, indicative 2007 norms).
/// Higher mean = better in every domain (after reverse-coding).
pub fn benchmark(domain_key: &str) -> Option<DomainBenchmark> {
    match domain_key {
        "demands" => Some(DomainBenchmark { good_at: 4.17, moderate_at: 3.71, high_at: 3.32 }),
        "control" => Some(DomainBenchmark { good_at: 4.10, moderate_at: 3.78, high_at: 3.46 }),
        "managerSupport" => Some(DomainBenchmark { good_at: 4.31, moderate_at: 3.92, high_at: 3.51 }),
        "peerSupport" => Some(DomainBenchmark { good_at: 4.16, moderate_at: 3.79, high_at: 3.49 }),
        "relationships" => Some(DomainBenchmark { good_at: 4.49, moderate_at: 4.00, high_at: 3.62 }),
        "role" => Some(DomainBenchmark { good_at: 4.71, moderate_at: 4.32, high_at: 3.91 }),
        "change" => Some(DomainBenchmark { good_at: 3.55, moderate_at: 3.10, high_at: 2.71 }),
        _ => None,
    }
}

/// All 35 HSE Management Standards items.
pub fn stress_items() -> Vec<StressItem> {
    use LikertScale::*;
    vec![
        // ───── Demands (8 items, all reverse-scored) ─────
        StressItem { id: "dem1", domain: "demands", scale: Frequency, reverse_scored: true,
            label: "Different groups at work demand things from me that are hard to combine." },
        StressItem { id: "dem2", domain: "demands", scale: Frequency, reverse_scored: true,
            label: "I have unachievable deadlines." },
        StressItem { id: "dem3", domain: "demands", scale: Frequency, reverse_scored: true,
            label: "I have to work very intensively." },
        StressItem { id: "dem4", domain: "demands", scale: Frequency, reverse_scored: true,
            label: "I have to neglect some tasks because I have too much to do." },
        StressItem { id: "dem5", domain: "demands", scale: Frequency, reverse_scored: true,
            label: "I am unable to take sufficient breaks." },
        StressItem { id: "dem6", domain: "demands", scale: Frequency, reverse_scored: true,
            label: "I am pressured to work long hours." },
        StressItem { id: "dem7", domain: "demands", scale: Frequency, reverse_scored: true,
            label: "I have to work very fast." },
        StressItem { id: "dem8", domain: "demands", scale: Frequency, reverse_scored: true,
            label: "I have unrealistic time pressures." },

        // ───── Control (6 items, positively worded) ─────
        StressItem { id: "ctrl1", domain: "control", scale: Frequency, reverse_scored: false,
            label: "I can decide when to take a break." },
        StressItem { id: "ctrl2", domain: "control", scale: Agreement, reverse_scored: false,
            label: "I have a say in my own work speed." },
        StressItem { id: "ctrl3", domain: "control", scale: Agreement, reverse_scored: false,
            label: "I have a choice in deciding how I do my work." },
        StressItem { id: "ctrl4", domain: "control", scale: Agreement, reverse_scored: false,
            label: "I have a choice in deciding what I do at work." },
        StressItem { id: "ctrl5", domain: "control", scale: Agreement, reverse_scored: false,
            label: "I have some say over the way I work." },
        StressItem { id: "ctrl6", domain: "control", scale: Frequency, reverse_scored: false,
            label: "My working time can be flexible." },

        // ───── Manager Support (5 items) ─────
        StressItem { id: "ms1", domain: "managerSupport", scale: Frequency, reverse_scored: false,
            label: "I am given supportive feedback on the work I do." },
        StressItem { id: "ms2", domain: "managerSupport", scale: Agreement, reverse_scored: false,
            label: "I can rely on my line manager to help me out with a work problem." },
        StressItem { id: "ms3", domain: "managerSupport", scale: Agreement, reverse_scored: false,
            label: "I can talk to my line manager about something that has upset or annoyed me about work." },
        StressItem { id: "ms4", domain: "managerSupport", scale: Agreement, reverse_scored: false,
            label: "I am supported through emotionally demanding work." },
        StressItem { id: "ms5", domain: "managerSupport", scale: Frequency, reverse_scored: false,
            label: "My line manager encourages me at work." },

        // ───── Peer Support (4 items) ─────
        StressItem { id: "ps1", domain: "peerSupport", scale: Frequency, reverse_scored: false,
            label: "If work gets difficult, my colleagues will help me." },
        StressItem { id: "ps2", domain: "peerSupport", scale: Frequency, reverse_scored: false,
            label: "I get help and support I need from colleagues." },
        StressItem { id: "ps3", domain: "peerSupport", scale: Frequency, reverse_scored: false,
            label: "I receive the respect at work I deserve from my colleagues." },
        StressItem { id: "ps4", domain: "peerSupport", scale: Frequency, reverse_scored: false,
            label: "My colleagues are willing to listen to my work-related problems." },

        // ───── Relationships (4 items, reverse-scored) ─────
        StressItem { id: "rel1", domain: "relationships", scale: Frequency, reverse_scored: true,
            label: "I am subject to personal harassment in the form of unkind words or behaviour." },
        StressItem { id: "rel2", domain: "relationships", scale: Frequency, reverse_scored: true,
            label: "There is friction or anger between colleagues." },
        StressItem { id: "rel3", domain: "relationships", scale: Frequency, reverse_scored: true,
            label: "I am subject to bullying at work." },
        StressItem { id: "rel4", domain: "relationships", scale: Frequency, reverse_scored: true,
            label: "Relationships at work are strained." },

        // ───── Role Clarity (5 items) ─────
        StressItem { id: "role1", domain: "role", scale: Agreement, reverse_scored: false,
            label: "I am clear what is expected of me at work." },
        StressItem { id: "role2", domain: "role", scale: Agreement, reverse_scored: false,
            label: "I know how to go about getting my job done." },
        StressItem { id: "role3", domain: "role", scale: Agreement, reverse_scored: false,
            label: "I am clear what my duties and responsibilities are." },
        StressItem { id: "role4", domain: "role", scale: Agreement, reverse_scored: false,
            label: "I am clear about the goals and objectives for my department." },
        StressItem { id: "role5", domain: "role", scale: Agreement, reverse_scored: false,
            label: "I understand how my work fits into the overall aim of the organisation." },

        // ───── Organisational Change (3 items) ─────
        StressItem { id: "chg1", domain: "change", scale: Agreement, reverse_scored: false,
            label: "I have sufficient opportunities to question managers about change at work." },
        StressItem { id: "chg2", domain: "change", scale: Agreement, reverse_scored: false,
            label: "Staff are always consulted about change at work." },
        StressItem { id: "chg3", domain: "change", scale: Agreement, reverse_scored: false,
            label: "When changes are made at work, I am clear how they will work out in practice." },
    ]
}

/// Read the raw Likert value for an item from the assessment data, by id.
pub fn item_value(data: &AssessmentData, item: &StressItem) -> Option<i32> {
    match item.domain {
        "demands" => match item.id {
            "dem1" => data.demands.dem1,
            "dem2" => data.demands.dem2,
            "dem3" => data.demands.dem3,
            "dem4" => data.demands.dem4,
            "dem5" => data.demands.dem5,
            "dem6" => data.demands.dem6,
            "dem7" => data.demands.dem7,
            "dem8" => data.demands.dem8,
            _ => None,
        },
        "control" => match item.id {
            "ctrl1" => data.control.ctrl1,
            "ctrl2" => data.control.ctrl2,
            "ctrl3" => data.control.ctrl3,
            "ctrl4" => data.control.ctrl4,
            "ctrl5" => data.control.ctrl5,
            "ctrl6" => data.control.ctrl6,
            _ => None,
        },
        "managerSupport" => match item.id {
            "ms1" => data.manager_support.ms1,
            "ms2" => data.manager_support.ms2,
            "ms3" => data.manager_support.ms3,
            "ms4" => data.manager_support.ms4,
            "ms5" => data.manager_support.ms5,
            _ => None,
        },
        "peerSupport" => match item.id {
            "ps1" => data.peer_support.ps1,
            "ps2" => data.peer_support.ps2,
            "ps3" => data.peer_support.ps3,
            "ps4" => data.peer_support.ps4,
            _ => None,
        },
        "relationships" => match item.id {
            "rel1" => data.relationships.rel1,
            "rel2" => data.relationships.rel2,
            "rel3" => data.relationships.rel3,
            "rel4" => data.relationships.rel4,
            _ => None,
        },
        "role" => match item.id {
            "role1" => data.role.role1,
            "role2" => data.role.role2,
            "role3" => data.role.role3,
            "role4" => data.role.role4,
            "role5" => data.role.role5,
            _ => None,
        },
        "change" => match item.id {
            "chg1" => data.change.chg1,
            "chg2" => data.change.chg2,
            "chg3" => data.change.chg3,
            _ => None,
        },
        _ => None,
    }
}
