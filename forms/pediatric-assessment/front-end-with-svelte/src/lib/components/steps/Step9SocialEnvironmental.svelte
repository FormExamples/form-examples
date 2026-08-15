<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const se = assessment.data.socialEnvironmental;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const schoolOptions = [
		{ value: 'above-average', label: 'Above Average' },
		{ value: 'average', label: 'Average' },
		{ value: 'below-average', label: 'Below Average' },
		{ value: 'not-applicable', label: 'Not Applicable (pre-school age)' }
	];
</script>

<Fieldset legend="Social & Environmental">
	<p class="hint">Home, school, and social environment.</p>

	<Field label="Home Environment" inputId="homeEnv">
		<TextAreaInput id="homeEnv" label="Home Environment" rows={3} bind:value={se.homeEnvironment} />
	</Field>

	<Field label="School Performance" inputId="schoolPerf">
		<Select id="schoolPerf" label="School performance" bind:value={se.schoolPerformance}>
			<option value="">-- Select --</option>
			{#each schoolOptions as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Are there any behavioural concerns?">
		<RadioGroup label="Behavioural concerns">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="behavioural" value={opt.value} bind:group={se.behaviouralConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if se.behaviouralConcerns === 'yes'}
		<Field label="Please describe behavioural concerns" inputId="behaviouralDetails">
			<TextAreaInput id="behaviouralDetails" label="Behavioural details" rows={3} bind:value={se.behaviouralConcernDetails} />
		</Field>
	{/if}

	<Field label="Are there any safeguarding concerns?">
		<RadioGroup label="Safeguarding concerns">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="safeguarding" value={opt.value} bind:group={se.safeguardingConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if se.safeguardingConcerns === 'yes'}
		<Field label="Please describe safeguarding concerns" inputId="safeguardingDetails">
			<TextAreaInput id="safeguardingDetails" label="Safeguarding details" rows={3} bind:value={se.safeguardingDetails} />
		</Field>
	{/if}

	<Field label="Screen Time (hours/day)" inputId="screenTime">
		<NumberInput id="screenTime" label="Screen time" min={0} max={24} step={0.5} bind:value={se.screenTimeHoursPerDay} />
	</Field>
</Fieldset>
