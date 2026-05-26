<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.painAssessment;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const painCharacterOptions = [
		'sharp', 'dull', 'aching', 'burning', 'throbbing', 'stabbing', 'radiating'
	];
	const painFrequencyOptions = [
		{ value: 'constant', label: 'Constant' },
		{ value: 'intermittent', label: 'Intermittent' },
		{ value: 'activity-related', label: 'Activity-related' },
		{ value: 'night-only', label: 'Night only' },
		{ value: 'morning-stiffness', label: 'Morning stiffness' }
	];
</script>

<Fieldset legend="Pain Assessment">
	<p class="hint">Rate your pain levels and describe the character of your pain.</p>

	<Field label="Current Pain Level (0-10)" required inputId="currentPainLevel">
		<NumberInput id="currentPainLevel" label="Current pain level" min={0} max={10} required bind:value={p.currentPainLevel} />
	</Field>

	<Field label="Worst Pain in the past week (0-10)" required inputId="worstPain">
		<NumberInput id="worstPain" label="Worst pain" min={0} max={10} required bind:value={p.worstPain} />
	</Field>

	<Field label="Best Pain in the past week (0-10)" required inputId="bestPain">
		<NumberInput id="bestPain" label="Best pain" min={0} max={10} required bind:value={p.bestPain} />
	</Field>

	<Field label="Pain Character" required inputId="painCharacter">
		<Select id="painCharacter" label="Pain Character" required bind:value={p.painCharacter}>
			<option value="">-- Select --</option>
			{#each painCharacterOptions as opt}
				<option value={opt}>{opt[0].toUpperCase() + opt.slice(1)}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Pain Frequency" required inputId="painFrequency">
		<Select id="painFrequency" label="Pain Frequency" required bind:value={p.painFrequency}>
			<option value="">-- Select --</option>
			{#each painFrequencyOptions as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Do you experience night pain?" required>
		<RadioGroup label="Night pain">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="nightPain" value={opt.value} bind:group={p.nightPain} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have pain with weight bearing?" required>
		<RadioGroup label="Pain with weight bearing">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="painWithWeightBearing" value={opt.value} bind:group={p.painWithWeightBearing} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
