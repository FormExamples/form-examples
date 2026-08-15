<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeMentalHealthActAssessment } from '#lib/engine/mha-grader.js';
	import {
		completenessStatusLabel,
		completenessStatusColor,
		urgencyLabel,
		urgencyColor,
		sectionClassLabel
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.recommendation;
	const grade = $derived(gradeMentalHealthActAssessment(assessment.data));
	const signatoriesPresent = $derived(grade.requiredSignatories.filter((s) => s.present).length);
	const signatoriesTotal = $derived(grade.requiredSignatories.length);
</script>

<Fieldset legend="Step 9 of 9 — Recommended section and outcome">
	<p class="hint">
		The recommended section, the outcome, and conveyance. This records a recommendation — it is
		<strong>not</strong> an automated decision to detain. The prescribed statutory forms remain the
		definitive legal record.
	</p>

	<Field label="Recommended section" required inputId="recommendation-recommendedSection">
		<Select
			id="recommendation-recommendedSection"
			label="Recommended section"
			required
			bind:value={r.recommendedSection}
		>
			<option value="">— Select —</option>
			<option value="2">Section 2 — admission for assessment (28 days)</option>
			<option value="3">Section 3 — admission for treatment (6 months)</option>
			<option value="4">Section 4 — emergency admission (72 hours)</option>
			<option value="5-2">Section 5(2) — doctor’s holding power (72 hours)</option>
			<option value="5-4">Section 5(4) — nurse’s holding power (6 hours)</option>
			<option value="136">Section 136 — police place-of-safety power (24 hours)</option>
			<option value="none">None — informal admission or community outcome</option>
		</Select>
	</Field>

	<Field label="Outcome" required inputId="recommendation-outcome">
		<Select id="recommendation-outcome" label="Outcome" required bind:value={r.outcome}>
			<option value="">— Select —</option>
			<option value="detain-under-section">Detain under section</option>
			<option value="informal-admission">Informal admission</option>
			<option value="community">Community / care in the community</option>
			<option value="no-action">No action</option>
		</Select>
	</Field>

	<Field label="Receiving bed identified?" inputId="recommendation-bedIdentified">
		<Select
			id="recommendation-bedIdentified"
			label="Receiving bed identified?"
			bind:value={r.bedIdentified}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Conveyance" inputId="recommendation-conveyance">
		<Select id="recommendation-conveyance" label="Conveyance" bind:value={r.conveyance}>
			<option value="">— Select —</option>
			<option value="ambulance">Ambulance</option>
			<option value="police">Police</option>
			<option value="self">Self / own transport</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinical and legal note" inputId="recommendation-clinicalLegalNote">
		<TextAreaInput
			id="recommendation-clinicalLegalNote"
			label="Clinical and legal note"
			rows={4}
			placeholder="Free-text clinical and legal note."
			bind:value={r.clinicalLegalNote}
		/>
	</Field>

	<Field label="Live validation status">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {completenessStatusColor(
					grade.completenessStatus
				)}"
			>
				{completenessStatusLabel(grade.completenessStatus)}
			</span>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {urgencyColor(
					grade.urgencyClass
				)}"
			>
				{urgencyLabel(grade.urgencyClass)}
			</span>
			<span class="text-sm font-semibold text-base-content">
				{sectionClassLabel(grade.recommendedSectionClass)}
			</span>
			<span class="text-sm text-base-content/70">
				({signatoriesPresent} of {signatoriesTotal} required signatories present)
			</span>
		</span>
	</Field>
</Fieldset>
