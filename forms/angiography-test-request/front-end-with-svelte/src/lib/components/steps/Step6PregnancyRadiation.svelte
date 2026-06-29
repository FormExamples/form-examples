<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = request.data.pregnancy;
</script>

<Fieldset legend="Pregnancy & radiation">
	<p class="hint">
		Pregnancy status and IR(ME)R justification for any ionising-radiation examination.
	</p>

	<Field label="Pregnancy status" inputId="pregnancyStatus">
		<Select id="pregnancyStatus" label="Pregnancy status" bind:value={p.pregnancyStatus}>
			<option value="">— Select —</option>
			<option value="not-pregnant">Not pregnant</option>
			<option value="pregnant">Pregnant</option>
			<option value="possible">Possible</option>
			<option value="unknown">Unknown</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="IR(ME)R justification" inputId="irMeRJustification">
		<TextAreaInput
			id="irMeRJustification"
			label="IR(ME)R justification"
			rows={2}
			placeholder="Justification for the radiation exposure under IR(ME)R 2017."
			bind:value={p.irMeRJustification}
		/>
	</Field>
</Fieldset>
