<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import * as options from '#lib/config/options.js';
	import { TOTAL_STEPS } from '#lib/config/steps.js';
	import { assess } from '#lib/engine/note-grader.js';
	import { acuityColor, acuityLabel, noteTypeLabel, statusColor, statusLabel } from '#lib/engine/utils.js';

	const s = assessment.data.signOff;

	// Live grading, so the author sees both grades before signing.
	const grade = $derived(assess(assessment.data));
</script>

<Fieldset legend={`Step 12 of ${TOTAL_STEPS} — Communication and sign-off`}>
	<p class="hint">
		Who was told what, the capacity and consent basis, and your attestation. You may override the
		computed acuity band here, but only with a reason.
	</p>

	<Field label="Family / next-of-kin communication" inputId="signOff-familyCommunication">
		<TextAreaInput
			id="signOff-familyCommunication"
			label="Family / next-of-kin communication"
			rows={3}
			placeholder="What was discussed, with whom, and when."
			bind:value={s.familyCommunication}
		/>
	</Field>

	<Field label="Patient communication" inputId="signOff-patientCommunication">
		<TextAreaInput
			id="signOff-patientCommunication"
			label="Patient communication"
			rows={3}
			bind:value={s.patientCommunication}
		/>
	</Field>

	<Field label="Team handover" inputId="signOff-teamHandover">
		<TextAreaInput id="signOff-teamHandover" label="Team handover" rows={3} bind:value={s.teamHandover} />
	</Field>

	<Field label="Consent basis" inputId="signOff-consentStatus">
		<Select id="signOff-consentStatus" label="Consent basis" bind:value={s.consentStatus}>
			<option value="">— Select —</option>
			{#each options.consentStatus as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Capacity assessed?"
		description="Required when the consent basis is lacks capacity or best interests."
		inputId="signOff-capacityAssessed"
	>
		<Select id="signOff-capacityAssessed" label="Capacity assessed?" bind:value={s.capacityAssessed}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Capacity notes" inputId="signOff-capacityNotes">
		<TextAreaInput id="signOff-capacityNotes" label="Capacity notes" rows={2} bind:value={s.capacityNotes} />
	</Field>

	<div class="readout" aria-live="polite">
		<span class="label">Live grading</span>
		<p>
			Completeness
			<Badge label={statusLabel(grade.status)} colorClass={statusColor(grade.status)} />
			<strong>{grade.completenessPercent}%</strong>
			<span class="hint">
				({grade.documentedRequired} of {grade.totalRequired} required components documented{assessment
					.data.header.noteType
					? ` for a ${noteTypeLabel(assessment.data.header.noteType).toLowerCase()}`
					: '; pick a note type on step 1 to fix the required set'})
			</span>
		</p>
		<p>
			Acuity
			<Badge label={acuityLabel(grade.acuityBand)} colorClass={acuityColor(grade.acuityBand)} />
			{#if grade.acuityOverridden}
				<span class="hint">(overridden; computed {acuityLabel(grade.computedAcuityBand)})</span>
			{/if}
			{#if grade.news2Total !== null}
				<span class="hint">NEWS2 {grade.news2Total}</span>
			{/if}
		</p>
		<p class="hint">{grade.flags.length} safety flag{grade.flags.length === 1 ? '' : 's'}</p>
	</div>

	<Field
		label="Override the computed acuity band"
		description="Optional. The computed band is kept alongside the final band so the override is visible in audit."
		inputId="signOff-authorOverrideAcuity"
	>
		<Select
			id="signOff-authorOverrideAcuity"
			label="Override the computed acuity band"
			bind:value={s.authorOverrideAcuity}
		>
			<option value="">— Select —</option>
			{#each options.acuityBand as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Reason for the override"
		description="An override without a reason is ignored."
		inputId="signOff-authorOverrideReason"
	>
		<TextAreaInput
			id="signOff-authorOverrideReason"
			label="Reason for the override"
			rows={2}
			bind:value={s.authorOverrideReason}
		/>
	</Field>

	<Field label="Attestation" inputId="signOff-attestationText">
		<TextAreaInput
			id="signOff-attestationText"
			label="Attestation"
			rows={2}
			placeholder="e.g. I confirm this entry is an accurate contemporaneous record of my review."
			bind:value={s.attestationText}
		/>
	</Field>

	<Field label="Electronic signature" inputId="signOff-electronicSignature">
		<TextInput
			id="signOff-electronicSignature"
			label="Electronic signature"
			placeholder="Type your full name to sign"
			bind:value={s.electronicSignature}
		/>
	</Field>
</Fieldset>
