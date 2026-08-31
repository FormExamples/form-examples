<script lang="ts">
  import { REPO_URL } from '$lib/site';
  const year = new Date().getFullYear();
</script>

<footer class="mt-16 border-t border-base-300 py-8 text-sm text-muted">
  <div class="px-4 sm:px-6">
    © {year} —
    <a href={REPO_URL} target="_blank" rel="noopener noreferrer">form-examples on GitHub</a>
  </div>
</footer>
