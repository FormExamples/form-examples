<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { SPAQ_OPTIONS } from '$lib/engine/sad-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.sleepEnergy;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Sleep & Energy">
	<p class="hint">SPAQ seasonality items for sleep and energy (scored 0-4), plus sleep details.</p>

	<Field label="Sleep length — how much do the seasons change your sleep length?">
		<RadioGroup label="Sleep length seasonal change">
			{#each SPAQ_OPTIONS as opt (opt.value)}
				<label
					><input
						type="radio"
						class="radio-input"
						name="spaqSleepLength"
						value={opt.value}
						bind:group={e.spaq.sleepLength}
					/> {opt.value} — {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Energy level — how much does your energy change with the seasons?">
		<RadioGroup label="Energy level seasonal change">
			{#each SPAQ_OPTIONS as opt (opt.value)}
				<label
					><input
						type="radio"
						class="radio-input"
						name="spaqEnergyLevel"
						value={opt.value}
						bind:group={e.spaq.energyLevel}
					/> {opt.value} — {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Hours slept (winter)" inputId="hoursSleptWinter">
			<NumberInput id="hoursSleptWinter" label="Hours slept in winter" min={0} max={24} step="0.5" bind:value={e.hoursSleptWinter} />
		</Field>
		<Field label="Hours slept (summer)" inputId="hoursSleptSummer">
			<NumberInput id="hoursSleptSummer" label="Hours slept in summer" min={0} max={24} step="0.5" bind:value={e.hoursSleptSummer} />
		</Field>
	</div>

	<Field label="Hypersomnia (sleeping much more than usual)?">
		<RadioGroup label="Hypersomnia">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="hypersomnia" value={opt.value} bind:group={e.hypersomnia} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Morning fatigue / difficulty waking?">
		<RadioGroup label="Morning fatigue">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="morningFatigue" value={opt.value} bind:group={e.morningFatigue} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Energy notes" inputId="energyNotes">
		<TextAreaInput id="energyNotes" label="Energy notes" rows={3} bind:value={e.energyNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
