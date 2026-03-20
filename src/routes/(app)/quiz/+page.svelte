<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	let loadingId = $state<string | null>(null);
</script>

<div class="mb-8">
	<h1 class="text-2xl font-semibold text-gray-900">Quiz</h1>
	<p class="mt-1 text-gray-500">Pick a skill to practice with AI-generated questions.</p>
</div>

{#if data.enrolled.length === 0}
	<div class="py-12 text-center">
		<p class="mb-4 text-gray-400">You haven't enrolled in any skills yet.</p>
		<a href="/skills" class="text-sm text-indigo-600 hover:underline">Browse skills →</a>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.enrolled as us}
			<a
				href="/quiz/{us.skillId}"
				onclick={() => (loadingId = us.skillId)}
				class="block rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-300"
			>
				<p class="mb-1 text-xs font-medium text-indigo-500">{us.skill.category}</p>
				<p class="font-semibold text-gray-900">{us.skill.name}</p>
				<p class="mt-1 text-sm text-gray-400">{us.xp} XP</p>
				<div class="mt-3 flex items-center gap-2">
					{#if loadingId === us.skillId}
						<div
							class="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
						></div>
						<p class="text-sm font-medium text-indigo-400">Generating questions...</p>
					{:else}
						<p class="text-sm font-medium text-indigo-600">Start quiz →</p>
					{/if}
				</div>
			</a>
		{/each}
	</div>
{/if}
