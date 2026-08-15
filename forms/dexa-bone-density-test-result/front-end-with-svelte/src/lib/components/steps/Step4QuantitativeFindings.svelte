<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { deriveWhoClassification, whoClassificationLabel } from '#lib/engine/utils.js';

	const d = resultStore.data;

	// Live preview of the WHO classification implied by the lowest T-score.
	const derivedWho = $derived(
		deriveWhoClassification(d.lowestTScore, d.vertebralFractureIdentified)
	);
</script>

<Fieldset legend="4. Quantitative Findings">
	<p class="hint">
		T-scores (vs young-adult mean), Z-scores (vs age-matched mean), the lowest T-score, BMD, and the
		WHO densitometric classification.
	</p>

	<Field label="Lumbar-spine T-score" inputId="lumbarSpineTScore"
		description="Standard deviations from the young-adult reference mean.">
		<NumberInput id="lumbarSpineTScore" label="Lumbar-spine T-score" min={-10} max={10} step={0.1}
			bind:value={d.lumbarSpineTScore} />
	</Field>

	<Field label="Lumbar-spine Z-score" inputId="lumbarSpineZScore"
		description="Standard deviations from the age-matched reference mean.">
		<NumberInput id="lumbarSpineZScore" label="Lumbar-spine Z-score" min={-10} max={10} step={0.1}
			bind:value={d.lumbarSpineZScore} />
	</Field>

	<Field label="Femoral-neck T-score" inputId="femoralNeckTScore">
		<NumberInput id="femoralNeckTScore" label="Femoral-neck T-score" min={-10} max={10} step={0.1}
			bind:value={d.femoralNeckTScore} />
	</Field>

	<Field label="Femoral-neck Z-score" inputId="femoralNeckZScore">
		<NumberInput id="femoralNeckZScore" label="Femoral-neck Z-score" min={-10} max={10} step={0.1}
			bind:value={d.femoralNeckZScore} />
	</Field>

	<Field label="Total-hip T-score" inputId="totalHipTScore">
		<NumberInput id="totalHipTScore" label="Total-hip T-score" min={-10} max={10} step={0.1}
			bind:value={d.totalHipTScore} />
	</Field>

	<Field label="Lowest T-score" inputId="lowestTScore"
		description="The lowest (most negative) T-score across measured sites — drives the WHO classification.">
		<NumberInput id="lowestTScore" label="Lowest T-score" min={-10} max={10} step={0.1}
			bind:value={d.lowestTScore} />
	</Field>

	<Field label="Bone mineral density (g/cm²)" inputId="boneMineralDensityGCm2"
		description="Areal BMD at the reference site, for monitoring.">
		<NumberInput id="boneMineralDensityGCm2" label="Bone mineral density (g/cm²)" min={0} max={5}
			step={0.001} bind:value={d.boneMineralDensityGCm2} />
	</Field>

	<Field label="WHO classification" inputId="whoClassification"
		description="Derived from the lowest T-score; override only when clinically appropriate.">
		<Select id="whoClassification" label="WHO classification" bind:value={d.whoClassification}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="osteopenia">Osteopenia</option>
			<option value="osteoporosis">Osteoporosis</option>
			<option value="severe-osteoporosis">Severe osteoporosis</option>
		</Select>
	</Field>

	{#if derivedWho !== ''}
		<Alert type="info" heading="Derived WHO classification">
			<p>
				The lowest T-score{d.vertebralFractureIdentified ? ' with the identified fracture' : ''}
				implies: <strong>{whoClassificationLabel(derivedWho)}</strong>.
			</p>
		</Alert>
	{/if}
</Fieldset>
