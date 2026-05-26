<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const h = assessment.data.headacheAssessment;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Headache Assessment">
	<p class="hint">Headache type, frequency, and red flag symptoms.</p>

	<Field label="Do you suffer from headaches?">
		<RadioGroup label="Headache present">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="headachePresent" value={opt.value} bind:group={h.headachePresent} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if h.headachePresent === 'yes'}
		<Field label="Headache type" inputId="headacheType">
			<Select id="headacheType" label="Headache type" bind:value={h.headacheType}>
				<option value="">-- Select --</option>
				<option value="tension">Tension-type</option>
				<option value="migraine">Migraine</option>
				<option value="cluster">Cluster</option>
				<option value="thunderclap">Thunderclap</option>
				<option value="other">Other</option>
			</Select>
		</Field>

		<Field label="Frequency" inputId="headacheFrequency">
			<Select id="headacheFrequency" label="Frequency" bind:value={h.frequency}>
				<option value="">-- Select --</option>
				<option value="daily">Daily</option>
				<option value="weekly">Weekly</option>
				<option value="monthly">Monthly</option>
				<option value="occasional">Occasional</option>
			</Select>
		</Field>

		<Field label="Severity (0-10)" inputId="headacheSeverity">
			<NumberInput id="headacheSeverity" label="Severity" min={0} max={10} bind:value={h.severity} />
		</Field>

		<Field label="Do you experience aura?">
			<RadioGroup label="Aura">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="aura" value={opt.value} bind:group={h.aura} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if h.aura === 'yes'}
			<Field label="Describe the aura" inputId="auraDescription">
				<TextAreaInput id="auraDescription" label="Aura description" rows={2} bind:value={h.auraDescription} />
			</Field>
		{/if}

		<Field label="Known triggers" inputId="triggers">
			<TextAreaInput id="triggers" label="Known triggers" rows={2} placeholder="e.g., stress, light, foods, menstruation" bind:value={h.triggers} />
		</Field>

		<Alert type="error" heading="Red Flag Symptoms">
			<Field label="Sudden onset (thunderclap)?">
				<RadioGroup label="Red flag sudden onset">
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name="redFlagSudden" value={opt.value} bind:group={h.redFlagSuddenOnset} />{opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
			<Field label="Worst headache of your life?">
				<RadioGroup label="Red flag worst">
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name="redFlagWorst" value={opt.value} bind:group={h.redFlagWorstEver} />{opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
			<Field label="Associated fever?">
				<RadioGroup label="Red flag fever">
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name="redFlagFever" value={opt.value} bind:group={h.redFlagFever} />{opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
			<Field label="Neck stiffness?">
				<RadioGroup label="Red flag neck stiffness">
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name="redFlagNeck" value={opt.value} bind:group={h.redFlagNeckStiffness} />{opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
			<Field label="Focal neurological deficit?">
				<RadioGroup label="Red flag focal deficit">
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name="redFlagDeficit" value={opt.value} bind:group={h.redFlagNeurologicalDeficit} />{opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		</Alert>
	{/if}
</Fieldset>
