<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores, news2Aggregate } from '$lib/engine/ed-triage-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const v = assessment.data.vitals;
	const subscores = $derived(computeSubscores(assessment.data));
	const aggregate = $derived(news2Aggregate(subscores));
	const acvpuOptions = [
		{ value: 'A', label: 'Alert' },
		{ value: 'C', label: 'New confusion' },
		{ value: 'V', label: 'Responds to Voice' },
		{ value: 'P', label: 'Responds to Pain' },
		{ value: 'U', label: 'Unresponsive' }
	];
</script>

<Fieldset legend="Step 5 of 8 — Triage vital signs">
	<p class="hint">
		Triage observations. These feed the supporting NEWS2 aggregate; missing values never lower the
		category.
	</p>

	<Field label="Respiratory rate (breaths/min)" inputId="vitals-respiratoryRate">
		<NumberInput
			id="vitals-respiratoryRate"
			label="Respiratory rate"
			min={0}
			max={80}
			step={1}
			bind:value={v.respiratoryRate}
		/>
	</Field>

	<Field label="Oxygen saturation SpO2 (%)" inputId="vitals-spo2">
		<NumberInput id="vitals-spo2" label="Oxygen saturation" min={50} max={100} step={1} bind:value={v.spo2} />
	</Field>

	<Field label="Air or supplemental oxygen?">
		<RadioGroup label="Air or supplemental oxygen?">
			<label>
				<input type="radio" class="radio-input" name="vitals-onOxygen" value="air" bind:group={v.onOxygen} />
				Air
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="vitals-onOxygen"
					value="oxygen"
					bind:group={v.onOxygen}
				/>
				Supplemental oxygen
			</label>
		</RadioGroup>
	</Field>

	<Field label="Systolic blood pressure (mmHg)" inputId="vitals-systolicBp">
		<NumberInput
			id="vitals-systolicBp"
			label="Systolic blood pressure"
			min={40}
			max={300}
			step={1}
			bind:value={v.systolicBp}
		/>
	</Field>

	<Field label="Pulse (beats/min)" inputId="vitals-pulse">
		<NumberInput id="vitals-pulse" label="Pulse" min={20} max={250} step={1} bind:value={v.pulse} />
	</Field>

	<Field
		label="Consciousness (ACVPU)"
		description={'Only "Alert" is normal; new confusion, voice, pain, or unresponsive escalate the category.'}
	>
		<RadioGroup label="Consciousness (ACVPU)">
			{#each acvpuOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="vitals-consciousnessAcvpu"
						value={opt.value}
						bind:group={v.consciousnessAcvpu}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Temperature (°C)" inputId="vitals-temperature">
		<NumberInput
			id="vitals-temperature"
			label="Temperature"
			min={25}
			max={45}
			step={0.1}
			bind:value={v.temperature}
		/>
	</Field>

	<Field
		label="Glasgow Coma Scale (optional)"
		description="Optional supporting disability finding (3-15)."
		inputId="vitals-glasgowComaScale"
	>
		<NumberInput
			id="vitals-glasgowComaScale"
			label="Glasgow Coma Scale"
			min={3}
			max={15}
			step={1}
			bind:value={v.glasgowComaScale}
		/>
	</Field>

	<Field label="Supporting NEWS2 aggregate">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(aggregate === 0 ? 0 : aggregate >= 7 ? 3 : aggregate >= 5 ? 2 : 1)}">
			{aggregate} point{aggregate === 1 ? '' : 's'}
		</span>
		<span class="ml-2 text-xs text-base-content/60">
			(&ge; 7 or any single parameter 3 escalates to at least Very urgent; 5-6 to at least Urgent)
		</span>
	</Field>
</Fieldset>
