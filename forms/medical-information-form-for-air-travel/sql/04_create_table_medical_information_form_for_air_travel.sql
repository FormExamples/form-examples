-- Medical Information Form for Air Travel (MEDIF) — single assessment row.

CREATE TABLE medical_information_form_for_air_travel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'cleared', 'declined', 'urgent')),

    -- 1. Submitting agent
    submitter_name TEXT NOT NULL DEFAULT '',
    submitter_role VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (submitter_role IN ('passenger', 'agent', 'clinician', 'family-member', '')),
    submitter_email TEXT NOT NULL DEFAULT '',
    submitter_phone TEXT NOT NULL DEFAULT '',
    submitter_organisation TEXT NOT NULL DEFAULT '',
    airline_booking_reference VARCHAR(20) NOT NULL DEFAULT '',

    -- 3. Trip details
    airline_iata_code CHAR(2) NOT NULL DEFAULT '',
    airline_name TEXT NOT NULL DEFAULT '',
    outbound_flight_number VARCHAR(10) NOT NULL DEFAULT '',
    outbound_date DATE,
    outbound_origin_iata CHAR(3) NOT NULL DEFAULT '',
    outbound_destination_iata CHAR(3) NOT NULL DEFAULT '',
    return_flight_number VARCHAR(10) NOT NULL DEFAULT '',
    return_date DATE,
    cabin_class VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (cabin_class IN ('economy', 'premium-economy', 'business', 'first', '')),
    sector_duration_minutes INTEGER,
    transit_airports_iata TEXT NOT NULL DEFAULT '',
    special_assistance_codes TEXT NOT NULL DEFAULT '',

    -- 4. Reason for MEDIF
    reason_equipment VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (reason_equipment IN ('yes', 'no', '')),
    reason_recent_acute_event VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (reason_recent_acute_event IN ('yes', 'no', '')),
    reason_unstable_condition VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (reason_unstable_condition IN ('yes', 'no', '')),
    reason_communicable_disease VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (reason_communicable_disease IN ('yes', 'no', '')),
    reason_pregnancy VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (reason_pregnancy IN ('yes', 'no', '')),
    reason_mobility_escort VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (reason_mobility_escort IN ('yes', 'no', '')),
    reason_psychiatric VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (reason_psychiatric IN ('yes', 'no', '')),

    -- 6. Diagnosis
    primary_diagnosis TEXT NOT NULL DEFAULT '',
    icd10_codes TEXT NOT NULL DEFAULT '',
    diagnosis_date DATE,
    current_treatment TEXT NOT NULL DEFAULT '',
    last_admission_date DATE,
    last_discharge_date DATE,
    last_specialist_review_date DATE,

    -- 7. Cardiovascular
    resting_systolic_bp INTEGER,
    resting_diastolic_bp INTEGER,
    resting_heart_rate INTEGER,
    nyha_class VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (nyha_class IN ('I', 'II', 'III', 'IV', '')),
    recent_mi_date DATE,
    recent_stent_date DATE,
    on_anticoagulant VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (on_anticoagulant IN ('yes', 'no', '')),
    pacemaker_or_icd VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (pacemaker_or_icd IN ('yes', 'no', '')),
    exercise_tolerance_metres INTEGER,
    unstable_angina VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (unstable_angina IN ('yes', 'no', '')),

    -- 8. Respiratory
    resting_spo2_percent NUMERIC(4,1),
    predicted_inflight_spo2_percent NUMERIC(4,1),
    hypoxic_challenge_result VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (hypoxic_challenge_result IN ('pass', 'borderline', 'fail', 'not-performed', '')),
    recent_pneumothorax_date DATE,
    asthma_severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (asthma_severity IN ('none', 'mild-controlled', 'moderate', 'severe-uncontrolled', '')),
    copd_severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (copd_severity IN ('none', 'mild', 'moderate', 'severe', '')),
    cpap_or_bipap_use VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (cpap_or_bipap_use IN ('none', 'cpap', 'bipap', 'both', '')),
    recent_pulmonary_embolism_date DATE,

    -- 9. Recent events and surgery
    last_surgery_date DATE,
    last_surgery_site TEXT NOT NULL DEFAULT '',
    cabin_gas_risk VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (cabin_gas_risk IN (
            'none',
            'intra-ocular-gas',
            'intra-cranial-gas',
            'intra-abdominal-gas',
            'plaster-cast',
            'pneumothorax',
            'other',
            ''
        )),
    recent_fracture_cast VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (recent_fracture_cast IN ('yes', 'no', '')),
    recent_dvt_date DATE,
    scuba_diving_within_24h VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (scuba_diving_within_24h IN ('yes', 'no', '')),
    recent_stroke_date DATE,

    -- 10. Pregnancy
    is_pregnant VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (is_pregnant IN ('yes', 'no', '')),
    gestation_weeks INTEGER
        CHECK (gestation_weeks IS NULL OR gestation_weeks BETWEEN 0 AND 45),
    pregnancy_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (pregnancy_type IN ('singleton', 'twins', 'multiple', '')),
    pregnancy_complications TEXT NOT NULL DEFAULT '',
    expected_delivery_date DATE,
    obstetrician_contact TEXT NOT NULL DEFAULT '',

    -- 11. Communicable disease
    communicable_disease_status VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (communicable_disease_status IN (
            'none',
            'infectious',
            'convalescent',
            'cleared',
            ''
        )),
    last_symptom_date DATE,
    isolation_required VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (isolation_required IN ('yes', 'no', '')),
    vaccination_status TEXT NOT NULL DEFAULT '',
    current_antimicrobials TEXT NOT NULL DEFAULT '',

    -- 12. In-flight requirements
    requires_supplemental_oxygen VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (requires_supplemental_oxygen IN ('yes', 'no', '')),
    oxygen_flow_rate_lpm NUMERIC(3,1),
    oxygen_duration VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (oxygen_duration IN ('continuous', 'as-required', 'on-exertion', 'sleep-only', '')),
    requires_poc VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (requires_poc IN ('yes', 'no', '')),
    poc_make_model TEXT NOT NULL DEFAULT '',
    poc_battery_hours NUMERIC(4,1),
    requires_stretcher VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (requires_stretcher IN ('yes', 'no', '')),
    requires_incubator VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (requires_incubator IN ('yes', 'no', '')),
    requires_iv_pump VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (requires_iv_pump IN ('yes', 'no', '')),
    requires_medical_escort VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (requires_medical_escort IN ('yes', 'no', '')),
    requires_extra_seat VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (requires_extra_seat IN ('yes', 'no', '')),
    requires_accessible_lavatory VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (requires_accessible_lavatory IN ('yes', 'no', '')),
    wheelchair_type VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (wheelchair_type IN ('none', 'WCHR', 'WCHS', 'WCHC', '')),
    accompanying_carer VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (accompanying_carer IN ('yes', 'no', '')),

    -- 13. Cabin medications and equipment
    regular_medications TEXT NOT NULL DEFAULT '',
    controlled_drugs TEXT NOT NULL DEFAULT '',
    dangerous_goods_battery_declaration VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (dangerous_goods_battery_declaration IN ('yes', 'no', '')),
    sharps_in_cabin VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (sharps_in_cabin IN ('yes', 'no', '')),
    refrigerated_medication VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (refrigerated_medication IN ('yes', 'no', '')),
    customs_documentation_available VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (customs_documentation_available IN ('yes', 'no', '')),
    haemoglobin_g_per_l INTEGER,

    -- 14. Sign-off
    physician_declaration VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (physician_declaration IN ('fit', 'fit-with-conditions', 'unfit', 'unable-to-determine', '')),
    physician_signature_name TEXT NOT NULL DEFAULT '',
    physician_signature_date DATE,
    valid_until_date DATE,
    additional_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medical_information_form_for_air_travel_updated_at
    BEFORE UPDATE ON medical_information_form_for_air_travel
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_information_form_for_air_travel IS
    'One MEDIF row per submission: passenger identity, trip details, attending-physician clinical evaluation, and requested in-flight accommodations for an airline medical-desk decision.';
COMMENT ON COLUMN medical_information_form_for_air_travel.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_information_form_for_air_travel.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_information_form_for_air_travel.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN medical_information_form_for_air_travel.deleted_at IS
    'Timestamp when this row was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medical_information_form_for_air_travel.patient_id IS
    'Foreign key to the passenger (MEDIF subject).';
COMMENT ON COLUMN medical_information_form_for_air_travel.clinician_id IS
    'Foreign key to the attending physician (Part 2 author).';
COMMENT ON COLUMN medical_information_form_for_air_travel.status IS
    'Lifecycle status: draft, submitted, reviewed, cleared, declined, or urgent.';
COMMENT ON COLUMN medical_information_form_for_air_travel.submitter_name IS
    'Name of the person submitting Part 1.';
COMMENT ON COLUMN medical_information_form_for_air_travel.submitter_role IS
    'Role of the submitter: passenger, agent, clinician, or family-member.';
COMMENT ON COLUMN medical_information_form_for_air_travel.submitter_email IS
    'Email address of the submitter.';
COMMENT ON COLUMN medical_information_form_for_air_travel.submitter_phone IS
    'Phone of the submitter.';
COMMENT ON COLUMN medical_information_form_for_air_travel.submitter_organisation IS
    'Organisation submitting on behalf of the passenger (e.g. accessible-travel agent).';
COMMENT ON COLUMN medical_information_form_for_air_travel.airline_booking_reference IS
    'Airline booking reference (PNR).';
COMMENT ON COLUMN medical_information_form_for_air_travel.airline_iata_code IS
    'Airline two-letter IATA code (e.g. EK, BA, QR).';
COMMENT ON COLUMN medical_information_form_for_air_travel.airline_name IS
    'Airline full name.';
COMMENT ON COLUMN medical_information_form_for_air_travel.outbound_flight_number IS
    'Outbound flight number including airline prefix.';
COMMENT ON COLUMN medical_information_form_for_air_travel.outbound_date IS
    'Outbound flight date.';
COMMENT ON COLUMN medical_information_form_for_air_travel.outbound_origin_iata IS
    'Outbound origin airport IATA code.';
COMMENT ON COLUMN medical_information_form_for_air_travel.outbound_destination_iata IS
    'Outbound destination airport IATA code.';
COMMENT ON COLUMN medical_information_form_for_air_travel.return_flight_number IS
    'Return flight number if applicable.';
COMMENT ON COLUMN medical_information_form_for_air_travel.return_date IS
    'Return flight date if applicable.';
COMMENT ON COLUMN medical_information_form_for_air_travel.cabin_class IS
    'Cabin class: economy, premium-economy, business, or first.';
COMMENT ON COLUMN medical_information_form_for_air_travel.sector_duration_minutes IS
    'Longest sector duration in minutes (drives oxygen battery planning).';
COMMENT ON COLUMN medical_information_form_for_air_travel.transit_airports_iata IS
    'Comma-separated transit airport IATA codes.';
COMMENT ON COLUMN medical_information_form_for_air_travel.special_assistance_codes IS
    'Comma-separated IATA SSR codes requested (e.g. WCHR,OXYG,MEDA).';
COMMENT ON COLUMN medical_information_form_for_air_travel.reason_equipment IS
    'Reason: passenger requires in-flight medical equipment.';
COMMENT ON COLUMN medical_information_form_for_air_travel.reason_recent_acute_event IS
    'Reason: passenger had a recent acute medical event (surgery, MI, stroke, fracture).';
COMMENT ON COLUMN medical_information_form_for_air_travel.reason_unstable_condition IS
    'Reason: passenger has an unstable chronic condition.';
COMMENT ON COLUMN medical_information_form_for_air_travel.reason_communicable_disease IS
    'Reason: passenger has a communicable disease.';
COMMENT ON COLUMN medical_information_form_for_air_travel.reason_pregnancy IS
    'Reason: passenger is pregnant beyond carrier threshold.';
COMMENT ON COLUMN medical_information_form_for_air_travel.reason_mobility_escort IS
    'Reason: passenger requires mobility assistance or an escort.';
COMMENT ON COLUMN medical_information_form_for_air_travel.reason_psychiatric IS
    'Reason: passenger has a recent psychiatric event requiring clearance.';
COMMENT ON COLUMN medical_information_form_for_air_travel.primary_diagnosis IS
    'Primary diagnosis text.';
COMMENT ON COLUMN medical_information_form_for_air_travel.icd10_codes IS
    'Comma-separated ICD-10 codes.';
COMMENT ON COLUMN medical_information_form_for_air_travel.diagnosis_date IS
    'Date the primary diagnosis was established.';
COMMENT ON COLUMN medical_information_form_for_air_travel.current_treatment IS
    'Current treatment summary.';
COMMENT ON COLUMN medical_information_form_for_air_travel.last_admission_date IS
    'Date of most recent hospital admission, if any.';
COMMENT ON COLUMN medical_information_form_for_air_travel.last_discharge_date IS
    'Date of most recent hospital discharge, if any.';
COMMENT ON COLUMN medical_information_form_for_air_travel.last_specialist_review_date IS
    'Date of most recent specialist review.';
COMMENT ON COLUMN medical_information_form_for_air_travel.resting_systolic_bp IS
    'Resting systolic blood pressure in mmHg.';
COMMENT ON COLUMN medical_information_form_for_air_travel.resting_diastolic_bp IS
    'Resting diastolic blood pressure in mmHg.';
COMMENT ON COLUMN medical_information_form_for_air_travel.resting_heart_rate IS
    'Resting heart rate in beats per minute.';
COMMENT ON COLUMN medical_information_form_for_air_travel.nyha_class IS
    'New York Heart Association functional class I-IV.';
COMMENT ON COLUMN medical_information_form_for_air_travel.recent_mi_date IS
    'Date of most recent myocardial infarction, if any.';
COMMENT ON COLUMN medical_information_form_for_air_travel.recent_stent_date IS
    'Date of most recent coronary stent, if any.';
COMMENT ON COLUMN medical_information_form_for_air_travel.on_anticoagulant IS
    'Whether the passenger is on anticoagulant therapy.';
COMMENT ON COLUMN medical_information_form_for_air_travel.pacemaker_or_icd IS
    'Implanted pacemaker or ICD present.';
COMMENT ON COLUMN medical_information_form_for_air_travel.exercise_tolerance_metres IS
    'Exercise tolerance on flat ground in metres before symptoms.';
COMMENT ON COLUMN medical_information_form_for_air_travel.unstable_angina IS
    'Current unstable angina present.';
COMMENT ON COLUMN medical_information_form_for_air_travel.resting_spo2_percent IS
    'Resting oxygen saturation on room air as a percentage.';
COMMENT ON COLUMN medical_information_form_for_air_travel.predicted_inflight_spo2_percent IS
    'Predicted in-flight oxygen saturation as a percentage.';
COMMENT ON COLUMN medical_information_form_for_air_travel.hypoxic_challenge_result IS
    'Hypoxic challenge test result: pass, borderline, fail, or not-performed.';
COMMENT ON COLUMN medical_information_form_for_air_travel.recent_pneumothorax_date IS
    'Date of most recent pneumothorax, if any (gas-expansion risk).';
COMMENT ON COLUMN medical_information_form_for_air_travel.asthma_severity IS
    'Asthma severity: none, mild-controlled, moderate, or severe-uncontrolled.';
COMMENT ON COLUMN medical_information_form_for_air_travel.copd_severity IS
    'COPD severity: none, mild, moderate, or severe.';
COMMENT ON COLUMN medical_information_form_for_air_travel.cpap_or_bipap_use IS
    'CPAP or BiPAP use at home: none, cpap, bipap, or both.';
COMMENT ON COLUMN medical_information_form_for_air_travel.recent_pulmonary_embolism_date IS
    'Date of most recent pulmonary embolism, if any.';
COMMENT ON COLUMN medical_information_form_for_air_travel.last_surgery_date IS
    'Date of most recent surgery, if any.';
COMMENT ON COLUMN medical_information_form_for_air_travel.last_surgery_site IS
    'Anatomical site of the most recent surgery.';
COMMENT ON COLUMN medical_information_form_for_air_travel.cabin_gas_risk IS
    'Trapped gas risk category for cabin pressure: intra-ocular-gas, intra-cranial-gas, intra-abdominal-gas, plaster-cast, pneumothorax, other, or none.';
COMMENT ON COLUMN medical_information_form_for_air_travel.recent_fracture_cast IS
    'Recent fracture with plaster cast in situ.';
COMMENT ON COLUMN medical_information_form_for_air_travel.recent_dvt_date IS
    'Date of most recent deep vein thrombosis, if any.';
COMMENT ON COLUMN medical_information_form_for_air_travel.scuba_diving_within_24h IS
    'Scuba diving within 24 hours of departure (decompression risk).';
COMMENT ON COLUMN medical_information_form_for_air_travel.recent_stroke_date IS
    'Date of most recent stroke, if any.';
COMMENT ON COLUMN medical_information_form_for_air_travel.is_pregnant IS
    'Whether the passenger is currently pregnant.';
COMMENT ON COLUMN medical_information_form_for_air_travel.gestation_weeks IS
    'Current gestation in completed weeks, if pregnant.';
COMMENT ON COLUMN medical_information_form_for_air_travel.pregnancy_type IS
    'Pregnancy type: singleton, twins, or multiple.';
COMMENT ON COLUMN medical_information_form_for_air_travel.pregnancy_complications IS
    'Free-text pregnancy complications.';
COMMENT ON COLUMN medical_information_form_for_air_travel.expected_delivery_date IS
    'Expected delivery date.';
COMMENT ON COLUMN medical_information_form_for_air_travel.obstetrician_contact IS
    'Obstetrician name and contact details.';
COMMENT ON COLUMN medical_information_form_for_air_travel.communicable_disease_status IS
    'Communicable disease status: none, infectious, convalescent, or cleared.';
COMMENT ON COLUMN medical_information_form_for_air_travel.last_symptom_date IS
    'Date of last symptoms of a communicable disease.';
COMMENT ON COLUMN medical_information_form_for_air_travel.isolation_required IS
    'Whether isolation precautions are required.';
COMMENT ON COLUMN medical_information_form_for_air_travel.vaccination_status IS
    'Vaccination status summary.';
COMMENT ON COLUMN medical_information_form_for_air_travel.current_antimicrobials IS
    'Current antimicrobial therapy summary.';
COMMENT ON COLUMN medical_information_form_for_air_travel.requires_supplemental_oxygen IS
    'Whether supplemental oxygen is required in-flight.';
COMMENT ON COLUMN medical_information_form_for_air_travel.oxygen_flow_rate_lpm IS
    'Supplemental oxygen flow rate in litres per minute.';
COMMENT ON COLUMN medical_information_form_for_air_travel.oxygen_duration IS
    'Oxygen requirement duration: continuous, as-required, on-exertion, or sleep-only.';
COMMENT ON COLUMN medical_information_form_for_air_travel.requires_poc IS
    'Whether a portable oxygen concentrator is required.';
COMMENT ON COLUMN medical_information_form_for_air_travel.poc_make_model IS
    'Make and model of the portable oxygen concentrator.';
COMMENT ON COLUMN medical_information_form_for_air_travel.poc_battery_hours IS
    'Total battery duration in hours (must exceed sector duration + 50%).';
COMMENT ON COLUMN medical_information_form_for_air_travel.requires_stretcher IS
    'Whether a stretcher is required (sector-specific approval).';
COMMENT ON COLUMN medical_information_form_for_air_travel.requires_incubator IS
    'Whether an infant incubator is required.';
COMMENT ON COLUMN medical_information_form_for_air_travel.requires_iv_pump IS
    'Whether an IV pump is required in cabin.';
COMMENT ON COLUMN medical_information_form_for_air_travel.requires_medical_escort IS
    'Whether a medical escort accompanies the passenger.';
COMMENT ON COLUMN medical_information_form_for_air_travel.requires_extra_seat IS
    'Whether an extra seat is required for medical reasons.';
COMMENT ON COLUMN medical_information_form_for_air_travel.requires_accessible_lavatory IS
    'Whether an accessible lavatory or aisle wheelchair is required.';
COMMENT ON COLUMN medical_information_form_for_air_travel.wheelchair_type IS
    'Wheelchair assistance level: WCHR (ramp), WCHS (steps), WCHC (cabin), or none.';
COMMENT ON COLUMN medical_information_form_for_air_travel.accompanying_carer IS
    'Whether a non-medical carer accompanies the passenger.';
COMMENT ON COLUMN medical_information_form_for_air_travel.regular_medications IS
    'Regular medications carried in cabin.';
COMMENT ON COLUMN medical_information_form_for_air_travel.controlled_drugs IS
    'Controlled drugs carried in cabin (with customs documentation).';
COMMENT ON COLUMN medical_information_form_for_air_travel.dangerous_goods_battery_declaration IS
    'Whether a dangerous-goods battery declaration is required.';
COMMENT ON COLUMN medical_information_form_for_air_travel.sharps_in_cabin IS
    'Whether syringes or sharps are carried in cabin.';
COMMENT ON COLUMN medical_information_form_for_air_travel.refrigerated_medication IS
    'Whether refrigerated medication is carried.';
COMMENT ON COLUMN medical_information_form_for_air_travel.customs_documentation_available IS
    'Whether customs documentation for medications is available.';
COMMENT ON COLUMN medical_information_form_for_air_travel.haemoglobin_g_per_l IS
    'Haemoglobin in grams per litre (drives severe-anaemia rule).';
COMMENT ON COLUMN medical_information_form_for_air_travel.physician_declaration IS
    'Attending physician declaration: fit, fit-with-conditions, unfit, or unable-to-determine.';
COMMENT ON COLUMN medical_information_form_for_air_travel.physician_signature_name IS
    'Physician name as printed on the signature.';
COMMENT ON COLUMN medical_information_form_for_air_travel.physician_signature_date IS
    'Date the physician signed the form.';
COMMENT ON COLUMN medical_information_form_for_air_travel.valid_until_date IS
    'Date the MEDIF expires (typically signature date + 10 to 14 days).';
COMMENT ON COLUMN medical_information_form_for_air_travel.additional_notes IS
    'Free-text additional notes for the airline medical desk.';
