<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { requestStore } from '$lib/stores/result.svelte';

	const d = requestStore.data.procedural;
</script>

<Fieldset legend="6. Procedural Risk">
	<p class="hint">Oxygen dependence, ASA grade, and planned sedation drive the pre-procedure risk axis.</p>

	<Field label="Oxygen and stability">
		<CheckboxGroup label="Oxygen and stability">
			<label>
				<CheckboxInput label="Oxygen-dependent (hypoxia)" bind:checked={d.oxygenDependent} />
				Oxygen-dependent (hypoxia)
			</label>
			<label>
				<CheckboxInput label="Haemodynamically unstable" bind:checked={d.haemodynamicallyUnstable} />
				Haemodynamically unstable
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.haemodynamicallyUnstable}
		<Alert type="error" heading="Haemodynamic instability — emergency">
			<p>Haemodynamic instability auto-escalates triage to emergency.</p>
		</Alert>
	{:else if d.oxygenDependent}
		<Alert type="warning" heading="Hypoxia — high procedural risk">
			<p>Plan an oxygenation / ventilation strategy and consider anaesthetic support.</p>
		</Alert>
	{/if}

	<Field label="ASA grade" inputId="asaGrade" description="ASA physical-status classification.">
		<Select id="asaGrade" label="ASA grade" bind:value={d.asaGrade}>
			<option value="">Select…</option>
			<option value="I">I — healthy</option>
			<option value="II">II — mild systemic disease</option>
			<option value="III">III — severe systemic disease</option>
			<option value="IV">IV — severe disease, constant threat to life</option>
			<option value="V">V — moribund</option>
		</Select>
	</Field>

	<Field label="Planned sedation" inputId="sedation">
		<Select id="sedation" label="Planned sedation" bind:value={d.sedation}>
			<option value="">Select…</option>
			<option value="none">None / local anaesthetic only</option>
			<option value="conscious">Conscious sedation</option>
			<option value="deep">Deep sedation</option>
			<option value="general-anaesthetic">General anaesthetic</option>
		</Select>
	</Field>
</Fieldset>
