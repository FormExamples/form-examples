-- Main mental state examination (MSE) record: one psychiatric mental state
-- examination documented across the seven ASEPTIC domains (appearance and
-- behaviour, speech, emotion, perception, thought, insight and judgement,
-- cognition) plus assessment context and patient / clinician identification.
-- The completeness-and-risk grade, the audit trail of fired rules, and the
-- safety flags live in dedicated child tables. This is a documentation and
-- completeness instrument, not a numeric score: a domain is documented when
-- any of its findings fields is non-empty; presence is detected by a
-- non-empty field, not by semantic analysis.

CREATE TABLE mental_state_examination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('psychiatrist', 'mental-health-nurse', 'gp', 'liaison', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('outpatient', 'inpatient', 'liaison', 'crisis', 'primary-care', 'other', '')),
    assessment_reason TEXT NOT NULL DEFAULT '',
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (age_band IN ('under-18', '18-25', '26-39', '40-64', '65-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Domain 1 — Appearance and behaviour
    appearance_grooming VARCHAR(20) NOT NULL DEFAULT '' CHECK (appearance_grooming IN ('well-kempt', 'dishevelled', 'other', '')),
    appearance_eye_contact VARCHAR(20) NOT NULL DEFAULT '' CHECK (appearance_eye_contact IN ('normal', 'reduced', 'intense', 'avoidant', '')),
    appearance_rapport VARCHAR(20) NOT NULL DEFAULT '' CHECK (appearance_rapport IN ('good', 'guarded', 'hostile', 'withdrawn', '')),
    appearance_psychomotor VARCHAR(20) NOT NULL DEFAULT '' CHECK (appearance_psychomotor IN ('normal', 'agitation', 'retardation', '')),
    appearance_abnormal_movements TEXT NOT NULL DEFAULT '',
    appearance_notes TEXT NOT NULL DEFAULT '',

    -- Domain 2 — Speech
    speech_rate VARCHAR(20) NOT NULL DEFAULT '' CHECK (speech_rate IN ('normal', 'slow', 'rapid', 'pressured', '')),
    speech_volume VARCHAR(20) NOT NULL DEFAULT '' CHECK (speech_volume IN ('normal', 'quiet', 'loud', '')),
    speech_quantity VARCHAR(20) NOT NULL DEFAULT '' CHECK (speech_quantity IN ('normal', 'poverty', 'excessive', '')),
    speech_fluency VARCHAR(20) NOT NULL DEFAULT '' CHECK (speech_fluency IN ('fluent', 'hesitant', 'dysarthric', 'mute', '')),
    speech_notes TEXT NOT NULL DEFAULT '',

    -- Domain 3 — Emotion (mood and affect)
    mood_subjective TEXT NOT NULL DEFAULT '',
    mood_descriptor VARCHAR(20) NOT NULL DEFAULT '' CHECK (mood_descriptor IN ('euthymic', 'low', 'elevated', 'anxious', 'irritable', 'other', '')),
    affect_range VARCHAR(20) NOT NULL DEFAULT '' CHECK (affect_range IN ('full', 'restricted', 'blunted', 'flat', '')),
    affect_congruence VARCHAR(20) NOT NULL DEFAULT '' CHECK (affect_congruence IN ('congruent', 'incongruent', '')),
    affect_reactivity VARCHAR(20) NOT NULL DEFAULT '' CHECK (affect_reactivity IN ('reactive', 'non-reactive', '')),
    emotion_notes TEXT NOT NULL DEFAULT '',

    -- Domain 4 — Perception
    hallucinations_present VARCHAR(20) NOT NULL DEFAULT '' CHECK (hallucinations_present IN ('none', 'auditory', 'visual', 'olfactory', 'gustatory', 'tactile', 'multiple', '')),
    command_hallucinations VARCHAR(20) NOT NULL DEFAULT '' CHECK (command_hallucinations IN ('yes', 'no', 'not-applicable', '')),
    illusions VARCHAR(20) NOT NULL DEFAULT '' CHECK (illusions IN ('present', 'absent', '')),
    depersonalisation VARCHAR(20) NOT NULL DEFAULT '' CHECK (depersonalisation IN ('present', 'absent', '')),
    derealisation VARCHAR(20) NOT NULL DEFAULT '' CHECK (derealisation IN ('present', 'absent', '')),
    perception_notes TEXT NOT NULL DEFAULT '',

    -- Domain 5 — Thought (form and content)
    thought_form VARCHAR(20) NOT NULL DEFAULT '' CHECK (thought_form IN ('linear', 'circumstantial', 'tangential', 'flight-of-ideas', 'thought-block', 'loosening', '')),
    delusions VARCHAR(20) NOT NULL DEFAULT '' CHECK (delusions IN ('none', 'persecutory', 'grandiose', 'reference', 'nihilistic', 'other', '')),
    obsessions VARCHAR(20) NOT NULL DEFAULT '' CHECK (obsessions IN ('present', 'absent', '')),
    suicidal_ideation VARCHAR(20) NOT NULL DEFAULT '' CHECK (suicidal_ideation IN ('none', 'passive', 'active-no-plan', 'active-with-plan', '')),
    homicidal_ideation VARCHAR(20) NOT NULL DEFAULT '' CHECK (homicidal_ideation IN ('none', 'thoughts', 'intent', '')),
    self_harm_thoughts VARCHAR(20) NOT NULL DEFAULT '' CHECK (self_harm_thoughts IN ('none', 'thoughts', 'recent-acts', '')),
    thought_notes TEXT NOT NULL DEFAULT '',

    -- Domain 6 — Insight and judgement
    insight_level VARCHAR(20) NOT NULL DEFAULT '' CHECK (insight_level IN ('full', 'partial', 'none', '')),
    treatment_understanding VARCHAR(20) NOT NULL DEFAULT '' CHECK (treatment_understanding IN ('accepts', 'ambivalent', 'refuses', '')),
    judgement VARCHAR(20) NOT NULL DEFAULT '' CHECK (judgement IN ('intact', 'impaired', '')),
    insight_notes TEXT NOT NULL DEFAULT '',

    -- Domain 7 — Cognition
    orientation VARCHAR(30) NOT NULL DEFAULT '' CHECK (orientation IN ('orientated', 'disorientated-time', 'disorientated-place', 'disorientated-person', 'global', '')),
    attention VARCHAR(20) NOT NULL DEFAULT '' CHECK (attention IN ('normal', 'impaired', '')),
    memory VARCHAR(30) NOT NULL DEFAULT '' CHECK (memory IN ('intact', 'short-term-impaired', 'long-term-impaired', 'global-impairment', '')),
    cognitive_impression VARCHAR(30) NOT NULL DEFAULT '' CHECK (cognitive_impression IN ('no-concern', 'mild-concern', 'significant-concern', '')),
    cognition_notes TEXT NOT NULL DEFAULT '',

    -- Summary
    clinical_formulation TEXT NOT NULL DEFAULT ''
);

CREATE INDEX mental_state_examination_patient_id_idx
    ON mental_state_examination (patient_id);
CREATE INDEX mental_state_examination_clinician_id_idx
    ON mental_state_examination (clinician_id);

CREATE TRIGGER trigger_mental_state_examination_updated_at
    BEFORE UPDATE ON mental_state_examination
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mental_state_examination IS
    'Main mental state examination (MSE) record: assessment context, patient and clinician identification, and the seven ASEPTIC domains (appearance and behaviour, speech, emotion, perception, thought, insight and judgement, cognition). Completeness-and-risk grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN mental_state_examination.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mental_state_examination.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN mental_state_examination.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN mental_state_examination.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN mental_state_examination.patient_id IS
    'Foreign key to the patient this examination documents (restrict delete).';
COMMENT ON COLUMN mental_state_examination.clinician_id IS
    'Foreign key to the assessing clinician (restrict delete); optional.';
COMMENT ON COLUMN mental_state_examination.clinician_name IS
    'Name of the assessing clinician as recorded on the examination.';
COMMENT ON COLUMN mental_state_examination.clinician_role IS
    'Assessing clinician role: psychiatrist, mental-health-nurse, gp, liaison, or other.';
COMMENT ON COLUMN mental_state_examination.assessed_at IS
    'Date and time the mental state examination was performed.';
COMMENT ON COLUMN mental_state_examination.care_setting IS
    'Care setting: outpatient, inpatient, liaison, crisis, primary-care, or other.';
COMMENT ON COLUMN mental_state_examination.assessment_reason IS
    'Reason for assessment or referral.';
COMMENT ON COLUMN mental_state_examination.patient_identifier IS
    'Local patient or encounter identifier as recorded on the examination.';
COMMENT ON COLUMN mental_state_examination.age_band IS
    'Patient age band: under-18, 18-25, 26-39, 40-64, or 65-plus.';
COMMENT ON COLUMN mental_state_examination.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN mental_state_examination.appearance_grooming IS
    'Domain 1 (appearance and behaviour): grooming — well-kempt, dishevelled, or other.';
COMMENT ON COLUMN mental_state_examination.appearance_eye_contact IS
    'Domain 1: eye contact — normal, reduced, intense, or avoidant.';
COMMENT ON COLUMN mental_state_examination.appearance_rapport IS
    'Domain 1: rapport — good, guarded, hostile, or withdrawn.';
COMMENT ON COLUMN mental_state_examination.appearance_psychomotor IS
    'Domain 1: psychomotor activity — normal, agitation, or retardation; agitation drives the agitation flag.';
COMMENT ON COLUMN mental_state_examination.appearance_abnormal_movements IS
    'Domain 1: abnormal movements (tics, tremor, dystonia, etc.); free text.';
COMMENT ON COLUMN mental_state_examination.appearance_notes IS
    'Domain 1: free-text notes on appearance and behaviour.';
COMMENT ON COLUMN mental_state_examination.speech_rate IS
    'Domain 2 (speech): rate — normal, slow, rapid, or pressured.';
COMMENT ON COLUMN mental_state_examination.speech_volume IS
    'Domain 2: volume — normal, quiet, or loud.';
COMMENT ON COLUMN mental_state_examination.speech_quantity IS
    'Domain 2: quantity — normal, poverty, or excessive.';
COMMENT ON COLUMN mental_state_examination.speech_fluency IS
    'Domain 2: fluency — fluent, hesitant, dysarthric, or mute.';
COMMENT ON COLUMN mental_state_examination.speech_notes IS
    'Domain 2: free-text notes on speech.';
COMMENT ON COLUMN mental_state_examination.mood_subjective IS
    'Domain 3 (emotion): subjective mood in the patient''s own words; free text.';
COMMENT ON COLUMN mental_state_examination.mood_descriptor IS
    'Domain 3: objective mood descriptor — euthymic, low, elevated, anxious, irritable, or other; low drives the low-mood flag.';
COMMENT ON COLUMN mental_state_examination.affect_range IS
    'Domain 3: affect range — full, restricted, blunted, or flat.';
COMMENT ON COLUMN mental_state_examination.affect_congruence IS
    'Domain 3: affect congruence — congruent or incongruent.';
COMMENT ON COLUMN mental_state_examination.affect_reactivity IS
    'Domain 3: affect reactivity — reactive or non-reactive.';
COMMENT ON COLUMN mental_state_examination.emotion_notes IS
    'Domain 3: free-text notes on mood and affect.';
COMMENT ON COLUMN mental_state_examination.hallucinations_present IS
    'Domain 4 (perception): hallucination modality — none, auditory, visual, olfactory, gustatory, tactile, or multiple; contributes to the psychosis-with-risk flag.';
COMMENT ON COLUMN mental_state_examination.command_hallucinations IS
    'Domain 4: command hallucinations — yes, no, or not-applicable; yes drives the command-hallucinations flag.';
COMMENT ON COLUMN mental_state_examination.illusions IS
    'Domain 4: illusions — present or absent.';
COMMENT ON COLUMN mental_state_examination.depersonalisation IS
    'Domain 4: depersonalisation — present or absent.';
COMMENT ON COLUMN mental_state_examination.derealisation IS
    'Domain 4: derealisation — present or absent.';
COMMENT ON COLUMN mental_state_examination.perception_notes IS
    'Domain 4: free-text notes on perception.';
COMMENT ON COLUMN mental_state_examination.thought_form IS
    'Domain 5 (thought): thought form — linear, circumstantial, tangential, flight-of-ideas, thought-block, or loosening.';
COMMENT ON COLUMN mental_state_examination.delusions IS
    'Domain 5: delusional content — none, persecutory, grandiose, reference, nihilistic, or other; any value other than none drives the delusional-content flag.';
COMMENT ON COLUMN mental_state_examination.obsessions IS
    'Domain 5: obsessions — present or absent.';
COMMENT ON COLUMN mental_state_examination.suicidal_ideation IS
    'Domain 5: suicidal ideation — none, passive, active-no-plan, or active-with-plan; active values drive the suicidal-ideation flag, passive the thoughts-of-self-harm flag.';
COMMENT ON COLUMN mental_state_examination.homicidal_ideation IS
    'Domain 5: homicidal ideation — none, thoughts, or intent; thoughts or intent drive the homicidal-ideation flag.';
COMMENT ON COLUMN mental_state_examination.self_harm_thoughts IS
    'Domain 5: self-harm — none, thoughts, or recent-acts; recent-acts drives the recent-self-harm flag, thoughts the thoughts-of-self-harm flag.';
COMMENT ON COLUMN mental_state_examination.thought_notes IS
    'Domain 5: free-text notes on thought form and content.';
COMMENT ON COLUMN mental_state_examination.insight_level IS
    'Domain 6 (insight and judgement): insight level — full, partial, or none; none contributes to the lack-of-insight-with-risk flag.';
COMMENT ON COLUMN mental_state_examination.treatment_understanding IS
    'Domain 6: understanding of and attitude to treatment — accepts, ambivalent, or refuses; refuses contributes to the lack-of-insight-with-risk flag.';
COMMENT ON COLUMN mental_state_examination.judgement IS
    'Domain 6: judgement — intact or impaired.';
COMMENT ON COLUMN mental_state_examination.insight_notes IS
    'Domain 6: free-text notes on insight and judgement.';
COMMENT ON COLUMN mental_state_examination.orientation IS
    'Domain 7 (cognition): orientation — orientated, disorientated-time, disorientated-place, disorientated-person, or global; global contributes to the cognitive-impairment flag.';
COMMENT ON COLUMN mental_state_examination.attention IS
    'Domain 7: attention — normal or impaired.';
COMMENT ON COLUMN mental_state_examination.memory IS
    'Domain 7: memory — intact, short-term-impaired, long-term-impaired, or global-impairment.';
COMMENT ON COLUMN mental_state_examination.cognitive_impression IS
    'Domain 7: overall cognitive impression — no-concern, mild-concern, or significant-concern; significant-concern contributes to the cognitive-impairment flag.';
COMMENT ON COLUMN mental_state_examination.cognition_notes IS
    'Domain 7: free-text notes on cognition.';
COMMENT ON COLUMN mental_state_examination.clinical_formulation IS
    'Summary: free-text clinical formulation drawing the domains together.';
