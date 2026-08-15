-- Cataract diagnostic evaluation: the payload of the 15-step single-page
-- wizard.
--
-- Column groups follow the wizard steps in order. Unanswered text and enum
-- columns default to the empty string; unanswered numeric, date, and time
-- columns are NULL. Bilateral findings use paired _right / _left columns,
-- matching the precedent in ../../eye-vision-test-result/sql/. See
-- ../index.md for the wizard table and ../spec/index.md for the contract.

CREATE TABLE cataract_diagnostic_evaluation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent')),

    -- Step 1: clinician identification / appointment
    assessment_date DATE,
    assessment_time TIME,

    -- Step 3: presenting complaint & visual symptoms
    blurred_vision VARCHAR(5) NOT NULL DEFAULT '' CHECK (blurred_vision IN ('yes', 'no', '')),
    glare_or_halos VARCHAR(5) NOT NULL DEFAULT '' CHECK (glare_or_halos IN ('yes', 'no', '')),
    night_driving_difficulty VARCHAR(5) NOT NULL DEFAULT '' CHECK (night_driving_difficulty IN ('yes', 'no', '')),
    faded_colour_perception VARCHAR(5) NOT NULL DEFAULT '' CHECK (faded_colour_perception IN ('yes', 'no', '')),
    frequent_prescription_changes VARCHAR(5) NOT NULL DEFAULT '' CHECK (frequent_prescription_changes IN ('yes', 'no', '')),
    symptom_duration_months NUMERIC(5,1) CHECK (symptom_duration_months IS NULL OR symptom_duration_months >= 0),
    symptom_laterality VARCHAR(15) NOT NULL DEFAULT '' CHECK (symptom_laterality IN ('right-eye', 'left-eye', 'both-eyes', '')),
    presenting_complaint_notes TEXT NOT NULL DEFAULT '',

    -- Step 4: ocular & medical history
    history_diabetes VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_diabetes IN ('yes', 'no', '')),
    history_prior_eye_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_prior_eye_surgery IN ('yes', 'no', '')),
    history_prior_eye_surgery_detail VARCHAR(500) NOT NULL DEFAULT '',
    history_ocular_trauma VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_ocular_trauma IN ('yes', 'no', '')),
    history_uveitis VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_uveitis IN ('yes', 'no', '')),
    history_steroid_use VARCHAR(15) NOT NULL DEFAULT '' CHECK (history_steroid_use IN ('none', 'systemic', 'topical', 'both', '')),
    history_family_cataract VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_family_cataract IN ('yes', 'no', '')),
    history_smoking_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (history_smoking_status IN ('never', 'former', 'current', '')),
    history_high_uv_exposure VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_high_uv_exposure IN ('yes', 'no', '')),
    history_high_myopia VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_high_myopia IN ('yes', 'no', '')),
    medical_history_notes TEXT NOT NULL DEFAULT '',

    -- Step 5: visual acuity per eye
    unaided_va_logmar_right NUMERIC(4,2) CHECK (unaided_va_logmar_right IS NULL OR unaided_va_logmar_right BETWEEN -0.30 AND 3.00),
    unaided_va_logmar_left NUMERIC(4,2) CHECK (unaided_va_logmar_left IS NULL OR unaided_va_logmar_left BETWEEN -0.30 AND 3.00),
    unaided_va_snellen_right VARCHAR(20) NOT NULL DEFAULT '',
    unaided_va_snellen_left VARCHAR(20) NOT NULL DEFAULT '',
    best_corrected_va_logmar_right NUMERIC(4,2) CHECK (best_corrected_va_logmar_right IS NULL OR best_corrected_va_logmar_right BETWEEN -0.30 AND 3.00),
    best_corrected_va_logmar_left NUMERIC(4,2) CHECK (best_corrected_va_logmar_left IS NULL OR best_corrected_va_logmar_left BETWEEN -0.30 AND 3.00),
    best_corrected_va_snellen_right VARCHAR(20) NOT NULL DEFAULT '',
    best_corrected_va_snellen_left VARCHAR(20) NOT NULL DEFAULT '',
    pinhole_va_logmar_right NUMERIC(4,2) CHECK (pinhole_va_logmar_right IS NULL OR pinhole_va_logmar_right BETWEEN -0.30 AND 3.00),
    pinhole_va_logmar_left NUMERIC(4,2) CHECK (pinhole_va_logmar_left IS NULL OR pinhole_va_logmar_left BETWEEN -0.30 AND 3.00),
    pinhole_va_snellen_right VARCHAR(20) NOT NULL DEFAULT '',
    pinhole_va_snellen_left VARCHAR(20) NOT NULL DEFAULT '',

    -- Step 6: refraction
    refraction_sphere_right NUMERIC(4,2),
    refraction_sphere_left NUMERIC(4,2),
    refraction_cylinder_right NUMERIC(4,2),
    refraction_cylinder_left NUMERIC(4,2),
    refraction_axis_right INTEGER CHECK (refraction_axis_right IS NULL OR refraction_axis_right BETWEEN 0 AND 180),
    refraction_axis_left INTEGER CHECK (refraction_axis_left IS NULL OR refraction_axis_left BETWEEN 0 AND 180),
    refraction_stability VARCHAR(10) NOT NULL DEFAULT '' CHECK (refraction_stability IN ('stable', 'changing', '')),

    -- Step 7: slit-lamp examination / LOCS III grading per eye
    locs_iii_no_right NUMERIC(2,1) CHECK (locs_iii_no_right IS NULL OR locs_iii_no_right BETWEEN 0.1 AND 6.9),
    locs_iii_no_left NUMERIC(2,1) CHECK (locs_iii_no_left IS NULL OR locs_iii_no_left BETWEEN 0.1 AND 6.9),
    locs_iii_nc_right NUMERIC(2,1) CHECK (locs_iii_nc_right IS NULL OR locs_iii_nc_right BETWEEN 0.1 AND 6.9),
    locs_iii_nc_left NUMERIC(2,1) CHECK (locs_iii_nc_left IS NULL OR locs_iii_nc_left BETWEEN 0.1 AND 6.9),
    locs_iii_c_right NUMERIC(2,1) CHECK (locs_iii_c_right IS NULL OR locs_iii_c_right BETWEEN 0.1 AND 5.9),
    locs_iii_c_left NUMERIC(2,1) CHECK (locs_iii_c_left IS NULL OR locs_iii_c_left BETWEEN 0.1 AND 5.9),
    locs_iii_p_right NUMERIC(2,1) CHECK (locs_iii_p_right IS NULL OR locs_iii_p_right BETWEEN 0.1 AND 5.9),
    locs_iii_p_left NUMERIC(2,1) CHECK (locs_iii_p_left IS NULL OR locs_iii_p_left BETWEEN 0.1 AND 5.9),
    cataract_type_right VARCHAR(25) NOT NULL DEFAULT '' CHECK (cataract_type_right IN ('nuclear', 'cortical', 'posterior-subcapsular', 'mixed', 'none', '')),
    cataract_type_left VARCHAR(25) NOT NULL DEFAULT '' CHECK (cataract_type_left IN ('nuclear', 'cortical', 'posterior-subcapsular', 'mixed', 'none', '')),
    anterior_chamber_depth_right VARCHAR(10) NOT NULL DEFAULT '' CHECK (anterior_chamber_depth_right IN ('normal', 'shallow', 'deep', '')),
    anterior_chamber_depth_left VARCHAR(10) NOT NULL DEFAULT '' CHECK (anterior_chamber_depth_left IN ('normal', 'shallow', 'deep', '')),
    corneal_clarity_right VARCHAR(10) NOT NULL DEFAULT '' CHECK (corneal_clarity_right IN ('clear', 'hazy', 'scarred', '')),
    corneal_clarity_left VARCHAR(10) NOT NULL DEFAULT '' CHECK (corneal_clarity_left IN ('clear', 'hazy', 'scarred', '')),
    pupil_reaction_right VARCHAR(10) NOT NULL DEFAULT '' CHECK (pupil_reaction_right IN ('normal', 'sluggish', 'fixed', '')),
    pupil_reaction_left VARCHAR(10) NOT NULL DEFAULT '' CHECK (pupil_reaction_left IN ('normal', 'sluggish', 'fixed', '')),

    -- Step 8: glare testing
    glare_acuity_result_right VARCHAR(20) NOT NULL DEFAULT '',
    glare_acuity_result_left VARCHAR(20) NOT NULL DEFAULT '',
    glare_functional_impact VARCHAR(10) NOT NULL DEFAULT '' CHECK (glare_functional_impact IN ('none', 'mild', 'moderate', 'severe', '')),

    -- Step 9: tonometry
    intraocular_pressure_right_mmhg NUMERIC(4,1) CHECK (intraocular_pressure_right_mmhg IS NULL OR intraocular_pressure_right_mmhg BETWEEN 0 AND 100),
    intraocular_pressure_left_mmhg NUMERIC(4,1) CHECK (intraocular_pressure_left_mmhg IS NULL OR intraocular_pressure_left_mmhg BETWEEN 0 AND 100),
    tonometry_method VARCHAR(15) NOT NULL DEFAULT '' CHECK (tonometry_method IN ('goldmann', 'non-contact', 'icare', 'other', '')),

    -- Step 10: dilated fundus examination
    dilated_fundus_exam_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (dilated_fundus_exam_performed IN ('yes', 'no', '')),
    optic_disc_cup_disc_ratio_right NUMERIC(3,2) CHECK (optic_disc_cup_disc_ratio_right IS NULL OR optic_disc_cup_disc_ratio_right BETWEEN 0 AND 1),
    optic_disc_cup_disc_ratio_left NUMERIC(3,2) CHECK (optic_disc_cup_disc_ratio_left IS NULL OR optic_disc_cup_disc_ratio_left BETWEEN 0 AND 1),
    macula_findings_right VARCHAR(20) NOT NULL DEFAULT '' CHECK (macula_findings_right IN ('normal', 'amd-suspected', 'other', '')),
    macula_findings_left VARCHAR(20) NOT NULL DEFAULT '' CHECK (macula_findings_left IN ('normal', 'amd-suspected', 'other', '')),
    retinal_findings_right TEXT NOT NULL DEFAULT '',
    retinal_findings_left TEXT NOT NULL DEFAULT '',
    view_obscured_by_cataract_right VARCHAR(5) NOT NULL DEFAULT '' CHECK (view_obscured_by_cataract_right IN ('yes', 'no', '')),
    view_obscured_by_cataract_left VARCHAR(5) NOT NULL DEFAULT '' CHECK (view_obscured_by_cataract_left IN ('yes', 'no', '')),

    -- Step 11: differential / competing-pathology screen
    glaucoma_suspected VARCHAR(5) NOT NULL DEFAULT '' CHECK (glaucoma_suspected IN ('yes', 'no', '')),
    glaucoma_notes TEXT NOT NULL DEFAULT '',
    amd_suspected VARCHAR(5) NOT NULL DEFAULT '' CHECK (amd_suspected IN ('yes', 'no', '')),
    amd_notes TEXT NOT NULL DEFAULT '',
    diabetic_retinopathy_suspected VARCHAR(5) NOT NULL DEFAULT '' CHECK (diabetic_retinopathy_suspected IN ('yes', 'no', '')),
    diabetic_retinopathy_notes TEXT NOT NULL DEFAULT '',

    -- Step 12: biometry (surgical planning)
    biometry_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (biometry_performed IN ('yes', 'no', '')),
    axial_length_right_mm NUMERIC(4,2) CHECK (axial_length_right_mm IS NULL OR axial_length_right_mm BETWEEN 15 AND 40),
    axial_length_left_mm NUMERIC(4,2) CHECK (axial_length_left_mm IS NULL OR axial_length_left_mm BETWEEN 15 AND 40),
    keratometry_k1_right NUMERIC(5,2),
    keratometry_k1_left NUMERIC(5,2),
    keratometry_k2_right NUMERIC(5,2),
    keratometry_k2_left NUMERIC(5,2),
    oct_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (oct_performed IN ('yes', 'no', '')),
    oct_findings TEXT NOT NULL DEFAULT '',
    calculated_iol_power_right NUMERIC(4,2),
    calculated_iol_power_left NUMERIC(4,2),

    -- Step 13: functional & quality-of-life impact
    functional_difficulty_reading INTEGER CHECK (functional_difficulty_reading IS NULL OR functional_difficulty_reading BETWEEN 0 AND 4),
    functional_difficulty_driving INTEGER CHECK (functional_difficulty_driving IS NULL OR functional_difficulty_driving BETWEEN 0 AND 4),
    functional_difficulty_daily_activities INTEGER CHECK (functional_difficulty_daily_activities IS NULL OR functional_difficulty_daily_activities BETWEEN 0 AND 4),
    functional_impact_notes TEXT NOT NULL DEFAULT '',

    -- Step 14: management plan
    management_recommendation VARCHAR(30) NOT NULL DEFAULT '' CHECK (management_recommendation IN ('monitor', 'spectacle-change', 'surgical-referral-routine', 'surgical-referral-urgent', '')),
    eye_for_surgery VARCHAR(10) NOT NULL DEFAULT '' CHECK (eye_for_surgery IN ('right', 'left', 'both', 'none', '')),
    risks_benefits_counselled VARCHAR(5) NOT NULL DEFAULT '' CHECK (risks_benefits_counselled IN ('yes', 'no', '')),
    consent_discussed VARCHAR(5) NOT NULL DEFAULT '' CHECK (consent_discussed IN ('yes', 'no', '')),
    management_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_cataract_diagnostic_evaluation_updated_at
    BEFORE UPDATE ON cataract_diagnostic_evaluation
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cataract_diagnostic_evaluation IS
    'Cataract diagnostic evaluation: the payload of the 15-step single-page wizard.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.clinician_id IS
    'Foreign key to the clinician table.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.status IS
    'Evaluation lifecycle status: draft, submitted, reviewed, or urgent.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.assessment_date IS
    'Date the evaluation was performed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.assessment_time IS
    'Time the evaluation was performed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.blurred_vision IS
    'Presenting symptom: blurred vision.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.glare_or_halos IS
    'Presenting symptom: glare or halos around lights.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.night_driving_difficulty IS
    'Presenting symptom: difficulty with night driving.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.faded_colour_perception IS
    'Presenting symptom: faded or yellowed colour perception.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.frequent_prescription_changes IS
    'Presenting symptom: frequent spectacle prescription changes.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.symptom_duration_months IS
    'Duration of presenting symptoms in months, such as for the rapid-progression safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.symptom_laterality IS
    'Whether the presenting symptoms affect the right eye, the left eye, or both.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.presenting_complaint_notes IS
    'Free-text notes on the presenting complaint.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_diabetes IS
    'Ocular/medical history: diabetes mellitus.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_prior_eye_surgery IS
    'Ocular/medical history: prior eye surgery.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_prior_eye_surgery_detail IS
    'Detail of prior eye surgery, such as procedure and eye.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_ocular_trauma IS
    'Ocular/medical history: prior ocular trauma.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_uveitis IS
    'Ocular/medical history: uveitis.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_steroid_use IS
    'Steroid use: none, systemic, topical, or both, a recognised risk factor for cataract.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_family_cataract IS
    'Family history of cataract.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_smoking_status IS
    'Smoking status: never, former, or current, a recognised risk factor for cataract.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_high_uv_exposure IS
    'History of high ultraviolet light exposure, a recognised risk factor for cataract.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.history_high_myopia IS
    'History of high myopia, a recognised risk factor for early cataract and for retinal detachment.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.medical_history_notes IS
    'Free-text notes on ocular and medical history.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.unaided_va_logmar_right IS
    'Unaided (uncorrected) visual acuity for the right eye, LogMAR.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.unaided_va_logmar_left IS
    'Unaided (uncorrected) visual acuity for the left eye, LogMAR.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.unaided_va_snellen_right IS
    'Unaided (uncorrected) visual acuity for the right eye, Snellen-equivalent text (e.g. 6/12).';
COMMENT ON COLUMN cataract_diagnostic_evaluation.unaided_va_snellen_left IS
    'Unaided (uncorrected) visual acuity for the left eye, Snellen-equivalent text (e.g. 6/12).';
COMMENT ON COLUMN cataract_diagnostic_evaluation.best_corrected_va_logmar_right IS
    'Best-corrected visual acuity for the right eye, LogMAR, used in the surgical-candidacy computation.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.best_corrected_va_logmar_left IS
    'Best-corrected visual acuity for the left eye, LogMAR, used in the surgical-candidacy computation.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.best_corrected_va_snellen_right IS
    'Best-corrected visual acuity for the right eye, Snellen-equivalent text (e.g. 6/12).';
COMMENT ON COLUMN cataract_diagnostic_evaluation.best_corrected_va_snellen_left IS
    'Best-corrected visual acuity for the left eye, Snellen-equivalent text (e.g. 6/12).';
COMMENT ON COLUMN cataract_diagnostic_evaluation.pinhole_va_logmar_right IS
    'Pinhole visual acuity for the right eye, LogMAR, such as for distinguishing refractive error from lenticular/pathological cause.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.pinhole_va_logmar_left IS
    'Pinhole visual acuity for the left eye, LogMAR, such as for distinguishing refractive error from lenticular/pathological cause.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.pinhole_va_snellen_right IS
    'Pinhole visual acuity for the right eye, Snellen-equivalent text.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.pinhole_va_snellen_left IS
    'Pinhole visual acuity for the left eye, Snellen-equivalent text.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.refraction_sphere_right IS
    'Current spectacle prescription sphere power, right eye, dioptres.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.refraction_sphere_left IS
    'Current spectacle prescription sphere power, left eye, dioptres.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.refraction_cylinder_right IS
    'Current spectacle prescription cylinder power, right eye, dioptres.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.refraction_cylinder_left IS
    'Current spectacle prescription cylinder power, left eye, dioptres.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.refraction_axis_right IS
    'Current spectacle prescription cylinder axis, right eye, degrees 0-180.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.refraction_axis_left IS
    'Current spectacle prescription cylinder axis, left eye, degrees 0-180.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.refraction_stability IS
    'Whether the refraction is stable or changing, such as for the frequent-prescription-changes symptom.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.locs_iii_no_right IS
    'LOCS III Nuclear Opalescence subscore, right eye, 0.1 to 6.9, per Chylack et al. 1993.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.locs_iii_no_left IS
    'LOCS III Nuclear Opalescence subscore, left eye, 0.1 to 6.9, per Chylack et al. 1993.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.locs_iii_nc_right IS
    'LOCS III Nuclear Colour subscore, right eye, 0.1 to 6.9, per Chylack et al. 1993.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.locs_iii_nc_left IS
    'LOCS III Nuclear Colour subscore, left eye, 0.1 to 6.9, per Chylack et al. 1993.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.locs_iii_c_right IS
    'LOCS III Cortical cataract subscore, right eye, 0.1 to 5.9, per Chylack et al. 1993.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.locs_iii_c_left IS
    'LOCS III Cortical cataract subscore, left eye, 0.1 to 5.9, per Chylack et al. 1993.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.locs_iii_p_right IS
    'LOCS III Posterior Subcapsular cataract subscore, right eye, 0.1 to 5.9, per Chylack et al. 1993.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.locs_iii_p_left IS
    'LOCS III Posterior Subcapsular cataract subscore, left eye, 0.1 to 5.9, per Chylack et al. 1993.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.cataract_type_right IS
    'Predominant cataract morphology, right eye: nuclear, cortical, posterior-subcapsular, mixed, or none.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.cataract_type_left IS
    'Predominant cataract morphology, left eye: nuclear, cortical, posterior-subcapsular, mixed, or none.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.anterior_chamber_depth_right IS
    'Anterior chamber depth assessment, right eye: normal, shallow, or deep.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.anterior_chamber_depth_left IS
    'Anterior chamber depth assessment, left eye: normal, shallow, or deep.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.corneal_clarity_right IS
    'Corneal clarity, right eye: clear, hazy, or scarred.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.corneal_clarity_left IS
    'Corneal clarity, left eye: clear, hazy, or scarred.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.pupil_reaction_right IS
    'Pupil reaction, right eye: normal, sluggish, or fixed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.pupil_reaction_left IS
    'Pupil reaction, left eye: normal, sluggish, or fixed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.glare_acuity_result_right IS
    'Glare-testing acuity result, right eye, as text (e.g. Snellen-equivalent under glare conditions).';
COMMENT ON COLUMN cataract_diagnostic_evaluation.glare_acuity_result_left IS
    'Glare-testing acuity result, left eye, as text (e.g. Snellen-equivalent under glare conditions).';
COMMENT ON COLUMN cataract_diagnostic_evaluation.glare_functional_impact IS
    'Functional impact of glare on the patient''s daily life: none, mild, moderate, or severe; a severe impact independently indicates surgical candidacy.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.intraocular_pressure_right_mmhg IS
    'Intraocular pressure, right eye, mmHg; above 21 mmHg raises the raised-iop safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.intraocular_pressure_left_mmhg IS
    'Intraocular pressure, left eye, mmHg; above 21 mmHg raises the raised-iop safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.tonometry_method IS
    'Tonometry method: goldmann, non-contact, icare, or other.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.dilated_fundus_exam_performed IS
    'Whether a dilated fundus examination was performed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.optic_disc_cup_disc_ratio_right IS
    'Optic disc cup:disc ratio, right eye, 0 to 1.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.optic_disc_cup_disc_ratio_left IS
    'Optic disc cup:disc ratio, left eye, 0 to 1.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.macula_findings_right IS
    'Macula findings, right eye: normal, amd-suspected, or other.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.macula_findings_left IS
    'Macula findings, left eye: normal, amd-suspected, or other.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.retinal_findings_right IS
    'Free-text retinal findings, right eye.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.retinal_findings_left IS
    'Free-text retinal findings, left eye.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.view_obscured_by_cataract_right IS
    'Whether the cataract is too dense to allow fundus assessment, right eye; combined with a dilated exam not performed, raises the view-obscured-fundus-not-assessed safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.view_obscured_by_cataract_left IS
    'Whether the cataract is too dense to allow fundus assessment, left eye; combined with a dilated exam not performed, raises the view-obscured-fundus-not-assessed safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.glaucoma_suspected IS
    'Differential screen: glaucoma suspected, contributing to the competing-pathology-suspected safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.glaucoma_notes IS
    'Free-text notes on the glaucoma differential.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.amd_suspected IS
    'Differential screen: age-related macular degeneration suspected, contributing to the competing-pathology-suspected safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.amd_notes IS
    'Free-text notes on the age-related macular degeneration differential.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.diabetic_retinopathy_suspected IS
    'Differential screen: diabetic retinopathy suspected, contributing to the competing-pathology-suspected safety flag.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.diabetic_retinopathy_notes IS
    'Free-text notes on the diabetic retinopathy differential.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.biometry_performed IS
    'Whether biometry for intraocular lens (IOL) surgical planning was performed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.axial_length_right_mm IS
    'Axial length, right eye, mm, for IOL power calculation.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.axial_length_left_mm IS
    'Axial length, left eye, mm, for IOL power calculation.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.keratometry_k1_right IS
    'Corneal topography keratometry K1 reading, right eye, dioptres.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.keratometry_k1_left IS
    'Corneal topography keratometry K1 reading, left eye, dioptres.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.keratometry_k2_right IS
    'Corneal topography keratometry K2 reading, right eye, dioptres.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.keratometry_k2_left IS
    'Corneal topography keratometry K2 reading, left eye, dioptres.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.oct_performed IS
    'Whether optical coherence tomography (OCT) was performed.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.oct_findings IS
    'Free-text OCT findings.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.calculated_iol_power_right IS
    'Calculated intraocular lens (IOL) power, right eye, dioptres, if available.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.calculated_iol_power_left IS
    'Calculated intraocular lens (IOL) power, left eye, dioptres, if available.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.functional_difficulty_reading IS
    'Self-reported difficulty with reading, 0 (none) to 4 (severe); part of the functional/quality-of-life composite score.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.functional_difficulty_driving IS
    'Self-reported difficulty with driving, 0 (none) to 4 (severe); part of the functional/quality-of-life composite score.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.functional_difficulty_daily_activities IS
    'Self-reported difficulty with daily activities, 0 (none) to 4 (severe); part of the functional/quality-of-life composite score.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.functional_impact_notes IS
    'Free-text notes on functional and quality-of-life impact.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.management_recommendation IS
    'Management recommendation: monitor, spectacle-change, surgical-referral-routine, or surgical-referral-urgent.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.eye_for_surgery IS
    'Eye(s) recommended for surgery: right, left, both, or none.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.risks_benefits_counselled IS
    'Whether the patient was counselled on the risks and benefits of surgery.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.consent_discussed IS
    'Whether a consent discussion took place.';
COMMENT ON COLUMN cataract_diagnostic_evaluation.management_notes IS
    'Free-text notes on the management plan.';
