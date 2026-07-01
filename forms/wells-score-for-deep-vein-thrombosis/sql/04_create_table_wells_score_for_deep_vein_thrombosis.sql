-- Main Wells DVT assessment record: identification, context, and the nine
-- clinical criterion inputs plus the alternative-diagnosis adjustment. Each
-- criterion is a yes/no/'' enum, scored as present (+1) only when 'yes'; the
-- alternative-diagnosis input subtracts 2. The computed score, bands, fired
-- rules, and flags live in dedicated child tables.

CREATE TABLE wells_score_for_deep_vein_thrombosis (
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
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'ambulatory', 'acute-medical-unit', 'dvt-clinic', 'other', '')),
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-64', '65-74', '75-84', '85-plus', '')),
    symptomatic_leg VARCHAR(10) NOT NULL DEFAULT '' CHECK (symptomatic_leg IN ('left', 'right', '')),

    -- Criterion inputs (each +1 when 'yes'), plus the -2 adjustment
    active_cancer VARCHAR(5) NOT NULL DEFAULT '' CHECK (active_cancer IN ('yes', 'no', '')),
    paralysis_or_immobilisation VARCHAR(5) NOT NULL DEFAULT '' CHECK (paralysis_or_immobilisation IN ('yes', 'no', '')),
    recently_bedridden_or_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (recently_bedridden_or_surgery IN ('yes', 'no', '')),
    localised_tenderness VARCHAR(5) NOT NULL DEFAULT '' CHECK (localised_tenderness IN ('yes', 'no', '')),
    entire_leg_swollen VARCHAR(5) NOT NULL DEFAULT '' CHECK (entire_leg_swollen IN ('yes', 'no', '')),
    calf_swelling_over_3cm VARCHAR(5) NOT NULL DEFAULT '' CHECK (calf_swelling_over_3cm IN ('yes', 'no', '')),
    pitting_oedema VARCHAR(5) NOT NULL DEFAULT '' CHECK (pitting_oedema IN ('yes', 'no', '')),
    collateral_superficial_veins VARCHAR(5) NOT NULL DEFAULT '' CHECK (collateral_superficial_veins IN ('yes', 'no', '')),
    previously_documented_dvt VARCHAR(5) NOT NULL DEFAULT '' CHECK (previously_documented_dvt IN ('yes', 'no', '')),
    alternative_diagnosis_as_likely VARCHAR(5) NOT NULL DEFAULT '' CHECK (alternative_diagnosis_as_likely IN ('yes', 'no', '')),

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX wells_score_for_deep_vein_thrombosis_patient_id_idx
    ON wells_score_for_deep_vein_thrombosis (patient_id);
CREATE INDEX wells_score_for_deep_vein_thrombosis_clinician_id_idx
    ON wells_score_for_deep_vein_thrombosis (clinician_id);

CREATE TRIGGER trigger_wells_score_for_deep_vein_thrombosis_updated_at
    BEFORE UPDATE ON wells_score_for_deep_vein_thrombosis
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE wells_score_for_deep_vein_thrombosis IS
    'Main Wells DVT assessment record: identification, context, and the nine clinical criterion inputs plus the alternative-diagnosis adjustment.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.patient_id IS
    'Foreign key to the patient being assessed (restricts delete).';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinician_id IS
    'Foreign key to the assessing clinician (restricts delete).';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.patient_identifier IS
    'Local patient identifier as recorded at the point of assessment.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.assessed_at IS
    'Date and time the assessment was carried out.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.care_setting IS
    'Care setting: emergency-department, ambulatory, acute-medical-unit, dvt-clinic, or other.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.age_band IS
    'Adult age band: 18-39, 40-64, 65-74, 75-84, or 85-plus.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.symptomatic_leg IS
    'Symptomatic leg: left or right.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.active_cancer IS
    'Criterion 1 (+1): active cancer, ongoing, within 6 months, or palliative.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.paralysis_or_immobilisation IS
    'Criterion 2 (+1): paralysis, paresis, or recent plaster immobilisation of the lower limb.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.recently_bedridden_or_surgery IS
    'Criterion 3 (+1): recently bedridden >= 3 days or major surgery within 12 weeks.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.localised_tenderness IS
    'Criterion 4 (+1): localised tenderness along the distribution of the deep venous system.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.entire_leg_swollen IS
    'Criterion 5 (+1): entire leg swollen.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.calf_swelling_over_3cm IS
    'Criterion 6 (+1): calf swelling >= 3 cm compared with the asymptomatic side.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.pitting_oedema IS
    'Criterion 7 (+1): pitting oedema confined to the symptomatic leg.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.collateral_superficial_veins IS
    'Criterion 8 (+1): collateral (non-varicose) superficial veins.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.previously_documented_dvt IS
    'Criterion 9 (+1): previously documented DVT.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.alternative_diagnosis_as_likely IS
    'Adjustment (-2): an alternative diagnosis is at least as likely as DVT.';
COMMENT ON COLUMN wells_score_for_deep_vein_thrombosis.clinical_notes IS
    'Free-text clinical notes captured alongside the assessment.';
