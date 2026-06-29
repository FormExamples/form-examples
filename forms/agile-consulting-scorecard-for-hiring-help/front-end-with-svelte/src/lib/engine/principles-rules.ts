import type { FiredRule, PrinciplesItems } from './types';
import { answerToGrade, answerToPoints } from './utils';

interface PrincipleSpec {
	itemNumber: number; // 5..16 in scorecard numbering; principles 1..12
	principleNumber: number; // 1..12
	ruleId: string;
	category: string;
	description: string;
	get: (p: PrinciplesItems) => boolean | null;
}

const PRINCIPLES: PrincipleSpec[] = [
	{
		itemNumber: 5,
		principleNumber: 1,
		ruleId: 'R-PRINCIPLES-1',
		category: 'customer-satisfaction',
		description: 'Every product lead measures customer Net Promoter Score (NPS).',
		get: (p) => p.p1.done,
	},
	{
		itemNumber: 6,
		principleNumber: 2,
		ruleId: 'R-PRINCIPLES-2',
		category: 'welcome-changing-requirements',
		description:
			'The "hello world" program has been internationalized to >=1 additional language using the user locale.',
		get: (p) => p.p2.done,
	},
	{
		itemNumber: 7,
		principleNumber: 3,
		ruleId: 'R-PRINCIPLES-3',
		category: 'deliver-frequently',
		description:
			'The internationalized "hello world" version has been launched to production and verified by a native speaker.',
		get: (p) => p.p3.done,
	},
	{
		itemNumber: 8,
		principleNumber: 4,
		ruleId: 'R-PRINCIPLES-4',
		category: 'business-and-developers-together',
		description: 'Commitment is in place from every product / project / programme / practice lead.',
		get: (p) => p.p4.done,
	},
	{
		itemNumber: 9,
		principleNumber: 5,
		ruleId: 'R-PRINCIPLES-5',
		category: 'motivated-individuals',
		description:
			'A 3-amigos team (business + dev + test) has shipped a real new MVP within 30 days and on budget.',
		get: (p) => p.p5.done,
	},
	{
		itemNumber: 10,
		principleNumber: 6,
		ruleId: 'R-PRINCIPLES-6',
		category: 'face-to-face',
		description:
			'Every product owner has committed to >=50% face-to-face time (or weekly-video equivalent for remote teams).',
		get: (p) => p.p6.done,
	},
	{
		itemNumber: 11,
		principleNumber: 7,
		ruleId: 'R-PRINCIPLES-7',
		category: 'working-software-is-primary-measure',
		description: 'A new "fizz buzz" program has been created and shipped to production.',
		get: (p) => p.p7.done,
	},
	{
		itemNumber: 12,
		principleNumber: 8,
		ruleId: 'R-PRINCIPLES-8',
		category: 'sustainable-pace',
		description: 'All staff have a sustaining budget for >=1 year secured.',
		get: (p) => p.p8.done,
	},
	{
		itemNumber: 13,
		principleNumber: 9,
		ruleId: 'R-PRINCIPLES-9',
		category: 'technical-excellence',
		description: 'Quality-attribute metrics are wired into pre-commit hooks and continuous integration.',
		get: (p) => p.p9.done,
	},
	{
		itemNumber: 14,
		principleNumber: 10,
		ruleId: 'R-PRINCIPLES-10',
		category: 'simplicity',
		description:
			'Every product team has >=2 people with process-improvement skills (Lean / Six Sigma / VSM / TPS / TPC).',
		get: (p) => p.p10.done,
	},
	{
		itemNumber: 15,
		principleNumber: 11,
		ruleId: 'R-PRINCIPLES-11',
		category: 'self-organizing-teams',
		description: 'A 5-point Likert "our team is self-organizing" averages "Agree" or better.',
		get: (p) => p.p11.done,
	},
	{
		itemNumber: 16,
		principleNumber: 12,
		ruleId: 'R-PRINCIPLES-12',
		category: 'reflection',
		description: 'Every leader has shared their previous 2 retrospectives with all stakeholders.',
		get: (p) => p.p12.done,
	},
];

export function gradePrinciples(items: PrinciplesItems): { subtotal: number; firedRules: FiredRule[] } {
	let subtotal = 0;
	const firedRules: FiredRule[] = [];
	for (const spec of PRINCIPLES) {
		const answer = spec.get(items);
		const points = answerToPoints(answer);
		subtotal += points;
		firedRules.push({
			ruleId: spec.ruleId,
			instrument: 'principles',
			itemNumber: spec.itemNumber,
			grade: answerToGrade(answer),
			pointsAwarded: points,
			category: spec.category,
			description: spec.description,
		});
	}
	return { subtotal, firedRules };
}
