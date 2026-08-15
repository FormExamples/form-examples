<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const x = assessment.data.dx;
</script>

<Fieldset legend="Diagnosis">
	<p class="hint">The root cause, its scope, and whether it is confirmed.</p>

	<Field label="Root cause" inputId="dxRootCause">
		<TextAreaInput id="dxRootCause" label="Root cause" rows={3} bind:value={x.dxRootCause} />
	</Field>

	<Field label="Contributing causes" inputId="dxContributingCauses">
		<TextAreaInput id="dxContributingCauses" label="Contributing causes" rows={3} bind:value={x.dxContributingCauses} />
	</Field>

	<div class="field-grid">
		<Field label="Scope" inputId="dxScope">
			<Select id="dxScope" label="Scope" bind:value={x.dxScope}>
				<option value="">-- Select --</option>
				<option value="single-instance">Single instance</option>
				<option value="single-service">Single service</option>
				<option value="multiple-services">Multiple services</option>
				<option value="whole-system">Whole system</option>
				<option value="organisation-wide">Organisation-wide</option>
			</Select>
		</Field>
		<Field label="Confirmed?" inputId="dxConfirmed">
			<Select id="dxConfirmed" label="Confirmed?" bind:value={x.dxConfirmed}>
				<option value="">-- Select --</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="partial">Partial</option>
			</Select>
		</Field>
	</div>
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
