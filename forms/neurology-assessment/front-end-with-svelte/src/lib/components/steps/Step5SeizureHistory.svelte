<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const s = assessment.data.seizureHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Seizure History">
	<p class="hint">Seizure type, frequency, and management.</p>

	<Field label="Do you have a history of seizures?">
		<RadioGroup label="Seizure history">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="seizureHistory" value={opt.value} bind:group={s.seizureHistory} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.seizureHistory === 'yes'}
		<Field label="Seizure type" inputId="seizureType">
			<Select id="seizureType" label="Seizure type" bind:value={s.seizureType}>
				<option value="">-- Select --</option>
				<option value="focal">Focal (partial)</option>
				<option value="generalised-tonic-clonic">Generalised tonic-clonic</option>
				<option value="absence">Absence</option>
				<option value="myoclonic">Myoclonic</option>
				<option value="other">Other</option>
			</Select>
		</Field>

		<Field label="Frequency" inputId="seizureFreq">
			<TextInput id="seizureFreq" label="Frequency" placeholder="e.g., 2 per month, 1 per year" bind:value={s.frequency} />
		</Field>

		<Field label="Date of last seizure" inputId="lastSeizure">
			<DateInput id="lastSeizure" label="Last seizure" bind:value={s.lastSeizureDate} />
		</Field>

		<Field label="Known triggers" inputId="seizureTriggers">
			<TextAreaInput id="seizureTriggers" label="Triggers" rows={3} placeholder="e.g., sleep deprivation, alcohol, flashing lights" bind:value={s.triggers} />
		</Field>

		<Field label="Do you experience an aura before seizures?">
			<RadioGroup label="Seizure aura">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="seizureAura" value={opt.value} bind:group={s.aura} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if s.aura === 'yes'}
			<Field label="Describe the aura" inputId="seizureAuraDesc">
				<TextAreaInput id="seizureAuraDesc" label="Aura description" rows={2} bind:value={s.auraDescription} />
			</Field>
		{/if}

		<Field label="Post-ictal state" inputId="postIctal">
			<TextAreaInput id="postIctal" label="Post-ictal state" rows={2} placeholder="e.g., confusion, drowsiness, duration" bind:value={s.postIctalState} />
		</Field>

		<Field label="History of status epilepticus?">
			<RadioGroup label="Status epilepticus">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="statusEpilepticus" value={opt.value} bind:group={s.statusEpilepticus} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>
