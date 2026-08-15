<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const st = assessment.data.strengthTesting;

	const grades = [
		{ value: '0/5', label: '0/5 - No contraction' },
		{ value: '1/5', label: '1/5 - Flicker/trace of contraction' },
		{ value: '2/5', label: '2/5 - Active movement, gravity eliminated' },
		{ value: '3/5', label: '3/5 - Active movement against gravity' },
		{ value: '4/5', label: '4/5 - Active movement against some resistance' },
		{ value: '5/5', label: '5/5 - Normal power' }
	];
</script>

<Fieldset legend="Strength Testing">
	<p class="hint">Grip strength and manual muscle testing results.</p>

	<div class="field-grid">
		<Field label="Grip Strength - Left (kg)" inputId="gripStrengthLeft">
			<NumberInput id="gripStrengthLeft" label="Grip strength left" min={0} max={100} bind:value={st.gripStrengthLeft} />
		</Field>
		<Field label="Grip Strength - Right (kg)" inputId="gripStrengthRight">
			<NumberInput id="gripStrengthRight" label="Grip strength right" min={0} max={100} bind:value={st.gripStrengthRight} />
		</Field>
	</div>

	<Field label="Manual Muscle Testing Grade" inputId="manualMuscleGrade">
		<Select id="manualMuscleGrade" label="Manual muscle testing grade" bind:value={st.manualMuscleGrade}>
			<option value="">-- Select --</option>
			{#each grades as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Specific Weaknesses" inputId="specificWeaknesses">
		<TextAreaInput id="specificWeaknesses" label="Specific Weaknesses" rows={3} bind:value={st.specificWeaknesses} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid { grid-template-columns: 1fr; }
	}
</style>
