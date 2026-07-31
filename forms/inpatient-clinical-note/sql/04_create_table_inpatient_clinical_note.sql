-- Main inpatient clinical note record: note identification, admission
-- context, interval history, observations and NEWS2, examination findings,
-- risk assessments, clinical impression, plan and escalation, communication,
-- and sign-off. The problem list, medication changes, investigations
-- reviewed, and outstanding jobs live in dedicated child tables. The
-- computed completeness grade and acuity band live in the grade table.

CREATE TABLE inpatient_clinical_note (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES clinician(id) ON DELETE RESTRICT,
    responsible_consultant_id UUID REFERENCES clinician(id) ON DELETE SET NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'amended', 'signed')),

    -- Step 1: note identification
    note_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (note_type IN ('admission-clerking', 'progress', 'consult', 'event', 'procedure', 'handover', 'transfer', 'discharge-planning', '')),
    hospital_name VARCHAR(255) NOT NULL DEFAULT '',
    ward_name VARCHAR(100) NOT NULL DEFAULT '',
    bed_number VARCHAR(20) NOT NULL DEFAULT '',
    note_at TIMESTAMPTZ,
    author_name VARCHAR(255) NOT NULL DEFAULT '',
    author_grade VARCHAR(20) NOT NULL DEFAULT '' CHECK (author_grade IN ('FY1', 'FY2', 'CT1', 'CT2', 'CT3', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'ST7', 'ST8', 'SAS', 'consultant', 'acp', 'physician-associate', 'nurse', 'other', '')),
    author_registration_number VARCHAR(40) NOT NULL DEFAULT '',
    parent_specialty VARCHAR(60) NOT NULL DEFAULT '',
    responsible_consultant_name VARCHAR(255) NOT NULL DEFAULT '',

    -- Step 1: note-type-specific context
    consult_question TEXT NOT NULL DEFAULT '',
    consult_requesting_team VARCHAR(100) NOT NULL DEFAULT '',
    procedure_performed VARCHAR(255) NOT NULL DEFAULT '',
    procedure_detail TEXT NOT NULL DEFAULT '',
    procedure_consent VARCHAR(30) NOT NULL DEFAULT '' CHECK (procedure_consent IN ('written', 'verbal', 'implied', 'emergency-no-consent', 'best-interests', '')),
    procedure_complications TEXT NOT NULL DEFAULT '',
    transfer_from_ward VARCHAR(100) NOT NULL DEFAULT '',
    transfer_to_ward VARCHAR(100) NOT NULL DEFAULT '',
    transfer_reason TEXT NOT NULL DEFAULT '',

    -- Step 2: admission context
    admission_at TIMESTAMPTZ,
    admitting_specialty VARCHAR(60) NOT NULL DEFAULT '',
    admission_method VARCHAR(30) NOT NULL DEFAULT '' CHECK (admission_method IN ('emergency-department', 'gp-referral', 'elective', 'transfer-in', 'clinic', 'maternity', 'other', '')),
    admission_reason TEXT NOT NULL DEFAULT '',

    -- Step 3: interval history
    interval_history TEXT NOT NULL DEFAULT '',
    no_interval_events VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_interval_events IN ('yes', 'no', '')),
    overnight_events TEXT NOT NULL DEFAULT '',
    patient_reported_symptoms TEXT NOT NULL DEFAULT '',
    nursing_concerns TEXT NOT NULL DEFAULT '',
    pain_score INTEGER CHECK (pain_score IS NULL OR (pain_score >= 0 AND pain_score <= 10)),
    sleep_quality VARCHAR(20) NOT NULL DEFAULT '' CHECK (sleep_quality IN ('good', 'fair', 'poor', 'none', '')),
    oral_intake VARCHAR(20) NOT NULL DEFAULT '' CHECK (oral_intake IN ('normal', 'reduced', 'minimal', 'nil-by-mouth', '')),
    bowels_last_opened DATE,
    mobility_status VARCHAR(30) NOT NULL DEFAULT '' CHECK (mobility_status IN ('independent', 'stick', 'frame', 'assistance-of-one', 'assistance-of-two', 'hoist', 'bed-bound', '')),

    -- Step 4: observations and NEWS2
    observed_at TIMESTAMPTZ,
    respiratory_rate INTEGER CHECK (respiratory_rate IS NULL OR (respiratory_rate >= 0 AND respiratory_rate <= 80)),
    oxygen_saturation INTEGER CHECK (oxygen_saturation IS NULL OR (oxygen_saturation >= 0 AND oxygen_saturation <= 100)),
    spo2_scale VARCHAR(10) NOT NULL DEFAULT 'scale-1' CHECK (spo2_scale IN ('scale-1', 'scale-2', '')),
    oxygen_delivery VARCHAR(30) NOT NULL DEFAULT '' CHECK (oxygen_delivery IN ('air', 'nasal-cannula', 'simple-mask', 'venturi', 'non-rebreathe', 'high-flow-nasal', 'niv', 'invasive-ventilation', '')),
    oxygen_flow_litres_per_minute NUMERIC(4,1) CHECK (oxygen_flow_litres_per_minute IS NULL OR oxygen_flow_litres_per_minute >= 0),
    systolic_blood_pressure INTEGER CHECK (systolic_blood_pressure IS NULL OR (systolic_blood_pressure >= 0 AND systolic_blood_pressure <= 300)),
    diastolic_blood_pressure INTEGER CHECK (diastolic_blood_pressure IS NULL OR (diastolic_blood_pressure >= 0 AND diastolic_blood_pressure <= 200)),
    pulse_rate INTEGER CHECK (pulse_rate IS NULL OR (pulse_rate >= 0 AND pulse_rate <= 300)),
    acvpu VARCHAR(15) NOT NULL DEFAULT '' CHECK (acvpu IN ('alert', 'confusion', 'voice', 'pain', 'unresponsive', '')),
    temperature_celsius NUMERIC(4,1) CHECK (temperature_celsius IS NULL OR (temperature_celsius >= 20.0 AND temperature_celsius <= 45.0)),
    news2_total INTEGER CHECK (news2_total IS NULL OR (news2_total >= 0 AND news2_total <= 20)),
    news2_derived_total INTEGER CHECK (news2_derived_total IS NULL OR (news2_derived_total >= 0 AND news2_derived_total <= 20)),
    news2_trend VARCHAR(15) NOT NULL DEFAULT '' CHECK (news2_trend IN ('improving', 'stable', 'worsening', 'unknown', '')),
    news2_applicable VARCHAR(5) NOT NULL DEFAULT '' CHECK (news2_applicable IN ('yes', 'no', '')),
    news2_not_applicable_reason VARCHAR(255) NOT NULL DEFAULT '',

    -- Step 5: examination
    examination_general TEXT NOT NULL DEFAULT '',
    examination_cardiovascular TEXT NOT NULL DEFAULT '',
    examination_respiratory TEXT NOT NULL DEFAULT '',
    examination_abdominal TEXT NOT NULL DEFAULT '',
    examination_neurological TEXT NOT NULL DEFAULT '',
    examination_musculoskeletal TEXT NOT NULL DEFAULT '',
    examination_skin_and_wounds TEXT NOT NULL DEFAULT '',
    examination_lines_and_drains TEXT NOT NULL DEFAULT '',
    examination_other TEXT NOT NULL DEFAULT '',

    -- Step 6: investigations context
    no_investigations_reviewed VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_investigations_reviewed IN ('yes', 'no', '')),

    -- Step 8: medication context
    no_medication_changes VARCHAR(5) NOT NULL DEFAULT '' CHECK (no_medication_changes IN ('yes', 'no', '')),
    allergy_checked VARCHAR(5) NOT NULL DEFAULT '' CHECK (allergy_checked IN ('yes', 'no', '')),
    medicines_reconciliation_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (medicines_reconciliation_status IN ('done', 'partial', 'not-done', 'not-applicable', '')),
    antimicrobial_review_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (antimicrobial_review_status IN ('not-applicable', 'due', 'done', 'overdue', '')),
    antimicrobial_review_at TIMESTAMPTZ,

    -- Step 9: risk assessments
    vte_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (vte_status IN ('done', 'not-done', 'not-applicable', '')),
    vte_prophylaxis VARCHAR(20) NOT NULL DEFAULT '' CHECK (vte_prophylaxis IN ('pharmacological', 'mechanical', 'both', 'none', 'contraindicated', '')),
    vte_assessed_at TIMESTAMPTZ,
    vte_notes TEXT NOT NULL DEFAULT '',
    falls_risk VARCHAR(20) NOT NULL DEFAULT '' CHECK (falls_risk IN ('low', 'moderate', 'high', 'not-assessed', '')),
    falls_interventions TEXT NOT NULL DEFAULT '',
    pressure_ulcer_risk VARCHAR(20) NOT NULL DEFAULT '' CHECK (pressure_ulcer_risk IN ('low', 'medium', 'high', 'not-assessed', '')),
    skin_integrity VARCHAR(20) NOT NULL DEFAULT '' CHECK (skin_integrity IN ('intact', 'at-risk', 'damaged', '')),
    pressure_ulcer_grade VARCHAR(25) NOT NULL DEFAULT '' CHECK (pressure_ulcer_grade IN ('none', '1', '2', '3', '4', 'unstageable', 'deep-tissue-injury', '')),
    pressure_ulcer_sites VARCHAR(255) NOT NULL DEFAULT '',
    delirium_screen VARCHAR(25) NOT NULL DEFAULT '' CHECK (delirium_screen IN ('negative', 'possible-delirium', 'probable-delirium', 'cognitive-impairment', 'not-assessed', '')),
    delirium_4at_score INTEGER CHECK (delirium_4at_score IS NULL OR (delirium_4at_score >= 0 AND delirium_4at_score <= 12)),
    delirium_notes TEXT NOT NULL DEFAULT '',
    nutrition_screen VARCHAR(20) NOT NULL DEFAULT '' CHECK (nutrition_screen IN ('low-risk', 'medium-risk', 'high-risk', 'not-assessed', '')),
    must_score INTEGER CHECK (must_score IS NULL OR (must_score >= 0 AND must_score <= 6)),
    nutrition_plan TEXT NOT NULL DEFAULT '',
    infection_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (infection_status IN ('none', 'suspected', 'confirmed', '')),
    isolation_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (isolation_status IN ('none', 'source', 'protective', 'cohort', '')),
    organism VARCHAR(255) NOT NULL DEFAULT '',
    infection_precautions TEXT NOT NULL DEFAULT '',
    safeguarding_concern VARCHAR(5) NOT NULL DEFAULT '' CHECK (safeguarding_concern IN ('yes', 'no', '')),
    safeguarding_notes TEXT NOT NULL DEFAULT '',
    safeguarding_referral_made VARCHAR(5) NOT NULL DEFAULT '' CHECK (safeguarding_referral_made IN ('yes', 'no', '')),

    -- Step 10: assessment and impression
    clinical_impression TEXT NOT NULL DEFAULT '',
    differential_diagnosis TEXT NOT NULL DEFAULT '',
    response_to_treatment VARCHAR(20) NOT NULL DEFAULT '' CHECK (response_to_treatment IN ('improving', 'unchanged', 'deteriorating', 'too-early', '')),
    new_oxygen_requirement VARCHAR(5) NOT NULL DEFAULT '' CHECK (new_oxygen_requirement IN ('yes', 'no', '')),
    new_confusion VARCHAR(5) NOT NULL DEFAULT '' CHECK (new_confusion IN ('yes', 'no', '')),
    sepsis_screen VARCHAR(15) NOT NULL DEFAULT '' CHECK (sepsis_screen IN ('positive', 'negative', 'not-done', '')),
    arrest_call VARCHAR(15) NOT NULL DEFAULT '' CHECK (arrest_call IN ('none', 'cardiac', 'respiratory', 'peri-arrest', '')),
    critical_care_referral VARCHAR(5) NOT NULL DEFAULT '' CHECK (critical_care_referral IN ('yes', 'no', '')),
    new_organ_support VARCHAR(30) NOT NULL DEFAULT '' CHECK (new_organ_support IN ('none', 'respiratory', 'cardiovascular', 'renal', 'neurological', 'multiple', '')),

    -- Step 11: plan and escalation
    plan TEXT NOT NULL DEFAULT '',
    escalation_status VARCHAR(30) NOT NULL DEFAULT '' CHECK (escalation_status IN ('for-full-escalation', 'for-ward-based-care', 'for-hdu', 'for-icu', 'palliative', 'under-review', '')),
    escalation_action TEXT NOT NULL DEFAULT '',
    ceiling_of_care VARCHAR(30) NOT NULL DEFAULT '' CHECK (ceiling_of_care IN ('full-active-treatment', 'ward-based-care', 'non-invasive-ventilation', 'organ-support', 'symptom-control', '')),
    respect_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (respect_status IN ('in-place', 'not-in-place', 'under-discussion', 'not-applicable', '')),
    dnacpr_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (dnacpr_status IN ('for-cpr', 'dnacpr', 'under-discussion', '')),
    senior_review_needed VARCHAR(5) NOT NULL DEFAULT '' CHECK (senior_review_needed IN ('yes', 'no', '')),
    senior_review_by VARCHAR(255) NOT NULL DEFAULT '',
    senior_review_at TIMESTAMPTZ,
    estimated_discharge_date DATE,
    discharge_planning_notes TEXT NOT NULL DEFAULT '',

    -- Step 12: communication and sign-off
    family_communication TEXT NOT NULL DEFAULT '',
    patient_communication TEXT NOT NULL DEFAULT '',
    team_handover TEXT NOT NULL DEFAULT '',
    consent_status VARCHAR(25) NOT NULL DEFAULT '' CHECK (consent_status IN ('consented', 'declined', 'lacks-capacity', 'best-interests', 'not-applicable', '')),
    capacity_assessed VARCHAR(5) NOT NULL DEFAULT '' CHECK (capacity_assessed IN ('yes', 'no', '')),
    capacity_notes TEXT NOT NULL DEFAULT '',
    author_override_acuity VARCHAR(15) NOT NULL DEFAULT '' CHECK (author_override_acuity IN ('stable', 'watch', 'escalate', 'critical', '')),
    author_override_reason TEXT NOT NULL DEFAULT '',
    attestation_text TEXT NOT NULL DEFAULT '',
    electronic_signature TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,

    CONSTRAINT inpatient_clinical_note_note_after_admission
        CHECK (note_at IS NULL OR admission_at IS NULL OR note_at >= admission_at),
    CONSTRAINT inpatient_clinical_note_override_needs_reason
        CHECK (author_override_acuity = '' OR author_override_reason <> '')
);

CREATE TRIGGER trigger_inpatient_clinical_note_updated_at
    BEFORE UPDATE ON inpatient_clinical_note
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX inpatient_clinical_note_patient_id_idx
    ON inpatient_clinical_note (patient_id);
CREATE INDEX inpatient_clinical_note_author_id_idx
    ON inpatient_clinical_note (author_id);
CREATE INDEX inpatient_clinical_note_note_at_idx
    ON inpatient_clinical_note (note_at DESC);
CREATE INDEX inpatient_clinical_note_note_type_idx
    ON inpatient_clinical_note (note_type);

COMMENT ON TABLE inpatient_clinical_note IS
    'Main inpatient clinical note record: note identification, admission context, interval history, observations and NEWS2, examination findings, risk assessments, clinical impression, plan and escalation, communication, and sign-off. Problems, medication changes, investigations, and jobs live in child tables.';
COMMENT ON COLUMN inpatient_clinical_note.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN inpatient_clinical_note.created_at IS
    'Timestamp when the record was created, i.e. when the entry was written.';
COMMENT ON COLUMN inpatient_clinical_note.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN inpatient_clinical_note.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed. Clinical notes are never hard-deleted.';
COMMENT ON COLUMN inpatient_clinical_note.patient_id IS
    'Foreign key to the patient the note is about.';
COMMENT ON COLUMN inpatient_clinical_note.author_id IS
    'Foreign key to the clinician who authored the note.';
COMMENT ON COLUMN inpatient_clinical_note.responsible_consultant_id IS
    'Foreign key to the consultant responsible for the patient, when recorded.';
COMMENT ON COLUMN inpatient_clinical_note.status IS
    'Record status: draft, submitted, amended, or signed. A correction is written as a new amended note rather than an edit in place.';
COMMENT ON COLUMN inpatient_clinical_note.note_type IS
    'Note type, which determines the required-component set: admission-clerking, progress, consult, event, procedure, handover, transfer, or discharge-planning.';
COMMENT ON COLUMN inpatient_clinical_note.hospital_name IS
    'Hospital where the note was written.';
COMMENT ON COLUMN inpatient_clinical_note.ward_name IS
    'Ward where the patient is located.';
COMMENT ON COLUMN inpatient_clinical_note.bed_number IS
    'Bed or bay identifier.';
COMMENT ON COLUMN inpatient_clinical_note.note_at IS
    'Timestamp the note refers to, i.e. when the clinical events occurred. Distinct from created_at, which is when the entry was written.';
COMMENT ON COLUMN inpatient_clinical_note.author_name IS
    'Author full name as written on the note.';
COMMENT ON COLUMN inpatient_clinical_note.author_grade IS
    'Author training or employment grade.';
COMMENT ON COLUMN inpatient_clinical_note.author_registration_number IS
    'Author professional registration number (GMC, NMC, HCPC, or GPhC).';
COMMENT ON COLUMN inpatient_clinical_note.parent_specialty IS
    'Specialty of the team the patient is under.';
COMMENT ON COLUMN inpatient_clinical_note.responsible_consultant_name IS
    'Name of the responsible consultant as written on the note.';
COMMENT ON COLUMN inpatient_clinical_note.consult_question IS
    'For a consult note: the clinical question the parent team asked.';
COMMENT ON COLUMN inpatient_clinical_note.consult_requesting_team IS
    'For a consult note: the team that requested the opinion.';
COMMENT ON COLUMN inpatient_clinical_note.procedure_performed IS
    'For a procedure note: the bedside procedure performed. Theatre procedures belong in the medical-operation-note form.';
COMMENT ON COLUMN inpatient_clinical_note.procedure_detail IS
    'For a procedure note: technique, site, equipment, and findings.';
COMMENT ON COLUMN inpatient_clinical_note.procedure_consent IS
    'For a procedure note: consent basis (written, verbal, implied, emergency-no-consent, or best-interests).';
COMMENT ON COLUMN inpatient_clinical_note.procedure_complications IS
    'For a procedure note: complications encountered, or an explicit none.';
COMMENT ON COLUMN inpatient_clinical_note.transfer_from_ward IS
    'For a transfer note: the ward or hospital the patient is leaving.';
COMMENT ON COLUMN inpatient_clinical_note.transfer_to_ward IS
    'For a transfer note: the ward or hospital the patient is going to.';
COMMENT ON COLUMN inpatient_clinical_note.transfer_reason IS
    'For a transfer note: the clinical or operational reason for the transfer.';
COMMENT ON COLUMN inpatient_clinical_note.admission_at IS
    'Timestamp the admission episode began. Length of stay is derived in code, never stored.';
COMMENT ON COLUMN inpatient_clinical_note.admitting_specialty IS
    'Specialty the patient was admitted under.';
COMMENT ON COLUMN inpatient_clinical_note.admission_method IS
    'How the patient was admitted: emergency-department, gp-referral, elective, transfer-in, clinic, maternity, or other.';
COMMENT ON COLUMN inpatient_clinical_note.admission_reason IS
    'Presenting problem or reason for admission.';
COMMENT ON COLUMN inpatient_clinical_note.interval_history IS
    'Events since the previous entry.';
COMMENT ON COLUMN inpatient_clinical_note.no_interval_events IS
    'Explicit negative: no events since the previous entry. Counts as documenting the interval-history component.';
COMMENT ON COLUMN inpatient_clinical_note.overnight_events IS
    'Events overnight, as handed over by the night team or nursing staff.';
COMMENT ON COLUMN inpatient_clinical_note.patient_reported_symptoms IS
    'Symptoms as reported by the patient.';
COMMENT ON COLUMN inpatient_clinical_note.nursing_concerns IS
    'Concerns raised by the nursing team.';
COMMENT ON COLUMN inpatient_clinical_note.pain_score IS
    'Patient-reported pain score, 0..10.';
COMMENT ON COLUMN inpatient_clinical_note.sleep_quality IS
    'Sleep quality: good, fair, poor, or none.';
COMMENT ON COLUMN inpatient_clinical_note.oral_intake IS
    'Oral intake: normal, reduced, minimal, or nil-by-mouth.';
COMMENT ON COLUMN inpatient_clinical_note.bowels_last_opened IS
    'Date the bowels were last opened.';
COMMENT ON COLUMN inpatient_clinical_note.mobility_status IS
    'Current mobility: independent, stick, frame, assistance-of-one, assistance-of-two, hoist, or bed-bound.';
COMMENT ON COLUMN inpatient_clinical_note.observed_at IS
    'Timestamp the observation set was taken.';
COMMENT ON COLUMN inpatient_clinical_note.respiratory_rate IS
    'Respiratory rate in breaths per minute (NEWS2 parameter).';
COMMENT ON COLUMN inpatient_clinical_note.oxygen_saturation IS
    'Peripheral oxygen saturation as a percentage (NEWS2 parameter).';
COMMENT ON COLUMN inpatient_clinical_note.spo2_scale IS
    'NEWS2 SpO2 scale: scale-1 by default, or scale-2 for prescribed target saturation 88-92% in confirmed hypercapnic respiratory failure.';
COMMENT ON COLUMN inpatient_clinical_note.oxygen_delivery IS
    'Oxygen delivery device, or air when the patient is on room air (NEWS2 air-or-oxygen parameter).';
COMMENT ON COLUMN inpatient_clinical_note.oxygen_flow_litres_per_minute IS
    'Oxygen flow rate in litres per minute.';
COMMENT ON COLUMN inpatient_clinical_note.systolic_blood_pressure IS
    'Systolic blood pressure in mmHg (NEWS2 parameter).';
COMMENT ON COLUMN inpatient_clinical_note.diastolic_blood_pressure IS
    'Diastolic blood pressure in mmHg. Recorded for completeness; not a NEWS2 parameter.';
COMMENT ON COLUMN inpatient_clinical_note.pulse_rate IS
    'Pulse rate in beats per minute (NEWS2 parameter).';
COMMENT ON COLUMN inpatient_clinical_note.acvpu IS
    'Consciousness on the ACVPU scale: alert, confusion, voice, pain, or unresponsive (NEWS2 parameter).';
COMMENT ON COLUMN inpatient_clinical_note.temperature_celsius IS
    'Temperature in degrees Celsius (NEWS2 parameter).';
COMMENT ON COLUMN inpatient_clinical_note.news2_total IS
    'NEWS2 aggregate score as entered from the ward chart, 0..20. An entered total always wins over a derived one.';
COMMENT ON COLUMN inpatient_clinical_note.news2_derived_total IS
    'NEWS2 aggregate derived by the engine from the seven parameters, 0..20. Reported alongside the entered total so a discrepancy is visible rather than silently resolved.';
COMMENT ON COLUMN inpatient_clinical_note.news2_trend IS
    'Direction of travel against the previous score: improving, stable, worsening, or unknown.';
COMMENT ON COLUMN inpatient_clinical_note.news2_applicable IS
    'Whether NEWS2 applies to this patient. NEWS2 is not validated in pregnancy, in children under 16, or in spinal-cord injury.';
COMMENT ON COLUMN inpatient_clinical_note.news2_not_applicable_reason IS
    'Reason NEWS2 was deliberately not used.';
COMMENT ON COLUMN inpatient_clinical_note.examination_general IS
    'General appearance and overall examination findings.';
COMMENT ON COLUMN inpatient_clinical_note.examination_cardiovascular IS
    'Cardiovascular examination findings.';
COMMENT ON COLUMN inpatient_clinical_note.examination_respiratory IS
    'Respiratory examination findings.';
COMMENT ON COLUMN inpatient_clinical_note.examination_abdominal IS
    'Abdominal examination findings.';
COMMENT ON COLUMN inpatient_clinical_note.examination_neurological IS
    'Neurological examination findings.';
COMMENT ON COLUMN inpatient_clinical_note.examination_musculoskeletal IS
    'Musculoskeletal examination findings.';
COMMENT ON COLUMN inpatient_clinical_note.examination_skin_and_wounds IS
    'Skin, pressure-area, and wound examination findings.';
COMMENT ON COLUMN inpatient_clinical_note.examination_lines_and_drains IS
    'Findings for indwelling lines, catheters, and drains.';
COMMENT ON COLUMN inpatient_clinical_note.examination_other IS
    'Any other examination findings.';
COMMENT ON COLUMN inpatient_clinical_note.no_investigations_reviewed IS
    'Explicit negative: no investigations were reviewed. Counts as documenting the investigations component.';
COMMENT ON COLUMN inpatient_clinical_note.no_medication_changes IS
    'Explicit negative: no medication changes were made. Counts as documenting the medications component.';
COMMENT ON COLUMN inpatient_clinical_note.allergy_checked IS
    'Whether the allergy status was checked before prescribing.';
COMMENT ON COLUMN inpatient_clinical_note.medicines_reconciliation_status IS
    'Medicines reconciliation status: done, partial, not-done, or not-applicable.';
COMMENT ON COLUMN inpatient_clinical_note.antimicrobial_review_status IS
    'Antimicrobial stewardship review status per NICE NG15: not-applicable, due, done, or overdue.';
COMMENT ON COLUMN inpatient_clinical_note.antimicrobial_review_at IS
    'Timestamp of the antimicrobial review, or the date it falls due.';
COMMENT ON COLUMN inpatient_clinical_note.vte_status IS
    'VTE risk assessment status per NICE NG89: done, not-done, or not-applicable. Sole predicate for the risk-assessments completeness component.';
COMMENT ON COLUMN inpatient_clinical_note.vte_prophylaxis IS
    'VTE prophylaxis in place: pharmacological, mechanical, both, none, or contraindicated.';
COMMENT ON COLUMN inpatient_clinical_note.vte_assessed_at IS
    'Timestamp the VTE risk assessment was performed.';
COMMENT ON COLUMN inpatient_clinical_note.vte_notes IS
    'Free-text notes on the VTE assessment, including contraindications.';
COMMENT ON COLUMN inpatient_clinical_note.falls_risk IS
    'Falls risk band per NICE CG161: low, moderate, high, or not-assessed.';
COMMENT ON COLUMN inpatient_clinical_note.falls_interventions IS
    'Falls-prevention interventions in place.';
COMMENT ON COLUMN inpatient_clinical_note.pressure_ulcer_risk IS
    'Pressure-ulcer risk band per NICE CG179: low, medium, high, or not-assessed.';
COMMENT ON COLUMN inpatient_clinical_note.skin_integrity IS
    'Skin integrity: intact, at-risk, or damaged.';
COMMENT ON COLUMN inpatient_clinical_note.pressure_ulcer_grade IS
    'Pressure-ulcer category if present: none, 1, 2, 3, 4, unstageable, or deep-tissue-injury.';
COMMENT ON COLUMN inpatient_clinical_note.pressure_ulcer_sites IS
    'Anatomical sites of any pressure damage.';
COMMENT ON COLUMN inpatient_clinical_note.delirium_screen IS
    'Delirium screen outcome per NICE CG103: negative, possible-delirium, probable-delirium, cognitive-impairment, or not-assessed.';
COMMENT ON COLUMN inpatient_clinical_note.delirium_4at_score IS
    '4AT delirium screening score, 0..12. The full instrument lives in the four-a-test-for-delirium form.';
COMMENT ON COLUMN inpatient_clinical_note.delirium_notes IS
    'Free-text notes on cognition and delirium.';
COMMENT ON COLUMN inpatient_clinical_note.nutrition_screen IS
    'Nutrition screening band: low-risk, medium-risk, high-risk, or not-assessed.';
COMMENT ON COLUMN inpatient_clinical_note.must_score IS
    'Malnutrition Universal Screening Tool (MUST) score, 0..6.';
COMMENT ON COLUMN inpatient_clinical_note.nutrition_plan IS
    'Nutrition and hydration plan.';
COMMENT ON COLUMN inpatient_clinical_note.infection_status IS
    'Infection status: none, suspected, or confirmed.';
COMMENT ON COLUMN inpatient_clinical_note.isolation_status IS
    'Isolation status: none, source, protective, or cohort. Must travel with a transfer note.';
COMMENT ON COLUMN inpatient_clinical_note.organism IS
    'Organism identified or suspected.';
COMMENT ON COLUMN inpatient_clinical_note.infection_precautions IS
    'Infection-control precautions in place.';
COMMENT ON COLUMN inpatient_clinical_note.safeguarding_concern IS
    'Whether a safeguarding concern has been identified.';
COMMENT ON COLUMN inpatient_clinical_note.safeguarding_notes IS
    'Free-text safeguarding notes.';
COMMENT ON COLUMN inpatient_clinical_note.safeguarding_referral_made IS
    'Whether a safeguarding referral has been made.';
COMMENT ON COLUMN inpatient_clinical_note.clinical_impression IS
    'Clinical impression. Required for any grade above incomplete.';
COMMENT ON COLUMN inpatient_clinical_note.differential_diagnosis IS
    'Differential diagnosis under consideration.';
COMMENT ON COLUMN inpatient_clinical_note.response_to_treatment IS
    'Response to treatment so far: improving, unchanged, deteriorating, or too-early.';
COMMENT ON COLUMN inpatient_clinical_note.new_oxygen_requirement IS
    'Whether the patient has a new oxygen requirement. Raises the acuity band to escalate.';
COMMENT ON COLUMN inpatient_clinical_note.new_confusion IS
    'Whether the confusion is new. Combined with an ACVPU below alert, raises the acuity band to escalate.';
COMMENT ON COLUMN inpatient_clinical_note.sepsis_screen IS
    'Sepsis screen outcome per NICE NG51: positive, negative, or not-done. A positive screen raises the acuity band to escalate.';
COMMENT ON COLUMN inpatient_clinical_note.arrest_call IS
    'Arrest call made: none, cardiac, respiratory, or peri-arrest. Any call other than none raises the acuity band to critical.';
COMMENT ON COLUMN inpatient_clinical_note.critical_care_referral IS
    'Whether a critical-care outreach or ICU referral has been made. Raises the acuity band to critical.';
COMMENT ON COLUMN inpatient_clinical_note.new_organ_support IS
    'New organ support started: none, respiratory, cardiovascular, renal, neurological, or multiple. Anything other than none raises the acuity band to critical.';
COMMENT ON COLUMN inpatient_clinical_note.plan IS
    'Overall management plan. Required for any grade above incomplete; individual jobs live in the job child table.';
COMMENT ON COLUMN inpatient_clinical_note.escalation_status IS
    'Escalation status: for-full-escalation, for-ward-based-care, for-hdu, for-icu, palliative, or under-review.';
COMMENT ON COLUMN inpatient_clinical_note.escalation_action IS
    'Escalation action actually taken. Its absence at an escalate or critical acuity band raises a high-priority flag.';
COMMENT ON COLUMN inpatient_clinical_note.ceiling_of_care IS
    'Agreed ceiling of care: full-active-treatment, ward-based-care, non-invasive-ventilation, organ-support, or symptom-control.';
COMMENT ON COLUMN inpatient_clinical_note.respect_status IS
    'ReSPECT plan status: in-place, not-in-place, under-discussion, or not-applicable.';
COMMENT ON COLUMN inpatient_clinical_note.dnacpr_status IS
    'Resuscitation status: for-cpr, dnacpr, or under-discussion.';
COMMENT ON COLUMN inpatient_clinical_note.senior_review_needed IS
    'Whether a senior review is needed.';
COMMENT ON COLUMN inpatient_clinical_note.senior_review_by IS
    'Name and grade of the senior who reviewed or is to review.';
COMMENT ON COLUMN inpatient_clinical_note.senior_review_at IS
    'Timestamp of the senior review.';
COMMENT ON COLUMN inpatient_clinical_note.estimated_discharge_date IS
    'Estimated date of discharge.';
COMMENT ON COLUMN inpatient_clinical_note.discharge_planning_notes IS
    'Discharge-planning notes: destination, package of care, equipment, and outstanding blockers.';
COMMENT ON COLUMN inpatient_clinical_note.family_communication IS
    'What was discussed with the family or next of kin, and with whom.';
COMMENT ON COLUMN inpatient_clinical_note.patient_communication IS
    'What was discussed with the patient.';
COMMENT ON COLUMN inpatient_clinical_note.team_handover IS
    'Handover to the incoming team.';
COMMENT ON COLUMN inpatient_clinical_note.consent_status IS
    'Consent basis for the decisions recorded: consented, declined, lacks-capacity, best-interests, or not-applicable.';
COMMENT ON COLUMN inpatient_clinical_note.capacity_assessed IS
    'Whether a mental-capacity assessment was performed for a capacity-dependent decision.';
COMMENT ON COLUMN inpatient_clinical_note.capacity_notes IS
    'Free-text notes on the capacity assessment.';
COMMENT ON COLUMN inpatient_clinical_note.author_override_acuity IS
    'Author override of the computed acuity band. The computed band is retained in the grade table so the override is visible in audit. The completeness status is never overridable.';
COMMENT ON COLUMN inpatient_clinical_note.author_override_reason IS
    'Reason for the acuity override. Required whenever an override is set.';
COMMENT ON COLUMN inpatient_clinical_note.attestation_text IS
    'Attestation statement the author signed.';
COMMENT ON COLUMN inpatient_clinical_note.electronic_signature IS
    'Electronic signature of the author.';
COMMENT ON COLUMN inpatient_clinical_note.signed_at IS
    'Timestamp the note was signed.';
