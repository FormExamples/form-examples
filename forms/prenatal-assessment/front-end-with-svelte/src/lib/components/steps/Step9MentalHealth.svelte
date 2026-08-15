<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.mentalHealthScreening;
	const anxietyOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const safetyOptions = [
		{ value: 'no', label: 'Yes, I feel safe' },
		{ value: 'yes', label: 'No, I do not feel safe' }
	];
</script>

<Fieldset legend="Mental Health Screening">
	<p class="hint">Edinburgh Postnatal Depression Scale and wellbeing assessment.</p>

	<Field label="Edinburgh Postnatal Depression Scale (EPDS) Score" required inputId="edinburghScore" description="0-9 Low risk · 10-12 Possible depression · 13+ Probable depression">
		<NumberInput id="edinburghScore" label="EPDS score" min={0} max={30} required bind:value={m.edinburghScore} />
	</Field>

	<Field label="Anxiety Level" inputId="anxietyLevel">
		<Select id="anxietyLevel" label="Anxiety level" bind:value={m.anxietyLevel}>
			<option value="">-- Select --</option>
			{#each anxietyOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Do you have a support system (partner, family, friends)?">
		<RadioGroup label="Support system">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="supportSystem" value={opt.value} bind:group={m.supportSystem} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Domestic violence screening: Do you feel safe at home?">
		<RadioGroup label="Safety at home">
			{#each safetyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="domesticViolenceScreen" value={opt.value} bind:group={m.domesticViolenceScreen} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
