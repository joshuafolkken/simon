import { test, expect } from '@playwright/test';

test('title screen renders with canvas', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('canvas')).toBeVisible();
});

test('clicking title screen starts game', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('canvas')).toBeVisible();
	await page.locator('.title-container').click();
	await expect(page.locator('[data-testid="game-scene"]')).toBeVisible();
});

test('game scene renders canvas after start', async ({ page }) => {
	await page.goto('/');
	await page.locator('.title-container').click();
	const game_scene = page.locator('[data-testid="game-scene"]');
	await expect(game_scene).toBeVisible();
	await expect(game_scene.locator('canvas')).toBeVisible();
});

test('crosshair is absent when pointer is not locked', async ({ page }) => {
	await page.goto('/');
	await page.locator('.title-container').click();
	await expect(page.getByTestId('crosshair')).toHaveCount(0);
});

test('crosshair appears when pointer lock is simulated', async ({ page }) => {
	await page.goto('/');
	await page.locator('.title-container').click();

	await page.evaluate(() => {
		Object.defineProperty(document, 'pointerLockElement', {
			get: () => document.body,
			configurable: true
		});
		document.dispatchEvent(new Event('pointerlockchange'));
	});

	await expect(page.getByTestId('crosshair')).toBeVisible();
});

test('pointer lock is requested on canvas element', async ({ page }) => {
	await page.goto('/');
	await page.locator('.title-container').click();

	const lock_target = await page.evaluate(
		() =>
			new Promise<string>((resolve) => {
				const canvas = document.querySelector('canvas');
				if (!canvas) {
					resolve('no-canvas');
					return;
				}
				const orig = canvas.requestPointerLock.bind(canvas);
				canvas.requestPointerLock = function () {
					resolve('canvas');
					return orig();
				};
				document.querySelector<HTMLElement>('[data-testid="game-scene"]')?.click();
			})
	);

	expect(lock_target).toBe('canvas');
});
