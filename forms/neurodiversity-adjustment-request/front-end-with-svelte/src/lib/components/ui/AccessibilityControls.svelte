<!--
  Accessibility controls for the Neurodiversity Adjustment front-end.

  A neurodiversity form should itself be exemplary for neurodivergent users.
  Provides comfortable reading mode (increased spacing + a dyslexia-friendly
  font stack), a text-size control, and read-aloud (Web Speech API). Preferences
  persist in localStorage under a user-level key shared with the HTML front-end,
  and are mirrored onto <html> so the CSS in app.css can react. Reduced motion is
  handled in CSS. Progressive enhancement — omitting this component changes
  nothing else.
-->
<script lang="ts">
	import { browser } from '$app/environment';

	const PREFS_KEY = 'neurodiversity-adjustment.a11y.v1';
	const SCALES = ['normal', 'large', 'xlarge'] as const;
	type Scale = (typeof SCALES)[number];
	const SCALE_LABELS: Record<Scale, string> = {
		normal: 'Standard',
		large: 'Large',
		xlarge: 'Extra large'
	};

	function load(): { comfortable: boolean; scale: Scale } {
		if (!browser) return { comfortable: false, scale: 'normal' };
		try {
			const raw = localStorage.getItem(PREFS_KEY);
			if (!raw) return { comfortable: false, scale: 'normal' };
			const p = JSON.parse(raw) as { comfortable?: unknown; scale?: unknown };
			const scale = SCALES.includes(p.scale as Scale) ? (p.scale as Scale) : 'normal';
			return { comfortable: p.comfortable === true, scale };
		} catch {
			return { comfortable: false, scale: 'normal' };
		}
	}

	const initial = load();
	let comfortable = $state(initial.comfortable);
	let scale = $state<Scale>(initial.scale);
	let speaking = $state(false);

	const canSpeak =
		browser &&
		'speechSynthesis' in window &&
		typeof window.SpeechSynthesisUtterance === 'function';

	$effect(() => {
		if (!browser) return;
		document.documentElement.classList.toggle('a11y-comfortable', comfortable);
		document.documentElement.setAttribute('data-a11y-scale', scale);
		try {
			localStorage.setItem(PREFS_KEY, JSON.stringify({ comfortable, scale }));
		} catch {
			/* ignore quota / privacy-mode errors */
		}
	});

	function cycleScale() {
		scale = SCALES[(SCALES.indexOf(scale) + 1) % SCALES.length];
	}

	function readAloud() {
		if (!canSpeak) return;
		if (speaking) {
			window.speechSynthesis.cancel();
			speaking = false;
			return;
		}
		const sel = (window.getSelection?.()?.toString() ?? '').trim();
		const h1 = document.querySelector('h1')?.textContent ?? '';
		const intro = document.querySelector('main p')?.textContent ?? '';
		const text = (sel.length ? sel : `${h1}. ${intro}`).replace(/\s+/g, ' ').trim();
		if (!text) return;
		const u = new window.SpeechSynthesisUtterance(text);
		u.rate = 0.95;
		u.onend = () => (speaking = false);
		u.onerror = () => (speaking = false);
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(u);
		speaking = true;
	}
</script>

<div class="flex items-center gap-1" role="region" aria-label="Accessibility options">
	<button
		type="button"
		class="btn btn-ghost btn-sm"
		class:btn-active={comfortable}
		aria-pressed={comfortable}
		title="Increase spacing and use a dyslexia-friendly font"
		onclick={() => (comfortable = !comfortable)}
	>
		Reading comfort
	</button>
	<button
		type="button"
		class="btn btn-ghost btn-sm"
		title="Cycle the text size"
		onclick={cycleScale}
	>
		Text size: {SCALE_LABELS[scale]}
	</button>
	{#if canSpeak}
		<button
			type="button"
			class="btn btn-ghost btn-sm"
			class:btn-active={speaking}
			aria-pressed={speaking}
			onclick={readAloud}
		>
			{speaking ? 'Stop reading' : 'Read aloud'}
		</button>
	{/if}
</div>
