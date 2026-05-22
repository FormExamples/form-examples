use objective_and_key_result_tracker::scoring::{composite::grade_objective, types::ObjectiveAssessment};
use serde::Deserialize;
use std::fs;
use std::path::Path;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Expected {
    computed_composite_rag: String,
    expected_flags: Vec<ExpectedFlag>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ExpectedFlag { flag_code: String }

#[derive(Deserialize)]
struct Fixture {
    name: String,
    input: ObjectiveAssessment,
    expected: Expected,
}

#[test]
fn every_fixture_grades_as_expected() {
    let dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("../test-fixtures/scoring");
    let mut entries: Vec<_> = fs::read_dir(&dir).unwrap()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map(|x| x == "json").unwrap_or(false))
        .collect();
    entries.sort_by_key(|e| e.file_name());

    for entry in entries {
        let raw = fs::read_to_string(entry.path()).unwrap();
        let fx: Fixture = serde_json::from_str(&raw).expect(&format!("parse {:?}", entry.file_name()));
        let result = grade_objective(&fx.input);

        assert_eq!(
            result.computed_composite_rag.as_str(),
            fx.expected.computed_composite_rag,
            "{}: rag mismatch", fx.name
        );

        let mut got: Vec<String> = result.flags.iter()
            .map(|f| serde_json::to_value(&f.flag_code).unwrap().as_str().unwrap().to_string())
            .collect();
        got.sort();
        let mut want: Vec<String> = fx.expected.expected_flags.iter().map(|f| f.flag_code.clone()).collect();
        want.sort();
        assert_eq!(got, want, "{}: flag mismatch", fx.name);
    }
}
