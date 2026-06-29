import { describe, it, expect } from 'vitest';
import { calculateClavienDindo } from './clavien-dindo-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { clavienDindoRules } from './clavien-dindo-rules';
import type { AssessmentData } from './types';

/**
 * Build a documented, uncomplicated report. Inlined here (rather than imported
 * from the store) so the pure engine can be tested without the SvelteKit runes
 * runtime, mirroring the gold cardiology-assessment engine test.
 */
function uncomplicated(): AssessmentData {
	return {
		patientDetails: {
			firstName: 'John',
			lastName: 'Doe',
			dateOfBirth: '1970-01-01',
			mrn: 'MRN-0001',
			sex: 'male',
			weight: 80,
			height: 178,
			asaGrade: 'I',
			allergies: 'NKDA'
		},
		procedureDetails: {
			procedureName: 'Laparoscopic appendicectomy',
			procedureCode: 'H011',
			indication: 'Acute appendicitis',
			priority: 'elective',
			surgicalApproach: 'Laparoscopic',
			laterality: 'N/A',
			dateOfSurgery: '2026-06-10',
			startTime: '09:00',
			endTime: '09:55',
			durationMinutes: 55,
			operatingRoom: 'Theatre 3'
		},
		surgicalTeam: {
			primarySurgeon: 'Mr J. Okafor',
			primarySurgeonGrade: 'Consultant',
			primaryAnaesthetist: 'Dr K. Chan',
			primaryAnaesthetistGrade: 'Consultant',
			additionalMembers: [],
			scrubNurse: '',
			circulator: ''
		},
		intraoperativeFindings: {
			findings: 'Inflamed appendix',
			procedurePerformed: 'Laparoscopic appendicectomy',
			unexpectedFindings: '',
			conversionToOpen: 'no',
			conversionReason: ''
		},
		anaesthesiaSummary: {
			anaesthesiaType: 'general',
			airwayManagement: 'ETT 7.5',
			difficultIntubation: 'no',
			airwayNotes: '',
			medicationsAdministered: '',
			reversalAgents: '',
			anaesthesiaNotes: ''
		},
		bloodLossFluidBalance: {
			estimatedBloodLossMl: 30,
			crystalloidsMl: 1000,
			colloidsMl: null,
			bloodProductsMl: null,
			bloodProductDetails: '',
			urineOutputMl: 250,
			otherDrainsMl: null,
			fluidNotes: ''
		},
		specimensImplants: {
			specimens: [],
			implants: [],
			prosthesisUsed: 'no',
			drainsPlaced: '',
			cathetersPlaced: ''
		},
		immediatePostopStatus: {
			consciousLevel: 'awake',
			systolicBp: 122,
			diastolicBp: 78,
			heartRate: 76,
			respiratoryRate: 14,
			oxygenSaturation: 99,
			temperature: 36.6,
			painScore: 2,
			painNotes: '',
			disposition: 'recovery'
		},
		complicationsAssessment: {
			complicationsOccurred: 'no',
			complications: [],
			narrative: ''
		},
		postopPlanInstructions: {
			medicationsPrescribed: '',
			antibioticPlan: '',
			thromboprophylaxis: 'LMWH 40 mg SC daily',
			analgesiaPlan: 'Multimodal analgesia',
			dietPlan: '',
			mobilisationPlan: '',
			woundCareInstructions: '',
			followUpPlan: 'Clinic in 6 weeks',
			dischargeCriteria: '',
			alertsAndEscalation: ''
		}
	};
}

describe('Clavien-Dindo grading engine', () => {
	it('returns Grade 0 for an uncomplicated procedure', () => {
		const result = calculateClavienDindo(uncomplicated());
		expect(result.overallGrade).toBe('grade-0');
		expect(result.complicationCount).toBe(0);
		expect(result.firedRules).toHaveLength(0);
	});

	it('grades a single complication at its recorded grade', () => {
		const d = uncomplicated();
		d.complicationsAssessment.complicationsOccurred = 'yes';
		d.complicationsAssessment.complications = [
			{ description: 'Wound infection', grade: 'grade-ii', interventionRequired: 'IV antibiotics', timing: 'POD 3' }
		];
		const result = calculateClavienDindo(d);
		expect(result.overallGrade).toBe('grade-ii');
		expect(result.complicationCount).toBe(1);
		expect(result.firedRules).toHaveLength(1);
	});

	it('returns the worst grade across multiple complications', () => {
		const d = uncomplicated();
		d.complicationsAssessment.complicationsOccurred = 'yes';
		d.complicationsAssessment.complications = [
			{ description: 'Nausea', grade: 'grade-i', interventionRequired: 'Antiemetic', timing: 'POD 0' },
			{ description: 'Return to theatre for bleeding', grade: 'grade-iiib', interventionRequired: 'Re-laparotomy', timing: 'POD 1' },
			{ description: 'Transfusion', grade: 'grade-ii', interventionRequired: '2 units PRBC', timing: 'POD 1' }
		];
		const result = calculateClavienDindo(d);
		expect(result.overallGrade).toBe('grade-iiib');
		expect(result.complicationCount).toBe(3);
	});

	it('skips unanswered complication grades', () => {
		const d = uncomplicated();
		d.complicationsAssessment.complicationsOccurred = 'yes';
		d.complicationsAssessment.complications = [
			{ description: 'Pending review', grade: '', interventionRequired: '', timing: '' }
		];
		const result = calculateClavienDindo(d);
		expect(result.overallGrade).toBe('grade-0');
		expect(result.complicationCount).toBe(0);
	});

	it('grades Grade V (death) as the worst possible outcome', () => {
		const d = uncomplicated();
		d.complicationsAssessment.complicationsOccurred = 'yes';
		d.complicationsAssessment.complications = [
			{ description: 'Multi-organ failure', grade: 'grade-ivb', interventionRequired: 'ICU', timing: 'POD 2' },
			{ description: 'Death', grade: 'grade-v', interventionRequired: '', timing: 'POD 4' }
		];
		const result = calculateClavienDindo(d);
		expect(result.overallGrade).toBe('grade-v');
	});

	it('has unique, well-ordered grade keys', () => {
		const keys = clavienDindoRules.map((r) => r.grade);
		expect(new Set(keys).size).toBe(keys.length);
		const orders = clavienDindoRules.map((r) => r.order);
		expect(orders).toEqual([...orders].sort((a, b) => a - b));
	});
});

describe('Post-operative flagged issues', () => {
	it('raises no clinical flags for a documented uncomplicated case', () => {
		const flags = detectAdditionalFlags(uncomplicated());
		expect(flags).toHaveLength(0);
	});

	it('flags a Grade V complication as urgent', () => {
		const d = uncomplicated();
		d.complicationsAssessment.complicationsOccurred = 'yes';
		d.complicationsAssessment.complications = [
			{ description: 'Death', grade: 'grade-v', interventionRequired: '', timing: 'POD 4' }
		];
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-CD-V' && f.priority === 'urgent')).toBe(true);
	});

	it('flags massive blood loss', () => {
		const d = uncomplicated();
		d.bloodLossFluidBalance.estimatedBloodLossMl = 2000;
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-BLOOD-MASSIVE')).toBe(true);
	});

	it('flags high ASA class and emergency priority', () => {
		const d = uncomplicated();
		d.patientDetails.asaGrade = 'IV';
		d.procedureDetails.priority = 'emergency';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-ASA-HIGH')).toBe(true);
		expect(flags.some((f) => f.id === 'FLAG-PROC-EMERGENCY')).toBe(true);
	});

	it('flags abnormal recovery vital signs', () => {
		const d = uncomplicated();
		d.immediatePostopStatus.systolicBp = 80;
		d.immediatePostopStatus.oxygenSaturation = 88;
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-VITAL-HYPOTENSION')).toBe(true);
		expect(flags.some((f) => f.id === 'FLAG-VITAL-HYPOXIA')).toBe(true);
	});

	it('flags missing critical post-op plan fields', () => {
		const d = uncomplicated();
		d.postopPlanInstructions.thromboprophylaxis = '';
		d.postopPlanInstructions.followUpPlan = '';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-PLAN-VTE')).toBe(true);
		expect(flags.some((f) => f.id === 'FLAG-PLAN-FOLLOWUP')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = uncomplicated();
		d.immediatePostopStatus.systolicBp = 80; // urgent
		d.patientDetails.asaGrade = 'III'; // medium
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		expect(priorities).toEqual([...priorities].sort((a, b) => order[a] - order[b]));
	});
});
