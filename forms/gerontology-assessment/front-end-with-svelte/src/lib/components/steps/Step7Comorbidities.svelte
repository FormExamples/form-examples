<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const c = assessment.data.comorbidities;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Comorbidities">
	<p class="hint">Cardiovascular, diabetes, renal, respiratory, musculoskeletal, and sensory conditions.</p>

	<Field label="Do you have any cardiovascular disease (heart disease, hypertension, heart failure)?">
		<RadioGroup label="Cardiovascular disease">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="cardiovascularDisease" value={opt.value} bind:group={c.cardiovascularDisease} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if c.cardiovascularDisease === 'yes'}
		<Field label="Cardiovascular details" inputId="cardiovascularDetails"><TextInput id="cardiovascularDetails" label="CV details" placeholder="e.g., hypertension, atrial fibrillation, heart failure" bind:value={c.cardiovascularDetails} /></Field>
	{/if}

	<Field label="Do you have diabetes?">
		<RadioGroup label="Diabetes">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="diabetes" value={opt.value} bind:group={c.diabetes} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if c.diabetes === 'yes'}
		<Field label="Diabetes control" required inputId="diabetesControl">
			<Select id="diabetesControl" label="Diabetes control" required bind:value={c.diabetesControl}>
				<option value="">-- Select --</option>
				<option value="well-controlled">Well controlled</option>
				<option value="poorly-controlled">Poorly controlled</option>
			</Select>
		</Field>
	{/if}

	<Field label="Do you have any kidney disease?">
		<RadioGroup label="Renal disease">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="renalDisease" value={opt.value} bind:group={c.renalDisease} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if c.renalDisease === 'yes'}
		<Field label="Kidney disease details" inputId="renalDetails"><TextInput id="renalDetails" label="Renal details" placeholder="e.g., CKD stage, on dialysis" bind:value={c.renalDetails} /></Field>
	{/if}

	<Field label="Do you have any respiratory disease (COPD, asthma)?">
		<RadioGroup label="Respiratory disease">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="respiratoryDisease" value={opt.value} bind:group={c.respiratoryDisease} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if c.respiratoryDisease === 'yes'}
		<Field label="Respiratory disease details" inputId="respiratoryDetails"><TextInput id="respiratoryDetails" label="Respiratory details" bind:value={c.respiratoryDetails} /></Field>
	{/if}

	<Field label="Do you have any musculoskeletal conditions (arthritis, osteoporosis)?">
		<RadioGroup label="Musculoskeletal disease">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="musculoskeletalDisease" value={opt.value} bind:group={c.musculoskeletalDisease} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if c.musculoskeletalDisease === 'yes'}
		<Field label="Musculoskeletal details" inputId="musculoskeletalDetails"><TextInput id="musculoskeletalDetails" label="Musculoskeletal details" bind:value={c.musculoskeletalDetails} /></Field>
	{/if}

	<Field label="Do you have any visual deficit?">
		<RadioGroup label="Visual deficit">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="visualDeficit" value={opt.value} bind:group={c.visualDeficit} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Do you have any hearing deficit?">
		<RadioGroup label="Hearing deficit">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hearingDeficit" value={opt.value} bind:group={c.hearingDeficit} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
</Fieldset>
