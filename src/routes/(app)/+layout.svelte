<script lang="ts">
	import '../layout.css';
	import { navigating } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
</script>

{#if $navigating}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
		<div class="flex flex-col items-center gap-3">
			<div
				class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"
			></div>
			<p class="text-sm text-gray-500">Loading...</p>
		</div>
	</div>
{/if}

<div class="min-h-screen bg-gray-50">
	<nav class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
		<a href="/" class="text-lg font-semibold text-indigo-600">Skillio</a>
		<div class="flex items-center gap-6 text-sm">
			<a href="/" class="text-gray-600 hover:text-gray-900">Dashboard</a>
			<a href="/skills" class="text-gray-600 hover:text-gray-900">Skills</a>
			<a href="/quiz" class="text-gray-600 hover:text-gray-900">Quiz</a>
			<a href="/review" class="text-gray-600 hover:text-gray-900">Review</a>
			<span class="text-gray-400">{data.user.email}</span>
			<form method="POST" action="/auth?/signOut" use:enhance>
				<button type="submit" class="text-gray-500 transition-colors hover:text-red-600">
					Sign out
				</button>
			</form>
		</div>
	</nav>

	<main class="mx-auto max-w-4xl px-6 py-8">
		{@render children()}
	</main>
</div>
