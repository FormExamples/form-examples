<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const fi = assessment.data.functionalImpact;

	const rows: { key: keyof typeof fi; label: string }[] = [
		{ key: 'workAcademicImpact', label: 'Work / Academic performance' },
		{ key: 'relationshipImpact', label: 'Relationships (family, friends, romantic)' },
		{ key: 'dailyLivingImpact', label: 'Daily living activities (housework, errands, self-care)' },
		{ key: 'financialManagementImpact', label: 'Financial management (bills, budgeting, impulse spending)' },
		{ key: 'timeManagementImpact', label: 'Time management (punctuality, deadlines, planning)' }
	];
</script>

<Fieldset legend="Functional Impact">
	<p class="hint">How do your symptoms affect different areas of your life? ADHD diagnosis requires symptoms to cause significant impairment (DSM-5 criterion D).</p>

	{#each rows as r (r.key)}
		<Field label={r.label} required inputId={r.key as string}>
			<Select id={r.key as string} label={r.label} required bind:value={fi[r.key]}>
				<option value="">— Select —</option>
				<option value="none">No impact</option>
				<option value="mild">Mild — occasional difficulties</option>
				<option value="moderate">Moderate — frequent difficulties</option>
				<option value="severe">Severe — significant impairment</option>
			</Select>
		</Field>
	{/each}
</Fieldset>
