<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const l = assessment.data.lifestyleRisk;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Lifestyle & Risk Behaviours">
	<p class="hint">These questions are confidential. Honest answers protect patients who receive your blood.</p>

	<Field label="Have you ever injected non-prescribed drugs (including steroids)?">
		<RadioGroup label="Have you ever injected non-prescribed drugs (including steroids)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ivDrugUseEver" value={opt.value} bind:group={l.ivDrugUseEver} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you had sex with someone who has injected non-prescribed drugs?">
		<RadioGroup label="Have you had sex with someone who has injected non-prescribed drugs?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sexWithIvDrugUser" value={opt.value} bind:group={l.sexWithIvDrugUser} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="In the past 12 months, have you had sex in exchange for money or drugs?">
		<RadioGroup label="In the past 12 months, have you had sex in exchange for money or drugs?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sexInExchangePastTwelveMonths" value={opt.value} bind:group={l.sexInExchangePastTwelveMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="In the past 3 months, have you had sex with a new partner?">
		<RadioGroup label="In the past 3 months, have you had sex with a new partner?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sexWithNewPartnerPastThreeMonths" value={opt.value} bind:group={l.sexWithNewPartnerPastThreeMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="In the past 3 months, have you had multiple sexual partners?">
		<RadioGroup label="In the past 3 months, have you had multiple sexual partners?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="multipleSexualPartnersPastThreeMonths" value={opt.value} bind:group={l.multipleSexualPartnersPastThreeMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="In the past 4 months, have you had a tattoo or semi-permanent make-up?">
		<RadioGroup label="In the past 4 months, have you had a tattoo or semi-permanent make-up?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tattooOrPiercingPastFourMonths" value={opt.value} bind:group={l.tattooOrPiercingPastFourMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="In the past 4 months, have you had acupuncture (non-NHS)?">
		<RadioGroup label="In the past 4 months, have you had acupuncture (non-NHS)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="acupuncturePastFourMonths" value={opt.value} bind:group={l.acupuncturePastFourMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="In the past 4 months, have you had a body or ear piercing?">
		<RadioGroup label="In the past 4 months, have you had a body or ear piercing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bodyOrEarPiercingPastFourMonths" value={opt.value} bind:group={l.bodyOrEarPiercingPastFourMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you been incarcerated in the past 12 months?">
		<RadioGroup label="Have you been incarcerated in the past 12 months?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="incarceratedPastTwelveMonths" value={opt.value} bind:group={l.incarceratedPastTwelveMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
