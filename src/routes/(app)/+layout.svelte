<script lang="ts">
	import { resolve } from '$app/paths';
	import '../layout.css';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();
</script>

<div class="min-h-screen bg-gray-50">
	<nav class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
		<a href={resolve('/')} class="text-lg font-semibold text-indigo-600">Skillio</a>
		<div class="flex items-center gap-6 text-sm">
			<a href={resolve('/')} class="text-gray-600 hover:text-gray-900">Dashboard</a>
			<a href={resolve('/skills')} class="text-gray-600 hover:text-gray-900">Skills</a>
			<a href={resolve('/review')} class="text-gray-600 hover:text-gray-900">Review</a>
			<span class="text-gray-400">{data.user.email}</span>
		</div>
	</nav>

	<main class="mx-auto max-w-4xl px-6 py-8">
		{@render children()}
	</main>
</div>
