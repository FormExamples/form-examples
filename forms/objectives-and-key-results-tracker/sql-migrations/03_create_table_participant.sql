--liquibase formatted sql

--changeset author:1
CREATE TABLE participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    okr_objective_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT ''
        CHECK (role IN ('dri','contributor','reviewer','stakeholder','observer','')),
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_participant_updated_at
    BEFORE UPDATE ON participant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX participant_index_okr_objective_id ON participant(okr_objective_id);

COMMENT ON TABLE participant IS
    'A participant linked to an OKR objective: DRI, contributor, reviewer, stakeholder, or observer.';
COMMENT ON COLUMN participant.id IS 'Primary key UUID, auto-generated.';
COMMENT ON COLUMN participant.created_at IS 'Timestamp when this row was created.';
COMMENT ON COLUMN participant.updated_at IS 'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN participant.deleted_at IS 'Timestamp when the record was soft-deleted.';
COMMENT ON COLUMN participant.okr_objective_id IS
    'Foreign key to okr_objective. The FK constraint is added in the okr_objective migration via ALTER TABLE.';
COMMENT ON COLUMN participant.role IS
    'Participant role: dri (Directly Responsible Individual), contributor, reviewer, stakeholder, or observer.';
COMMENT ON COLUMN participant.name IS 'Display name of the participant.';
COMMENT ON COLUMN participant.email IS 'Email address of the participant.';
COMMENT ON COLUMN participant.notes IS 'Free-text notes about the participant role.';

--rollback DROP TABLE participant;
