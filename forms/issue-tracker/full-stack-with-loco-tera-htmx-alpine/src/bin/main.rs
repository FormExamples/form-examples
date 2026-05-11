// Issue Tracker — minimal CLI entrypoint that runs the scoring engine
// over a JSON-on-stdin assessment and prints the grade as JSON to
// stdout. The full HTTP server is added later by the form's
// `full-stack-with-loco-tera-htmx-alpine-setup` shell script.

use issue_tracker::{grade_issue, IssueTrackerAssessment};
use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin()
        .read_to_string(&mut input)
        .expect("read stdin");
    let data: IssueTrackerAssessment =
        serde_json::from_str(&input).expect("parse IssueTrackerAssessment JSON");
    let result = grade_issue(&data);
    let out = serde_json::to_string_pretty(&result).expect("serialise GradeResult");
    println!("{out}");
}
