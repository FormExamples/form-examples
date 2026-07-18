<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'zarit-burden-interviews';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Zarit Burden Interview
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">ZBI carer-burden screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A caregiver self-report questionnaire that sums 0-4 frequency ratings into a ZBI-22 total (0-88)
			or the validated ZBI-12 short-form total (0-48) to screen the subjective burden of an informal
			carer, mapping the total to a burden band and independently flagging carer mental-health risk
			from the overall-burden item.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/zarit-burden-interview/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step ZBI screen. One continuous single-page wizard that scores the carer as
				you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/zarit-burden-interview/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed carers with their computed ZBI total and burden band, and filter by care
				setting and band.
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
					Capture the ZBI item ratings — each rated on a 0-4 frequency scale (0 = Never … 4 = Nearly
					always), with no reverse-scoring, so a higher rating always means greater perceived
					burden — and produce a graded report: total score (ZBI-22 0-88, or the validated ZBI-12
					short form 0-48 with a high-burden cut-off of &ge; 17), burden band, and flagged issues,
					including item 22 (overall burden), which drives the carer mental-health flag
					independently of the total, to prompt carer support, respite, and mental-health
					screening. The ZBI is a screen, not a diagnosis.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive scoring engine
					(ZBI-22 and ZBI-12), and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on Zarit, Reeves &amp; Bach-Peterson (The Gerontologist, 1980) and the Bédard (2001)
					short form; aligned with NICE NG97. A screening prompt, not a diagnosis of the carer.
				</dd>
			</div>
		</dl>
	</section>
</main>
