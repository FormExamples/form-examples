<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const c = assessment.data.cardiovascularScreening;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cardiovascular Screening">
	<p class="hint">14-point AHA pre-participation cardiovascular history and resting vitals.</p>

	<Field label="Chest pain with exertion?">
		<RadioGroup label="Chest pain with exertion?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="chestPainExertion" value={opt.value} bind:group={c.chestPainWithExertion} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Unexplained syncope (fainting)?">
		<RadioGroup label="Unexplained syncope?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="syncope" value={opt.value} bind:group={c.unexplainedSyncope} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Excessive breathlessness on exertion?">
		<RadioGroup label="Excessive breathlessness?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="breathlessness" value={opt.value} bind:group={c.excessiveBreathlessness} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Palpitations or irregular heartbeat?">
		<RadioGroup label="Palpitations or irregular heartbeat?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="palpitations" value={opt.value} bind:group={c.palpitationsOrIrregularBeat} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="High blood pressure diagnosis?">
		<RadioGroup label="High blood pressure diagnosis?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="highBP" value={opt.value} bind:group={c.highBloodPressureDiagnosis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Heart murmur detected?">
		<RadioGroup label="Heart murmur detected?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="murmur" value={opt.value} bind:group={c.heartMurmurDetected} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previously restricted from sport for the heart?">
		<RadioGroup label="Previously restricted from sport for the heart?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="restrictedHeart" value={opt.value} bind:group={c.restrictedActivityForHeart} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Resting systolic (mmHg)" inputId="restingSystolic">
			<NumberInput id="restingSystolic" label="Resting systolic" min={60} max={260} bind:value={c.restingSystolic} />
		</Field>
		<Field label="Resting diastolic (mmHg)" inputId="restingDiastolic">
			<NumberInput id="restingDiastolic" label="Resting diastolic" min={30} max={160} bind:value={c.restingDiastolic} />
		</Field>
		<Field label="Resting heart rate (bpm)" inputId="restingHeartRate">
			<NumberInput id="restingHeartRate" label="Resting heart rate" min={30} max={220} bind:value={c.restingHeartRate} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid.field-grid-3 {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
