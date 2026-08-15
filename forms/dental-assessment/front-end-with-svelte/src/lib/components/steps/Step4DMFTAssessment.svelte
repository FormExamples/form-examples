<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { dmftScoreLabel } from '#lib/engine/utils.js';

	const d = assessment.data.dmftAssessment;

	const dmftScore = $derived(
		(d.decayedTeeth ?? 0) + (d.missingTeeth ?? 0) + (d.filledTeeth ?? 0)
	);

	function dmftAlertType(score: number): 'success' | 'warning' | 'error' {
		if (score < 5) return 'success';
		if (score < 10) return 'warning';
		return 'error';
	}
</script>

<Fieldset legend="DMFT Assessment">
	<p class="hint">Decayed, Missing, and Filled Teeth index (maximum 32).</p>

	<div class="field-grid field-grid-3">
		<Field label="Decayed Teeth (D)" inputId="decayedTeeth">
			<NumberInput id="decayedTeeth" label="Decayed Teeth" min={0} max={32} bind:value={d.decayedTeeth} />
		</Field>
		<Field label="Missing Teeth (M)" inputId="missingTeeth">
			<NumberInput id="missingTeeth" label="Missing Teeth" min={0} max={32} bind:value={d.missingTeeth} />
		</Field>
		<Field label="Filled Teeth (F)" inputId="filledTeeth">
			<NumberInput id="filledTeeth" label="Filled Teeth" min={0} max={32} bind:value={d.filledTeeth} />
		</Field>
	</div>

	<Alert type={dmftAlertType(dmftScore)} heading={`DMFT Score: ${dmftScore} (${dmftScoreLabel(dmftScore)})`}>
		<p>D = {d.decayedTeeth ?? 0} + M = {d.missingTeeth ?? 0} + F = {d.filledTeeth ?? 0}</p>
	</Alert>

	<Field label="Tooth chart notes" inputId="toothChartNotes">
		<TextAreaInput id="toothChartNotes" label="Tooth chart notes" rows={4} bind:value={d.toothChartNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	.field-grid.field-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	@media (max-width: 640px) {
		.field-grid, .field-grid.field-grid-3 { grid-template-columns: 1fr; }
	}
</style>
