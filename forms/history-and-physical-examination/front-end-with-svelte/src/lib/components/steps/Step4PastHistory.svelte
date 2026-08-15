<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const h = assessment.data.history;
</script>

<Fieldset legend="Step 4 of 8 — Past history, drugs and allergies">
	<p class="hint">
		Past medical / surgical history, drug history, and allergy status. Allergy status is a blocking
		requirement.
	</p>

	<Field label="Past medical and surgical history" inputId="history-pastMedicalSurgicalHistory">
		<TextAreaInput
			id="history-pastMedicalSurgicalHistory"
			label="Past medical and surgical history"
			rows={3}
			placeholder="Conditions and operations, or explicit &quot;nil&quot;."
			bind:value={h.pastMedicalSurgicalHistory}
		/>
	</Field>

	<Field label="Drug history" inputId="history-drugHistory">
		<TextAreaInput
			id="history-drugHistory"
			label="Drug history"
			rows={3}
			placeholder="Current medications, doses, and adherence."
			bind:value={h.drugHistory}
		/>
	</Field>

	<Field
		label="Allergy status"
		inputId="history-allergyStatus"
		description={'Allergies must be explicitly documented. "Not documented" (or leaving this blank) raises a blocking flag.'}
	>
		<Select id="history-allergyStatus" label="Allergy status" bind:value={h.allergyStatus}>
			<option value="">— Select —</option>
			<option value="none-known">No known drug allergies</option>
			<option value="has-allergies">Has documented allergies</option>
			<option value="not-documented">Not documented</option>
		</Select>
	</Field>

	{#if h.allergyStatus === 'has-allergies'}
		<Field label="Allergy detail (substance and reaction)" inputId="history-allergyDetail">
			<TextAreaInput
				id="history-allergyDetail"
				label="Allergy detail (substance and reaction)"
				rows={2}
				placeholder="e.g. Penicillin — anaphylaxis; contrast — urticaria."
				bind:value={h.allergyDetail}
			/>
		</Field>
	{/if}
</Fieldset>
