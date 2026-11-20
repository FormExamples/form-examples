-- Main United States petition for dissolution of marriage (divorce) record,
-- through the decree and vital-records divorce certificate. Captures where the
-- petition is filed, the spouses and residency, children and support, property
-- and settlement, service of process, and the decree. The readiness
-- classification, rule audit and flags live in dedicated child tables. This is
-- documentation support, not legal advice; the court decides.

CREATE TABLE united_states_divorce_petition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    petitioner_id UUID NOT NULL REFERENCES petitioner(id) ON DELETE RESTRICT,
    attorney_id UUID REFERENCES attorney(id) ON DELETE RESTRICT,

    -- Filing
    state VARCHAR(2) NOT NULL DEFAULT '',
    county TEXT NOT NULL DEFAULT '',
    filing_date DATE,
    case_type VARCHAR(12) NOT NULL DEFAULT '' CHECK (case_type IN ('uncontested', 'contested', '')),
    ground_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (ground_type IN ('no-fault', 'fault', '')),
    fault_ground VARCHAR(20) NOT NULL DEFAULT '' CHECK (fault_ground IN ('adultery', 'cruelty', 'abandonment', 'felony-conviction', 'impotence', 'other', '')),

    -- Spouses
    petitioner_name TEXT NOT NULL DEFAULT '',
    respondent_name TEXT NOT NULL DEFAULT '',
    marriage_date DATE,
    marriage_place TEXT NOT NULL DEFAULT '',
    separation_date DATE,
    petitioner_residency_months INTEGER CHECK (petitioner_residency_months IS NULL OR petitioner_residency_months >= 0),
    county_residency_days INTEGER CHECK (county_residency_days IS NULL OR county_residency_days >= 0),
    married_or_lived_in_state VARCHAR(5) NOT NULL DEFAULT '' CHECK (married_or_lived_in_state IN ('yes', 'no', '')),
    respondent_military VARCHAR(5) NOT NULL DEFAULT '' CHECK (respondent_military IN ('yes', 'no', '')),

    -- Children
    has_minor_children VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_minor_children IN ('yes', 'no', '')),
    children_count INTEGER CHECK (children_count IS NULL OR children_count >= 0),
    children_home_state_months INTEGER CHECK (children_home_state_months IS NULL OR children_home_state_months >= 0),
    pregnant VARCHAR(5) NOT NULL DEFAULT '' CHECK (pregnant IN ('yes', 'no', '')),
    custody_plan_documented VARCHAR(5) NOT NULL DEFAULT '' CHECK (custody_plan_documented IN ('yes', 'no', '')),
    child_support_worksheet_completed VARCHAR(5) NOT NULL DEFAULT '' CHECK (child_support_worksheet_completed IN ('yes', 'no', '')),
    child_support_monthly_amount NUMERIC(10,2) CHECK (child_support_monthly_amount IS NULL OR child_support_monthly_amount >= 0),

    -- Property
    property_division_approach VARCHAR(10) NOT NULL DEFAULT '' CHECK (property_division_approach IN ('community', 'equitable', '')),
    settlement_agreement_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (settlement_agreement_signed IN ('yes', 'no', '')),
    financial_disclosure_filed VARCHAR(5) NOT NULL DEFAULT '' CHECK (financial_disclosure_filed IN ('yes', 'no', '')),
    spousal_support_requested VARCHAR(5) NOT NULL DEFAULT '' CHECK (spousal_support_requested IN ('yes', 'no', '')),

    -- Service
    service_method VARCHAR(12) NOT NULL DEFAULT '' CHECK (service_method IN ('personal', 'acceptance', 'mail', 'publication', 'none', '')),
    service_date DATE,
    respondent_responded VARCHAR(5) NOT NULL DEFAULT '' CHECK (respondent_responded IN ('yes', 'no', '')),

    -- Decree
    decree_entered VARCHAR(5) NOT NULL DEFAULT '' CHECK (decree_entered IN ('yes', 'no', '')),
    decree_date DATE,
    name_restoration_requested VARCHAR(5) NOT NULL DEFAULT '' CHECK (name_restoration_requested IN ('yes', 'no', '')),
    name_to_restore TEXT NOT NULL DEFAULT '',
    certificate_requested VARCHAR(5) NOT NULL DEFAULT '' CHECK (certificate_requested IN ('yes', 'no', ''))
);

CREATE INDEX united_states_divorce_petition_petitioner_id_idx
    ON united_states_divorce_petition (petitioner_id);
CREATE INDEX united_states_divorce_petition_attorney_id_idx
    ON united_states_divorce_petition (attorney_id);

CREATE TRIGGER trigger_united_states_divorce_petition_updated_at
    BEFORE UPDATE ON united_states_divorce_petition
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_divorce_petition IS
    'Main United States petition for dissolution of marriage record: filing, spouses and residency, children and support, property, service of process, and the decree. Documentation support, not legal advice.';
COMMENT ON COLUMN united_states_divorce_petition.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_divorce_petition.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_divorce_petition.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_divorce_petition.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_divorce_petition.petitioner_id IS
    'Foreign key to the petitioner (restrict delete).';
COMMENT ON COLUMN united_states_divorce_petition.attorney_id IS
    'Foreign key to the preparing attorney (restrict delete); optional.';
COMMENT ON COLUMN united_states_divorce_petition.state IS
    'Two-letter USPS code of the state whose court the petition is filed in.';
COMMENT ON COLUMN united_states_divorce_petition.county IS
    'County (or parish) of the filing court.';
COMMENT ON COLUMN united_states_divorce_petition.filing_date IS
    'Date the petition is, or will be, filed with the clerk.';
COMMENT ON COLUMN united_states_divorce_petition.case_type IS
    'Whether the divorce is expected to be uncontested (agreed) or contested.';
COMMENT ON COLUMN united_states_divorce_petition.ground_type IS
    'Kind of ground pleaded: no-fault or fault.';
COMMENT ON COLUMN united_states_divorce_petition.fault_ground IS
    'Fault ground pleaded, when ground_type is fault.';
COMMENT ON COLUMN united_states_divorce_petition.petitioner_name IS
    'Full legal name of the petitioner (spouse who files).';
COMMENT ON COLUMN united_states_divorce_petition.respondent_name IS
    'Full legal name of the respondent (other spouse).';
COMMENT ON COLUMN united_states_divorce_petition.marriage_date IS
    'Date of the marriage.';
COMMENT ON COLUMN united_states_divorce_petition.marriage_place IS
    'City and state or country where the marriage took place.';
COMMENT ON COLUMN united_states_divorce_petition.separation_date IS
    'Date the spouses began living separate and apart; null if still together.';
COMMENT ON COLUMN united_states_divorce_petition.petitioner_residency_months IS
    'Whole months the petitioner has lived in the filing state immediately before filing.';
COMMENT ON COLUMN united_states_divorce_petition.county_residency_days IS
    'Days the petitioner has lived in the filing county immediately before filing.';
COMMENT ON COLUMN united_states_divorce_petition.married_or_lived_in_state IS
    'Whether the spouses married in, or lived together as spouses in, the filing state (shortens the New York residency period).';
COMMENT ON COLUMN united_states_divorce_petition.respondent_military IS
    'Whether the respondent is on active military duty (Servicemembers Civil Relief Act affidavit).';
COMMENT ON COLUMN united_states_divorce_petition.has_minor_children IS
    'Whether the spouses have minor children of the marriage.';
COMMENT ON COLUMN united_states_divorce_petition.children_count IS
    'Number of minor children of the marriage.';
COMMENT ON COLUMN united_states_divorce_petition.children_home_state_months IS
    'Months the children have lived in the filing state with a parent (UCCJEA home-state test: six months).';
COMMENT ON COLUMN united_states_divorce_petition.pregnant IS
    'Whether either spouse is pregnant with a child of the marriage.';
COMMENT ON COLUMN united_states_divorce_petition.custody_plan_documented IS
    'Whether a custody and parenting-time plan is documented.';
COMMENT ON COLUMN united_states_divorce_petition.child_support_worksheet_completed IS
    'Whether the state child-support guideline worksheet is completed.';
COMMENT ON COLUMN united_states_divorce_petition.child_support_monthly_amount IS
    'Monthly child support from the worksheet, in US dollars; null when unset.';
COMMENT ON COLUMN united_states_divorce_petition.property_division_approach IS
    'Property-division approach pleaded: community property or equitable distribution.';
COMMENT ON COLUMN united_states_divorce_petition.settlement_agreement_signed IS
    'Whether both spouses signed a marital settlement agreement.';
COMMENT ON COLUMN united_states_divorce_petition.financial_disclosure_filed IS
    'Whether the financial disclosure or affidavit is filed or ready.';
COMMENT ON COLUMN united_states_divorce_petition.spousal_support_requested IS
    'Whether spousal support (alimony, maintenance) is requested.';
COMMENT ON COLUMN united_states_divorce_petition.service_method IS
    'How the respondent is, or will be, served: personal, acceptance (waiver), certified mail, publication, or none yet.';
COMMENT ON COLUMN united_states_divorce_petition.service_date IS
    'Date the respondent was served or signed an acceptance of service.';
COMMENT ON COLUMN united_states_divorce_petition.respondent_responded IS
    'Whether the respondent has filed a response or appearance.';
COMMENT ON COLUMN united_states_divorce_petition.decree_entered IS
    'Whether the court has entered the judgment or decree of dissolution.';
COMMENT ON COLUMN united_states_divorce_petition.decree_date IS
    'Date the decree was entered.';
COMMENT ON COLUMN united_states_divorce_petition.name_restoration_requested IS
    'Whether restoration of a former name is requested in the decree.';
COMMENT ON COLUMN united_states_divorce_petition.name_to_restore IS
    'Former name to be restored.';
COMMENT ON COLUMN united_states_divorce_petition.certificate_requested IS
    'Whether a vital-records divorce certificate or certified decree is requested.';
