<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.exacerbationHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Exacerbation History">
	<p class="hint">History of COPD exacerbations in the past 12 months.</p>

	<Field label="Number of exacerbations per year" inputId="exacPerYear">
		<NumberInput id="exacPerYear" label="Exacerbations per year" min={0} max={50} bind:value={e.exacerbationsPerYear} />
	</Field>

	<Field label="Number of hospitalisations for exacerbation per year" inputId="hospPerYear">
		<NumberInput id="hospPerYear" label="Hospitalizations per year" min={0} max={20} bind:value={e.hospitalizationsPerYear} />
	</Field>

	<Field label="Number of ICU admissions" inputId="icuAdmissions">
		<NumberInput id="icuAdmissions" label="ICU admissions" min={0} max={20} bind:value={e.icuAdmissions} />
	</Field>

	<Field label="Have you ever been intubated (placed on a ventilator) for a breathing crisis?">
		<RadioGroup label="Intubation history">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="intubation" value={opt.value} bind:group={e.intubationHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
