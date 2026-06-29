<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import AppointmentEntry from '$lib/components/ui/AppointmentEntry.svelte';

	const d = assessment.data.followupArrangements;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Follow-up Arrangements">
	<p class="hint">Outpatient, GP, and pending-investigation handover.</p>

	<Field label="GP follow-up required?">
		<RadioGroup label="GP follow-up required?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="gpFollowupRequired" value={opt.value} bind:group={d.gpFollowupRequired} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.gpFollowupRequired === 'yes'}
		<Field label="GP follow-up timeframe" inputId="gpFollowupTimeframe">
			<TextInput id="gpFollowupTimeframe" label="GP follow-up timeframe" bind:value={d.gpFollowupTimeframe} placeholder="e.g. Within 7 days" />
		</Field>
	{/if}

	<Field label="Outpatient follow-up required?">
		<RadioGroup label="Outpatient follow-up required?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="outpatientFollowupRequired" value={opt.value} bind:group={d.outpatientFollowupRequired} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.outpatientFollowupRequired === 'yes'}
		<h3 class="list-heading">Scheduled appointments</h3>
		<p class="hint">Confirmed dates and clinics.</p>
		<AppointmentEntry bind:appointments={d.appointments} />
	{/if}

	<Field label="Investigations pending at discharge?">
		<RadioGroup label="Investigations pending at discharge?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="investigationsPending" value={opt.value} bind:group={d.investigationsPending} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.investigationsPending === 'yes'}
		<Field label="Pending investigation details" inputId="pendingInvestigationDetails">
			<TextAreaInput
				id="pendingInvestigationDetails"
				label="Pending investigation details"
				rows={3}
				bind:value={d.pendingInvestigationDetails}
				placeholder="e.g. Histology from biopsy taken on admission, awaiting MDT review."
			/>
		</Field>
		<Field label="Results to be chased by GP?">
			<RadioGroup label="Results to be chased by GP?">
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name="resultsToBeChasedByGp" value={opt.value} bind:group={d.resultsToBeChasedByGp} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>

<style>
	.list-heading {
		margin: 0.5rem 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}
</style>
