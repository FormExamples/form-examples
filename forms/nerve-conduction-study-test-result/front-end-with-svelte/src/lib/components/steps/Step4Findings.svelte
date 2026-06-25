<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The nerve-conduction and needle-EMG narratives plus structured finding flags.</p>

	<Field label="Nerve-conduction findings" inputId="nerveConductionFindings">
		<TextAreaInput
			id="nerveConductionFindings"
			label="Nerve-conduction findings"
			rows={4}
			placeholder="Latencies, amplitudes, conduction velocities, conduction block…"
			bind:value={d.nerveConductionFindings}
		/>
	</Field>

	<Field label="EMG findings" inputId="emgFindings">
		<TextAreaInput
			id="emgFindings"
			label="EMG findings"
			rows={4}
			placeholder="Insertional / spontaneous activity, motor-unit morphology, recruitment…"
			bind:value={d.emgFindings}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Carpal tunnel syndrome" bind:checked={d.carpalTunnelSyndrome} /> Carpal tunnel syndrome</label>
			<label><CheckboxInput label="Peripheral neuropathy" bind:checked={d.peripheralNeuropathy} /> Peripheral neuropathy</label>
			<label><CheckboxInput label="Radiculopathy" bind:checked={d.radiculopathy} /> Radiculopathy</label>
			<label><CheckboxInput label="Motor neurone disease features" bind:checked={d.motorNeuroneDiseaseFeatures} /> Motor neurone disease features</label>
			<label><CheckboxInput label="Myopathy" bind:checked={d.myopathy} /> Myopathy</label>
			<label><CheckboxInput label="Neuromuscular junction disorder" bind:checked={d.neuromuscularJunctionDisorder} /> Neuromuscular junction disorder</label>
			<label><CheckboxInput label="Normal study" bind:checked={d.normalStudy} /> Normal study</label>
		</CheckboxGroup>
	</Field>

	{#if d.motorNeuroneDiseaseFeatures}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Motor neurone disease / anterior-horn-cell features auto-escalate the follow-up urgency to a
				critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
