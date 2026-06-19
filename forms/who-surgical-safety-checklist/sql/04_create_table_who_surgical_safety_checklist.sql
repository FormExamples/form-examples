-- WHO Surgical Safety Checklist record (one row per surgical case).
-- Captures the case identification plus all items of the three checklist phases:
-- Sign In (before induction of anaesthesia), Time Out (before skin incision),
-- and Sign Out (before patient leaves the operating room).

CREATE TABLE who_surgical_safety_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    -- Case identification
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    surgeon_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    anaesthetist_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    lead_nurse_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'sign-in-complete', 'time-out-complete', 'sign-out-complete', 'completed', 'abandoned')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    operating_room VARCHAR(50) NOT NULL DEFAULT '',
    case_date DATE,
    case_start_at TIMESTAMPTZ,
    case_end_at TIMESTAMPTZ,
    planned_procedure VARCHAR(500) NOT NULL DEFAULT '',
    surgical_specialty VARCHAR(100) NOT NULL DEFAULT '',
    urgency VARCHAR(20) NOT NULL DEFAULT '' CHECK (urgency IN ('elective', 'urgent', 'emergency', 'immediate', '')),
    laterality VARCHAR(10) NOT NULL DEFAULT '' CHECK (laterality IN ('left', 'right', 'bilateral', 'midline', 'na', '')),
    is_paediatric VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_paediatric IN ('yes', 'no', '')),
    abandoned_reason VARCHAR(500) NOT NULL DEFAULT '',

    -- Phase 1 — Sign In (before induction of anaesthesia)
    sign_in_identity_site_procedure_consent VARCHAR(5) NOT NULL DEFAULT '' CHECK (sign_in_identity_site_procedure_consent IN ('yes', '')),
    sign_in_site_marked VARCHAR(20) NOT NULL DEFAULT '' CHECK (sign_in_site_marked IN ('yes', 'not-applicable', '')),
    sign_in_anaesthesia_check_complete VARCHAR(5) NOT NULL DEFAULT '' CHECK (sign_in_anaesthesia_check_complete IN ('yes', '')),
    sign_in_pulse_oximeter_on_patient VARCHAR(5) NOT NULL DEFAULT '' CHECK (sign_in_pulse_oximeter_on_patient IN ('yes', '')),
    sign_in_known_allergy VARCHAR(5) NOT NULL DEFAULT '' CHECK (sign_in_known_allergy IN ('no', 'yes', '')),
    sign_in_known_allergy_detail VARCHAR(500) NOT NULL DEFAULT '',
    sign_in_difficult_airway_aspiration_risk VARCHAR(30) NOT NULL DEFAULT '' CHECK (sign_in_difficult_airway_aspiration_risk IN ('no', 'yes-equipment-available', '')),
    sign_in_blood_loss_risk VARCHAR(40) NOT NULL DEFAULT '' CHECK (sign_in_blood_loss_risk IN ('no', 'yes-two-ivs-and-fluids-planned', '')),
    sign_in_coordinator_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    sign_in_completed_at TIMESTAMPTZ,

    -- Phase 2 — Time Out (before skin incision)
    time_out_team_introductions_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (time_out_team_introductions_confirmed IN ('yes', '')),
    time_out_patient_procedure_incision_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (time_out_patient_procedure_incision_confirmed IN ('yes', '')),
    time_out_antibiotic_prophylaxis_within_60min VARCHAR(20) NOT NULL DEFAULT '' CHECK (time_out_antibiotic_prophylaxis_within_60min IN ('yes', 'not-applicable', '')),
    time_out_surgeon_critical_steps VARCHAR(1000) NOT NULL DEFAULT '',
    time_out_surgeon_case_duration_minutes INTEGER,
    time_out_surgeon_anticipated_blood_loss_ml INTEGER,
    time_out_anaesthetist_patient_concerns VARCHAR(1000) NOT NULL DEFAULT '',
    time_out_nursing_sterility_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (time_out_nursing_sterility_confirmed IN ('yes', '')),
    time_out_nursing_equipment_concerns VARCHAR(1000) NOT NULL DEFAULT '',
    time_out_essential_imaging_displayed VARCHAR(20) NOT NULL DEFAULT '' CHECK (time_out_essential_imaging_displayed IN ('yes', 'not-applicable', '')),
    time_out_coordinator_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    time_out_completed_at TIMESTAMPTZ,

    -- Phase 3 — Sign Out (before patient leaves operating room)
    sign_out_procedure_name_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (sign_out_procedure_name_confirmed IN ('yes', '')),
    sign_out_counts_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (sign_out_counts_confirmed IN ('yes', 'no', '')),
    sign_out_specimens_labelled VARCHAR(20) NOT NULL DEFAULT '' CHECK (sign_out_specimens_labelled IN ('yes', 'no', 'not-applicable', '')),
    sign_out_equipment_problems VARCHAR(1000) NOT NULL DEFAULT '',
    sign_out_recovery_concerns VARCHAR(1000) NOT NULL DEFAULT '',
    sign_out_coordinator_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,
    sign_out_completed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_who_surgical_safety_checklist_updated_at
    BEFORE UPDATE ON who_surgical_safety_checklist
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE who_surgical_safety_checklist IS
    'WHO Surgical Safety Checklist case record. One row per surgical case, holding all items of the three phases (Sign In, Time Out, Sign Out) and the case identification.';
COMMENT ON COLUMN who_surgical_safety_checklist.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN who_surgical_safety_checklist.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN who_surgical_safety_checklist.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN who_surgical_safety_checklist.deleted_at IS
    'Timestamp when this row was deleted (soft delete).';
COMMENT ON COLUMN who_surgical_safety_checklist.patient_id IS
    'Foreign key to the patient receiving the procedure.';
COMMENT ON COLUMN who_surgical_safety_checklist.surgeon_id IS
    'Foreign key to the lead surgeon for this case.';
COMMENT ON COLUMN who_surgical_safety_checklist.anaesthetist_id IS
    'Foreign key to the lead anaesthetist for this case.';
COMMENT ON COLUMN who_surgical_safety_checklist.lead_nurse_id IS
    'Foreign key to the lead (circulating) nurse for this case.';
COMMENT ON COLUMN who_surgical_safety_checklist.status IS
    'Overall checklist lifecycle status. One of: not-started, sign-in-complete, time-out-complete, sign-out-complete, completed, abandoned.';
COMMENT ON COLUMN who_surgical_safety_checklist.site_name IS
    'Operating facility or hospital site name.';
COMMENT ON COLUMN who_surgical_safety_checklist.operating_room IS
    'Operating-room identifier (number, letter, or name).';
COMMENT ON COLUMN who_surgical_safety_checklist.case_date IS
    'Date of the surgical procedure.';
COMMENT ON COLUMN who_surgical_safety_checklist.case_start_at IS
    'Timestamp of wheels-in or induction.';
COMMENT ON COLUMN who_surgical_safety_checklist.case_end_at IS
    'Timestamp of wheels-out from the operating room.';
COMMENT ON COLUMN who_surgical_safety_checklist.planned_procedure IS
    'Description of the planned surgical procedure.';
COMMENT ON COLUMN who_surgical_safety_checklist.surgical_specialty IS
    'Surgical specialty responsible for the procedure.';
COMMENT ON COLUMN who_surgical_safety_checklist.urgency IS
    'Procedure urgency (NCEPOD). One of: elective, urgent, emergency, immediate.';
COMMENT ON COLUMN who_surgical_safety_checklist.laterality IS
    'Side of the body. One of: left, right, bilateral, midline, na.';
COMMENT ON COLUMN who_surgical_safety_checklist.is_paediatric IS
    'Whether the patient is paediatric (drives the 7 ml/kg blood-loss threshold).';
COMMENT ON COLUMN who_surgical_safety_checklist.abandoned_reason IS
    'Free-text reason when the case is abandoned before sign-out.';

COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_identity_site_procedure_consent IS
    'Sign In #1: patient has confirmed identity, site, procedure, and consent.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_site_marked IS
    'Sign In #2: surgical site marked. One of: yes, not-applicable.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_anaesthesia_check_complete IS
    'Sign In #3: anaesthesia machine and medication check complete.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_pulse_oximeter_on_patient IS
    'Sign In #4: pulse oximeter on the patient and functioning.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_known_allergy IS
    'Sign In #5: known allergy. One of: no, yes.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_known_allergy_detail IS
    'Sign In #5: free-text description of known allergies.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_difficult_airway_aspiration_risk IS
    'Sign In #6: difficult airway or aspiration risk. One of: no, yes-equipment-available.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_blood_loss_risk IS
    'Sign In #7: risk of >500 ml (7 ml/kg in children) blood loss. One of: no, yes-two-ivs-and-fluids-planned.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_coordinator_id IS
    'Foreign key to the clinician who signed off the Sign In phase.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_in_completed_at IS
    'Timestamp when Sign In phase was signed off.';

COMMENT ON COLUMN who_surgical_safety_checklist.time_out_team_introductions_confirmed IS
    'Time Out #1: all team members have introduced themselves by name and role.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_patient_procedure_incision_confirmed IS
    'Time Out #2: patient name, procedure, and incision site confirmed.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_antibiotic_prophylaxis_within_60min IS
    'Time Out #3: antibiotic prophylaxis given within the last 60 minutes. One of: yes, not-applicable.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_surgeon_critical_steps IS
    'Time Out #4 (surgeon): critical or non-routine steps.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_surgeon_case_duration_minutes IS
    'Time Out #5 (surgeon): anticipated case duration in minutes.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_surgeon_anticipated_blood_loss_ml IS
    'Time Out #6 (surgeon): anticipated blood loss in millilitres.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_anaesthetist_patient_concerns IS
    'Time Out #7 (anaesthetist): patient-specific concerns.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_nursing_sterility_confirmed IS
    'Time Out #8 (nursing): sterility (including indicator results) confirmed.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_nursing_equipment_concerns IS
    'Time Out #9 (nursing): equipment issues or concerns.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_essential_imaging_displayed IS
    'Time Out #10: essential imaging displayed. One of: yes, not-applicable.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_coordinator_id IS
    'Foreign key to the clinician who signed off the Time Out phase.';
COMMENT ON COLUMN who_surgical_safety_checklist.time_out_completed_at IS
    'Timestamp when Time Out phase was signed off.';

COMMENT ON COLUMN who_surgical_safety_checklist.sign_out_procedure_name_confirmed IS
    'Sign Out #1: name of the procedure recorded confirmed by the nurse.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_out_counts_confirmed IS
    'Sign Out #2: instrument, sponge, and needle counts confirmed. One of: yes, no.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_out_specimens_labelled IS
    'Sign Out #3: specimen labelling (read aloud, including patient name) confirmed. One of: yes, no, not-applicable.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_out_equipment_problems IS
    'Sign Out #4: equipment problems to be addressed.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_out_recovery_concerns IS
    'Sign Out #5: key concerns for recovery and management of this patient.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_out_coordinator_id IS
    'Foreign key to the clinician who signed off the Sign Out phase.';
COMMENT ON COLUMN who_surgical_safety_checklist.sign_out_completed_at IS
    'Timestamp when Sign Out phase was signed off.';

CREATE INDEX who_surgical_safety_checklist_index_patient_id
    ON who_surgical_safety_checklist (patient_id);
CREATE INDEX who_surgical_safety_checklist_index_case_date
    ON who_surgical_safety_checklist (case_date);
CREATE INDEX who_surgical_safety_checklist_index_status
    ON who_surgical_safety_checklist (status);
