<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.riskFactors;
</script>

<Fieldset legend="6. Risk Factors">
	<p class="hint">Risk factors that raise clinical priority.</p>

	<Field label="Risk factors">
		<CheckboxGroup label="Risk factors">
			<label><CheckboxInput label="Diabetes (retinopathy risk)" bind:checked={d.diabetes} /> Diabetes (retinopathy risk)</label>
			<label><CheckboxInput label="Known glaucoma" bind:checked={d.knownGlaucoma} /> Known glaucoma</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
