<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.systemicConditions;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Systemic Conditions">
	<p class="hint">General health conditions relevant to eye health.</p>

	<Field label="Do you have diabetes?">
		<RadioGroup label="Diabetes">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diabetes" value={opt.value} bind:group={s.diabetes} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.diabetes === 'yes'}
		<Field label="Diabetes type" inputId="diabetesType">
			<Select id="diabetesType" label="Diabetes type" bind:value={s.diabetesType}>
				<option value="">-- Select --</option>
				<option value="type1">Type 1</option>
				<option value="type2">Type 2</option>
			</Select>
		</Field>
		<Field label="Diabetes control" inputId="diabetesControl">
			<Select id="diabetesControl" label="Diabetes control" bind:value={s.diabetesControl}>
				<option value="">-- Select --</option>
				<option value="well-controlled">Well controlled</option>
				<option value="poorly-controlled">Poorly controlled</option>
			</Select>
		</Field>
		<Field label="Has diabetic retinopathy been diagnosed?">
			<RadioGroup label="Diabetic retinopathy">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="dr" value={opt.value} bind:group={s.diabeticRetinopathy} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if s.diabeticRetinopathy === 'yes'}
			<Field label="Retinopathy stage" inputId="drStage">
				<Select id="drStage" label="Retinopathy stage" bind:value={s.diabeticRetinopathyStage}>
					<option value="">-- Select --</option>
					<option value="background">Background (non-proliferative)</option>
					<option value="pre-proliferative">Pre-proliferative</option>
					<option value="proliferative">Proliferative</option>
					<option value="maculopathy">Diabetic maculopathy</option>
				</Select>
			</Field>
		{/if}
	{/if}

	<Field label="Do you have high blood pressure (hypertension)?">
		<RadioGroup label="Hypertension">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="htn" value={opt.value} bind:group={s.hypertension} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.hypertension === 'yes'}
		<Field label="Is it well controlled?">
			<RadioGroup label="HTN controlled">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="htnCtrl" value={opt.value} bind:group={s.hypertensionControlled} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Do you have any autoimmune conditions?">
		<RadioGroup label="Autoimmune">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="autoimmune" value={opt.value} bind:group={s.autoimmune} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.autoimmune === 'yes'}
		<Field label="Please provide details" inputId="autoimmuneDetails">
			<TextAreaInput id="autoimmuneDetails" label="Autoimmune details" rows={2} placeholder="e.g. rheumatoid arthritis, lupus, sarcoidosis" bind:value={s.autoimmuneDetails} />
		</Field>
	{/if}

	<Field label="Do you have thyroid eye disease?">
		<RadioGroup label="Thyroid eye disease">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ted" value={opt.value} bind:group={s.thyroidEyeDisease} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.thyroidEyeDisease === 'yes'}
		<Field label="Thyroid eye disease details" inputId="tedDetails">
			<TextAreaInput id="tedDetails" label="TED details" rows={2} bind:value={s.thyroidEyeDiseaseDetails} />
		</Field>
	{/if}

	<Field label="Do you have any neurological conditions?">
		<RadioGroup label="Neurological">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="neuro" value={opt.value} bind:group={s.neurological} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.neurological === 'yes'}
		<Field label="Neurological condition details" inputId="neuroDetails">
			<TextAreaInput id="neuroDetails" label="Neurological details" rows={2} placeholder="e.g. MS, myasthenia gravis" bind:value={s.neurologicalDetails} />
		</Field>
	{/if}
</Fieldset>
