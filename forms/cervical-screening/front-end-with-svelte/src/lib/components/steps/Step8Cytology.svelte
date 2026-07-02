<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.cytology;
	const hpv = $derived(assessment.data.hpv.hpvResult);
</script>

<Fieldset legend="Step 8 of 9 — Reflex cytology">
	<p class="hint">
		Reflex cytology is performed only on an hrHPV-positive sample. It refines a positive result into
		normal (12-month repeat), low-grade abnormal (routine colposcopy), or high-grade abnormal (urgent
		colposcopy).
	</p>

	{#if hpv === 'positive'}
		<Field label="Reflex cytology grade" inputId="cytology-cytologyGrade">
			<Select id="cytology-cytologyGrade" label="Reflex cytology grade" bind:value={c.cytologyGrade}>
				<option value="">— Select —</option>
				<option value="negative">Negative (normal)</option>
				<option value="borderline">Borderline changes</option>
				<option value="low-grade">Low-grade dyskaryosis</option>
				<option value="high-grade">High-grade dyskaryosis / ?glandular / ?invasive</option>
				<option value="not-performed">Not performed</option>
			</Select>
		</Field>
	{:else}
		<p class="text-sm text-base-content/60">
			Reflex cytology does not apply: the primary hrHPV result is not positive. Record a positive
			hrHPV result in the previous step to grade reflex cytology.
		</p>
	{/if}
</Fieldset>
