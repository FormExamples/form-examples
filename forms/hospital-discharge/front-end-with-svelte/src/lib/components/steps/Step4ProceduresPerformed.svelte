<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import ProcedureEntry from '#lib/components/ui/ProcedureEntry.svelte';

	const d = assessment.data.proceduresPerformed;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Procedures Performed">
	<p class="hint">Operations, interventional procedures, or investigations during this admission.</p>

	<Field label="No procedures performed during this admission?">
		<RadioGroup label="No procedures performed during this admission?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="noProceduresPerformed"
						value={opt.value}
						bind:group={d.noProceduresPerformed}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.noProceduresPerformed !== 'yes'}
		<h3 class="list-heading">Procedures</h3>
		<p class="hint">Include date and clinician where known.</p>
		<ProcedureEntry bind:procedures={d.procedures} />
	{/if}
</Fieldset>

<style>
	.list-heading {
		margin: 0.5rem 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}
</style>
