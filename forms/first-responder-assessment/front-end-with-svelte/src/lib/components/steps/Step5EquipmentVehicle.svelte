<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.equipmentVehicle;
	const competency = [
		{ value: 'not-competent', label: 'Not Competent' },
		{ value: 'developing', label: 'Developing' },
		{ value: 'competent', label: 'Competent' },
		{ value: 'expert', label: 'Expert' }
	];
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Equipment & Vehicle Competency">
	<p class="hint">Competency operating clinical equipment and emergency vehicles.</p>

	<div class="field-grid">
		<Field label="Defibrillator competency" inputId="defibrillatorCompetency">
			<Select id="defibrillatorCompetency" label="Defibrillator competency" bind:value={e.defibrillatorCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Monitor competency" inputId="monitorCompetency">
			<Select id="monitorCompetency" label="Monitor competency" bind:value={e.monitorCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Ventilator competency" inputId="ventilatorCompetency">
			<Select id="ventilatorCompetency" label="Ventilator competency" bind:value={e.ventilatorCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Suction competency" inputId="suctionCompetency">
			<Select id="suctionCompetency" label="Suction competency" bind:value={e.suctionCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Stretcher competency" inputId="stretcherCompetency">
			<Select id="stretcherCompetency" label="Stretcher competency" bind:value={e.stretcherCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Scoop competency" inputId="scoopCompetency">
			<Select id="scoopCompetency" label="Scoop competency" bind:value={e.scoopCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Ambulance driving" inputId="ambulanceDriving">
			<Select id="ambulanceDriving" label="Ambulance driving" bind:value={e.ambulanceDriving}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Emergency driving" inputId="emergencyDriving">
			<Select id="emergencyDriving" label="Emergency driving" bind:value={e.emergencyDriving}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Equipment check competency" inputId="equipmentCheckCompetency">
			<Select id="equipmentCheckCompetency" label="Equipment check competency" bind:value={e.equipmentCheckCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Radio communications" inputId="radioCommunications">
			<Select id="radioCommunications" label="Radio communications" bind:value={e.radioCommunications}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<Field label="Completes daily vehicle inspection?">
		<RadioGroup label="Completes daily vehicle inspection?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vehicleDailyInspection" value={opt.value} bind:group={e.vehicleDailyInspection} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Equipment & vehicle notes" inputId="equipmentVehicleNotes">
		<TextAreaInput id="equipmentVehicleNotes" label="Equipment & vehicle notes" rows={3} bind:value={e.equipmentVehicleNotes} />
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
