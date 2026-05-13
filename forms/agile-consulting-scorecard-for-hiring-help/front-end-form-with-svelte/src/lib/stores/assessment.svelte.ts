import type {
	AgileConsultingScorecardAssessment,
	ChecklistItem,
	GradeResult,
} from '$lib/engine/types';
import { gradeScorecard } from '$lib/engine/score-grader';

function blankItem(): ChecklistItem {
	return { done: null, evidence: '' };
}

function createDefaultAssessment(): AgileConsultingScorecardAssessment {
	return {
		organization: {
			organizationName: '',
			legalName: '',
			sector: '',
			sizeBand: '',
			headcount: null,
			country: '',
			region: '',
			website: '',
		},
		respondent: {
			respondentName: '',
			respondentEmail: '',
			respondentPhone: '',
			role: '',
			department: '',
			seniority: '',
			timezone: '',
			preferredContact: '',
		},
		assessment: {
			assessmentDate: '',
			status: 'draft',
		},
		manifesto: {
			m1: blankItem(),
			m2: blankItem(),
			m3: blankItem(),
			m4: blankItem(),
		},
		principles: {
			p1: blankItem(), p2: blankItem(), p3: blankItem(), p4: blankItem(),
			p5: blankItem(), p6: blankItem(), p7: blankItem(), p8: blankItem(),
			p9: blankItem(), p10: blankItem(), p11: blankItem(), p12: blankItem(),
		},
	};
}

export const TOTAL_STEPS = 6;

class AssessmentStore {
	data: AgileConsultingScorecardAssessment = $state(createDefaultAssessment());
	currentStep = $state(1);
	grade: GradeResult = $derived(gradeScorecard(this.data));

	reset() {
		this.data = createDefaultAssessment();
		this.currentStep = 1;
	}

	next() {
		if (this.currentStep < TOTAL_STEPS) this.currentStep += 1;
	}

	prev() {
		if (this.currentStep > 1) this.currentStep -= 1;
	}

	goTo(step: number) {
		if (step >= 1 && step <= TOTAL_STEPS) this.currentStep = step;
	}
}

export const assessment = new AssessmentStore();
