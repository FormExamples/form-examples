<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 10 — Assessment context">
	<p class="hint">
		Who is recording the observations, when and where, and which SpO2 scale is in use.
	</p>

	<Field label="Recording clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Recording clinician name"
			placeholder="e.g. Nurse J. Okafor"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="doctor">Doctor</option>
			<option value="nurse">Nurse</option>
			<option value="healthcare-assistant">Healthcare assistant</option>
			<option value="paramedic">Paramedic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of observation" inputId="context-observationAt">
		<TextInput
			id="context-observationAt"
			label="Date and time of observation"
			type="datetime-local"
			class="date-input"
			bind:value={c.observationAt}
		/>
	</Field>

	<Field label="Ward or location" inputId="context-wardOrLocation">
		<TextInput
			id="context-wardOrLocation"
			label="Ward or location"
			placeholder="e.g. Acute Medical Unit, Bay 3"
			bind:value={c.wardOrLocation}
		/>
	</Field>

	<Field
		label="SpO2 scale in use"
		required
		description="Scale 2 is only for a prescribed 88-92% target (e.g. hypercapnic respiratory failure) and must be endorsed by a competent clinician."
		inputId="context-spo2Scale"
	>
		<Select id="context-spo2Scale" label="SpO2 scale in use" required bind:value={c.spo2Scale}>
			<option value="">— Select —</option>
			<option value="scale-1">Scale 1 — default target (&ge; 96%)</option>
			<option value="scale-2">Scale 2 — target 88-92%</option>
		</Select>
	</Field>

	{#if c.spo2Scale === 'scale-2'}
		<Field label="Has a competent clinician endorsed Scale 2 for this patient?">
			<RadioGroup label="Has a competent clinician endorsed Scale 2 for this patient?">
				<label>
					<input
						type="radio"
						class="radio-input"
						name="context-spo2Scale2Endorsed"
						value="yes"
						bind:group={c.spo2Scale2Endorsed}
					/>
					Yes
				</label>
				<label>
					<input
						type="radio"
						class="radio-input"
						name="context-spo2Scale2Endorsed"
						value="no"
						bind:group={c.spo2Scale2Endorsed}
					/>
					No
				</label>
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>
