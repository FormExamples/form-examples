<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.woundTissueAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Wound &amp; Tissue Assessment">
	<p class="hint">Complete if the patient has an open wound or tissue defect.</p>

	<Field label="Open wound present?">
		<RadioGroup label="Open wound present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasOpenWound" value={opt.value} bind:group={d.hasOpenWound} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Wound classification" inputId="woundClassification">
		<Select id="woundClassification" label="Wound classification" bind:value={d.woundClassification}>
			<option value="">Select…</option>
			<option value="clean">Class I — Clean</option>
			<option value="clean-contaminated">Class II — Clean-contaminated</option>
			<option value="contaminated">Class III — Contaminated</option>
			<option value="dirty">Class IV — Dirty / infected</option>
		</Select>
	</Field>

	<Field label="Wound age" inputId="woundAge">
		<Select id="woundAge" label="Wound age" bind:value={d.woundAge}>
			<option value="">Select…</option>
			<option value="acute">Acute</option>
			<option value="subacute">Subacute</option>
			<option value="chronic">Chronic</option>
		</Select>
	</Field>

	<Field label="Wound aetiology" inputId="woundAetiology">
		<Select id="woundAetiology" label="Wound aetiology" bind:value={d.woundAetiology}>
			<option value="">Select…</option>
			<option value="surgical">Surgical</option>
			<option value="traumatic">Traumatic</option>
			<option value="burn">Burn</option>
			<option value="pressure">Pressure</option>
			<option value="venous">Venous</option>
			<option value="arterial">Arterial</option>
			<option value="diabetic">Diabetic</option>
			<option value="radiation">Radiation</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Wound bed tissue" inputId="woundBedTissue">
		<Select id="woundBedTissue" label="Wound bed tissue" bind:value={d.woundBedTissue}>
			<option value="">Select…</option>
			<option value="granulation">Granulation</option>
			<option value="slough">Slough</option>
			<option value="necrotic">Necrotic</option>
			<option value="epithelialising">Epithelialising</option>
			<option value="mixed">Mixed</option>
		</Select>
	</Field>

	<Field label="Wound exudate" inputId="woundExudate">
		<Select id="woundExudate" label="Wound exudate" bind:value={d.woundExudate}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="serous">Serous</option>
			<option value="sanguineous">Sanguineous</option>
			<option value="purulent">Purulent</option>
		</Select>
	</Field>

	<Field label="Signs of wound infection?">
		<RadioGroup label="Signs of wound infection?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="woundInfectionSigns" value={opt.value} bind:group={d.woundInfectionSigns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.woundInfectionSigns === 'yes'}
		<Field label="Wound infection details" inputId="woundInfectionDetails">
			<TextInput id="woundInfectionDetails" label="Wound infection details" bind:value={d.woundInfectionDetails} />
		</Field>
	{/if}

	<Field label="Tissue viability" inputId="tissueViability">
		<Select id="tissueViability" label="Tissue viability" bind:value={d.tissueViability}>
			<option value="">Select…</option>
			<option value="viable">Viable</option>
			<option value="compromised">Compromised</option>
			<option value="non-viable">Non-viable</option>
		</Select>
	</Field>

	<Field label="Surrounding skin" inputId="surroundingSkin">
		<Select id="surroundingSkin" label="Surrounding skin" bind:value={d.surroundingSkin}>
			<option value="">Select…</option>
			<option value="healthy">Healthy</option>
			<option value="erythematous">Erythematous</option>
			<option value="oedematous">Oedematous</option>
			<option value="macerated">Macerated</option>
			<option value="indurated">Indurated</option>
		</Select>
	</Field>

	<Field label="Vascular supply" inputId="vascularSupply">
		<Select id="vascularSupply" label="Vascular supply" bind:value={d.vascularSupply}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="compromised">Compromised</option>
			<option value="absent">Absent</option>
		</Select>
	</Field>

	<Field label="Sensory status" inputId="sensoryStatus">
		<Select id="sensoryStatus" label="Sensory status" bind:value={d.sensoryStatus}>
			<option value="">Select…</option>
			<option value="intact">Intact</option>
			<option value="reduced">Reduced</option>
			<option value="absent">Absent</option>
		</Select>
	</Field>

	<Field label="Previous wound treatments" inputId="previousWoundTreatments">
		<TextAreaInput id="previousWoundTreatments" label="Previous wound treatments" rows={2} bind:value={d.previousWoundTreatments} />
	</Field>
</Fieldset>
