-- Main US Standard Certificate of Death record (U.S. Department of Health and
-- Human Services, CDC/NCHS, 2003 revision). The funeral director completes the
-- personal and disposition items; the medical certifier completes the cause of
-- death, manner of death, and related items. The classification result, the
-- audit trail of fired rules, and the flagged issues live in child tables.
-- Documentation support only: the registering state agency decides.

CREATE TABLE united_states_standard_certificate_of_death (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    state CHAR(2) NOT NULL DEFAULT '' CHECK (state = '' OR state ~ '^[A-Z]{2}$'),
    decedent_name TEXT NOT NULL DEFAULT '',
    sex VARCHAR(9) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'unknown', '')),
    date_of_birth DATE,
    age_years INTEGER CHECK (age_years IS NULL OR (age_years >= 0 AND age_years <= 130)),
    marital_status VARCHAR(19) NOT NULL DEFAULT '' CHECK (marital_status IN ('married', 'married-separated', 'widowed', 'divorced', 'never-married', 'unknown', '')),
    veteran_status VARCHAR(5) NOT NULL DEFAULT '' CHECK (veteran_status IN ('yes', 'no', '')),
    state_of_residence CHAR(2) NOT NULL DEFAULT '' CHECK (state_of_residence = '' OR state_of_residence ~ '^[A-Z]{2}$'),
    place_of_death_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (place_of_death_type IN ('hospital-inpatient', 'hospital-emergency-outpatient', 'hospital-dead-on-arrival', 'decedent-home', 'hospice', 'nursing-home', 'other', '')),
    place_of_death_facility TEXT NOT NULL DEFAULT '',
    date_of_death DATE,
    time_of_death TIME,
    certifier_name TEXT NOT NULL DEFAULT '',
    certifier_type VARCHAR(40) NOT NULL DEFAULT '' CHECK (certifier_type IN ('certifying-physician', 'pronouncing-and-certifying-physician', 'medical-examiner', 'coroner', 'other', '')),
    certifier_license_number VARCHAR(50) NOT NULL DEFAULT '',
    certification_date DATE,
    attended_deceased VARCHAR(5) NOT NULL DEFAULT '' CHECK (attended_deceased IN ('yes', 'no', '')),
    last_seen_alive_date DATE,
    cause_ia_condition TEXT NOT NULL DEFAULT '',
    cause_ia_interval VARCHAR(100) NOT NULL DEFAULT '',
    cause_ib_condition TEXT NOT NULL DEFAULT '',
    cause_ib_interval VARCHAR(100) NOT NULL DEFAULT '',
    cause_ic_condition TEXT NOT NULL DEFAULT '',
    cause_ic_interval VARCHAR(100) NOT NULL DEFAULT '',
    cause_id_condition TEXT NOT NULL DEFAULT '',
    cause_id_interval VARCHAR(100) NOT NULL DEFAULT '',
    part_ii_conditions TEXT NOT NULL DEFAULT '',
    autopsy_performed VARCHAR(5) NOT NULL DEFAULT '' CHECK (autopsy_performed IN ('yes', 'no', '')),
    autopsy_findings_available VARCHAR(5) NOT NULL DEFAULT '' CHECK (autopsy_findings_available IN ('yes', 'no', '')),
    manner_of_death VARCHAR(30) NOT NULL DEFAULT '' CHECK (manner_of_death IN ('natural', 'accident', 'suicide', 'homicide', 'pending-investigation', 'could-not-be-determined', '')),
    tobacco_use_contributed VARCHAR(10) NOT NULL DEFAULT '' CHECK (tobacco_use_contributed IN ('yes', 'probably', 'no', 'unknown', '')),
    pregnancy_status VARCHAR(50) NOT NULL DEFAULT '' CHECK (pregnancy_status IN ('not-applicable', 'not-pregnant-within-past-year', 'pregnant-at-time-of-death', 'not-pregnant-but-pregnant-within-42-days', 'not-pregnant-but-pregnant-43-days-to-1-year', 'unknown', '')),
    injury_date DATE,
    injury_time TIME,
    injury_place TEXT NOT NULL DEFAULT '',
    injury_at_work VARCHAR(5) NOT NULL DEFAULT '' CHECK (injury_at_work IN ('yes', 'no', '')),
    injury_location TEXT NOT NULL DEFAULT '',
    injury_description TEXT NOT NULL DEFAULT '',
    transportation_injury_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (transportation_injury_role IN ('driver-operator', 'passenger', 'pedestrian', 'other', '')),
    referred_to_medical_examiner VARCHAR(5) NOT NULL DEFAULT '' CHECK (referred_to_medical_examiner IN ('yes', 'no', '')),
    referral_reason VARCHAR(35) NOT NULL DEFAULT '' CHECK (referral_reason IN ('none', 'violent-or-unnatural', 'accident', 'suicide', 'homicide', 'suspicious', 'poisoning-or-overdose', 'unattended-by-physician', 'sudden-unexpected-infant-death', 'work-related', 'medical-procedure-related', 'in-custody', 'public-health-hazard', 'unidentified', 'other', '')),
    funeral_director_name TEXT NOT NULL DEFAULT '',
    funeral_director_license_number VARCHAR(50) NOT NULL DEFAULT '',
    disposition_method VARCHAR(25) NOT NULL DEFAULT '' CHECK (disposition_method IN ('burial', 'cremation', 'entombment', 'donation', 'removal-from-state', 'other', '')),
    disposition_date DATE,
    disposition_place TEXT NOT NULL DEFAULT '',
    filed_date DATE,
    certified_copies_requested INTEGER CHECK (certified_copies_requested IS NULL OR (certified_copies_requested >= 0 AND certified_copies_requested <= 100)),
    requester_relationship VARCHAR(25) NOT NULL DEFAULT '' CHECK (requester_relationship IN ('spouse', 'child', 'parent', 'sibling', 'legal-representative', 'funeral-director', 'other', '')),
    requester_identity_verified VARCHAR(5) NOT NULL DEFAULT '' CHECK (requester_identity_verified IN ('yes', 'no', '')),
    fee_paid_in_usd NUMERIC(8,2) CHECK (fee_paid_in_usd IS NULL OR fee_paid_in_usd >= 0),
    certifier_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX usscd_patient_id_idx
    ON united_states_standard_certificate_of_death (patient_id);
CREATE INDEX usscd_clinician_id_idx
    ON united_states_standard_certificate_of_death (clinician_id);

CREATE TRIGGER trigger_united_states_standard_certificate_of_death_updated_at
    BEFORE UPDATE ON united_states_standard_certificate_of_death
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_standard_certificate_of_death IS
    'Main US Standard Certificate of Death record (NCHS 2003 revision): decedent facts, the certifier''s Part I and Part II cause-of-death chain, manner of death, tobacco, pregnancy and injury items, medical examiner or coroner referral, the funeral director''s disposition, and the certified-copy order. Validity classification, fired rules and flags live in child tables.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.patient_id IS
    'Foreign key to the decedent this certificate documents (restrict delete).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.clinician_id IS
    'Foreign key to the certifier (restrict delete); optional.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.state IS
    'Two-letter USPS code of the state (or territory) whose vital-records office registers the death; selects the STATE_RULES row.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.decedent_name IS
    'Legal name of the decedent as recorded on the certificate (item 1).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.sex IS
    'Sex of the decedent (item 2): female, male, or unknown.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.date_of_birth IS
    'Date of birth of the decedent (item 5).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.age_years IS
    'Age of the decedent at death in whole years (item 4); 0 for an infant under one year.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.marital_status IS
    'Marital status at time of death (item 8).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.veteran_status IS
    'Whether the decedent ever served in the US Armed Forces (item 10).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.state_of_residence IS
    'Two-letter USPS code of the decedent''s state of residence (item 14).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.place_of_death_type IS
    'Place of death type (item 20): inpatient, ER/outpatient, DOA, home, hospice, nursing home, or other.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.place_of_death_facility IS
    'Name and address of the facility or location where death occurred or the body was found (items 20 to 26).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.date_of_death IS
    'Date of death, actual or presumed (item 29).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.time_of_death IS
    'Time of death, actual or presumed (item 30).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.certifier_name IS
    'Name of the person completing the cause-of-death section (item 32 / certifier block).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.certifier_type IS
    'Certifier type (item 32): certifying physician, pronouncing and certifying physician, medical examiner, coroner, or other.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.certifier_license_number IS
    'State license number of the certifier (item 33 / 34).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.certification_date IS
    'Date the certifier signed the cause-of-death section (item 35).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.attended_deceased IS
    'Whether the certifier attended the decedent during the last illness (yes/no).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.last_seen_alive_date IS
    'Date the certifier last saw the decedent alive.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.cause_ia_condition IS
    'Part I line (a): the immediate cause, the final disease or condition resulting in death (required).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.cause_ia_interval IS
    'Part I line (a): approximate interval between onset and death (item 32).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.cause_ib_condition IS
    'Part I line (b): the condition, if any, giving rise to line (a) (due to, or as a consequence of).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.cause_ib_interval IS
    'Part I line (b): approximate interval between onset and death (item 32).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.cause_ic_condition IS
    'Part I line (c): the condition, if any, giving rise to line (b).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.cause_ic_interval IS
    'Part I line (c): approximate interval between onset and death (item 32).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.cause_id_condition IS
    'Part I line (d): the underlying cause, the condition that initiated the chain, when four steps are needed.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.cause_id_interval IS
    'Part I line (d): approximate interval between onset and death (item 32).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.part_ii_conditions IS
    'Part II: other significant conditions contributing to death but not resulting in the underlying cause given in Part I.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.autopsy_performed IS
    'Whether an autopsy was performed (item 34 / 35).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.autopsy_findings_available IS
    'Whether autopsy findings were available to complete the cause of death.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.manner_of_death IS
    'Manner of death (item 41): natural, accident, suicide, homicide, pending investigation, or could not be determined.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.tobacco_use_contributed IS
    'Did tobacco use contribute to death (item 37): yes, probably, no, or unknown.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.pregnancy_status IS
    'Pregnancy status (item 36), asked for females; not applicable for males and for females outside the age band.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.injury_date IS
    'Date of injury (item 43).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.injury_time IS
    'Time of injury (item 44).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.injury_place IS
    'Place of injury, for example decedent''s home, construction site, or restaurant (item 45).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.injury_at_work IS
    'Whether the injury occurred at work (item 46).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.injury_location IS
    'Location of injury: state, city, street and number, apartment, zip code (item 47).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.injury_description IS
    'Description of how the injury occurred (item 48): specific enough to code the external cause.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.transportation_injury_role IS
    'Role of the decedent if a transportation injury (item 49).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.referred_to_medical_examiner IS
    'Whether the death was referred to the medical examiner or coroner.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.referral_reason IS
    'Medical-examiner or coroner referral criterion, if any; any listed circumstance other than none requires referral.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.funeral_director_name IS
    'Name of the funeral director or person acting as such (items 27 and 28).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.funeral_director_license_number IS
    'State license number of the funeral director.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.disposition_method IS
    'Method of disposition (item 19): burial, cremation, entombment, donation, removal from state, or other.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.disposition_date IS
    'Date of disposition (item 19).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.disposition_place IS
    'Place of disposition: name of cemetery, crematory, or other place (item 20).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.filed_date IS
    'Date the certificate was filed with the local or state registrar.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.certified_copies_requested IS
    'Number of certified copies ordered.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.requester_relationship IS
    'Relationship of the person ordering certified copies to the decedent; most states restrict who may obtain them.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.requester_identity_verified IS
    'Whether the requester''s identity and eligibility were verified before certified copies were issued.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.fee_paid_in_usd IS
    'Total fee paid in US dollars for the certified copies.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.certifier_note IS
    'Free-text note from the certifier or funeral director.';
