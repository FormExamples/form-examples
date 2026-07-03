CREATE TABLE outpatient_outcome_prem_fft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    fft_response VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (fft_response IN (
            'very_good',
            'good',
            'neither',
            'poor',
            'very_poor',
            'dont_know',
            ''
        )),
    fft_comment TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_outpatient_outcome_prem_fft_updated_at
    BEFORE UPDATE ON outpatient_outcome_prem_fft
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_prem_fft IS
    'NHS Friends and Family Test PREM response and free-text comment. Open Government Licence v3.0.';
COMMENT ON COLUMN outpatient_outcome_prem_fft.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_prem_fft.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_prem_fft.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_prem_fft.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_prem_fft.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_prem_fft.fft_response IS
    'FFT response: very_good, good, neither, poor, very_poor, dont_know, or empty.';
COMMENT ON COLUMN outpatient_outcome_prem_fft.fft_comment IS
    'Free-text comment accompanying the FFT response.';
