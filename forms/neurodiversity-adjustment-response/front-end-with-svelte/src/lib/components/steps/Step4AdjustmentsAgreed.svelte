<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Adjustments Agreed">
	<p class="hint">
		Which categories of adjustment were agreed (mirroring the ACAS categories), the specific detail,
		and any alternatives offered.
	</p>

	<Field label="Adjustment categories agreed">
		<CheckboxGroup label="Adjustment categories agreed">
			<label><CheckboxInput label="Working environment" bind:checked={d.agreedWorkingEnvironment} /> Working environment</label>
			<label><CheckboxInput label="Equipment or assistive technology" bind:checked={d.agreedEquipmentTechnology} /> Equipment or assistive technology</label>
			<label><CheckboxInput label="Working arrangements" bind:checked={d.agreedWorkingArrangements} /> Working arrangements</label>
			<label><CheckboxInput label="Communication" bind:checked={d.agreedCommunication} /> Communication</label>
			<label><CheckboxInput label="Support or mentoring" bind:checked={d.agreedSupportMentoring} /> Support or mentoring</label>
			<label><CheckboxInput label="Recruitment / assessment process" bind:checked={d.agreedRecruitmentProcess} /> Recruitment / assessment process</label>
			<label><CheckboxInput label="Policy (dress code / uniform, absence)" bind:checked={d.agreedPolicyDress} /> Policy (dress code / uniform, absence)</label>
			<label><CheckboxInput label="Other" bind:checked={d.agreedOther} /> Other</label>
		</CheckboxGroup>
	</Field>

	<Field
		label="Agreed-adjustments detail"
		inputId="agreedAdjustmentsDetail"
		description="Describe the specific adjustments agreed."
	>
		<TextAreaInput
			id="agreedAdjustmentsDetail"
			label="Agreed-adjustments detail"
			rows={4}
			placeholder="e.g. Noise-cancelling headphones, a quiet desk, written agendas in advance…"
			bind:value={d.agreedAdjustmentsDetail}
		/>
	</Field>

	<Field
		label="Alternative adjustments offered"
		inputId="alternativeAdjustmentsDetail"
		description="Any alternatives offered where the original request was not agreed as-is."
	>
		<TextAreaInput
			id="alternativeAdjustmentsDetail"
			label="Alternative adjustments offered"
			rows={3}
			placeholder="e.g. An approved equivalent tool in place of the requested software…"
			bind:value={d.alternativeAdjustmentsDetail}
		/>
	</Field>
</Fieldset>
