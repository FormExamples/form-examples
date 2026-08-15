<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';

	const d = requestStore.data.safety;
</script>

<Fieldset legend="5. Radiation Safety">
	<p class="hint">Pregnancy status, recent similar imaging, and the IR(ME)R justification.</p>

	<Field label="Pregnancy status" inputId="pregnancyStatus" description="IR(ME)R 2017 pregnancy procedure.">
		<Select id="pregnancyStatus" label="Pregnancy status" bind:value={d.pregnancyStatus}>
			<option value="">Select…</option>
			<option value="not-applicable">Not applicable</option>
			<option value="not-pregnant">Not pregnant</option>
			<option value="possible">Possible</option>
			<option value="pregnant">Pregnant</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Recent imaging">
		<CheckboxGroup label="Recent imaging">
			<label>
				<CheckboxInput label="Recent similar X-ray" bind:checked={d.recentSimilarXray} />
				A similar X-ray of the same region was recently performed
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="IR(ME)R justification" inputId="irMeRJustification" description="Clinical benefit weighed against the radiation detriment.">
		<TextAreaInput
			id="irMeRJustification"
			label="IR(ME)R justification"
			rows={3}
			placeholder="Why the clinical benefit outweighs the radiation detriment…"
			bind:value={d.irMeRJustification}
		/>
	</Field>
</Fieldset>
