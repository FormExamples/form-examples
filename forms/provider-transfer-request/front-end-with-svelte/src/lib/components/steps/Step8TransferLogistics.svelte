<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateTimeInput from '$lib/components/ui/DateTimeInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const d = assessment.data.transferLogistics;

	const transportModeOptions = [
		{ value: 'self', label: 'Self / walking' },
		{ value: 'wheelchair', label: 'Wheelchair' },
		{ value: 'stretcher', label: 'Stretcher' },
		{ value: 'ambulance', label: 'Ambulance' },
		{ value: 'critical-care-transport', label: 'Critical care transport' }
	];
</script>

<Fieldset legend="Transfer Logistics">
	<p class="hint">Practical details the transport service and receiving area need.</p>

	<Field label="Transport mode" required>
		<RadioGroup label="Transport mode">
			{#each transportModeOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="transportMode" value={opt.value} bind:group={d.transportMode} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Planned departure date / time" required inputId="departureDateTime">
			<DateTimeInput id="departureDateTime" label="Planned departure date / time" required bind:value={d.departureDateTime} />
		</Field>
		<Field label="Estimated arrival date / time" inputId="estimatedArrivalDateTime">
			<DateTimeInput id="estimatedArrivalDateTime" label="Estimated arrival date / time" bind:value={d.estimatedArrivalDateTime} />
		</Field>
	</div>

	<h3 class="subsection-heading">Transport requirements</h3>
	<CheckboxGroup label="Transport requirements">
		<label class="checkbox-row">
			<CheckboxInput label="Clinical escort required" bind:checked={d.escortRequired} />
			<span>Clinical escort required</span>
		</label>
		<label class="checkbox-row">
			<CheckboxInput label="Supplemental oxygen required" bind:checked={d.oxygenRequired} />
			<span>Supplemental oxygen required</span>
		</label>
		<label class="checkbox-row">
			<CheckboxInput label="Cardiac monitoring required" bind:checked={d.cardiacMonitoringRequired} />
			<span>Cardiac monitoring required</span>
		</label>
		<label class="checkbox-row">
			<CheckboxInput label="Infectious precautions required" bind:checked={d.infectiousPrecautions} />
			<span>Infectious precautions required</span>
		</label>
		<label class="checkbox-row">
			<CheckboxInput label="Falls risk" bind:checked={d.fallsRisk} />
			<span>Falls risk</span>
		</label>
		<label class="checkbox-row">
			<CheckboxInput label="Mental Capacity Act / safeguarding concerns" bind:checked={d.mentalCapacityConcerns} />
			<span>Mental Capacity Act / safeguarding concerns</span>
		</label>
	</CheckboxGroup>

	{#if d.escortRequired}
		<Field label="Escort details" required inputId="escortDetails">
			<TextAreaInput
				id="escortDetails"
				label="Escort details"
				rows={2}
				required
				placeholder="Who is escorting, qualifications, what equipment they bring."
				bind:value={d.escortDetails}
			/>
		</Field>
	{/if}

	{#if d.infectiousPrecautions}
		<Field label="Infectious-precaution details" required inputId="infectiousPrecautionsDetails">
			<TextAreaInput
				id="infectiousPrecautionsDetails"
				label="Infectious-precaution details"
				rows={2}
				required
				placeholder="e.g. droplet precautions for influenza A; contact precautions for C. difficile."
				bind:value={d.infectiousPrecautionsDetails}
			/>
		</Field>
	{/if}

	<Field label="Equipment / lines / drains accompanying patient" inputId="equipmentRequired">
		<TextAreaInput
			id="equipmentRequired"
			label="Equipment / lines / drains accompanying patient"
			rows={3}
			placeholder="e.g. peripheral IV (right ACF), urinary catheter, NG tube on free drainage."
			bind:value={d.equipmentRequired}
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
	.subsection-heading {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
