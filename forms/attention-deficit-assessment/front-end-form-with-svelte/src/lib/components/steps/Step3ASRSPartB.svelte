<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const b = assessment.data.asrsPartB;

	function bindScore(field: keyof typeof b) {
		return {
			get value() {
				return b[field] !== null ? String(b[field]) : '';
			},
			set value(v: string) {
				(b as unknown as Record<string, unknown>)[field as string] = v === '' ? null : Number(v);
			}
		};
	}

	const questions = [
		{ id: 'carelessMistakes', q: 'Q7. How often do you make careless mistakes when you have to work on a boring or difficult project?', binding: bindScore('carelessMistakes') },
		{ id: 'attentionDifficulty', q: 'Q8. How often do you have difficulty keeping your attention when you are doing boring or repetitive work?', binding: bindScore('attentionDifficulty') },
		{ id: 'concentrationDifficulty', q: 'Q9. How often do you have difficulty concentrating on what people say to you, even in a one-on-one situation?', binding: bindScore('concentrationDifficulty') },
		{ id: 'misplacingThings', q: 'Q10. How often do you misplace or have difficulty finding things at home or at work?', binding: bindScore('misplacingThings') },
		{ id: 'distractedByNoise', q: 'Q11. How often are you distracted by activity or noise around you?', binding: bindScore('distractedByNoise') },
		{ id: 'leavingSeat', q: 'Q12. How often do you leave your seat in meetings or other situations in which you are expected to remain seated?', binding: bindScore('leavingSeat') },
		{ id: 'restlessness', q: 'Q13. How often do you feel restless or fidgety?', binding: bindScore('restlessness') },
		{ id: 'difficultyRelaxing', q: 'Q14. How often do you have difficulty unwinding and relaxing when you have time to yourself?', binding: bindScore('difficultyRelaxing') },
		{ id: 'talkingTooMuch', q: 'Q15. How often do you find yourself talking too much when you are in social situations?', binding: bindScore('talkingTooMuch') },
		{ id: 'finishingSentences', q: 'Q16. How often do you finish the sentences of people you are talking to before they can finish them?', binding: bindScore('finishingSentences') },
		{ id: 'difficultyWaiting', q: 'Q17. How often do you have difficulty waiting your turn in situations when turn-taking is required?', binding: bindScore('difficultyWaiting') },
		{ id: 'interruptingOthers', q: 'Q18. How often do you interrupt others when they are busy?', binding: bindScore('interruptingOthers') }
	];
</script>

<Fieldset legend="ASRS Part B">
	<p class="hint">Rate how often you have experienced each additional symptom over the past 6 months.</p>

	{#each questions as q (q.id)}
		<Field label={q.q} inputId={q.id}>
			<Select id={q.id} label={q.q} bind:value={q.binding.value}>
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
