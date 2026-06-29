<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.menstrualHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Menstrual History">
	<p class="hint">Cycle pattern, flow, and menstrual pain.</p>

	<div class="field-grid">
		<Field label="Age at menarche" inputId="ageAtMenarche">
			<NumberInput id="ageAtMenarche" label="Age at menarche" min={6} max={20} bind:value={m.ageAtMenarche} />
		</Field>
		<Field label="Cycle regularity" inputId="cycleRegularity">
			<Select id="cycleRegularity" label="Cycle regularity" bind:value={m.cycleRegularity}>
				<option value="">-- Select --</option>
				<option value="regular">Regular</option>
				<option value="irregular">Irregular</option>
				<option value="absent">Absent (amenorrhoea)</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Cycle length (days)" inputId="cycleLengthDays">
			<NumberInput id="cycleLengthDays" label="Cycle length" min={14} max={90} bind:value={m.cycleLengthDays} />
		</Field>
		<Field label="Period duration (days)" inputId="periodDurationDays">
			<NumberInput id="periodDurationDays" label="Period duration" min={1} max={30} bind:value={m.periodDurationDays} />
		</Field>
	</div>

	<Field label="Flow heaviness" inputId="flowHeaviness">
		<Select id="flowHeaviness" label="Flow heaviness" bind:value={m.flowHeaviness}>
			<option value="">-- Select --</option>
			<option value="light">Light</option>
			<option value="moderate">Moderate</option>
			<option value="heavy">Heavy</option>
			<option value="very-heavy">Very heavy</option>
		</Select>
	</Field>

	<Field label="Clots present?">
		<RadioGroup label="Clots present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="clotsPresent" value={opt.value} bind:group={m.clotsPresent} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Intermenstrual bleeding?">
		<RadioGroup label="Intermenstrual bleeding?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="intermenstrualBleeding" value={opt.value} bind:group={m.intermenstrualBleeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Post-coital bleeding?">
		<RadioGroup label="Post-coital bleeding?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="postcoitalBleeding" value={opt.value} bind:group={m.postcoitalBleeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Dysmenorrhoea (period pain) severity" inputId="dysmenorrhoeaSeverity">
		<Select id="dysmenorrhoeaSeverity" label="Dysmenorrhoea severity" bind:value={m.dysmenorrhoeaSeverity}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Days off work per cycle" inputId="daysOffWorkPerCycle">
		<NumberInput id="daysOffWorkPerCycle" label="Days off work per cycle" min={0} max={31} bind:value={m.daysOffWorkPerCycle} />
	</Field>

	<Field label="Current contraception" inputId="currentContraception">
		<Select id="currentContraception" label="Current contraception" bind:value={m.currentContraception}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="combined-pill">Combined pill</option>
			<option value="progesterone-only-pill">Progesterone-only pill</option>
			<option value="mirena-ius">Mirena IUS</option>
			<option value="implant">Implant</option>
			<option value="injection">Injection</option>
			<option value="copper-iud">Copper IUD</option>
			<option value="condoms">Condoms</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Menstrual notes" inputId="menstrualNotes">
		<TextAreaInput id="menstrualNotes" label="Menstrual notes" rows={2} bind:value={m.menstrualNotes} />
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
