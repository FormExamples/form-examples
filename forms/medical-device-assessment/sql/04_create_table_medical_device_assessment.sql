-- Medical device regulatory and risk assessment inputs (EU MDR 2017/745 Annex VIII and UK MDR 2002 classification rules).

CREATE TABLE medical_device_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    manufacturer_id UUID NOT NULL REFERENCES manufacturer(id) ON DELETE CASCADE,
    assessor_id UUID NOT NULL REFERENCES assessor(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'urgent')),
    assessment_date DATE,
    device_name VARCHAR(255) NOT NULL DEFAULT '',
    model_or_catalogue_number VARCHAR(100) NOT NULL DEFAULT '',
    unique_device_identifier VARCHAR(255) NOT NULL DEFAULT '',
    intended_purpose TEXT NOT NULL DEFAULT '',
    intended_user VARCHAR(20) NOT NULL DEFAULT '' CHECK (intended_user IN ('professional', 'lay-person', 'both', '')),
    target_jurisdiction VARCHAR(10) NOT NULL DEFAULT '' CHECK (target_jurisdiction IN ('eu-mdr', 'uk-mdr', 'both', '')),
    is_in_vitro_diagnostic VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_in_vitro_diagnostic IN ('yes', 'no', '')),
    device_kind VARCHAR(25) NOT NULL DEFAULT '' CHECK (device_kind IN ('non-invasive', 'invasive-body-orifice', 'surgically-invasive', 'implantable', 'active', 'software', 'other', '')),
    contact_duration VARCHAR(15) NOT NULL DEFAULT '' CHECK (contact_duration IN ('transient', 'short-term', 'long-term', '')),
    body_site VARCHAR(30) NOT NULL DEFAULT '' CHECK (body_site IN ('intact-skin', 'wounded-skin', 'oral-nasal-ear', 'other-orifice', 'tissue', 'central-circulatory-system', 'central-nervous-system', 'heart', 'other', '')),
    channels_or_stores_body_substances VARCHAR(5) NOT NULL DEFAULT '' CHECK (channels_or_stores_body_substances IN ('yes', 'no', '')),
    connected_to_active_device_class_iia_or_higher VARCHAR(5) NOT NULL DEFAULT '' CHECK (connected_to_active_device_class_iia_or_higher IN ('yes', 'no', '')),
    reusable_surgical_instrument VARCHAR(5) NOT NULL DEFAULT '' CHECK (reusable_surgical_instrument IN ('yes', 'no', '')),
    active_therapeutic VARCHAR(5) NOT NULL DEFAULT '' CHECK (active_therapeutic IN ('yes', 'no', '')),
    active_diagnostic VARCHAR(5) NOT NULL DEFAULT '' CHECK (active_diagnostic IN ('yes', 'no', '')),
    administers_or_exchanges_energy VARCHAR(5) NOT NULL DEFAULT '' CHECK (administers_or_exchanges_energy IN ('yes', 'no', '')),
    energy_potentially_hazardous VARCHAR(5) NOT NULL DEFAULT '' CHECK (energy_potentially_hazardous IN ('yes', 'no', '')),
    administers_or_removes_medicinal_substances VARCHAR(5) NOT NULL DEFAULT '' CHECK (administers_or_removes_medicinal_substances IN ('yes', 'no', '')),
    administration_potentially_hazardous VARCHAR(5) NOT NULL DEFAULT '' CHECK (administration_potentially_hazardous IN ('yes', 'no', '')),
    monitors_vital_physiological_parameters VARCHAR(5) NOT NULL DEFAULT '' CHECK (monitors_vital_physiological_parameters IN ('yes', 'no', '')),
    closed_loop_therapy VARCHAR(5) NOT NULL DEFAULT '' CHECK (closed_loop_therapy IN ('yes', 'no', '')),
    software_purpose VARCHAR(40) NOT NULL DEFAULT '' CHECK (software_purpose IN ('none', 'provides-information-for-decisions', 'monitors-physiological-processes', 'other', '')),
    software_worst_case_harm VARCHAR(50) NOT NULL DEFAULT '' CHECK (software_worst_case_harm IN ('death-or-irreversible-deterioration', 'serious-deterioration-or-surgical-intervention', 'other', '')),
    contains_medicinal_substance VARCHAR(5) NOT NULL DEFAULT '' CHECK (contains_medicinal_substance IN ('yes', 'no', '')),
    contains_human_or_animal_tissue VARCHAR(5) NOT NULL DEFAULT '' CHECK (contains_human_or_animal_tissue IN ('yes', 'no', '')),
    contains_nanomaterial_with_high_exposure_potential VARCHAR(5) NOT NULL DEFAULT '' CHECK (contains_nanomaterial_with_high_exposure_potential IN ('yes', 'no', '')),
    composed_of_absorbed_substances VARCHAR(5) NOT NULL DEFAULT '' CHECK (composed_of_absorbed_substances IN ('yes', 'no', '')),
    contraception_or_sti_prevention VARCHAR(5) NOT NULL DEFAULT '' CHECK (contraception_or_sti_prevention IN ('yes', 'no', '')),
    disinfects_or_cleans_devices VARCHAR(5) NOT NULL DEFAULT '' CHECK (disinfects_or_cleans_devices IN ('yes', 'no', '')),
    supplied_sterile VARCHAR(5) NOT NULL DEFAULT '' CHECK (supplied_sterile IN ('yes', 'no', '')),
    has_measuring_function VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_measuring_function IN ('yes', 'no', '')),
    clinical_evidence_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (clinical_evidence_status IN ('complete', 'partial', 'none', '')),
    risk_management_file_iso_14971 VARCHAR(5) NOT NULL DEFAULT '' CHECK (risk_management_file_iso_14971 IN ('yes', 'no', '')),
    quality_management_system_iso_13485 VARCHAR(5) NOT NULL DEFAULT '' CHECK (quality_management_system_iso_13485 IN ('yes', 'no', '')),
    cybersecurity_assessment_done VARCHAR(5) NOT NULL DEFAULT '' CHECK (cybersecurity_assessment_done IN ('yes', 'no', '')),
    post_market_surveillance_plan VARCHAR(5) NOT NULL DEFAULT '' CHECK (post_market_surveillance_plan IN ('yes', 'no', '')),
    unique_device_identifier_assigned VARCHAR(5) NOT NULL DEFAULT '' CHECK (unique_device_identifier_assigned IN ('yes', 'no', '')),
    assessor_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medical_device_assessment_updated_at
    BEFORE UPDATE ON medical_device_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_medical_device_assessment_manufacturer_id
    ON medical_device_assessment(manufacturer_id);
CREATE INDEX index_medical_device_assessment_assessor_id
    ON medical_device_assessment(assessor_id);

COMMENT ON TABLE medical_device_assessment IS
    'Medical device assessment.';
COMMENT ON COLUMN medical_device_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_device_assessment.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_device_assessment.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_device_assessment.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_device_assessment.manufacturer_id IS
    'Foreign key to the manufacturer table.';
COMMENT ON COLUMN medical_device_assessment.assessor_id IS
    'Foreign key to the assessor table.';
COMMENT ON COLUMN medical_device_assessment.status IS
    'Lifecycle status of this row.';
COMMENT ON COLUMN medical_device_assessment.assessment_date IS
    'Assessment date.';
COMMENT ON COLUMN medical_device_assessment.device_name IS
    'Device name.';
COMMENT ON COLUMN medical_device_assessment.model_or_catalogue_number IS
    'Model or catalogue number.';
COMMENT ON COLUMN medical_device_assessment.unique_device_identifier IS
    'Unique device identifier.';
COMMENT ON COLUMN medical_device_assessment.intended_purpose IS
    'Intended purpose.';
COMMENT ON COLUMN medical_device_assessment.intended_user IS
    'Intended user. One of: professional, lay-person, both.';
COMMENT ON COLUMN medical_device_assessment.target_jurisdiction IS
    'Target jurisdiction. One of: eu-mdr, uk-mdr, both.';
COMMENT ON COLUMN medical_device_assessment.is_in_vitro_diagnostic IS
    'Is in vitro diagnostic. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.device_kind IS
    'Device kind. One of: non-invasive, invasive-body-orifice, surgically-invasive, implantable, active, software, other.';
COMMENT ON COLUMN medical_device_assessment.contact_duration IS
    'Contact duration. One of: transient, short-term, long-term.';
COMMENT ON COLUMN medical_device_assessment.body_site IS
    'Body site. One of: intact-skin, wounded-skin, oral-nasal-ear, other-orifice, tissue, central-circulatory-system, central-nervous-system, heart, ….';
COMMENT ON COLUMN medical_device_assessment.channels_or_stores_body_substances IS
    'Channels or stores body substances. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.connected_to_active_device_class_iia_or_higher IS
    'Connected to active device class iia or higher. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.reusable_surgical_instrument IS
    'Reusable surgical instrument. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.active_therapeutic IS
    'Active therapeutic. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.active_diagnostic IS
    'Active diagnostic. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.administers_or_exchanges_energy IS
    'Administers or exchanges energy. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.energy_potentially_hazardous IS
    'Energy potentially hazardous. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.administers_or_removes_medicinal_substances IS
    'Administers or removes medicinal substances. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.administration_potentially_hazardous IS
    'Administration potentially hazardous. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.monitors_vital_physiological_parameters IS
    'Monitors vital physiological parameters. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.closed_loop_therapy IS
    'Closed loop therapy. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.software_purpose IS
    'Software purpose. One of: none, provides-information-for-decisions, monitors-physiological-processes, other.';
COMMENT ON COLUMN medical_device_assessment.software_worst_case_harm IS
    'Software worst case harm. One of: death-or-irreversible-deterioration, serious-deterioration-or-surgical-intervention, other.';
COMMENT ON COLUMN medical_device_assessment.contains_medicinal_substance IS
    'Contains medicinal substance. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.contains_human_or_animal_tissue IS
    'Contains human or animal tissue. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.contains_nanomaterial_with_high_exposure_potential IS
    'Contains nanomaterial with high exposure potential. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.composed_of_absorbed_substances IS
    'Composed of absorbed substances. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.contraception_or_sti_prevention IS
    'Contraception or sti prevention. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.disinfects_or_cleans_devices IS
    'Disinfects or cleans devices. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.supplied_sterile IS
    'Supplied sterile. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.has_measuring_function IS
    'Has measuring function. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.clinical_evidence_status IS
    'Clinical evidence status. One of: complete, partial, none.';
COMMENT ON COLUMN medical_device_assessment.risk_management_file_iso_14971 IS
    'Risk management file iso 14971. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.quality_management_system_iso_13485 IS
    'Quality management system iso 13485. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.cybersecurity_assessment_done IS
    'Cybersecurity assessment done. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.post_market_surveillance_plan IS
    'Post market surveillance plan. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.unique_device_identifier_assigned IS
    'Unique device identifier assigned. One of: yes, no.';
COMMENT ON COLUMN medical_device_assessment.assessor_notes IS
    'Assessor notes.';
