-- Hernia diagnostic evaluation: the payload of the 14-step single-page wizard.
--
-- Column groups follow the wizard steps in order. Unanswered text and enum
-- columns default to the empty string; unanswered numeric, date, and time
-- columns are NULL. See ../index.md for the wizard table and ../spec/index.md
-- for the contract.

CREATE TABLE hernia_diagnostic_evaluation (
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

    -- Step 3: presenting complaint and history
    duration_of_bulge VARCHAR(20) NOT NULL DEFAULT '' CHECK (duration_of_bulge IN ('less-than-1-week', '1-4-weeks', '1-6-months', '6-12-months', 'more-than-1-year', '')),
    pain_score_0_10 INTEGER CHECK (pain_score_0_10 IS NULL OR pain_score_0_10 BETWEEN 0 AND 10),
    pain_onset VARCHAR(10) NOT NULL DEFAULT '' CHECK (pain_onset IN ('sudden', 'gradual', '')),
    aggravated_by_straining VARCHAR(5) NOT NULL DEFAULT '' CHECK (aggravated_by_straining IN ('yes', 'no', '')),
    aggravated_by_lifting VARCHAR(5) NOT NULL DEFAULT '' CHECK (aggravated_by_lifting IN ('yes', 'no', '')),
    aggravated_by_coughing VARCHAR(5) NOT NULL DEFAULT '' CHECK (aggravated_by_coughing IN ('yes', 'no', '')),
    prior_hernia_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (prior_hernia_history IN ('yes', 'no', '')),
    prior_hernia_repair VARCHAR(5) NOT NULL DEFAULT '' CHECK (prior_hernia_repair IN ('yes', 'no', '')),
    prior_hernia_repair_mesh VARCHAR(10) NOT NULL DEFAULT '' CHECK (prior_hernia_repair_mesh IN ('mesh', 'no-mesh', 'unknown', '')),
    prior_hernia_repair_site VARCHAR(255) NOT NULL DEFAULT '',
    history_notes TEXT NOT NULL DEFAULT '',

    -- Step 4: risk factors
    risk_chronic_cough VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_chronic_cough IN ('yes', 'no', '')),
    risk_constipation_or_straining VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_constipation_or_straining IN ('yes', 'no', '')),
    risk_heavy_lifting_occupation VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_heavy_lifting_occupation IN ('yes', 'no', '')),
    risk_obesity VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_obesity IN ('yes', 'no', '')),
    risk_smoking VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_smoking IN ('yes', 'no', '')),
    risk_family_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_family_history IN ('yes', 'no', '')),
    risk_prior_abdominal_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_prior_abdominal_surgery IN ('yes', 'no', '')),
    risk_pregnancy VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_pregnancy IN ('yes', 'no', '')),
    risk_connective_tissue_disorder VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_connective_tissue_disorder IN ('yes', 'no', '')),
    risk_ascites VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_ascites IN ('yes', 'no', '')),
    risk_factors_notes TEXT NOT NULL DEFAULT '',

    -- Step 5: visual inspection
    inspection_location VARCHAR(20) NOT NULL DEFAULT '' CHECK (inspection_location IN ('groin', 'umbilical', 'epigastric', 'incisional', 'femoral', 'other', '')),
    inspection_location_other VARCHAR(255) NOT NULL DEFAULT '',
    bulge_visible_at_rest VARCHAR(5) NOT NULL DEFAULT '' CHECK (bulge_visible_at_rest IN ('yes', 'no', '')),
    bulge_enlarges_on_standing_or_straining VARCHAR(5) NOT NULL DEFAULT '' CHECK (bulge_enlarges_on_standing_or_straining IN ('yes', 'no', '')),
    skin_changes VARCHAR(20) NOT NULL DEFAULT '' CHECK (skin_changes IN ('none', 'erythema', 'discolouration', 'both', '')),
    inspection_notes TEXT NOT NULL DEFAULT '',

    -- Step 6: palpation and cough impulse
    palpable_mass VARCHAR(5) NOT NULL DEFAULT '' CHECK (palpable_mass IN ('yes', 'no', '')),
    cough_impulse_positive VARCHAR(5) NOT NULL DEFAULT '' CHECK (cough_impulse_positive IN ('yes', 'no', '')),
    tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (tenderness IN ('yes', 'no', '')),
    mass_size_as_cm NUMERIC(4,1) CHECK (mass_size_as_cm IS NULL OR mass_size_as_cm BETWEEN 0 AND 40),
    palpation_notes TEXT NOT NULL DEFAULT '',

    -- Step 7: reducibility assessment
    reducibility_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (reducibility_status IN ('reducible', 'irreducible', 'incarcerated', '')),
    reduces_spontaneously VARCHAR(5) NOT NULL DEFAULT '' CHECK (reduces_spontaneously IN ('yes', 'no', '')),
    reduces_with_manual_pressure VARCHAR(5) NOT NULL DEFAULT '' CHECK (reduces_with_manual_pressure IN ('yes', 'no', '')),
    does_not_reduce VARCHAR(5) NOT NULL DEFAULT '' CHECK (does_not_reduce IN ('yes', 'no', '')),
    reducibility_notes TEXT NOT NULL DEFAULT '',

    -- Step 8: red-flag / emergency symptom screen
    red_flag_severe_pain VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_severe_pain IN ('yes', 'no', '')),
    red_flag_vomiting VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_vomiting IN ('yes', 'no', '')),
    red_flag_fever VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_fever IN ('yes', 'no', '')),
    red_flag_absolute_constipation VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_absolute_constipation IN ('yes', 'no', '')),
    red_flag_erythema_or_discolouration VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_erythema_or_discolouration IN ('yes', 'no', '')),
    red_flag_previously_reducible_now_irreducible VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_previously_reducible_now_irreducible IN ('yes', 'no', '')),
    red_flag_tachycardia VARCHAR(5) NOT NULL DEFAULT '' CHECK (red_flag_tachycardia IN ('yes', 'no', '')),
    red_flag_notes TEXT NOT NULL DEFAULT '',

    -- Step 9: clinical classification
    hernia_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (hernia_type IN ('inguinal', 'femoral', 'umbilical', 'epigastric', 'incisional', 'paraumbilical', 'spigelian', 'other', '')),
    hernia_type_other VARCHAR(255) NOT NULL DEFAULT '',
    inguinal_subtype VARCHAR(15) NOT NULL DEFAULT '' CHECK (inguinal_subtype IN ('direct', 'indirect', 'pantaloon', 'uncertain', '')),
    laterality VARCHAR(10) NOT NULL DEFAULT '' CHECK (laterality IN ('left', 'right', 'bilateral', '')),
    ehs_size_grade VARCHAR(5) NOT NULL DEFAULT '' CHECK (ehs_size_grade IN ('1', '2', '3', '')),
    classification_notes TEXT NOT NULL DEFAULT '',

    -- Step 10: imaging
    ultrasound_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (ultrasound_performed IN ('yes', 'no', '')),
    ultrasound_findings VARCHAR(20) NOT NULL DEFAULT '' CHECK (ultrasound_findings IN ('confirms-hernia', 'no-hernia', 'inconclusive', '')),
    ct_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (ct_performed IN ('yes', 'no', '')),
    ct_findings VARCHAR(20) NOT NULL DEFAULT '' CHECK (ct_findings IN ('confirms-hernia', 'no-hernia', 'inconclusive', '')),
    mri_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (mri_performed IN ('yes', 'no', '')),
    mri_findings VARCHAR(20) NOT NULL DEFAULT '' CHECK (mri_findings IN ('confirms-hernia', 'no-hernia', 'inconclusive', '')),
    imaging_indication VARCHAR(30) NOT NULL DEFAULT '' CHECK (imaging_indication IN ('atypical-presentation', 'occult-suspicion', 'inconclusive-exam', 'pre-op-planning', 'not-indicated', '')),
    imaging_notes TEXT NOT NULL DEFAULT '',

    -- Step 11: differential diagnosis considered
    differential_lipoma VARCHAR(5) NOT NULL DEFAULT '' CHECK (differential_lipoma IN ('yes', 'no', '')),
    differential_lymphadenopathy VARCHAR(5) NOT NULL DEFAULT '' CHECK (differential_lymphadenopathy IN ('yes', 'no', '')),
    differential_hydrocele VARCHAR(5) NOT NULL DEFAULT '' CHECK (differential_hydrocele IN ('yes', 'no', '')),
    differential_undescended_testis VARCHAR(5) NOT NULL DEFAULT '' CHECK (differential_undescended_testis IN ('yes', 'no', '')),
    differential_femoral_aneurysm VARCHAR(5) NOT NULL DEFAULT '' CHECK (differential_femoral_aneurysm IN ('yes', 'no', '')),
    differential_abscess VARCHAR(5) NOT NULL DEFAULT '' CHECK (differential_abscess IN ('yes', 'no', '')),
    differential_other VARCHAR(255) NOT NULL DEFAULT '',
    differential_notes TEXT NOT NULL DEFAULT '',

    -- Step 12: functional impact
    pain_interferes_with_work_or_activity VARCHAR(5) NOT NULL DEFAULT '' CHECK (pain_interferes_with_work_or_activity IN ('yes', 'no', '')),
    functional_impact_scale_0_10 INTEGER CHECK (functional_impact_scale_0_10 IS NULL OR functional_impact_scale_0_10 BETWEEN 0 AND 10),
    activity_limitation VARCHAR(500) NOT NULL DEFAULT '',

    -- Step 13: management plan
    management_plan VARCHAR(25) NOT NULL DEFAULT '' CHECK (management_plan IN ('watchful-waiting', 'elective-repair-referral', 'urgent-referral', 'emergency-referral', 'conservative', '')),
    conservative_detail VARCHAR(255) NOT NULL DEFAULT '',
    referral_made VARCHAR(5) NOT NULL DEFAULT '' CHECK (referral_made IN ('yes', 'no', '')),
    referral_target_timeframe VARCHAR(20) NOT NULL DEFAULT '' CHECK (referral_target_timeframe IN ('same-day', 'immediate', 'within-2-weeks', 'within-6-weeks', 'within-18-weeks', '')),
    management_notes TEXT NOT NULL DEFAULT '',

    -- Step 14: summary and sign-off
    additional_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX hernia_diagnostic_evaluation_patient_id_index
    ON hernia_diagnostic_evaluation (patient_id);

CREATE INDEX hernia_diagnostic_evaluation_clinician_id_index
    ON hernia_diagnostic_evaluation (clinician_id);

CREATE INDEX hernia_diagnostic_evaluation_status_index
    ON hernia_diagnostic_evaluation (status);

CREATE INDEX hernia_diagnostic_evaluation_assessment_date_index
    ON hernia_diagnostic_evaluation (assessment_date);

CREATE TRIGGER trigger_hernia_diagnostic_evaluation_updated_at
    BEFORE UPDATE ON hernia_diagnostic_evaluation
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hernia_diagnostic_evaluation IS
    'Hernia diagnostic evaluation: the payload of the 14-step single-page wizard used to detect, classify, and grade the urgency of an abdominal-wall or groin hernia.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.clinician_id IS
    'Foreign key to the clinician table, i.e. the practitioner conducting the evaluation.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.status IS
    'Workflow status of the evaluation: draft, submitted, reviewed, or urgent.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.assessment_date IS
    'Date the evaluation was conducted.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.assessment_time IS
    'Time the evaluation was conducted.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.site_name IS
    'Site where the evaluation was conducted, such as the GP practice, surgical assessment unit, or emergency department.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.duration_of_bulge IS
    'How long the bulge has been present, such as for distinguishing an acute from a longstanding hernia.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.pain_score_0_10 IS
    'Pain intensity rated by the patient from 0 for none to 10 for the worst imaginable, contributing to the soon urgency band and the functional impact.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.pain_onset IS
    'Onset of the presenting pain: sudden or gradual, because a sudden onset is more suggestive of incarceration or strangulation.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.aggravated_by_straining IS
    'Whether the bulge or pain is aggravated by straining.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.aggravated_by_lifting IS
    'Whether the bulge or pain is aggravated by lifting.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.aggravated_by_coughing IS
    'Whether the bulge or pain is aggravated by coughing.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.prior_hernia_history IS
    'Whether the patient has a history of a hernia at this or another site.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.prior_hernia_repair IS
    'Whether the patient has had a prior hernia repair, such as for the recurrent-hernia safety flag.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.prior_hernia_repair_mesh IS
    'Whether the prior hernia repair used mesh, no mesh, or is unknown.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.prior_hernia_repair_site IS
    'Site and approximate date of the prior hernia repair, used to judge whether the current presentation is a recurrence at the same site.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.history_notes IS
    'Free-text notes about the presenting complaint and history.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_chronic_cough IS
    'Whether the patient has a chronic cough, a recognised hernia risk factor that raises intra-abdominal pressure.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_constipation_or_straining IS
    'Whether the patient has chronic constipation or straining at stool.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_heavy_lifting_occupation IS
    'Whether the patient has an occupation involving heavy lifting.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_obesity IS
    'Whether the patient is obese.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_smoking IS
    'Whether the patient smokes, which impairs collagen synthesis and wound healing.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_family_history IS
    'Whether the patient has a family history of hernia.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_prior_abdominal_surgery IS
    'Whether the patient has had prior abdominal surgery, relevant to incisional hernia risk.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_pregnancy IS
    'Whether the patient is pregnant, relevant to umbilical and inguinal hernia risk and to management options.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_connective_tissue_disorder IS
    'Whether the patient has a known connective-tissue disorder such as Ehlers-Danlos syndrome.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_ascites IS
    'Whether the patient has ascites, which raises intra-abdominal pressure and complicates repair.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.risk_factors_notes IS
    'Free-text notes about risk factors.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.inspection_location IS
    'Anatomical location of the bulge on visual inspection.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.inspection_location_other IS
    'Location detail when inspection_location is other.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.bulge_visible_at_rest IS
    'Whether the bulge is visible with the patient at rest.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.bulge_enlarges_on_standing_or_straining IS
    'Whether the bulge enlarges on standing or straining, the classic dynamic sign of a hernia.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.skin_changes IS
    'Skin changes over the bulge, such as erythema or discolouration, which are red-flag findings.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.inspection_notes IS
    'Free-text notes from the visual inspection.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.palpable_mass IS
    'Whether a mass is palpable on examination.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.cough_impulse_positive IS
    'Whether a cough impulse is elicited, i.e. a positive expansile impulse on coughing or Valsalva.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.tenderness IS
    'Whether the mass is tender on palpation, which raises concern for incarceration or strangulation.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.mass_size_as_cm IS
    'Size of the palpable mass in cm, contributing to the EHS size grade.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.palpation_notes IS
    'Free-text notes from palpation and the cough-impulse test.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.reducibility_status IS
    'Clinician judgement of reducibility: reducible, irreducible, or incarcerated. Drives the computed urgency band.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.reduces_spontaneously IS
    'Whether the hernia reduces spontaneously, such as on lying flat.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.reduces_with_manual_pressure IS
    'Whether the hernia reduces with gentle manual pressure.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.does_not_reduce IS
    'Whether the hernia does not reduce despite manual pressure.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.reducibility_notes IS
    'Free-text notes about the reducibility assessment.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.red_flag_severe_pain IS
    'Red flag: severe pain out of proportion to examination findings. Any positive red flag forces the computed urgency to emergency.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.red_flag_vomiting IS
    'Red flag: vomiting, suggestive of bowel obstruction.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.red_flag_fever IS
    'Red flag: fever, suggestive of strangulation or bowel ischaemia.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.red_flag_absolute_constipation IS
    'Red flag: absolute constipation with no passage of flatus, suggestive of complete bowel obstruction.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.red_flag_erythema_or_discolouration IS
    'Red flag: erythema or skin discolouration over the hernia, suggestive of strangulation.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.red_flag_previously_reducible_now_irreducible IS
    'Red flag: a previously reducible hernia that is now irreducible, a classic sign of new incarceration.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.red_flag_tachycardia IS
    'Red flag: tachycardia, a systemic sign of strangulation or sepsis.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.red_flag_notes IS
    'Free-text notes about the red-flag screen.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.hernia_type IS
    'Clinical hernia type: inguinal, femoral, umbilical, epigastric, incisional, paraumbilical, spigelian, or other.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.hernia_type_other IS
    'Hernia type detail when hernia_type is other.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.inguinal_subtype IS
    'European Hernia Society inguinal subtype: direct, indirect, pantaloon, or uncertain. Applies only when hernia_type is inguinal.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.laterality IS
    'Laterality: left, right, or bilateral.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.ehs_size_grade IS
    'European Hernia Society size grade: 1 for less than 2 cm, 2 for 2 to 4 cm, 3 for more than 4 cm.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.classification_notes IS
    'Free-text notes about the clinical classification.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.ultrasound_performed IS
    'Whether an ultrasound scan was performed.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.ultrasound_findings IS
    'Ultrasound findings: confirms the hernia, no hernia seen, or inconclusive.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.ct_performed IS
    'Whether a CT scan was performed.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.ct_findings IS
    'CT findings: confirms the hernia, no hernia seen, or inconclusive.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.mri_performed IS
    'Whether an MRI scan was performed.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.mri_findings IS
    'MRI findings: confirms the hernia, no hernia seen, or inconclusive.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.imaging_indication IS
    'Reason imaging was requested: atypical presentation, occult-hernia suspicion, inconclusive examination, or pre-operative planning.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.imaging_notes IS
    'Free-text notes about imaging.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.differential_lipoma IS
    'Whether lipoma was considered in the differential diagnosis.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.differential_lymphadenopathy IS
    'Whether lymphadenopathy was considered in the differential diagnosis.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.differential_hydrocele IS
    'Whether hydrocele was considered in the differential diagnosis.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.differential_undescended_testis IS
    'Whether undescended testis was considered in the differential diagnosis.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.differential_femoral_aneurysm IS
    'Whether femoral aneurysm was considered in the differential diagnosis.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.differential_abscess IS
    'Whether abscess was considered in the differential diagnosis.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.differential_other IS
    'Any other differential diagnosis considered.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.differential_notes IS
    'Free-text notes about the differential diagnosis.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.pain_interferes_with_work_or_activity IS
    'Whether pain interferes with work or activity.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.functional_impact_scale_0_10 IS
    'Overall functional impact rated from 0 for none to 10 for total, contributing to the soon urgency band.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.activity_limitation IS
    'Free-text description of activities the hernia limits.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.management_plan IS
    'Management plan: watchful waiting, elective repair referral, urgent referral, emergency referral, or conservative.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.conservative_detail IS
    'Detail of conservative management, such as a truss or lifestyle advice.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.referral_made IS
    'Whether a referral was made.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.referral_target_timeframe IS
    'Target timeframe for the referral to be seen, such as within 2 weeks or immediate.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.management_notes IS
    'Free-text notes about the management plan.';
COMMENT ON COLUMN hernia_diagnostic_evaluation.additional_notes IS
    'Additional free-text notes for the summary and sign-off.';
