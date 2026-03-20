<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let queue = $state(data.queue);
	let current = $derived(queue[0]);
	let flipped = $state(false);
	let done = $state(false);

	function next() {
		queue = queue.slice(1);
		flipped = false;
		if (queue.length === 0) done = true;
	}
</script>

<div class="mb-8">
	<h1 class="text-2xl font-semibold text-gray-900">Review</h1>
	<p class="mt-1 text-gray-500">{queue.length} card{queue.length === 1 ? '' : 's'} due today</p>
</div>

{#if done || queue.length === 0}
	<div class="py-20 text-center">
		<p class="mb-4 text-4xl">🎉</p>
		<h2 class="text-xl font-semibold text-gray-900">All done for today!</h2>
		<p class="mt-2 text-gray-500">Come back tomorrow for your next review session.</p>
		<a href={resolve('/skills')} class="mt-6 inline-block text-sm text-indigo-600 hover:underline">
			Browse skills →
		</a>
	</div>
{:else if current}
	<div class="mx-auto max-w-xl">
		<div class="mb-4 text-center text-sm text-gray-400">
			{queue.length} remaining
		</div>

		<!-- Card -->
		<div
			class="flex min-h-48 cursor-pointer flex-col justify-center rounded-2xl border border-gray-200 bg-white p-8 transition-colors hover:border-indigo-300"
			onclick={() => (flipped = true)}
			role="button"
			tabindex="0"
		>
			{#if !flipped}
				<p class="mb-3 text-center text-xs font-medium text-gray-400">
					Question — click to reveal answer
				</p>
				<p class="text-center text-lg font-medium text-gray-900">{current.front}</p>
			{:else}
				<p class="mb-3 text-center text-xs font-medium text-indigo-500">Answer</p>
				<p class="text-center text-lg text-gray-700">{current.back}</p>
			{/if}
		</div>

		<!-- Rating buttons — only show after flip -->
		{#if flipped}
			<div class="mt-6">
				<p class="mb-3 text-center text-sm text-gray-500">How well did you remember?</p>
				<div class="grid grid-cols-4 gap-2">
					{#each [{ rating: 1, label: 'Forgot' }, { rating: 2, label: 'Hard' }, { rating: 3, label: 'Good' }, { rating: 4, label: 'Easy' }] as btn (btn.rating)}
						<form
							method="POST"
							action="?/review"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
									next();
								};
							}}
						>
							<input type="hidden" name="flashcardId" value={current.id} />
							<input type="hidden" name="rating" value={btn.rating} />
							<input type="hidden" name="ease" value={current.ease} />
							<input type="hidden" name="interval" value={current.interval} />
							<button
								type="submit"
								class="w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors
        {btn.rating === 1 ? 'bg-red-100 text-red-700 hover:bg-red-200' : ''}
        {btn.rating === 2 ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : ''}
        {btn.rating === 3 ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''}
        {btn.rating === 4 ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}"
							>
								{btn.label}
							</button>
						</form>
					{/each}
				</div>
			</div>
		{:else}
			<p class="mt-4 text-center text-sm text-gray-400">Click the card to reveal the answer</p>
		{/if}
	</div>
{/if}
