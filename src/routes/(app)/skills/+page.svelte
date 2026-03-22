<script lang="ts">
	import { enhance } from '$app/forms';
	import Badge from '$lib/components/Badge.svelte';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<div class="mb-8">
	<h1 class="text-2xl font-semibold text-gray-900">Skills</h1>
	<p class="mt-1 text-gray-500">Enrol in a skill to start learning.</p>
</div>

{#if data.skills.length === 0}
	<p class="text-gray-400">No skills available yet.</p>
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.skills as skill}
			<div class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5">
				<Badge text={skill.category} />
				<div>
					<a href="/skills/{skill.id}" class="font-semibold text-gray-900 hover:text-indigo-600">
						{skill.name}
					</a>
					{#if skill.description}
						<p class="mt-1 text-sm text-gray-500">{skill.description}</p>
					{/if}
				</div>
				{#if skill.enrolled}
					<span class="text-sm font-medium text-green-600">✓ Enrolled</span>
				{:else}
					<form method="POST" action="?/enrol" use:enhance>
						<input type="hidden" name="skillId" value={skill.id} />
						<button
							type="submit"
							class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
						>
							Enroll
						</button>
					</form>
				{/if}
			</div>
		{/each}
	</div>
{/if}
