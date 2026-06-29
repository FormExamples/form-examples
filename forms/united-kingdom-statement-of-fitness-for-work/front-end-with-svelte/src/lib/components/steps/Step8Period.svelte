<script lang="ts">
	import { store } from '$lib/stores/fitnote.svelte';
	import type { PeriodDurationUnit, PeriodType } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const d = store.data;

	const typeOptions: { value: PeriodType; label: string }[] = [
		{ value: 'duration', label: 'Duration (value + unit)' },
		{ value: 'from_to', label: 'From / to dates' }
	];

	const unitOptions: { value: PeriodDurationUnit; label: string }[] = [
		{ value: 'days', label: 'days' },
		{ value: 'weeks', label: 'weeks' },
		{ value: 'months', label: 'months' }
	];

	const isDuration = $derived(d.periodType === 'duration');
	const isFromTo = $derived(d.periodType === 'from_to');
</script>

<Fieldset legend="Period">
	<p class="hint">How long the fit note covers.</p>

	<Field label="Period type">
		<RadioGroup label="Period type">
			{#each typeOptions as opt (opt.value)}
				<label class="radio-option">
					<input
						type="radio"
						class="radio-input"
						name="periodType"
						value={opt.value}
						bind:group={d.periodType}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if isDuration}
		<div class="field-grid">
			<Field label="Duration value" inputId="period-duration-value">
				<NumberInput
					id="period-duration-value"
					label="Duration value"
					min={0}
					bind:value={d.periodDurationValue}
				/>
			</Field>
			<Field label="Duration unit">
				<RadioGroup label="Duration unit">
					{#each unitOptions as opt (opt.value)}
						<label class="radio-option">
							<input
								type="radio"
								class="radio-input"
								name="periodDurationUnit"
								value={opt.value}
								bind:group={d.periodDurationUnit}
							/>
							{opt.label}
						</label>
					{/each}
				</RadioGroup>
			</Field>
		</div>
	{/if}

	{#if isFromTo}
		<div class="field-grid">
			<Field label="From" inputId="period-from">
				<DateInput id="period-from" label="From" bind:value={d.periodFrom} />
			</Field>
			<Field label="To" inputId="period-to">
				<DateInput id="period-to" label="To" bind:value={d.periodTo} />
			</Field>
		</div>
	{/if}
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
