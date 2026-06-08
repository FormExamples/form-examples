//! Rust port of `front-end-form-with-svelte/src/lib/engine/bulk-import.ts`.
//!
//! Parse a JSON-Lines document into validated assessments + grades.
//! Blank lines and `#`-prefixed comment lines are skipped silently.
//! Malformed JSON and schema-violating rows are collected as
//! rejections with stable 1-based line numbers.

use serde::{Deserialize, Serialize};

use crate::scoring::grader::grade_scorecard;
use crate::scoring::types::{AgileConsultingScorecardAssessment, GradeResult};

/// Accepted import.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AcceptedImport {
    /// Line number.
    pub line_number: usize,
    /// Assessment.
    pub assessment: AgileConsultingScorecardAssessment,
    /// Grade.
    pub grade: GradeResult,
}

/// Rejected import.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RejectedImport {
    /// Line number.
    pub line_number: usize,
    /// Raw line.
    pub raw_line: String,
    /// Error.
    pub error: String,
}

/// Bulk import result.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BulkImportResult {
    /// Accepted.
    pub accepted: Vec<AcceptedImport>,
    /// Rejected.
    pub rejected: Vec<RejectedImport>,
    /// Total lines.
    pub total_lines: usize,
    /// Skipped blank.
    pub skipped_blank: usize,
    /// Skipped comment.
    pub skipped_comment: usize,
}

/// Parse jsonl.
pub fn parse_jsonl(text: &str) -> BulkImportResult {
    // Match the TypeScript splitter: split on `\r?\n` and process every chunk.
    let lines: Vec<&str> = text.split('\n').map(|s| s.trim_end_matches('\r')).collect();
    let mut accepted: Vec<AcceptedImport> = Vec::new();
    let mut rejected: Vec<RejectedImport> = Vec::new();
    let mut skipped_blank = 0usize;
    let mut skipped_comment = 0usize;

    for (i, raw) in lines.iter().enumerate() {
        let line_number = i + 1;
        let trimmed = raw.trim();
        if trimmed.is_empty() {
            skipped_blank += 1;
            continue;
        }
        if trimmed.starts_with('#') {
            skipped_comment += 1;
            continue;
        }

        let parsed: Result<serde_json::Value, _> = serde_json::from_str(trimmed);
        let value = match parsed {
            Ok(v) => v,
            Err(e) => {
                rejected.push(RejectedImport {
                    line_number,
                    raw_line: (*raw).into(),
                    error: format!("JSON parse error: {e}"),
                });
                continue;
            }
        };

        let assessment_res: Result<AgileConsultingScorecardAssessment, _> =
            serde_json::from_value(value);
        let assessment = match assessment_res {
            Ok(a) => a,
            Err(e) => {
                rejected.push(RejectedImport {
                    line_number,
                    raw_line: (*raw).into(),
                    error: format!("schema validation failed: {e}"),
                });
                continue;
            }
        };

        let grade = grade_scorecard(&assessment);
        accepted.push(AcceptedImport { line_number, assessment, grade });
    }

    BulkImportResult {
        accepted,
        rejected,
        total_lines: lines.len(),
        skipped_blank,
        skipped_comment,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const GOLDEN: &str = include_str!("../../../samples/sample-assessment.json");

    fn one_line() -> String {
        // Collapse the multi-line golden JSON into a single line.
        let v: serde_json::Value = serde_json::from_str(GOLDEN).unwrap();
        serde_json::to_string(&v).unwrap()
    }

    #[test]
    fn empty_input_returns_empty_result() {
        let r = parse_jsonl("");
        assert_eq!(r.accepted.len(), 0);
        assert_eq!(r.rejected.len(), 0);
        assert_eq!(r.total_lines, 1);
        assert_eq!(r.skipped_blank, 1);
    }

    #[test]
    fn single_golden_line_is_accepted() {
        let r = parse_jsonl(&one_line());
        assert_eq!(r.accepted.len(), 1);
        assert_eq!(r.rejected.len(), 0);
        assert_eq!(r.accepted[0].line_number, 1);
        assert_eq!(r.accepted[0].grade.score_total, 9);
    }

    #[test]
    fn three_lines_accepted_with_correct_line_numbers() {
        let g = one_line();
        let text = format!("{g}\n{g}\n{g}");
        let r = parse_jsonl(&text);
        assert_eq!(r.accepted.len(), 3);
        assert_eq!(r.accepted.iter().map(|a| a.line_number).collect::<Vec<_>>(), vec![1, 2, 3]);
    }

    #[test]
    fn blank_and_comment_lines_are_skipped() {
        let g = one_line();
        let text = format!("# comment\n{g}\n\n   # indented comment\n{g}\n");
        let r = parse_jsonl(&text);
        assert_eq!(r.accepted.len(), 2);
        assert_eq!(r.skipped_blank, 2); // empty line + trailing newline
        assert_eq!(r.skipped_comment, 2);
        assert_eq!(r.accepted[0].line_number, 2);
        assert_eq!(r.accepted[1].line_number, 5);
    }

    #[test]
    fn malformed_json_is_rejected() {
        let r = parse_jsonl("{not valid json");
        assert_eq!(r.accepted.len(), 0);
        assert_eq!(r.rejected.len(), 1);
        assert!(r.rejected[0].error.contains("JSON parse error"));
    }

    #[test]
    fn mixed_input_keeps_line_numbers_stable() {
        let g = one_line();
        let text = format!("{g}\nnot json\n\n# comment\n{g}");
        let r = parse_jsonl(&text);
        assert_eq!(r.accepted.iter().map(|a| a.line_number).collect::<Vec<_>>(), vec![1, 5]);
        assert_eq!(r.rejected.iter().map(|r| r.line_number).collect::<Vec<_>>(), vec![2]);
        assert_eq!(r.skipped_blank, 1);
        assert_eq!(r.skipped_comment, 1);
    }
}
