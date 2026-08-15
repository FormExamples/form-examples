<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const n = assessment.data.neurologicalConcussionBaseline;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Neurological & Concussion Baseline">
	<p class="hint">Concussion history and neurological screening (SCAT6 context).</p>

	<Field label="Total lifetime concussions" inputId="totalConcussions">
		<NumberInput id="totalConcussions" label="Total concussions" min={0} max={50} bind:value={n.totalConcussions} />
	</Field>

	<Field label="Concussion in the last 6 months?">
		<RadioGroup label="Concussion in the last 6 months?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="concussion6m" value={opt.value} bind:group={n.concussionLastSixMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if n.concussionLastSixMonths === 'yes'}
		<Field label="Most recent concussion date" inputId="mostRecentConcussionDate">
			<DateInput id="mostRecentConcussionDate" label="Most recent concussion date" bind:value={n.mostRecentConcussionDate} />
		</Field>
	{/if}

	<Field label="Ongoing post-concussive symptoms?">
		<RadioGroup label="Ongoing post-concussive symptoms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="postConcussive" value={opt.value} bind:group={n.ongoingPostConcussiveSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="History of seizures?">
		<RadioGroup label="History of seizures?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="seizures" value={opt.value} bind:group={n.historyOfSeizures} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Stinger or burner episode?">
		<RadioGroup label="Stinger or burner episode?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="stinger" value={opt.value} bind:group={n.stinger} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="History of head or neck surgery?">
		<RadioGroup label="History of head or neck surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="headNeckSurgery" value={opt.value} bind:group={n.historyOfHeadOrNeckSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Baseline headaches or migraine?">
		<RadioGroup label="Baseline headaches or migraine?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="headaches" value={opt.value} bind:group={n.baselineHeadachesOrMigraine} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
