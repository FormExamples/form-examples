<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const f = assessment.data.features;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 7 — Injury features">
	<p class="hint">
		These features drive the safety flags, not the arithmetic: airway risk, escharotomy risk, and
		the burn mechanism (electrical or chemical injuries carry a higher fluid requirement).
	</p>

	<Field label="Inhalation / airway injury suspected?">
		<RadioGroup label="Inhalation / airway injury suspected?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="features-inhalationSuspected"
						value={opt.value}
						bind:group={f.inhalationSuspected}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Circumferential or deep burn present?">
		<RadioGroup label="Circumferential or deep burn present?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="features-circumferentialOrDeep"
						value={opt.value}
						bind:group={f.circumferentialOrDeep}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Burn mechanism" inputId="features-mechanism">
		<Select id="features-mechanism" label="Burn mechanism" bind:value={f.mechanism}>
			<option value="">— Select —</option>
			<option value="thermal">Thermal</option>
			<option value="electrical">Electrical</option>
			<option value="chemical">Chemical</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
