CREATE TABLE assessment_prem_fft (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    assessment_id UUID NOT NULL UNIQUE
        REFERENCES assessment(id) ON DELETE CASCADE,

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
    fft_comment TEXT NOT NULL DEFAULT '',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_assessment_prem_fft_updated_at
    BEFORE UPDATE ON assessment_prem_fft
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE assessment_prem_fft IS
    'NHS Friends and Family Test PREM response and free-text comment. Open Government Licence v3.0.';
COMMENT ON COLUMN assessment_prem_fft.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN assessment_prem_fft.assessment_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN assessment_prem_fft.fft_response IS
    'FFT response: very_good, good, neither, poor, very_poor, dont_know, or empty.';
COMMENT ON COLUMN assessment_prem_fft.fft_comment IS
    'Free-text comment accompanying the FFT response.';
COMMENT ON COLUMN assessment_prem_fft.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN assessment_prem_fft.updated_at IS
    'Timestamp when this row was updated.';
