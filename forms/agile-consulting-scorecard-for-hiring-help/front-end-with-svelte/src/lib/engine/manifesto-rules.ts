import type { FiredRule, ManifestoItems } from './types';
import { answerToGrade, answerToPoints } from './utils';

interface ManifestoSpec {
	itemNumber: 1 | 2 | 3 | 4;
	ruleId: string;
	category: string;
	description: string;
	get: (m: ManifestoItems) => boolean | null;
}

const MANIFESTO: ManifestoSpec[] = [
	{
		itemNumber: 1,
		ruleId: 'R-MANIFESTO-1',
		category: 'individuals-and-interactions',
		description:
			'Every leader is in conversation with customers >=1 hour per week, with weekly results radiated to stakeholders.',
		get: (m) => m.m1.done,
	},
	{
		itemNumber: 2,
		ruleId: 'R-MANIFESTO-2',
		category: 'working-software',
		description: 'The team has launched a brand-new "hello world" program to production and discussed the experience.',
		get: (m) => m.m2.done,
	},
	{
		itemNumber: 3,
		ruleId: 'R-MANIFESTO-3',
		category: 'customer-collaboration',
		description:
			'The organization has bought copies of the customer\'s favourite book and shared with the team (org spend, not personal).',
		get: (m) => m.m3.done,
	},
	{
		itemNumber: 4,
		ruleId: 'R-MANIFESTO-4',
		category: 'responding-to-change',
		description:
			'Every senior leader (BoD/CXO/VP/Dir) has read one agile change-management book and shared three takeaways.',
		get: (m) => m.m4.done,
	},
];

export function gradeManifesto(items: ManifestoItems): { subtotal: number; firedRules: FiredRule[] } {
	let subtotal = 0;
	const firedRules: FiredRule[] = [];
	for (const spec of MANIFESTO) {
		const answer = spec.get(items);
		const points = answerToPoints(answer);
		subtotal += points;
		firedRules.push({
			ruleId: spec.ruleId,
			instrument: 'manifesto',
			itemNumber: spec.itemNumber,
			grade: answerToGrade(answer),
			pointsAwarded: points,
			category: spec.category,
			description: spec.description,
		});
	}
	return { subtotal, firedRules };
}
