<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import LikertItem from '#lib/components/ui/LikertItem.svelte';
	import { ROLE_LEVEL_OPTIONS, WORK_LOCATION_OPTIONS } from '#lib/engine/rules.js';

	const d = assessment.data.roleTenure;
</script>

<Fieldset legend="Role & Tenure">
	<p class="hint">
		Captures the shape of your role. These responses are context only and do not
		contribute to the composite satisfaction score.
	</p>

	<Field label="Role level" inputId="roleLevel">
		<Select id="roleLevel" label="Role level" bind:value={d.roleLevel}>
			<option value="">-- Select --</option>
			{#each ROLE_LEVEL_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Work location" inputId="workLocation">
		<Select id="workLocation" label="Work location" bind:value={d.workLocation}>
			<option value="">-- Select --</option>
			{#each WORK_LOCATION_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<LikertItem id="rt1" label="My role description matches the work I actually do." bind:value={d.rt1} />
	<LikertItem id="rt2" label="My workload is appropriate for my level." bind:value={d.rt2} />
</Fieldset>
