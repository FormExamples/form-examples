<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="4. Clinical Details">
	<p class="hint">
		The clinical details / phenotype, suspected condition, and family history that drive eligibility
		and test selection.
	</p>

	<Field
		label="Clinical details / phenotype"
		inputId="clinicalDetails"
		description="e.g. HPO terms, presentation, examination findings."
	>
		<TextAreaInput
			id="clinicalDetails"
			label="Clinical details / phenotype"
			rows={3}
			placeholder="Clinical details and phenotype…"
			bind:value={d.clinical.clinicalDetails}
		/>
	</Field>

	<Field label="Suspected condition" inputId="suspectedCondition">
		<TextInput
			id="suspectedCondition"
			label="Suspected condition"
			placeholder="e.g. hereditary breast and ovarian cancer syndrome"
			bind:value={d.clinical.suspectedCondition}
		/>
	</Field>

	<Field
		label="Family history"
		inputId="familyHistory"
		description="Pedigree summary; inheritance pattern informs eligibility."
	>
		<TextAreaInput
			id="familyHistory"
			label="Family history"
			rows={3}
			placeholder="Relevant family history / pedigree summary…"
			bind:value={d.clinical.familyHistory}
		/>
	</Field>

	<Field label="Affected relative tested">
		<CheckboxGroup label="Affected relative tested">
			<label>
				<CheckboxInput
					label="An affected relative has already been genetically tested"
					bind:checked={d.clinical.affectedRelativeTested}
				/> An affected relative has already been genetically tested
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
