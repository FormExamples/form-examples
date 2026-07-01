-- Computed Bhutani bilirubin nomogram classification result. Stores the
-- percentile risk zone (low / low-intermediate / high-intermediate / high),
-- the mirrored percentile band, the interpolated gestation-specific
-- phototherapy and exchange-transfusion thresholds, and the yes/no signals
-- for whether the measured TSB is at or above each treatment threshold. Fired
-- rules and red-flag issues live in dedicated child tables.

CREATE TABLE bhutani_bilirubin_nomogram_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    bhutani_bilirubin_nomogram_id UUID NOT NULL UNIQUE
        REFERENCES bhutani_bilirubin_nomogram(id) ON DELETE CASCADE,

    risk_zone VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (risk_zone IN ('low', 'low-intermediate', 'high-intermediate', 'high', '')),
    percentile_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (percentile_band IN ('<40', '40-75', '75-95', '>=95', '')),

    phototherapy_threshold_umol_l NUMERIC(6,1),
    exchange_threshold_umol_l NUMERIC(6,1),

    above_phototherapy_threshold VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (above_phototherapy_threshold IN ('yes', 'no', '')),
    above_exchange_threshold VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (above_exchange_threshold IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_bhutani_bilirubin_nomogram_grade_updated_at
    BEFORE UPDATE ON bhutani_bilirubin_nomogram_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE bhutani_bilirubin_nomogram_grade IS
    'Computed Bhutani bilirubin nomogram classification result (1:1): percentile risk zone, mirrored percentile band, interpolated gestation-specific phototherapy and exchange thresholds, and the yes/no above-threshold signals.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.bhutani_bilirubin_nomogram_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.risk_zone IS
    'Percentile risk zone assigned by the nomogram: low, low-intermediate, high-intermediate, or high (empty when age or TSB is missing).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.percentile_band IS
    'Percentile band mirroring the risk zone: <40, 40-75, 75-95, or >=95.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.phototherapy_threshold_umol_l IS
    'Interpolated gestation-specific phototherapy threshold at the infant age in micromoles per litre (umol/L).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.exchange_threshold_umol_l IS
    'Interpolated gestation-specific exchange-transfusion threshold at the infant age in micromoles per litre (umol/L).';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.above_phototherapy_threshold IS
    'Whether the measured TSB is at or above the phototherapy threshold: yes or no.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.above_exchange_threshold IS
    'Whether the measured TSB is at or above the exchange-transfusion threshold: yes or no.';
COMMENT ON COLUMN bhutani_bilirubin_nomogram_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
