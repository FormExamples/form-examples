<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.request;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">
		The echo study requested and the clinical indication. The appropriateness axis grades the study
		type against the indication (ACC/AHA/ASE &amp; BSE Appropriate Use Criteria).
	</p>

	<Field label="Requested echo type" inputId="echoType" required>
		<Select id="echoType" label="Requested echo type" bind:value={d.echoType} required>
			<option value="">Select…</option>
			<option value="transthoracic-tte">Transthoracic (TTE)</option>
			<option value="transoesophageal-toe">Transoesophageal (TOE)</option>
			<option value="stress-echo">Stress echo</option>
			<option value="contrast-echo">Contrast echo</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Primary clinical indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary clinical indication" bind:value={d.primaryIndication} required>
			<option value="">Select…</option>
			<option value="heart-failure">Heart failure</option>
			<option value="murmur">Murmur</option>
			<option value="suspected-valve-disease">Suspected valve disease</option>
			<option value="breathlessness">Breathlessness</option>
			<option value="palpitations">Palpitations</option>
			<option value="chest-pain">Chest pain</option>
			<option value="hypertension">Hypertension</option>
			<option value="cardiomyopathy">Cardiomyopathy</option>
			<option value="endocarditis">Endocarditis</option>
			<option value="post-mi">Post-MI</option>
			<option value="pulmonary-hypertension">Pulmonary hypertension</option>
			<option value="pre-chemotherapy">Pre-chemotherapy / cardio-oncology</option>
			<option value="stroke-tia-source">Stroke / TIA source</option>
			<option value="congenital">Congenital</option>
			<option value="surveillance-known-disease">Surveillance of known disease</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Specific clinical question"
		inputId="clinicalQuestion"
		required
		description="The specific question the echo should answer."
	>
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={3}
			placeholder="e.g. Assess LV function in suspected heart failure…"
			bind:value={d.clinicalQuestion}
			required
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput
			id="relevantHistory"
			label="Relevant history"
			rows={3}
			placeholder="Relevant cardiac and other history…"
			bind:value={d.relevantHistory}
		/>
	</Field>

	<Field label="Relevant medications" inputId="relevantMedications">
		<TextAreaInput
			id="relevantMedications"
			label="Relevant medications"
			rows={2}
			placeholder="Current cardiac and other relevant medications…"
			bind:value={d.relevantMedications}
		/>
	</Field>

	<Field label="Previous echo" inputId="previousEcho" description="Has the patient had a previous echocardiogram?">
		<Select id="previousEcho" label="Previous echo" bind:value={d.previousEcho}>
			<option value="">Select…</option>
			<option value="none">No previous echo</option>
			<option value="yes">Yes — previous echo performed</option>
		</Select>
	</Field>

	{#if d.previousEcho === 'yes'}
		<Field label="Previous echo date" inputId="previousEchoDate">
			<DateInput id="previousEchoDate" label="Previous echo date" bind:value={d.previousEchoDate} />
		</Field>
	{/if}

	<Field
		label="Known ejection fraction (%)"
		inputId="ejectionFractionKnown"
		description="Most recent LVEF, if known."
	>
		<NumberInput
			id="ejectionFractionKnown"
			label="Known ejection fraction (%)"
			min={0}
			max={100}
			bind:value={d.ejectionFractionKnown}
		/>
	</Field>
</Fieldset>
