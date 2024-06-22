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
      let match_project = 0;

      for(let i=0; i < project_count; ++i) {
        if (await projects.nth(i).locator("span").textContent() === data.leftNav) {
          await projects.nth(i).locator("span").click();
          // Project is found.
          match_project++;
          break;
          }           
      }
      // If project is not found, the assertion/test fails.
      expect(match_project).toBeGreaterThan(0);
      await page.waitForSelector('.BoardBody-columnDraggableItemWrapper.SortableList-sortableItemContainer');
    });

    await test.step('Verify the card is within the right column', async () => {
      // Verify the card is within the right column.
      const columns = await page.locator(".BoardBody-columnDraggableItemWrapper.SortableList-sortableItemContainer");
      const column_count = await columns.count();
      let match_column = 0;
      // Iterate to locate the specified column.
      for (let i=0; i < column_count; ++i){
        // The "space" character ASCII code of the h3s are represented by 160, while data.column spaces are 32. I adjusted accordingly.
        if (await columns.nth(i).locator("h3").textContent() === data.column.replace(" ",
          String.fromCharCode(160))) {
          const cards_in_column = await columns.nth(i).locator(".TypographyPresentation.TypographyPresentation--m.BoardCard-taskName");
          const card_count = await columns.nth(i).locator(".TypographyPresentation.TypographyPresentation--m.BoardCard-taskName").count();
          let match_count = 0;
          // Column is found.
          match_column++;
          // Iterate through the cards in the located column.  
          for (let x=0; x < card_count; ++x){
            if(await cards_in_column.nth(x).textContent() === data.card_title){
              // The card is found in the matching column.
              match_count++;
              break;
            }
          }
          // If match_count equals 0, then the specified card_title was not found in the specified column of the test case.
          expect(match_count).toBeGreaterThan(0);
          break;
        }
      }
      // If the column is not found, the assertion/test fails.
      expect(match_column).toBeGreaterThan(0);
    });
  });
});


