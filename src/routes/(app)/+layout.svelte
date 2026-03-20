<script lang="ts">
	import '../layout.css';
	import { navigating, page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { LayoutProps } from './$types';
	let { data, children }: LayoutProps = $props();

	let dropdownOpen = $state(false);

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function closeDropdown() {
		dropdownOpen = false;
	}

	function isActive(path: string) {
		if (path === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(path);
	}
</script>

<svelte:window
	onclick={(e) => {
		if (!(e.target as HTMLElement).closest('#avatar-menu')) {
			dropdownOpen = false;
		}
	}}
/>

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
			{#each [{ href: '/', label: 'Dashboard' }, { href: '/skills', label: 'Skills' }, { href: '/quiz', label: 'Quiz' }, { href: '/review', label: 'Review' }] as link}
				<a
					href={link.href}
					class="transition-colors {isActive(link.href)
						? 'font-medium text-indigo-600'
						: 'text-gray-600 hover:text-gray-900'}"
				>
					{link.label}
				</a>
			{/each}

			<div class="relative" id="avatar-menu">
				<button
					onclick={toggleDropdown}
					class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-200"
				>
					{data.user.name?.charAt(0).toUpperCase()}
				</button>

				{#if dropdownOpen}
					<div
						class="absolute top-10 right-0 z-50 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
					>
						<div class="border-b border-gray-100 px-4 py-3">
							<p class="truncate text-sm font-medium text-gray-900">{data.user.name}</p>
							<p class="truncate text-xs text-gray-400">{data.user.email}</p>
						</div>
						<a
							href="/profile"
							onclick={closeDropdown}
							class="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors
								{isActive('/profile') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}"
						>
							Profile
						</a>
						<form method="POST" action="/auth?/signOut" use:enhance>
							<button
								type="submit"
								class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
							>
								Sign out
							</button>
						</form>
					</div>
				{/if}
			</div>
		</div>
	</nav>

	<main class="mx-auto max-w-4xl px-6 py-8">
		{@render children()}
	</main>
</div>
