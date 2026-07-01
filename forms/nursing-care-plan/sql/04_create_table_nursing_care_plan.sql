-- Parent nursing care plan header. Records the authoring context, patient
-- identification, the nursing model used, plan-level review date, a handover
-- summary, and the four referenced risk-assessment groups (falls, pressure
-- ulcer, VTE, nutrition). Nursing problems, goals, and interventions are held
-- in child tables that cascade from this parent.

CREATE TABLE nursing_care_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    nurse_name TEXT NOT NULL DEFAULT '',
    nurse_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (nurse_role IN ('registered-nurse', 'nursing-associate', 'student', '')),
    nmc_number TEXT NOT NULL DEFAULT '',
    authored_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('ward', 'community', 'care-home', 'hospice', 'other', '')),
    plan_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (plan_type IN ('admission', 'ongoing', 'discharge', '')),
    model_used VARCHAR(30) NOT NULL DEFAULT '' CHECK (model_used IN ('roper-logan-tierney', 'orem', 'activities-of-living', 'other', '')),

    patient_identifier TEXT NOT NULL DEFAULT '',
    patient_name TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    ward_location TEXT NOT NULL DEFAULT '',
    handover_note TEXT NOT NULL DEFAULT '',
    review_date DATE,

    falls_risk_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (falls_risk_done IN ('yes', 'no', '')),
    falls_risk_level VARCHAR(10) NOT NULL DEFAULT '' CHECK (falls_risk_level IN ('low', 'medium', 'high', '')),
    falls_risk_assessed_on DATE,
    falls_risk_actioned VARCHAR(5) NOT NULL DEFAULT '' CHECK (falls_risk_actioned IN ('yes', 'no', '')),

    pressure_ulcer_risk_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (pressure_ulcer_risk_done IN ('yes', 'no', '')),
    pressure_ulcer_risk_level VARCHAR(10) NOT NULL DEFAULT '' CHECK (pressure_ulcer_risk_level IN ('low', 'medium', 'high', '')),
    pressure_ulcer_risk_assessed_on DATE,
    pressure_ulcer_risk_actioned VARCHAR(5) NOT NULL DEFAULT '' CHECK (pressure_ulcer_risk_actioned IN ('yes', 'no', '')),

    vte_risk_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (vte_risk_done IN ('yes', 'no', '')),
    vte_risk_level VARCHAR(10) NOT NULL DEFAULT '' CHECK (vte_risk_level IN ('low', 'medium', 'high', '')),
    vte_risk_assessed_on DATE,
    vte_risk_actioned VARCHAR(5) NOT NULL DEFAULT '' CHECK (vte_risk_actioned IN ('yes', 'no', '')),

    nutrition_risk_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (nutrition_risk_done IN ('yes', 'no', '')),
    nutrition_risk_level VARCHAR(10) NOT NULL DEFAULT '' CHECK (nutrition_risk_level IN ('low', 'medium', 'high', '')),
    nutrition_risk_assessed_on DATE,
    nutrition_risk_actioned VARCHAR(5) NOT NULL DEFAULT '' CHECK (nutrition_risk_actioned IN ('yes', 'no', ''))
);

CREATE INDEX nursing_care_plan_patient_id_idx
    ON nursing_care_plan (patient_id);
CREATE INDEX nursing_care_plan_clinician_id_idx
    ON nursing_care_plan (clinician_id);

CREATE TRIGGER trigger_nursing_care_plan_updated_at
    BEFORE UPDATE ON nursing_care_plan
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nursing_care_plan IS
    'Parent nursing care plan header: authoring context, patient identification, nursing model, plan-level review date, handover summary, and the four referenced risk-assessment groups.';
COMMENT ON COLUMN nursing_care_plan.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nursing_care_plan.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN nursing_care_plan.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nursing_care_plan.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nursing_care_plan.patient_id IS
    'Foreign key to the patient this care plan is for (restricted delete).';
COMMENT ON COLUMN nursing_care_plan.clinician_id IS
    'Foreign key to the authoring clinician (restricted delete); optional.';
COMMENT ON COLUMN nursing_care_plan.nurse_name IS
    'Name of the authoring nurse.';
COMMENT ON COLUMN nursing_care_plan.nurse_role IS
    'Role of the authoring nurse: registered-nurse, nursing-associate, or student.';
COMMENT ON COLUMN nursing_care_plan.nmc_number IS
    'Professional registration number (NMC PIN) of the authoring nurse.';
COMMENT ON COLUMN nursing_care_plan.authored_at IS
    'Date and time the care plan was authored.';
COMMENT ON COLUMN nursing_care_plan.care_setting IS
    'Care setting: ward, community, care-home, hospice, or other.';
COMMENT ON COLUMN nursing_care_plan.plan_type IS
    'Plan type: admission, ongoing, or discharge.';
COMMENT ON COLUMN nursing_care_plan.model_used IS
    'Nursing model underpinning the plan: roper-logan-tierney, orem, activities-of-living, or other.';
COMMENT ON COLUMN nursing_care_plan.patient_identifier IS
    'Local patient identifier as entered on the plan.';
COMMENT ON COLUMN nursing_care_plan.patient_name IS
    'Patient name as entered on the plan.';
COMMENT ON COLUMN nursing_care_plan.date_of_birth IS
    'Patient date of birth as entered on the plan.';
COMMENT ON COLUMN nursing_care_plan.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN nursing_care_plan.ward_location IS
    'Ward or location where care is delivered.';
COMMENT ON COLUMN nursing_care_plan.handover_note IS
    'Free-text handover summary for the care plan.';
COMMENT ON COLUMN nursing_care_plan.review_date IS
    'Plan-level date the whole care plan is next due for review.';
COMMENT ON COLUMN nursing_care_plan.falls_risk_done IS
    'Whether a falls risk assessment has been completed: yes or no.';
COMMENT ON COLUMN nursing_care_plan.falls_risk_level IS
    'Falls risk level: low, medium, or high.';
COMMENT ON COLUMN nursing_care_plan.falls_risk_assessed_on IS
    'Date the falls risk assessment was carried out.';
COMMENT ON COLUMN nursing_care_plan.falls_risk_actioned IS
    'Whether the falls risk has been actioned with an intervention: yes or no.';
COMMENT ON COLUMN nursing_care_plan.pressure_ulcer_risk_done IS
    'Whether a pressure ulcer risk assessment has been completed: yes or no.';
COMMENT ON COLUMN nursing_care_plan.pressure_ulcer_risk_level IS
    'Pressure ulcer risk level: low, medium, or high.';
COMMENT ON COLUMN nursing_care_plan.pressure_ulcer_risk_assessed_on IS
    'Date the pressure ulcer risk assessment was carried out.';
COMMENT ON COLUMN nursing_care_plan.pressure_ulcer_risk_actioned IS
    'Whether the pressure ulcer risk has been actioned with an intervention: yes or no.';
COMMENT ON COLUMN nursing_care_plan.vte_risk_done IS
    'Whether a venous thromboembolism (VTE) risk assessment has been completed: yes or no.';
COMMENT ON COLUMN nursing_care_plan.vte_risk_level IS
    'VTE risk level: low, medium, or high.';
COMMENT ON COLUMN nursing_care_plan.vte_risk_assessed_on IS
    'Date the VTE risk assessment was carried out.';
COMMENT ON COLUMN nursing_care_plan.vte_risk_actioned IS
    'Whether the VTE risk has been actioned with an intervention: yes or no.';
COMMENT ON COLUMN nursing_care_plan.nutrition_risk_done IS
    'Whether a nutrition (MUST) risk assessment has been completed: yes or no.';
COMMENT ON COLUMN nursing_care_plan.nutrition_risk_level IS
    'Nutrition risk level: low, medium, or high.';
COMMENT ON COLUMN nursing_care_plan.nutrition_risk_assessed_on IS
    'Date the nutrition risk assessment was carried out.';
COMMENT ON COLUMN nursing_care_plan.nutrition_risk_actioned IS
    'Whether the nutrition risk has been actioned with an intervention: yes or no.';
