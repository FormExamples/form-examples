import type { AssessmentData, IPSRule } from './types';

// IPS section-population rules.
//
// Each rule reports whether the corresponding IPS section is "populated"
// (has at least one usable entry / required scalars filled) or "empty".
// Mandatory sections drive the Complete / Partial / Incomplete grading;
// optional sections do not affect grading but are tracked in the per-section
// audit table.
//
// IPS-001 .. IPS-008  Mandatory sections (ISO 27269 / FHIR IPS IG)
// IPS-009 .. IPS-010  Optional sections

/** Patient demographics is "populated" only when the IPS-required
 *  identifiers are present: a name, a date of birth, and a sex code. */
export function demographicsPopulated(d: AssessmentData): boolean {
	const p = d.patientDemographics;
	const hasName = p.givenName.trim() !== '' && p.familyName.trim() !== '';
	return hasName && p.dateOfBirth.trim() !== '' && p.sex.trim() !== '';
}

/** Problem list: at least one row with a non-empty description. */
export function problemListPopulated(d: AssessmentData): boolean {
	return d.problemList.some((p) => p.description.trim() !== '');
}

/** Medications: at least one row with a non-empty name. */
export function medicationsPopulated(d: AssessmentData): boolean {
	return d.medicationSummary.some((m) => m.name.trim() !== '');
}

/** Allergies: at least one row with a recorded substance (or a
 *  "no known allergies" marker entered as a substance). */
export function allergiesPopulated(d: AssessmentData): boolean {
	return d.allergiesIntolerances.some((a) => a.substance.trim() !== '');
}

/** Immunisations: at least one row with a non-empty vaccine name. */
export function immunisationsPopulated(d: AssessmentData): boolean {
	return d.immunisations.some((i) => i.vaccine.trim() !== '');
}

/** Procedures: at least one row with a non-empty description. */
export function proceduresPopulated(d: AssessmentData): boolean {
	return d.procedures.some((p) => p.description.trim() !== '');
}

/** Results & investigations: at least one row with a test name. */
export function resultsPopulated(d: AssessmentData): boolean {
	return d.resultsInvestigations.some((r) => r.testName.trim() !== '');
}

/** Medical devices (optional): at least one row with a description. */
export function devicesPopulated(d: AssessmentData): boolean {
	return d.medicalDevices.some((dv) => dv.description.trim() !== '');
}

/** Advance directives (optional): at least one of the three yes/no signals
 *  has been answered, OR free-text notes provided. */
export function advanceDirectivesPopulated(d: AssessmentData): boolean {
	const a = d.advanceDirectives;
	return (
		a.dnrInPlace !== '' ||
		a.livingWillInPlace !== '' ||
		a.consentToShareEu !== '' ||
		a.directiveNotes.trim() !== ''
	);
}

/** Authoring clinician: name, role, organisation, and signoff status. */
export function authoringClinicianPopulated(d: AssessmentData): boolean {
	const c = d.authoringClinician;
	return (
		c.clinicianName.trim() !== '' &&
		c.clinicianRole.trim() !== '' &&
		c.organisation.trim() !== '' &&
		c.authoringStatus.trim() !== ''
	);
}

/** Section-population checkers, keyed by section name, used by the progress UI. */
export const sectionPopulationCheckers: Record<string, (d: AssessmentData) => boolean> = {
	patientDemographics: demographicsPopulated,
	problemList: problemListPopulated,
	medicationSummary: medicationsPopulated,
	allergiesIntolerances: allergiesPopulated,
	immunisations: immunisationsPopulated,
	procedures: proceduresPopulated,
	resultsInvestigations: resultsPopulated,
	medicalDevices: devicesPopulated,
	advanceDirectives: advanceDirectivesPopulated,
	authoringClinician: authoringClinicianPopulated
};

/**
 * The IPS section-population rules. Eight mandatory sections drive the
 * Complete / Partial / Incomplete grade; two optional sections are tracked
 * in the audit table but do not block grading.
 */
export const ipsRules: IPSRule[] = [
	{
		id: 'IPS-001',
		category: 'Patient Demographics',
		description: 'Identifying patient details (name, DOB, sex) populated.',
		mandatory: true,
		evaluate: (d) => (demographicsPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-002',
		category: 'Problem List',
		description: 'At least one problem (active or past) recorded.',
		mandatory: true,
		evaluate: (d) => (problemListPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-003',
		category: 'Medication Summary',
		description: 'At least one current or recent medication recorded.',
		mandatory: true,
		evaluate: (d) => (medicationsPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-004',
		category: 'Allergies & Intolerances',
		description: 'Allergies recorded, including "no known allergies" marker if applicable.',
		mandatory: true,
		evaluate: (d) => (allergiesPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-005',
		category: 'Immunisations',
		description: 'At least one immunisation recorded.',
		mandatory: true,
		evaluate: (d) => (immunisationsPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-006',
		category: 'Procedures',
		description: 'At least one procedure recorded.',
		mandatory: true,
		evaluate: (d) => (proceduresPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-007',
		category: 'Results & Investigations',
		description: 'At least one diagnostic result or investigation recorded.',
		mandatory: true,
		evaluate: (d) => (resultsPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-008',
		category: 'Authoring Clinician',
		description: 'Authoring clinician identified and signoff status set.',
		mandatory: true,
		evaluate: (d) => (authoringClinicianPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-009',
		category: 'Medical Devices / Implants',
		description: 'Medical devices recorded (optional).',
		mandatory: false,
		evaluate: (d) => (devicesPopulated(d) ? 'ok' : 'empty')
	},
	{
		id: 'IPS-010',
		category: 'Advance Directives & Consent',
		description: 'Advance directives or cross-border consent recorded (optional).',
		mandatory: false,
		evaluate: (d) => (advanceDirectivesPopulated(d) ? 'ok' : 'empty')
	}
];
