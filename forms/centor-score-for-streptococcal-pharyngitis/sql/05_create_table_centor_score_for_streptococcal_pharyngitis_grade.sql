-- Computed Centor / McIsaac grading result. Stores the raw Centor total
-- (0-4), the McIsaac age modifier (-1..+1), the modified McIsaac score
-- (-1..5), the derived risk band, and the free-text management guidance.

CREATE TABLE centor_score_for_streptococcal_pharyngitis_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    centor_score_for_streptococcal_pharyngitis_id UUID NOT NULL UNIQUE
        REFERENCES centor_score_for_streptococcal_pharyngitis(id) ON DELETE CASCADE,

    centor_score INT,
    age_modifier INT,
    mcisaac_score INT,
    risk_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'moderate', 'high', '')),
    management TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_centor_score_for_streptococcal_pharyngitis_grade_updated_at
    BEFORE UPDATE ON centor_score_for_streptococcal_pharyngitis_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE centor_score_for_streptococcal_pharyngitis_grade IS
    'Computed Centor / McIsaac grading result: raw Centor total (0-4), age modifier (-1..+1), modified McIsaac score (-1..5), derived risk band, and management guidance.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.centor_score_for_streptococcal_pharyngitis_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.centor_score IS
    'Raw Centor total across the four criteria (0-4 when complete).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.age_modifier IS
    'McIsaac age modifier: +1 for ages 3-14, 0 for ages 15-44, -1 for ages 45+.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.mcisaac_score IS
    'Modified McIsaac score: Centor total plus age modifier (-1..5).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.risk_band IS
    'Derived risk band from the McIsaac score: low (<=1), moderate (2-3), or high (4-5).';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.management IS
    'Free-text testing / antibiotic management guidance for the derived band.';
COMMENT ON COLUMN centor_score_for_streptococcal_pharyngitis_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
