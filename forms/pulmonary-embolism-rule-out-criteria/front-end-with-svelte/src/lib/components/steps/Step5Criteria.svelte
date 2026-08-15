<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { criterionStatusColor, criterionStatusLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.criteria;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	// Each clinical criterion is SATISFIED only in its reassuring 'no' state.
	const legSatisfied = $derived(c.unilateralLegSwelling === 'no');
	const haemoptysisSatisfied = $derived(c.haemoptysis === 'no');
	const surgerySatisfied = $derived(c.recentSurgeryOrTrauma === 'no');
	const priorVteSatisfied = $derived(c.priorVenousThromboembolism === 'no');
	const oestrogenSatisfied = $derived(c.oestrogenUse === 'no');
</script>

<Fieldset legend="Step 5 of 6 — Clinical criteria">
	<p class="hint">
		Criteria 4 to 8 are yes/no clinical findings. Each is satisfied only when the answer is
		<strong>No</strong> — the reassuring state must be positively documented. A finding that is
		present, or left unanswered, fails its criterion.
	</p>

	<!-- Criterion 4 -->
	<Field label="Criterion 4 — Unilateral leg swelling present?">
		<RadioGroup label="Unilateral leg swelling present?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="criteria-unilateralLegSwelling"
						value={opt.value}
						bind:group={c.unilateralLegSwelling}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion 4 status (no unilateral leg swelling)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionStatusColor(legSatisfied)}">
			{criterionStatusLabel(legSatisfied)}
		</span>
	</Field>

	<!-- Criterion 5 -->
	<Field label="Criterion 5 — Haemoptysis present?">
		<RadioGroup label="Haemoptysis present?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="criteria-haemoptysis"
						value={opt.value}
						bind:group={c.haemoptysis}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion 5 status (no haemoptysis)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionStatusColor(haemoptysisSatisfied)}">
			{criterionStatusLabel(haemoptysisSatisfied)}
		</span>
	</Field>

	<!-- Criterion 6 -->
	<Field
		label="Criterion 6 — Surgery or trauma requiring general anaesthesia in the past 4 weeks?"
	>
		<RadioGroup label="Recent surgery or trauma in the past 4 weeks?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="criteria-recentSurgeryOrTrauma"
						value={opt.value}
						bind:group={c.recentSurgeryOrTrauma}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion 6 status (no recent surgery or trauma)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionStatusColor(surgerySatisfied)}">
			{criterionStatusLabel(surgerySatisfied)}
		</span>
	</Field>

	<!-- Criterion 7 -->
	<Field label="Criterion 7 — Prior deep vein thrombosis or pulmonary embolism?">
		<RadioGroup label="Prior DVT or PE?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="criteria-priorVenousThromboembolism"
						value={opt.value}
						bind:group={c.priorVenousThromboembolism}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion 7 status (no prior DVT or PE)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionStatusColor(priorVteSatisfied)}">
			{criterionStatusLabel(priorVteSatisfied)}
		</span>
	</Field>

	<!-- Criterion 8 -->
	<Field label="Criterion 8 — Exogenous oestrogen use (oral contraceptive or HRT)?">
		<RadioGroup label="Exogenous oestrogen use?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="criteria-oestrogenUse"
						value={opt.value}
						bind:group={c.oestrogenUse}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Criterion 8 status (no exogenous oestrogen)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionStatusColor(oestrogenSatisfied)}">
			{criterionStatusLabel(oestrogenSatisfied)}
		</span>
	</Field>
</Fieldset>
