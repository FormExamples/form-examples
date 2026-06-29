<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const a = assessment.data.asrsPartA;

	function bindScore(field: keyof typeof a) {
		return {
			get value() {
				return a[field] !== null ? String(a[field]) : '';
			},
			set value(v: string) {
				(a as unknown as Record<string, unknown>)[field as string] = v === '' ? null : Number(v);
			}
		};
	}

	const q1 = bindScore('focusDifficulty');
	const q2 = bindScore('organizationDifficulty');
	const q3 = bindScore('rememberingDifficulty');
	const q4 = bindScore('avoidingTasks');
	const q5 = bindScore('fidgeting');
	const q6 = bindScore('overlyActive');

	const questions = [
		{ id: 'focusDifficulty', q: 'Q1. How often do you have difficulty concentrating on what people say to you, even when they are speaking directly?', binding: q1 },
		{ id: 'organizationDifficulty', q: 'Q2. How often do you have difficulty organizing tasks and activities?', binding: q2 },
		{ id: 'rememberingDifficulty', q: 'Q3. How often do you have problems remembering appointments or obligations?', binding: q3 },
		{ id: 'avoidingTasks', q: 'Q4. When you have a task that requires sustained mental effort, how often do you avoid or delay starting it?', binding: q4 },
		{ id: 'fidgeting', q: 'Q5. How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?', binding: q5 },
		{ id: 'overlyActive', q: 'Q6. How often do you feel overly active or compelled to do things, as if driven by a motor?', binding: q6 }
	];
</script>

<Fieldset legend="ASRS Part A Screener">
	<p class="hint">Rate how often you have experienced each symptom over the past 6 months. These 6 questions are the ASRS v1.1 screener.</p>

	{#each questions as q (q.id)}
		<Field label={q.q} required inputId={q.id}>
			<Select id={q.id} label={q.q} required bind:value={q.binding.value}>
				<option value="">— Select —</option>
				<option value="0">0 — Never</option>
				<option value="1">1 — Rarely</option>
				<option value="2">2 — Sometimes</option>
				<option value="3">3 — Often</option>
				<option value="4">4 — Very Often</option>
			</Select>
		</Field>
	{/each}
</Fieldset>
