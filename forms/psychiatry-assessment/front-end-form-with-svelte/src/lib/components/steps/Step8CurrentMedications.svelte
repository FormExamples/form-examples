<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.currentMedications;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">Antipsychotics, antidepressants, mood stabilizers, anxiolytics, and others.</p>

	<Field label="Medications">
		<MedicationEntry bind:medications={c.medications} />
	</Field>

	<Field label="Side Effects" inputId="sideEffects">
		<TextAreaInput id="sideEffects" label="Side effects" rows={3} bind:value={c.sideEffects} />
	</Field>

	<Field label="Is the patient compliant with medications?">
		<RadioGroup label="Compliance">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="compliance" value={opt.value} bind:group={c.compliance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.compliance === 'no'}
		<Field label="Non-Compliance Details" inputId="complianceDetails">
			<TextAreaInput id="complianceDetails" label="Compliance details" rows={3} bind:value={c.complianceDetails} />
		</Field>
	{/if}
</Fieldset>
