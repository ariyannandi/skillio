<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { marked } from 'marked';

	let { data }: PageProps = $props();

	let flipped = $state<Record<string, boolean>>({});
	let activeTab = $state<'flashcards' | 'chat'>('flashcards');

	function flip(id: string) {
		flipped[id] = !flipped[id];
	}

	// chat
	type Message = { role: 'user' | 'assistant'; text: string };
	let messages = $state<Message[]>([]);
	let input = $state('');
	let chatLoading = $state(false);
	let chatContainer = $state<HTMLDivElement | null>(null);

	async function sendMessage() {
		if (!input.trim() || chatLoading) return;

		const question = input.trim();
		input = '';
		chatLoading = true;

		messages = [...messages, { role: 'user', text: question }];
		messages = [...messages, { role: 'assistant', text: '' }];

		const history = messages
			.slice(0, -2)
			.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', text: m.text }));

		try {
			const res = await fetch(`/api/chat`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ question, history, skillId: data.skill.id })
			});

			if (!res.body) throw new Error('No response body');

			const reader = res.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				messages[messages.length - 1] = {
					role: 'assistant',
					text: messages[messages.length - 1].text + chunk
				};
				if (chatContainer) {
					chatContainer.scrollTop = chatContainer.scrollHeight;
				}
			}
		} catch (e) {
			messages[messages.length - 1] = {
				role: 'assistant',
				text: 'Sorry, something went wrong. Please try again.'
			};
		} finally {
			chatLoading = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}
</script>

<div class="mb-8 flex items-center justify-between">
	<div>
		<a href="/skills" class="text-sm text-indigo-600 hover:underline">← Back to skills</a>
		<h1 class="mt-1 text-2xl font-semibold text-gray-900">{data.skill.name}</h1>
		<p class="mt-1 text-gray-500">{data.skill.description ?? ''}</p>
	</div>
	<div class="flex items-center gap-3">
		{#if data.enrolled}
			<a
				href="/quiz/{data.skill.id}"
				class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
				>Start quiz</a
			>
			<span class="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600"
				>✓ Enrolled</span
			>
		{/if}
	</div>
</div>

<!-- Tabs -->
<div class="mb-6 flex w-fit gap-1 rounded-lg bg-gray-100 p-1">
	<button
		onclick={() => (activeTab = 'flashcards')}
		class="rounded-md px-4 py-2 text-sm font-medium transition-colors {activeTab === 'flashcards'
			? 'bg-white text-gray-900 shadow-sm'
			: 'text-gray-500 hover:text-gray-700'}"
	>
		Flashcards ({data.flashcards.length})
	</button>
	<button
		onclick={() => (activeTab = 'chat')}
		class="rounded-md px-4 py-2 text-sm font-medium transition-colors {activeTab === 'chat'
			? 'bg-white text-gray-900 shadow-sm'
			: 'text-gray-500 hover:text-gray-700'}"
	>
		AI Tutor
	</button>
</div>

<!-- Flashcards tab -->
{#if activeTab === 'flashcards'}
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-lg font-semibold text-gray-800">Flashcards ({data.flashcards.length})</h2>
		<form method="POST" action="?/generate" use:enhance>
			<button
				type="submit"
				class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
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
			{#each data.flashcards as card}
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

	<!-- Chat tab -->
{:else}
	<div class="flex flex-col rounded-xl border border-gray-200 bg-white" style="height: 520px;">
		<!-- Messages -->
		<div bind:this={chatContainer} class="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
			{#if messages.length === 0}
				<div class="flex flex-1 flex-col items-center justify-center py-12 text-center">
					<p class="mb-3 text-3xl">🧑‍🏫</p>
					<p class="font-medium text-gray-700">Ask your {data.skill.name} tutor anything</p>
					<p class="mt-1 text-sm text-gray-400">
						Try: "Explain the basics", "Give me an example", "What should I learn first?"
					</p>
				</div>
			{:else}
				{#each messages as message}
					<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
						{#if message.role === 'user'}
							<div
								class="max-w-[80%] rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-3 text-sm text-white"
							>
								{message.text}
							</div>
						{:else}
							<div
								class="max-w-[80%] rounded-2xl rounded-bl-sm bg-gray-100 px-4 py-3 text-sm text-gray-800"
							>
								{#if message.text === ''}
									<span class="inline-flex gap-1">
										<span
											class="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
											style="animation-delay: 0ms"
										></span>
										<span
											class="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
											style="animation-delay: 150ms"
										></span>
										<span
											class="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
											style="animation-delay: 300ms"
										></span>
									</span>
								{:else}
									<div
										class="prose prose-sm max-w-none prose-code:rounded prose-code:bg-gray-200 prose-code:px-1 prose-pre:bg-gray-800 prose-pre:text-gray-100"
									>
										{@html marked(message.text)}
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		<!-- Input -->
		<div class="border-t border-gray-200 p-4">
			<div class="flex gap-2">
				<textarea
					bind:value={input}
					onkeydown={handleKeydown}
					placeholder="Ask anything about {data.skill.name}..."
					rows="1"
					disabled={chatLoading}
					class="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:opacity-50"
				></textarea>
				<button
					onclick={sendMessage}
					disabled={chatLoading || !input.trim()}
					class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
				>
					Send
				</button>
			</div>
			<p class="mt-2 text-xs text-gray-400">Press Enter to send, Shift+Enter for new line</p>
		</div>
	</div>
{/if}

<style>
	:global(.prose pre) {
		background-color: #1e1e2e;
		color: #cdd6f4;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		font-size: 0.8rem;
		line-height: 1.6;
	}

	:global(.prose code:not(pre code)) {
		background-color: #e8e8f0;
		color: #5c5f77;
		padding: 0.15rem 0.4rem;
		border-radius: 0.25rem;
		font-size: 0.85em;
	}

	:global(.prose pre code) {
		background: none;
		color: inherit;
		padding: 0;
		font-size: inherit;
	}
</style>
