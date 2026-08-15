<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		DEPARTMENT_OPTIONS,
		TENURE_OPTIONS,
		HOURS_OPTIONS,
		ROLE_LEVEL_OPTIONS,
		WORK_LOCATION_OPTIONS
	} from '#lib/engine/rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.demographics;
</script>

<Fieldset legend="About you">
	<p class="hint">
		Anonymous, non-identifying details only. These help group results in the dashboard but cannot
		single out an individual.
	</p>

	<Field label="Department / function" required inputId="department">
		<Select id="department" label="Department / function" required bind:value={d.department}>
			<option value="">— Select —</option>
			{#each DEPARTMENT_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Tenure (how long you have been at this organisation)" inputId="tenureBand">
		<Select id="tenureBand" label="Tenure" bind:value={d.tenureBand}>
			<option value="">— Select —</option>
			{#each TENURE_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Working hours (typical week)" inputId="hoursBand">
		<Select id="hoursBand" label="Working hours" bind:value={d.hoursBand}>
			<option value="">— Select —</option>
			{#each HOURS_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Role level" inputId="roleLevel">
		<Select id="roleLevel" label="Role level" bind:value={d.roleLevel}>
			<option value="">— Select —</option>
			{#each ROLE_LEVEL_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Where do you mostly work?" inputId="workLocation">
		<Select id="workLocation" label="Where do you mostly work?" bind:value={d.workLocation}>
			<option value="">— Select —</option>
			{#each WORK_LOCATION_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
