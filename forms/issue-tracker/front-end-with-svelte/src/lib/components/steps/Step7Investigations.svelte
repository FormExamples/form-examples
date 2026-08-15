<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const i = assessment.data.ix;
</script>

<Fieldset legend="Investigations">
	<p class="hint">Hypotheses, reproduction, diagnostics, and outstanding unknowns.</p>

	<Field label="Hypotheses" inputId="ixHypotheses">
		<TextAreaInput id="ixHypotheses" label="Hypotheses" rows={3} bind:value={i.ixHypotheses} />
	</Field>

	<Field label="Reproduction steps" inputId="ixReproSteps">
		<TextAreaInput id="ixReproSteps" label="Reproduction steps" rows={4} bind:value={i.ixReproSteps} />
	</Field>

	<Field label="Diagnostic queries" inputId="ixDiagnosticQueries">
		<TextAreaInput id="ixDiagnosticQueries" label="Diagnostic queries" rows={3} bind:value={i.ixDiagnosticQueries} />
	</Field>

	<Field label="Tests run" inputId="ixTestsRun">
		<TextAreaInput id="ixTestsRun" label="Tests run" rows={3} bind:value={i.ixTestsRun} />
	</Field>

	<Field label="Blocking unknowns" inputId="ixBlockingUnknowns">
		<TextAreaInput id="ixBlockingUnknowns" label="Blocking unknowns" rows={3} bind:value={i.ixBlockingUnknowns} />
	</Field>
</Fieldset>
