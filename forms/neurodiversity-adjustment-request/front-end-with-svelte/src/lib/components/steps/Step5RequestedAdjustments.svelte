<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data;
</script>

<Fieldset legend="5. Requested Adjustments">
	<p class="hint">
		The specific adjustments requested, across the ACAS adjustment categories, plus free-text detail.
	</p>

	<Field label="Adjustment categories">
		<CheckboxGroup label="Adjustment categories">
			<label><CheckboxInput label="Working environment" bind:checked={d.adjustmentWorkingEnvironment} /> Working environment (quiet space, lighting, desk location)</label>
			<label><CheckboxInput label="Equipment / technology" bind:checked={d.adjustmentEquipmentTechnology} /> Equipment / technology (noise-cancelling headphones, screen reader, speech-to-text)</label>
			<label><CheckboxInput label="Working arrangements" bind:checked={d.adjustmentWorkingArrangements} /> Working arrangements (flexible hours, remote / hybrid, phased return, breaks)</label>
			<label><CheckboxInput label="Communication" bind:checked={d.adjustmentCommunication} /> Communication (written instructions, tasks in clear steps, regular check-ins)</label>
			<label><CheckboxInput label="Support / mentoring" bind:checked={d.adjustmentSupportMentoring} /> Support / mentoring (mentor / buddy, coaching, extra training)</label>
			<label><CheckboxInput label="Recruitment process" bind:checked={d.adjustmentRecruitmentProcess} /> Recruitment / assessment process</label>
			<label><CheckboxInput label="Policy / dress code" bind:checked={d.adjustmentPolicyDress} /> Policy / dress code (softer-material uniform, absence-policy flexibility)</label>
			<label><CheckboxInput label="Other adjustment" bind:checked={d.adjustmentOther} /> Other adjustment</label>
		</CheckboxGroup>
	</Field>

	<Field label="Requested-adjustments detail" inputId="adjustmentsRequestedDetail">
		<TextAreaInput
			id="adjustmentsRequestedDetail"
			label="Requested-adjustments detail"
			rows={4}
			placeholder="Describe the specific adjustments requested, e.g. noise-cancelling headphones plus a quiet desk away from the walkway…"
			bind:value={d.adjustmentsRequestedDetail}
		/>
	</Field>
</Fieldset>
