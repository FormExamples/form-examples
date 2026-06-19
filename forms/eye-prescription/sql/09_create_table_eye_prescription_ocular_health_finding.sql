-- Ocular health findings (optional; one row per prescription).

CREATE TABLE eye_prescription_ocular_health_finding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    eye_prescription_id UUID NOT NULL UNIQUE
        REFERENCES eye_prescription(id) ON DELETE CASCADE,

    slit_lamp_right TEXT NOT NULL DEFAULT '',
    slit_lamp_left TEXT NOT NULL DEFAULT '',
    fundus_right TEXT NOT NULL DEFAULT '',
    fundus_left TEXT NOT NULL DEFAULT '',
    intraocular_pressure_right_mmhg NUMERIC(4,1)
        CHECK (intraocular_pressure_right_mmhg IS NULL OR intraocular_pressure_right_mmhg BETWEEN 0.0 AND 80.0),
    intraocular_pressure_left_mmhg NUMERIC(4,1)
        CHECK (intraocular_pressure_left_mmhg IS NULL OR intraocular_pressure_left_mmhg BETWEEN 0.0 AND 80.0),
    cup_to_disc_ratio_right NUMERIC(3,2)
        CHECK (cup_to_disc_ratio_right IS NULL OR cup_to_disc_ratio_right BETWEEN 0.00 AND 1.00),
    cup_to_disc_ratio_left NUMERIC(3,2)
        CHECK (cup_to_disc_ratio_left IS NULL OR cup_to_disc_ratio_left BETWEEN 0.00 AND 1.00),
    oct_performed BOOLEAN NOT NULL DEFAULT FALSE,
    oct_findings TEXT NOT NULL DEFAULT '',
    fields_performed BOOLEAN NOT NULL DEFAULT FALSE,
    fields_findings TEXT NOT NULL DEFAULT '',

    pathology_flag BOOLEAN NOT NULL DEFAULT FALSE,
    refer_ophthalmology BOOLEAN NOT NULL DEFAULT FALSE,
    referral_reason TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_eye_prescription_ocular_health_finding_updated_at
    BEFORE UPDATE ON eye_prescription_ocular_health_finding
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE eye_prescription_ocular_health_finding IS
    'Optional ocular health findings recorded during the sight test: slit-lamp, fundus, intraocular pressure, OCT, visual fields, pathology flag.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.eye_prescription_id IS
    'Foreign key to the parent eye_prescription (unique, 1:1).';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.slit_lamp_right IS
    'Slit-lamp biomicroscopy findings, right eye.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.slit_lamp_left IS
    'Slit-lamp biomicroscopy findings, left eye.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.fundus_right IS
    'Fundus examination findings, right eye.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.fundus_left IS
    'Fundus examination findings, left eye.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.intraocular_pressure_right_mmhg IS
    'Intraocular pressure, right eye, in mmHg.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.intraocular_pressure_left_mmhg IS
    'Intraocular pressure, left eye, in mmHg.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.cup_to_disc_ratio_right IS
    'Optic nerve head cup-to-disc ratio, right eye (0.00 to 1.00).';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.cup_to_disc_ratio_left IS
    'Optic nerve head cup-to-disc ratio, left eye (0.00 to 1.00).';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.oct_performed IS
    'Whether an OCT scan was performed at this sight test.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.oct_findings IS
    'OCT (optical coherence tomography) findings.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.fields_performed IS
    'Whether a visual fields test was performed at this sight test.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.fields_findings IS
    'Visual fields findings.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.pathology_flag IS
    'Whether any ocular pathology was identified (drives the ocular-pathology safety flag).';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.refer_ophthalmology IS
    'Whether the prescriber recommends referral to ophthalmology.';
COMMENT ON COLUMN eye_prescription_ocular_health_finding.referral_reason IS
    'Reason for ophthalmology referral, if any.';
