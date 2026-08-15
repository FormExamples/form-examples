<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Relevant medical conditions that may affect dental treatment.</p>

	<Field label="Do you have any cardiovascular disease?">
		<RadioGroup label="Cardiovascular">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cardiovascular" value={opt.value} bind:group={m.cardiovascularDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.cardiovascularDisease === 'yes'}
		<Field label="Please provide details" inputId="cardiovascularDetails">
			<TextInput id="cardiovascularDetails" label="Cardiovascular details" bind:value={m.cardiovascularDetails} />
		</Field>
	{/if}

	<Field label="Do you have diabetes?">
		<RadioGroup label="Diabetes">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diabetes" value={opt.value} bind:group={m.diabetes} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.diabetes === 'yes'}
		<Field label="Diabetes type" required inputId="diabetesType">
			<Select id="diabetesType" label="Diabetes type" required bind:value={m.diabetesType}>
				<option value="">— Select —</option>
				<option value="type1">Type 1</option>
				<option value="type2">Type 2</option>
			</Select>
		</Field>
		<Field label="Is your diabetes well controlled?">
			<RadioGroup label="Diabetes controlled">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="diabetesControlled" value={opt.value} bind:group={m.diabetesControlled} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Do you have a bleeding disorder?">
		<RadioGroup label="Bleeding disorder">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bleedingDisorder" value={opt.value} bind:group={m.bleedingDisorder} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.bleedingDisorder === 'yes'}
		<Field label="Please provide details" inputId="bleedingDetails">
			<TextInput id="bleedingDetails" label="Bleeding details" bind:value={m.bleedingDetails} />
		</Field>
	{/if}

	<Field label="Have you ever taken bisphosphonates?">
		<RadioGroup label="Bisphosphonate use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bisphosphonateUse" value={opt.value} bind:group={m.bisphosphonateUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.bisphosphonateUse === 'yes'}
		<Field label="Bisphosphonate details" inputId="bisphosphonateDetails">
			<TextInput id="bisphosphonateDetails" label="Bisphosphonate details" bind:value={m.bisphosphonateDetails} />
		</Field>
	{/if}

	<Field label="Have you had radiation therapy to the head or neck?">
		<RadioGroup label="Radiation therapy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="radiationTherapy" value={opt.value} bind:group={m.radiationTherapyHeadNeck} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.radiationTherapyHeadNeck === 'yes'}
		<Field label="Radiation therapy details" inputId="radiationDetails">
			<TextInput id="radiationDetails" label="Radiation details" bind:value={m.radiationDetails} />
		</Field>
	{/if}

	<Field label="Are you immunosuppressed?">
		<RadioGroup label="Immunosuppression">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="immunosuppression" value={opt.value} bind:group={m.immunosuppression} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.immunosuppression === 'yes'}
		<Field label="Please provide details" inputId="immunosuppressionDetails">
			<TextInput id="immunosuppressionDetails" label="Immunosuppression details" bind:value={m.immunosuppressionDetails} />
		</Field>
	{/if}
</Fieldset>
