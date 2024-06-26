// @ts-check
const { test, expect } = require('@playwright/test');
const { title } = require('process');

// Added Email and Password to testCases to simplify
const testCases = [
  {
    "id": 1,
    "email": "ben+pose@workwithloop.com",
    "pw": "Password123",
    "name": "Test Case 1",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Draft project brief",
  },
   {
    "id": 2,
    "email": "ben+pose@workwithloop.com",
    "pw": "Password123",
    "name": "Test Case 2",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Schedule kickoff meeting",
  },
  {
    "id": 3,
    "email": "ben+pose@workwithloop.com",
    "pw": "Password123",
    "name": "Test Case 3",
    "leftNav": "Cross-functional project plan, Project",
    "column": "To do",
    "card_title": "Share timeline with teammates",
  },
  {
    "id": 4,
    "email": "ben+pose@workwithloop.com",
    "pw": "Password123",
    "name": "Test Case 4",
    "leftNav": "Work Requests",
    "column": "New Requests",
    "card_title": "[Example] Laptop setup for new hire",
  },
  {
    "id": 5,
    "email": "ben+pose@workwithloop.com",
    "pw": "Password123",
    "name": "Test Case 5",
    "leftNav": "Work Requests",
    "column": "In Progress",
    "card_title": "[Example] Password not working",
  },
  {
    "id": 6,
    "email": "ben+pose@workwithloop.com",
    "pw": "Password123",
    "name": "Test Case 6",
    "leftNav": "Work Requests",
    "column": "Completed",
    "card_title": "[Example] New keycard for Daniela V",
  } 
];

testCases.forEach((data) => {
  test(`Asana Data-Driven Test ${data.name}`, async ({ page }) => {
    await test.step('Login to Asana', async () => {

      await page.goto("https://app.asana.com/-/login");
      // Email filled.
      await page.locator(".TextInputBase.SizedTextInput.SizedTextInput--medium.TextInput.TextInput--medium.LoginEmailForm-emailInput").fill(data.email);
      // Continue button clicked.
      await page.locator(".ThemeableRectangularButtonPresentation--isEnabled.ThemeableRectangularButtonPresentation.ThemeableRectangularButtonPresentation--large.LoginButton.LoginEmailForm-continueButton").click();
      // No need for a Promise statement as url does not change.
      await page.locator(".TextInputBase.SizedTextInput.SizedTextInput--medium.TextInput.TextInput--medium.TextInputIconContainer-input.LoginPasswordForm-passwordInput").fill(data.pw);
      // Promise statement implemented with .waitForResponse as its best practice. timeout can be increased/adjusted as login can sometimes take awhile.
      const [request] = await Promise.all([
        page.waitForResponse(response => response.url().includes("/log_pageload_perf_metrics") && response.status() === 200, {timeout: 100000}),
        page.locator(".ThemeableRectangularButtonPresentation--isEnabled.ThemeableRectangularButtonPresentation.ThemeableRectangularButtonPresentation--large.LoginButton.LoginPasswordForm-loginButton").click()
      ]);  
      
    });

    await test.step('Navigate to the project page', async () => {
      // Navigate to the project page. 
      // Project pages can also be reached from the home page instead of left Navigation.
      const projects = await page.locator(".SidebarCollapsibleSection--isExpanded.SidebarCollapsibleSection.SidebarProjectsSectionCleanAndClear a");
      const project_count = await projects.count();
      projects.filter({ hasText: data.leftNav }).click();
      await expect(projects.filter({ hasText: data.leftNav })).toHaveCount(1);

      await page.waitForSelector('.BoardBody-columnDraggableItemWrapper.SortableList-sortableItemContainer');
    });

    await test.step('Verify the card is within the right column', async () => {
      // Verify the card is within the right column.
      const columns = await page.locator(".BoardBody-columnDraggableItemWrapper.SortableList-sortableItemContainer")
      .filter({ hasText: data.column.replace(" ", String.fromCharCode(160)) });
      await expect(columns).toHaveCount(1);
      const card_matched = await columns.locator(page.getByText(data.card_title));
      await expect(card_matched).toHaveCount(1);
    });
  });
});


