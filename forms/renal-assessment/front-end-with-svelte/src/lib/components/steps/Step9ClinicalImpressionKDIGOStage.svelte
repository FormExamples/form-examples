<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.clinicalImpression;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Clinical Impression & KDIGO Stage">
	<p class="hint">
		Clinician synthesis. Leave GFR / albuminuria categories blank to auto-derive from labs.
	</p>

	<div class="field-grid">
		<Field label="GFR category (override auto-derived)" inputId="gfrCategory">
			<Select id="gfrCategory" label="GFR category" bind:value={c.gfrCategory}>
				<option value="">— Auto-derive —</option>
				<option value="G1">G1: ≥90</option>
				<option value="G2">G2: 60-89</option>
				<option value="G3a">G3a: 45-59</option>
				<option value="G3b">G3b: 30-44</option>
				<option value="G4">G4: 15-29</option>
				<option value="G5">G5: &lt;15 (kidney failure)</option>
			</Select>
		</Field>
		<Field label="Albuminuria category (override auto-derived)" inputId="albuminuriaCategory">
			<Select id="albuminuriaCategory" label="Albuminuria category" bind:value={c.albuminuriaCategory}>
				<option value="">— Auto-derive —</option>
				<option value="A1">A1: &lt;3 mg/mmol</option>
				<option value="A2">A2: 3-30 mg/mmol</option>
				<option value="A3">A3: &gt;30 mg/mmol</option>
			</Select>
		</Field>
	</div>

	<Field label="Suspected etiology" inputId="suspectedEtiology">
		<Select id="suspectedEtiology" label="Suspected etiology" bind:value={c.suspectedEtiology}>
			<option value="">— Select —</option>
			<option value="diabetic-nephropathy">Diabetic nephropathy</option>
			<option value="hypertensive-nephrosclerosis">Hypertensive nephrosclerosis</option>
			<option value="glomerulonephritis">Glomerulonephritis</option>
			<option value="polycystic-kidney-disease">Polycystic kidney disease</option>
			<option value="tubulointerstitial">Tubulointerstitial disease</option>
			<option value="obstructive-uropathy">Obstructive uropathy</option>
			<option value="vascular">Renovascular disease</option>
			<option value="drug-induced">Drug-induced nephropathy</option>
			<option value="unknown">Unknown / under investigation</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Acute kidney injury superimposed on CKD?">
		<RadioGroup label="Acute kidney injury superimposed on CKD?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="akiOnCkd" value={opt.value} bind:group={c.aksuperimposedOnCkd} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Nephrology referral indicated?">
		<RadioGroup label="Nephrology referral indicated?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="referral" value={opt.value} bind:group={c.nephrologyReferral} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.nephrologyReferral === 'yes'}
		<Field label="Referral urgency" inputId="referralUrgency">
			<Select id="referralUrgency" label="Referral urgency" bind:value={c.referralUrgency}>
				<option value="">— Select —</option>
				<option value="urgent">Urgent (within 1 week)</option>
				<option value="soon">Soon (within 4 weeks)</option>
				<option value="routine">Routine</option>
			</Select>
		</Field>
	{/if}

	<Field label="Dialysis discussion needed?">
		<RadioGroup label="Dialysis discussion needed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dialysis" value={opt.value} bind:group={c.dialysisDiscussionNeeded} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Transplant candidate?">
		<RadioGroup label="Transplant candidate?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="transplant" value={opt.value} bind:group={c.transplantCandidate} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Management plan" inputId="managementPlan">
		<TextAreaInput id="managementPlan" label="Management plan" rows={4} placeholder="Targets, RAAS / SGLT2 plan, anemia management, MBD, lifestyle…" bind:value={c.managementPlan} />
	</Field>

	<Field label="Follow-up interval" inputId="followUpInterval">
		<Select id="followUpInterval" label="Follow-up interval" bind:value={c.followUpInterval}>
			<option value="">— Select —</option>
			<option value="1-month">1 month</option>
			<option value="3-months">3 months</option>
			<option value="6-months">6 months</option>
			<option value="12-months">12 months</option>
			<option value="as-needed">As needed</option>
		</Select>
	</Field>

	<Field label="Clinician notes" inputId="clinicianNotes">
		<TextAreaInput id="clinicianNotes" label="Clinician notes" rows={3} bind:value={c.clinicianNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
