<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.reproductiveHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Reproductive History">
	<p class="hint">Pregnancies, contraception, and prior fertility care.</p>

	<Field label="How long have you been trying to conceive? (months)" inputId="reproductiveHistory-durationTryingMonths">
		<NumberInput id="reproductiveHistory-durationTryingMonths" label="Duration trying (months)" min={0} max={240} bind:value={r.durationTryingMonths} />
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Prior pregnancies" inputId="reproductiveHistory-priorPregnancies">
			<NumberInput id="reproductiveHistory-priorPregnancies" label="Prior pregnancies" min={0} max={30} bind:value={r.priorPregnancies} />
		</Field>
		<Field label="Live births" inputId="reproductiveHistory-priorLiveBirths">
			<NumberInput id="reproductiveHistory-priorLiveBirths" label="Live births" min={0} max={30} bind:value={r.priorLiveBirths} />
		</Field>
		<Field label="Miscarriages" inputId="reproductiveHistory-priorMiscarriages">
			<NumberInput id="reproductiveHistory-priorMiscarriages" label="Miscarriages" min={0} max={30} bind:value={r.priorMiscarriages} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Ectopic pregnancies" inputId="reproductiveHistory-priorEctopic">
			<NumberInput id="reproductiveHistory-priorEctopic" label="Ectopic pregnancies" min={0} max={10} bind:value={r.priorEctopic} />
		</Field>
		<Field label="Terminations" inputId="reproductiveHistory-priorTerminations">
			<NumberInput id="reproductiveHistory-priorTerminations" label="Terminations" min={0} max={10} bind:value={r.priorTerminations} />
		</Field>
	</div>

	<Field label="Have you had any prior fertility treatment?">
		<RadioGroup label="Have you had any prior fertility treatment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="priorFertilityTreatment" value={opt.value} bind:group={r.priorFertilityTreatment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if r.priorFertilityTreatment === 'yes'}
		<Field label="Prior treatment details (e.g. IUI, IVF, ovulation induction)" inputId="reproductiveHistory-priorTreatmentDetails">
			<TextAreaInput id="reproductiveHistory-priorTreatmentDetails" label="Prior treatment details" rows={3} bind:value={r.priorTreatmentDetails} />
		</Field>
	{/if}

	<Field label="Have you stopped contraception?">
		<RadioGroup label="Have you stopped contraception?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="contraceptionStopped" value={opt.value} bind:group={r.contraceptionStopped} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if r.contraceptionStopped === 'yes'}
		<Field label="Date contraception stopped" inputId="reproductiveHistory-contraceptionStoppedDate">
			<DateInput id="reproductiveHistory-contraceptionStoppedDate" label="Date contraception stopped" bind:value={r.contraceptionStoppedDate} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
