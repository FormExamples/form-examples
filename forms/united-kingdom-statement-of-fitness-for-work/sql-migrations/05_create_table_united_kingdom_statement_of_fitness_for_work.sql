-- The fit note itself: a single assessment record produced by a healthcare
-- professional for a patient. Mirrors the DWP Med 3 form fields after the
-- 2022 amendment that broadened issuance and enabled digital delivery.

CREATE TABLE united_kingdom_statement_of_fitness_for_work (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,
    medical_practice_id UUID NOT NULL REFERENCES medical_practice(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'submitted', 'issued', 'duplicate', 'cancelled'
    )),

    -- Assessment (Step 3 of the wizard)
    assessment_date DATE,
    assessment_method VARCHAR(30) NOT NULL DEFAULT '' CHECK (assessment_method IN (
        'in_person',
        'video_call',
        'telephone',
        'written_report_from_other_hcp',
        ''
    )),
    general_fitness_considered VARCHAR(5) NOT NULL DEFAULT '' CHECK (general_fitness_considered IN ('yes', 'no', '')),

    -- Diagnosis (Step 4)
    diagnosis_text TEXT NOT NULL DEFAULT '',
    diagnosis_snomed_code VARCHAR(20) NOT NULL DEFAULT '',
    diagnosis_snomed_display VARCHAR(255) NOT NULL DEFAULT '',
    diagnosis_category VARCHAR(30) NOT NULL DEFAULT '' CHECK (diagnosis_category IN (
        'mental_health',
        'musculoskeletal',
        'respiratory',
        'cardiovascular',
        'neoplasm',
        'infection',
        'injury',
        'pregnancy',
        'neurological',
        'gastrointestinal',
        'endocrine',
        'other',
        ''
    )),
    condition_first_recorded_date DATE,
    is_automatic_disability VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_automatic_disability IN ('yes', 'no', '')),
    is_non_medical VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_non_medical IN ('yes', 'no', '')),

    -- Fitness for work (Step 5)
    fitness_for_work VARCHAR(15) NOT NULL DEFAULT '' CHECK (fitness_for_work IN (
        'not_fit',
        'may_be_fit',
        ''
    )),

    -- Adaptations (Step 6) — visible only when fitness_for_work = 'may_be_fit'
    adaptation_phased_return VARCHAR(5) NOT NULL DEFAULT '' CHECK (adaptation_phased_return IN ('yes', 'no', '')),
    adaptation_altered_hours VARCHAR(5) NOT NULL DEFAULT '' CHECK (adaptation_altered_hours IN ('yes', 'no', '')),
    adaptation_amended_duties VARCHAR(5) NOT NULL DEFAULT '' CHECK (adaptation_amended_duties IN ('yes', 'no', '')),
    adaptation_workplace_adaptations VARCHAR(5) NOT NULL DEFAULT '' CHECK (adaptation_workplace_adaptations IN ('yes', 'no', '')),

    -- Comments (Step 7)
    comments TEXT NOT NULL DEFAULT '',

    -- Period (Step 8)
    period_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (period_type IN ('duration', 'from_to', '')),
    period_duration_value INTEGER CHECK (period_duration_value IS NULL OR period_duration_value > 0),
    period_duration_unit VARCHAR(10) NOT NULL DEFAULT '' CHECK (period_duration_unit IN ('days', 'weeks', 'months', '')),
    period_from DATE,
    period_to DATE,

    -- Follow-up (Step 9)
    will_assess_again VARCHAR(5) NOT NULL DEFAULT '' CHECK (will_assess_again IN ('yes', 'no', '')),
    planned_review_date DATE,

    -- Issue (Step 10)
    issued_at TIMESTAMPTZ,
    issued_via VARCHAR(30) NOT NULL DEFAULT '' CHECK (issued_via IN (
        'digital',
        'printed_computer_generated',
        'printed_handwritten',
        ''
    )),
    issue_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (issue_setting IN (
        'primary_care',
        'secondary_care_discharge',
        'occupational_health',
        'pharmacy',
        'community',
        ''
    )),
    is_duplicate_of UUID REFERENCES united_kingdom_statement_of_fitness_for_work(id) ON DELETE SET NULL,

    -- Safeguarding (Step 10)
    safeguarding_concern VARCHAR(5) NOT NULL DEFAULT '' CHECK (safeguarding_concern IN ('yes', 'no', '')),
    safeguarding_notes TEXT NOT NULL DEFAULT '',

    -- Clinician signature (electronic)
    clinician_signature_svg TEXT NOT NULL DEFAULT '',
    clinician_signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_united_kingdom_statement_of_fitness_for_work_updated_at
    BEFORE UPDATE ON united_kingdom_statement_of_fitness_for_work
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_united_kingdom_statement_of_fitness_for_work_patient_id
    ON united_kingdom_statement_of_fitness_for_work(patient_id);
CREATE INDEX index_united_kingdom_statement_of_fitness_for_work_clinician_id
    ON united_kingdom_statement_of_fitness_for_work(clinician_id);
CREATE INDEX index_united_kingdom_statement_of_fitness_for_work_medical_practice_id
    ON united_kingdom_statement_of_fitness_for_work(medical_practice_id);

COMMENT ON TABLE united_kingdom_statement_of_fitness_for_work IS
    'UK Statement of Fitness for Work (Med 3 / fit note). A single assessment record covering diagnosis, fitness category, adaptations, period, and follow-up.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.patient_id IS
    'Foreign key to the patient who is the subject of the fit note.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician_id IS
    'Foreign key to the issuing clinician.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.medical_practice_id IS
    'Foreign key to the medical practice owning the fit note.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.status IS
    'Lifecycle status: draft, submitted, issued, duplicate, or cancelled.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.assessment_date IS
    'Date the assessment was performed (Step 3).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.assessment_method IS
    'Assessment modality (DWP policy 3.1): in_person, video_call, telephone, or written_report_from_other_hcp.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.general_fitness_considered IS
    'Whether the clinician considered fitness for work in general rather than just the current job (DWP policy 5.1).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.diagnosis_text IS
    'Free-text description of the condition causing the absence (Step 4).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.diagnosis_snomed_code IS
    'Optional SNOMED CT concept identifier from the NHS Digital fit-note refset.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.diagnosis_snomed_display IS
    'Optional preferred display name for the SNOMED CT concept.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.diagnosis_category IS
    'Coarse diagnosis category used by the grading engine.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.condition_first_recorded_date IS
    'Date the condition was first recorded; drives the "first 6 months" rule (DWP policy 3.3).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.is_automatic_disability IS
    'Whether the condition is automatically classed as a disability (HIV / cancer / MS — Equality Act 2010 s.6).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.is_non_medical IS
    'Clinician flag that the underlying problem is non-medical and not certifiable (DWP policy 3.6).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.fitness_for_work IS
    'Fitness category (Step 5): not_fit or may_be_fit. The form cannot say "fit for work" (DWP policy 3.2).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.adaptation_phased_return IS
    'Adaptation tick box (Step 6): a phased return to work.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.adaptation_altered_hours IS
    'Adaptation tick box (Step 6): altered hours.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.adaptation_amended_duties IS
    'Adaptation tick box (Step 6): amended duties.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.adaptation_workplace_adaptations IS
    'Adaptation tick box (Step 6): workplace adaptations.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.comments IS
    'Free-text advice (Step 7) describing the functional impact of the condition (DWP policy 5.6).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.period_type IS
    'Period entry mode (Step 8): duration (e.g. 4 weeks) or from_to (e.g. 2026-05-18 to 2026-06-15).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.period_duration_value IS
    'Numeric period duration value when period_type = duration.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.period_duration_unit IS
    'Period duration unit when period_type = duration: days, weeks, or months.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.period_from IS
    'Period start date when period_type = from_to.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.period_to IS
    'Period end date when period_type = from_to.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.will_assess_again IS
    'Whether the clinician intends to reassess at the end of the period (Step 9).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.planned_review_date IS
    'Planned date for the follow-up assessment.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.issued_at IS
    'Timestamp when the fit note was issued to the patient.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.issued_via IS
    'Delivery channel: digital, printed_computer_generated, or printed_handwritten.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.issue_setting IS
    'Care setting in which the fit note was issued.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.is_duplicate_of IS
    'If this is a duplicate (DWP policy 3.7 — only if the original was lost), points to the original fit note.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.safeguarding_concern IS
    'Whether the clinician flagged a safeguarding concern during the assessment.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.safeguarding_notes IS
    'Free-text notes describing the safeguarding concern (not printed on the fit note).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician_signature_svg IS
    'Electronic signature captured as SVG path data, when issued_via = digital.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work.clinician_signed_at IS
    'Timestamp the clinician applied the electronic signature.';
