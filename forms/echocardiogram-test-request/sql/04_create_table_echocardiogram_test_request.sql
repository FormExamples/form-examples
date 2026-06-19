-- Cardiac echocardiogram request (referral) — the source-of-truth record.

CREATE TABLE echocardiogram_test_request (
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

    -- Requested examination
    echo_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (echo_type IN ('transthoracic-tte', 'transoesophageal-toe', 'stress-echo', 'contrast-echo', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('heart-failure', 'murmur', 'suspected-valve-disease', 'breathlessness', 'palpitations', 'chest-pain', 'hypertension', 'cardiomyopathy', 'endocarditis', 'post-mi', 'pulmonary-hypertension', 'pre-chemotherapy', 'stroke-tia-source', 'congenital', 'surveillance-known-disease', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms
    breathlessness BOOLEAN NOT NULL DEFAULT FALSE,
    chest_pain BOOLEAN NOT NULL DEFAULT FALSE,
    palpitations BOOLEAN NOT NULL DEFAULT FALSE,
    syncope BOOLEAN NOT NULL DEFAULT FALSE,
    oedema BOOLEAN NOT NULL DEFAULT FALSE,
    nyha_class VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (nyha_class IN ('i', 'ii', 'iii', 'iv', '')),

    -- Investigations
    ecg_findings VARCHAR(1000) NOT NULL DEFAULT '',
    bnp_or_nt_probnp NUMERIC(8,1)
        CHECK (bnp_or_nt_probnp IS NULL OR bnp_or_nt_probnp >= 0),
    known_murmur BOOLEAN NOT NULL DEFAULT FALSE,
    previous_echo VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (previous_echo IN ('none', 'normal', 'abnormal', 'unknown', '')),
    previous_echo_date DATE,
    ejection_fraction_known NUMERIC(4,1)
        CHECK (ejection_fraction_known IS NULL OR ejection_fraction_known BETWEEN 0 AND 100),

    -- Oncology / cardiotoxicity
    on_cardiotoxic_chemotherapy BOOLEAN NOT NULL DEFAULT FALSE,
    relevant_medications VARCHAR(1000) NOT NULL DEFAULT '',

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_echocardiogram_test_request_patient_id
    ON echocardiogram_test_request(patient_id);
CREATE INDEX index_echocardiogram_test_request_clinician_id
    ON echocardiogram_test_request(clinician_id);

CREATE TRIGGER trigger_echocardiogram_test_request_updated_at
    BEFORE UPDATE ON echocardiogram_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE echocardiogram_test_request IS
    'Cardiac echocardiogram request (referral). Captures the requested echo type, clinical indication and question, relevant history, symptoms, NYHA class, ECG and natriuretic-peptide findings, prior echo, cardiotoxic-chemotherapy status, and triage urgency.';
COMMENT ON COLUMN echocardiogram_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN echocardiogram_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN echocardiogram_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN echocardiogram_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN echocardiogram_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN echocardiogram_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN echocardiogram_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN echocardiogram_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN echocardiogram_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN echocardiogram_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN echocardiogram_test_request.requested_by_date IS
    'Date by which the echocardiogram is requested to be performed.';
COMMENT ON COLUMN echocardiogram_test_request.echo_type IS
    'Requested echocardiogram type: transthoracic-tte, transoesophageal-toe, stress-echo, contrast-echo, other.';
COMMENT ON COLUMN echocardiogram_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN echocardiogram_test_request.clinical_question IS
    'Specific clinical question the echocardiogram should answer (highest-value field).';
COMMENT ON COLUMN echocardiogram_test_request.relevant_history IS
    'Relevant cardiac, medical, and surgical history.';
COMMENT ON COLUMN echocardiogram_test_request.breathlessness IS
    'Whether the patient reports breathlessness (dyspnoea).';
COMMENT ON COLUMN echocardiogram_test_request.chest_pain IS
    'Whether the patient reports chest pain.';
COMMENT ON COLUMN echocardiogram_test_request.palpitations IS
    'Whether the patient reports palpitations.';
COMMENT ON COLUMN echocardiogram_test_request.syncope IS
    'Whether the patient reports syncope (transient loss of consciousness).';
COMMENT ON COLUMN echocardiogram_test_request.oedema IS
    'Whether the patient has peripheral oedema.';
COMMENT ON COLUMN echocardiogram_test_request.nyha_class IS
    'New York Heart Association functional class: i, ii, iii, iv.';
COMMENT ON COLUMN echocardiogram_test_request.ecg_findings IS
    'Relevant electrocardiogram (ECG) findings.';
COMMENT ON COLUMN echocardiogram_test_request.bnp_or_nt_probnp IS
    'Natriuretic peptide level (BNP or NT-proBNP), in ng/L, used for heart-failure priority.';
COMMENT ON COLUMN echocardiogram_test_request.known_murmur IS
    'Whether a cardiac murmur has been auscultated.';
COMMENT ON COLUMN echocardiogram_test_request.previous_echo IS
    'Result of any previous echocardiogram: none, normal, abnormal, unknown.';
COMMENT ON COLUMN echocardiogram_test_request.previous_echo_date IS
    'Date of the most recent previous echocardiogram.';
COMMENT ON COLUMN echocardiogram_test_request.ejection_fraction_known IS
    'Known left-ventricular ejection fraction (%) from a prior study, if available.';
COMMENT ON COLUMN echocardiogram_test_request.on_cardiotoxic_chemotherapy IS
    'Whether the patient is on, or about to start, cardiotoxic chemotherapy (e.g. anthracyclines, trastuzumab).';
COMMENT ON COLUMN echocardiogram_test_request.relevant_medications IS
    'Relevant cardiac and other medications.';
COMMENT ON COLUMN echocardiogram_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN echocardiogram_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN echocardiogram_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN echocardiogram_test_request.notes IS
    'Free-text additional notes.';
