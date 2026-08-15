<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const m = assessment.data.medication;
</script>

<Fieldset legend="Step 6 of 9 — Medication optimisation">
	<p class="hint">
		The four pillars of guideline-directed medical therapy, plus loop diuretic and other
		medications. Each indicated pillar prescribed (or documented contraindicated) counts toward the
		optimisation status.
	</p>

	<!-- Pillar 1 — ACEi / ARB / ARNI -->
	<p class="section-title font-semibold text-base-content">ACEi / ARB / ARNI (RAAS inhibitor)</p>
	<Field label="RAAS inhibitor — status" inputId="medication-raasInhibitorStatus">
		<Select
			id="medication-raasInhibitorStatus"
			label="RAAS inhibitor — status"
			bind:value={m.raasInhibitorStatus}
		>
			<option value="">— Select —</option>
			<option value="prescribed">Prescribed</option>
			<option value="not-prescribed">Not prescribed</option>
			<option value="contraindicated">Contraindicated</option>
			<option value="not-tolerated">Not tolerated</option>
		</Select>
	</Field>
	<Field label="RAAS inhibitor — agent" inputId="medication-raasInhibitorAgent">
		<TextInput
			id="medication-raasInhibitorAgent"
			label="RAAS inhibitor — agent"
			placeholder="Agent name"
			bind:value={m.raasInhibitorAgent}
		/>
	</Field>
	<Field label="RAAS inhibitor — current dose" inputId="medication-raasInhibitorDose">
		<TextInput
			id="medication-raasInhibitorDose"
			label="RAAS inhibitor — current dose"
			placeholder="e.g. 10 mg once daily"
			bind:value={m.raasInhibitorDose}
		/>
	</Field>
	<Field label="RAAS inhibitor — at target dose" inputId="medication-raasInhibitorAtTargetDose">
		<Select
			id="medication-raasInhibitorAtTargetDose"
			label="RAAS inhibitor — at target dose"
			bind:value={m.raasInhibitorAtTargetDose}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	<Field label="RAAS inhibitor — adherence" inputId="medication-raasInhibitorAdherence">
		<Select
			id="medication-raasInhibitorAdherence"
			label="RAAS inhibitor — adherence"
			bind:value={m.raasInhibitorAdherence}
		>
			<option value="">— Select —</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<!-- Pillar 2 — Beta-blocker -->
	<p class="section-title font-semibold text-base-content">Beta-blocker</p>
	<Field label="Beta-blocker — status" inputId="medication-betaBlockerStatus">
		<Select
			id="medication-betaBlockerStatus"
			label="Beta-blocker — status"
			bind:value={m.betaBlockerStatus}
		>
			<option value="">— Select —</option>
			<option value="prescribed">Prescribed</option>
			<option value="not-prescribed">Not prescribed</option>
			<option value="contraindicated">Contraindicated</option>
			<option value="not-tolerated">Not tolerated</option>
		</Select>
	</Field>
	<Field label="Beta-blocker — agent" inputId="medication-betaBlockerAgent">
		<TextInput
			id="medication-betaBlockerAgent"
			label="Beta-blocker — agent"
			placeholder="Agent name"
			bind:value={m.betaBlockerAgent}
		/>
	</Field>
	<Field label="Beta-blocker — current dose" inputId="medication-betaBlockerDose">
		<TextInput
			id="medication-betaBlockerDose"
			label="Beta-blocker — current dose"
			placeholder="e.g. 10 mg once daily"
			bind:value={m.betaBlockerDose}
		/>
	</Field>
	<Field label="Beta-blocker — at target dose" inputId="medication-betaBlockerAtTargetDose">
		<Select
			id="medication-betaBlockerAtTargetDose"
			label="Beta-blocker — at target dose"
			bind:value={m.betaBlockerAtTargetDose}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	<Field label="Beta-blocker — adherence" inputId="medication-betaBlockerAdherence">
		<Select
			id="medication-betaBlockerAdherence"
			label="Beta-blocker — adherence"
			bind:value={m.betaBlockerAdherence}
		>
			<option value="">— Select —</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<!-- Pillar 3 — MRA -->
	<p class="section-title font-semibold text-base-content">Mineralocorticoid receptor antagonist (MRA)</p>
	<Field label="MRA — status" inputId="medication-mraStatus">
		<Select id="medication-mraStatus" label="MRA — status" bind:value={m.mraStatus}>
			<option value="">— Select —</option>
			<option value="prescribed">Prescribed</option>
			<option value="not-prescribed">Not prescribed</option>
			<option value="contraindicated">Contraindicated</option>
			<option value="not-tolerated">Not tolerated</option>
		</Select>
	</Field>
	<Field label="MRA — agent" inputId="medication-mraAgent">
		<TextInput
			id="medication-mraAgent"
			label="MRA — agent"
			placeholder="Agent name"
			bind:value={m.mraAgent}
		/>
	</Field>
	<Field label="MRA — current dose" inputId="medication-mraDose">
		<TextInput
			id="medication-mraDose"
			label="MRA — current dose"
			placeholder="e.g. 25 mg once daily"
			bind:value={m.mraDose}
		/>
	</Field>
	<Field label="MRA — at target dose" inputId="medication-mraAtTargetDose">
		<Select
			id="medication-mraAtTargetDose"
			label="MRA — at target dose"
			bind:value={m.mraAtTargetDose}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	<Field label="MRA — adherence" inputId="medication-mraAdherence">
		<Select id="medication-mraAdherence" label="MRA — adherence" bind:value={m.mraAdherence}>
			<option value="">— Select —</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<!-- Pillar 4 — SGLT2 inhibitor -->
	<p class="section-title font-semibold text-base-content">SGLT2 inhibitor</p>
	<Field label="SGLT2 inhibitor — status" inputId="medication-sglt2InhibitorStatus">
		<Select
			id="medication-sglt2InhibitorStatus"
			label="SGLT2 inhibitor — status"
			bind:value={m.sglt2InhibitorStatus}
		>
			<option value="">— Select —</option>
			<option value="prescribed">Prescribed</option>
			<option value="not-prescribed">Not prescribed</option>
			<option value="contraindicated">Contraindicated</option>
			<option value="not-tolerated">Not tolerated</option>
		</Select>
	</Field>
	<Field label="SGLT2 inhibitor — agent" inputId="medication-sglt2InhibitorAgent">
		<TextInput
			id="medication-sglt2InhibitorAgent"
			label="SGLT2 inhibitor — agent"
			placeholder="Agent name"
			bind:value={m.sglt2InhibitorAgent}
		/>
	</Field>
	<Field label="SGLT2 inhibitor — current dose" inputId="medication-sglt2InhibitorDose">
		<TextInput
			id="medication-sglt2InhibitorDose"
			label="SGLT2 inhibitor — current dose"
			placeholder="e.g. 10 mg once daily"
			bind:value={m.sglt2InhibitorDose}
		/>
	</Field>
	<Field label="SGLT2 inhibitor — at target dose" inputId="medication-sglt2InhibitorAtTargetDose">
		<Select
			id="medication-sglt2InhibitorAtTargetDose"
			label="SGLT2 inhibitor — at target dose"
			bind:value={m.sglt2InhibitorAtTargetDose}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	<Field label="SGLT2 inhibitor — adherence" inputId="medication-sglt2InhibitorAdherence">
		<Select
			id="medication-sglt2InhibitorAdherence"
			label="SGLT2 inhibitor — adherence"
			bind:value={m.sglt2InhibitorAdherence}
		>
			<option value="">— Select —</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<!-- Other medications -->
	<p class="section-title font-semibold text-base-content">Other medications</p>
	<Field label="Loop diuretic — agent" inputId="medication-loopDiureticAgent">
		<TextInput
			id="medication-loopDiureticAgent"
			label="Loop diuretic — agent"
			placeholder="e.g. furosemide"
			bind:value={m.loopDiureticAgent}
		/>
	</Field>
	<Field label="Loop diuretic — dose" inputId="medication-loopDiureticDose">
		<TextInput
			id="medication-loopDiureticDose"
			label="Loop diuretic — dose"
			placeholder="e.g. 40 mg once daily"
			bind:value={m.loopDiureticDose}
		/>
	</Field>
	<Field label="Other relevant medications" inputId="medication-otherMedications">
		<TextAreaInput
			id="medication-otherMedications"
			label="Other relevant medications"
			rows={2}
			placeholder="Free-text list of other relevant medications."
			bind:value={m.otherMedications}
		/>
	</Field>
</Fieldset>
