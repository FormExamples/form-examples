<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.surgicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Surgical History">
	<p class="hint">Previous laparoscopy, surgical findings, and procedures.</p>

	<Field label="Previous laparoscopy?">
		<RadioGroup label="Previous laparoscopy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousLaparoscopy" value={opt.value} bind:group={s.previousLaparoscopy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.previousLaparoscopy === 'yes'}
		<div class="field-grid">
			<Field label="Number of laparoscopies" inputId="numberOfLaparoscopies">
				<NumberInput id="numberOfLaparoscopies" label="Number of laparoscopies" min={0} max={20} bind:value={s.numberOfLaparoscopies} />
			</Field>
			<Field label="Most recent laparoscopy date" inputId="mostRecentLaparoscopyDate">
				<DateInput id="mostRecentLaparoscopyDate" label="Most recent laparoscopy date" bind:value={s.mostRecentLaparoscopyDate} />
			</Field>
		</div>

		<Field label="Endometriosis confirmed surgically?">
			<RadioGroup label="Endometriosis confirmed surgically?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="endometriosisConfirmedSurgically" value={opt.value} bind:group={s.endometriosisConfirmedSurgically} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Histological confirmation?">
			<RadioGroup label="Histological confirmation?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="histologicalConfirmation" value={opt.value} bind:group={s.histologicalConfirmation} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="ASRM stage at surgery" inputId="asrmStageAtSurgery">
			<Select id="asrmStageAtSurgery" label="ASRM stage at surgery" bind:value={s.asrmStageAtSurgery}>
				<option value="">-- Select --</option>
				<option value="I">Stage I — Minimal</option>
				<option value="II">Stage II — Mild</option>
				<option value="III">Stage III — Moderate</option>
				<option value="IV">Stage IV — Severe</option>
			</Select>
		</Field>

		<Field label="Sites found" inputId="sitesFound">
			<TextInput id="sitesFound" label="Sites found" placeholder="e.g. ovaries, pouch of Douglas, uterosacral ligaments" bind:value={s.sitesFound} />
		</Field>
	{/if}

	<Field label="Excision performed?">
		<RadioGroup label="Excision performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="excisionPerformed" value={opt.value} bind:group={s.excisionPerformed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Ablation performed?">
		<RadioGroup label="Ablation performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ablationPerformed" value={opt.value} bind:group={s.ablationPerformed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Adhesiolysis performed?">
		<RadioGroup label="Adhesiolysis performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="adhesiolysisPerformed" value={opt.value} bind:group={s.adhesiolysisPerformed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Endometrioma drained?">
		<RadioGroup label="Endometrioma drained?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="endometriomaDrained" value={opt.value} bind:group={s.endometriomaDrained} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Bowel surgery for endometriosis?">
		<RadioGroup label="Bowel surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bowelSurgery" value={opt.value} bind:group={s.bowelSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Bladder surgery for endometriosis?">
		<RadioGroup label="Bladder surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bladderSurgery" value={opt.value} bind:group={s.bladderSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other pelvic surgery" inputId="otherPelvicSurgery">
		<TextInput id="otherPelvicSurgery" label="Other pelvic surgery" bind:value={s.otherPelvicSurgery} />
	</Field>

	<Field label="Surgical complications" inputId="surgicalComplications">
		<TextInput id="surgicalComplications" label="Surgical complications" bind:value={s.surgicalComplications} />
	</Field>

	<Field label="Surgical notes" inputId="surgicalNotes">
		<TextAreaInput id="surgicalNotes" label="Surgical notes" rows={2} bind:value={s.surgicalNotes} />
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
