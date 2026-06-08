//! Flags module.

use crate::scoring::types::{
    AdditionalFlag, AgileConsultingScorecardAssessment, FlagCategory, FlagPriority,
};

/// Readiness flags that fire independently of the band. Each flag identifies
/// a specific gap in the organization's agile readiness that would block a
/// successful consulting engagement until addressed.
pub fn compute(data: &AgileConsultingScorecardAssessment) -> Vec<AdditionalFlag> {
    let m = &data.manifesto;
    let p = &data.principles;
    let mut out = Vec::<AdditionalFlag>::new();

    // No senior leadership buy-in (manifesto item 4 = false)
    if m.m4.done == Some(false) {
        out.push(AdditionalFlag {
            flag_id: "F-NO-SENIOR-LEADERSHIP-BUYIN-001".into(),
            category: FlagCategory::NoSeniorLeadershipBuyin,
            priority: FlagPriority::High,
            description: "Manifesto 4 not satisfied: no senior leader has read an agile change-management book and shared takeaways.".into(),
            suggested_action: "Have every BoD/CXO/VP/Director read one agile change book and present three takeaways before procurement.".into(),
        });
    }

    // No customer contact (manifesto item 1 OR principle 1 = false)
    if m.m1.done == Some(false) || p.p1.done == Some(false) {
        out.push(AdditionalFlag {
            flag_id: "F-NO-CUSTOMER-CONTACT-001".into(),
            category: FlagCategory::NoCustomerContact,
            priority: FlagPriority::High,
            description: "Customer-contact gap: leaders are not in regular conversation with customers, or NPS is not measured.".into(),
            suggested_action: "Establish weekly customer conversations for every product lead and stand up a basic NPS measurement.".into(),
        });
    }

    // No working software (manifesto item 2 AND principle 7 both = false)
    if m.m2.done == Some(false) && p.p7.done == Some(false) {
        out.push(AdditionalFlag {
            flag_id: "F-NO-WORKING-SOFTWARE-001".into(),
            category: FlagCategory::NoWorkingSoftware,
            priority: FlagPriority::High,
            description: "No warm-up programs shipped: neither \"hello world\" nor \"fizz buzz\" has been launched to production.".into(),
            suggested_action: "Run the warm-up exercise: ship \"hello world\" then \"fizz buzz\" to production with a real team and discuss.".into(),
        });
    }

    // No sustainable budget (principle 8 = false)
    if p.p8.done == Some(false) {
        out.push(AdditionalFlag {
            flag_id: "F-NO-SUSTAINABLE-BUDGET-001".into(),
            category: FlagCategory::NoSustainableBudget,
            priority: FlagPriority::Medium,
            description: "Principle 8 not satisfied: less than 1 year of staff sustaining budget is secured.".into(),
            suggested_action: "Secure a 1-year sustaining budget before engaging consultants, or scope the engagement to budget.".into(),
        });
    }

    // No self-organization (principle 11 = false)
    if p.p11.done == Some(false) {
        out.push(AdditionalFlag {
            flag_id: "F-NO-SELF-ORGANIZATION-001".into(),
            category: FlagCategory::NoSelfOrganization,
            priority: FlagPriority::Medium,
            description: "Principle 11 not satisfied: self-organization Likert average is below \"Agree\".".into(),
            suggested_action: "Run a focused self-organization improvement initiative (e.g. The Vanguard Method) before hiring agile coaches.".into(),
        });
    }

    // No reflection culture (principle 12 = false)
    if p.p12.done == Some(false) {
        out.push(AdditionalFlag {
            flag_id: "F-NO-REFLECTION-CULTURE-001".into(),
            category: FlagCategory::NoReflectionCulture,
            priority: FlagPriority::Medium,
            description: "Principle 12 not satisfied: leaders are not running or sharing retrospectives.".into(),
            suggested_action: "Establish a regular leader-level retrospective cadence and require sharing the last two with stakeholders.".into(),
        });
    }

    out
}
