<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let flipped = $state<Record<string, boolean>>({});

	function flip(id: string) {
		flipped[id] = !flipped[id];
	}
</script>

<div class="mb-8 flex items-center justify-between">
	<div>
		<a href={resolve('/skills')} class="text-sm text-indigo-600 hover:underline">← Back to skills</a
		>
		<h1 class="mt-1 text-2xl font-semibold text-gray-900">{data.skill.name}</h1>
		<p class="mt-1 text-gray-500">{data.skill.description ?? ''}</p>
	</div>
	<div class="flex items-center gap-3">
		{#if data.enrolled}
			<a
				href="/quiz/{data.skill.id}"
				class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
			>
				Start quiz
			</a>
			<span class="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
				✓ Enrolled
			</span>
		{/if}
	</div>
</div>

<div class="mb-4 flex items-center justify-between">
	<h2 class="text-lg font-semibold text-gray-800">
		Flashcards ({data.flashcards.length})
	</h2>
	<form method="POST" action="?/generate" use:enhance>
		<button
			type="submit"
			class="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-700"
		>
			Generate with AI
		</button>
	</form>
</div>

{#if data.flashcards.length === 0}
	<div class="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
		<p class="mb-3 text-3xl">🃏</p>
		<p class="font-medium text-gray-700">No flashcards yet</p>
		<p class="mt-1 mb-4 text-sm text-gray-400">Generate your first set with AI to get started</p>
		<form method="POST" action="?/generate" use:enhance>
			<button
				type="submit"
				class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
			>
				Generate with AI
			</button>
		</form>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#each data.flashcards as card (card.id)}
			<button
				onclick={() => flip(card.id)}
				class="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 text-left transition-colors hover:border-indigo-300"
			>
				{#if flipped[card.id]}
					<p class="mb-2 text-xs font-medium text-indigo-500">Answer</p>
					<p class="text-gray-700">{card.back}</p>
				{:else}
					<p class="mb-2 text-xs font-medium text-gray-400">Question</p>
					<p class="font-medium text-gray-900">{card.front}</p>
				{/if}
			</button>
		{/each}
	</div>
{/if}
