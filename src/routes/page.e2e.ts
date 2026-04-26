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
