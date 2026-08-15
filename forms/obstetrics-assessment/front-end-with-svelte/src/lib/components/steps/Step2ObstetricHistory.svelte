<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const o = assessment.data.obstetricHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Obstetric History">
	<p class="hint">Previous pregnancies and outcomes.</p>

	<div class="field-grid field-grid-3">
		<Field label="Gravidity (total pregnancies)" inputId="gravidity">
			<NumberInput id="gravidity" label="Gravidity" min={0} max={30} bind:value={o.gravidity} />
		</Field>
		<Field label="Parity (births >=24 wks)" inputId="parity">
			<NumberInput id="parity" label="Parity" min={0} max={30} bind:value={o.parity} />
		</Field>
		<Field label="Previous miscarriages" inputId="previousMiscarriages">
			<NumberInput id="previousMiscarriages" label="Previous miscarriages" min={0} max={30} bind:value={o.previousMiscarriages} />
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Previous terminations" inputId="previousTerminations">
			<NumberInput id="previousTerminations" label="Previous terminations" min={0} max={30} bind:value={o.previousTerminations} />
		</Field>
		<Field label="Previous stillbirths" inputId="previousStillbirths">
			<NumberInput id="previousStillbirths" label="Previous stillbirths" min={0} max={30} bind:value={o.previousStillbirths} />
		</Field>
		<Field label="Previous neonatal deaths" inputId="previousNeonatalDeaths">
			<NumberInput id="previousNeonatalDeaths" label="Previous neonatal deaths" min={0} max={30} bind:value={o.previousNeonatalDeaths} />
		</Field>
	</div>

	<Field label="Previous preterm birth (<37 weeks)?">
		<RadioGroup label="Previous preterm birth?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousPretermBirth" value={opt.value} bind:group={o.previousPretermBirth} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous pre-eclampsia or eclampsia?">
		<RadioGroup label="Previous pre-eclampsia or eclampsia?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousPreEclampsia" value={opt.value} bind:group={o.previousPreEclampsia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous gestational diabetes (GDM)?">
		<RadioGroup label="Previous gestational diabetes?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousGestationalDiabetes" value={opt.value} bind:group={o.previousGestationalDiabetes} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous caesarean section?">
		<RadioGroup label="Previous caesarean section?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousCaesarean" value={opt.value} bind:group={o.previousCaesarean} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if o.previousCaesarean === 'yes'}
		<Field label="Number of previous caesareans" inputId="previousCaesareanCount">
			<NumberInput id="previousCaesareanCount" label="Number of previous caesareans" min={1} max={10} bind:value={o.previousCaesareanCount} />
		</Field>
	{/if}

	<Field label="Previous shoulder dystocia?">
		<RadioGroup label="Previous shoulder dystocia?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousShoulderDystocia" value={opt.value} bind:group={o.previousShoulderDystocia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous postpartum haemorrhage (>1000 mL)?">
		<RadioGroup label="Previous postpartum haemorrhage?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousPostpartumHaemorrhage" value={opt.value} bind:group={o.previousPostpartumHaemorrhage} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous large baby (>=4500 g)?">
		<RadioGroup label="Previous large baby?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousLargeBaby" value={opt.value} bind:group={o.previousLargeBaby} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous small baby (<2500 g)?">
		<RadioGroup label="Previous small baby?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousSmallBaby" value={opt.value} bind:group={o.previousSmallBaby} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous baby with congenital anomaly?">
		<RadioGroup label="Previous baby with congenital anomaly?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousCongenitalAnomaly" value={opt.value} bind:group={o.previousCongenitalAnomaly} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other obstetric notes" inputId="obstetricNotes">
		<TextAreaInput id="obstetricNotes" label="Other obstetric notes" rows={3} placeholder="Mode of delivery, complications, gestation at delivery, etc." bind:value={o.obstetricNotes} />
	</Field>
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
