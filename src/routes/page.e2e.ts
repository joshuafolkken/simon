import { test, expect } from '@playwright/test';

const LOADING_OVERLAY_TIMEOUT_MS = 8000;

test('game scene renders immediately with canvas', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();
	await expect(page.locator('[data-testid="game-scene"] canvas')).toBeVisible();
});

test('loading overlay is visible immediately on page load', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"]')).toBeVisible();
});

test('loading overlay displays the logo svg', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] svg.logo')).toBeVisible();
});

test('loading overlay reaches 100% progress once the scene is ready', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] .progress')).toHaveText('100%', {
		timeout: LOADING_OVERLAY_TIMEOUT_MS
	});
});

test('loading overlay shows ready text once the scene is ready', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"] .status')).toHaveText('READY', {
		timeout: LOADING_OVERLAY_TIMEOUT_MS
	});
});

test('loading overlay disappears once the scene is ready', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="loading-overlay"]')).toBeHidden({
		timeout: LOADING_OVERLAY_TIMEOUT_MS
	});
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();
});

test('CLICK TO PLAY hint is visible before the user clicks', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.click-hint')).toBeVisible();
});

test('CLICK TO PLAY hint disappears after the game scene is clicked', async ({ page }) => {
	await page.goto('/');
	await page.locator('[data-testid="game-scene"]').click();
	await expect(page.locator('.click-hint')).toHaveCount(0);
});

test('fullscreen is requested on the game-scene container when CLICK TO PLAY is clicked', async ({
	page
}) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();

	const fullscreen_target = await page.evaluate(
		() =>
			new Promise<string>((resolve) => {
				const scene = document.querySelector<HTMLElement>('[data-testid="game-scene"]');
				if (!scene) {
					resolve('no-scene');
					return;
				}
				scene.requestFullscreen = function (): Promise<void> {
					resolve('game-scene');
					return Promise.resolve();
				};
				scene.click();
			})
	);

	expect(fullscreen_target).toBe('game-scene');
});

test('pseudo-fullscreen class is applied when native API is unavailable', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();

	await page.evaluate(() => {
		const scene = document.querySelector<HTMLElement>('[data-testid="game-scene"]');
		if (!scene) return;
		Object.defineProperty(scene, 'requestFullscreen', { value: undefined, configurable: true });
		Object.defineProperty(scene, 'webkitRequestFullscreen', {
			value: undefined,
			configurable: true
		});
		scene.click();
	});

	await expect(page.locator('[data-testid="game-scene"]')).toHaveClass(/pseudo-fullscreen/);
});
