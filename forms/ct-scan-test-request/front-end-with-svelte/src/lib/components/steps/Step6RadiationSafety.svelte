<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.radiation;
</script>

<Fieldset legend="6. Radiation Safety">
	<p class="hint">Pregnancy status and the IR(ME)R radiation justification for this exposure.</p>

	<Field label="Pregnancy status" inputId="pregnancyStatus">
		<Select id="pregnancyStatus" label="Pregnancy status" bind:value={d.pregnancyStatus}>
			<option value="">Select…</option>
			<option value="not-pregnant">Not pregnant</option>
			<option value="pregnant">Pregnant</option>
			<option value="possible">Possible</option>
			<option value="unknown">Unknown</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	{#if d.pregnancyStatus === 'pregnant' || d.pregnancyStatus === 'possible'}
		<Alert type="warning" heading="Ionising-radiation exposure in pregnancy">
			<p>
				Confirm pregnancy status and justify under IR(ME)R. Consider non-ionising alternatives
				(MRI / ultrasound) and discuss with a radiologist.
			</p>
		</Alert>
	{/if}

	<Field label="IR(ME)R justification" inputId="irMeRJustification" description="Every medical exposure must be justified under IR(ME)R 2017.">
		<TextAreaInput
			id="irMeRJustification"
			label="IR(ME)R justification"
			rows={3}
			placeholder="Why the clinical benefit of this exposure outweighs the radiation detriment…"
			bind:value={d.irMeRJustification}
		/>
	</Field>
</Fieldset>
