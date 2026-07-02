<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const co = assessment.data.complications;
</script>

<Fieldset legend="Step 11 of 12 — Complications and target-organ damage">
	<p class="hint">
		Left-ventricular hypertrophy, retinopathy, CKD progression, prior stroke/MI, heart failure.
	</p>

	<Field label="Complications" inputId="complications-complications">
		<TextAreaInput
			id="complications-complications"
			label="Complications"
			rows={4}
			placeholder="Free-text record of hypertension-related complications or target-organ damage."
			bind:value={co.complications}
		/>
	</Field>
</Fieldset>
