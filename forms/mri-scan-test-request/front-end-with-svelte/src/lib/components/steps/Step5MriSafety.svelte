<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';

	const d = request.data.safety;

	const statusOptions = [
		{ value: 'cleared', label: 'Cleared' },
		{ value: 'conditional', label: 'Conditional' },
		{ value: 'needs-review', label: 'Needs review' },
		{ value: 'unsafe', label: 'Unsafe' }
	];
</script>

<Fieldset legend="MRI safety screen">
	<p class="hint">
		Ferromagnetic and electronic implant screen. Positive items drive the MRI safety band toward
		needs-review or contraindicated.
	</p>

	<h3 class="subhead">Absolute / high-risk</h3>
	<label class="checkbox-row">
		<CheckboxInput id="pacemakerOrIcd" label="Cardiac pacemaker or ICD" bind:checked={d.pacemakerOrIcd} />
		Cardiac pacemaker or ICD
	</label>
	<label class="checkbox-row">
		<CheckboxInput id="aneurysmClip" label="Intracranial aneurysm clip" bind:checked={d.aneurysmClip} />
		Intracranial aneurysm clip
	</label>
	<label class="checkbox-row">
		<CheckboxInput id="metallicForeignBodyEye" label="Metallic foreign body in the eye / orbit" bind:checked={d.metallicForeignBodyEye} />
		Metallic foreign body in the eye / orbit
	</label>
	<label class="checkbox-row">
		<CheckboxInput id="shrapnelOrMetalFragments" label="Shrapnel or embedded metal fragments" bind:checked={d.shrapnelOrMetalFragments} />
		Shrapnel or embedded metal fragments
	</label>

	<h3 class="subhead">Conditional</h3>
	<label class="checkbox-row">
		<CheckboxInput id="cochlearImplant" label="Cochlear implant" bind:checked={d.cochlearImplant} />
		Cochlear implant
	</label>
	<label class="checkbox-row">
		<CheckboxInput id="programmableShunt" label="Programmable CSF shunt" bind:checked={d.programmableShunt} />
		Programmable CSF shunt
	</label>
	<label class="checkbox-row">
		<CheckboxInput id="neurostimulator" label="Neurostimulator (DBS / SCS / VNS)" bind:checked={d.neurostimulator} />
		Neurostimulator (DBS / SCS / VNS)
	</label>
	<label class="checkbox-row">
		<CheckboxInput id="metalImplantOrProsthesis" label="Metal implant or prosthesis" bind:checked={d.metalImplantOrProsthesis} />
		Metal implant or prosthesis
	</label>
	<label class="checkbox-row">
		<CheckboxInput id="insulinPump" label="Insulin pump or infusion device" bind:checked={d.insulinPump} />
		Insulin pump or infusion device
	</label>

	<h3 class="subhead">Logistical</h3>
	<label class="checkbox-row">
		<CheckboxInput id="claustrophobia" label="Claustrophobia" bind:checked={d.claustrophobia} />
		Claustrophobia
	</label>

	<Field label="Preliminary MRI safety status" inputId="mriSafetyStatus">
		<Select id="mriSafetyStatus" label="Preliminary MRI safety status" bind:value={d.mriSafetyStatus}>
			<option value="">— Select —</option>
			{#each statusOptions as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>

<style>
	.subhead {
		margin: 1rem 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.15rem 0;
	}
</style>
