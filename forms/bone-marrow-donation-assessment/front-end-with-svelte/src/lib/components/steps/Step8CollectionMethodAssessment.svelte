<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const d = assessment.data.collectionMethodAssessment;
</script>

<Fieldset legend="Collection Method Assessment">
	<p class="hint">PBSC apheresis vs bone marrow harvest planning.</p>

	<div class="grid grid-3">
		<Field label="Preferred Method" inputId="preferredMethod">
			<Select id="preferredMethod" label="Preferred Method" bind:value={d.preferredMethod}>
				<option value="">Select…</option>
				<option value="pbsc">PBSC</option>
				<option value="bone-marrow">Bone marrow</option>
				<option value="either">Either</option>
			</Select>
		</Field>
		<Field label="Recipient Preference" inputId="recipientPreference">
			<Select id="recipientPreference" label="Recipient Preference" bind:value={d.recipientPreference}>
				<option value="">Select…</option>
				<option value="pbsc">PBSC</option>
				<option value="bone-marrow">Bone marrow</option>
				<option value="either">Either</option>
			</Select>
		</Field>
		<Field label="Final Collection Method" inputId="finalCollectionMethod">
			<Select id="finalCollectionMethod" label="Final Collection Method" bind:value={d.finalCollectionMethod}>
				<option value="">Select…</option>
				<option value="pbsc">PBSC</option>
				<option value="bone-marrow">Bone marrow</option>
			</Select>
		</Field>
	</div>

	<Field label="G-CSF Eligible" inputId="gcsfEligible">
		<Select id="gcsfEligible" label="G-CSF Eligible" bind:value={d.gcsfEligible}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.gcsfEligible === 'no'}
		<Field label="G-CSF Contraindications" inputId="gcsfContraindications">
			<TextInput id="gcsfContraindications" label="G-CSF Contraindications" bind:value={d.gcsfContraindications} />
		</Field>
	{/if}

	<div class="grid">
		<Field label="Venous Access Suitable for Apheresis" inputId="venousAccessSuitableForApheresis">
			<Select id="venousAccessSuitableForApheresis" label="Venous Access Suitable for Apheresis" bind:value={d.venousAccessSuitableForApheresis}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
		<Field label="Central Line Required" inputId="centralLineRequired">
			<Select id="centralLineRequired" label="Central Line Required" bind:value={d.centralLineRequired}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
	</div>

	<div class="grid grid-3">
		<Field label="Estimated Donor Weight (kg)" inputId="estimatedDonorWeightKg">
			<NumberInput id="estimatedDonorWeightKg" label="Estimated Donor Weight" min={1} max={400} bind:value={d.estimatedDonorWeightKg} />
		</Field>
		<Field label="Target CD34 Dose (×10⁶/kg)" inputId="targetCd34Dose">
			<NumberInput id="targetCd34Dose" label="Target CD34 Dose" min={0} max={50} step={0.1} bind:value={d.targetCd34Dose} />
		</Field>
		<Field label="Estimated Collection Days" inputId="estimatedCollectionDays">
			<NumberInput id="estimatedCollectionDays" label="Estimated Collection Days" min={1} max={10} bind:value={d.estimatedCollectionDays} />
		</Field>
		<Field label="Bone Marrow Harvest Volume (mL)" inputId="boneMarrowHarvestVolumeMl">
			<NumberInput id="boneMarrowHarvestVolumeMl" label="Bone Marrow Harvest Volume" min={0} max={2000} bind:value={d.boneMarrowHarvestVolumeMl} />
		</Field>
	</div>

	<Field label="Autologous Blood Donation" inputId="autologousBloodDonation">
		<Select id="autologousBloodDonation" label="Autologous Blood Donation" bind:value={d.autologousBloodDonation}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.grid.grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.grid,
		.grid.grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
