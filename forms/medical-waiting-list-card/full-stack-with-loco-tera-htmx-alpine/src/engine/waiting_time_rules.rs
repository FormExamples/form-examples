use super::priority_targets::{
    days_between, target_wait_weeks, weeks_between, APPROACHING_BREACH_WINDOW_WEEKS,
    LONG_WAIT_WEEKS, RTT_BREACH_WEEKS,
};
use super::types::{Card, FiredRule};

/// The structured output of the waiting-time band classifier.
#[derive(Debug, Clone)]
pub struct WaitingTime {
    pub band: String,
    pub target_wait_weeks: Option<f64>,
    pub days_waited: Option<i64>,
    pub weeks_waited: Option<f64>,
    pub days_to_target: Option<i64>,
    pub days_to_breach: Option<i64>,
    pub fired_rules: Vec<FiredRule>,
}

/// Pure function: classify the Waiting Time Status band from the card's
/// RTT clock-start date and clinical priority.
///
/// Worst-band wins: long wait → breached → approaching breach → within
/// target. P6 (removed from list) short-circuits to within target with
/// no further evaluation.
pub fn calculate_waiting_time(card: &Card, today_iso: &str) -> WaitingTime {
    let approaching_days = (APPROACHING_BREACH_WINDOW_WEEKS * 7.0) as i64;
    let clock_start = card.waiting_list.rtt_clock_start_date.as_str();
    let priority = card.waiting_list.clinical_priority.as_str();
    let target = target_wait_weeks(priority);

    let days_waited = days_between(clock_start, today_iso);
    let weeks_waited = weeks_between(clock_start, today_iso);
    let days_to_target = match (target, days_waited) {
        (Some(t), Some(d)) => Some((t * 7.0).round() as i64 - d),
        _ => None,
    };
    let days_to_breach = days_waited.map(|d| (RTT_BREACH_WEEKS * 7.0) as i64 - d);

    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // Cannot classify without both clock-start and priority.
    if clock_start.is_empty() || priority.is_empty() {
        return WaitingTime {
            band: String::new(),
            target_wait_weeks: target,
            days_waited,
            weeks_waited,
            days_to_target,
            days_to_breach,
            fired_rules,
        };
    }

    // P6 = removed from the list; no target applies.
    if priority == "P6" {
        fired_rules.push(FiredRule {
            rule_id: "R-WTS-P6-001".to_string(),
            instrument: "clinical-priority".to_string(),
            band: "within-target".to_string(),
            category: "removed-from-list".to_string(),
            description: "Patient is P6 (removed from list); no waiting-time target applies."
                .to_string(),
        });
        return WaitingTime {
            band: "within-target".to_string(),
            target_wait_weeks: None,
            days_waited,
            weeks_waited,
            days_to_target: None,
            days_to_breach,
            fired_rules,
        };
    }

    // Long wait: > 52 weeks since clock start.
    if let Some(d) = days_waited {
        if d > (LONG_WAIT_WEEKS * 7.0) as i64 {
            fired_rules.push(FiredRule {
                rule_id: "R-LW-52WK-001".to_string(),
                instrument: "long-wait".to_string(),
                band: "long-wait".to_string(),
                category: "long-waiter".to_string(),
                description: format!(
                    "Patient has waited more than {} weeks since the RTT clock-start date.",
                    LONG_WAIT_WEEKS as i64
                ),
            });
            return WaitingTime {
                band: "long-wait".to_string(),
                target_wait_weeks: target,
                days_waited,
                weeks_waited,
                days_to_target,
                days_to_breach,
                fired_rules,
            };
        }
    }

    // Breached: past priority target or past 18-week RTT standard.
    let breached_target = days_to_target.map(|x| x < 0).unwrap_or(false);
    let breached_rtt = days_to_breach.map(|x| x < 0).unwrap_or(false);
    if breached_target || breached_rtt {
        if breached_target {
            fired_rules.push(FiredRule {
                rule_id: "R-WTS-TARGET-001".to_string(),
                instrument: "waiting-time-status".to_string(),
                band: "breached".to_string(),
                category: "priority-target".to_string(),
                description: format!(
                    "Patient has waited longer than the {} target of {} weeks.",
                    priority,
                    target.map(|t| format!("{t}")).unwrap_or_else(|| "—".to_string())
                ),
            });
        }
        if breached_rtt {
            fired_rules.push(FiredRule {
                rule_id: "R-WTS-RTT-001".to_string(),
                instrument: "waiting-time-status".to_string(),
                band: "breached".to_string(),
                category: "rtt-18-week".to_string(),
                description: format!(
                    "Patient has breached the {}-week NHS RTT standard.",
                    RTT_BREACH_WEEKS as i64
                ),
            });
        }
        return WaitingTime {
            band: "breached".to_string(),
            target_wait_weeks: target,
            days_waited,
            weeks_waited,
            days_to_target,
            days_to_breach,
            fired_rules,
        };
    }

    // Approaching breach: within 4 weeks of priority target or RTT
    // standard.
    let approaching_target = days_to_target.map(|x| x <= approaching_days).unwrap_or(false);
    let approaching_rtt = days_to_breach.map(|x| x <= approaching_days).unwrap_or(false);
    if approaching_target || approaching_rtt {
        fired_rules.push(FiredRule {
            rule_id: "R-WTS-APPROACH-001".to_string(),
            instrument: "waiting-time-status".to_string(),
            band: "approaching-breach".to_string(),
            category: "approaching-target".to_string(),
            description: format!(
                "Patient is within {} weeks of their {} target or the 18-week RTT standard.",
                APPROACHING_BREACH_WINDOW_WEEKS as i64, priority
            ),
        });
        return WaitingTime {
            band: "approaching-breach".to_string(),
            target_wait_weeks: target,
            days_waited,
            weeks_waited,
            days_to_target,
            days_to_breach,
            fired_rules,
        };
    }

    // Default: within target.
    fired_rules.push(FiredRule {
        rule_id: "R-WTS-WITHIN-001".to_string(),
        instrument: "waiting-time-status".to_string(),
        band: "within-target".to_string(),
        category: "within-target".to_string(),
        description: format!(
            "Patient is within the {} target and the 18-week RTT standard.",
            priority
        ),
    });

    WaitingTime {
        band: "within-target".to_string(),
        target_wait_weeks: target,
        days_waited,
        weeks_waited,
        days_to_target,
        days_to_breach,
        fired_rules,
    }
}
