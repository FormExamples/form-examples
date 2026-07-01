-- Parent Apgar-score assessment record: birth context, newborn
-- identification, and resuscitation notes. The five-sign scores are held
-- in the apgar_score_timepoint child table, one row per timepoint (1, 5,
-- 10 minutes, and beyond), and the computed grade, fired rules, and flags
-- live in dedicated child tables that cascade from this parent.

CREATE TABLE apgar_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('midwife', 'obstetrician', 'neonatologist', 'neonatal-nurse', 'paediatrician', 'other', '')),
    born_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('delivery-room', 'theatre', 'birth-centre', 'home', 'neonatal-unit', 'other', '')),
    gestational_age_weeks NUMERIC(4,1),
    mode_of_delivery VARCHAR(20) NOT NULL DEFAULT '' CHECK (mode_of_delivery IN ('vaginal', 'assisted', 'caesarean', 'other', '')),

    -- Newborn identification
    newborn_identifier VARCHAR(100) NOT NULL DEFAULT '',
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    birth_order INT,

    -- Resuscitation and free-text note
    resuscitation_measures TEXT NOT NULL DEFAULT '',
    clinician_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX apgar_score_patient_id_idx
    ON apgar_score (patient_id);
CREATE INDEX apgar_score_clinician_id_idx
    ON apgar_score (clinician_id);

CREATE TRIGGER trigger_apgar_score_updated_at
    BEFORE UPDATE ON apgar_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE apgar_score IS
    'Parent Apgar-score assessment record: birth context, newborn identification, and resuscitation notes; the repeated five-sign scores are held in the apgar_score_timepoint child table.';
COMMENT ON COLUMN apgar_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN apgar_score.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN apgar_score.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN apgar_score.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN apgar_score.patient_id IS
    'Foreign key to the newborn patient being assessed (delete restricted).';
COMMENT ON COLUMN apgar_score.clinician_id IS
    'Foreign key to the attending clinician (optional; delete restricted).';
COMMENT ON COLUMN apgar_score.clinician_name IS
    'Name of the attending clinician as recorded on the assessment.';
COMMENT ON COLUMN apgar_score.clinician_role IS
    'Role of the attending clinician: midwife, obstetrician, neonatologist, neonatal-nurse, paediatrician, or other.';
COMMENT ON COLUMN apgar_score.born_at IS
    'Date and time of birth.';
COMMENT ON COLUMN apgar_score.care_setting IS
    'Care setting where the birth took place: delivery-room, theatre, birth-centre, home, neonatal-unit, or other.';
COMMENT ON COLUMN apgar_score.gestational_age_weeks IS
    'Gestational age at birth, in completed weeks.';
COMMENT ON COLUMN apgar_score.mode_of_delivery IS
    'Mode of delivery: vaginal, assisted, caesarean, or other.';
COMMENT ON COLUMN apgar_score.newborn_identifier IS
    'Local identifier for the newborn as recorded on the assessment.';
COMMENT ON COLUMN apgar_score.sex IS
    'Newborn sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN apgar_score.birth_order IS
    'Birth order for multiple births (1 for a singleton).';
COMMENT ON COLUMN apgar_score.resuscitation_measures IS
    'Free-text description of resuscitation measures given (drying, stimulation, oxygen, IPPV, chest compressions, etc.).';
COMMENT ON COLUMN apgar_score.clinician_note IS
    'Free-text clinical note recorded with the assessment.';
