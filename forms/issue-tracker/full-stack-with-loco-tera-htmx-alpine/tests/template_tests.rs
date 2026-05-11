// Confirms every .tera file under templates/ parses and renders against
// a representative context. Exercises base.html.tera through the wizard
// (assessment + 10 step partials), the report, and the dashboard.

use serde_json::json;
use tera::{Context, Tera};

fn tera() -> Tera {
    Tera::new("templates/**/*.tera").expect("Tera compile")
}

#[test]
fn every_template_compiles() {
    let t = tera();
    let names: Vec<&str> = t.get_template_names().collect();
    // Top level + 10 step partials + base + report + dashboard = 14
    assert!(
        names.len() >= 14,
        "expected >= 14 templates, got {}: {:?}",
        names.len(),
        names
    );
    assert!(names.contains(&"base.html.tera"));
    assert!(names.contains(&"assessment.html.tera"));
    assert!(names.contains(&"report.html.tera"));
    assert!(names.contains(&"dashboard.html.tera"));
    for n in 1..=10 {
        let name = format!("assessment/step{:02}.html.tera", n);
        assert!(names.contains(&name.as_str()), "missing {name}");
    }
}

#[test]
fn assessment_renders_with_partial_data() {
    let t = tera();
    let mut ctx = Context::new();
    ctx.insert("id", "demo-1234");
    ctx.insert(
        "data",
        &json!({
            "reporter_role": "sre",
            "issue_category": "service-outage",
            "environment": "production",
            "cc_summary": "Read replica lagging",
            "score_by_severity_of_impact": 5,
            "score_by_failure_condition": "A",
        }),
    );
    let html = t.render("assessment.html.tera", &ctx).unwrap();
    assert!(html.contains("Step 1 — Reporter"));
    assert!(html.contains("Step 10 — Score"));
    assert!(html.contains(r#"action="/issue-tracker/demo-1234/submit""#));
    assert!(html.contains("Read replica lagging"));
    // Selected attribute should appear next to the chosen options.
    assert!(html.contains(r#"value="sre" selected"#));
    assert!(html.contains(r#"value="A" selected"#));
    // HTMX hx-boost on the body lives in base.html.tera and must render.
    assert!(html.contains(r#"<body hx-boost="true">"#));
    // Pinned HTMX + Alpine.js script tags must survive into the rendered page.
    assert!(html.contains("htmx.org@2.0.8"));
    assert!(html.contains("alpinejs@3.14.8"));
}

#[test]
fn report_renders_grade_result() {
    let t = tera();
    let mut ctx = Context::new();
    ctx.insert("id", "demo-1234");
    ctx.insert(
        "data",
        &json!({
            "cc_summary": "Read replica lagging > 30 minutes",
        }),
    );
    ctx.insert(
        "result",
        &json!({
            "score_by_priority_rank": 1,
            "score_by_severity_of_impact": 5,
            "score_by_magnitude_of_damage": 8,
            "score_by_harm_grade": 0,
            "score_by_failure_condition": "B",
            "score_by_moscow_requirement": 1,
            "score_by_frequency_percent": 95.0,
            "composite_priority": "critical",
            "fired_rules": [
                {
                    "rule_id": "R-SEVERITY-5",
                    "instrument": "severity",
                    "grade": "5",
                    "category": "impact",
                    "description": "Severity 5 catastrophic.",
                    "band": "critical",
                },
                {
                    "rule_id": "R-COMPOSITE-CRITICAL",
                    "instrument": "composite",
                    "grade": "critical",
                    "category": "composite",
                    "description": "Composite is critical.",
                    "band": "critical",
                }
            ],
            "additional_flags": [
                {
                    "flag_id": "F-FREQUENCY-95-001",
                    "category": "frequency-universal",
                    "priority": "high",
                    "description": "Frequency 95% — effectively universal impact.",
                    "suggested_action": "Activate status page.",
                }
            ],
        }),
    );
    let html = t.render("report.html.tera", &ctx).unwrap();
    assert!(html.contains("Read replica lagging"));
    assert!(html.contains(r#"<span class="badge critical">CRITICAL</span>"#));
    assert!(html.contains("R-SEVERITY-5"));
    assert!(html.contains("frequency-universal"));
    assert!(html.contains("Fired rules (2)"));
    assert!(html.contains("Safety flags (1)"));
}

#[test]
fn dashboard_renders_filter_chrome_and_rows() {
    let t = tera();
    let mut ctx = Context::new();
    ctx.insert(
        "filters",
        &json!({"composite": "critical", "q": "outage"}),
    );
    ctx.insert("total", &10);
    ctx.insert(
        "rows",
        &json!([
            {
                "id": "ISSUE-2026-0001",
                "status": "open",
                "composite_priority": "critical",
                "score_by_priority_rank": 1,
                "score_by_severity_of_impact": 5,
                "score_by_magnitude_of_damage": 9,
                "score_by_harm_grade": 4,
                "score_by_failure_condition": "A",
                "score_by_moscow_requirement": 1,
                "score_by_frequency_percent": 100,
                "cc_summary": "Region us-east-2 outage",
                "system_name": "edge-router",
                "environment": "production",
                "pt_assignees": "sre-oncall",
                "reported_at": "2026-05-08T06:42:00Z",
            }
        ]),
    );
    let html = t.render("dashboard.html.tera", &ctx).unwrap();
    assert!(html.contains(r#"value="critical" selected"#));
    assert!(html.contains(r#"value="outage""#));
    assert!(html.contains("ISSUE-2026-0001"));
    assert!(html.contains("Region us-east-2 outage"));
    assert!(html.contains("hx-get=\"/dashboard/rows\""));
    assert!(html.contains("hx-target=\"#issues-body\""));
    assert!(html.contains("Showing 1 of 10 issues"));
}

#[test]
fn dashboard_no_results_branch() {
    let t = tera();
    let mut ctx = Context::new();
    ctx.insert("filters", &json!({}));
    ctx.insert("rows", &json!([]));
    let html = t.render("dashboard.html.tera", &ctx).unwrap();
    assert!(html.contains("No matching issues."));
    assert!(html.contains("Showing 0 of 0 issues"));
}
