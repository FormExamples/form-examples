<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const cb = assessment.data.childbearing;
</script>

<Fieldset legend="Step 9 of 11 — Women of childbearing potential">
	<p class="hint">
		Valproate, pregnancy-prevention programme, folic acid, and contraception. Required only when
		applicable.
	</p>

	<Field
		label="Woman of childbearing potential"
		description="When Yes, the valproate / PPP and folic-acid domains become required for completeness."
		inputId="childbearing-womanOfChildbearingPotential"
	>
		<Select
			id="childbearing-womanOfChildbearingPotential"
			label="Woman of childbearing potential"
			bind:value={cb.womanOfChildbearingPotential}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field
		label="On sodium valproate"
		description="Valproate without a documented PPP raises a high-priority flag."
		inputId="childbearing-onValproate"
	>
		<Select id="childbearing-onValproate" label="On sodium valproate" bind:value={cb.onValproate}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Pregnancy Prevention Programme (PPP)" inputId="childbearing-pregnancyPreventionProgramme">
		<Select
			id="childbearing-pregnancyPreventionProgramme"
			label="Pregnancy Prevention Programme (PPP)"
			bind:value={cb.pregnancyPreventionProgramme}
		>
			<option value="">— Select —</option>
			<option value="in-place">In place</option>
			<option value="not-in-place">Not in place</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field
		label="Folic acid"
		description="No (when applicable) raises a folic-acid-missing flag."
		inputId="childbearing-folicAcid"
	>
		<Select id="childbearing-folicAcid" label="Folic acid" bind:value={cb.folicAcid}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field
		label="Contraception and ASM interaction reviewed"
		inputId="childbearing-contraceptionInteractionReviewed"
	>
		<Select
			id="childbearing-contraceptionInteractionReviewed"
			label="Contraception and ASM interaction reviewed"
			bind:value={cb.contraceptionInteractionReviewed}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>
</Fieldset>
