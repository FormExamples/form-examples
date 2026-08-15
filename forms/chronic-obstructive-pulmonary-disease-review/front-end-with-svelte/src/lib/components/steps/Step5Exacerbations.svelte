<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const e = assessment.data.exacerbations;
</script>

<Fieldset legend="Step 5 of 11 — Exacerbations (past 12 months)">
	<p class="hint">Exacerbation history feeds the exacerbation-risk axis of the ABE group.</p>

	<Field
		label="Moderate exacerbations in past 12 months"
		inputId="exacerbations-exacerbationsLast12m"
		description="≥ 2 drives high exacerbation risk."
	>
		<NumberInput
			id="exacerbations-exacerbationsLast12m"
			label="Moderate exacerbations in past 12 months"
			min={0}
			max={30}
			step={1}
			bind:value={e.exacerbationsLast12m}
		/>
	</Field>

	<Field
		label="Exacerbations needing hospital admission"
		inputId="exacerbations-hospitalisationsLast12m"
		description="≥ 1 drives high exacerbation risk."
	>
		<NumberInput
			id="exacerbations-hospitalisationsLast12m"
			label="Exacerbations needing hospital admission"
			min={0}
			max={30}
			step={1}
			bind:value={e.hospitalisationsLast12m}
		/>
	</Field>

	<Field label="Date of most recent exacerbation" inputId="exacerbations-lastExacerbationDate">
		<TextInput
			id="exacerbations-lastExacerbationDate"
			label="Date of most recent exacerbation"
			type="date"
			class="date-input"
			bind:value={e.lastExacerbationDate}
		/>
	</Field>

	<Field label="Rescue-pack courses used" inputId="exacerbations-rescuePackCourses">
		<NumberInput
			id="exacerbations-rescuePackCourses"
			label="Rescue-pack courses used"
			min={0}
			max={30}
			step={1}
			bind:value={e.rescuePackCourses}
		/>
	</Field>
</Fieldset>
