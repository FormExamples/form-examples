<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="7. Risk Factors">
	<p class="hint">Maternal and obstetric risk factors relevant to surveillance.</p>

	<Field label="Risk factors present">
		<CheckboxGroup label="Risk factors present">
			<label
				><CheckboxInput label="Hypertension" bind:checked={d.riskFactors.hypertension} /> Hypertension</label
			>
			<label><CheckboxInput label="Diabetes" bind:checked={d.riskFactors.diabetes} /> Diabetes</label>
			<label
				><CheckboxInput
					label="Previous growth restriction (SGA / FGR)"
					bind:checked={d.riskFactors.previousGrowthRestriction}
				/> Previous growth restriction (SGA / FGR)</label
			>
			<label
				><CheckboxInput
					label="Previous preterm birth"
					bind:checked={d.riskFactors.previousPretermBirth}
				/> Previous preterm birth</label
			>
			<label
				><CheckboxInput
					label="Previous caesarean section"
					bind:checked={d.riskFactors.previousCaesarean}
				/> Previous caesarean section</label
			>
			<label
				><CheckboxInput label="Current smoker" bind:checked={d.riskFactors.smoker} /> Current smoker</label
			>
		</CheckboxGroup>
	</Field>
</Fieldset>
