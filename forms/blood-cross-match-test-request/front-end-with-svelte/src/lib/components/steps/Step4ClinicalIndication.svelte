<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const d = assessment.data.indication;

	const indicationOptions = [
		{ value: 'surgery', label: 'Surgery' },
		{ value: 'acute-bleeding', label: 'Acute bleeding' },
		{ value: 'anaemia', label: 'Anaemia (non-bleeding)' },
		{ value: 'obstetric-haemorrhage', label: 'Obstetric haemorrhage' },
		{ value: 'chemotherapy-support', label: 'Chemotherapy support' },
		{ value: 'transfusion-dependent', label: 'Transfusion-dependent' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Step 4 of 7 · Clinical indication">
	<p class="hint">Primary indication and clinical context — drives the appropriateness axis (NICE NG24).</p>

	<Field label="Primary indication" required inputId="indication-primaryIndication">
		<Select id="indication-primaryIndication" label="Primary indication" required bind:value={d.primaryIndication}>
			<option value="">— Select —</option>
			{#each indicationOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Clinical details" required inputId="indication-clinicalDetails">
		<TextAreaInput
			id="indication-clinicalDetails"
			label="Clinical details"
			rows={3}
			required
			placeholder="e.g. Expected blood loss, bleeding source, symptomatic anaemia, planned procedure."
			bind:value={d.clinicalDetails}
		/>
	</Field>

	<div class="field-grid">
		<Field label="Current haemoglobin" description="g/L" inputId="indication-currentHaemoglobin">
			<NumberInput id="indication-currentHaemoglobin" label="Current haemoglobin" min={10} max={250} bind:value={d.currentHaemoglobin} />
		</Field>
		<Field label="Current platelet count" description="×10⁹/L" inputId="indication-currentPlatelets">
			<NumberInput id="indication-currentPlatelets" label="Current platelet count" min={0} max={1000} bind:value={d.currentPlatelets} />
		</Field>
	</div>

	<label class="bool-field">
		<CheckboxInput
			id="indication-acuteCoronarySyndrome"
			label="Acute coronary syndrome (NICE NG24 80 g/L threshold applies)"
			bind:checked={d.acuteCoronarySyndrome}
		/>
		<span>Acute coronary syndrome (NICE NG24 80 g/L threshold applies)</span>
	</label>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
