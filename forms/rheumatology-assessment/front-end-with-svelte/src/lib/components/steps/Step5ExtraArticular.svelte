<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.extraArticularFeatures;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Extra-articular Features">
	<p class="hint">Manifestations beyond the joints.</p>

	<h3 class="section-h">Skin</h3>
	<Field label="Rheumatoid Nodules">
		<RadioGroup label="Rheumatoid nodules">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="rheumatoidNodules" value={opt.value} bind:group={d.rheumatoidNodules} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Skin Rash">
		<RadioGroup label="Skin rash">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="skinRash" value={opt.value} bind:group={d.skinRash} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.skinRash === 'yes'}
		<Field label="Skin Rash Details" inputId="skinRashDetails">
			<TextAreaInput id="skinRashDetails" label="Skin rash details" placeholder="Describe rash type, distribution..." bind:value={d.skinRashDetails} />
		</Field>
	{/if}

	<h3 class="section-h">Eyes</h3>
	<Field label="Eye Dryness (Sjogren's)">
		<RadioGroup label="Eye dryness">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eyeDryness" value={opt.value} bind:group={d.eyeDryness} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Uveitis">
		<RadioGroup label="Uveitis">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="uveitis" value={opt.value} bind:group={d.uveitis} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.uveitis === 'yes'}
		<Field label="Uveitis Details" inputId="uveitisDetails">
			<TextAreaInput id="uveitisDetails" label="Uveitis details" placeholder="Type, frequency, treatment..." bind:value={d.uveitisDetails} />
		</Field>
	{/if}

	<h3 class="section-h">Lungs</h3>
	<Field label="Interstitial Lung Disease (ILD)">
		<RadioGroup label="ILD">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="interstitialLungDisease" value={opt.value} bind:group={d.interstitialLungDisease} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.interstitialLungDisease === 'yes'}
		<Field label="ILD Details" inputId="ildDetails">
			<TextAreaInput id="ildDetails" label="ILD details" placeholder="Type, severity, treatment..." bind:value={d.ildDetails} />
		</Field>
	{/if}

	<h3 class="section-h">Cardiovascular</h3>
	<Field label="Cardiovascular Involvement">
		<RadioGroup label="Cardiovascular involvement">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cardiovascularInvolvement" value={opt.value} bind:group={d.cardiovascularInvolvement} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.cardiovascularInvolvement === 'yes'}
		<Field label="Cardiovascular Details" inputId="cardiovascularDetails">
			<TextAreaInput id="cardiovascularDetails" label="Cardiovascular details" placeholder="Pericarditis, vasculitis, etc..." bind:value={d.cardiovascularDetails} />
		</Field>
	{/if}
</Fieldset>

<style>.section-h { font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text); }</style>
