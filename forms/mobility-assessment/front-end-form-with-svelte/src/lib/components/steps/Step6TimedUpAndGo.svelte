<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const t = assessment.data.timedUpAndGo;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Timed Up and Go (TUG)">
	<p class="hint">Patient rises from chair, walks 3 metres, turns, walks back, and sits down.</p>

	<Field label="Time to Complete (seconds)" required inputId="timeSeconds">
		<NumberInput id="timeSeconds" label="TUG time" min={0} max={300} step={0.1} required bind:value={t.timeSeconds} />
	</Field>

	<Alert type="info" heading="TUG Interpretation">
		<p>&lt;10 seconds: Freely mobile</p>
		<p>10-14 seconds: Mostly independent</p>
		<p>14-20 seconds: Variable mobility</p>
		<p>&gt;20 seconds: Impaired mobility</p>
	</Alert>

	<Field label="Did the patient use an assistive device?">
		<RadioGroup label="Used assistive device">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="usedAssistiveDevice" value={opt.value} bind:group={t.usedAssistiveDevice} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if t.usedAssistiveDevice === 'yes'}
		<Field label="Device Type" inputId="deviceType">
			<TextInput id="deviceType" label="Device Type" placeholder="e.g., cane, walker, rollator..." bind:value={t.deviceType} />
		</Field>
	{/if}
</Fieldset>
