<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.previousTreatmentHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Previous Treatment History">
	<p class="hint">Prior treatment episodes, modalities, and recovery history.</p>

	<Field label="Any previous treatment?">
		<RadioGroup label="Any previous treatment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousTreatment" value={opt.value} bind:group={t.previousTreatment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousTreatment === 'yes'}
		<Field label="Number of treatment episodes" inputId="numberOfTreatmentEpisodes">
			<NumberInput id="numberOfTreatmentEpisodes" label="Number of treatment episodes" min={0} max={100} bind:value={t.numberOfTreatmentEpisodes} />
		</Field>
	{/if}

	<Field label="Previous detox?">
		<RadioGroup label="Previous detox?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousDetox" value={opt.value} bind:group={t.previousDetox} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousDetox === 'yes'}
		<Field label="Detox setting" inputId="detoxSetting">
			<Select id="detoxSetting" label="Detox setting" bind:value={t.detoxSetting}>
				<option value="">-- Select --</option>
				<option value="inpatient">Inpatient</option>
				<option value="outpatient">Outpatient</option>
				<option value="community">Community</option>
			</Select>
		</Field>
	{/if}

	<Field label="Previous rehab?">
		<RadioGroup label="Previous rehab?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousRehab" value={opt.value} bind:group={t.previousRehab} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousRehab === 'yes'}
		<Field label="Rehab type" inputId="rehabType">
			<Select id="rehabType" label="Rehab type" bind:value={t.rehabType}>
				<option value="">-- Select --</option>
				<option value="residential">Residential</option>
				<option value="day-programme">Day programme</option>
				<option value="outpatient">Outpatient</option>
			</Select>
		</Field>
	{/if}

	<Field label="Previous counselling?">
		<RadioGroup label="Previous counselling?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousCounselling" value={opt.value} bind:group={t.previousCounselling} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousCounselling === 'yes'}
		<Field label="Counselling type" inputId="counsellingType">
			<Select id="counsellingType" label="Counselling type" bind:value={t.counsellingType}>
				<option value="">-- Select --</option>
				<option value="cbt">CBT</option>
				<option value="motivational-interviewing">Motivational interviewing</option>
				<option value="group-therapy">Group therapy</option>
				<option value="12-step">12-step</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="Previous medication-assisted treatment?">
		<RadioGroup label="Previous medication-assisted treatment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousMedicationAssisted" value={opt.value} bind:group={t.previousMedicationAssisted} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousMedicationAssisted === 'yes'}
		<Field label="MAT medication" inputId="matMedication">
			<Select id="matMedication" label="MAT medication" bind:value={t.matMedication}>
				<option value="">-- Select --</option>
				<option value="methadone">Methadone</option>
				<option value="buprenorphine">Buprenorphine</option>
				<option value="naltrexone">Naltrexone</option>
				<option value="acamprosate">Acamprosate</option>
				<option value="disulfiram">Disulfiram</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="Attended self-help groups?">
		<RadioGroup label="Attended self-help groups?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="selfHelpGroups" value={opt.value} bind:group={t.selfHelpGroups} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.selfHelpGroups === 'yes'}
		<Field label="Self-help group type" inputId="selfHelpGroupType">
			<Select id="selfHelpGroupType" label="Self-help group type" bind:value={t.selfHelpGroupType}>
				<option value="">-- Select --</option>
				<option value="aa">AA</option>
				<option value="na">NA</option>
				<option value="smart-recovery">SMART Recovery</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<Field label="Longest period abstinent" inputId="longestPeriodAbstinent">
		<Select id="longestPeriodAbstinent" label="Longest period abstinent" bind:value={t.longestPeriodAbstinent}>
			<option value="">-- Select --</option>
			<option value="less-1-month">Less than 1 month</option>
			<option value="1-3-months">1-3 months</option>
			<option value="3-6-months">3-6 months</option>
			<option value="6-12-months">6-12 months</option>
			<option value="greater-1-year">Greater than 1 year</option>
		</Select>
	</Field>

	<Field label="Relapse triggers" inputId="relapseTriggers">
		<TextAreaInput id="relapseTriggers" label="Relapse triggers" rows={3} bind:value={t.relapseTriggers} />
	</Field>
</Fieldset>
