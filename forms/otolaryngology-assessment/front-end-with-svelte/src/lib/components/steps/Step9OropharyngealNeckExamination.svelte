<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.oropharyngealNeckExamination;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Oropharyngeal & Neck Examination">
	<p class="hint">Examination of the oral cavity, oropharynx, and neck.</p>

	<Field label="Oral mucosa" inputId="oralMucosa">
		<Select id="oralMucosa" label="Oral mucosa" bind:value={n.oralMucosa}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="erythematous">Erythematous</option>
			<option value="exudate">Exudate</option>
			<option value="ulcerated">Ulcerated</option>
		</Select>
	</Field>

	<Field label="Tonsils" inputId="tonsils">
		<Select id="tonsils" label="Tonsils" bind:value={n.tonsils}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="enlarged">Enlarged</option>
			<option value="absent">Absent</option>
			<option value="asymmetric">Asymmetric</option>
		</Select>
	</Field>

	<Field label="Pharynx" inputId="pharynx">
		<Select id="pharynx" label="Pharynx" bind:value={n.pharynx}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="erythematous">Erythematous</option>
			<option value="cobblestone">Cobblestone</option>
			<option value="postNasalDrip">Post-nasal drip</option>
		</Select>
	</Field>

	<Field label="Palate movement" inputId="palateMovement">
		<Select id="palateMovement" label="Palate movement" bind:value={n.palateMovement}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="asymmetric">Asymmetric</option>
			<option value="limited">Limited</option>
		</Select>
	</Field>

	<Field label="Cervical lymphadenopathy?">
		<RadioGroup label="Cervical lymphadenopathy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cervicalLymphadenopathy" value={opt.value} bind:group={n.cervicalLymphadenopathy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if n.cervicalLymphadenopathy === 'yes'}
		<Field label="Lymphadenopathy details" inputId="cervicalLymphadenopathyDetails">
			<TextAreaInput id="cervicalLymphadenopathyDetails" label="Lymphadenopathy details" rows={2} placeholder="Level, size, mobility, tenderness" bind:value={n.cervicalLymphadenopathyDetails} />
		</Field>
	{/if}

	<Field label="Thyroid enlarged?">
		<RadioGroup label="Thyroid enlarged?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="thyroidEnlarged" value={opt.value} bind:group={n.thyroidEnlarged} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Neck mass?">
		<RadioGroup label="Neck mass?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="neckMass" value={opt.value} bind:group={n.neckMass} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if n.neckMass === 'yes'}
		<Field label="Neck mass details" inputId="neckMassDetails">
			<TextAreaInput id="neckMassDetails" label="Neck mass details" rows={2} placeholder="Location, size, mobility" bind:value={n.neckMassDetails} />
		</Field>
	{/if}

	<Field label="Examination notes" inputId="oroNeckExaminationNotes">
		<TextAreaInput id="oroNeckExaminationNotes" label="Examination notes" rows={2} bind:value={n.examinationNotes} />
	</Field>
</Fieldset>
