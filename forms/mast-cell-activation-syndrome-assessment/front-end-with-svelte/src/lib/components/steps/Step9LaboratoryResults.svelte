<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const l = assessment.data.laboratoryResults;
</script>

<Fieldset legend="Laboratory Results">
	<p class="hint">Enter any available laboratory test results (leave blank if not tested).</p>

	<Field
		label="Serum Tryptase (ng/mL)"
		description="Normal range: < 11.4 ng/mL. Elevated levels may indicate mast cell activation."
		inputId="serumTryptase"
	>
		<NumberInput id="serumTryptase" label="Serum Tryptase" min={0} max={200} step={0.1} bind:value={l.serumTryptase} />
	</Field>

	<Field
		label="Plasma Histamine (ng/mL)"
		description="Normal range: < 1.0 ng/mL. Elevated during or shortly after mast cell episodes."
		inputId="histamine"
	>
		<NumberInput id="histamine" label="Plasma Histamine" min={0} max={50} step={0.01} bind:value={l.histamine} />
	</Field>

	<Field
		label="Prostaglandin D2 (ng/mL)"
		description="Normal range: < 0.3 ng/mL. A key mediator released by mast cells."
		inputId="prostaglandinD2"
	>
		<NumberInput id="prostaglandinD2" label="Prostaglandin D2" min={0} max={50} step={0.01} bind:value={l.prostaglandinD2} />
	</Field>

	<Field
		label="Chromogranin A (ng/mL)"
		description="Can be elevated in mast cell disorders. Interpret with caution (affected by PPIs)."
		inputId="chromograninA"
	>
		<NumberInput id="chromograninA" label="Chromogranin A" min={0} max={500} step={0.1} bind:value={l.chromograninA} />
	</Field>
</Fieldset>
