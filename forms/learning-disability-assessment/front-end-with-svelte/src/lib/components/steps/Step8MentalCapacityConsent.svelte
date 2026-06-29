<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const mc = assessment.data.mentalCapacityConsent;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Mental Capacity & Consent">
	<p class="hint">Decision-specific capacity under the Mental Capacity Act 2005.</p>

	<Field label="Can the person consent to this health check?">
		<RadioGroup label="Can the person consent to this health check?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="canConsentToHealthCheck" value={opt.value} bind:group={mc.canConsentToHealthCheck} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Can the person consent to medication decisions?">
		<RadioGroup label="Can the person consent to medication decisions?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="canConsentToMedication" value={opt.value} bind:group={mc.canConsentToMedication} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Can the person make decisions about finances?">
		<RadioGroup label="Can the person make decisions about finances?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="canConsentToFinances" value={opt.value} bind:group={mc.canConsentToFinances} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is there a Lasting Power of Attorney (health and welfare)?">
		<RadioGroup label="Is there a Lasting Power of Attorney (health and welfare)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasLpa" value={opt.value} bind:group={mc.hasLpa} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if mc.hasLpa === 'yes'}
		<Field label="LPA holder details" inputId="lpaDetails">
			<TextInput id="lpaDetails" label="LPA holder details" bind:value={mc.lpaDetails} />
		</Field>
	{/if}

	<Field label="Is a Deprivation of Liberty Safeguard (DoLS) in place?">
		<RadioGroup label="Is a Deprivation of Liberty Safeguard (DoLS) in place?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasDols" value={opt.value} bind:group={mc.hasDols} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is a best-interests decision required for any item in this assessment?">
		<RadioGroup label="Is a best-interests decision required for any item in this assessment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bestInterestsRequired" value={opt.value} bind:group={mc.bestInterestsRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Best-interests decision notes" inputId="bestInterestsNotes">
		<TextAreaInput id="bestInterestsNotes" label="Best-interests decision notes" rows={3} placeholder="Who was consulted; what was decided; why it is in the person's best interests…" bind:value={mc.bestInterestsNotes} />
	</Field>
</Fieldset>
