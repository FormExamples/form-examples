<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;

	const noTrialLength = $derived(d.trialPeriod && (d.trialPeriodWeeks === null || d.trialPeriodWeeks === 0));
</script>

<Fieldset legend="5. Trial &amp; Review">
	<p class="hint">
		ACAS advises trying adjustments and reviewing them regularly. Record the trial period, the review
		date, and when the adjustments take effect.
	</p>

	<Field label="Trial period">
		<CheckboxGroup label="Trial period">
			<label>
				<CheckboxInput
					label="The agreed adjustments are being tried for a time-limited trial period"
					bind:checked={d.trialPeriod}
				/> The agreed adjustments are being tried for a time-limited trial period
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.trialPeriod}
		<Field
			label="Trial length (weeks)"
			inputId="trialPeriodWeeks"
			description="Length of the trial period in weeks (0–104)."
		>
			<NumberInput
				id="trialPeriodWeeks"
				label="Trial length (weeks)"
				min={0}
				max={104}
				step={1}
				bind:value={d.trialPeriodWeeks}
			/>
		</Field>
	{/if}

	<Field label="Review scheduled">
		<CheckboxGroup label="Review scheduled">
			<label>
				<CheckboxInput
					label="A review of the adjustments has been scheduled"
					bind:checked={d.reviewScheduled}
				/> A review of the adjustments has been scheduled
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.reviewScheduled}
		<Field label="Review date" inputId="reviewDate">
			<DateInput id="reviewDate" label="Review date" bind:value={d.reviewDate} />
		</Field>
	{/if}

	<Field
		label="Effective date"
		inputId="effectiveDate"
		description="Date the agreed adjustments take effect."
	>
		<DateInput id="effectiveDate" label="Effective date" bind:value={d.effectiveDate} />
	</Field>

	{#if noTrialLength}
		<Alert type="warning" heading="Trial length missing">
			<p>A trial is marked but no trial length is set. Set a trial length and a review date.</p>
		</Alert>
	{/if}
</Fieldset>
