import type { AdditionalFlag, AgileConsultingScorecardAssessment } from './types';

// Readiness flags that fire independently of the band. Each flag identifies
// a specific gap in the organization's agile readiness that would block a
// successful consulting engagement until addressed.
export function computeFlags(data: AgileConsultingScorecardAssessment): AdditionalFlag[] {
	const out: AdditionalFlag[] = [];
	const { manifesto, principles } = data;

	// No senior leadership buy-in (manifesto item 4 false)
	if (manifesto.m4.done === false) {
		out.push({
			flagId: 'F-NO-SENIOR-LEADERSHIP-BUYIN-001',
			category: 'no-senior-leadership-buyin',
			priority: 'high',
			description:
				'Manifesto 4 not satisfied: no senior leader has read an agile change-management book and shared takeaways.',
			suggestedAction:
				'Have every BoD/CXO/VP/Director read one agile change book and present three takeaways before procurement.',
		});
	}

	// No customer contact (manifesto item 1 OR principle 1 false)
	if (manifesto.m1.done === false || principles.p1.done === false) {
		out.push({
			flagId: 'F-NO-CUSTOMER-CONTACT-001',
			category: 'no-customer-contact',
			priority: 'high',
			description:
				'Customer-contact gap: leaders are not in regular conversation with customers, or NPS is not measured.',
			suggestedAction:
				'Establish weekly customer conversations for every product lead and stand up a basic NPS measurement.',
		});
	}

	// No working software (manifesto item 2 AND principle 7 both false)
	if (manifesto.m2.done === false && principles.p7.done === false) {
		out.push({
			flagId: 'F-NO-WORKING-SOFTWARE-001',
			category: 'no-working-software',
			priority: 'high',
			description:
				'No warm-up programs shipped: neither "hello world" nor "fizz buzz" has been launched to production.',
			suggestedAction:
				'Run the warm-up exercise: ship "hello world" then "fizz buzz" to production with a real team and discuss.',
		});
	}

	// No sustainable budget (principle 8 false)
	if (principles.p8.done === false) {
		out.push({
			flagId: 'F-NO-SUSTAINABLE-BUDGET-001',
			category: 'no-sustainable-budget',
			priority: 'medium',
			description: 'Principle 8 not satisfied: less than 1 year of staff sustaining budget is secured.',
			suggestedAction:
				'Secure a 1-year sustaining budget before engaging consultants, or scope the engagement to budget.',
		});
	}

	// No self-organization (principle 11 false)
	if (principles.p11.done === false) {
		out.push({
			flagId: 'F-NO-SELF-ORGANIZATION-001',
			category: 'no-self-organization',
			priority: 'medium',
			description:
				'Principle 11 not satisfied: self-organization Likert average is below "Agree".',
			suggestedAction:
				'Run a focused self-organization improvement initiative (e.g. The Vanguard Method) before hiring agile coaches.',
		});
	}

	// No reflection culture (principle 12 false)
	if (principles.p12.done === false) {
		out.push({
			flagId: 'F-NO-REFLECTION-CULTURE-001',
			category: 'no-reflection-culture',
			priority: 'medium',
			description:
				'Principle 12 not satisfied: leaders are not running or sharing retrospectives.',
			suggestedAction:
				'Establish a regular leader-level retrospective cadence and require sharing the last two with stakeholders.',
		});
	}

	return out;
}
