<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { validateCertificate } from '#lib/engine/mccd-grader.js';
	import { validityClassLabel, validityClassColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.referral;
	const result = $derived(validateCertificate(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Coroner and medical-examiner referral">
	<p class="hint">
		The coroner-referral status and medical-examiner scrutiny. A met referral criterion means the
		certificate should <strong>not</strong> be issued until the coroner has considered the case. This
		records the referral status — it makes no statutory decision. The prescribed statutory certificate
		remains the definitive legal record.
	</p>

	<Field label="Referred to the coroner?" inputId="referral-referredToCoroner">
		<Select
			id="referral-referredToCoroner"
			label="Referred to the coroner?"
			bind:value={r.referredToCoroner}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Coroner-referral reason" inputId="referral-coronerReason">
		<Select id="referral-coronerReason" label="Coroner-referral reason" bind:value={r.coronerReason}>
			<option value="">— Select —</option>
			<option value="none">None — no referral criterion met</option>
			<option value="unnatural">Unnatural death</option>
			<option value="violent">Violent death</option>
			<option value="suspicious">Suspicious circumstances</option>
			<option value="unknown-cause">Cause of death unknown</option>
			<option value="industrial-disease">Industrial disease or occupational exposure</option>
			<option value="medical-procedure">Possibly due to a medical procedure, treatment, or neglect</option
			>
			<option value="custody">Death in custody or state detention</option>
			<option value="no-attending-practitioner">No attending practitioner able to certify</option>
			<option value="other">Other reportable circumstance</option>
		</Select>
	</Field>

	<Field label="Medical-examiner scrutiny status" inputId="referral-medicalExaminerStatus">
		<Select
			id="referral-medicalExaminerStatus"
			label="Medical-examiner scrutiny status"
			bind:value={r.medicalExaminerStatus}
		>
			<option value="">— Select —</option>
			<option value="scrutinised">Scrutinised by a medical examiner</option>
			<option value="discussed">Discussed with a medical examiner</option>
			<option value="pending">Scrutiny pending</option>
			<option value="not-required">Not required (coroner case)</option>
		</Select>
	</Field>

	<Field label="Certifier note" inputId="referral-certifierNote">
		<TextAreaInput
			id="referral-certifierNote"
			label="Certifier note"
			rows={4}
			placeholder="Free-text note."
			bind:value={r.certifierNote}
		/>
	</Field>

	<Field label="Live validity status">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {validityClassColor(
					result.validityClass
				)}"
			>
				{validityClassLabel(result.validityClass)}
			</span>
			<span class="text-sm text-base-content/70">
				Underlying cause: {result.underlyingCause || 'not yet derived'}
			</span>
			<span class="text-sm text-base-content/70">
				({result.flaggedIssues.length} flagged {result.flaggedIssues.length === 1 ? 'issue' : 'issues'})
			</span>
		</span>
	</Field>
</Fieldset>
