<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="5. Preparation">
	<p class="hint">Flag the preparation the patient must complete — drives the suitability axis.</p>

	<Field label="Preparation flagged">
		<CheckboxGroup label="Preparation flagged">
			<label><CheckboxInput label="Fasting required" bind:checked={d.prep.fastingRequired} /> Fasting required (e.g. upper-abdominal / biliary)</label>
			<label><CheckboxInput label="Full bladder required" bind:checked={d.prep.fullBladderRequired} /> Full bladder required (e.g. pelvic / lower urinary tract)</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
