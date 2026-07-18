<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'centor-score-for-streptococcal-pharyngitises';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Centor Score for Streptococcal Pharyngitis
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			Centor / McIsaac sore-throat decision aid
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A clinical prediction tool, completed as a single continuous wizard, that estimates the
			likelihood an acute sore throat is caused by group A streptococcus from four objective Centor
			criteria — tonsillar exudate, tender anterior cervical nodes, fever (&gt; 38 °C or history),
			and absence of cough — each worth 1 point (total 0 to 4), then applies the McIsaac age
			modifier (+1 for ages 3–14, 0 for 15–44, &minus;1 for &ge; 45) for a modified score of &minus;1
			to 5 that bands the probability and guides testing and antibiotic decisions.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/centor-score-for-streptococcal-pharyngitis/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step Centor / McIsaac screen. One continuous single-page wizard that scores
				the patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/centor-score-for-streptococcal-pharyngitis/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their Centor total, modified McIsaac score, and risk band, and
				filter by care setting and risk band.
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
					Capture the four Centor criteria and the patient age, then produce a graded report —
					Centor total, modified McIsaac score, risk band, and flagged issues — to support testing
					and antibiotic-stewardship decisions.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the additive scoring engine,
					the McIsaac age modifier, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Centor et al. (1981), McIsaac et al. (CMAJ 1998; JAMA 2004), and NICE NG84. A
					decision aid, not a diagnosis; UK primary care may use FeverPAIN as an alternative.
				</dd>
			</div>
		</dl>
	</section>
</main>
