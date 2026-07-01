-- Main NIPE screening record: one head-to-toe physical examination of a
-- baby, with context and baby identification, hip risk factors, the
-- observation fields for each of the four key screening components (eyes,
-- heart, hips, testes), the head-to-toe systematic-examination fields, and
-- optional practitioner-recorded per-component results. The computed
-- classification, the audit trail of fired grading rules, and the referral
-- flags live in dedicated child tables.

CREATE TABLE newborn_and_infant_physical_examination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and baby identification
    practitioner_name TEXT NOT NULL DEFAULT '',
    practitioner_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (practitioner_role IN ('midwife', 'neonatal-nurse', 'paediatrician', 'gp', 'nurse-practitioner', 'other', '')),
    examined_at TIMESTAMPTZ,
    examination_context VARCHAR(20) NOT NULL DEFAULT '' CHECK (examination_context IN ('newborn-72h', 'infant-6-8-week', '')),
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('maternity-ward', 'neonatal-unit', 'community', 'gp-surgery', 'home', 'other', '')),
    baby_identifier VARCHAR(100) NOT NULL DEFAULT '',
    baby_name VARCHAR(255) NOT NULL DEFAULT '',
    date_of_birth DATE,
    sex VARCHAR(15) NOT NULL DEFAULT '' CHECK (sex IN ('male', 'female', 'indeterminate', '')),
    gestational_age_weeks NUMERIC(4,1) CHECK (gestational_age_weeks IS NULL OR gestational_age_weeks >= 0),
    birth_weight_grams NUMERIC(6,1) CHECK (birth_weight_grams IS NULL OR birth_weight_grams >= 0),

    -- Hip risk factors
    breech_presentation VARCHAR(5) NOT NULL DEFAULT '' CHECK (breech_presentation IN ('yes', 'no', '')),
    family_history_hip_problems VARCHAR(5) NOT NULL DEFAULT '' CHECK (family_history_hip_problems IN ('yes', 'no', '')),
    antenatal_concerns TEXT NOT NULL DEFAULT '',

    -- Key component: eyes
    eyes_red_reflex_right VARCHAR(15) NOT NULL DEFAULT '' CHECK (eyes_red_reflex_right IN ('present', 'absent', 'not-examined', '')),
    eyes_red_reflex_left VARCHAR(15) NOT NULL DEFAULT '' CHECK (eyes_red_reflex_left IN ('present', 'absent', 'not-examined', '')),
    eyes_appearance VARCHAR(15) NOT NULL DEFAULT '' CHECK (eyes_appearance IN ('normal', 'abnormal', 'not-examined', '')),

    -- Key component: heart
    heart_murmur VARCHAR(15) NOT NULL DEFAULT '' CHECK (heart_murmur IN ('none', 'present', 'not-examined', '')),
    femoral_pulses_right VARCHAR(15) NOT NULL DEFAULT '' CHECK (femoral_pulses_right IN ('present', 'weak', 'absent', 'not-examined', '')),
    femoral_pulses_left VARCHAR(15) NOT NULL DEFAULT '' CHECK (femoral_pulses_left IN ('present', 'weak', 'absent', 'not-examined', '')),
    central_cyanosis VARCHAR(15) NOT NULL DEFAULT '' CHECK (central_cyanosis IN ('absent', 'present', 'not-examined', '')),
    oxygen_saturation_preductal NUMERIC(4,1) CHECK (oxygen_saturation_preductal IS NULL OR (oxygen_saturation_preductal >= 0 AND oxygen_saturation_preductal <= 100)),
    oxygen_saturation_postductal NUMERIC(4,1) CHECK (oxygen_saturation_postductal IS NULL OR (oxygen_saturation_postductal >= 0 AND oxygen_saturation_postductal <= 100)),

    -- Key component: hips
    barlow_test VARCHAR(15) NOT NULL DEFAULT '' CHECK (barlow_test IN ('negative', 'positive', 'not-examined', '')),
    ortolani_test VARCHAR(15) NOT NULL DEFAULT '' CHECK (ortolani_test IN ('negative', 'positive', 'not-examined', '')),
    hip_abduction VARCHAR(15) NOT NULL DEFAULT '' CHECK (hip_abduction IN ('normal', 'limited', 'not-examined', '')),

    -- Key component: testes
    testis_right VARCHAR(15) NOT NULL DEFAULT '' CHECK (testis_right IN ('descended', 'undescended', 'not-palpable', 'not-examined', '')),
    testis_left VARCHAR(15) NOT NULL DEFAULT '' CHECK (testis_left IN ('descended', 'undescended', 'not-palpable', 'not-examined', '')),

    -- Head-to-toe systematic examination (normal / abnormal / not-examined)
    general_appearance VARCHAR(15) NOT NULL DEFAULT '' CHECK (general_appearance IN ('normal', 'abnormal', 'not-examined', '')),
    skin VARCHAR(15) NOT NULL DEFAULT '' CHECK (skin IN ('normal', 'abnormal', 'not-examined', '')),
    head_and_fontanelles VARCHAR(15) NOT NULL DEFAULT '' CHECK (head_and_fontanelles IN ('normal', 'abnormal', 'not-examined', '')),
    face_and_palate VARCHAR(15) NOT NULL DEFAULT '' CHECK (face_and_palate IN ('normal', 'abnormal', 'not-examined', '')),
    neck_and_clavicles VARCHAR(15) NOT NULL DEFAULT '' CHECK (neck_and_clavicles IN ('normal', 'abnormal', 'not-examined', '')),
    chest_and_lungs VARCHAR(15) NOT NULL DEFAULT '' CHECK (chest_and_lungs IN ('normal', 'abnormal', 'not-examined', '')),
    abdomen VARCHAR(15) NOT NULL DEFAULT '' CHECK (abdomen IN ('normal', 'abnormal', 'not-examined', '')),
    genitalia VARCHAR(15) NOT NULL DEFAULT '' CHECK (genitalia IN ('normal', 'abnormal', 'not-examined', '')),
    anus_and_spine VARCHAR(15) NOT NULL DEFAULT '' CHECK (anus_and_spine IN ('normal', 'abnormal', 'not-examined', '')),
    limbs_and_digits VARCHAR(15) NOT NULL DEFAULT '' CHECK (limbs_and_digits IN ('normal', 'abnormal', 'not-examined', '')),
    feet VARCHAR(15) NOT NULL DEFAULT '' CHECK (feet IN ('normal', 'abnormal', 'not-examined', '')),
    tone_and_movement VARCHAR(15) NOT NULL DEFAULT '' CHECK (tone_and_movement IN ('normal', 'abnormal', 'not-examined', '')),

    -- Measurements
    weight_grams NUMERIC(6,1) CHECK (weight_grams IS NULL OR weight_grams >= 0),
    head_circumference_cm NUMERIC(4,1) CHECK (head_circumference_cm IS NULL OR head_circumference_cm >= 0),
    length_cm NUMERIC(4,1) CHECK (length_cm IS NULL OR length_cm >= 0),

    -- Optional practitioner-recorded per-component results (cross-checked
    -- against the engine)
    eyes_result_recorded VARCHAR(15) NOT NULL DEFAULT '' CHECK (eyes_result_recorded IN ('satisfactory', 'refer', 'not-examined', '')),
    heart_result_recorded VARCHAR(15) NOT NULL DEFAULT '' CHECK (heart_result_recorded IN ('satisfactory', 'refer', 'not-examined', '')),
    hips_result_recorded VARCHAR(15) NOT NULL DEFAULT '' CHECK (hips_result_recorded IN ('satisfactory', 'refer', 'not-examined', '')),
    testes_result_recorded VARCHAR(15) NOT NULL DEFAULT '' CHECK (testes_result_recorded IN ('satisfactory', 'refer', 'not-examined', 'not-applicable', '')),

    -- Free-text narrative
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX newborn_and_infant_physical_examination_patient_id_idx
    ON newborn_and_infant_physical_examination (patient_id);
CREATE INDEX newborn_and_infant_physical_examination_clinician_id_idx
    ON newborn_and_infant_physical_examination (clinician_id);

CREATE TRIGGER trigger_newborn_and_infant_physical_examination_updated_at
    BEFORE UPDATE ON newborn_and_infant_physical_examination
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE newborn_and_infant_physical_examination IS
    'Main NIPE screening record: one head-to-toe physical examination of a baby, with context and baby identification, hip risk factors, the observation fields for the four key screening components (eyes, heart, hips, testes), the head-to-toe systematic-examination fields, and optional practitioner-recorded per-component results. Classification, fired rules, and referral flags live in child tables.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.patient_id IS
    'Foreign key to the infant this examination documents (restrict delete).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinician_id IS
    'Foreign key to the examining practitioner (restrict delete); optional.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.practitioner_name IS
    'Name of the examining practitioner.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.practitioner_role IS
    'Examining practitioner role: midwife, neonatal-nurse, paediatrician, gp, nurse-practitioner, or other.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.examined_at IS
    'Date and time of the examination.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.examination_context IS
    'Screening context: newborn-72h (within 72 hours of birth) or infant-6-8-week (6-8 week infant review).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.care_setting IS
    'Care setting: maternity-ward, neonatal-unit, community, gp-surgery, home, or other.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.baby_identifier IS
    'NHS number or local identifier for the baby.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.baby_name IS
    'Name of the baby as recorded on the note.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.date_of_birth IS
    'Date of birth of the baby.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.sex IS
    'Sex of the baby: male, female, or indeterminate; drives whether the testes component is applicable.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.gestational_age_weeks IS
    'Completed gestational age in weeks at birth.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.birth_weight_grams IS
    'Birth weight in grams.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.breech_presentation IS
    'Whether the baby was breech at or after 36 weeks or at birth (yes/no); a hip risk factor.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.family_history_hip_problems IS
    'Whether there is a first-degree family history of hip problems (yes/no); a hip risk factor.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.antenatal_concerns IS
    'Free-text relevant antenatal findings or concerns.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.eyes_red_reflex_right IS
    'Eyes: right red reflex (present, absent, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.eyes_red_reflex_left IS
    'Eyes: left red reflex (present, absent, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.eyes_appearance IS
    'Eyes: overall appearance (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.heart_murmur IS
    'Heart: murmur (none, present, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.femoral_pulses_right IS
    'Heart: right femoral pulse (present, weak, absent, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.femoral_pulses_left IS
    'Heart: left femoral pulse (present, weak, absent, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.central_cyanosis IS
    'Heart: central cyanosis (absent, present, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.oxygen_saturation_preductal IS
    'Heart: pre-ductal oxygen saturation as a percentage.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.oxygen_saturation_postductal IS
    'Heart: post-ductal oxygen saturation as a percentage.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.barlow_test IS
    'Hips: Barlow test result (negative, positive, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.ortolani_test IS
    'Hips: Ortolani test result (negative, positive, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.hip_abduction IS
    'Hips: hip abduction (normal, limited, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.testis_right IS
    'Testes: right testis (descended, undescended, not-palpable, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.testis_left IS
    'Testes: left testis (descended, undescended, not-palpable, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.general_appearance IS
    'Head-to-toe: general appearance (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.skin IS
    'Head-to-toe: skin (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.head_and_fontanelles IS
    'Head-to-toe: head and fontanelles (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.face_and_palate IS
    'Head-to-toe: face and palate (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.neck_and_clavicles IS
    'Head-to-toe: neck and clavicles (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.chest_and_lungs IS
    'Head-to-toe: chest and lungs (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.abdomen IS
    'Head-to-toe: abdomen (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.genitalia IS
    'Head-to-toe: genitalia (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.anus_and_spine IS
    'Head-to-toe: anus and spine (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.limbs_and_digits IS
    'Head-to-toe: limbs and digits (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.feet IS
    'Head-to-toe: feet (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.tone_and_movement IS
    'Head-to-toe: tone and movement (normal, abnormal, or not-examined).';
COMMENT ON COLUMN newborn_and_infant_physical_examination.weight_grams IS
    'Measured weight in grams at the examination.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.head_circumference_cm IS
    'Measured head circumference in centimetres.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.length_cm IS
    'Measured length in centimetres.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.eyes_result_recorded IS
    'Optional practitioner-recorded eyes component result (satisfactory, refer, or not-examined); cross-checked against the engine.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.heart_result_recorded IS
    'Optional practitioner-recorded heart component result (satisfactory, refer, or not-examined); cross-checked against the engine.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.hips_result_recorded IS
    'Optional practitioner-recorded hips component result (satisfactory, refer, or not-examined); cross-checked against the engine.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.testes_result_recorded IS
    'Optional practitioner-recorded testes component result (satisfactory, refer, not-examined, or not-applicable); cross-checked against the engine.';
COMMENT ON COLUMN newborn_and_infant_physical_examination.clinical_note IS
    'Optional free-text clinical narrative shown in the summary.';
