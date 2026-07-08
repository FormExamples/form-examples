<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the examination form and the clinician
	// dashboard.
	const plural = 'newborn-and-infant-physical-examinations';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Newborn and Infant Physical Examination
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">NIPE newborn screening examination</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A UK national-screening head-to-toe examination of a baby, performed within 72 hours of birth
			and repeated at the 6-8 week infant review, completed as a single continuous wizard. It records
			a systematic examination and classifies four key screening components — eyes, heart, hips, and
			testes (in boys) — each as <strong>Satisfactory</strong>, <strong>Refer</strong>, or
			<strong>Not examined</strong>, then rolls the applicable components up into an overall
			screening outcome and referral pathways. This is a classification and completeness form: there
			is no numeric score.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/newborn-and-infant-physical-examination/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new examination</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step NIPE screen. One continuous single-page wizard that classifies each
				key component as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/newborn-and-infant-physical-examination/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse examined babies with their computed screening outcome, completeness, and referral
				counts, and filter by examination context and outcome.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture the four NIPE key components and the head-to-toe examination and produce a graded
					report — an overall screening outcome, per-component results, referral pathways, and
					flagged issues — to support timely newborn screening and referral.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the per-component
					classification engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the NHS England / Public Health England NIPE Screening Programme Handbook and
					programme standards, and NICE NG194 postnatal care. A screening prompt, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
