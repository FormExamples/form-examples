<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Structured Findings">
	<p class="hint">Structured finding flags that drive classification, severity, and alerts.</p>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Pericardial effusion" bind:checked={d.pericardialEffusion} /> Pericardial effusion</label>
			<label><CheckboxInput label="Vegetation (suspected endocarditis)" bind:checked={d.vegetation} /> Vegetation (suspected endocarditis)</label>
			<label><CheckboxInput label="Intracardiac thrombus" bind:checked={d.intracardiacThrombus} /> Intracardiac thrombus</label>
			<label><CheckboxInput label="Normal study" bind:checked={d.normalStudy} /> Normal study</label>
		</CheckboxGroup>
	</Field>

	{#if d.pericardialEffusion || d.vegetation || d.intracardiacThrombus}
		<Alert type="error" heading="Critical finding selected">
			<p>
				A pericardial effusion, vegetation, or intracardiac thrombus auto-escalates the follow-up
				urgency to a critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
