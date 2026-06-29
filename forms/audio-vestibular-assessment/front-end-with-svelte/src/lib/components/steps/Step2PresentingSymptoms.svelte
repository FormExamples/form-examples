<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.presentingSymptoms;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const sideOptions = [
		{ value: 'right', label: 'Right' },
		{ value: 'left', label: 'Left' },
		{ value: 'both', label: 'Both' }
	];
	const onsetOptions = [
		{ value: 'sudden', label: 'Sudden (< 72 h)' },
		{ value: 'gradual', label: 'Gradual' },
		{ value: 'fluctuating', label: 'Fluctuating' }
	];
	const vertigoCharOptions = [
		{ value: 'spinning', label: 'Spinning' },
		{ value: 'rocking', label: 'Rocking / floating' },
		{ value: 'lightheaded', label: 'Lightheaded' },
		{ value: 'imbalance', label: 'Imbalance' }
	];
</script>

<Fieldset legend="Presenting Symptoms">
	<p class="hint">Hearing, balance, and related symptoms reported by the patient.</p>

	<Field label="Hearing loss?">
		<RadioGroup label="Hearing loss?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hearingLoss" value={opt.value} bind:group={s.hearingLoss} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.hearingLoss === 'yes'}
		<Field label="Affected side">
			<RadioGroup label="Affected side">
				{#each sideOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="hearingLossSide" value={opt.value} bind:group={s.hearingLossSide} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Onset">
			<RadioGroup label="Onset">
				{#each onsetOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="hearingLossOnset" value={opt.value} bind:group={s.hearingLossOnset} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Duration (months)" inputId="hearingLossDurationMonths">
			<NumberInput id="hearingLossDurationMonths" label="Duration in months" min={0} max={1200} bind:value={s.hearingLossDurationMonths} />
		</Field>
	{/if}

	<Field label="Tinnitus?">
		<RadioGroup label="Tinnitus?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tinnitus" value={opt.value} bind:group={s.tinnitus} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.tinnitus === 'yes'}
		<Field label="Tinnitus side">
			<RadioGroup label="Tinnitus side">
				{#each sideOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="tinnitusSide" value={opt.value} bind:group={s.tinnitusSide} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Otalgia (ear pain)?">
			<RadioGroup label="Otalgia (ear pain)?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="otalgia" value={opt.value} bind:group={s.otalgia} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Otorrhea (ear discharge)?">
			<RadioGroup label="Otorrhea (ear discharge)?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="otorrhea" value={opt.value} bind:group={s.otorrhea} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<Field label="Aural fullness / pressure?">
		<RadioGroup label="Aural fullness / pressure?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="auralFullness" value={opt.value} bind:group={s.auralFullness} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Vertigo (true spinning)?">
		<RadioGroup label="Vertigo (true spinning)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vertigo" value={opt.value} bind:group={s.vertigo} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.vertigo === 'yes'}
		<Field label="Character of dizziness">
			<RadioGroup label="Character of dizziness">
				{#each vertigoCharOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="vertigoCharacter" value={opt.value} bind:group={s.vertigoCharacter} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<div class="grid gap-4 sm:grid-cols-2">
			<Field label="Episode duration (seconds)" inputId="vertigoEpisodeDurationSeconds">
				<NumberInput id="vertigoEpisodeDurationSeconds" label="Episode duration in seconds" min={0} max={86400} bind:value={s.vertigoEpisodeDurationSeconds} />
			</Field>
			<Field label="Frequency (per week)" inputId="vertigoFrequencyPerWeek">
				<NumberInput id="vertigoFrequencyPerWeek" label="Frequency per week" min={0} max={200} bind:value={s.vertigoFrequencyPerWeek} />
			</Field>
		</div>
	{/if}

	<Field label="Imbalance / unsteadiness?">
		<RadioGroup label="Imbalance / unsteadiness?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="imbalance" value={opt.value} bind:group={s.imbalance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Falls in the past 12 months?">
		<RadioGroup label="Falls in the past 12 months?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="falls" value={opt.value} bind:group={s.falls} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.falls === 'yes'}
		<Field label="How many falls?" inputId="fallsLastYearCount">
			<NumberInput id="fallsLastYearCount" label="Number of falls" min={1} max={1000} bind:value={s.fallsLastYearCount} />
		</Field>
	{/if}

	<Field label="Headache or migraine history?">
		<RadioGroup label="Headache or migraine history?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="headacheMigraine" value={opt.value} bind:group={s.headacheMigraine} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Neurological symptoms (weakness, double vision, slurred speech, numbness, ataxia)?">
		<RadioGroup label="Neurological symptoms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="neurologicalSymptoms" value={opt.value} bind:group={s.neurologicalSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other symptoms" inputId="otherSymptoms">
		<TextAreaInput id="otherSymptoms" label="Other symptoms" rows={3} placeholder="Anything else worth noting…" bind:value={s.otherSymptoms} />
	</Field>
</Fieldset>
