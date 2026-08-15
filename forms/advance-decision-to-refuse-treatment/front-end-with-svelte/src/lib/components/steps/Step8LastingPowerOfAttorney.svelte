<script lang="ts">
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const lpa = $state(assessment.data.lastingPowerOfAttorney);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Lasting Power of Attorney">
	<p class="hint">Details of any Lasting Power of Attorney (LPA) that may affect this ADRT</p>
	<div class="mb-4 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
		<p class="font-semibold">Important Legal Interaction</p>
		<p class="mt-1">If you have a Health and Welfare LPA that was registered <strong>after</strong> you made this ADRT, the LPA attorney may have authority to consent to the treatments you have refused. It is important to clarify the relationship between your ADRT and any LPA.</p>
	</div>

	<Field label="Do you have a Lasting Power of Attorney (LPA)?"><RadioGroup label="Do you have a Lasting Power of Attorney (LPA)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hasLPA" value={opt.value} bind:group={lpa.hasLPA}/> {opt.label}</label>{/each}</RadioGroup></Field>

	{#if lpa.hasLPA === 'yes'}
		<Field label="Type of LPA" required inputId="lpaType"><Select id="lpaType" label="Type of LPA" required bind:value={lpa.lpaType}><option value="">-- Select --</option>{#each [
				{ value: 'health-and-welfare', label: 'Health and Welfare' },
				{ value: 'property-and-financial', label: 'Property and Financial Affairs' },
				{ value: 'both', label: 'Both' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>

		<Field label="Is the LPA registered with the Office of the Public Guardian?"><RadioGroup label="Is the LPA registered with the Office of the Public Guardian?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="lpaRegistered" value={opt.value} bind:group={lpa.lpaRegistered}/> {opt.label}</label>{/each}</RadioGroup></Field>

		{#if lpa.lpaRegistered === 'yes'}
			<Field label="Registration Date" inputId="lpaRegistrationDate"><DateInput id="lpaRegistrationDate" label="Registration Date" bind:value={lpa.lpaRegistrationDate} /></Field>
		{/if}

		<Field label="Name(s) of Attorney(s) / Donee(s)" inputId="doneeNames"><TextInput id="doneeNames" label="Name(s) of Attorney(s) / Donee(s)" bind:value={lpa.doneeNames} /></Field>

		<Field label="Relationship between this ADRT and the LPA" inputId="relationshipBetweenADRTAndLPA"><TextAreaInput id="relationshipBetweenADRTAndLPA" label="Relationship between this ADRT and the LPA" rows={4} placeholder="Describe how the ADRT and LPA interact. For example: 'This ADRT takes precedence over the LPA for the specific treatments refused.'" bind:value={lpa.relationshipBetweenADRTAndLPA} /></Field>
	{/if}
</Fieldset>
