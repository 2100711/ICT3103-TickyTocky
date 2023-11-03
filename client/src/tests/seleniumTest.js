const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async () => {
  // Set up Chrome options
  const options = new chrome.Options();
  options.addArguments("--headless");

  // Initialize the WebDriver
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Navigate to your React application's login page
    await driver.get("https://gracious-kare.cloud/login");

    // Wait for the email input to be visible
    await driver.wait(until.elementLocated(By.id("login-form_email")), 10000);

    // Find elements
    const emailInput = await driver.findElement(By.id("login-form_email"));
    const passwordInput = await driver.findElement(
      By.id("login-form_password")
    );
    const loginButton = await driver.findElement(By.className("login-button"));

    // Fill out the login form
    await emailInput.sendKeys("joashlwj@gmail.com");
    await passwordInput.sendKeys("Password@12345");
    await loginButton.click();

    // Wait for navigation to the account page
    await driver.wait(until.urlContains("/account"), 10000);

    // Check if the login was successful
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes("/account")) {
      throw new Error("Login was not successful");
    }
  } finally {
    // Close the WebDriver
    await driver.quit();
  }
})();
