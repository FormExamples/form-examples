<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const l = assessment.data.lifestyle;
</script>

<Fieldset legend="Step 10 of 12 — Lifestyle">
	<p class="hint">Anthropometry and the lifestyle advice given.</p>

	<Field label="BMI (kg/m²)" inputId="lifestyle-bmi">
		<NumberInput
			id="lifestyle-bmi"
			label="BMI (kg/m²)"
			min={10}
			max={80}
			step={0.1}
			placeholder="e.g. 28.6"
			bind:value={l.bmi}
		/>
	</Field>

	<Field label="Lifestyle advice given" inputId="lifestyle-lifestyleAdvice">
		<TextAreaInput
			id="lifestyle-lifestyleAdvice"
			label="Lifestyle advice given"
			rows={3}
			placeholder="Diet, exercise, alcohol, dietary salt, smoking cessation."
			bind:value={l.lifestyleAdvice}
		/>
	</Field>
</Fieldset>
