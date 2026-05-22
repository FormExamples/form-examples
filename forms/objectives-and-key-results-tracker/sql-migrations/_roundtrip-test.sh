#!/bin/sh
# Roundtrip test: drop & recreate okr_roundtrip DB, apply all migrations,
# insert one full objective + KRs + check-in + grade + rule + flag, select back.
set -eu

DB=okr_roundtrip
HERE="$(cd "$(dirname "$0")" && pwd)"

dropdb --if-exists "$DB"
createdb "$DB"

for f in "$HERE"/0?_*.sql; do
    echo "Applying $f"
    psql -d "$DB" -v ON_ERROR_STOP=1 -f "$f"
done

psql -d "$DB" -v ON_ERROR_STOP=1 <<'SQL'
INSERT INTO reporter (id, name, email, role)
VALUES ('11111111-1111-1111-1111-111111111111', 'Alice Chen', 'alice@example.com', 'team-lead');

INSERT INTO okr_objective (id, reporter_id, status, level, cycle,
    cycle_start_date, cycle_end_date, obj_title, obj_long_description,
    score_by_progress_percent, score_by_confidence_decile, score_by_stretch_tier,
    score_by_alignment_grade, score_by_impact_tier, score_by_smart_quality,
    score_by_pace_deviation_percent)
VALUES ('22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'active', 'team', 'quarterly',
    DATE '2026-04-01', DATE '2026-06-30',
    'Reduce customer churn by 30%', 'Q2 priority for retention team',
    47.0, 6, 1, 4, 5, 4, -15.0);

INSERT INTO participant (okr_objective_id, role, name, email)
VALUES ('22222222-2222-2222-2222-222222222222', 'dri', 'Alice Chen', 'alice@example.com');

INSERT INTO okr_key_result (okr_objective_id, position, title, kr_type,
    unit, start_value, current_value, target_value, progress_fraction)
VALUES ('22222222-2222-2222-2222-222222222222', 1, 'Lift NPS from 32 to 50',
    'numeric', 'points', 32, 43, 50, 0.6111);

INSERT INTO okr_check_in (okr_objective_id, narrative,
    confidence_decile_at_check_in)
VALUES ('22222222-2222-2222-2222-222222222222', 'Pilot results positive', 7);

INSERT INTO okr_grade (id, okr_objective_id,
    score_by_progress_percent, score_by_confidence_decile, score_by_stretch_tier,
    score_by_alignment_grade, score_by_impact_tier, score_by_smart_quality,
    score_by_pace_deviation_percent,
    computed_composite_rag, final_composite_rag,
    recommendation, signed_by, signed_at)
VALUES ('33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    47.0, 6, 1, 4, 5, 4, -15.0,
    'amber', 'amber',
    'continue', 'Alice Chen', now());

INSERT INTO okr_grade_rule (okr_grade_id, rule_id, instrument, grade, category, description)
VALUES ('33333333-3333-3333-3333-333333333333', 'R-COMPOSITE-AMBER',
    'composite', 'amber', 'composite',
    'Composite RAG is amber: progress mid-band, pace slightly behind.');

INSERT INTO okr_grade_flag (okr_grade_id, flag_code, priority, description)
VALUES ('33333333-3333-3333-3333-333333333333', 'pace-collapse', 'high',
    'Pace deviation -15% — within tolerance but trending behind.');

-- Verify roundtrip
SELECT (SELECT COUNT(*) FROM okr_objective)    AS objectives,
       (SELECT COUNT(*) FROM okr_key_result)   AS key_results,
       (SELECT COUNT(*) FROM okr_check_in)     AS check_ins,
       (SELECT COUNT(*) FROM okr_grade)        AS grades,
       (SELECT COUNT(*) FROM okr_grade_rule)   AS rules,
       (SELECT COUNT(*) FROM okr_grade_flag)   AS flags;
SQL

echo "OK: roundtrip succeeded"
