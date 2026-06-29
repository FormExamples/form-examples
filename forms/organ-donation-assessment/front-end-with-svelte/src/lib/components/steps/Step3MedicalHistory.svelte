<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const conds: { yn: 'hasAutoimmuneDisease' | 'hasDiabetes' | 'hasHypertension' | 'hasCardiovascularDisease'; det: 'autoimmuneDetails' | 'diabetesDetails' | 'hypertensionDetails' | 'cardiovascularDetails'; label: string }[] = [
		{ yn: 'hasAutoimmuneDisease', det: 'autoimmuneDetails', label: 'autoimmune disease (e.g. lupus, RA, MS)' },
		{ yn: 'hasDiabetes', det: 'diabetesDetails', label: 'diabetes mellitus' },
		{ yn: 'hasHypertension', det: 'hypertensionDetails', label: 'hypertension' },
		{ yn: 'hasCardiovascularDisease', det: 'cardiovascularDetails', label: 'cardiovascular disease (heart attack, angina, heart failure)' }
	];
</script>

<Fieldset legend="3. Medical History">
	<p class="hint">Past and current medical conditions relevant to donor and recipient safety.</p>

	<Field label="Any history of malignancy (cancer)?">
		<RadioGroup label="Any history of malignancy (cancer)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasMalignancy" value={opt.value} bind:group={d.hasMalignancy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.hasMalignancy === 'yes'}
		<Field label="Malignancy details" inputId="malignancyDetails">
			<TextAreaInput id="malignancyDetails" label="Malignancy details" rows={2} placeholder="Type, stage, year, treatment, current status…" bind:value={d.malignancyDetails} />
		</Field>
		<Field label="Was the malignancy primary CNS (low metastatic risk)?">
			<RadioGroup label="Was the malignancy primary CNS (low metastatic risk)?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="hasCnsMalignancy" value={opt.value} bind:group={d.hasCnsMalignancy} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	{#each conds as cond (cond.yn)}
		<Field label={`Do you have a history of ${cond.label}?`}>
			<RadioGroup label={`Do you have a history of ${cond.label}?`}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={cond.yn} value={opt.value} bind:group={d[cond.yn]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if d[cond.yn] === 'yes'}
			<Field label="Details" inputId={cond.det}>
				<TextAreaInput id={cond.det} label="Details" rows={2} placeholder="Diagnosis, year, treatment, current status…" bind:value={d[cond.det]} />
			</Field>
		{/if}
	{/each}

	<Field label="Any active infection?">
		<RadioGroup label="Any active infection?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasActiveInfection" value={opt.value} bind:group={d.hasActiveInfection} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.hasActiveInfection === 'yes'}
		<Field label="Active infection details" inputId="activeInfectionDetails">
			<TextAreaInput id="activeInfectionDetails" label="Active infection details" rows={2} placeholder="Type, site, treatment, response…" bind:value={d.activeInfectionDetails} />
		</Field>
	{/if}

	<Field label="Uncontrolled sepsis?">
		<RadioGroup label="Uncontrolled sepsis?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasUncontrolledSepsis" value={opt.value} bind:group={d.hasUncontrolledSepsis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Any CJD risk factors (family history, dura mater grafts, growth hormone)?">
		<RadioGroup label="Any CJD risk factors?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasCjdRisk" value={opt.value} bind:group={d.hasCjdRisk} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.hasCjdRisk === 'yes'}
		<Field label="CJD risk details" inputId="cjdDetails">
			<TextAreaInput id="cjdDetails" label="CJD risk details" rows={2} placeholder="Specific risk factors…" bind:value={d.cjdDetails} />
		</Field>
	{/if}

	<Field label="History of intravenous drug use?">
		<RadioGroup label="History of intravenous drug use?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ivDrugUseHistory" value={opt.value} bind:group={d.ivDrugUseHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Current medications" inputId="currentMedications">
		<TextAreaInput id="currentMedications" label="Current medications" rows={3} placeholder="List all prescription, OTC and supplement medications…" bind:value={d.currentMedications} />
	</Field>

	<Field label="Have you had previous surgery?">
		<RadioGroup label="Have you had previous surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousSurgery" value={opt.value} bind:group={d.previousSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.previousSurgery === 'yes'}
		<Field label="Surgery details" inputId="surgeryDetails">
			<TextAreaInput id="surgeryDetails" label="Surgery details" rows={2} placeholder="Procedure, date, anaesthetic, complications…" bind:value={d.surgeryDetails} />
		</Field>
	{/if}
</Fieldset>
