<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'columbia-suicide-severity-rating-scales';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Columbia Suicide Severity Rating Scale
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">C-SSRS suicide-risk assessment</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A structured suicide-risk assessment, completed as a single continuous wizard. It records the
			severity of suicidal ideation on a five-point ordinal scale (Q1-Q5), categories of suicidal
			behaviour, and the lethality of any actual attempt, then derives a
			<strong>Low / Moderate / High</strong> risk tier with a proportionate management
			recommendation. This is a severity- and status-classification instrument: there is no summed
			score. A high-risk screen prompts an urgent psychiatric or crisis-service response.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/columbia-suicide-severity-rating-scale/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step C-SSRS screen. One continuous single-page wizard that classifies the
				risk tier as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/columbia-suicide-severity-rating-scale/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed ideation level and risk tier, and filter by
				care setting and risk tier.
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
					Capture the ideation, behaviour, and lethality dimensions and produce a graded report — a
					Low / Moderate / High risk tier, the fired criteria, and flagged issues — to support
					timely, proportionate suicide-risk management.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the ordinal + categorical
					classification engine, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Posner et al. (Am J Psychiatry 2011) and NICE NG225. A validated screening tool
					used by trained staff — a risk stratification, not a diagnosis, and not a substitute for
					clinical judgement or local safeguarding policy.
				</dd>
			</div>
		</dl>
	</section>
</main>
