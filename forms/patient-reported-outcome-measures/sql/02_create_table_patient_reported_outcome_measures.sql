-- One row per completed PRO-measure battery at one patient visit: visit
-- header plus raw responses for all 4 instruments (SF-36v2: 36 items,
-- NDI: 10 sections, mJOA: 6 subscales, EQ-5D-3L: 5 dimensions + VAS).
-- Computed scores live in the sibling
-- patient_reported_outcome_measures_score table (1:1).

CREATE TABLE patient_reported_outcome_measures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    -- Visit header
    subject_id VARCHAR(100) NOT NULL DEFAULT '',
    visit VARCHAR(100) NOT NULL DEFAULT '',
    assessment_date DATE,

    -- SF-36v2 (36 items, each nullable small integer on its own scale)
    general_health SMALLINT CHECK (general_health IS NULL OR general_health BETWEEN 1 AND 5),
    health_change_vs_year_ago SMALLINT CHECK (health_change_vs_year_ago IS NULL OR health_change_vs_year_ago BETWEEN 1 AND 5),
    vigorous_activities SMALLINT CHECK (vigorous_activities IS NULL OR vigorous_activities BETWEEN 1 AND 3),
    moderate_activities SMALLINT CHECK (moderate_activities IS NULL OR moderate_activities BETWEEN 1 AND 3),
    lifting_carrying_groceries SMALLINT CHECK (lifting_carrying_groceries IS NULL OR lifting_carrying_groceries BETWEEN 1 AND 3),
    climbing_several_flights SMALLINT CHECK (climbing_several_flights IS NULL OR climbing_several_flights BETWEEN 1 AND 3),
    climbing_one_flight SMALLINT CHECK (climbing_one_flight IS NULL OR climbing_one_flight BETWEEN 1 AND 3),
    bending_kneeling_stooping SMALLINT CHECK (bending_kneeling_stooping IS NULL OR bending_kneeling_stooping BETWEEN 1 AND 3),
    walking_more_than_mile SMALLINT CHECK (walking_more_than_mile IS NULL OR walking_more_than_mile BETWEEN 1 AND 3),
    walking_several_hundred_yards SMALLINT CHECK (walking_several_hundred_yards IS NULL OR walking_several_hundred_yards BETWEEN 1 AND 3),
    walking_one_hundred_yards SMALLINT CHECK (walking_one_hundred_yards IS NULL OR walking_one_hundred_yards BETWEEN 1 AND 3),
    bathing_dressing SMALLINT CHECK (bathing_dressing IS NULL OR bathing_dressing BETWEEN 1 AND 3),
    cut_down_time_physical SMALLINT CHECK (cut_down_time_physical IS NULL OR cut_down_time_physical BETWEEN 1 AND 5),
    accomplished_less_physical SMALLINT CHECK (accomplished_less_physical IS NULL OR accomplished_less_physical BETWEEN 1 AND 5),
    limited_in_kind_physical SMALLINT CHECK (limited_in_kind_physical IS NULL OR limited_in_kind_physical BETWEEN 1 AND 5),
    difficulty_performing_physical SMALLINT CHECK (difficulty_performing_physical IS NULL OR difficulty_performing_physical BETWEEN 1 AND 5),
    cut_down_time_emotional SMALLINT CHECK (cut_down_time_emotional IS NULL OR cut_down_time_emotional BETWEEN 1 AND 5),
    accomplished_less_emotional SMALLINT CHECK (accomplished_less_emotional IS NULL OR accomplished_less_emotional BETWEEN 1 AND 5),
    less_careful_than_usual SMALLINT CHECK (less_careful_than_usual IS NULL OR less_careful_than_usual BETWEEN 1 AND 5),
    social_activities_interference SMALLINT CHECK (social_activities_interference IS NULL OR social_activities_interference BETWEEN 1 AND 5),
    bodily_pain SMALLINT CHECK (bodily_pain IS NULL OR bodily_pain BETWEEN 1 AND 6),
    pain_interference_with_work SMALLINT CHECK (pain_interference_with_work IS NULL OR pain_interference_with_work BETWEEN 1 AND 5),
    felt_full_of_life SMALLINT CHECK (felt_full_of_life IS NULL OR felt_full_of_life BETWEEN 1 AND 5),
    very_nervous SMALLINT CHECK (very_nervous IS NULL OR very_nervous BETWEEN 1 AND 5),
    so_down_in_dumps SMALLINT CHECK (so_down_in_dumps IS NULL OR so_down_in_dumps BETWEEN 1 AND 5),
    felt_calm_peaceful SMALLINT CHECK (felt_calm_peaceful IS NULL OR felt_calm_peaceful BETWEEN 1 AND 5),
    lot_of_energy SMALLINT CHECK (lot_of_energy IS NULL OR lot_of_energy BETWEEN 1 AND 5),
    downhearted_depressed SMALLINT CHECK (downhearted_depressed IS NULL OR downhearted_depressed BETWEEN 1 AND 5),
    felt_worn_out SMALLINT CHECK (felt_worn_out IS NULL OR felt_worn_out BETWEEN 1 AND 5),
    been_happy SMALLINT CHECK (been_happy IS NULL OR been_happy BETWEEN 1 AND 5),
    felt_tired SMALLINT CHECK (felt_tired IS NULL OR felt_tired BETWEEN 1 AND 5),
    social_activities_interference_time SMALLINT CHECK (social_activities_interference_time IS NULL OR social_activities_interference_time BETWEEN 1 AND 5),
    get_sick_easier SMALLINT CHECK (get_sick_easier IS NULL OR get_sick_easier BETWEEN 1 AND 5),
    as_healthy_as_anybody SMALLINT CHECK (as_healthy_as_anybody IS NULL OR as_healthy_as_anybody BETWEEN 1 AND 5),
    expect_health_worse SMALLINT CHECK (expect_health_worse IS NULL OR expect_health_worse BETWEEN 1 AND 5),
    health_excellent SMALLINT CHECK (health_excellent IS NULL OR health_excellent BETWEEN 1 AND 5),

    -- Neck Disability Index (10 sections, 0-5 each)
    ndi_pain_intensity SMALLINT CHECK (ndi_pain_intensity IS NULL OR ndi_pain_intensity BETWEEN 0 AND 5),
    ndi_personal_care SMALLINT CHECK (ndi_personal_care IS NULL OR ndi_personal_care BETWEEN 0 AND 5),
    ndi_lifting SMALLINT CHECK (ndi_lifting IS NULL OR ndi_lifting BETWEEN 0 AND 5),
    ndi_reading SMALLINT CHECK (ndi_reading IS NULL OR ndi_reading BETWEEN 0 AND 5),
    ndi_headache SMALLINT CHECK (ndi_headache IS NULL OR ndi_headache BETWEEN 0 AND 5),
    ndi_concentration SMALLINT CHECK (ndi_concentration IS NULL OR ndi_concentration BETWEEN 0 AND 5),
    ndi_work SMALLINT CHECK (ndi_work IS NULL OR ndi_work BETWEEN 0 AND 5),
    ndi_driving SMALLINT CHECK (ndi_driving IS NULL OR ndi_driving BETWEEN 0 AND 5),
    ndi_sleeping SMALLINT CHECK (ndi_sleeping IS NULL OR ndi_sleeping BETWEEN 0 AND 5),
    ndi_recreation SMALLINT CHECK (ndi_recreation IS NULL OR ndi_recreation BETWEEN 0 AND 5),

    -- modified Japanese Orthopedic Association (6 subscales)
    mjoa_motor_arms SMALLINT CHECK (mjoa_motor_arms IS NULL OR mjoa_motor_arms BETWEEN 0 AND 4),
    mjoa_motor_legs SMALLINT CHECK (mjoa_motor_legs IS NULL OR mjoa_motor_legs BETWEEN 0 AND 4),
    mjoa_sensation_arms SMALLINT CHECK (mjoa_sensation_arms IS NULL OR mjoa_sensation_arms BETWEEN 0 AND 2),
    mjoa_sensation_legs SMALLINT CHECK (mjoa_sensation_legs IS NULL OR mjoa_sensation_legs BETWEEN 0 AND 2),
    mjoa_sensation_trunk SMALLINT CHECK (mjoa_sensation_trunk IS NULL OR mjoa_sensation_trunk BETWEEN 0 AND 2),
    mjoa_bladder_function SMALLINT CHECK (mjoa_bladder_function IS NULL OR mjoa_bladder_function BETWEEN 0 AND 3),

    -- EQ-5D-3L (5 dimensions, 1-3 each, plus 0-100 VAS)
    eq5d_mobility SMALLINT CHECK (eq5d_mobility IS NULL OR eq5d_mobility BETWEEN 1 AND 3),
    eq5d_self_care SMALLINT CHECK (eq5d_self_care IS NULL OR eq5d_self_care BETWEEN 1 AND 3),
    eq5d_usual_activities SMALLINT CHECK (eq5d_usual_activities IS NULL OR eq5d_usual_activities BETWEEN 1 AND 3),
    eq5d_pain_discomfort SMALLINT CHECK (eq5d_pain_discomfort IS NULL OR eq5d_pain_discomfort BETWEEN 1 AND 3),
    eq5d_anxiety_depression SMALLINT CHECK (eq5d_anxiety_depression IS NULL OR eq5d_anxiety_depression BETWEEN 1 AND 3),
    eq5d_vas_score NUMERIC CHECK (eq5d_vas_score IS NULL OR eq5d_vas_score BETWEEN 0 AND 100)
);

CREATE TRIGGER trigger_patient_reported_outcome_measures_updated_at
    BEFORE UPDATE ON patient_reported_outcome_measures
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE patient_reported_outcome_measures IS
    'One completed PRO-measure battery (SF-36v2, NDI, mJOA, EQ-5D-3L) at one patient visit; raw responses only, computed scores are in the sibling _score table.';
COMMENT ON COLUMN patient_reported_outcome_measures.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient_reported_outcome_measures.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN patient_reported_outcome_measures.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN patient_reported_outcome_measures.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN patient_reported_outcome_measures.subject_id IS
    'Research subject / patient identifier.';
COMMENT ON COLUMN patient_reported_outcome_measures.visit IS
    'Visit label, e.g. Baseline, 6-week, 3-month, 1-year.';
COMMENT ON COLUMN patient_reported_outcome_measures.assessment_date IS
    'Date this battery was completed.';
COMMENT ON COLUMN patient_reported_outcome_measures.general_health IS
    'SF-36 Q1: in general, would you say your health is (1 Excellent .. 5 Poor).';
COMMENT ON COLUMN patient_reported_outcome_measures.health_change_vs_year_ago IS
    'SF-36 Q2: compared to one year ago, health in general now (1 Much better .. 5 Much worse).';
COMMENT ON COLUMN patient_reported_outcome_measures.vigorous_activities IS
    'SF-36 Q3a: vigorous activities limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.moderate_activities IS
    'SF-36 Q3b: moderate activities limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.lifting_carrying_groceries IS
    'SF-36 Q3c: lifting or carrying groceries limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.climbing_several_flights IS
    'SF-36 Q3d: climbing several flights of stairs limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.climbing_one_flight IS
    'SF-36 Q3e: climbing one flight of stairs limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.bending_kneeling_stooping IS
    'SF-36 Q3f: bending, kneeling, or stooping limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.walking_more_than_mile IS
    'SF-36 Q3g: walking more than a mile limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.walking_several_hundred_yards IS
    'SF-36 Q3h: walking several hundred yards limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.walking_one_hundred_yards IS
    'SF-36 Q3i: walking one hundred yards limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.bathing_dressing IS
    'SF-36 Q3j: bathing or dressing yourself limitation (1 limited a lot .. 3 not limited).';
COMMENT ON COLUMN patient_reported_outcome_measures.cut_down_time_physical IS
    'SF-36 Q4a: cut down time on work/activities due to physical health (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.accomplished_less_physical IS
    'SF-36 Q4b: accomplished less than would like, due to physical health (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.limited_in_kind_physical IS
    'SF-36 Q4c: limited in the kind of work or activities, due to physical health (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.difficulty_performing_physical IS
    'SF-36 Q4d: had difficulty performing work/activities, due to physical health (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.cut_down_time_emotional IS
    'SF-36 Q5a: cut down time on work/activities due to emotional problems (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.accomplished_less_emotional IS
    'SF-36 Q5b: accomplished less than would like, due to emotional problems (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.less_careful_than_usual IS
    'SF-36 Q5c: did work/activities less carefully than usual, due to emotional problems (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.social_activities_interference IS
    'SF-36 Q6: extent physical/emotional problems interfered with normal social activities (1 Not at all .. 5 Extremely).';
COMMENT ON COLUMN patient_reported_outcome_measures.bodily_pain IS
    'SF-36 Q7: bodily pain in the past 4 weeks (1 None .. 6 Very severe).';
COMMENT ON COLUMN patient_reported_outcome_measures.pain_interference_with_work IS
    'SF-36 Q8: how much pain interfered with normal work (1 Not at all .. 5 Extremely).';
COMMENT ON COLUMN patient_reported_outcome_measures.felt_full_of_life IS
    'SF-36 Q9a: did you feel full of life (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.very_nervous IS
    'SF-36 Q9b: have you been very nervous (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.so_down_in_dumps IS
    'SF-36 Q9c: felt so down in the dumps nothing could cheer you up (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.felt_calm_peaceful IS
    'SF-36 Q9d: have you felt calm and peaceful (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.lot_of_energy IS
    'SF-36 Q9e: did you have a lot of energy (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.downhearted_depressed IS
    'SF-36 Q9f: have you felt downhearted and depressed (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.felt_worn_out IS
    'SF-36 Q9g: did you feel worn out (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.been_happy IS
    'SF-36 Q9h: have you been happy (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.felt_tired IS
    'SF-36 Q9i: did you feel tired (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.social_activities_interference_time IS
    'SF-36 Q10: how much of the time has health interfered with social activities (1 All of the time .. 5 None of the time).';
COMMENT ON COLUMN patient_reported_outcome_measures.get_sick_easier IS
    'SF-36 Q11a: I seem to get sick a little easier than other people (1 Definitely true .. 5 Definitely false).';
COMMENT ON COLUMN patient_reported_outcome_measures.as_healthy_as_anybody IS
    'SF-36 Q11b: I am as healthy as anybody I know (1 Definitely true .. 5 Definitely false).';
COMMENT ON COLUMN patient_reported_outcome_measures.expect_health_worse IS
    'SF-36 Q11c: I expect my health to get worse (1 Definitely true .. 5 Definitely false).';
COMMENT ON COLUMN patient_reported_outcome_measures.health_excellent IS
    'SF-36 Q11d: my health is excellent (1 Definitely true .. 5 Definitely false).';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_pain_intensity IS
    'NDI Section 1 (Pain Intensity), 0 (no pain) - 5 (worst imaginable).';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_personal_care IS
    'NDI Section 2 (Personal Care: washing, dressing, etc.), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_lifting IS
    'NDI Section 3 (Lifting), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_reading IS
    'NDI Section 4 (Reading), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_headache IS
    'NDI Section 5 (Headache), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_concentration IS
    'NDI Section 6 (Concentration), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_work IS
    'NDI Section 7 (Work), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_driving IS
    'NDI Section 8 (Driving), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_sleeping IS
    'NDI Section 9 (Sleeping), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.ndi_recreation IS
    'NDI Section 10 (Recreation), 0-5.';
COMMENT ON COLUMN patient_reported_outcome_measures.mjoa_motor_arms IS
    'mJOA Motor, arms subscale, 0 (unable to feed oneself) - 4 (no deficit).';
COMMENT ON COLUMN patient_reported_outcome_measures.mjoa_motor_legs IS
    'mJOA Motor, legs subscale, 0 (unable to walk) - 4 (no deficit).';
COMMENT ON COLUMN patient_reported_outcome_measures.mjoa_sensation_arms IS
    'mJOA Sensation, arms subscale, 0 (severe loss/pain) - 2 (no deficit).';
COMMENT ON COLUMN patient_reported_outcome_measures.mjoa_sensation_legs IS
    'mJOA Sensation, legs subscale, 0 (severe loss/pain) - 2 (no deficit).';
COMMENT ON COLUMN patient_reported_outcome_measures.mjoa_sensation_trunk IS
    'mJOA Sensation, trunk subscale, 0 (severe loss/pain) - 2 (no deficit).';
COMMENT ON COLUMN patient_reported_outcome_measures.mjoa_bladder_function IS
    'mJOA Bladder function subscale, 0 (unable to void) - 3 (no deficit).';
COMMENT ON COLUMN patient_reported_outcome_measures.eq5d_mobility IS
    'EQ-5D-3L Mobility dimension, 1 (no problems) - 3 (confined to bed).';
COMMENT ON COLUMN patient_reported_outcome_measures.eq5d_self_care IS
    'EQ-5D-3L Self-Care dimension, 1 (no problems) - 3 (unable to wash/dress).';
COMMENT ON COLUMN patient_reported_outcome_measures.eq5d_usual_activities IS
    'EQ-5D-3L Usual Activities dimension, 1 (no problems) - 3 (unable to perform).';
COMMENT ON COLUMN patient_reported_outcome_measures.eq5d_pain_discomfort IS
    'EQ-5D-3L Pain/Discomfort dimension, 1 (none) - 3 (extreme).';
COMMENT ON COLUMN patient_reported_outcome_measures.eq5d_anxiety_depression IS
    'EQ-5D-3L Anxiety/Depression dimension, 1 (not anxious/depressed) - 3 (extremely anxious/depressed).';
COMMENT ON COLUMN patient_reported_outcome_measures.eq5d_vas_score IS
    'EQ VAS: patient-rated current health state, 0 (worst imaginable) - 100 (best imaginable).';
