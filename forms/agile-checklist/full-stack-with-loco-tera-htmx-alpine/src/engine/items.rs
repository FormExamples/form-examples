use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Section {
    Teams,
    Stakeholders,
    Practices,
}

impl Section {
    pub fn slug(self) -> &'static str {
        match self {
            Section::Teams => "teams",
            Section::Stakeholders => "stakeholders",
            Section::Practices => "practices",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ItemDef {
    pub id: &'static str,
    pub ordinal: u8,
    pub section: Section,
    pub text: &'static str,
}

macro_rules! item {
    ($id:expr, $ord:expr, $sec:expr, $text:expr) => {
        ItemDef { id: $id, ordinal: $ord, section: $sec, text: $text }
    };
}

pub const TEAMS_ITEMS: &[ItemDef] = &[
    item!("t01", 1, Section::Teams, "Teams have problems to solve rather than lists of tasks to perform."),
    item!("t02", 2, Section::Teams, "Teams generally make decisions without a manager's approval."),
    item!("t03", 3, Section::Teams, "Teams adopt appropriate practices and improve them over time."),
    item!("t04", 4, Section::Teams, "Teams working on a common product actively coordinate."),
    item!("t05", 5, Section::Teams, "Teams openly share new ideas and experiences with others."),
    item!("t06", 6, Section::Teams, "Teams decide how to execute work."),
    item!("t07", 7, Section::Teams, "Teams quickly act on stakeholder feedback to improve the product."),
    item!("t08", 8, Section::Teams, "Teams rarely wait for work to be completed by others."),
    item!("t09", 9, Section::Teams, "Teams make every effort to fully complete all planned work."),
    item!("t10", 10, Section::Teams, "Teams monitor and manage their own performance."),
    item!("t11", 11, Section::Teams, "Teams understand the benefits and challenges of agile."),
    item!("t12", 12, Section::Teams, "Teams responsibly deliver high quality work."),
    item!("t13", 13, Section::Teams, "Teams welcome rather than resist changing requirements."),
    item!("t14", 14, Section::Teams, "Teams collaborate to finish items."),
    item!("t15", 15, Section::Teams, "Teams admit challenges and mistakes."),
    item!("t16", 16, Section::Teams, "Teams can work outside their specialties to achieve goals."),
    item!("t17", 17, Section::Teams, "Teams seek to learn relevant, new skills."),
    item!("t18", 18, Section::Teams, "Teams continue to learn and improve skills."),
    item!("t19", 19, Section::Teams, "Teams actively seek ways to improve ways of working."),
    item!("t20", 20, Section::Teams, "Teams choose and use various ways of communicating."),
    item!("t21", 21, Section::Teams, "Teams have all received basic training on agile concepts."),
    item!("t22", 22, Section::Teams, "Teams feel safe to express dissenting views."),
    item!("t23", 23, Section::Teams, "Teams start work even when some open issues remain."),
    item!("t24", 24, Section::Teams, "Teams are motivated by performing their work."),
    item!("t25", 25, Section::Teams, "Teams take pride in their craft."),
];

pub const STAKEHOLDERS_ITEMS: &[ItemDef] = &[
    item!("s01", 1, Section::Stakeholders, "Stakeholders know which factors determine priorities and deadlines."),
    item!("s02", 2, Section::Stakeholders, "Stakeholders accept plans that are expressed with ranges."),
    item!("s03", 3, Section::Stakeholders, "Stakeholders and the team accept that plans may need to change."),
    item!("s04", 4, Section::Stakeholders, "Stakeholders have frequent opportunities to evaluate the product."),
    item!("s05", 5, Section::Stakeholders, "Stakeholders champion agile values and agile principles."),
    item!("s06", 6, Section::Stakeholders, "Stakeholders see quality as a right that the team has and they respect it."),
    item!("s07", 7, Section::Stakeholders, "Stakeholders delegate authority to teams."),
    item!("s08", 8, Section::Stakeholders, "Stakeholders don't take authority back at the first sign of trouble."),
    item!("s09", 9, Section::Stakeholders, "Stakeholders support teams in experimenting."),
    item!("s10", 10, Section::Stakeholders, "Stakeholders don't punish an unsuccessful experiment."),
    item!("s11", 11, Section::Stakeholders, "Stakeholders communicate what they hope to achieve by becoming more agile."),
    item!("s12", 12, Section::Stakeholders, "Stakeholders actively encourage teams to learn new skills."),
    item!("s13", 13, Section::Stakeholders, "Stakeholders actively encourage teams to learn new ways of working."),
    item!("s14", 14, Section::Stakeholders, "Stakeholders develop people rather than manage their performance."),
];

pub const PRACTICES_ITEMS: &[ItemDef] = &[
    item!("p01", 1, Section::Practices, "The early release of a good product is generally favoured over the later release of a perfect product."),
    item!("p02", 2, Section::Practices, "An educated executive sponsor ensures the change agent is empowered to make decisions."),
    item!("p03", 3, Section::Practices, "Decisions are made quickly, sometimes with incomplete knowledge."),
    item!("p04", 4, Section::Practices, "Plans are based on data and experience."),
    item!("p05", 5, Section::Practices, "Dependencies between teams are proactively identified and addressed."),
    item!("p06", 6, Section::Practices, "People are assumed to have acted with good intentions even when something goes wrong."),
    item!("p07", 7, Section::Practices, "Trust is reciprocal within the team and with stakeholders."),
    item!("p08", 8, Section::Practices, "Although formal documentation may exist, it is supplemented by conversations to the extent possible."),
    item!("p09", 9, Section::Practices, "As more is learned, plans are updated rather than remaining based on outdated information."),
    item!("p10", 10, Section::Practices, "A non-punitive attitude leads to the team's willingness to experiment with new tools, technologies, and ways of working."),
    item!("p11", 11, Section::Practices, "Outside groups that partner with the team are aware of how this new way of working may affect their interactions."),
    item!("p12", 12, Section::Practices, "The organisation places a higher value on finished work than it does on the number of work items in process."),
    item!("p13", 13, Section::Practices, "Quality is rarely, if ever, sacrificed to meet a deadline."),
    item!("p14", 14, Section::Practices, "When problems arise between teams, everyone focuses on a solution rather than blame."),
    item!("p15", 15, Section::Practices, "Change agents are in place to help support and guide the transition."),
    item!("p16", 16, Section::Practices, "Agile practices are being implemented beyond the group in which agile began."),
    item!("p17", 17, Section::Practices, "Most people are assigned to only one team."),
    item!("p18", 18, Section::Practices, "People honour commitments and keep promises."),
];

pub fn all_items() -> Vec<&'static ItemDef> {
    TEAMS_ITEMS
        .iter()
        .chain(STAKEHOLDERS_ITEMS.iter())
        .chain(PRACTICES_ITEMS.iter())
        .collect()
}
