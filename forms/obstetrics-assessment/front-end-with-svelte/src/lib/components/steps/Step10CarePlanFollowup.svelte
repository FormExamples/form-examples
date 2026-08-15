<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.carePlanFollowup;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Care Plan & Follow-up">
	<p class="hint">Recommended pathway and onward referrals.</p>

	<Field label="Recommended care pathway" inputId="recommendedCarePathway">
		<Select id="recommendedCarePathway" label="Recommended care pathway" bind:value={c.recommendedCarePathway}>
			<option value="">— Select —</option>
			<option value="midwifery-led">Midwifery-led</option>
			<option value="shared-care">Shared (midwife + obstetric review)</option>
			<option value="consultant-led">Consultant-led</option>
			<option value="multidisciplinary">Multidisciplinary (specialist clinic)</option>
		</Select>
	</Field>

	<Field label="Consultant obstetrician referral required?">
		<RadioGroup label="Consultant obstetrician referral required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consultantReferralRequired" value={opt.value} bind:group={c.consultantReferralRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Perinatal mental-health referral required?">
		<RadioGroup label="Perinatal mental-health referral required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="mentalHealthReferralRequired" value={opt.value} bind:group={c.mentalHealthReferralRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Safeguarding referral required?">
		<RadioGroup label="Safeguarding referral required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="safeguardingReferralRequired" value={opt.value} bind:group={c.safeguardingReferralRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Aspirin prophylaxis indicated (pre-eclampsia prevention)?">
		<RadioGroup label="Aspirin prophylaxis indicated?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="aspirinProphylaxisIndicated" value={opt.value} bind:group={c.aspirinProphylaxisIndicated} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="VTE prophylaxis indicated (LMWH)?">
		<RadioGroup label="VTE prophylaxis indicated?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vteProphylaxisIndicated" value={opt.value} bind:group={c.vteProphylaxisIndicated} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Next appointment date" inputId="nextAppointmentDate">
		<DateInput id="nextAppointmentDate" label="Next appointment date" bind:value={c.nextAppointmentDate} />
	</Field>

	<Field label="Care plan notes" inputId="carePlanNotes">
		<TextAreaInput id="carePlanNotes" label="Care plan notes" rows={4} placeholder="Detailed care plan, scheduled scans, decision-making, etc." bind:value={c.carePlanNotes} />
	</Field>
</Fieldset>
