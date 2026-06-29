<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const d = assessment.data.history;

	const bloodGroupOptions = [
		{ value: 'a-pos', label: 'A RhD positive' },
		{ value: 'a-neg', label: 'A RhD negative' },
		{ value: 'b-pos', label: 'B RhD positive' },
		{ value: 'b-neg', label: 'B RhD negative' },
		{ value: 'o-pos', label: 'O RhD positive' },
		{ value: 'o-neg', label: 'O RhD negative' },
		{ value: 'ab-pos', label: 'AB RhD positive' },
		{ value: 'ab-neg', label: 'AB RhD negative' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Step 5 of 7 · Blood group & history">
	<p class="hint">ABO/Rh group, antibody status, and transfusion history.</p>

	<Field label="Patient blood group (if known)" inputId="history-patientBloodGroup">
		<Select id="history-patientBloodGroup" label="Patient blood group" bind:value={d.patientBloodGroup}>
			<option value="">— Select —</option>
			{#each bloodGroupOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<h3 class="subhead">History</h3>
	<label class="bool-field">
		<CheckboxInput id="history-knownAntibodies" label="Known red-cell alloantibodies" bind:checked={d.knownAntibodies} />
		<span>Known red-cell alloantibodies</span>
	</label>

	<Field label="Antibody detail" inputId="history-antibodyDetail">
		<TextAreaInput
			id="history-antibodyDetail"
			label="Antibody detail"
			rows={2}
			placeholder="Specificity, source, antigen-negative requirements."
			bind:value={d.antibodyDetail}
		/>
	</Field>

	<label class="bool-field">
		<CheckboxInput id="history-previousTransfusion" label="Previous transfusion" bind:checked={d.previousTransfusion} />
		<span>Previous transfusion</span>
	</label>
	<label class="bool-field">
		<CheckboxInput id="history-previousTransfusionReaction" label="Previous transfusion reaction" bind:checked={d.previousTransfusionReaction} />
		<span>Previous transfusion reaction</span>
	</label>
	<label class="bool-field">
		<CheckboxInput id="history-pregnant" label="Currently pregnant" bind:checked={d.pregnant} />
		<span>Currently pregnant</span>
	</label>
</Fieldset>

<style>
	.subhead {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
