const { chromium } = require("playwright");

const LINK =
  "https://truckx-feedback.netlify.app/?agent=pranav.sharma@truckx.com";

const TOTAL_TESTS = 500;

const ratings = [1, 8, 5, 8, 10, 3, 7, 9, 2, 6];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const browser = await chromium.launch({
    headless: false
  });

  let success = 0;
  let failed = 0;

  for (let i = 0; i < TOTAL_TESTS; i++) {
    const page = await browser.newPage();

    try {
      console.log(`Testing ${i + 1}/${TOTAL_TESTS}`);

      await page.goto(LINK, {
        waitUntil: "domcontentloaded",
        timeout: 60000
      });

      await delay(3000);

      const rating = ratings[i % ratings.length];

      await page.getByRole("button", {
        name: String(rating),
        exact: true
      }).click();

      await page.fill(
        "#comment",
        `BOT TEST ${i + 1} - Rating ${rating}`
      );

      await page.click(".submit");

      await page.waitForSelector("text=Thank You!", {
        timeout: 30000
      });

      success++;

      console.log(`✅ Submitted BOT TEST ${i + 1}`);
    } catch (error) {
      failed++;

      console.log(`❌ Failed BOT TEST ${i + 1}`);
      console.log(error.message);
    }

    await page.close();

    await delay(3000);
  }

  await browser.close();

  console.log("========== FINAL RESULT ==========");
  console.log(`Total Tests: ${TOTAL_TESTS}`);
  console.log(`Successful: ${success}`);
  console.log(`Failed: ${failed}`);
}

run();