<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="9. Forecast" data-step="9">
	<Field label="Expected end state" inputId="fcExpectedEndState">
		<TextAreaInput
			id="fcExpectedEndState"
			label="Expected end state"
			rows={3}
			bind:value={d.forecast.fc_expected_end_state}
		/>
	</Field>

	<Field label="Residual risk" inputId="fcResidualRisk">
		<TextAreaInput
			id="fcResidualRisk"
			label="Residual risk"
			rows={3}
			bind:value={d.forecast.fc_residual_risk}
		/>
	</Field>
</Fieldset>
