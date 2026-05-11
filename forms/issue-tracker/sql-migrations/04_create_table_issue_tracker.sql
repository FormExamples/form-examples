-- The main assessment record for an issue. Holds reporter and metadata,
-- the nine SOAP-style sections (CC / Pt / Sx / Fx / Hx / Ix / Dx / Tx / Px),
-- and the seven raw input scores.

CREATE TABLE issue_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    reporter_id UUID NOT NULL REFERENCES reporter(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'open', 'in-progress', 'blocked', 'resolved', 'closed', 'duplicate', 'cancelled')),
    reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    discovered_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,

    issue_category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (issue_category IN (
            'software-defect', 'service-outage', 'performance', 'security',
            'data-protection', 'clinical-safety', 'workplace-safety',
            'medical-device', 'regulatory', 'project-blocker',
            'customer-complaint', 'hardware-fault', 'process', 'other', ''
        )),
    environment VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (environment IN ('dev', 'test', 'staging', 'production', 'on-prem', 'field', '')),
    system_name VARCHAR(255) NOT NULL DEFAULT '',
    component VARCHAR(255) NOT NULL DEFAULT '',
    customer_or_project_tag VARCHAR(255) NOT NULL DEFAULT '',
    external_reference VARCHAR(255) NOT NULL DEFAULT '',

    -- Section 1: Chief Complaint (CC)
    cc_summary VARCHAR(500) NOT NULL DEFAULT '',
    cc_long_description TEXT NOT NULL DEFAULT '',
    cc_reported_by_name VARCHAR(255) NOT NULL DEFAULT '',
    cc_reported_via VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (cc_reported_via IN (
            'self', 'colleague', 'customer', 'monitoring-alert',
            'ticket', 'phone', 'email', 'chat', 'in-person', 'other', ''
        )),

    -- Section 2: Participants (Pt)
    pt_discoverer_name VARCHAR(255) NOT NULL DEFAULT '',
    pt_affected_users_count INTEGER,
    pt_affected_user_groups VARCHAR(500) NOT NULL DEFAULT '',
    pt_assignees VARCHAR(500) NOT NULL DEFAULT '',
    pt_stakeholders_to_inform VARCHAR(500) NOT NULL DEFAULT '',
    pt_observers VARCHAR(500) NOT NULL DEFAULT '',

    -- Section 3: Symptoms (Sx)
    sx_external_signals TEXT NOT NULL DEFAULT '',
    sx_alert_ids VARCHAR(500) NOT NULL DEFAULT '',
    sx_error_messages TEXT NOT NULL DEFAULT '',
    sx_screenshots_url VARCHAR(500) NOT NULL DEFAULT '',
    sx_logs_url VARCHAR(500) NOT NULL DEFAULT '',
    sx_first_observed_at TIMESTAMPTZ,

    -- Section 4: Fractures (Fx)
    fx_broken_components TEXT NOT NULL DEFAULT '',
    fx_failed_services VARCHAR(500) NOT NULL DEFAULT '',
    fx_stuck_processes VARCHAR(500) NOT NULL DEFAULT '',
    fx_hardware_faults VARCHAR(500) NOT NULL DEFAULT '',
    fx_data_corruption VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (fx_data_corruption IN ('none', 'suspected', 'confirmed', 'unknown', '')),

    -- Section 5: History (Hx)
    hx_related_issues VARCHAR(500) NOT NULL DEFAULT '',
    hx_prior_occurrences INTEGER,
    hx_recent_change_url VARCHAR(500) NOT NULL DEFAULT '',
    hx_references TEXT NOT NULL DEFAULT '',
    hx_timeline TEXT NOT NULL DEFAULT '',

    -- Section 6: Investigations (Ix)
    ix_hypotheses TEXT NOT NULL DEFAULT '',
    ix_repro_steps TEXT NOT NULL DEFAULT '',
    ix_diagnostic_queries TEXT NOT NULL DEFAULT '',
    ix_tests_run VARCHAR(500) NOT NULL DEFAULT '',
    ix_blocking_unknowns TEXT NOT NULL DEFAULT '',

    -- Section 7: Diagnosis (Dx)
    dx_root_cause TEXT NOT NULL DEFAULT '',
    dx_contributing_causes TEXT NOT NULL DEFAULT '',
    dx_scope VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (dx_scope IN ('single-instance', 'single-service', 'multiple-services', 'whole-system', 'organisation-wide', '')),
    dx_confirmed VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (dx_confirmed IN ('yes', 'no', 'partial', '')),

    -- Section 8: Treatments (Tx)
    tx_mitigation_steps TEXT NOT NULL DEFAULT '',
    tx_fix_plan TEXT NOT NULL DEFAULT '',
    tx_workaround TEXT NOT NULL DEFAULT '',
    tx_rollback_plan TEXT NOT NULL DEFAULT '',
    tx_communication_plan VARCHAR(500) NOT NULL DEFAULT '',

    -- Section 9: Prognosis (Px)
    px_expected_resolution_at TIMESTAMPTZ,
    px_residual_risk TEXT NOT NULL DEFAULT '',
    px_monitoring_plan TEXT NOT NULL DEFAULT '',
    px_recurrence_likelihood VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (px_recurrence_likelihood IN ('very-low', 'low', 'moderate', 'high', 'very-high', '')),
    px_lessons_learned TEXT NOT NULL DEFAULT '',

    -- Raw input scores (the seven scoring scales)
    score_by_priority_rank INTEGER
        CHECK (score_by_priority_rank IS NULL OR score_by_priority_rank BETWEEN 1 AND 999),
    score_by_severity_of_impact INTEGER
        CHECK (score_by_severity_of_impact IS NULL OR score_by_severity_of_impact BETWEEN 1 AND 5),
    score_by_magnitude_of_damage INTEGER
        CHECK (score_by_magnitude_of_damage IS NULL OR score_by_magnitude_of_damage BETWEEN 1 AND 10),
    score_by_harm_grade INTEGER
        CHECK (score_by_harm_grade IS NULL OR score_by_harm_grade BETWEEN 0 AND 4),
    score_by_failure_condition VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (score_by_failure_condition IN ('A', 'B', 'C', 'D', 'E', '')),
    score_by_moscow_requirement INTEGER
        CHECK (score_by_moscow_requirement IS NULL OR score_by_moscow_requirement BETWEEN 1 AND 4),
    score_by_frequency_percent NUMERIC(5,2)
        CHECK (score_by_frequency_percent IS NULL OR score_by_frequency_percent BETWEEN 0 AND 100)
);

CREATE TRIGGER trigger_issue_tracker_updated_at
    BEFORE UPDATE ON issue_tracker
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE issue_tracker IS
    'A reportable issue captured via a 10-step single-page wizard. Holds reporter metadata, the nine SOAP-style sections, and the seven raw input scores. Computed scores live in the issue_tracker_grade child table.';
COMMENT ON COLUMN issue_tracker.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN issue_tracker.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN issue_tracker.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN issue_tracker.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN issue_tracker.reporter_id IS
    'Foreign key to the reporter who originally raised the issue.';
COMMENT ON COLUMN issue_tracker.status IS
    'Lifecycle status: draft, open, in-progress, blocked, resolved, closed, duplicate, cancelled.';
COMMENT ON COLUMN issue_tracker.reported_at IS
    'Timestamp the issue was first recorded in this tracker.';
COMMENT ON COLUMN issue_tracker.discovered_at IS
    'Timestamp the issue was first discovered in the wild.';
COMMENT ON COLUMN issue_tracker.started_at IS
    'Timestamp work to remediate the issue began.';
COMMENT ON COLUMN issue_tracker.resolved_at IS
    'Timestamp the issue was resolved.';
COMMENT ON COLUMN issue_tracker.issue_category IS
    'Issue category: software-defect, service-outage, security, clinical-safety, etc.';
COMMENT ON COLUMN issue_tracker.environment IS
    'Environment where the issue occurred: dev, test, staging, production, on-prem, field.';
COMMENT ON COLUMN issue_tracker.system_name IS
    'Name of the affected system or service.';
COMMENT ON COLUMN issue_tracker.component IS
    'Specific component within the system that is affected.';
COMMENT ON COLUMN issue_tracker.customer_or_project_tag IS
    'Customer name, project tag, or tenant identifier the issue is associated with.';
COMMENT ON COLUMN issue_tracker.external_reference IS
    'External reference: ticket id, incident id, change request, RIDDOR or LFPSE id, etc.';
COMMENT ON COLUMN issue_tracker.cc_summary IS
    'Section CC: one-sentence summary of the problem as reported.';
COMMENT ON COLUMN issue_tracker.cc_long_description IS
    'Section CC: free-text long description of the chief complaint.';
COMMENT ON COLUMN issue_tracker.cc_reported_by_name IS
    'Section CC: name of the person who reported the chief complaint (may differ from the reporter row).';
COMMENT ON COLUMN issue_tracker.cc_reported_via IS
    'Section CC: channel through which the chief complaint was reported.';
COMMENT ON COLUMN issue_tracker.pt_discoverer_name IS
    'Section Pt: name of the person who discovered the issue.';
COMMENT ON COLUMN issue_tracker.pt_affected_users_count IS
    'Section Pt: estimated count of users affected.';
COMMENT ON COLUMN issue_tracker.pt_affected_user_groups IS
    'Section Pt: free-text list of affected user groups, customer segments, or cohorts.';
COMMENT ON COLUMN issue_tracker.pt_assignees IS
    'Section Pt: free-text list of assignees responsible for working the issue.';
COMMENT ON COLUMN issue_tracker.pt_stakeholders_to_inform IS
    'Section Pt: free-text list of stakeholders to inform about progress.';
COMMENT ON COLUMN issue_tracker.pt_observers IS
    'Section Pt: free-text list of observers and CC recipients.';
COMMENT ON COLUMN issue_tracker.sx_external_signals IS
    'Section Sx: external signals observed by users — what is going wrong on the surface.';
COMMENT ON COLUMN issue_tracker.sx_alert_ids IS
    'Section Sx: identifiers of monitoring alerts that fired (Sentry, PagerDuty, Datadog, CloudWatch).';
COMMENT ON COLUMN issue_tracker.sx_error_messages IS
    'Section Sx: verbatim error messages, status codes, or stack traces.';
COMMENT ON COLUMN issue_tracker.sx_screenshots_url IS
    'Section Sx: URL of an attached screenshot or screen capture.';
COMMENT ON COLUMN issue_tracker.sx_logs_url IS
    'Section Sx: URL of attached log file or log query.';
COMMENT ON COLUMN issue_tracker.sx_first_observed_at IS
    'Section Sx: timestamp of the first observed symptom.';
COMMENT ON COLUMN issue_tracker.fx_broken_components IS
    'Section Fx: free-text list of broken components, services, or pipelines.';
COMMENT ON COLUMN issue_tracker.fx_failed_services IS
    'Section Fx: list of failed services with their statuses.';
COMMENT ON COLUMN issue_tracker.fx_stuck_processes IS
    'Section Fx: list of stuck processes, queues, or batch jobs.';
COMMENT ON COLUMN issue_tracker.fx_hardware_faults IS
    'Section Fx: hardware-level faults — disk, network, sensor, instrument.';
COMMENT ON COLUMN issue_tracker.fx_data_corruption IS
    'Section Fx: data-corruption status — none, suspected, confirmed, or unknown.';
COMMENT ON COLUMN issue_tracker.hx_related_issues IS
    'Section Hx: identifiers of related or prior issues.';
COMMENT ON COLUMN issue_tracker.hx_prior_occurrences IS
    'Section Hx: count of prior occurrences of the same issue.';
COMMENT ON COLUMN issue_tracker.hx_recent_change_url IS
    'Section Hx: URL of a recent change suspected to have caused the issue.';
COMMENT ON COLUMN issue_tracker.hx_references IS
    'Section Hx: free-text references — runbooks, RFCs, post-mortems.';
COMMENT ON COLUMN issue_tracker.hx_timeline IS
    'Section Hx: free-text timeline of relevant events.';
COMMENT ON COLUMN issue_tracker.ix_hypotheses IS
    'Section Ix: hypotheses being investigated.';
COMMENT ON COLUMN issue_tracker.ix_repro_steps IS
    'Section Ix: reproduction steps tried so far.';
COMMENT ON COLUMN issue_tracker.ix_diagnostic_queries IS
    'Section Ix: diagnostic queries, profiles, traces, or scripts used.';
COMMENT ON COLUMN issue_tracker.ix_tests_run IS
    'Section Ix: list of tests executed during investigation.';
COMMENT ON COLUMN issue_tracker.ix_blocking_unknowns IS
    'Section Ix: known unknowns that are blocking diagnosis.';
COMMENT ON COLUMN issue_tracker.dx_root_cause IS
    'Section Dx: root-cause statement.';
COMMENT ON COLUMN issue_tracker.dx_contributing_causes IS
    'Section Dx: contributing or cascading causes.';
COMMENT ON COLUMN issue_tracker.dx_scope IS
    'Section Dx: blast radius — single-instance, single-service, multiple-services, whole-system, or organisation-wide.';
COMMENT ON COLUMN issue_tracker.dx_confirmed IS
    'Section Dx: whether the diagnosis is confirmed: yes, no, or partial.';
COMMENT ON COLUMN issue_tracker.tx_mitigation_steps IS
    'Section Tx: mitigation steps taken to limit impact.';
COMMENT ON COLUMN issue_tracker.tx_fix_plan IS
    'Section Tx: planned permanent fix.';
COMMENT ON COLUMN issue_tracker.tx_workaround IS
    'Section Tx: workaround applied while the permanent fix is in flight.';
COMMENT ON COLUMN issue_tracker.tx_rollback_plan IS
    'Section Tx: rollback plan if the permanent fix fails.';
COMMENT ON COLUMN issue_tracker.tx_communication_plan IS
    'Section Tx: communication plan — who tells whom, when, and through what channel.';
COMMENT ON COLUMN issue_tracker.px_expected_resolution_at IS
    'Section Px: expected resolution timestamp.';
COMMENT ON COLUMN issue_tracker.px_residual_risk IS
    'Section Px: residual risk that remains after the fix.';
COMMENT ON COLUMN issue_tracker.px_monitoring_plan IS
    'Section Px: monitoring plan to detect recurrence.';
COMMENT ON COLUMN issue_tracker.px_recurrence_likelihood IS
    'Section Px: likelihood the issue will recur — very-low, low, moderate, high, very-high.';
COMMENT ON COLUMN issue_tracker.px_lessons_learned IS
    'Section Px: lessons learned to feed into a post-mortem.';
COMMENT ON COLUMN issue_tracker.score_by_priority_rank IS
    'Score 1 of 7: priority rank — 1 = do first, 2 = do second, ... (capped at 999).';
COMMENT ON COLUMN issue_tracker.score_by_severity_of_impact IS
    'Score 2 of 7: severity of impact 1 (minimal) to 5 (catastrophic), per Saffir-Simpson scale.';
COMMENT ON COLUMN issue_tracker.score_by_magnitude_of_damage IS
    'Score 3 of 7: magnitude of damage 1 (minor) to 10 (total destruction), per Richter earthquake scale.';
COMMENT ON COLUMN issue_tracker.score_by_harm_grade IS
    'Score 4 of 7: NHS LFPSE harm grade 0 (no harm) to 4 (fatal).';
COMMENT ON COLUMN issue_tracker.score_by_failure_condition IS
    'Score 5 of 7: aviation FAA / EASA failure condition A (catastrophic) to E (no effect).';
COMMENT ON COLUMN issue_tracker.score_by_moscow_requirement IS
    'Score 6 of 7: MoSCoW prioritisation 1 (must) to 4 (won''t).';
COMMENT ON COLUMN issue_tracker.score_by_frequency_percent IS
    'Score 7 of 7: frequency of occurrence as a percentage of usage affected, 0 to 100.';

CREATE INDEX issue_tracker_index_reporter_id
    ON issue_tracker(reporter_id);
CREATE INDEX issue_tracker_index_status
    ON issue_tracker(status);
CREATE INDEX issue_tracker_index_environment
    ON issue_tracker(environment);
CREATE INDEX issue_tracker_index_cc_summary_trgm
    ON issue_tracker
    USING GIN (cc_summary gin_trgm_ops);
