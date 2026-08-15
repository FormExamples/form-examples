<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TravelEntry from '#lib/components/ui/TravelEntry.svelte';

	const t = assessment.data.travelHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Travel History">
	<p class="hint">Travel relevant to malaria, West Nile virus, and vCJD risk.</p>

	<Field label="Recent travel (past 12 months)" description="List countries visited and return date for each trip.">
		<TravelEntry bind:entries={t.recentTravel} />
	</Field>

	<Field label="Have you travelled to a malaria-risk area in the past 12 months?">
		<RadioGroup label="Have you travelled to a malaria-risk area in the past 12 months?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="malariaAreaPastTwelveMonths" value={opt.value} bind:group={t.malariaAreaPastTwelveMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you travelled to a West Nile virus area in the past 28 days?">
		<RadioGroup label="Have you travelled to a West Nile virus area in the past 28 days?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="westNileVirusAreaPastTwentyEightDays" value={opt.value} bind:group={t.westNileVirusAreaPastTwentyEightDays} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Did you live in the UK for ≥ 12 months between 1980 and 1996?">
		<RadioGroup label="Did you live in the UK for at least 12 months between 1980 and 1996?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ukResidence1980To1996Over12Months" value={opt.value} bind:group={t.ukResidence1980To1996Over12Months} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever received a blood transfusion in the UK since 1980?">
		<RadioGroup label="Have you ever received a blood transfusion in the UK since 1980?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bloodTransfusionInUk" value={opt.value} bind:group={t.bloodTransfusionInUk} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
