<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { SPAQ_OPTIONS } from '#lib/engine/sad-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.appetiteWeight;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Appetite & Weight Changes">
	<p class="hint">SPAQ seasonality items for appetite and weight (scored 0-4), plus eating details.</p>

	<Field label="Appetite — how much does your appetite change with the seasons?">
		<RadioGroup label="Appetite seasonal change">
			{#each SPAQ_OPTIONS as opt (opt.value)}
				<label
					><input
						type="radio"
						class="radio-input"
						name="spaqAppetite"
						value={opt.value}
						bind:group={a.spaq.appetite}
					/> {opt.value} — {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Weight — how much does your weight change with the seasons?">
		<RadioGroup label="Weight seasonal change">
			{#each SPAQ_OPTIONS as opt (opt.value)}
				<label
					><input
						type="radio"
						class="radio-input"
						name="spaqWeight"
						value={opt.value}
						bind:group={a.spaq.weight}
					/> {opt.value} — {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Marked carbohydrate craving?">
		<RadioGroup label="Carbohydrate craving">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="carbohydrateCraving" value={opt.value} bind:group={a.carbohydrateCraving} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Winter weight change (kg)" description="Positive = gain, negative = loss" inputId="winterWeightChangeKg">
		<NumberInput id="winterWeightChangeKg" label="Winter weight change in kg" step="0.1" bind:value={a.winterWeightChangeKg} />
	</Field>

	<Field label="Eating pattern changes" inputId="eatingPatternChanges">
		<TextAreaInput id="eatingPatternChanges" label="Eating pattern changes" rows={3} bind:value={a.eatingPatternChanges} />
	</Field>
</Fieldset>
