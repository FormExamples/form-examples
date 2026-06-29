<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const h = assessment.data.hearingHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Hearing History">
	<p class="hint">Previous hearing issues and noise exposure.</p>

	<Field label="Have you been exposed to loud noise?">
		<RadioGroup label="Noise exposure">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="noiseExposure" value={opt.value} bind:group={h.noiseExposure} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Occupational noise exposure (e.g., factory, construction, military)?">
		<RadioGroup label="Occupational noise">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="occNoise" value={opt.value} bind:group={h.occupationalNoise} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.occupationalNoise === 'yes'}
		<Field label="Please describe" inputId="occNoiseDetails">
			<TextInput id="occNoiseDetails" label="Occupational noise details" bind:value={h.occupationalNoiseDetails} />
		</Field>
	{/if}

	<Field label="Recreational noise exposure (e.g., concerts, headphones, shooting)?">
		<RadioGroup label="Recreational noise">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recNoise" value={opt.value} bind:group={h.recreationalNoise} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.recreationalNoise === 'yes'}
		<Field label="Please describe" inputId="recNoiseDetails">
			<TextInput id="recNoiseDetails" label="Recreational noise details" bind:value={h.recreationalNoiseDetails} />
		</Field>
	{/if}

	<Field label="Have you had previous hearing tests?">
		<RadioGroup label="Previous hearing tests">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevTests" value={opt.value} bind:group={h.previousHearingTests} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.previousHearingTests === 'yes'}
		<Field label="Describe previous test results" inputId="prevTestDetails">
			<TextAreaInput id="prevTestDetails" label="Previous test details" rows={3} bind:value={h.previousTestDetails} />
		</Field>
	{/if}

	<Field label="Do you currently use hearing aids?">
		<RadioGroup label="Hearing aid use">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hearingAidUse" value={opt.value} bind:group={h.hearingAidUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.hearingAidUse === 'yes'}
		<Field label="Hearing aid details (make, model, duration of use)" inputId="hearingAidDetails">
			<TextInput id="hearingAidDetails" label="Hearing aid details" bind:value={h.hearingAidDetails} />
		</Field>
	{/if}
</Fieldset>
