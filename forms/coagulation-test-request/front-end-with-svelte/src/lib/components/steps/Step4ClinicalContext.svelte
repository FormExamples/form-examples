<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';

	const c = request.data.clinical;
</script>

<Fieldset legend="4. Clinical Context">
	<p class="hint">Indication and details drive every grading axis — they are the highest-value fields.</p>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={c.primaryIndication} required>
			<option value="">Select…</option>
			<option value="anticoagulation-monitoring">Anticoagulation monitoring</option>
			<option value="bleeding-disorder">Bleeding disorder</option>
			<option value="suspected-dvt-pe">Suspected DVT / PE</option>
			<option value="pre-operative">Pre-operative</option>
			<option value="thrombophilia-investigation">Thrombophilia investigation</option>
			<option value="liver-disease">Liver disease</option>
			<option value="disseminated-intravascular-coagulation">Disseminated intravascular coagulation</option>
			<option value="abnormal-bleeding">Abnormal bleeding</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinical details" inputId="clinicalDetails" required>
		<TextAreaInput
			id="clinicalDetails"
			label="Clinical details"
			rows={3}
			placeholder="e.g. Warfarin dose review; INR last week 3.8; no active bleeding."
			bind:value={c.clinicalDetails}
		/>
	</Field>

	<Field label="Anticoagulant">
		<CheckboxGroup label="Anticoagulant">
			<label>
				<CheckboxInput label="Patient is currently on an anticoagulant" bind:checked={c.onAnticoagulant} />
				Patient is currently on an anticoagulant
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
		<TextInput
			id="anticoagulantAgent"
			label="Anticoagulant agent"
			placeholder="e.g. warfarin, apixaban, LMWH"
			bind:value={c.anticoagulantAgent}
		/>
	</Field>

	<Field label="Bleeding / thrombosis context">
		<CheckboxGroup label="Bleeding / thrombosis context">
			<label>
				<CheckboxInput label="Personal or family bleeding history" bind:checked={c.bleedingHistory} />
				Personal or family bleeding history
			</label>
			<label>
				<CheckboxInput label="Personal or family thrombosis history" bind:checked={c.thrombosisHistory} />
				Personal or family thrombosis history
			</label>
			<label>
				<CheckboxInput label="Active major bleeding now (auto-escalates triage to STAT)" bind:checked={c.activeBleeding} />
				Active major bleeding now (auto-escalates triage to STAT)
			</label>
			<label>
				<CheckboxInput label="Suspected disseminated intravascular coagulation (DIC)" bind:checked={c.suspectedDic} />
				Suspected disseminated intravascular coagulation (DIC)
			</label>
			<label>
				<CheckboxInput label="For suspected DVT / PE: 2-level Wells score is unlikely" bind:checked={c.wellsUnlikely} />
				For suspected DVT / PE: 2-level Wells score is "unlikely"
			</label>
		</CheckboxGroup>
	</Field>

	{#if c.activeBleeding || c.suspectedDic || c.primaryIndication === 'disseminated-intravascular-coagulation'}
		<Alert type="error" heading="STAT escalation">
			<p>
				Active major bleeding or suspected DIC auto-escalates triage to STAT regardless of the
				requested urgency. Alert the haematology team.
			</p>
		</Alert>
	{/if}
</Fieldset>
