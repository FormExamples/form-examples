<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const e = assessment.data.rightEye;
</script>

<Fieldset legend="Step 3 of 5 — Right eye grading">
	<p class="hint">
		The retinopathy (R) grade, maculopathy (M) grade, photocoagulation (P) marker, and ungradable
		(U) marker for the right eye. An ungradable eye does not contribute a retinopathy grade.
	</p>

	<Field label="Retinopathy (R) grade" inputId="rightEye-retinopathy">
		<Select id="rightEye-retinopathy" label="Retinopathy (R) grade" bind:value={e.retinopathy}>
			<option value="">— Select —</option>
			<option value="R0">R0 — No diabetic retinopathy</option>
			<option value="R1">R1 — Background retinopathy</option>
			<option value="R2">R2 — Pre-proliferative retinopathy</option>
			<option value="R3A">R3A — Proliferative retinopathy (active)</option>
			<option value="R3S">R3S — Proliferative retinopathy (stable / treated)</option>
		</Select>
	</Field>

	<Field label="Maculopathy (M) grade" inputId="rightEye-maculopathy">
		<Select id="rightEye-maculopathy" label="Maculopathy (M) grade" bind:value={e.maculopathy}>
			<option value="">— Select —</option>
			<option value="M0">M0 — No diabetic maculopathy</option>
			<option value="M1">M1 — Diabetic maculopathy present</option>
		</Select>
	</Field>

	<Field label="Photocoagulation (P)" inputId="rightEye-photocoagulation">
		<Select
			id="rightEye-photocoagulation"
			label="Photocoagulation (P)"
			bind:value={e.photocoagulation}
		>
			<option value="">— Select —</option>
			<option value="no">No photocoagulation</option>
			<option value="yes">Photocoagulation present</option>
		</Select>
	</Field>

	<Field label="Ungradable (U)" inputId="rightEye-ungradable">
		<Select id="rightEye-ungradable" label="Ungradable (U)" bind:value={e.ungradable}>
			<option value="">— Select —</option>
			<option value="no">Gradable</option>
			<option value="yes">Ungradable</option>
		</Select>
	</Field>

	<Field label="Visual acuity" inputId="rightEye-visualAcuity">
		<TextInput
			id="rightEye-visualAcuity"
			label="Visual acuity"
			placeholder="e.g. 6/6 (Snellen) or logMAR 0.0"
			bind:value={e.visualAcuity}
		/>
	</Field>
</Fieldset>
