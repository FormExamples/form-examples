<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { DEPARTMENT_OPTIONS, TENURE_OPTIONS, HOURS_OPTIONS } from '$lib/engine/rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.demographics;
</script>

<Fieldset legend="About you">
	<p class="hint">
		These questions are deliberately broad so no individual can be identified. Please do not enter
		your name or any details that could single you out.
	</p>

	<Field label="Department / team" required inputId="department">
		<Select id="department" label="Department / team" required bind:value={d.department}>
			<option value="">-- Select --</option>
			{#each DEPARTMENT_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Length of service" inputId="tenureBand">
		<Select id="tenureBand" label="Length of service" bind:value={d.tenureBand}>
			<option value="">-- Select --</option>
			{#each TENURE_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Usual working hours" inputId="hoursBand">
		<Select id="hoursBand" label="Usual working hours" bind:value={d.hoursBand}>
			<option value="">-- Select --</option>
			{#each HOURS_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
