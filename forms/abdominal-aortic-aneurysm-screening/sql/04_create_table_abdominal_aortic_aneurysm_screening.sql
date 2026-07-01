-- Main abdominal-aortic-aneurysm-screening record: one abdominal aortic
-- ultrasound scan under the UK NHS AAA Screening Programme. Captures scan
-- context, patient identification and eligibility, consent, the ultrasound
-- measurement (maximum antero-posterior aortic diameter), and clinical
-- observations. The computed diameter classification, the audit trail of fired
-- rules, and the safety flags live in dedicated child tables.

CREATE TABLE abdominal_aortic_aneurysm_screening (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Scan context
    technician_name TEXT NOT NULL DEFAULT '',
    technician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (technician_role IN ('screening-technician', 'clinical-skills-trainer', 'other', '')),
    clinic_site TEXT NOT NULL DEFAULT '',
    scanned_at TIMESTAMPTZ,
    device_identifier TEXT NOT NULL DEFAULT '',

    -- Patient identification and eligibility
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age INTEGER,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    eligibility_route VARCHAR(30) NOT NULL DEFAULT '' CHECK (eligibility_route IN ('routine-year-of-65', 'self-referral-over-65', 'other', '')),
    scan_type VARCHAR(25) NOT NULL DEFAULT '' CHECK (scan_type IN ('first-scan', 'surveillance-rescan', '')),

    -- Consent
    consent_given VARCHAR(5) NOT NULL DEFAULT '' CHECK (consent_given IN ('yes', 'no', '')),
    leaflet_provided VARCHAR(5) NOT NULL DEFAULT '' CHECK (leaflet_provided IN ('yes', 'no', '')),
    consent_note TEXT NOT NULL DEFAULT '',

    -- Ultrasound measurement
    aorta_visualised VARCHAR(5) NOT NULL DEFAULT '' CHECK (aorta_visualised IN ('yes', 'no', '')),
    max_aortic_diameter_cm NUMERIC(4,1),
    prior_max_diameter_cm NUMERIC(4,1),
    prior_scan_date DATE,

    -- Clinical observations
    symptomatic VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptomatic IN ('yes', 'no', '')),
    incidental_findings TEXT NOT NULL DEFAULT '',
    result_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX abdominal_aortic_aneurysm_screening_patient_id_idx
    ON abdominal_aortic_aneurysm_screening (patient_id);
CREATE INDEX abdominal_aortic_aneurysm_screening_clinician_id_idx
    ON abdominal_aortic_aneurysm_screening (clinician_id);

CREATE TRIGGER trigger_abdominal_aortic_aneurysm_screening_updated_at
    BEFORE UPDATE ON abdominal_aortic_aneurysm_screening
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE abdominal_aortic_aneurysm_screening IS
    'Main abdominal-aortic-aneurysm-screening record for one aortic ultrasound scan: scan context, patient identification and eligibility, consent, the ultrasound measurement (maximum antero-posterior aortic diameter), and clinical observations. Classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.patient_id IS
    'Foreign key to the patient this screening documents (restrict delete).';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.clinician_id IS
    'Foreign key to the screening technician clinician (restrict delete); optional.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.technician_name IS
    'Name of the screening technician performing the scan.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.technician_role IS
    'Role of the person performing the scan: screening-technician, clinical-skills-trainer, or other.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.clinic_site IS
    'Clinic or site name where the scan was performed.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.scanned_at IS
    'Date and time the ultrasound scan was performed.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.device_identifier IS
    'Ultrasound device identifier.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.patient_identifier IS
    'NHS number or local patient identifier as recorded on the record.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.age IS
    'Patient age in years.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.eligibility_route IS
    'Route into screening: routine-year-of-65, self-referral-over-65, or other.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.scan_type IS
    'Scan type: first-scan or surveillance-rescan.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.consent_given IS
    'Whether informed consent to the scan was given (yes/no); anything other than yes raises the incomplete flag.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.leaflet_provided IS
    'Whether the information leaflet was given to the patient (yes/no).';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.consent_note IS
    'Free-text detail of any refusal or consent query.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.aorta_visualised IS
    'Whether the aorta was adequately visualised (yes/no); no forces the non-visualised classification and re-scan.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.max_aortic_diameter_cm IS
    'Maximum antero-posterior aortic diameter in centimetres; the value that drives classification.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.prior_max_diameter_cm IS
    'Prior maximum aortic diameter in centimetres (surveillance patients); with the current diameter yields growth.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.prior_scan_date IS
    'Date of the prior scan (surveillance patients).';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.symptomatic IS
    'Whether the patient reports abdominal or back pain or tenderness (yes/no); yes with an aneurysm present raises the symptomatic-aneurysm flag.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.incidental_findings IS
    'Free-text incidental findings noted during the scan.';
COMMENT ON COLUMN abdominal_aortic_aneurysm_screening.result_note IS
    'Optional free-text result note shown in the summary.';
