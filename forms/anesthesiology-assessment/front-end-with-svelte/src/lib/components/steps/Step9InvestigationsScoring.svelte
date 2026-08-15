<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import YesNoField from '#lib/components/ui/YesNoField.svelte';

	const d = $state(assessment.data.investigationsAndPlan);
</script>

<Fieldset legend="Investigations & Scoring">
	<p class="hint">
		Pre-operative investigations, the RCRI cardiac-criteria confirmations, and the ASA Physical Status
		grade. The ASA grade is required.
	</p>

	<h3 class="group-title">Investigation status</h3>
	<div class="inv-grid">
		<Field label="Full blood count" inputId="fbcStatus">
			<Select id="fbcStatus" label="Full blood count" bind:value={d.fbcStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="Urea & electrolytes" inputId="ueStatus">
			<Select id="ueStatus" label="Urea & electrolytes" bind:value={d.ueStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="Liver function tests" inputId="lftsStatus">
			<Select id="lftsStatus" label="Liver function tests" bind:value={d.lftsStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="Coagulation" inputId="coagStatus">
			<Select id="coagStatus" label="Coagulation" bind:value={d.coagStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="HbA1c" inputId="hba1cStatus">
			<Select id="hba1cStatus" label="HbA1c" bind:value={d.hba1cStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="ECG" inputId="ecgStatus">
			<Select id="ecgStatus" label="ECG" bind:value={d.ecgStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="Chest X-ray" inputId="cxrStatus">
			<Select id="cxrStatus" label="Chest X-ray" bind:value={d.cxrStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
		<Field label="Echocardiogram" inputId="echoStatus">
			<Select id="echoStatus" label="Echocardiogram" bind:value={d.echoStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Other investigation" inputId="otherInvestigation">
			<TextInput id="otherInvestigation" label="Other investigation" bind:value={d.otherInvestigation} />
		</Field>
		<Field label="Other investigation status" inputId="otherInvestigationStatus">
			<Select id="otherInvestigationStatus" label="Other investigation status" bind:value={d.otherInvestigationStatus}>
				<option value="">Select…</option>
				<option value="not-required">Not required</option>
				<option value="ordered">Ordered</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
	</div>

	<h3 class="group-title">Revised Cardiac Risk Index (Lee) — clinician confirmations</h3>
	<p class="hint">
		High-risk surgery and insulin-dependent diabetes are counted automatically from earlier steps.
		Confirm the remaining criteria here.
	</p>
	<div class="yn-grid">
		<YesNoField label="Ischaemic heart disease?" name="rcriIschaemicHeartDisease" bind:value={d.rcriIschaemicHeartDisease} />
		<YesNoField label="Congestive heart failure?" name="rcriCongestiveHeartFailure" bind:value={d.rcriCongestiveHeartFailure} />
		<YesNoField label="Cerebrovascular disease (stroke / TIA)?" name="rcriCerebrovascularDisease" bind:value={d.rcriCerebrovascularDisease} />
		<YesNoField label="Serum creatinine > 177 µmol/L?" name="rcriHighCreatinine" bind:value={d.rcriHighCreatinine} />
	</div>

	<h3 class="group-title">ASA Physical Status</h3>
	<div class="field-grid">
		<Field label="ASA class" required inputId="asaClass">
			<Select id="asaClass" label="ASA class" required bind:value={d.asaClass}>
				<option value="">Select…</option>
				<option value="i">ASA I — Healthy</option>
				<option value="ii">ASA II — Mild systemic disease</option>
				<option value="iii">ASA III — Severe systemic disease</option>
				<option value="iv">ASA IV — Severe disease, constant threat to life</option>
				<option value="v">ASA V — Moribund</option>
				<option value="vi">ASA VI — Brain-dead, organ donor</option>
			</Select>
		</Field>
		<YesNoField label="Emergency case (ASA 'E')?" name="emergencyCase" bind:value={d.emergencyCase} />
	</div>
</Fieldset>

<style>
	.inv-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem 1rem;
	}
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.yn-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem 1.5rem;
	}
	.group-title {
		margin: 1.25rem 0 0.25rem;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--color-base-content);
		opacity: 0.7;
	}
	@media (max-width: 900px) {
		.inv-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.inv-grid,
		.field-grid,
		.yn-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
