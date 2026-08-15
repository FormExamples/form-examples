<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = request.data.justification;
</script>

<Fieldset legend="IR(ME)R justification">
	<p class="hint">
		Referrer justification statement for the exposure and the responsible supervising consultant.
	</p>

	<Field label="IR(ME)R justification statement" required inputId="irMeRJustification">
		<TextAreaInput
			id="irMeRJustification"
			label="IR(ME)R justification statement"
			rows={3}
			required
			bind:value={d.irMeRJustification}
		/>
	</Field>

	<Field label="Supervising / responsible consultant" inputId="justificationSupervisingConsultant">
		<TextInput
			id="justificationSupervisingConsultant"
			label="Supervising / responsible consultant"
			bind:value={d.supervisingConsultant}
		/>
	</Field>
</Fieldset>
