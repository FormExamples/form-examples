<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { isIonisingStudy, isBariumStudy } from '#lib/engine/utils.js';

	const d = request.data.safety;
	const req = request.data.request;

	const pregnantWithIonising = $derived(
		(d.pregnancyStatus === 'pregnant' || d.pregnancyStatus === 'possible') &&
			isIonisingStudy(req.studyType)
	);
	const bariumPerforation = $derived(
		req.primaryIndication === 'suspected-perforation' && isBariumStudy(req.studyType)
	);
</script>

<Fieldset legend="4. Safety and Radiation">
	<p class="hint">
		Pregnancy, contrast allergy, aspiration risk, and the IR(ME)R justification for the exposure.
	</p>

	<Field label="Pregnancy status" inputId="pregnancyStatus" required>
		<Select id="pregnancyStatus" label="Pregnancy status" bind:value={d.pregnancyStatus} required>
			<option value="">Select…</option>
			<option value="not-pregnant">Not pregnant</option>
			<option value="pregnant">Pregnant</option>
			<option value="possible">Possibly pregnant</option>
			<option value="unknown">Unknown</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	{#if pregnantWithIonising}
		<Alert type="error" heading="Pregnancy with an ionising study — contraindicated">
			<p>
				A pregnant or possibly-pregnant patient with an ionising-radiation study is contraindicated.
				Defer to confirm status, justify the exposure per IR(ME)R, or use a non-ionising alternative.
			</p>
		</Alert>
	{:else if d.pregnancyStatus === 'unknown' && isIonisingStudy(req.studyType)}
		<Alert type="warning" heading="Pregnancy status unknown">
			<p>Confirm pregnancy status (LMP / test) before exposure; apply the 28-day / 10-day rule.</p>
		</Alert>
	{/if}

	{#if bariumPerforation}
		<Alert type="error" heading="Barium for suspected perforation — contraindicated">
			<p>
				Barium is contraindicated when perforation is suspected (peritonitis / mediastinitis risk).
				Redirect to a water-soluble contrast study.
			</p>
		</Alert>
	{/if}

	<Field label="Risk factors">
		<CheckboxGroup label="Risk factors">
			<label
				><CheckboxInput label="Known contrast-media allergy" bind:checked={d.contrastAllergy} /> Known
				contrast-media allergy</label
			>
			<label
				><CheckboxInput label="Aspiration risk" bind:checked={d.aspirationRisk} /> Aspiration risk</label
			>
			<label><CheckboxInput label="Diabetes" bind:checked={d.diabetes} /> Diabetes</label>
		</CheckboxGroup>
	</Field>

	<Field
		label="IR(ME)R justification"
		inputId="irMeRJustification"
		description="Clinical justification for the radiation exposure."
	>
		<TextAreaInput
			id="irMeRJustification"
			label="IR(ME)R justification"
			rows={3}
			placeholder="e.g. Investigate progressive dysphagia; no recent equivalent imaging…"
			bind:value={d.irMeRJustification}
		/>
	</Field>
</Fieldset>
