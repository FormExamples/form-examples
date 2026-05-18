-- The certificate itself: one row per vaccinee per issued certificate.
-- Holds the vaccinee identity link, the issuing centre, the supervising
-- clinician for the certificate as a whole, the travel context, and the
-- electronic-signature sign-off.
-- Each vaccination entry is recorded in the companion *_entry table.

CREATE TABLE international_certificate_of_vaccination_or_prophylaxis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE RESTRICT,
    center_id UUID NOT NULL REFERENCES center(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'reissued', 'revoked')),
    issued_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT NOT NULL DEFAULT '',

    certificate_serial_number VARCHAR(50) NOT NULL DEFAULT '',
    issuing_country_as_iso_3166_1_alpha_3 CHAR(3) NOT NULL DEFAULT '',
    primary_language_as_bcp_47 VARCHAR(10) NOT NULL DEFAULT 'en',
    secondary_language_as_bcp_47 VARCHAR(10) NOT NULL DEFAULT 'fr',
    tertiary_language_as_bcp_47 VARCHAR(10) NOT NULL DEFAULT '',

    destination_countries_as_iso_3166_1_alpha_3 TEXT NOT NULL DEFAULT '',
    planned_arrival_date DATE,
    purpose_of_travel VARCHAR(50) NOT NULL DEFAULT '' CHECK (purpose_of_travel IN ('tourism', 'business', 'study', 'employment', 'humanitarian', 'military', 'family', 'medical', 'other', '')),

    medical_waiver VARCHAR(5) NOT NULL DEFAULT '' CHECK (medical_waiver IN ('yes', 'no', '')),
    medical_waiver_reason TEXT NOT NULL DEFAULT '',
    medical_waiver_signed_by_clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    medical_waiver_signed_at TIMESTAMPTZ,

    declared_pregnancy VARCHAR(5) NOT NULL DEFAULT '' CHECK (declared_pregnancy IN ('yes', 'no', '')),
    declared_breastfeeding VARCHAR(5) NOT NULL DEFAULT '' CHECK (declared_breastfeeding IN ('yes', 'no', '')),
    declared_immunosuppression VARCHAR(5) NOT NULL DEFAULT '' CHECK (declared_immunosuppression IN ('yes', 'no', '')),

    electronic_signature_data_url TEXT NOT NULL DEFAULT '',
    electronic_signature_signed_at TIMESTAMPTZ,
    overall_valid VARCHAR(5) NOT NULL DEFAULT '' CHECK (overall_valid IN ('yes', 'no', '')),
    validity_computed_at TIMESTAMPTZ,
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_icvp_updated_at
    BEFORE UPDATE ON international_certificate_of_vaccination_or_prophylaxis
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE international_certificate_of_vaccination_or_prophylaxis IS
    'WHO International Certificate of Vaccination or Prophylaxis (IHR 2005 Annex 6). One row per vaccinee per issued certificate; vaccination entries are recorded in the companion *_entry table.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.patient_id IS
    'Foreign key to the vaccinee.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.clinician_id IS
    'Foreign key to the supervising clinician for the certificate as a whole.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.center_id IS
    'Foreign key to the WHO-designated administering centre.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.status IS
    'Lifecycle status: draft, issued, reissued, or revoked.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.issued_at IS
    'Timestamp when the certificate was issued to the vaccinee.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.revoked_at IS
    'Timestamp when the certificate was revoked, if applicable.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.revocation_reason IS
    'Reason the certificate was revoked.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.certificate_serial_number IS
    'Issuing centre''s serial number for this certificate.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.issuing_country_as_iso_3166_1_alpha_3 IS
    'Issuing country as ISO 3166-1 alpha-3.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.primary_language_as_bcp_47 IS
    'Primary language of the printed certificate (BCP 47).';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.secondary_language_as_bcp_47 IS
    'Secondary language of the printed certificate; IHR Annex 6 requires English or French as one of the two.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.tertiary_language_as_bcp_47 IS
    'Optional third language for the printed certificate (issuing country''s official language).';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.destination_countries_as_iso_3166_1_alpha_3 IS
    'Space-separated list of destination countries for the trip.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.planned_arrival_date IS
    'Planned date of arrival at the primary destination.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.purpose_of_travel IS
    'Purpose of travel: tourism, business, study, employment, humanitarian, military, family, medical, other.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.medical_waiver IS
    'Whether a clinician-signed medical waiver has been issued in lieu of vaccination.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.medical_waiver_reason IS
    'Free-text clinical reason for the medical waiver.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.medical_waiver_signed_by_clinician_id IS
    'Foreign key to the clinician who signed the medical waiver, if any.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.medical_waiver_signed_at IS
    'Timestamp when the medical waiver was signed.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.declared_pregnancy IS
    'Whether the vaccinee declared pregnancy at the encounter.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.declared_breastfeeding IS
    'Whether the vaccinee declared breastfeeding at the encounter.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.declared_immunosuppression IS
    'Whether the vaccinee declared immunosuppression at the encounter.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.electronic_signature_data_url IS
    'Final electronic signature of the issuing clinician captured as a data URL.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.electronic_signature_signed_at IS
    'Timestamp when the electronic signature was applied.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.overall_valid IS
    'Computed overall validity flag: yes if all entries pass the validation rules.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.validity_computed_at IS
    'Timestamp at which overall validity was last computed.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis.notes IS
    'Free-text notes by the issuing clinician.';

CREATE INDEX icvp_index_patient_id
    ON international_certificate_of_vaccination_or_prophylaxis (patient_id);
CREATE INDEX icvp_index_center_id
    ON international_certificate_of_vaccination_or_prophylaxis (center_id);
CREATE INDEX icvp_index_status
    ON international_certificate_of_vaccination_or_prophylaxis (status);
