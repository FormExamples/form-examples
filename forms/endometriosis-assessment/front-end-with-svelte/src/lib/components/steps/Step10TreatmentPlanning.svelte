<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.treatmentPlanning;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const referrals: { key: keyof typeof t; label: string }[] = [
		{ key: 'mdtReferralNeeded', label: 'MDT referral needed?' },
		{ key: 'painManagementReferral', label: 'Pain management referral?' },
		{ key: 'psychologyReferral', label: 'Psychology referral?' },
		{ key: 'physiotherapyReferral', label: 'Physiotherapy referral?' },
		{ key: 'fertilityClinicReferral', label: 'Fertility clinic referral?' }
	];
</script>

<Fieldset legend="Treatment Planning">
	<p class="hint">Goals, preferred approach, referrals, imaging, and follow-up.</p>

	<Field label="Treatment goals" inputId="treatmentGoals">
		<TextAreaInput id="treatmentGoals" label="Treatment goals" rows={2} bind:value={t.treatmentGoals} />
	</Field>

	<Field label="Preferred approach" inputId="preferredApproach">
		<Select id="preferredApproach" label="Preferred approach" bind:value={t.preferredApproach}>
			<option value="">-- Select --</option>
			<option value="conservative">Conservative</option>
			<option value="medical">Medical</option>
			<option value="surgical">Surgical</option>
			<option value="combined">Combined</option>
			<option value="fertility-focused">Fertility-focused</option>
		</Select>
	</Field>

	<Field label="Surgery considered?">
		<RadioGroup label="Surgery considered?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="surgeryConsidered" value={opt.value} bind:group={t.surgeryConsidered} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.surgeryConsidered === 'yes'}
		<Field label="Surgery type considered" inputId="surgeryTypeConsidered">
			<Select id="surgeryTypeConsidered" label="Surgery type considered" bind:value={t.surgeryTypeConsidered}>
				<option value="">-- Select --</option>
				<option value="diagnostic-laparoscopy">Diagnostic laparoscopy</option>
				<option value="excision">Excision</option>
				<option value="ablation">Ablation</option>
				<option value="hysterectomy">Hysterectomy</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="Fertility preservation needed?">
		<RadioGroup label="Fertility preservation needed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="fertilityPreservationNeeded" value={opt.value} bind:group={t.fertilityPreservationNeeded} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#each referrals as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={t[r.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Imaging requested" inputId="imagingRequested">
		<Select id="imagingRequested" label="Imaging requested" bind:value={t.imagingRequested}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="transvaginal-us">Transvaginal ultrasound</option>
			<option value="mri-pelvis">MRI pelvis</option>
			<option value="both">Both</option>
		</Select>
	</Field>

	<Field label="Follow-up interval" inputId="followUpInterval">
		<Select id="followUpInterval" label="Follow-up interval" bind:value={t.followUpInterval}>
			<option value="">-- Select --</option>
			<option value="2-weeks">2 weeks</option>
			<option value="4-weeks">4 weeks</option>
			<option value="3-months">3 months</option>
			<option value="6-months">6 months</option>
			<option value="12-months">12 months</option>
		</Select>
	</Field>

	<Field label="Planning notes" inputId="planningNotes">
		<TextAreaInput id="planningNotes" label="Planning notes" rows={2} bind:value={t.planningNotes} />
	</Field>
</Fieldset>
