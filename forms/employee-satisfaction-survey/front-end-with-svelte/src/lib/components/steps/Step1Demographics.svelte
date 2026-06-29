<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { DEPARTMENT_OPTIONS, TENURE_OPTIONS, HOURS_OPTIONS } from '$lib/engine/rules';

	const d = assessment.data.demographics;
</script>

<Fieldset legend="Demographics">
	<p class="hint">
		Anonymised context only. These broad bands keep your responses anonymous —
		please do not enter anything that could identify you.
	</p>

	<Field label="Department" required inputId="department">
		<Select id="department" label="Department" required bind:value={d.department}>
			<option value="">-- Select --</option>
			{#each DEPARTMENT_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Tenure band" required inputId="tenureBand">
		<Select id="tenureBand" label="Tenure band" required bind:value={d.tenureBand}>
			<option value="">-- Select --</option>
			{#each TENURE_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Hours band" inputId="hoursBand">
		<Select id="hoursBand" label="Hours band" bind:value={d.hoursBand}>
			<option value="">-- Select --</option>
			{#each HOURS_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
