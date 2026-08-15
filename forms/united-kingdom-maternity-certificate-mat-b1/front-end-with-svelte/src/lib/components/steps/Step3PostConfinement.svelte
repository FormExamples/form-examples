<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const data = assessment.data;
	const post = data.postConfinement;
</script>

<Fieldset legend="Part B — Post-Confinement Certificate">
	<p class="hint">
		Complete Part B only when the certificate is being issued after the birth.
		The expected date of confinement (EWC) is still required for SMP /
		Maternity Allowance entitlement.
	</p>

	{#if data.certificateType === 'post'}
		<Field label="Baby's actual date of birth" required inputId="actualDateOfBirth">
			<DateInput id="actualDateOfBirth" label="Baby's actual date of birth" required bind:value={post.actualDateOfBirth} />
		</Field>

		<Field label="Expected date of confinement (EWC)" required inputId="postEwc">
			<DateInput id="postEwc" label="Expected date of confinement (EWC)" required bind:value={post.expectedDateOfConfinement} />
		</Field>
	{:else if data.certificateType === 'pre'}
		<p class="hint">Part A (pre-confinement) was selected in Step 2 — Part B is not applicable.</p>
	{:else}
		<p class="hint">Select a certificate type in Step 2 to enable this section.</p>
	{/if}
</Fieldset>
