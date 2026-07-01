-- Main Ottawa Ankle Rules assessment record: identification, context, the
-- applicability flag, and the eight objective bedside criterion inputs (pain
-- zone, bone tenderness at four landmarks, and ability to bear weight). Each
-- finding is a yes/no/'' enum so an unanswered finding (''), a positive
-- finding ('yes'), and a negative finding ('no') are all distinguishable. The
-- two independent imaging decisions, the fired criteria, and the flags live in
-- dedicated child tables.

CREATE TABLE ottawa_ankle_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'amended', 'signed', '')),

    -- Context and identification
    patient_identifier VARCHAR(64) NOT NULL DEFAULT '',
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'minor-injury-unit', 'urgent-care', 'other', '')),
    injured_side VARCHAR(10) NOT NULL DEFAULT '' CHECK (injured_side IN ('left', 'right', '')),
    hours_since_injury NUMERIC(6,1),
    age_years INT,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Applicability
    assessment_reliable VARCHAR(5) NOT NULL DEFAULT '' CHECK (assessment_reliable IN ('yes', 'no', '')),

    -- Criterion inputs (each true only when 'yes')
    malleolar_zone_pain VARCHAR(5) NOT NULL DEFAULT '' CHECK (malleolar_zone_pain IN ('yes', 'no', '')),
    lateral_malleolus_tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (lateral_malleolus_tenderness IN ('yes', 'no', '')),
    medial_malleolus_tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (medial_malleolus_tenderness IN ('yes', 'no', '')),
    midfoot_zone_pain VARCHAR(5) NOT NULL DEFAULT '' CHECK (midfoot_zone_pain IN ('yes', 'no', '')),
    fifth_metatarsal_base_tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (fifth_metatarsal_base_tenderness IN ('yes', 'no', '')),
    navicular_tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (navicular_tenderness IN ('yes', 'no', '')),
    able_to_bear_weight_immediately VARCHAR(5) NOT NULL DEFAULT '' CHECK (able_to_bear_weight_immediately IN ('yes', 'no', '')),
    able_to_bear_weight_now VARCHAR(5) NOT NULL DEFAULT '' CHECK (able_to_bear_weight_now IN ('yes', 'no', '')),

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX ottawa_ankle_rules_patient_id_idx
    ON ottawa_ankle_rules (patient_id);
CREATE INDEX ottawa_ankle_rules_clinician_id_idx
    ON ottawa_ankle_rules (clinician_id);

CREATE TRIGGER trigger_ottawa_ankle_rules_updated_at
    BEFORE UPDATE ON ottawa_ankle_rules
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ottawa_ankle_rules IS
    'Main Ottawa Ankle Rules assessment record: identification, context, the applicability flag, and the eight objective bedside criterion inputs.';
COMMENT ON COLUMN ottawa_ankle_rules.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ottawa_ankle_rules.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ottawa_ankle_rules.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ottawa_ankle_rules.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ottawa_ankle_rules.patient_id IS
    'Foreign key to the patient being assessed (restricts delete).';
COMMENT ON COLUMN ottawa_ankle_rules.clinician_id IS
    'Foreign key to the assessing clinician (restricts delete).';
COMMENT ON COLUMN ottawa_ankle_rules.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN ottawa_ankle_rules.patient_identifier IS
    'Local patient identifier as recorded at the point of assessment.';
COMMENT ON COLUMN ottawa_ankle_rules.assessed_at IS
    'Date and time the assessment was carried out.';
COMMENT ON COLUMN ottawa_ankle_rules.care_setting IS
    'Care setting: emergency-department, minor-injury-unit, urgent-care, or other.';
COMMENT ON COLUMN ottawa_ankle_rules.injured_side IS
    'Injured side: left or right.';
COMMENT ON COLUMN ottawa_ankle_rules.hours_since_injury IS
    'Time elapsed since the injury, in hours.';
COMMENT ON COLUMN ottawa_ankle_rules.age_years IS
    'Patient age in years; ages below 18 raise an applicability flag.';
COMMENT ON COLUMN ottawa_ankle_rules.sex IS
    'Sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN ottawa_ankle_rules.assessment_reliable IS
    'Applicability: no intoxication, distracting injury, or sensory deficit that could invalidate the rule (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.malleolar_zone_pain IS
    'Ankle precondition: pain in the malleolar zone (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.lateral_malleolus_tenderness IS
    'Ankle criterion A1: bone tenderness at the posterior edge or tip of the lateral malleolus (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.medial_malleolus_tenderness IS
    'Ankle criterion A2: bone tenderness at the posterior edge or tip of the medial malleolus (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.midfoot_zone_pain IS
    'Foot precondition: pain in the midfoot zone (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.fifth_metatarsal_base_tenderness IS
    'Foot criterion F1: bone tenderness at the base of the fifth metatarsal (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.navicular_tenderness IS
    'Foot criterion F2: bone tenderness at the navicular (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.able_to_bear_weight_immediately IS
    'Able to bear weight (take four steps) immediately after the injury (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.able_to_bear_weight_now IS
    'Able to bear weight (take four steps) at the time of assessment (yes/no).';
COMMENT ON COLUMN ottawa_ankle_rules.clinical_notes IS
    'Free-text clinical notes captured alongside the assessment.';
