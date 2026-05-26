<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';

	const f = assessment.data.fallHistory;

	const fearOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];

	const riskFactors = [
		{ value: 'vision-impairment', label: 'Vision impairment' },
		{ value: 'hearing-impairment', label: 'Hearing impairment' },
		{ value: 'peripheral-neuropathy', label: 'Peripheral neuropathy' },
		{ value: 'orthostatic-hypotension', label: 'Orthostatic hypotension' },
		{ value: 'cognitive-impairment', label: 'Cognitive impairment' },
		{ value: 'urinary-urgency', label: 'Urinary urgency' },
		{ value: 'environmental-hazards', label: 'Environmental hazards' },
		{ value: 'footwear-issues', label: 'Inappropriate footwear' }
	];

	function toggleFactor(val: string) {
		if (f.fallRiskFactors.includes(val)) {
			f.fallRiskFactors = f.fallRiskFactors.filter((v) => v !== val);
		} else {
			f.fallRiskFactors = [...f.fallRiskFactors, val];
		}
	}
</script>

<Fieldset legend="Fall History">
	<p class="hint">History of falls and fall risk factors.</p>

	<Field label="Number of falls in the last 12 months" inputId="fallsLastYear">
		<NumberInput id="fallsLastYear" label="Falls in last 12 months" min={0} max={100} bind:value={f.fallsLastYear} />
	</Field>

	<Field label="Date of Most Recent Fall" inputId="lastFallDate">
		<DateInput id="lastFallDate" label="Date of Most Recent Fall" bind:value={f.lastFallDate} />
	</Field>

	<Field label="Circumstances of Falls" inputId="fallCircumstances">
		<TextAreaInput id="fallCircumstances" label="Circumstances of Falls" rows={3} placeholder="Describe circumstances of any falls (location, activity, time of day)..." bind:value={f.fallCircumstances} />
	</Field>

	<Field label="Injuries from Falls" inputId="injuriesFromFalls">
		<TextAreaInput id="injuriesFromFalls" label="Injuries from Falls" rows={3} placeholder="Describe any injuries sustained from falls..." bind:value={f.injuriesFromFalls} />
	</Field>

	<Field label="Fear of Falling">
		<RadioGroup label="Fear of Falling">
			{#each fearOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="fearOfFalling" value={opt.value} bind:group={f.fearOfFalling} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Fall Risk Factors">
		<CheckboxGroup label="Fall Risk Factors">
			{#each riskFactors as opt (opt.value)}
				<label>
					<input type="checkbox" class="checkbox-input" checked={f.fallRiskFactors.includes(opt.value)} onchange={() => toggleFactor(opt.value)} />
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>
</Fieldset>
