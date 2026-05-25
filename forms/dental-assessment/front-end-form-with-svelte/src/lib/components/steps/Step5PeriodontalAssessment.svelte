<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.periodontalAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Periodontal Assessment">
	<p class="hint">Gum health and supporting structures.</p>

	<Field label="Do your gums bleed when brushing or flossing?">
		<RadioGroup label="Gum bleeding">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gumBleeding" value={opt.value} bind:group={p.gumBleeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are any pocket depths above normal (>3mm)?">
		<RadioGroup label="Pocket depths above normal">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pocketDepths" value={opt.value} bind:group={p.pocketDepthsAboveNormal} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.pocketDepthsAboveNormal === 'yes'}
		<Field label="Pocket depth details" inputId="pocketDepthDetails">
			<TextInput id="pocketDepthDetails" label="Pocket depth details" bind:value={p.pocketDepthDetails} />
		</Field>
	{/if}

	<Field label="Is there gum recession?">
		<RadioGroup label="Gum recession">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gumRecession" value={opt.value} bind:group={p.gumRecession} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.gumRecession === 'yes'}
		<Field label="Recession details" inputId="gumRecessionDetails">
			<TextInput id="gumRecessionDetails" label="Recession details" bind:value={p.gumRecessionDetails} />
		</Field>
	{/if}

	<Field label="Is there any tooth mobility?">
		<RadioGroup label="Tooth mobility">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="toothMobility" value={opt.value} bind:group={p.toothMobility} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.toothMobility === 'yes'}
		<Field label="Mobility details" inputId="mobilityDetails">
			<TextInput id="mobilityDetails" label="Mobility details" bind:value={p.mobilityDetails} />
		</Field>
	{/if}

	<Field label="Is there furcation involvement?">
		<RadioGroup label="Furcation involvement">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="furcation" value={opt.value} bind:group={p.furcationInvolvement} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.furcationInvolvement === 'yes'}
		<Field label="Furcation details" inputId="furcationDetails">
			<TextInput id="furcationDetails" label="Furcation details" bind:value={p.furcationDetails} />
		</Field>
	{/if}
</Fieldset>
