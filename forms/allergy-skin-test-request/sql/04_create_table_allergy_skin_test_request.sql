-- Allergy skin test request (referral) — the source-of-truth record.

CREATE TABLE allergy_skin_test_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'vetted', 'scheduled', 'rejected', '')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    setting VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'emergency', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Requested test
    test_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (test_type IN ('skin-prick-test', 'intradermal-test', 'patch-test', 'specific-ige-blood', 'drug-provocation-challenge', 'other', '')),

    -- Allergen panels requested
    allergen_aeroallergens BOOLEAN NOT NULL DEFAULT FALSE,
    allergen_food BOOLEAN NOT NULL DEFAULT FALSE,
    allergen_drug BOOLEAN NOT NULL DEFAULT FALSE,
    allergen_venom BOOLEAN NOT NULL DEFAULT FALSE,
    allergen_latex BOOLEAN NOT NULL DEFAULT FALSE,
    allergen_contact BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical indication
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-food-allergy', 'suspected-drug-allergy', 'rhinitis-asthma', 'anaphylaxis-investigation', 'venom-allergy', 'contact-dermatitis', 'urticaria', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',

    -- Safety / validity history
    previous_anaphylaxis BOOLEAN NOT NULL DEFAULT FALSE,
    on_antihistamines BOOLEAN NOT NULL DEFAULT FALSE,
    on_beta_blocker BOOLEAN NOT NULL DEFAULT FALSE,
    current_skin_disease BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_allergy_skin_test_request_patient_id
    ON allergy_skin_test_request(patient_id);
CREATE INDEX index_allergy_skin_test_request_clinician_id
    ON allergy_skin_test_request(clinician_id);

CREATE INDEX allergy_skin_test_request_index_gto
    ON allergy_skin_test_request
    USING GIN ((
        site_name
    ) gin_trgm_ops);

CREATE TRIGGER trigger_allergy_skin_test_request_updated_at
    BEFORE UPDATE ON allergy_skin_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE allergy_skin_test_request IS
    'Allergy skin test request (referral) for skin-prick, intradermal, patch, specific-IgE blood, or drug-provocation testing. Captures the requested test type, allergen panels, the clinical indication and question, antihistamine / beta-blocker / skin-disease validity-and-safety history, and triage urgency.';
COMMENT ON COLUMN allergy_skin_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN allergy_skin_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN allergy_skin_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN allergy_skin_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN allergy_skin_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN allergy_skin_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN allergy_skin_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN allergy_skin_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN allergy_skin_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN allergy_skin_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN allergy_skin_test_request.requested_by_date IS
    'Date by which the test is requested to be performed.';
COMMENT ON COLUMN allergy_skin_test_request.test_type IS
    'Requested test type: skin-prick-test, intradermal-test, patch-test, specific-ige-blood, drug-provocation-challenge, other.';
COMMENT ON COLUMN allergy_skin_test_request.allergen_aeroallergens IS
    'Whether aeroallergen testing is requested (pollens, house dust mite, animal dander, moulds).';
COMMENT ON COLUMN allergy_skin_test_request.allergen_food IS
    'Whether food allergen testing is requested.';
COMMENT ON COLUMN allergy_skin_test_request.allergen_drug IS
    'Whether drug allergen testing is requested.';
COMMENT ON COLUMN allergy_skin_test_request.allergen_venom IS
    'Whether insect venom allergen testing is requested.';
COMMENT ON COLUMN allergy_skin_test_request.allergen_latex IS
    'Whether latex allergen testing is requested.';
COMMENT ON COLUMN allergy_skin_test_request.allergen_contact IS
    'Whether contact-allergen patch testing is requested.';
COMMENT ON COLUMN allergy_skin_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN allergy_skin_test_request.clinical_question IS
    'Specific clinical question the test should answer (highest-value field).';
COMMENT ON COLUMN allergy_skin_test_request.clinical_details IS
    'Relevant clinical details: history, reaction description, timing, suspected triggers.';
COMMENT ON COLUMN allergy_skin_test_request.previous_anaphylaxis IS
    'Whether the patient has a history of anaphylaxis (resuscitation-readiness flag).';
COMMENT ON COLUMN allergy_skin_test_request.on_antihistamines IS
    'Whether the patient is currently taking antihistamines (invalidates skin-prick / intradermal tests).';
COMMENT ON COLUMN allergy_skin_test_request.on_beta_blocker IS
    'Whether the patient is taking a beta-blocker (impairs adrenaline response in anaphylaxis).';
COMMENT ON COLUMN allergy_skin_test_request.current_skin_disease IS
    'Whether the patient has active skin disease at the test site (e.g. eczema, dermographism).';
COMMENT ON COLUMN allergy_skin_test_request.urgency IS
    'Requested triage urgency: routine, urgent.';
COMMENT ON COLUMN allergy_skin_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN allergy_skin_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN allergy_skin_test_request.notes IS
    'Free-text additional notes.';
