-- Hip-replacement surgery evaluation: the payload of the 15-step single-page
-- wizard, i.e. the orthopaedic assessment of whether a patient's hip disease
-- and functional decline justify total hip arthroplasty and whether
-- conservative options have been exhausted.
--
-- Column groups follow the wizard steps in order. Unanswered text and enum
-- columns default to the empty string; unanswered numeric, date, and time
-- columns are NULL. See ../index.md for the wizard table and ../spec/index.md
-- for the contract.

CREATE TABLE hip_replacement_surgery_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent')),

    -- Step 1: clinician identification
    assessment_date DATE,
    assessment_time TIME,
    site_name VARCHAR(255) NOT NULL DEFAULT '',

    -- Step 3: presenting history
    affected_side VARCHAR(10) NOT NULL DEFAULT '' CHECK (affected_side IN ('left', 'right', 'bilateral', '')),
    symptom_duration_months INTEGER CHECK (symptom_duration_months IS NULL OR symptom_duration_months BETWEEN 0 AND 600),
    pain_at_rest_0_10 INTEGER CHECK (pain_at_rest_0_10 IS NULL OR pain_at_rest_0_10 BETWEEN 0 AND 10),
    pain_on_activity_0_10 INTEGER CHECK (pain_on_activity_0_10 IS NULL OR pain_on_activity_0_10 BETWEEN 0 AND 10),
    night_pain VARCHAR(5) NOT NULL DEFAULT '' CHECK (night_pain IN ('yes', 'no', '')),
    prior_hip_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (prior_hip_surgery IN ('yes', 'no', '')),
    prior_hip_surgery_detail TEXT NOT NULL DEFAULT '',
    prior_injury_or_dysplasia_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (prior_injury_or_dysplasia_history IN ('yes', 'no', '')),
    prior_injury_or_dysplasia_detail TEXT NOT NULL DEFAULT '',

    -- Step 4: Oxford Hip Score (OHS), 12 items, each 0 (worst) to 4 (best)
    ohs_pain_severity SMALLINT CHECK (ohs_pain_severity IS NULL OR ohs_pain_severity BETWEEN 0 AND 4),
    ohs_washing_and_drying SMALLINT CHECK (ohs_washing_and_drying IS NULL OR ohs_washing_and_drying BETWEEN 0 AND 4),
    ohs_transport SMALLINT CHECK (ohs_transport IS NULL OR ohs_transport BETWEEN 0 AND 4),
    ohs_dressing_socks SMALLINT CHECK (ohs_dressing_socks IS NULL OR ohs_dressing_socks BETWEEN 0 AND 4),
    ohs_shopping SMALLINT CHECK (ohs_shopping IS NULL OR ohs_shopping BETWEEN 0 AND 4),
    ohs_walking_pain SMALLINT CHECK (ohs_walking_pain IS NULL OR ohs_walking_pain BETWEEN 0 AND 4),
    ohs_limping SMALLINT CHECK (ohs_limping IS NULL OR ohs_limping BETWEEN 0 AND 4),
    ohs_kneeling SMALLINT CHECK (ohs_kneeling IS NULL OR ohs_kneeling BETWEEN 0 AND 4),
    ohs_night_pain SMALLINT CHECK (ohs_night_pain IS NULL OR ohs_night_pain BETWEEN 0 AND 4),
    ohs_work_interference SMALLINT CHECK (ohs_work_interference IS NULL OR ohs_work_interference BETWEEN 0 AND 4),
    ohs_giving_way SMALLINT CHECK (ohs_giving_way IS NULL OR ohs_giving_way BETWEEN 0 AND 4),
    ohs_stairs SMALLINT CHECK (ohs_stairs IS NULL OR ohs_stairs BETWEEN 0 AND 4),

    -- Step 5: functional limitations
    walking_distance_before_pain VARCHAR(15) NOT NULL DEFAULT '' CHECK (walking_distance_before_pain IN ('unlimited', 'over-1km', '100m-to-1km', 'under-100m', 'housebound', '')),
    shoes_and_socks_difficulty VARCHAR(10) NOT NULL DEFAULT '' CHECK (shoes_and_socks_difficulty IN ('none', 'some', 'severe', 'unable', '')),
    walking_aid_use VARCHAR(15) NOT NULL DEFAULT '' CHECK (walking_aid_use IN ('none', 'stick', 'frame', 'wheelchair', '')),

    -- Step 6: physical examination — gait and biomechanical
    limp_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (limp_present IN ('yes', 'no', '')),
    antalgic_gait VARCHAR(5) NOT NULL DEFAULT '' CHECK (antalgic_gait IN ('yes', 'no', '')),
    trendelenburg_sign VARCHAR(5) NOT NULL DEFAULT '' CHECK (trendelenburg_sign IN ('yes', 'no', '')),
    leg_length_discrepancy_as_cm NUMERIC(3,1) CHECK (leg_length_discrepancy_as_cm IS NULL OR leg_length_discrepancy_as_cm BETWEEN 0 AND 15),

    -- Step 7: physical examination — range of motion
    flexion_degrees INTEGER CHECK (flexion_degrees IS NULL OR flexion_degrees BETWEEN 0 AND 150),
    internal_rotation_degrees INTEGER CHECK (internal_rotation_degrees IS NULL OR internal_rotation_degrees BETWEEN 0 AND 60),
    external_rotation_degrees INTEGER CHECK (external_rotation_degrees IS NULL OR external_rotation_degrees BETWEEN 0 AND 60),
    abduction_degrees INTEGER CHECK (abduction_degrees IS NULL OR abduction_degrees BETWEEN 0 AND 60),
    adduction_degrees INTEGER CHECK (adduction_degrees IS NULL OR adduction_degrees BETWEEN 0 AND 45),
    fixed_flexion_deformity_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (fixed_flexion_deformity_present IN ('yes', 'no', '')),

    -- Step 8: physical examination — stability and muscle strength
    hip_abductor_strength_mrc SMALLINT CHECK (hip_abductor_strength_mrc IS NULL OR hip_abductor_strength_mrc BETWEEN 0 AND 5),
    joint_stability VARCHAR(10) NOT NULL DEFAULT '' CHECK (joint_stability IN ('stable', 'unstable', '')),
    tenderness_site VARCHAR(15) NOT NULL DEFAULT '' CHECK (tenderness_site IN ('none', 'groin', 'trochanteric', 'buttock', 'other', '')),

    -- Step 9: diagnostic imaging
    weight_bearing_xray_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (weight_bearing_xray_performed IN ('yes', 'no', '')),
    kellgren_lawrence_grade SMALLINT CHECK (kellgren_lawrence_grade IS NULL OR kellgren_lawrence_grade BETWEEN 0 AND 4),
    joint_space_narrowing VARCHAR(10) NOT NULL DEFAULT '' CHECK (joint_space_narrowing IN ('none', 'mild', 'moderate', 'severe', '')),
    subchondral_sclerosis_or_cysts_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (subchondral_sclerosis_or_cysts_present IN ('yes', 'no', '')),
    mri_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (mri_performed IN ('yes', 'no', '')),
    mri_findings TEXT NOT NULL DEFAULT '',
    ct_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (ct_performed IN ('yes', 'no', '')),
    ct_indication VARCHAR(30) NOT NULL DEFAULT '' CHECK (ct_indication IN ('none', 'robotic-assisted-planning', 'complex-deformity', 'other', '')),

    -- Step 10: conservative treatment audit
    physiotherapy_tried VARCHAR(5) NOT NULL DEFAULT '' CHECK (physiotherapy_tried IN ('yes', 'no', '')),
    physiotherapy_duration_weeks INTEGER CHECK (physiotherapy_duration_weeks IS NULL OR physiotherapy_duration_weeks BETWEEN 0 AND 260),
    weight_management_advice_given VARCHAR(5) NOT NULL DEFAULT '' CHECK (weight_management_advice_given IN ('yes', 'no', '')),
    steroid_injection_given VARCHAR(5) NOT NULL DEFAULT '' CHECK (steroid_injection_given IN ('yes', 'no', '')),
    steroid_injection_count INTEGER CHECK (steroid_injection_count IS NULL OR steroid_injection_count BETWEEN 0 AND 20),
    steroid_injection_response VARCHAR(15) NOT NULL DEFAULT '' CHECK (steroid_injection_response IN ('no-relief', 'partial-relief', 'good-relief', '')),
    analgesic_trial_given VARCHAR(5) NOT NULL DEFAULT '' CHECK (analgesic_trial_given IN ('yes', 'no', '')),
    analgesic_trial_response VARCHAR(15) NOT NULL DEFAULT '' CHECK (analgesic_trial_response IN ('no-relief', 'partial-relief', 'good-relief', '')),
    walking_aid_trial VARCHAR(5) NOT NULL DEFAULT '' CHECK (walking_aid_trial IN ('yes', 'no', '')),
    conservative_measures_exhausted VARCHAR(5) NOT NULL DEFAULT '' CHECK (conservative_measures_exhausted IN ('yes', 'no', '')),

    -- Step 11: general health and surgical fitness screen
    diabetes_controlled VARCHAR(20) NOT NULL DEFAULT '' CHECK (diabetes_controlled IN ('not-diabetic', 'controlled', 'poorly-controlled', '')),
    cardiac_disease_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (cardiac_disease_present IN ('yes', 'no', '')),
    bleeding_disorder_or_anticoagulant_use VARCHAR(5) NOT NULL DEFAULT '' CHECK (bleeding_disorder_or_anticoagulant_use IN ('yes', 'no', '')),
    smoking_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (smoking_status IN ('never', 'ex-smoker', 'current-smoker', '')),
    general_fitness_note TEXT NOT NULL DEFAULT '',

    -- Step 12: pre-operative baseline bloods and tests
    full_blood_count_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (full_blood_count_done IN ('yes', 'no', '')),
    renal_function_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (renal_function_done IN ('yes', 'no', '')),
    clotting_or_inr_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (clotting_or_inr_done IN ('yes', 'no', '')),
    ecg_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (ecg_done IN ('yes', 'no', '')),
    mrsa_screen_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (mrsa_screen_done IN ('yes', 'no', '')),
    urinalysis_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (urinalysis_done IN ('yes', 'no', '')),

    -- Step 13: shared decision-making
    risks_and_benefits_discussed VARCHAR(5) NOT NULL DEFAULT '' CHECK (risks_and_benefits_discussed IN ('yes', 'no', '')),
    realistic_expectations_discussed VARCHAR(5) NOT NULL DEFAULT '' CHECK (realistic_expectations_discussed IN ('yes', 'no', '')),
    patient_decision_aid_given VARCHAR(5) NOT NULL DEFAULT '' CHECK (patient_decision_aid_given IN ('yes', 'no', '')),
    interpreter_required VARCHAR(5) NOT NULL DEFAULT '' CHECK (interpreter_required IN ('yes', 'no', '')),
    interpreter_language VARCHAR(100) NOT NULL DEFAULT '',

    -- Step 14: management plan and recommendation
    recommendation VARCHAR(35) NOT NULL DEFAULT '' CHECK (recommendation IN ('total-hip-replacement', 'hip-resurfacing', 'continue-conservative-management', 'mdt-review', 'not-currently-a-candidate', '')),
    target_list_date DATE,
    responsible_surgeon VARCHAR(255) NOT NULL DEFAULT '',

    -- Step 15: summary notes (computed and signed-off values live in
    -- hip_replacement_surgery_evaluation_grade)
    additional_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX hip_replacement_surgery_evaluation_patient_id_index
    ON hip_replacement_surgery_evaluation (patient_id);

CREATE INDEX hip_replacement_surgery_evaluation_clinician_id_index
    ON hip_replacement_surgery_evaluation (clinician_id);

CREATE INDEX hip_replacement_surgery_evaluation_status_index
    ON hip_replacement_surgery_evaluation (status);

CREATE INDEX hip_replacement_surgery_evaluation_assessment_date_index
    ON hip_replacement_surgery_evaluation (assessment_date);

CREATE TRIGGER trigger_hip_replacement_surgery_evaluation_updated_at
    BEFORE UPDATE ON hip_replacement_surgery_evaluation
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hip_replacement_surgery_evaluation IS
    'Hip-replacement surgery evaluation: the payload of the 15-step single-page wizard, i.e. the orthopaedic assessment of whether a patient''s hip disease and functional decline justify total hip arthroplasty and whether conservative options have been exhausted.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.clinician_id IS
    'Foreign key to the clinician table, i.e. the practitioner conducting the evaluation.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.status IS
    'Workflow status of the evaluation: draft, submitted, reviewed, or urgent.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.assessment_date IS
    'Date the evaluation was conducted.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.assessment_time IS
    'Time the evaluation was conducted.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.site_name IS
    'Site where the evaluation was conducted, such as the joint-replacement clinic.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.affected_side IS
    'Hip side affected: left, right, or bilateral.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.symptom_duration_months IS
    'Duration of hip symptoms in months.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.pain_at_rest_0_10 IS
    'Pain severity at rest, 0 (none) to 10 (worst imaginable).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.pain_on_activity_0_10 IS
    'Pain severity on activity, 0 (none) to 10 (worst imaginable).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.night_pain IS
    'Whether the patient reports night pain.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.prior_hip_surgery IS
    'Whether the patient has had prior surgery on the affected hip.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.prior_hip_surgery_detail IS
    'Description of any prior hip surgery, such as arthroscopy or osteotomy.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.prior_injury_or_dysplasia_history IS
    'Whether the patient has a history of prior hip injury or developmental dysplasia of the hip.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.prior_injury_or_dysplasia_detail IS
    'Description of the prior hip injury or dysplasia history.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_pain_severity IS
    'Oxford Hip Score item 1: usual hip pain severity, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_washing_and_drying IS
    'Oxford Hip Score item 2: difficulty washing and drying yourself because of your hip, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_transport IS
    'Oxford Hip Score item 3: difficulty getting in and out of a car, or using public transport, because of your hip, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_dressing_socks IS
    'Oxford Hip Score item 4: difficulty putting on a pair of socks or stockings because of your hip, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_shopping IS
    'Oxford Hip Score item 5: ability to do the household shopping on your own, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_walking_pain IS
    'Oxford Hip Score item 6: pain experienced walking, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_limping IS
    'Oxford Hip Score item 7: limping when walking because of your hip, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_kneeling IS
    'Oxford Hip Score item 8: difficulty kneeling and getting up again afterwards because of your hip, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_night_pain IS
    'Oxford Hip Score item 9: how often has hip pain troubled you in bed at night, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_work_interference IS
    'Oxford Hip Score item 10: how much has hip pain interfered with your usual work, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_giving_way IS
    'Oxford Hip Score item 11: how often has the hip felt like it might suddenly give way or let you down, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ohs_stairs IS
    'Oxford Hip Score item 12: ability to walk down a flight of stairs, 0 (worst) to 4 (best).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.walking_distance_before_pain IS
    'Walking distance before pain forces a stop: unlimited, over 1km, 100m to 1km, under 100m, or housebound.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.shoes_and_socks_difficulty IS
    'Difficulty putting on shoes and socks: none, some, severe, or unable.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.walking_aid_use IS
    'Walking aid in use: none, stick, frame, or wheelchair.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.limp_present IS
    'Whether a limp is present on examination.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.antalgic_gait IS
    'Whether an antalgic (pain-avoiding) gait is present on examination.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.trendelenburg_sign IS
    'Whether the Trendelenburg sign is positive, indicating hip abductor weakness relevant to surgical planning.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.leg_length_discrepancy_as_cm IS
    'Measured leg-length discrepancy in cm; greater than 2cm affects surgical planning.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.flexion_degrees IS
    'Hip flexion range of motion in degrees.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.internal_rotation_degrees IS
    'Hip internal rotation range of motion in degrees.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.external_rotation_degrees IS
    'Hip external rotation range of motion in degrees.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.abduction_degrees IS
    'Hip abduction range of motion in degrees.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.adduction_degrees IS
    'Hip adduction range of motion in degrees.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.fixed_flexion_deformity_present IS
    'Whether a fixed flexion deformity is present on examination.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.hip_abductor_strength_mrc IS
    'Hip abductor muscle strength on the Medical Research Council (MRC) 0 to 5 scale.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.joint_stability IS
    'Joint stability on examination: stable or unstable.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.tenderness_site IS
    'Site of tenderness on examination: none, groin, trochanteric, buttock, or other.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.weight_bearing_xray_performed IS
    'Whether a weight-bearing pelvic or hip X-ray was performed.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.kellgren_lawrence_grade IS
    'Kellgren and Lawrence radiographic osteoarthritis grade, 0 (none) to 4 (severe).';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.joint_space_narrowing IS
    'Degree of joint-space narrowing on imaging: none, mild, moderate, or severe.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.subchondral_sclerosis_or_cysts_present IS
    'Whether subchondral sclerosis or cysts are present on imaging.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.mri_performed IS
    'Whether an MRI was performed.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.mri_findings IS
    'Free-text MRI findings.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ct_performed IS
    'Whether a CT scan was performed.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ct_indication IS
    'Indication for the CT scan, such as robotic-assisted surgical planning or a complex deformity.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.physiotherapy_tried IS
    'Whether physiotherapy has been tried as a conservative measure.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.physiotherapy_duration_weeks IS
    'Duration of the physiotherapy trial in weeks.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.weight_management_advice_given IS
    'Whether weight-management advice has been given as a conservative measure.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.steroid_injection_given IS
    'Whether an intra-articular steroid injection has been given as a conservative measure.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.steroid_injection_count IS
    'Number of intra-articular steroid injections given.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.steroid_injection_response IS
    'Response to the intra-articular steroid injection: no relief, partial relief, or good relief.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.analgesic_trial_given IS
    'Whether a trial of NSAID or other analgesic medication has been given as a conservative measure.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.analgesic_trial_response IS
    'Response to the analgesic trial: no relief, partial relief, or good relief.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.walking_aid_trial IS
    'Whether a walking-aid trial has been given as a conservative measure.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.conservative_measures_exhausted IS
    'Whether all appropriate conservative measures have been exhausted, i.e. the primary gate on surgical candidacy alongside the Oxford Hip Score and the Kellgren and Lawrence grade.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.diabetes_controlled IS
    'Diabetes control status: not diabetic, controlled, or poorly controlled.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.cardiac_disease_present IS
    'Whether cardiac disease is present.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.bleeding_disorder_or_anticoagulant_use IS
    'Whether a bleeding disorder is present or an anticoagulant medicine is in use.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.smoking_status IS
    'Smoking status: never, ex-smoker, or current smoker.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.general_fitness_note IS
    'Free-text general surgical-fitness note. Detailed ASA grading belongs to the pre-operative assessment forms, not here.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.full_blood_count_done IS
    'Whether a full blood count has been done as part of the pre-operative baseline.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.renal_function_done IS
    'Whether renal function tests have been done as part of the pre-operative baseline.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.clotting_or_inr_done IS
    'Whether clotting studies or INR have been done as part of the pre-operative baseline.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.ecg_done IS
    'Whether an ECG has been done as part of the pre-operative baseline.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.mrsa_screen_done IS
    'Whether an MRSA screen has been done as part of the pre-operative baseline.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.urinalysis_done IS
    'Whether urinalysis has been done as part of the pre-operative baseline.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.risks_and_benefits_discussed IS
    'Whether the risks and benefits of surgery have been discussed with the patient.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.realistic_expectations_discussed IS
    'Whether realistic expectations of surgical outcome have been discussed with the patient.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.patient_decision_aid_given IS
    'Whether a patient decision aid has been given.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.interpreter_required IS
    'Whether an interpreter is required for shared decision-making.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.interpreter_language IS
    'Language the interpreter is required for.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.recommendation IS
    'Clinician recommendation: total hip replacement, hip resurfacing, continue conservative management, MDT review, or not currently a candidate.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.target_list_date IS
    'Target date to add the patient to the surgical waiting list, where applicable.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.responsible_surgeon IS
    'Name of the surgeon responsible for the planned procedure.';
COMMENT ON COLUMN hip_replacement_surgery_evaluation.additional_notes IS
    'Free-text summary notes.';
