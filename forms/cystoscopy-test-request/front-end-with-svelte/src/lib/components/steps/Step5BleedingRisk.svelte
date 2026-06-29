<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const b = requestStore.data.bleeding;
</script>

<Fieldset legend="5. Bleeding Risk">
	<p class="hint">
		Anticoagulation and antiplatelet therapy drive the pre-procedure risk axis and the
		anticoagulant action for the booking team.
	</p>

	<Field label="Bleeding-risk factors">
		<CheckboxGroup label="Bleeding-risk factors">
			<label><CheckboxInput label="Taking anticoagulant" bind:checked={b.takingAnticoagulant} /> Taking an anticoagulant</label>
			<label><CheckboxInput label="Taking antiplatelet" bind:checked={b.takingAntiplatelet} /> Taking an antiplatelet agent</label>
			<label><CheckboxInput label="Previous bladder cancer" bind:checked={b.previousBladderCancer} /> Previous bladder cancer</label>
		</CheckboxGroup>
	</Field>

	{#if b.takingAnticoagulant}
		<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
			<TextInput
				id="anticoagulantAgent"
				label="Anticoagulant agent"
				placeholder="e.g. warfarin, apixaban, rivaroxaban"
				bind:value={b.anticoagulantAgent}
			/>
		</Field>
		<Alert type="warning" heading="High bleeding risk on anticoagulation">
			<p>
				Confirm the agent and indication; plan peri-procedure hold / bridging per local
				anticoagulation policy before any biopsy or resection.
			</p>
		</Alert>
	{/if}
</Fieldset>
