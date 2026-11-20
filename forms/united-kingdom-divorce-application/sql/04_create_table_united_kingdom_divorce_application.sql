-- Main United Kingdom divorce or dissolution application record: one application
-- (D8 or online), through its conditional order (D84) and final order (D36)
-- stages, under the Divorce, Dissolution and Separation Act 2020 for England
-- and Wales. It captures the application type and stage, the marriage details
-- and certificate, the jurisdiction facts, the parties and service address, the
-- children and financial arrangements, and the stage dates. The completeness
-- and readiness classification, the audit trail of fired rules and the flagged
-- issues live in dedicated child tables. This record does not give legal advice.

CREATE TABLE united_kingdom_divorce_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    applicant_id UUID NOT NULL REFERENCES applicant(id) ON DELETE RESTRICT,
    caseworker_id UUID REFERENCES caseworker(id) ON DELETE RESTRICT,
    application_type VARCHAR(11) NOT NULL DEFAULT '' CHECK (application_type IN ('divorce', 'dissolution', '')),
    application_mode VARCHAR(5) NOT NULL DEFAULT '' CHECK (application_mode IN ('sole', 'joint', '')),
    stage VARCHAR(17) NOT NULL DEFAULT '' CHECK (stage IN ('application', 'conditional-order', 'final-order', '')),
    as_of_date DATE,
    domestic_abuse_risk VARCHAR(5) NOT NULL DEFAULT '' CHECK (domestic_abuse_risk IN ('yes', 'no', '')),
    marriage_date DATE,
    marriage_place TEXT NOT NULL DEFAULT '',
    marriage_country TEXT NOT NULL DEFAULT '',
    legally_recognised VARCHAR(5) NOT NULL DEFAULT '' CHECK (legally_recognised IN ('yes', 'no', '')),
    breakdown_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (breakdown_confirmed IN ('yes', 'no', '')),
    marriage_certificate_type VARCHAR(14) NOT NULL DEFAULT '' CHECK (marriage_certificate_type IN ('original', 'certified-copy', 'not-held', '')),
    certificate_in_english VARCHAR(5) NOT NULL DEFAULT '' CHECK (certificate_in_english IN ('yes', 'no', '')),
    certified_translation VARCHAR(5) NOT NULL DEFAULT '' CHECK (certified_translation IN ('yes', 'no', '')),
    name_changed VARCHAR(5) NOT NULL DEFAULT '' CHECK (name_changed IN ('yes', 'no', '')),
    name_change_proof VARCHAR(20) NOT NULL DEFAULT '' CHECK (name_change_proof IN ('marriage-certificate', 'deed-poll', 'none', '')),
    applicant_habitual_resident VARCHAR(5) NOT NULL DEFAULT '' CHECK (applicant_habitual_resident IN ('yes', 'no', '')),
    applicant_residence_months INTEGER CHECK (applicant_residence_months >= 0),
    applicant_domiciled VARCHAR(5) NOT NULL DEFAULT '' CHECK (applicant_domiciled IN ('yes', 'no', '')),
    respondent_habitual_resident VARCHAR(5) NOT NULL DEFAULT '' CHECK (respondent_habitual_resident IN ('yes', 'no', '')),
    respondent_domiciled VARCHAR(5) NOT NULL DEFAULT '' CHECK (respondent_domiciled IN ('yes', 'no', '')),
    last_habitually_resident_together VARCHAR(5) NOT NULL DEFAULT '' CHECK (last_habitually_resident_together IN ('yes', 'no', '')),
    applicant_name TEXT NOT NULL DEFAULT '',
    applicant_address TEXT NOT NULL DEFAULT '',
    applicant_email TEXT NOT NULL DEFAULT '',
    respondent_name TEXT NOT NULL DEFAULT '',
    respondent_address TEXT NOT NULL DEFAULT '',
    respondent_email TEXT NOT NULL DEFAULT '',
    respondent_address_known VARCHAR(5) NOT NULL DEFAULT '' CHECK (respondent_address_known IN ('yes', 'no', '')),
    service_method VARCHAR(19) NOT NULL DEFAULT '' CHECK (service_method IN ('email', 'post', 'alternative-service', '')),
    children_under_18 VARCHAR(5) NOT NULL DEFAULT '' CHECK (children_under_18 IN ('yes', 'no', '')),
    children_count INTEGER CHECK (children_count >= 0),
    children_arrangements VARCHAR(10) NOT NULL DEFAULT '' CHECK (children_arrangements IN ('agreed', 'not-agreed', 'undecided', '')),
    children_note TEXT NOT NULL DEFAULT '',
    financial_order_intended VARCHAR(9) NOT NULL DEFAULT '' CHECK (financial_order_intended IN ('yes', 'no', 'undecided', '')),
    financial_order_applied VARCHAR(5) NOT NULL DEFAULT '' CHECK (financial_order_applied IN ('yes', 'no', '')),
    fee_status VARCHAR(23) NOT NULL DEFAULT '' CHECK (fee_status IN ('paid', 'help-with-fees-approved', 'help-with-fees-pending', 'unpaid', '')),
    application_issued_date DATE,
    respondent_acknowledged VARCHAR(5) NOT NULL DEFAULT '' CHECK (respondent_acknowledged IN ('yes', 'no', '')),
    conditional_order_granted_date DATE,
    final_order_delay_explained VARCHAR(5) NOT NULL DEFAULT '' CHECK (final_order_delay_explained IN ('yes', 'no', ''))
);

CREATE INDEX united_kingdom_divorce_application_applicant_id_idx
    ON united_kingdom_divorce_application (applicant_id);

CREATE INDEX united_kingdom_divorce_application_caseworker_id_idx
    ON united_kingdom_divorce_application (caseworker_id);

CREATE TRIGGER trigger_united_kingdom_divorce_application_updated_at
    BEFORE UPDATE ON united_kingdom_divorce_application
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_divorce_application IS
    'Main United Kingdom divorce or dissolution application record (D8, D84, D36): application type and stage, marriage and certificate, jurisdiction facts, parties and service address, children and financial arrangements, and stage dates. Readiness classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN united_kingdom_divorce_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_divorce_application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_divorce_application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_divorce_application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant_id IS
    'Foreign key to the applicant (restrict delete).';
COMMENT ON COLUMN united_kingdom_divorce_application.caseworker_id IS
    'Foreign key to the caseworker (restrict delete); optional.';
COMMENT ON COLUMN united_kingdom_divorce_application.application_type IS
    'Whether the application is for a divorce (marriage) or the dissolution of a civil partnership.';
COMMENT ON COLUMN united_kingdom_divorce_application.application_mode IS
    'Sole application by one spouse, or joint application by both.';
COMMENT ON COLUMN united_kingdom_divorce_application.stage IS
    'Which stage the user is checking: application (D8 or online), conditional order (D84), or final order (D36).';
COMMENT ON COLUMN united_kingdom_divorce_application.as_of_date IS
    'The date the check is made, against which the time gates are tested.';
COMMENT ON COLUMN united_kingdom_divorce_application.domestic_abuse_risk IS
    'Whether there is a risk of domestic abuse. A joint application is not suitable where there is (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.marriage_date IS
    'Date of the marriage or civil partnership formation.';
COMMENT ON COLUMN united_kingdom_divorce_application.marriage_place IS
    'Place where the marriage or civil partnership was formed.';
COMMENT ON COLUMN united_kingdom_divorce_application.marriage_country IS
    'Country where the marriage or civil partnership was formed.';
COMMENT ON COLUMN united_kingdom_divorce_application.legally_recognised IS
    'Whether the marriage or civil partnership is legally recognised in the United Kingdom (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.breakdown_confirmed IS
    'Whether the applicant states that the relationship has broken down irretrievably (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.marriage_certificate_type IS
    'The marriage certificate held: original, certified-copy, or not-held.';
COMMENT ON COLUMN united_kingdom_divorce_application.certificate_in_english IS
    'Whether the marriage certificate is in English (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.certified_translation IS
    'Whether a certified translation of the marriage certificate is held (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.name_changed IS
    'Whether a name has been changed since the marriage (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.name_change_proof IS
    'Proof of the name change: marriage-certificate, deed-poll, or none.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant_habitual_resident IS
    'Whether the applicant is habitually resident in England and Wales (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant_residence_months IS
    'Months the applicant has been habitually resident in England and Wales.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant_domiciled IS
    'Whether the applicant is domiciled in England and Wales (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.respondent_habitual_resident IS
    'Whether the other spouse is habitually resident in England and Wales (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.respondent_domiciled IS
    'Whether the other spouse is domiciled in England and Wales (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.last_habitually_resident_together IS
    'Whether both were last habitually resident in England and Wales and one still resides there (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant_name IS
    'Full name of the applicant as it appears on the application.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant_address IS
    'Postal address of the applicant.';
COMMENT ON COLUMN united_kingdom_divorce_application.applicant_email IS
    'Email address of the applicant.';
COMMENT ON COLUMN united_kingdom_divorce_application.respondent_name IS
    'Full name of the other spouse (the respondent, or the second joint applicant).';
COMMENT ON COLUMN united_kingdom_divorce_application.respondent_address IS
    'Postal address of the other spouse; the service address for a sole application.';
COMMENT ON COLUMN united_kingdom_divorce_application.respondent_email IS
    'Email address of the other spouse, used to serve papers online.';
COMMENT ON COLUMN united_kingdom_divorce_application.respondent_address_known IS
    'Whether the current address of the other spouse is known (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.service_method IS
    'How the application is served on the other spouse: email, post, or alternative-service.';
COMMENT ON COLUMN united_kingdom_divorce_application.children_under_18 IS
    'Whether there are children of the family under 18 (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.children_count IS
    'Number of children of the family under 18.';
COMMENT ON COLUMN united_kingdom_divorce_application.children_arrangements IS
    'State of the arrangements for the children: agreed, not-agreed, or undecided.';
COMMENT ON COLUMN united_kingdom_divorce_application.children_note IS
    'Free-text note on the children arrangements.';
COMMENT ON COLUMN united_kingdom_divorce_application.financial_order_intended IS
    'Whether a financial order on money and property is intended: yes, no, or undecided.';
COMMENT ON COLUMN united_kingdom_divorce_application.financial_order_applied IS
    'Whether a financial order has been applied for (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.fee_status IS
    'Status of the court fee: paid, help-with-fees-approved, help-with-fees-pending, or unpaid.';
COMMENT ON COLUMN united_kingdom_divorce_application.application_issued_date IS
    'Date the court issued the application; the 20-week reflection period runs from it.';
COMMENT ON COLUMN united_kingdom_divorce_application.respondent_acknowledged IS
    'Whether the other spouse has returned the acknowledgement of service (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.conditional_order_granted_date IS
    'Date the conditional order was made; the 6 weeks and 1 day wait runs from it.';
COMMENT ON COLUMN united_kingdom_divorce_application.final_order_delay_explained IS
    'Whether the reason for waiting more than 12 months to apply for the final order is explained (yes/no).';
