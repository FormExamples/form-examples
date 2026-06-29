<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.medicalSurgicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medical &amp; Surgical History">
	<p class="hint">Past surgery, wound healing, and relevant comorbidities.</p>

	<Field label="Previous plastic surgery?">
		<RadioGroup label="Previous plastic surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousPlasticSurgery" value={opt.value} bind:group={d.previousPlasticSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.previousPlasticSurgery === 'yes'}
		<Field label="Previous plastic surgery details" inputId="previousPlasticSurgeryDetails">
			<TextInput id="previousPlasticSurgeryDetails" label="Previous plastic surgery details" bind:value={d.previousPlasticSurgeryDetails} />
		</Field>
	{/if}

	<Field label="Previous general surgery?">
		<RadioGroup label="Previous general surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousGeneralSurgery" value={opt.value} bind:group={d.previousGeneralSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.previousGeneralSurgery === 'yes'}
		<Field label="Previous general surgery details" inputId="previousGeneralSurgeryDetails">
			<TextInput id="previousGeneralSurgeryDetails" label="Previous general surgery details" bind:value={d.previousGeneralSurgeryDetails} />
		</Field>
	{/if}

	<Field label="History of wound healing problems?">
		<RadioGroup label="History of wound healing problems?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="woundHealingProblems" value={opt.value} bind:group={d.woundHealingProblems} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.woundHealingProblems === 'yes'}
		<Field label="Wound healing details" inputId="woundHealingDetails">
			<TextInput id="woundHealingDetails" label="Wound healing details" bind:value={d.woundHealingDetails} />
		</Field>
	{/if}

	<Field label="Keloid / hypertrophic scarring tendency?">
		<RadioGroup label="Keloid / hypertrophic scarring tendency?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="keloidScarring" value={opt.value} bind:group={d.keloidScarring} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.keloidScarring === 'yes'}
		<Field label="Scarring details" inputId="scarringDetails">
			<TextInput id="scarringDetails" label="Scarring details" bind:value={d.scarringDetails} />
		</Field>
	{/if}

	<Field label="Diabetes" inputId="diabetes">
		<Select id="diabetes" label="Diabetes" bind:value={d.diabetes}>
			<option value="">Select…</option>
			<option value="no">No</option>
			<option value="type-1">Type 1</option>
			<option value="type-2">Type 2</option>
		</Select>
	</Field>
	{#if d.diabetes === 'type-1' || d.diabetes === 'type-2'}
		<Field label="Is diabetes well controlled?">
			<RadioGroup label="Is diabetes well controlled?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="diabetesControlled" value={opt.value} bind:group={d.diabetesControlled} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Hypertension?">
		<RadioGroup label="Hypertension?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hypertension" value={opt.value} bind:group={d.hypertension} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Cardiac disease?">
		<RadioGroup label="Cardiac disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cardiacDisease" value={opt.value} bind:group={d.cardiacDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.cardiacDisease === 'yes'}
		<Field label="Cardiac disease details" inputId="cardiacDiseaseDetails">
			<TextInput id="cardiacDiseaseDetails" label="Cardiac disease details" bind:value={d.cardiacDiseaseDetails} />
		</Field>
	{/if}

	<Field label="Respiratory disease?">
		<RadioGroup label="Respiratory disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="respiratoryDisease" value={opt.value} bind:group={d.respiratoryDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.respiratoryDisease === 'yes'}
		<Field label="Respiratory disease details" inputId="respiratoryDiseaseDetails">
			<TextInput id="respiratoryDiseaseDetails" label="Respiratory disease details" bind:value={d.respiratoryDiseaseDetails} />
		</Field>
	{/if}

	<Field label="Autoimmune disease?">
		<RadioGroup label="Autoimmune disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="autoimmuneDisease" value={opt.value} bind:group={d.autoimmuneDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.autoimmuneDisease === 'yes'}
		<Field label="Autoimmune disease details" inputId="autoimmuneDiseaseDetails">
			<TextInput id="autoimmuneDiseaseDetails" label="Autoimmune disease details" bind:value={d.autoimmuneDiseaseDetails} />
		</Field>
	{/if}

	<Field label="Bleeding disorder?">
		<RadioGroup label="Bleeding disorder?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bleedingDisorder" value={opt.value} bind:group={d.bleedingDisorder} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.bleedingDisorder === 'yes'}
		<Field label="Bleeding disorder details" inputId="bleedingDisorderDetails">
			<TextInput id="bleedingDisorderDetails" label="Bleeding disorder details" bind:value={d.bleedingDisorderDetails} />
		</Field>
	{/if}

	<Field label="Immunosuppressed?">
		<RadioGroup label="Immunosuppressed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="immunosuppressed" value={opt.value} bind:group={d.immunosuppressed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.immunosuppressed === 'yes'}
		<Field label="Immunosuppression details" inputId="immunosuppressedDetails">
			<TextInput id="immunosuppressedDetails" label="Immunosuppression details" bind:value={d.immunosuppressedDetails} />
		</Field>
	{/if}

	<Field label="Cancer history?">
		<RadioGroup label="Cancer history?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cancerHistory" value={opt.value} bind:group={d.cancerHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.cancerHistory === 'yes'}
		<Field label="Cancer history details" inputId="cancerHistoryDetails">
			<TextInput id="cancerHistoryDetails" label="Cancer history details" bind:value={d.cancerHistoryDetails} />
		</Field>
	{/if}
</Fieldset>
