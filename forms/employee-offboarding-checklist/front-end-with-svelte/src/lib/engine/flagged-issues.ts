// Flagged-issue detection for HR / line-managers. Independent of the rule
// engine and the headline outcome, this module raises priority alerts about
// safety-, security-, and contract-critical offboarding items.
//
// Priority bands:
//   high   — Access not revoked, equipment not returned, no NDA reaffirmation
//            when confidentiality required, unauthorised data download.
//   medium — Knowledge transfer incomplete, no exit interview, payroll
//            details outstanding.
//   low    — Forwarding address missing, references position undeclared.

import type { AssessmentData, AdditionalFlag } from './types';

export function detectAdditionalFlags(data: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ─── Unauthorised data download (HIGH) ──────────────────────
	if (data.accessRevocation.unauthorisedDownloadDetected === 'yes') {
		flags.push({
			id: 'FLAG-AC-001',
			category: 'Access Revocation',
			message:
				'Unauthorised data download detected during offboarding audit - escalate to data protection officer',
			priority: 'high'
		});
	}

	// ─── Access not revoked (HIGH) ──────────────────────────────
	const accessItems = [
		{ field: data.accessRevocation.emailRevoked, name: 'Email' },
		{ field: data.accessRevocation.ehrEprRevoked, name: 'EHR / EPR' },
		{ field: data.accessRevocation.vpnRevoked, name: 'VPN' },
		{ field: data.accessRevocation.activeDirectoryDisabled, name: 'Active Directory' },
		{ field: data.accessRevocation.buildingAccessRevoked, name: 'Building access' },
		{ field: data.accessRevocation.cloudAppsRevoked, name: 'Cloud apps' }
	];
	const outstandingAccess = accessItems.filter((a) => a.field !== 'yes');
	if (outstandingAccess.length > 0) {
		flags.push({
			id: 'FLAG-AC-002',
			category: 'Access Revocation',
			message: `${outstandingAccess.length} access channel(s) not yet revoked: ${outstandingAccess.map((a) => a.name).join(', ')} - SECURITY RISK`,
			priority: 'high'
		});
	}

	// ─── Data download audit not performed (HIGH) ───────────────
	if (data.accessRevocation.dataDownloadAuditPerformed !== 'yes') {
		flags.push({
			id: 'FLAG-AC-003',
			category: 'Access Revocation',
			message: 'Data download / export audit not performed before access revocation',
			priority: 'high'
		});
	}

	// ─── Equipment not returned (HIGH) ──────────────────────────
	const equipItems = [
		{ field: data.equipmentReturn.laptopReturned, name: 'Laptop' },
		{ field: data.equipmentReturn.mobilePhoneReturned, name: 'Mobile phone' },
		{ field: data.equipmentReturn.idBadgeReturned, name: 'ID badge' },
		{ field: data.equipmentReturn.keysReturned, name: 'Keys' }
	];
	const outstandingEquip = equipItems.filter((e) => e.field !== 'yes' && e.field !== 'na');
	if (outstandingEquip.length > 0) {
		flags.push({
			id: 'FLAG-EQ-001',
			category: 'Equipment Return',
			message: `${outstandingEquip.length} item(s) of equipment not returned: ${outstandingEquip.map((e) => e.name).join(', ')}`,
			priority: 'high'
		});
	}

	// ─── No NDA reaffirmation (HIGH) ────────────────────────────
	if (data.nonDisclosurePostEmployment.confidentialityReaffirmed !== 'yes') {
		flags.push({
			id: 'FLAG-NDA-001',
			category: 'Non-Disclosure & Post-Employment',
			message: 'Confidentiality / NDA not reaffirmed - patient data and trade secrets at risk',
			priority: 'high'
		});
	}

	// ─── Data not returned/destroyed (HIGH) ─────────────────────
	if (data.nonDisclosurePostEmployment.dataReturnedOrDestroyed !== 'yes') {
		flags.push({
			id: 'FLAG-NDA-002',
			category: 'Non-Disclosure & Post-Employment',
			message: 'Organisational data not yet returned or destroyed',
			priority: 'high'
		});
	}

	// ─── Knowledge transfer incomplete (MEDIUM) ─────────────────
	const ktItems = [
		data.knowledgeTransfer.successorIdentified,
		data.knowledgeTransfer.handoverDocumentCreated,
		data.knowledgeTransfer.workInProgressDocumented,
		data.knowledgeTransfer.clinicalCaseloadReassigned
	];
	const ktOutstanding = ktItems.filter((v) => v !== 'yes').length;
	if (ktOutstanding > 0) {
		flags.push({
			id: 'FLAG-KT-001',
			category: 'Knowledge Transfer',
			message: `Knowledge transfer incomplete (${ktOutstanding} item(s) outstanding) - service continuity at risk`,
			priority: 'medium'
		});
	}

	// ─── No exit interview (MEDIUM) ─────────────────────────────
	if (data.exitInterview.interviewCompleted !== 'yes') {
		flags.push({
			id: 'FLAG-EXI-001',
			category: 'Exit Interview',
			message: 'Exit interview not completed - feedback opportunity missed',
			priority: 'medium'
		});
	}

	// ─── Payroll details outstanding (MEDIUM) ───────────────────
	const payItems = [
		data.finalPayrollBenefits.finalSalaryCalculated,
		data.finalPayrollBenefits.accruedHolidayPaid,
		data.finalPayrollBenefits.p45Issued
	];
	const payOutstanding = payItems.filter((v) => v !== 'yes').length;
	if (payOutstanding > 0) {
		flags.push({
			id: 'FLAG-PAY-001',
			category: 'Final Payroll & Benefits',
			message: `Payroll items outstanding (${payOutstanding}) - final salary, holiday pay, or P45 not yet issued`,
			priority: 'medium'
		});
	}

	// ─── Forwarding address missing (LOW) ───────────────────────
	if (
		!data.forwardingDetails.forwardingAddressLine1.trim() ||
		!data.forwardingDetails.forwardingPostcode.trim()
	) {
		flags.push({
			id: 'FLAG-FWD-001',
			category: 'Forwarding Details',
			message:
				'Forwarding address not recorded - P60 / future correspondence may not reach employee',
			priority: 'low'
		});
	}

	// ─── References position not declared (LOW) ─────────────────
	if (data.referencesRecommendations.referenceConsentGiven === '') {
		flags.push({
			id: 'FLAG-REF-001',
			category: 'References & Recommendations',
			message:
				'Employee position on references not declared (consent neither given nor declined)',
			priority: 'low'
		});
	}

	// Sort: high > medium > low
	const priorityOrder = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
