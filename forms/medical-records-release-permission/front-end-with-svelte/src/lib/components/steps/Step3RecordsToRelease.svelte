<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { recordTypeOptions } from '#lib/engine/validation-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.recordsToRelease;

	const dateRangeOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No - Include all available records' }
	];
</script>

<Fieldset legend="Records to Release">
	<p class="hint">Select the types of medical records to be released.</p>

	<Field label="Record Types">
		<CheckboxGroup label="Record Types">
			{#each recordTypeOptions as opt (opt.value)}
				<label>
					<input
						type="checkbox"
						class="checkbox-input"
						value={opt.value}
						bind:group={r.recordTypes}
					/>
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<Field label="Limit to a specific date range?">
		<RadioGroup label="Limit to a specific date range?">
			{#each dateRangeOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="specificDateRange"
						value={opt.value}
						bind:group={r.specificDateRange}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if r.specificDateRange === 'yes'}
		<div class="field-grid">
			<Field label="From Date" required inputId="dateFrom">
				<DateInput id="dateFrom" label="From Date" required bind:value={r.dateFrom} />
			</Field>
			<Field label="To Date" required inputId="dateTo">
				<DateInput id="dateTo" label="To Date" required bind:value={r.dateTo} />
			</Field>
		</div>
	{/if}

	<Field label="Specific record details (optional)" inputId="specificRecordDetails">
		<TextAreaInput
			id="specificRecordDetails"
			label="Specific record details"
			placeholder="If you need specific records, provide details here (e.g., specific test results, dates of visits, etc.)"
			bind:value={r.specificRecordDetails}
		/>
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
