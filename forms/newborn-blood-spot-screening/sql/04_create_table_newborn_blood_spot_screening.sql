-- Main newborn-blood-spot-screening record: one heel-prick screening event
-- under the UK NHS Newborn Blood Spot (NBS) Screening Programme. Captures the
-- sample-taker and setting, baby identification, eligibility and consent, the
-- sample event and its age/timing, sample quality, and the per-condition result
-- class for the nine screened conditions (SCD, CF, CHT, PKU, MCADD, MSUD, IVA,
-- GA1, HCU). The computed overall outcome, the audit trail of fired rules, and
-- the safety flags live in dedicated child tables.

CREATE TABLE newborn_blood_spot_screening (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Sample-taker and setting
    sample_taker_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (sample_taker_role IN ('midwife', 'health-visitor', 'neonatal-nurse', 'laboratory', 'other', '')),
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('community', 'home', 'neonatal-unit', 'hospital', 'other', '')),
    record_date DATE,

    -- Baby identification (name, NHS number, date of birth, and sex live on patient)
    time_of_birth TIME,
    gestation_weeks NUMERIC(4,1),

    -- Eligibility and consent
    previously_screened VARCHAR(10) NOT NULL DEFAULT '' CHECK (previously_screened IN ('yes', 'no', 'unknown', '')),
    consent_given VARCHAR(10) NOT NULL DEFAULT '' CHECK (consent_given IN ('yes', 'no', 'partial', '')),
    decline_reason TEXT NOT NULL DEFAULT '',

    -- Sample event
    sample_date DATE,
    sample_time TIME,
    age_at_sample_days INTEGER,
    sampling_site VARCHAR(10) NOT NULL DEFAULT '' CHECK (sampling_site IN ('heel', 'other', '')),
    sample_notes TEXT NOT NULL DEFAULT '',

    -- Sample quality
    sample_adequacy VARCHAR(15) NOT NULL DEFAULT '' CHECK (sample_adequacy IN ('adequate', 'inadequate', '')),
    spot_quality_issue VARCHAR(20) NOT NULL DEFAULT '' CHECK (spot_quality_issue IN ('none', 'insufficient', 'compressed', 'layered', 'contaminated', 'incomplete-circles', '')),
    is_repeat VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_repeat IN ('yes', 'no', '')),
    repeat_reason VARCHAR(20) NOT NULL DEFAULT '' CHECK (repeat_reason IN ('not-applicable', 'borderline-result', 'inadequate-sample', 'too-early', 'technical', 'other', '')),

    -- Per-condition result classes (carrier is valid for scd_result only)
    scd_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (scd_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),
    cf_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (cf_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),
    cht_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (cht_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),
    pku_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (pku_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),
    mcadd_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (mcadd_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),
    msud_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (msud_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),
    iva_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (iva_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),
    ga1_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (ga1_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),
    hcu_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (hcu_result IN ('not-suspected', 'suspected', 'carrier', 'repeat-required', 'declined', 'pending', '')),

    -- Free-text clinical context
    clinical_context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX newborn_blood_spot_screening_patient_id_idx
    ON newborn_blood_spot_screening (patient_id);
CREATE INDEX newborn_blood_spot_screening_clinician_id_idx
    ON newborn_blood_spot_screening (clinician_id);

CREATE TRIGGER trigger_newborn_blood_spot_screening_updated_at
    BEFORE UPDATE ON newborn_blood_spot_screening
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE newborn_blood_spot_screening IS
    'Main newborn-blood-spot-screening record for one heel-prick screening event: sample-taker and setting, baby identification, eligibility and consent, the sample event and its timing, sample quality, and the per-condition result class for the nine screened conditions. Overall outcome, fired rules, and flags live in child tables.';
COMMENT ON COLUMN newborn_blood_spot_screening.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_blood_spot_screening.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN newborn_blood_spot_screening.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN newborn_blood_spot_screening.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN newborn_blood_spot_screening.patient_id IS
    'Foreign key to the newborn (infant) this screening documents (restrict delete).';
COMMENT ON COLUMN newborn_blood_spot_screening.clinician_id IS
    'Foreign key to the sample-taker clinician (restrict delete); optional.';
COMMENT ON COLUMN newborn_blood_spot_screening.sample_taker_role IS
    'Role of the person taking and recording the sample: midwife, health-visitor, neonatal-nurse, laboratory, or other.';
COMMENT ON COLUMN newborn_blood_spot_screening.care_setting IS
    'Care setting where the sample was taken: community, home, neonatal-unit, hospital, or other.';
COMMENT ON COLUMN newborn_blood_spot_screening.record_date IS
    'Date of this record.';
COMMENT ON COLUMN newborn_blood_spot_screening.time_of_birth IS
    'Time of birth of the baby.';
COMMENT ON COLUMN newborn_blood_spot_screening.gestation_weeks IS
    'Gestation at birth in weeks; affects cystic-fibrosis and preterm handling.';
COMMENT ON COLUMN newborn_blood_spot_screening.previously_screened IS
    'Whether the baby has been previously screened: yes, no, or unknown.';
COMMENT ON COLUMN newborn_blood_spot_screening.consent_given IS
    'Whether informed parental consent to screen was given: yes, no, or partial.';
COMMENT ON COLUMN newborn_blood_spot_screening.decline_reason IS
    'Free-text reason where screening for any condition was declined.';
COMMENT ON COLUMN newborn_blood_spot_screening.sample_date IS
    'Date the heel-prick sample was taken.';
COMMENT ON COLUMN newborn_blood_spot_screening.sample_time IS
    'Time the heel-prick sample was taken.';
COMMENT ON COLUMN newborn_blood_spot_screening.age_at_sample_days IS
    'Age of the baby in days at the time of sampling (sample_date minus birth_date); stored for audit and drives the day 5-8 window flag.';
COMMENT ON COLUMN newborn_blood_spot_screening.sampling_site IS
    'Site the sample was taken from: heel or other.';
COMMENT ON COLUMN newborn_blood_spot_screening.sample_notes IS
    'Free-text sample-taker note about the sample event.';
COMMENT ON COLUMN newborn_blood_spot_screening.sample_adequacy IS
    'Sample adequacy: adequate or inadequate; an inadequate sample cannot be reliably screened and is repeated.';
COMMENT ON COLUMN newborn_blood_spot_screening.spot_quality_issue IS
    'Blood-spot quality issue: none, insufficient, compressed, layered, contaminated, or incomplete-circles.';
COMMENT ON COLUMN newborn_blood_spot_screening.is_repeat IS
    'Whether this sample is a repeat: yes or no.';
COMMENT ON COLUMN newborn_blood_spot_screening.repeat_reason IS
    'Reason a repeat was taken: not-applicable, borderline-result, inadequate-sample, too-early, technical, or other; the last three are avoidable repeats.';
COMMENT ON COLUMN newborn_blood_spot_screening.scd_result IS
    'Sickle cell disease result class: not-suspected, suspected, carrier, repeat-required, declined, or pending. carrier is valid for this condition only.';
COMMENT ON COLUMN newborn_blood_spot_screening.cf_result IS
    'Cystic fibrosis result class: not-suspected, suspected, carrier (invalid), repeat-required, declined, or pending.';
COMMENT ON COLUMN newborn_blood_spot_screening.cht_result IS
    'Congenital hypothyroidism result class: not-suspected, suspected, carrier (invalid), repeat-required, declined, or pending.';
COMMENT ON COLUMN newborn_blood_spot_screening.pku_result IS
    'Phenylketonuria result class: not-suspected, suspected, carrier (invalid), repeat-required, declined, or pending.';
COMMENT ON COLUMN newborn_blood_spot_screening.mcadd_result IS
    'MCADD (medium-chain acyl-CoA dehydrogenase deficiency) result class: not-suspected, suspected, carrier (invalid), repeat-required, declined, or pending.';
COMMENT ON COLUMN newborn_blood_spot_screening.msud_result IS
    'Maple syrup urine disease result class: not-suspected, suspected, carrier (invalid), repeat-required, declined, or pending.';
COMMENT ON COLUMN newborn_blood_spot_screening.iva_result IS
    'Isovaleric acidaemia result class: not-suspected, suspected, carrier (invalid), repeat-required, declined, or pending.';
COMMENT ON COLUMN newborn_blood_spot_screening.ga1_result IS
    'Glutaric aciduria type 1 result class: not-suspected, suspected, carrier (invalid), repeat-required, declined, or pending.';
COMMENT ON COLUMN newborn_blood_spot_screening.hcu_result IS
    'Homocystinuria (pyridoxine unresponsive) result class: not-suspected, suspected, carrier (invalid), repeat-required, declined, or pending.';
COMMENT ON COLUMN newborn_blood_spot_screening.clinical_context IS
    'Optional free-text clinical context shown in the summary.';
