<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const f = assessment.data.functional;

	function setNyha(event: Event) {
		const v = (event.currentTarget as HTMLSelectElement).value;
		f.nyhaClass = v === '' ? null : Number(v);
	}
</script>

<Fieldset legend="Step 3 of 9 — Functional status">
	<p class="hint">
		NYHA class and symptoms. The NYHA class drives the functional-status classification: I–II is
		stable, III is symptomatic, IV is advanced.
	</p>

	<Field label="NYHA functional class" required inputId="functional-nyhaClass">
		<Select
			id="functional-nyhaClass"
			label="NYHA functional class"
			required
			value={f.nyhaClass === null ? '' : String(f.nyhaClass)}
			onchange={setNyha}
		>
			<option value="">— Select —</option>
			<option value="1">I — no limitation of ordinary activity</option>
			<option value="2">II — slight limitation; comfortable at rest</option>
			<option value="3">III — marked limitation; less than ordinary activity causes symptoms</option>
			<option value="4">IV — symptoms at rest</option>
		</Select>
	</Field>

	<Field label="Breathlessness" inputId="functional-breathlessness">
		<Select id="functional-breathlessness" label="Breathlessness" bind:value={f.breathlessness}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="on-exertion">On exertion</option>
			<option value="at-rest">At rest</option>
		</Select>
	</Field>

	<Field label="Orthopnoea" inputId="functional-orthopnoea">
		<Select id="functional-orthopnoea" label="Orthopnoea" bind:value={f.orthopnoea}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Paroxysmal nocturnal dyspnoea" inputId="functional-paroxysmalNocturnalDyspnoea">
		<Select
			id="functional-paroxysmalNocturnalDyspnoea"
			label="Paroxysmal nocturnal dyspnoea"
			bind:value={f.paroxysmalNocturnalDyspnoea}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Fatigue" inputId="functional-fatigue">
		<Select id="functional-fatigue" label="Fatigue" bind:value={f.fatigue}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Change since last review" inputId="functional-changeSinceLastReview">
		<Select
			id="functional-changeSinceLastReview"
			label="Change since last review"
			bind:value={f.changeSinceLastReview}
		>
			<option value="">— Select —</option>
			<option value="improved">Improved</option>
			<option value="unchanged">Unchanged</option>
			<option value="worse">Worse</option>
		</Select>
	</Field>

	<Field
		label="Documented decompensation since last review"
		inputId="functional-decompensation"
	>
		<Select
			id="functional-decompensation"
			label="Documented decompensation since last review"
			bind:value={f.decompensation}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
