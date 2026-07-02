<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNipeGrade } from '$lib/engine/nipe-grader';
	import { componentResultColor, componentResultLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const t = assessment.data.testes;
	const isMale = $derived(assessment.data.identification.sex === 'male');
	const grade = $derived(calculateNipeGrade(assessment.data));
</script>

<Fieldset legend="Step 7 of 9 — Testes (key component, boys)">
	<p class="hint">
		Both testes descended and palpable. Applicable only when sex is male; recorded as Not applicable
		otherwise.
	</p>

	{#if isMale}
		<Field label="Right testis" inputId="testes-testisRight">
			<Select id="testes-testisRight" label="Right testis" bind:value={t.testisRight}>
				<option value="">— Select —</option>
				<option value="descended">Descended</option>
				<option value="undescended">Undescended</option>
				<option value="not-palpable">Not palpable</option>
				<option value="not-examined">Not examined</option>
			</Select>
		</Field>

		<Field label="Left testis" inputId="testes-testisLeft">
			<Select id="testes-testisLeft" label="Left testis" bind:value={t.testisLeft}>
				<option value="">— Select —</option>
				<option value="descended">Descended</option>
				<option value="undescended">Undescended</option>
				<option value="not-palpable">Not palpable</option>
				<option value="not-examined">Not examined</option>
			</Select>
		</Field>
	{:else}
		<p class="hint">
			This component is not applicable for the recorded sex and is excluded from the overall
			outcome.
		</p>
	{/if}

	<Field label="Testes result">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {componentResultColor(
				grade.testesResult
			)}"
		>
			{componentResultLabel(grade.testesResult)}
		</span>
	</Field>
</Fieldset>
