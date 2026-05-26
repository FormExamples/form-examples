<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const ad = assessment.data.assistiveDevices;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	const devices = [
		{ value: 'cane', label: 'Cane' },
		{ value: 'quad-cane', label: 'Quad cane' },
		{ value: 'walker', label: 'Walker' },
		{ value: 'rollator', label: 'Rollator' },
		{ value: 'wheelchair', label: 'Wheelchair' },
		{ value: 'scooter', label: 'Scooter' },
		{ value: 'crutches', label: 'Crutches' },
		{ value: 'orthotics', label: 'Orthotics/Braces' },
		{ value: 'none', label: 'None' }
	];

	function toggleDevice(val: string) {
		if (ad.currentDevices.includes(val)) {
			ad.currentDevices = ad.currentDevices.filter((v) => v !== val);
		} else {
			ad.currentDevices = [...ad.currentDevices, val];
		}
	}
</script>

<Fieldset legend="Assistive Devices">
	<p class="hint">Current and recommended mobility aids.</p>

	<Field label="Current Assistive Devices">
		<CheckboxGroup label="Current Assistive Devices">
			{#each devices as opt (opt.value)}
				<label>
					<input type="checkbox" class="checkbox-input" checked={ad.currentDevices.includes(opt.value)} onchange={() => toggleDevice(opt.value)} />
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>

	{#if ad.currentDevices.length > 0 && !ad.currentDevices.includes('none')}
		<Field label="Is the current device fit adequate?">
			<RadioGroup label="Device fit adequate">
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name="deviceFitAdequate" value={opt.value} bind:group={ad.deviceFitAdequate} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Device Condition" inputId="deviceCondition">
			<TextAreaInput id="deviceCondition" label="Device Condition" rows={3} placeholder="Describe the condition of the current device(s)..." bind:value={ad.deviceCondition} />
		</Field>
	{/if}

	<Field label="Recommended Devices or Modifications" inputId="recommendedDevices">
		<TextAreaInput id="recommendedDevices" label="Recommended Devices" rows={3} placeholder="Any recommended assistive devices or modifications..." bind:value={ad.recommendedDevices} />
	</Field>
</Fieldset>
