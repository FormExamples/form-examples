<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.fallHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Fall History">
	<p class="hint">Falls in the last 12 months and their consequences.</p>

	<Field label="Has the patient fallen in the past 12 months?">
		<RadioGroup label="Has the patient fallen in the past 12 months?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasFallenInPastYear" value={opt.value} bind:group={f.hasFallenInPastYear} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if f.hasFallenInPastYear === 'yes'}
		<Field label="Number of falls in the past 12 months" inputId="numberOfFallsPastYear">
			<NumberInput id="numberOfFallsPastYear" label="Number of falls" min={0} max={100} bind:value={f.numberOfFallsPastYear} />
		</Field>
		<Field label="Date of most recent fall" inputId="lastFallDate">
			<DateInput id="lastFallDate" label="Date of most recent fall" bind:value={f.lastFallDate} />
		</Field>
		<Field label="Was the most recent fall injurious?">
			<RadioGroup label="Was the most recent fall injurious?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="mostRecentFallInjurious" value={opt.value} bind:group={f.mostRecentFallInjurious} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if f.mostRecentFallInjurious === 'yes'}
			<Field label="Injury details" inputId="mostRecentFallInjuryDetails">
				<TextInput id="mostRecentFallInjuryDetails" label="Injury details" placeholder="e.g. wrist fracture, head laceration" bind:value={f.mostRecentFallInjuryDetails} />
			</Field>
		{/if}
	{/if}

	<Field label="Has the patient had recurrent falls with injury?">
		<RadioGroup label="Has the patient had recurrent falls with injury?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recurrentFallsWithInjury" value={opt.value} bind:group={f.recurrentFallsWithInjury} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does the patient report fear of falling?">
		<RadioGroup label="Does the patient report fear of falling?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fearOfFalling" value={opt.value} bind:group={f.fearOfFalling} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Circumstances of recent falls" inputId="fallCircumstances">
		<TextAreaInput id="fallCircumstances" label="Circumstances of recent falls" rows={3} placeholder="Where, when, what was the patient doing, and any contributing factors…" bind:value={f.fallCircumstances} />
	</Field>
</Fieldset>
