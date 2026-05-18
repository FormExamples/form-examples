-- One row per vaccination or prophylaxis administered and recorded on a
-- single certificate. A certificate normally has a single yellow-fever
-- entry but may carry multiple entries for different diseases or for
-- booster doses.

CREATE TABLE international_certificate_of_vaccination_or_prophylaxis_entry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    international_certificate_of_vaccination_or_prophylaxis_id UUID NOT NULL
        REFERENCES international_certificate_of_vaccination_or_prophylaxis(id) ON DELETE CASCADE,
    entry_index INTEGER NOT NULL DEFAULT 1 CHECK (entry_index BETWEEN 1 AND 8),

    disease VARCHAR(30) NOT NULL DEFAULT '' CHECK (disease IN ('yellow-fever', 'polio', 'smallpox', 'cholera', 'meningococcal', 'covid-19', 'other', '')),
    disease_other_label VARCHAR(100) NOT NULL DEFAULT '',
    disease_as_snomed_ct VARCHAR(20) NOT NULL DEFAULT '',
    disease_as_icd_11 VARCHAR(20) NOT NULL DEFAULT '',

    vaccine_or_prophylaxis_name VARCHAR(255) NOT NULL DEFAULT '',
    vaccine_as_snomed_ct VARCHAR(20) NOT NULL DEFAULT '',
    vaccine_as_atc VARCHAR(20) NOT NULL DEFAULT '',
    manufacturer VARCHAR(255) NOT NULL DEFAULT '',
    manufacturer_country_as_iso_3166_1_alpha_3 CHAR(3) NOT NULL DEFAULT '',
    batch_number VARCHAR(50) NOT NULL DEFAULT '',
    lot_expiry_date DATE,

    route VARCHAR(30) NOT NULL DEFAULT '' CHECK (route IN ('intramuscular', 'subcutaneous', 'intradermal', 'oral', 'intranasal', 'other', '')),
    anatomical_site VARCHAR(30) NOT NULL DEFAULT '' CHECK (anatomical_site IN ('left-deltoid', 'right-deltoid', 'left-thigh', 'right-thigh', 'left-gluteus', 'right-gluteus', 'oral', 'nasal', 'other', '')),
    dose_amount_value NUMERIC(6,3),
    dose_amount_unit VARCHAR(10) NOT NULL DEFAULT '' CHECK (dose_amount_unit IN ('mL', 'mg', 'IU', 'drops', '')),
    dose_sequence INTEGER CHECK (dose_sequence IS NULL OR dose_sequence BETWEEN 1 AND 10),
    dose_sequence_total INTEGER CHECK (dose_sequence_total IS NULL OR dose_sequence_total BETWEEN 1 AND 10),

    vaccination_date DATE,
    vaccination_time TIME,
    administered_by_clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    administering_clinician_signature_data_url TEXT NOT NULL DEFAULT '',
    administering_clinician_professional_status VARCHAR(50) NOT NULL DEFAULT '',

    validity_starts_on DATE,
    validity_ends_on DATE,
    validity_is_lifetime VARCHAR(5) NOT NULL DEFAULT '' CHECK (validity_is_lifetime IN ('yes', 'no', '')),

    centre_id UUID REFERENCES center(id) ON DELETE RESTRICT,
    centre_stamp_image_data_url TEXT NOT NULL DEFAULT '',
    centre_stamp_applied VARCHAR(5) NOT NULL DEFAULT '' CHECK (centre_stamp_applied IN ('yes', 'no', '')),

    adverse_event VARCHAR(20) NOT NULL DEFAULT '' CHECK (adverse_event IN ('none', 'local', 'systemic', 'anaphylaxis', 'other', '')),
    adverse_event_notes TEXT NOT NULL DEFAULT '',

    entry_valid VARCHAR(5) NOT NULL DEFAULT '' CHECK (entry_valid IN ('yes', 'no', '')),
    entry_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_icvp_entry_updated_at
    BEFORE UPDATE ON international_certificate_of_vaccination_or_prophylaxis_entry
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE international_certificate_of_vaccination_or_prophylaxis_entry IS
    'One vaccination or prophylaxis entry on an International Certificate of Vaccination or Prophylaxis. Multiple entries may appear on a single certificate for different diseases or booster doses.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.international_certificate_of_vaccination_or_prophylaxis_id IS
    'Foreign key to the parent certificate.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.entry_index IS
    '1-indexed position of this entry on the certificate (1 to 8 entries per certificate).';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.disease IS
    'Disease code: yellow-fever, polio, smallpox, cholera, meningococcal, covid-19, or other.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.disease_other_label IS
    'Free-text disease name when disease is "other".';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.disease_as_snomed_ct IS
    'Disease as SNOMED CT concept ID.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.disease_as_icd_11 IS
    'Disease as ICD-11 code.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.vaccine_or_prophylaxis_name IS
    'Trade or generic name of the vaccine or prophylaxis administered.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.vaccine_as_snomed_ct IS
    'Vaccine as SNOMED CT concept ID.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.vaccine_as_atc IS
    'Vaccine as WHO ATC classification code.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.manufacturer IS
    'Manufacturer name as printed on the vial label.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.manufacturer_country_as_iso_3166_1_alpha_3 IS
    'Country of manufacture as ISO 3166-1 alpha-3.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.batch_number IS
    'Batch or lot number as printed on the vial label.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.lot_expiry_date IS
    'Lot expiry date as printed on the vial label.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.route IS
    'Route of administration: intramuscular, subcutaneous, intradermal, oral, intranasal, or other.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.anatomical_site IS
    'Anatomical site of administration.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.dose_amount_value IS
    'Numeric dose amount administered.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.dose_amount_unit IS
    'Unit for the dose amount: mL, mg, IU, drops.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.dose_sequence IS
    'Dose number in the current vaccination course (1-indexed).';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.dose_sequence_total IS
    'Total doses planned for the current vaccination course.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.vaccination_date IS
    'Date the vaccination was administered.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.vaccination_time IS
    'Time of day the vaccination was administered.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.administered_by_clinician_id IS
    'Foreign key to the clinician who administered this dose.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.administering_clinician_signature_data_url IS
    'Handwritten signature of the administering clinician captured as a data URL (PNG). Stamps are not acceptable per IHR Annex 6.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.administering_clinician_professional_status IS
    'Professional status of the administering clinician as printed on the certificate.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.validity_starts_on IS
    'Date from which the entry is valid (for yellow fever: vaccination_date + 10 days).';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.validity_ends_on IS
    'Date on which the entry expires. May be left NULL when validity_is_lifetime is "yes".';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.validity_is_lifetime IS
    'Whether the entry is valid for the lifetime of the vaccinee. Set to "yes" for yellow fever per the 2016 IHR amendment.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.centre_id IS
    'Foreign key to the administering centre for this entry (may differ from the parent certificate centre for travellers vaccinated at multiple centres).';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.centre_stamp_image_data_url IS
    'Image of the centre''s uniform stamp captured on this entry.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.centre_stamp_applied IS
    'Whether the centre''s uniform stamp has been applied to this entry.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.adverse_event IS
    'Recorded adverse event following immunisation: none, local, systemic, anaphylaxis, or other.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.adverse_event_notes IS
    'Free-text notes describing the adverse event.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.entry_valid IS
    'Computed validity flag for this individual entry.';
COMMENT ON COLUMN international_certificate_of_vaccination_or_prophylaxis_entry.entry_notes IS
    'Free-text notes for this entry.';

CREATE INDEX icvp_entry_index_certificate_id
    ON international_certificate_of_vaccination_or_prophylaxis_entry
    (international_certificate_of_vaccination_or_prophylaxis_id);
CREATE INDEX icvp_entry_index_disease
    ON international_certificate_of_vaccination_or_prophylaxis_entry (disease);
CREATE INDEX icvp_entry_index_vaccination_date
    ON international_certificate_of_vaccination_or_prophylaxis_entry (vaccination_date);
