<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const s = assessment.data.seasonalPatternHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Seasonal Pattern History">
	<p class="hint">The recurring, seasonal nature of the mood symptoms.</p>

	<Field label="Do symptoms recur at the same time each year?">
		<RadioGroup label="Do symptoms recur at the same time each year?">
			{#each yesNo as opt (opt.value)}
				<label
					><input
						type="radio"
						class="radio-input"
						name="symptomsRecurAnnually"
						value={opt.value}
						bind:group={s.symptomsRecurAnnually}
					/> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Worst months" description="e.g. Nov-Feb" inputId="worstMonths">
			<TextInput id="worstMonths" label="Worst months" placeholder="e.g. Nov-Feb" bind:value={s.worstMonths} />
		</Field>
		<Field label="Best months" description="e.g. May-Aug" inputId="bestMonths">
			<TextInput id="bestMonths" label="Best months" placeholder="e.g. May-Aug" bind:value={s.bestMonths} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Years affected" inputId="yearsAffected">
			<NumberInput id="yearsAffected" label="Years affected" min={0} max={100} bind:value={s.yearsAffected} />
		</Field>
		<Field label="Age at first onset" inputId="firstOnsetAge">
			<TextInput id="firstOnsetAge" label="Age at first onset" bind:value={s.firstOnsetAge} />
		</Field>
	</div>

	<Field label="Family history of seasonal affective disorder?">
		<RadioGroup label="Family history of seasonal affective disorder?">
			{#each yesNo as opt (opt.value)}
				<label
					><input
						type="radio"
						class="radio-input"
						name="familyHistorySad"
						value={opt.value}
						bind:group={s.familyHistorySad}
					/> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>
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
</style>
