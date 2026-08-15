<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const a = assessment.data.authorizationPeriod;

	const singleUseOptions = [
		{ value: 'yes', label: 'Yes - One-time release only' },
		{ value: 'no', label: 'No - Ongoing within the authorization period' }
	];
</script>

<Fieldset legend="Authorization Period">
	<p class="hint">Specify the time period for which this authorization is valid.</p>

	<div class="field-grid">
		<Field label="Start Date" required inputId="startDate">
			<DateInput id="startDate" label="Start Date" required bind:value={a.startDate} />
		</Field>
		<Field label="End Date" required inputId="endDate">
			<DateInput id="endDate" label="End Date" required bind:value={a.endDate} />
		</Field>
	</div>

	<Field label="Is this a single-use authorization?">
		<RadioGroup label="Is this a single-use authorization?">
			{#each singleUseOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="singleUse"
						value={opt.value}
						bind:group={a.singleUse}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Alert type="info" heading="Important">
		<p>
			This authorization will automatically expire on the end date specified above. You may revoke
			this authorization at any time by contacting your healthcare provider in writing.
		</p>
	</Alert>
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
