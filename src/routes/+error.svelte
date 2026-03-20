<script lang="ts">
	import { page } from '$app/stores';
	import './layout.css';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
	<div class="text-center">
		<p class="text-6xl font-bold text-indigo-600">{$page.status}</p>
		<h1 class="mt-4 text-2xl font-semibold text-gray-900">
			{$page.status === 404 ? 'Page not found' : 'Something went wrong'}
		</h1>
		<p class="mt-2 text-gray-500">
			{$page.status === 404
				? "We couldn't find what you were looking for."
				: ($page.error?.message ?? 'An unexpected error occurred.')}
		</p>
		<a
			href="/"
			class="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
		>
			Back to dashboard
		</a>
	</div>
</div>
