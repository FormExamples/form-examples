<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Measurements">
	<p class="hint">Key measurement for surveillance and categorisation.</p>

	<Field
		label="Largest lesion size (mm)"
		inputId="largestLesionSizeMm"
		description="Largest lesion long-axis size, for surveillance and categorisation."
	>
		<NumberInput
			id="largestLesionSizeMm"
			label="Largest lesion size (mm)"
			min={0}
			max={2000}
			step={0.1}
			bind:value={d.largestLesionSizeMm}
		/>
	</Field>
</Fieldset>
