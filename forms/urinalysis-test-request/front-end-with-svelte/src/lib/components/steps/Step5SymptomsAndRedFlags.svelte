<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { requestStore } from '$lib/stores/request.svelte';

	const d = requestStore.data.symptoms;
</script>

<Fieldset legend="5. Symptoms and Red Flags">
	<p class="hint">Red flags auto-escalate the triage tier regardless of the other axes.</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label><CheckboxInput label="Dysuria (painful urination)" bind:checked={d.symptomDysuria} /> Dysuria (painful urination)</label>
			<label><CheckboxInput label="Frequency / urgency" bind:checked={d.symptomFrequency} /> Frequency / urgency</label>
			<label><CheckboxInput label="Visible (macroscopic) haematuria" bind:checked={d.symptomVisibleHaematuria} /> Visible (macroscopic) haematuria</label>
			<label><CheckboxInput label="Loin / flank pain" bind:checked={d.symptomLoinPain} /> Loin / flank pain</label>
			<label><CheckboxInput label="Fever / systemic symptoms" bind:checked={d.symptomFever} /> Fever / systemic symptoms</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
