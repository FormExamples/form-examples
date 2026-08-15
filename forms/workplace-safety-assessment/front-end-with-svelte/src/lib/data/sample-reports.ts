import type { AssessmentData, Outcome } from '#lib/engine/types.js';
import { gradeSafety } from '#lib/engine/safety-grader.js';
import { countFindings } from '#lib/engine/utils.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	siteName: string;
	auditDate: string;
	data: AssessmentData;
}

/** A row in the safety dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	siteName: string;
	auditDate: string;
	outcome: Outcome;
	findingCount: number;
	criticalCount: number;
	riddorFlag: boolean;
	flagCount: number;
}

/** Start every sample from a fully-compliant audit, then introduce findings. */
function compliantBase(): AssessmentData {
	const d = createDefaultAssessment();
	const safe: Record<keyof AssessmentData, Record<string, unknown>> = {
		siteDetails: { previousFindingsClosed: 'yes' },
		ppeHazardControls: {
			ppeAvailable: 'yes',
			ppeCorrectlyUsed: 'yes',
			ppeStockMaintained: 'yes',
			hazardSignageVisible: 'yes',
			signageLegible: 'yes',
			housekeepingSatisfactory: 'yes',
			slipTripHazardsControlled: 'yes'
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
			biologicalRiskAssessmentCurrent: 'yes'
		},
		electricalSafety: {
			patTestingInDate: 'yes',
			fixedWiringTestInDate: 'yes',
			damagedEquipmentObserved: 'no',
			overloadedSocketsObserved: 'no',
			extensionLeadsManagedSafely: 'yes',
			consumerUnitAccessible: 'yes'
		},
		fireSafety: {
			fireRiskAssessmentCurrent: 'yes',
			fireExtinguishersServiced: 'yes',
			fireExtinguishersAccessible: 'yes',
			fireAlarmTestedWeekly: 'yes',
			emergencyEgressClear: 'yes',
			emergencyLightingFunctional: 'yes',
			fireDoorsHeldOpenIllegally: 'no',
			assemblyPointSignposted: 'yes'
		},
		ergonomicsManualHandling: {
			manualHandlingAssessmentCurrent: 'yes',
			liftingAidsAvailable: 'yes',
			dseAssessmentsCompleted: 'yes',
			workstationsAdjustable: 'yes',
			repetitiveStrainConcerns: 'no',
			patientHandlingPlansInPlace: 'yes'
		},
		emergencyProcedures: {
			evacuationProcedurePosted: 'yes',
			firstAidKitsStocked: 'yes',
			firstAiderRosterCurrent: 'yes',
			aedAvailable: 'yes',
			aedServiceInDate: 'yes',
			emergencyContactsDisplayed: 'yes',
			drillConductedLast12Months: 'yes'
		},
		trainingCompetence: {
			mandatoryTrainingUpToDate: 'yes',
			fireMarshalsTrained: 'yes',
			manualHandlingTrainingCurrent: 'yes',
			infectionControlTrainingCurrent: 'yes',
			trainingRecordsAccessible: 'yes',
			inductionForNewStartersCompleted: 'yes'
		},
		incidentReporting: {
			incidentReportingSystemUsed: 'yes',
			riddorReportableIncidentsReported: 'yes',
			nearMissReportingActive: 'yes',
			lessonsLearnedShared: 'yes',
			actionsFromIncidentsTracked: 'yes'
		},
		signoffActionPlan: { debriefDelivered: 'yes' }
	};
	for (const section of Object.keys(safe) as (keyof AssessmentData)[]) {
		Object.assign(d[section] as unknown as Record<string, unknown>, safe[section]);
	}
	return d;
}

/** Compliant: every control in place. */
function compliant(): AssessmentData {
	const d = compliantBase();
	Object.assign(d.siteDetails, {
		auditorName: 'Alex Auditor',
		auditorRole: 'Health & Safety Lead',
		auditDate: '2026-06-10',
		siteName: 'Riverside Health Centre',
		departmentArea: 'Outpatients',
		siteManager: 'Sam Manager'
	});
	Object.assign(d.incidentReporting, { incidentsLast12Months: 1, nearMissesLast12Months: 14 });
	return d;
}

/** Minor findings: only low-severity (grade 2) gaps. */
function minor(): AssessmentData {
	const d = compliantBase();
	Object.assign(d.siteDetails, {
		auditorName: 'Bola Adeyemi',
		auditorRole: 'Facilities Officer',
		auditDate: '2026-06-12',
		siteName: 'Northgate Dental Practice',
		departmentArea: 'Reception & surgery',
		siteManager: 'Dana Price'
	});
	d.ppeHazardControls.housekeepingSatisfactory = 'no'; // grade 2
	d.ergonomicsManualHandling.dseAssessmentsCompleted = 'no'; // grade 2
	Object.assign(d.incidentReporting, { incidentsLast12Months: 2, nearMissesLast12Months: 18 });
	return d;
}

/** Major findings: at least one grade-3 gap, no critical. */
function major(): AssessmentData {
	const d = compliantBase();
	Object.assign(d.siteDetails, {
		auditorName: 'Carmen Ortiz',
		auditorRole: 'Estates Manager',
		auditDate: '2026-06-15',
		siteName: 'Parkside Community Hospital',
		departmentArea: 'Ward 4',
		siteManager: 'Lee Brennan'
	});
	d.fireSafety.fireRiskAssessmentCurrent = 'no'; // grade 3
	d.electricalSafety.patTestingInDate = 'no'; // grade 3
	d.trainingCompetence.mandatoryTrainingUpToDate = 'no'; // grade 3 + flag
	Object.assign(d.incidentReporting, { incidentsLast12Months: 3, nearMissesLast12Months: 9 });
	return d;
}

/** Critical findings: at least one grade-4 gap requiring immediate action. */
function critical(): AssessmentData {
	const d = compliantBase();
	Object.assign(d.siteDetails, {
		auditorName: 'Derek Fowler',
		auditorRole: 'Regional H&S Auditor',
		auditDate: '2026-06-18',
		siteName: 'Eastview Care Home',
		departmentArea: 'Whole site',
		siteManager: 'Morgan Webb'
	});
	d.chemicalBiologicalHazards.coshhRegisterPresent = 'no'; // grade 4 + flag
	d.fireSafety.emergencyEgressClear = 'no'; // grade 4 + flag
	d.electricalSafety.damagedEquipmentObserved = 'yes'; // grade 4 + flag
	d.incidentReporting.riddorReportableIncidentsReported = 'no'; // grade 4 + flag
	Object.assign(d.incidentReporting, { incidentsLast12Months: 6, nearMissesLast12Months: 2 });
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'WS-2026-0001', siteName: 'Riverside Health Centre', auditDate: '2026-06-10', data: compliant() },
	{ id: 'WS-2026-0002', siteName: 'Northgate Dental Practice', auditDate: '2026-06-12', data: minor() },
	{ id: 'WS-2026-0003', siteName: 'Parkside Community Hospital', auditDate: '2026-06-15', data: major() },
	{ id: 'WS-2026-0004', siteName: 'Eastview Care Home', auditDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeSafety(s.data);
	const criticalCount = g.firedRules.filter((r) => r.grade === 4).length;
	return {
		id: s.id,
		siteName: s.siteName,
		auditDate: s.auditDate,
		outcome: g.outcome,
		findingCount: countFindings(g.firedRules),
		criticalCount,
		riddorFlag: s.data.incidentReporting.riddorReportableIncidentsReported === 'no',
		flagCount: g.additionalFlags.length
	};
});
