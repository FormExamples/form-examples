<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { ageBandLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.identification;

	// The age band drives the normal ranges for the two rate parameters.
	const ageBands = [
		{ value: 'neonate', label: 'Neonate — 0 to <1 month (RR 40-60, HR 110-160)' },
		{ value: 'infant', label: 'Infant — 1-11 months (RR 30-50, HR 100-160)' },
		{ value: 'young-child', label: 'Young child — 1-4 years (RR 20-40, HR 90-140)' },
		{ value: 'child', label: 'Child — 5-11 years (RR 18-30, HR 70-120)' },
		{ value: 'adolescent', label: 'Adolescent — >= 12 years (RR 12-20, HR 60-100)' }
	];
</script>

<Fieldset legend="Step 2 of 7 — Patient and age band">
	<p class="hint">
		Identify the child and select the age band. The age band is chosen first because it sets the
		normal ranges used to score the respiratory rate and heart rate.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. PEWS-2026-0001"
			required
			bind:value={d.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age band"
		required
		description="Selected first — it sets the normal ranges for the respiratory rate and heart rate."
		inputId="identification-ageBand"
	>
		<Select id="identification-ageBand" label="Age band" required bind:value={d.ageBand}>
			<option value="">— Select —</option>
			{#each ageBands as band (band.value)}
				<option value={band.value}>{band.label}</option>
			{/each}
		</Select>
	</Field>

	{#if d.ageBand !== ''}
		<p class="hint">
			Rate parameters will be scored against the normal range for
			<strong>{ageBandLabel(d.ageBand)}</strong>.
		</p>
	{/if}

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={d.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
