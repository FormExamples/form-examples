<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';

	const d = $state(request.data.symptoms);
</script>

<Fieldset legend="Symptoms & accuracy factors">
	<p class="hint">
		Symptoms and oscillometric accuracy factors. Atrial fibrillation reduces ABPM accuracy.
	</p>

	<h3 class="subhead">Symptoms</h3>
	<label class="bool-field">
		<CheckboxInput id="symptomDizziness" label="Dizziness" bind:checked={d.symptomDizziness} />
		<span>Dizziness</span>
	</label>
	<label class="bool-field">
		<CheckboxInput id="symptomHeadache" label="Headache" bind:checked={d.symptomHeadache} />
		<span>Headache</span>
	</label>

	<h3 class="subhead">Accuracy factors</h3>
	<label class="bool-field">
		<CheckboxInput id="atrialFibrillation" label="Atrial fibrillation" bind:checked={d.atrialFibrillation} />
		<span>Atrial fibrillation</span>
	</label>
	<label class="bool-field">
		<CheckboxInput id="pregnant" label="Pregnant" bind:checked={d.pregnant} />
		<span>Pregnant</span>
	</label>
</Fieldset>

<style>
	.subhead {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.5rem 0;
	}
</style>
