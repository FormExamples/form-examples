<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.roleQualifications;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Role & Qualifications">
	<p class="hint">Role, employer, registration, and qualifications.</p>

	<Field label="Role type" required inputId="roleType">
		<Select id="roleType" label="Role type" required bind:value={r.roleType}>
			<option value="">-- Select --</option>
			<option value="paramedic">Paramedic</option>
			<option value="emt">EMT</option>
			<option value="first-aider">First Aider</option>
			<option value="advanced-paramedic">Advanced Paramedic</option>
			<option value="community-responder">Community Responder</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#if r.roleType === 'other'}
		<Field label="Role type (other)" inputId="roleTypeOther">
			<TextInput id="roleTypeOther" label="Role type (other)" bind:value={r.roleTypeOther} />
		</Field>
	{/if}

	<div class="field-grid">
		<Field label="Employer organisation" inputId="employerOrganisation">
			<TextInput id="employerOrganisation" label="Employer organisation" bind:value={r.employerOrganisation} />
		</Field>
		<Field label="Station / base" inputId="stationBase">
			<TextInput id="stationBase" label="Station / base" bind:value={r.stationBase} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Years of service" inputId="yearsOfService">
			<NumberInput id="yearsOfService" label="Years of service" min={0} max={60} bind:value={r.yearsOfService} />
		</Field>
		<Field label="Registration number" inputId="registrationNumber">
			<TextInput id="registrationNumber" label="Registration number" bind:value={r.registrationNumber} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Registration body" inputId="registrationBody">
			<Select id="registrationBody" label="Registration body" bind:value={r.registrationBody}>
				<option value="">-- Select --</option>
				<option value="hcpc">HCPC</option>
				<option value="jrcalc">JRCALC</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Registration expiry date" inputId="registrationExpiryDate">
			<DateInput id="registrationExpiryDate" label="Registration expiry date" bind:value={r.registrationExpiryDate} />
		</Field>
	</div>

	<Field label="Highest qualification" inputId="highestQualification">
		<Select id="highestQualification" label="Highest qualification" bind:value={r.highestQualification}>
			<option value="">-- Select --</option>
			<option value="certificate">Certificate</option>
			<option value="diploma">Diploma</option>
			<option value="foundation-degree">Foundation Degree</option>
			<option value="bachelors">Bachelor's</option>
			<option value="masters">Master's</option>
			<option value="doctorate">Doctorate</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Qualification details" inputId="qualificationDetails">
		<TextInput id="qualificationDetails" label="Qualification details" bind:value={r.qualificationDetails} />
	</Field>

	<div class="field-grid">
		<Field label="Driving licence category" inputId="drivingLicenceCategory">
			<Select id="drivingLicenceCategory" label="Driving licence category" bind:value={r.drivingLicenceCategory}>
				<option value="">-- Select --</option>
				<option value="c1">C1</option>
				<option value="c1e">C1E</option>
				<option value="c">C</option>
				<option value="ce">CE</option>
				<option value="b">B</option>
				<option value="none">None</option>
			</Select>
		</Field>
		<Field label="Blue-light trained?">
			<RadioGroup label="Blue-light trained?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="blueLightTrained" value={opt.value} bind:group={r.blueLightTrained} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>
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
