import { describe, expect, it } from 'vitest';
import { evaluateAdr } from './adr-engine';
import { createDefaultAdrFormData } from '#lib/stores/adr.svelte.js';

describe('evaluateAdr — completeness', () => {
	it('reports 0% for a blank draft', () => {
		const e = evaluateAdr(createDefaultAdrFormData());
		expect(e.completeness).toBe(0);
		expect(e.filledSections).toBe(0);
		expect(e.chosenPosition).toBe('');
	});

	it('reports 100% when all core sections and a position are filled', () => {
		const d = createDefaultAdrFormData();
		d.adr.title = 'Use PostgreSQL';
		d.adr.issue = 'We need a primary store.';
		d.adr.decision = 'Use PostgreSQL.';
		d.adr.assumptions = 'Relational fits.';
		d.adr.constraints = 'Must be open source.';
		d.adr.argument = 'Mature, proven.';
		d.adr.implications = 'Ops must run Postgres.';
		d.adr.relatedDecisions = 'ADR-0002';
		d.adr.relatedRequirements = 'REQ-1';
		d.adr.relatedArtifacts = 'schema.sql';
		d.adr.relatedPrinciples = 'Prefer boring tech';
		d.positions = [
			{ name: 'PostgreSQL', description: '', modelOrDiagramUrl: '', isChosen: true, pros: '', cons: '' }
		];
		const e = evaluateAdr(d);
		expect(e.completeness).toBe(100);
		expect(e.chosenPosition).toBe('PostgreSQL');
		expect(e.positionCount).toBe(1);
	});
});

describe('evaluateAdr — flags', () => {
	it('flags a missing issue and decision as high priority', () => {
		const e = evaluateAdr(createDefaultAdrFormData());
		const ids = e.flags.map((f) => f.id);
		expect(ids).toContain('no-issue');
		expect(ids).toContain('no-decision');
		expect(e.flags[0].priority).toBe('high');
	});

	it('flags an approved ADR with no sign-off', () => {
		const d = createDefaultAdrFormData();
		d.adr.status = 'approved';
		const e = evaluateAdr(d);
		expect(e.flags.map((f) => f.id)).toContain('unsigned');
	});

	it('flags positions present but none chosen', () => {
		const d = createDefaultAdrFormData();
		d.positions = [
			{ name: 'Option A', description: '', modelOrDiagramUrl: '', isChosen: false, pros: '', cons: '' }
		];
		const e = evaluateAdr(d);
		expect(e.flags.map((f) => f.id)).toContain('no-chosen-position');
	});

	it('flags a superseded ADR with no replacement link', () => {
		const d = createDefaultAdrFormData();
		d.adr.status = 'superseded';
		const e = evaluateAdr(d);
		expect(e.flags.map((f) => f.id)).toContain('superseded-no-link');
	});

	it('sorts flags by priority (high before low)', () => {
		const e = evaluateAdr(createDefaultAdrFormData());
		const priorities = e.flags.map((f) => f.priority);
		const order = { high: 0, medium: 1, low: 2 };
		for (let i = 1; i < priorities.length; i++) {
			expect(order[priorities[i]]).toBeGreaterThanOrEqual(order[priorities[i - 1]]);
		}
	});
});
