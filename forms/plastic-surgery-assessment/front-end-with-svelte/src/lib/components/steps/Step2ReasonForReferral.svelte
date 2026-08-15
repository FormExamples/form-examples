<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.reasonForReferral;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Reason for Referral">
	<p class="hint">Why the patient has been referred to plastic surgery.</p>

	<Field label="Referral type" inputId="referralType">
		<Select id="referralType" label="Referral type" bind:value={d.referralType}>
			<option value="">Select…</option>
			<option value="reconstructive">Reconstructive</option>
			<option value="aesthetic">Aesthetic</option>
			<option value="trauma">Trauma</option>
			<option value="burn">Burn</option>
			<option value="congenital">Congenital</option>
			<option value="cancer">Cancer</option>
			<option value="other">Other</option>
		</Select>
	</Field>
	{#if d.referralType === 'other'}
		<Field label="Referral type (other)" inputId="referralTypeOther">
			<TextInput id="referralTypeOther" label="Referral type (other)" bind:value={d.referralTypeOther} />
		</Field>
	{/if}

	<Field label="Urgency">
		<RadioGroup label="Urgency">
			<label><input type="radio" class="radio-input" name="urgency" value="elective" bind:group={d.urgency} /> Elective</label>
			<label><input type="radio" class="radio-input" name="urgency" value="urgent" bind:group={d.urgency} /> Urgent</label>
			<label><input type="radio" class="radio-input" name="urgency" value="emergency" bind:group={d.urgency} /> Emergency</label>
		</RadioGroup>
	</Field>

	<Field label="Primary complaint" inputId="primaryComplaint">
		<TextAreaInput id="primaryComplaint" label="Primary complaint" rows={3} bind:value={d.primaryComplaint} />
	</Field>

	<Field label="Affected body area" inputId="affectedBodyArea">
		<Select id="affectedBodyArea" label="Affected body area" bind:value={d.affectedBodyArea}>
			<option value="">Select…</option>
			<option value="face">Face</option>
			<option value="head-neck">Head &amp; neck</option>
			<option value="breast">Breast</option>
			<option value="trunk">Trunk</option>
			<option value="upper-limb">Upper limb</option>
			<option value="hand">Hand</option>
			<option value="lower-limb">Lower limb</option>
			<option value="genitalia">Genitalia</option>
			<option value="multiple">Multiple</option>
			<option value="other">Other</option>
		</Select>
	</Field>
	{#if d.affectedBodyArea === 'other'}
		<Field label="Affected body area (other)" inputId="affectedBodyAreaOther">
			<TextInput id="affectedBodyAreaOther" label="Affected body area (other)" bind:value={d.affectedBodyAreaOther} />
		</Field>
	{/if}

	<Field label="Laterality" inputId="laterality">
		<Select id="laterality" label="Laterality" bind:value={d.laterality}>
			<option value="">Select…</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
			<option value="midline">Midline</option>
			<option value="n-a">N/A</option>
		</Select>
	</Field>

	<Field label="Duration of condition" inputId="durationOfCondition">
		<Select id="durationOfCondition" label="Duration of condition" bind:value={d.durationOfCondition}>
			<option value="">Select…</option>
			<option value="acute">Acute</option>
			<option value="less-1-month">Less than 1 month</option>
			<option value="1-6-months">1–6 months</option>
			<option value="6-12-months">6–12 months</option>
			<option value="greater-12-months">More than 12 months</option>
			<option value="congenital">Congenital</option>
		</Select>
	</Field>

	<Field label="Previous consultations for this condition?">
		<RadioGroup label="Previous consultations for this condition?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousConsultations" value={opt.value} bind:group={d.previousConsultations} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.previousConsultations === 'yes'}
		<Field label="Previous consultation details" inputId="previousConsultationsDetails">
			<TextAreaInput id="previousConsultationsDetails" label="Previous consultation details" rows={2} bind:value={d.previousConsultationsDetails} />
		</Field>
	{/if}
</Fieldset>
