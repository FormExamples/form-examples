<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculatePaduaGrade } from '$lib/engine/padua-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const mb = assessment.data.metabolic;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const subtotal = $derived(() => {
		const fp = calculatePaduaGrade(assessment.data).factorPoints;
		return (fp.obesity ?? 0) + (fp.ongoingHormonalTreatment ?? 0);
	});
</script>

<Fieldset legend="Step 6 of 8 — Metabolic and treatment factors">
	<p class="hint">Obesity (BMI &ge; 30) and ongoing hormonal treatment each score 1 point.</p>

	<Field
		label="Body mass index (BMI, kg/m²)"
		description="Factor 10 — scores 1 point when BMI is 30 kg/m² or over."
		inputId="metabolic-bodyMassIndex"
	>
		<NumberInput
			id="metabolic-bodyMassIndex"
			label="Body mass index"
			min={10}
			max={80}
			step={0.1}
			bind:value={mb.bodyMassIndex}
		/>
	</Field>

	<Field label="Ongoing hormonal treatment?">
		<p class="hint">Factor 11 — 1 point when present.</p>
		<RadioGroup label="Ongoing hormonal treatment?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="metabolic-ongoingHormonalTreatment"
						value={opt.value}
						bind:group={mb.ongoingHormonalTreatment}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Metabolic and treatment factor points">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(subtotal())}"
		>
			{subtotal()} {subtotal() === 1 ? 'point' : 'points'}
		</span>
	</Field>
</Fieldset>
