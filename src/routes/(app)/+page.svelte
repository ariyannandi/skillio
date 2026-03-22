<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	import StatCard from '$lib/components/StatCard.svelte';

	const hour = new Date().getHours();
	const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
</script>

<div class="mb-8">
	<h1 class="text-2xl font-semibold text-gray-900">
		{greeting}, {data.user.name} 👋
	</h1>
	<p class="mt-1 text-gray-500">Here's your learning summary.</p>
</div>

<div class="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
	<StatCard label="Skills enrolled" value={data.stats.enrolledCount} />
	<StatCard label="Reviewed today" value={data.stats.reviewedToday} color="indigo" />
	<StatCard label="Total reviews" value={data.stats.totalReviewed} />
	<StatCard label="Due now" value={data.stats.dueNow} />
</div>

<div class="mb-8 rounded-xl border border-gray-200 bg-white p-6">
	<div class="flex items-center justify-between">
		<div>
			<p class="mb-1 text-sm text-gray-500">Best streak</p>
			<div class="flex items-baseline gap-2">
				<span class="text-4xl font-semibold text-amber-500">{data.stats.bestStreak}</span>
				<span class="text-sm text-gray-400">days</span>
			</div>
		</div>
		<div class="flex gap-1">
			{#each Array(7) as _, i}
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg text-lg
          {i < Math.min(data.stats.bestStreak, 7) ? 'bg-amber-100' : 'bg-gray-100'}"
				>
					{i < Math.min(data.stats.bestStreak, 7) ? '🔥' : '·'}
				</div>
			{/each}
		</div>
	</div>
	{#if data.stats.bestStreak === 0}
		<p class="mt-3 text-sm text-gray-400">Complete a review to start your streak!</p>
	{:else if data.stats.bestStreak >= 7}
		<p class="mt-3 text-sm font-medium text-amber-600">You're on fire! Keep it going 🏆</p>
	{:else}
		<p class="mt-3 text-sm text-gray-400">
			{7 - data.stats.bestStreak} more days to reach a week streak!
		</p>
	{/if}
</div>

{#if data.stats.dueNow > 0}
	<div
		class="mb-8 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 p-6"
	>
		<div>
			<h2 class="font-semibold text-indigo-900">You have {data.stats.dueNow} cards due</h2>
			<p class="mt-1 text-sm text-indigo-600">Keep your streak going — review now!</p>
		</div>
		<a
			href="/review"
			class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
			>Start review</a
		>
	</div>
{:else}
	<div class="mb-8 rounded-xl border border-green-100 bg-green-50 p-6">
		<h2 class="font-semibold text-green-900">All caught up!</h2>
		<p class="mt-1 text-sm text-green-600">No cards due right now. Check back later.</p>
	</div>
{/if}

{#if data.recentSkills.length > 0}
	<div>
		<h2 class="mb-4 text-lg font-semibold text-gray-800">Your skills</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
			{#each data.recentSkills as us}
				<a
					href="/skills/{us.skillId}"
					class="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-300"
				>
					<p class="mb-1 text-xs font-medium text-indigo-500">{us.skill.category}</p>
					<p class="font-semibold text-gray-900">{us.skill.name}</p>
					<p class="mt-1 text-sm text-gray-400">{us.xp} XP</p>
				</a>
			{/each}
		</div>
	</div>
{:else}
	<div class="py-12 text-center">
		<p class="mb-4 text-gray-400">You haven't enrolled in any skills yet.</p>
		<a href="/skills" class="text-sm text-indigo-600 hover:underline">Browse skills →</a>
	</div>
{/if}
