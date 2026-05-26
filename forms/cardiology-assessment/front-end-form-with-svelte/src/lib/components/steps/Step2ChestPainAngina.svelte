<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const c = assessment.data.chestPainAngina;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Chest Pain / Angina">
	<p class="hint">Character, location, radiation, and classification of chest pain.</p>

	<Field label="Do you experience chest pain?">
		<RadioGroup label="Do you experience chest pain?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="chestPain" value={opt.value} bind:group={c.chestPain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if c.chestPain === 'yes'}
		<Field label="Pain character" inputId="painCharacter">
			<Select id="painCharacter" label="Pain character" bind:value={c.painCharacter}>
				<option value="">-- Select --</option>
				<option value="crushing">Crushing / Heavy</option>
				<option value="pressure">Pressure / Tightness</option>
				<option value="sharp">Sharp / Stabbing</option>
				<option value="burning">Burning</option>
				<option value="other">Other</option>
			</Select>
		</Field>

		<Field label="Pain location" inputId="painLocation">
			<TextInput id="painLocation" label="Pain location" placeholder="e.g. Central chest, left-sided" bind:value={c.painLocation} />
		</Field>

		<Field label="Pain radiation" inputId="painRadiation">
			<Select id="painRadiation" label="Pain radiation" bind:value={c.painRadiation}>
				<option value="">-- Select --</option>
				<option value="left-arm">Left arm</option>
				<option value="jaw">Jaw</option>
				<option value="back">Back</option>
				<option value="none">None</option>
				<option value="other">Other</option>
			</Select>
		</Field>

		<Field label="CCS Angina Class" required inputId="ccsClass">
			<Select id="ccsClass" label="CCS Angina Class" required bind:value={c.ccsClass}>
				<option value="">-- Select --</option>
				<option value="1">Class I - Angina only with strenuous exertion</option>
				<option value="2">Class II - Slight limitation of ordinary activity</option>
				<option value="3">Class III - Marked limitation of ordinary activity</option>
				<option value="4">Class IV - Angina at rest</option>
			</Select>
		</Field>

		<Field label="Angina frequency" inputId="anginaFrequency">
			<Select id="anginaFrequency" label="Angina frequency" bind:value={c.anginaFrequency}>
				<option value="">-- Select --</option>
				<option value="daily">Daily</option>
				<option value="weekly">Weekly</option>
				<option value="monthly">Monthly</option>
				<option value="rarely">Rarely</option>
			</Select>
		</Field>

		<Field label="Angina duration" inputId="anginaDuration">
			<Select id="anginaDuration" label="Angina duration" bind:value={c.anginaDuration}>
				<option value="">-- Select --</option>
				<option value="less-5-min">Less than 5 minutes</option>
				<option value="5-20-min">5-20 minutes</option>
				<option value="greater-20-min">Greater than 20 minutes</option>
			</Select>
		</Field>

		<Field label="Unstable angina (pain at rest or worsening pattern)?">
			<RadioGroup label="Unstable angina (pain at rest or worsening pattern)?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="unstableAngina" value={opt.value} bind:group={c.unstableAngina} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>
