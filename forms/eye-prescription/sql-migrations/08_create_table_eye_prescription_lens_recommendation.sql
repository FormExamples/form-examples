-- Lens recommendation (material, design, coatings, tint).

CREATE TABLE eye_prescription_lens_recommendation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    eye_prescription_id UUID NOT NULL UNIQUE
        REFERENCES eye_prescription(id) ON DELETE CASCADE,

    lens_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (lens_type IN (
            'single-vision-distance',
            'single-vision-near',
            'single-vision-intermediate',
            'bifocal',
            'trifocal',
            'varifocal',
            'occupational-varifocal',
            ''
        )),
    material VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (material IN (
            'cr-39',
            'trivex',
            'polycarbonate',
            'mid-index-1.60',
            'high-index-1.67',
            'high-index-1.74',
            'glass',
            ''
        )),
    refractive_index NUMERIC(4,3)
        CHECK (refractive_index IS NULL OR refractive_index BETWEEN 1.000 AND 2.000),
    aspheric BOOLEAN NOT NULL DEFAULT FALSE,

    coating_anti_reflective BOOLEAN NOT NULL DEFAULT FALSE,
    coating_scratch_resistant BOOLEAN NOT NULL DEFAULT FALSE,
    coating_hydrophobic BOOLEAN NOT NULL DEFAULT FALSE,
    coating_blue_light BOOLEAN NOT NULL DEFAULT FALSE,
    coating_photochromic BOOLEAN NOT NULL DEFAULT FALSE,
    coating_polarised BOOLEAN NOT NULL DEFAULT FALSE,
    coating_uv_400 BOOLEAN NOT NULL DEFAULT FALSE,

    tint_description VARCHAR(50) NOT NULL DEFAULT '',
    tint_percent INTEGER
        CHECK (tint_percent IS NULL OR tint_percent BETWEEN 0 AND 100),

    dispenser_notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_eye_prescription_lens_recommendation_updated_at
    BEFORE UPDATE ON eye_prescription_lens_recommendation
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE eye_prescription_lens_recommendation IS
    'Lens recommendation: design, material, coatings, tint. One row per prescription.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.eye_prescription_id IS
    'Foreign key to the parent eye_prescription (unique, 1:1).';
COMMENT ON COLUMN eye_prescription_lens_recommendation.lens_type IS
    'Lens design: single-vision-distance, single-vision-near, single-vision-intermediate, bifocal, trifocal, varifocal, occupational-varifocal.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.material IS
    'Lens material: cr-39, trivex, polycarbonate, mid-index-1.60, high-index-1.67, high-index-1.74, glass.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.refractive_index IS
    'Refractive index of the lens material (1.498 for CR-39, 1.586 for polycarbonate, etc.).';
COMMENT ON COLUMN eye_prescription_lens_recommendation.aspheric IS
    'Whether an aspheric lens design is recommended.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.coating_anti_reflective IS
    'Whether anti-reflective coating is recommended.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.coating_scratch_resistant IS
    'Whether scratch-resistant coating is recommended.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.coating_hydrophobic IS
    'Whether hydrophobic coating is recommended.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.coating_blue_light IS
    'Whether blue-light filter coating is recommended.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.coating_photochromic IS
    'Whether photochromic (light-reactive) coating is recommended.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.coating_polarised IS
    'Whether polarised coating is recommended.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.coating_uv_400 IS
    'Whether UV-400 protection is recommended.';
COMMENT ON COLUMN eye_prescription_lens_recommendation.tint_description IS
    'Tint description (e.g. "brown", "grey", "G15").';
COMMENT ON COLUMN eye_prescription_lens_recommendation.tint_percent IS
    'Tint density as a percentage (0 = clear, 85 = sunglass).';
COMMENT ON COLUMN eye_prescription_lens_recommendation.dispenser_notes IS
    'Free-text notes for the dispensing optician.';
