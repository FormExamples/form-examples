-- Main death-registration record: the registrar-side and family-side process
-- after a medical certificate of cause of death in England and Wales:
-- medical examiner confirmation, coroner involvement, the qualified
-- informant, the 5-day registration window, the certificate for burial or
-- cremation, Tell Us Once, and ordering certified copies. The completeness
-- classification, rules fired and flags live in child tables. Not legal advice.

CREATE TABLE united_kingdom_death_registration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,


    -- Parties
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    informant_id UUID REFERENCES informant(id) ON DELETE RESTRICT,

    -- The deceased and the death
    deceased_name TEXT NOT NULL DEFAULT '',
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', 'unknown', '')),
    date_of_birth DATE,
    date_of_death DATE,
    place_of_death TEXT NOT NULL DEFAULT '',
    death_jurisdiction VARCHAR(20) NOT NULL DEFAULT '' CHECK (death_jurisdiction IN ('england-wales', 'scotland', 'northern-ireland', 'abroad', '')),
    deceased_particulars_known VARCHAR(5) NOT NULL DEFAULT '' CHECK (deceased_particulars_known IN ('yes', 'no', '')),

    -- Medical certificate and medical examiner
    mccd_received VARCHAR(5) NOT NULL DEFAULT '' CHECK (mccd_received IN ('yes', 'no', '')),
    medical_examiner_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (medical_examiner_status IN ('confirmed', 'pending', '')),
    medical_examiner_confirmation_date DATE,

    -- Coroner
    referred_to_coroner VARCHAR(5) NOT NULL DEFAULT '' CHECK (referred_to_coroner IN ('yes', 'no', '')),
    coroner_stage VARCHAR(30) NOT NULL DEFAULT '' CHECK (coroner_stage IN ('investigating', 'post-mortem', 'inquest-opened', 'released-no-inquest', 'inquest-concluded', '')),
    coroner_certificate_received VARCHAR(5) NOT NULL DEFAULT '' CHECK (coroner_certificate_received IN ('yes', 'no', '')),

    -- Informant
    informant_name TEXT NOT NULL DEFAULT '',
    informant_relationship VARCHAR(40) NOT NULL DEFAULT '' CHECK (informant_relationship IN ('relative-present-at-death', 'relative-in-attendance', 'relative-in-district', 'person-present-at-death', 'occupier-of-premises', 'person-arranging-funeral', 'not-qualified', '')),
    informant_address TEXT NOT NULL DEFAULT '',

    -- Registration appointment
    register_office TEXT NOT NULL DEFAULT '',
    appointment_booked VARCHAR(5) NOT NULL DEFAULT '' CHECK (appointment_booked IN ('yes', 'no', '')),
    supporting_documents_available VARCHAR(5) NOT NULL DEFAULT '' CHECK (supporting_documents_available IN ('yes', 'no', '')),
    registration_date DATE,
    as_of_date DATE,

    -- After registration
    disposal_method VARCHAR(20) NOT NULL DEFAULT '' CHECK (disposal_method IN ('burial', 'cremation', 'other', 'undecided', '')),
    disposal_certificate_issued VARCHAR(5) NOT NULL DEFAULT '' CHECK (disposal_certificate_issued IN ('yes', 'no', '')),
    tell_us_once_status VARCHAR(25) NOT NULL DEFAULT '' CHECK (tell_us_once_status IN ('reference-received', 'not-offered', 'declined', '')),
    tell_us_once_reference TEXT NOT NULL DEFAULT '',
    copies_requested INTEGER CHECK (copies_requested IS NULL OR copies_requested >= 0),
    copy_order_channel VARCHAR(25) NOT NULL DEFAULT '' CHECK (copy_order_channel IN ('at-registration', 'gro-online', 'phone', 'post', 'local-register-office', '')),
    gro_index_reference TEXT NOT NULL DEFAULT '',
    priority_service VARCHAR(5) NOT NULL DEFAULT '' CHECK (priority_service IN ('yes', 'no', ''))
);

CREATE INDEX united_kingdom_death_registration_patient_id_idx
    ON united_kingdom_death_registration (patient_id);
CREATE INDEX united_kingdom_death_registration_informant_id_idx
    ON united_kingdom_death_registration (informant_id);

CREATE TRIGGER trigger_united_kingdom_death_registration_updated_at
    BEFORE UPDATE ON united_kingdom_death_registration
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_death_registration IS
    'Main death-registration record: the registrar-side and family-side process in England and Wales after an MCCD. Classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN united_kingdom_death_registration.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_death_registration.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_death_registration.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_death_registration.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_death_registration.patient_id IS
    'Foreign key to the deceased whose death is being registered (restrict delete).';
COMMENT ON COLUMN united_kingdom_death_registration.informant_id IS
    'Foreign key to the informant (restrict delete); optional.';
COMMENT ON COLUMN united_kingdom_death_registration.deceased_name IS
    'Name of the deceased as given for the register entry.';
COMMENT ON COLUMN united_kingdom_death_registration.sex IS
    'Sex of the deceased: female, male, other, or unknown.';
COMMENT ON COLUMN united_kingdom_death_registration.date_of_birth IS
    'Date of birth of the deceased; null when unknown.';
COMMENT ON COLUMN united_kingdom_death_registration.date_of_death IS
    'Date of death; null when not yet stated.';
COMMENT ON COLUMN united_kingdom_death_registration.place_of_death IS
    'Place where the death occurred.';
COMMENT ON COLUMN united_kingdom_death_registration.death_jurisdiction IS
    'Where the death occurred; this form covers england-wales only.';
COMMENT ON COLUMN united_kingdom_death_registration.deceased_particulars_known IS
    'Whether the informant can give the deceased''s full particulars (names, birth date and place, address, occupation, marital status).';
COMMENT ON COLUMN united_kingdom_death_registration.mccd_received IS
    'Whether the register office has received the medical certificate of cause of death (MCCD).';
COMMENT ON COLUMN united_kingdom_death_registration.medical_examiner_status IS
    'Whether the medical examiner''s office has confirmed that the death can be registered.';
COMMENT ON COLUMN united_kingdom_death_registration.medical_examiner_confirmation_date IS
    'Date the medical examiner''s office confirmed; starts the 5-day clock. Null when unconfirmed.';
COMMENT ON COLUMN united_kingdom_death_registration.referred_to_coroner IS
    'Whether the death has been reported to a coroner.';
COMMENT ON COLUMN united_kingdom_death_registration.coroner_stage IS
    'Stage of the coroner''s involvement.';
COMMENT ON COLUMN united_kingdom_death_registration.coroner_certificate_received IS
    'Whether the registrar has the coroner''s certificate (form CN2, or the certificate after inquest) needed to register.';
COMMENT ON COLUMN united_kingdom_death_registration.informant_name IS
    'Name of the person who will register the death.';
COMMENT ON COLUMN united_kingdom_death_registration.informant_relationship IS
    'Basis on which the informant qualifies under section 16 of the 1953 Act, or not-qualified.';
COMMENT ON COLUMN united_kingdom_death_registration.informant_address IS
    'Address of the informant.';
COMMENT ON COLUMN united_kingdom_death_registration.register_office IS
    'Register office where the death is or will be registered.';
COMMENT ON COLUMN united_kingdom_death_registration.appointment_booked IS
    'Whether an appointment with the registrar has been booked.';
COMMENT ON COLUMN united_kingdom_death_registration.supporting_documents_available IS
    'Whether supporting documents (birth or marriage certificate, passport, proof of address) are to hand; helpful but not mandatory.';
COMMENT ON COLUMN united_kingdom_death_registration.registration_date IS
    'Date the death was registered; null while unregistered.';
COMMENT ON COLUMN united_kingdom_death_registration.as_of_date IS
    'Assessment date used to count days since confirmation; supplied explicitly so grading is deterministic.';
COMMENT ON COLUMN united_kingdom_death_registration.disposal_method IS
    'Intended method of disposal of the body.';
COMMENT ON COLUMN united_kingdom_death_registration.disposal_certificate_issued IS
    'Whether the certificate for burial or cremation (the green form) has been issued.';
COMMENT ON COLUMN united_kingdom_death_registration.tell_us_once_status IS
    'Whether the Tell Us Once reference number was issued, not offered, or declined.';
COMMENT ON COLUMN united_kingdom_death_registration.tell_us_once_reference IS
    'Tell Us Once reference number given at registration; used to report the death to government departments.';
COMMENT ON COLUMN united_kingdom_death_registration.copies_requested IS
    'Number of certified copies of the death certificate requested; null when undecided.';
COMMENT ON COLUMN united_kingdom_death_registration.copy_order_channel IS
    'How copies are ordered.';
COMMENT ON COLUMN united_kingdom_death_registration.gro_index_reference IS
    'General Register Office index reference; avoids the GBP 3.50 search fee when ordering online.';
COMMENT ON COLUMN united_kingdom_death_registration.priority_service IS
    'Whether the GRO priority service (next-working-day dispatch) is requested; online orders only.';
