import { describe, it, expect } from 'vitest';
import { gradeSafety } from './safety-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { safetyRules } from './safety-rules';
import type { AssessmentData } from './types';

/** A fully-answered, fully-compliant audit (every control in place). */
function createCompliantAudit(): AssessmentData {
	return {
		siteDetails: {
			auditorName: 'Alex Auditor',
			auditorRole: 'Health & Safety Lead',
			auditDate: '2026-06-10',
			siteName: 'Riverside Health Centre',
			siteAddress: '1 Riverside Way',
			departmentArea: 'Outpatients',
			siteManager: 'Sam Manager',
			previousAuditDate: '2025-06-10',
			previousFindingsClosed: 'yes'
		},
		ppeHazardControls: {
			ppeAvailable: 'yes',
			ppeCorrectlyUsed: 'yes',
			ppeStockMaintained: 'yes',
			hazardSignageVisible: 'yes',
			signageLegible: 'yes',
			housekeepingSatisfactory: 'yes',
			slipTripHazardsControlled: 'yes',
			observations: ''
		},
		chemicalBiologicalHazards: {
			coshhRegisterPresent: 'yes',
			sdsAvailable: 'yes',
			chemicalsLabelledCorrectly: 'yes',
			chemicalsStoredSecurely: 'yes',
			spillKitsAvailable: 'yes',
			untreatedSpillsObserved: 'no',
			sharpsContainersInDate: 'yes',
			clinicalWasteSegregated: 'yes',
			biologicalRiskAssessmentCurrent: 'yes',
			observations: ''
		},
		electricalSafety: {
			patTestingInDate: 'yes',
			fixedWiringTestInDate: 'yes',
			damagedEquipmentObserved: 'no',
			overloadedSocketsObserved: 'no',
			extensionLeadsManagedSafely: 'yes',
			consumerUnitAccessible: 'yes',
			observations: ''
		},
		fireSafety: {
			fireRiskAssessmentCurrent: 'yes',
			fireExtinguishersServiced: 'yes',
			fireExtinguishersAccessible: 'yes',
			fireAlarmTestedWeekly: 'yes',
			emergencyEgressClear: 'yes',
			emergencyLightingFunctional: 'yes',
			fireDoorsHeldOpenIllegally: 'no',
			assemblyPointSignposted: 'yes',
			observations: ''
		},
		ergonomicsManualHandling: {
			manualHandlingAssessmentCurrent: 'yes',
			liftingAidsAvailable: 'yes',
			dseAssessmentsCompleted: 'yes',
			workstationsAdjustable: 'yes',
			repetitiveStrainConcerns: 'no',
			patientHandlingPlansInPlace: 'yes',
			observations: ''
		},
		emergencyProcedures: {
			evacuationProcedurePosted: 'yes',
			firstAidKitsStocked: 'yes',
			firstAiderRosterCurrent: 'yes',
			aedAvailable: 'yes',
			aedServiceInDate: 'yes',
			emergencyContactsDisplayed: 'yes',
			drillConductedLast12Months: 'yes',
			observations: ''
		},
		trainingCompetence: {
			mandatoryTrainingUpToDate: 'yes',
			fireMarshalsTrained: 'yes',
			manualHandlingTrainingCurrent: 'yes',
			infectionControlTrainingCurrent: 'yes',
			trainingRecordsAccessible: 'yes',
			inductionForNewStartersCompleted: 'yes',
			observations: ''
		},
		incidentReporting: {
			incidentReportingSystemUsed: 'yes',
			riddorReportableIncidentsReported: 'yes',
			nearMissReportingActive: 'yes',
			incidentsLast12Months: 1,
			nearMissesLast12Months: 12,
			lessonsLearnedShared: 'yes',
			actionsFromIncidentsTracked: 'yes',
			observations: ''
		},
		signoffActionPlan: {
			actionItems: [],
			overallSummary: '',
			auditorSignature: '',
			signoffDate: '',
			debriefDelivered: 'yes'
		}
	};
}

describe('Workplace Safety Grading Engine', () => {
	it('returns compliant for a blank (unanswered) audit', () => {
		const blank = createCompliantAudit();
		// Wipe every Yes/No/N/A answer back to unanswered.
		for (const rule of safetyRules) void rule; // keep import used
		const empty: AssessmentData = JSON.parse(JSON.stringify(blank));
		(Object.keys(empty) as (keyof AssessmentData)[]).forEach((section) => {
			const sec = empty[section] as unknown as Record<string, unknown>;
			for (const key of Object.keys(sec)) {
				if (typeof sec[key] === 'string') sec[key] = '';
			}
		});
		const result = gradeSafety(empty);
		expect(result.outcome).toBe('compliant');
		expect(result.answeredCount).toBe(0);
	});

	it('returns compliant for a fully-compliant audit (all controls in place)', () => {
		const result = gradeSafety(createCompliantAudit());
		expect(result.outcome).toBe('compliant');
		expect(result.answeredCount).toBe(safetyRules.length);
		expect(result.firedRules.every((r) => r.grade === 1)).toBe(true);
	});

	it('returns minor when only grade-2 findings are present', () => {
		const data = createCompliantAudit();
		data.ppeHazardControls.ppeCorrectlyUsed = 'no'; // severity 2
		const result = gradeSafety(data);
		expect(result.outcome).toBe('minor');
	});

	it('returns major when a grade-3 finding is present (no critical)', () => {
		const data = createCompliantAudit();
		data.fireSafety.fireRiskAssessmentCurrent = 'no'; // severity 3
		const result = gradeSafety(data);
		expect(result.outcome).toBe('major');
	});

	it('returns critical when a grade-4 finding is present', () => {
		const data = createCompliantAudit();
		data.chemicalBiologicalHazards.coshhRegisterPresent = 'no'; // severity 4
		const result = gradeSafety(data);
		expect(result.outcome).toBe('critical');
	});

	it('tallies findings by category', () => {
		const data = createCompliantAudit();
		data.fireSafety.emergencyEgressClear = 'no'; // critical
		data.fireSafety.assemblyPointSignposted = 'no'; // minor
		const result = gradeSafety(data);
		const fire = result.findingsByCategory['Fire Safety'];
		expect(fire.critical).toBe(1);
		expect(fire.minor).toBe(1);
		expect(fire.total).toBe(8);
	});

	it('has unique rule IDs', () => {
		const ids = safetyRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Workplace Safety Flagged Issues Detection', () => {
	it('returns no flags for a fully-compliant audit', () => {
		const flags = detectAdditionalFlags(createCompliantAudit());
		expect(flags).toHaveLength(0);
	});

	it('flags missing fire-extinguisher servicing (high)', () => {
		const data = createCompliantAudit();
		data.fireSafety.fireExtinguishersServiced = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-FIRE-001')).toBe(true);
	});

	it('flags missing COSHH register (high)', () => {
		const data = createCompliantAudit();
		data.chemicalBiologicalHazards.coshhRegisterPresent = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-CHEM-002')).toBe(true);
	});

	it('flags unreported RIDDOR incidents (high)', () => {
		const data = createCompliantAudit();
		data.incidentReporting.riddorReportableIncidentsReported = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-INC-001')).toBe(true);
	});

	it('flags near-miss under-reporting when near misses < incidents', () => {
		const data = createCompliantAudit();
		data.incidentReporting.incidentsLast12Months = 5;
		data.incidentReporting.nearMissesLast12Months = 1;
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-INC-003')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const data = createCompliantAudit();
		data.fireSafety.fireExtinguishersServiced = 'no'; // high
		data.ppeHazardControls.housekeepingSatisfactory = 'no'; // low
		const flags = detectAdditionalFlags(data);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
