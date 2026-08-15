<script lang="ts">
	import { authorization } from '#lib/stores/authorization.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = authorization.data.recordsToDisclose;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Records to disclose">
	<p class="hint">For each category, mark Yes or No and add your initials. Sensitive categories require additional consent under federal and state law.</p>

	<!-- Medical / health -->
	<Field label="Medical / health records">
		<RadioGroup label="Include medical / health records">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="records-medicalHealth" value={opt.value} bind:group={d.includeMedicalHealth} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.includeMedicalHealth === 'yes'}
		<Field label="Initials" inputId="records-medicalHealthInitials">
			<TextInput id="records-medicalHealthInitials" label="Medical / health initials" maxlength="8" bind:value={d.medicalHealthInitials} />
		</Field>
	{/if}

	<!-- Mental health -->
	<Field label="Mental-health records">
		<RadioGroup label="Include mental-health records">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="records-mentalHealth" value={opt.value} bind:group={d.includeMentalHealth} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.includeMentalHealth === 'yes'}
		<Field label="Initials (mental-health records must be separately initialled)" inputId="records-mentalHealthInitials">
			<TextInput id="records-mentalHealthInitials" label="Mental-health initials" maxlength="8" bind:value={d.mentalHealthInitials} />
		</Field>
	{/if}

	<!-- Substance use (42 CFR Part 2) -->
	<Field label="Drug or alcohol treatment / referral records (42 CFR Part 2)">
		<RadioGroup label="Include substance-use records">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="records-substanceUse" value={opt.value} bind:group={d.includeSubstanceUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.includeSubstanceUse === 'yes'}
		<Field label="Initials" inputId="records-substanceUseInitials">
			<TextInput id="records-substanceUseInitials" label="Substance-use initials" maxlength="8" bind:value={d.substanceUseInitials} />
		</Field>
		<Field label="The 42 CFR Part 2 prohibition-on-redisclosure notice is attached">
			<RadioGroup label="Part 2 redisclosure notice included">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="records-part2Notice" value={opt.value} bind:group={d.part2RedisclosureNoticeIncluded} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<!-- HIV / AIDS -->
	<Field label="HIV / AIDS test or treatment records">
		<RadioGroup label="Include HIV / AIDS records">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="records-hivAids" value={opt.value} bind:group={d.includeHivAids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.includeHivAids === 'yes'}
		<Field label="Initials" inputId="records-hivAidsInitials">
			<TextInput id="records-hivAidsInitials" label="HIV / AIDS initials" maxlength="8" bind:value={d.hivAidsInitials} />
		</Field>
		<Field label="State-specific HIV / AIDS consent language is included">
			<RadioGroup label="HIV / AIDS state consent included">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="records-hivConsent" value={opt.value} bind:group={d.hivAidsStateConsentIncluded} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<!-- Psychotherapy notes -->
	<Field label="Psychotherapy notes (must be authorised on a separate form)">
		<RadioGroup label="Include psychotherapy notes">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="records-psychotherapy" value={opt.value} bind:group={d.includePsychotherapyNotes} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if authorization.data.disclosingSource.isVaFacility === 'yes'}
		<Field label="The 38 U.S.C. § 7332 notice for VA records is included">
			<RadioGroup label="Section 7332 notice included">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="records-7332" value={opt.value} bind:group={d.section7332NoticeIncluded} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Specific description of any other PHI" inputId="records-otherDescription">
		<TextAreaInput
			id="records-otherDescription"
			label="Other PHI description"
			rows={3}
			placeholder="Describe any other records to disclose."
			bind:value={d.otherDescription}
		/>
	</Field>
</Fieldset>
