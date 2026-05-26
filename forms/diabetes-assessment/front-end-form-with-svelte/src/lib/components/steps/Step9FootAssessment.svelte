<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.footAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Foot Assessment">
	<p class="hint">Comprehensive diabetic foot examination findings.</p>

	<div class="field-grid">
		<Field label="Foot Pulses" inputId="footPulses">
			<Select id="footPulses" label="Foot Pulses" bind:value={d.footPulses}>
				<option value="">-- Select --</option>
				<option value="present">Present</option>
				<option value="reduced">Reduced</option>
				<option value="absent">Absent</option>
			</Select>
		</Field>
		<Field label="10g Monofilament Test" inputId="monofilamentTest">
			<Select id="monofilamentTest" label="10g Monofilament Test" bind:value={d.monofilamentTest}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="abnormal">Abnormal</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Vibration Sense (128Hz tuning fork)" inputId="vibrationSense">
			<Select id="vibrationSense" label="Vibration Sense" bind:value={d.vibrationSense}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="reduced">Reduced</option>
				<option value="absent">Absent</option>
			</Select>
		</Field>
		<Field label="Foot Deformity">
			<RadioGroup label="Foot Deformity">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="footDeformity" value={opt.value} bind:group={d.footDeformity} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Callus Present">
			<RadioGroup label="Callus Present">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="callusPresent" value={opt.value} bind:group={d.callusPresent} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Ulcer Present">
			<RadioGroup label="Ulcer Present">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="ulcerPresent" value={opt.value} bind:group={d.ulcerPresent} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Previous Amputation">
			<RadioGroup label="Previous Amputation">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="previousAmputation" value={opt.value} bind:group={d.previousAmputation} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Foot Risk Category" inputId="footRiskCategory">
			<Select id="footRiskCategory" label="Foot Risk Category" bind:value={d.footRiskCategory}>
				<option value="">-- Select --</option>
				<option value="low">Low Risk</option>
				<option value="moderate">Moderate Risk</option>
				<option value="high">High Risk</option>
			</Select>
		</Field>
	</div>
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
