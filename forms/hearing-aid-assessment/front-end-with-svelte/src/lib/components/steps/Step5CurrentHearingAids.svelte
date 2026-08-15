<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const ha = assessment.data.currentHearingAids;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const satisfactionOptions = [
		{ value: 'very-satisfied', label: 'Very satisfied' },
		{ value: 'satisfied', label: 'Satisfied' },
		{ value: 'neutral', label: 'Neutral' },
		{ value: 'dissatisfied', label: 'Dissatisfied' },
		{ value: 'very-dissatisfied', label: 'Very dissatisfied' }
	];
</script>

<Fieldset legend="Current Hearing Aids">
	<p class="hint">Information about any hearing aids you currently use.</p>

	<Field label="Do you currently wear hearing aids?" required>
		<RadioGroup label="Currently wears hearing aids">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="hasHearingAids" value={opt.value} bind:group={ha.hasHearingAids} required /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	{#if ha.hasHearingAids === 'yes'}
		<Field label="Left ear hearing aid type" inputId="leftAidType">
			<Select id="leftAidType" label="Left ear hearing aid type" bind:value={ha.leftAidType}>
				<option value="">-- Select --</option>
				<option value="BTE">Behind-the-ear (BTE)</option>
				<option value="RIC">Receiver-in-canal (RIC)</option>
				<option value="ITE">In-the-ear (ITE)</option>
				<option value="ITC">In-the-canal (ITC)</option>
				<option value="CIC">Completely-in-canal (CIC)</option>
				<option value="IIC">Invisible-in-canal (IIC)</option>
				<option value="bone-conduction">Bone conduction</option>
				<option value="CROS">CROS/BiCROS</option>
				<option value="other">Other</option>
				<option value="none">None</option>
			</Select>
		</Field>

		<Field label="Right ear hearing aid type" inputId="rightAidType">
			<Select id="rightAidType" label="Right ear hearing aid type" bind:value={ha.rightAidType}>
				<option value="">-- Select --</option>
				<option value="BTE">Behind-the-ear (BTE)</option>
				<option value="RIC">Receiver-in-canal (RIC)</option>
				<option value="ITE">In-the-ear (ITE)</option>
				<option value="ITC">In-the-canal (ITC)</option>
				<option value="CIC">Completely-in-canal (CIC)</option>
				<option value="IIC">Invisible-in-canal (IIC)</option>
				<option value="bone-conduction">Bone conduction</option>
				<option value="CROS">CROS/BiCROS</option>
				<option value="other">Other</option>
				<option value="none">None</option>
			</Select>
		</Field>

		<Field label="How old are your current hearing aids?" inputId="aidAge">
			<TextInput id="aidAge" label="Aid age" placeholder="e.g., 2 years, 6 months" bind:value={ha.aidAge} />
		</Field>

		<Field label="How satisfied are you with your current hearing aids?">
			<RadioGroup label="Satisfaction">{#each satisfactionOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="satisfaction" value={opt.value} bind:group={ha.satisfaction} /> {opt.label}</label>{/each}</RadioGroup>
		</Field>

		<Field label="Average daily use (hours)" inputId="dailyUseHours">
			<NumberInput id="dailyUseHours" label="Daily use hours" min={0} max={24} step={0.5} bind:value={ha.dailyUseHours} />
		</Field>

		<Field label="Any difficulties or complaints with your current hearing aids?" inputId="difficulties">
			<TextAreaInput id="difficulties" label="Difficulties" rows={3} placeholder="e.g., feedback, discomfort, difficulty with settings..." bind:value={ha.difficulties} />
		</Field>
	{/if}
</Fieldset>
