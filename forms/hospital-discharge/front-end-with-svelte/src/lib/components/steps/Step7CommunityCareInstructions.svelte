<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.communityCareInstructions;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const referrals = [
		{ field: 'districtNurseReferral', label: 'District nurse referral?' },
		{ field: 'socialServicesReferral', label: 'Social services referral?' },
		{ field: 'physiotherapyReferral', label: 'Physiotherapy referral?' },
		{ field: 'occupationalTherapyReferral', label: 'Occupational therapy referral?' }
	] as const;
</script>

<Fieldset legend="Community Care Instructions">
	<p class="hint">Destination, ongoing care, referrals, and equipment.</p>

	<Field label="Discharge destination" required inputId="dischargeDestination">
		<Select id="dischargeDestination" label="Discharge destination" bind:value={d.dischargeDestination}>
			<option value="">— Select —</option>
			<option value="home">Own home</option>
			<option value="care-home">Care home (residential)</option>
			<option value="nursing-home">Nursing home</option>
			<option value="rehab">Rehabilitation unit</option>
			<option value="hospice">Hospice</option>
			<option value="other-hospital">Other hospital</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#if d.dischargeDestination === 'other'}
		<Field label="Other destination details" inputId="otherDestinationDetails">
			<TextInput id="otherDestinationDetails" label="Other destination details" bind:value={d.otherDestinationDetails} />
		</Field>
	{/if}

	<Field label="Care responsibility post-discharge" required inputId="careResponsibility">
		<Select id="careResponsibility" label="Care responsibility" bind:value={d.careResponsibility}>
			<option value="">— Select —</option>
			<option value="self">Self-caring</option>
			<option value="family">Family</option>
			<option value="carer">Informal carer</option>
			<option value="community-team">Community team</option>
			<option value="care-home-staff">Care-home staff</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Transport mode" inputId="transportMode">
		<Select id="transportMode" label="Transport mode" bind:value={d.transportMode}>
			<option value="">— Select —</option>
			<option value="walking">Walking / own transport</option>
			<option value="wheelchair">Wheelchair</option>
			<option value="stretcher">Stretcher</option>
			<option value="ambulance">Ambulance</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<div class="field-grid">
		{#each referrals as ref (ref.field)}
			<Field label={ref.label}>
				<RadioGroup label={ref.label}>
					{#each yesNo as opt (opt.value)}
						<label>
							<input type="radio" class="radio-input" name={ref.field} value={opt.value} bind:group={d[ref.field]} />
							{opt.label}
						</label>
					{/each}
				</RadioGroup>
			</Field>
		{/each}
	</div>

	<Field label="Package of care in place?">
		<RadioGroup label="Package of care in place?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="packageOfCareInPlace" value={opt.value} bind:group={d.packageOfCareInPlace} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Mobility status at discharge" inputId="mobilityStatus">
		<TextInput id="mobilityStatus" label="Mobility status" bind:value={d.mobilityStatus} placeholder="e.g. Independent with stick" />
	</Field>

	<Field label="Dietary requirements" inputId="dietaryRequirements">
		<TextAreaInput id="dietaryRequirements" label="Dietary requirements" rows={2} bind:value={d.dietaryRequirements} />
	</Field>

	<Field label="Wound care instructions" inputId="woundCareInstructions">
		<TextAreaInput
			id="woundCareInstructions"
			label="Wound care instructions"
			rows={2}
			bind:value={d.woundCareInstructions}
			placeholder="Dressing changes, suture removal, signs of infection…"
		/>
	</Field>

	<Field label="Equipment provided / arranged" inputId="equipmentProvided">
		<TextAreaInput
			id="equipmentProvided"
			label="Equipment provided"
			rows={2}
			bind:value={d.equipmentProvided}
			placeholder="e.g. Walking frame, hospital bed, commode"
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
