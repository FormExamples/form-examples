<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const h = assessment.data.haemodynamic;
</script>

<Fieldset legend="Step 3 of 6 — Haemodynamic status">
	<p class="hint">
		Record whether the patient is haemodynamically stable. Instability suggests a massive PE — do
		not wait on scoring: resuscitate and image immediately.
	</p>

	<Field label="Haemodynamic status">
		<RadioGroup label="Haemodynamic status">
			<label>
				<input
					type="radio"
					class="radio-input"
					name="haemodynamic-haemodynamicStatus"
					value="stable"
					bind:group={h.haemodynamicStatus}
				/> Stable
			</label>
			<label>
				<input
					type="radio"
					class="radio-input"
					name="haemodynamic-haemodynamicStatus"
					value="unstable"
					bind:group={h.haemodynamicStatus}
				/> Unstable (suspected massive PE)
			</label>
		</RadioGroup>
	</Field>

	{#if h.haemodynamicStatus === 'unstable'}
		<div class="rounded-lg border border-error bg-error/10 p-3 text-sm text-error">
			Haemodynamically unstable — treat as suspected massive PE. Resuscitate and arrange immediate
			CTPA or bedside echocardiography; consider empirical thrombolysis per local policy.
		</div>
	{/if}
</Fieldset>
