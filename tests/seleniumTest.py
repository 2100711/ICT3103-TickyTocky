from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize the WebDriver (e.g., ChromeDriver)
driver = webdriver.Chrome()

# Navigate to your React application's login page
driver.get("http://localhost:3000/login")

# Wait for the email input to be visible
WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "login-form_email")))

# Find elements
email_input = driver.find_element(By.ID, "login-form_email")
password_input = driver.find_element(By.ID, "login-form_password")
login_button = driver.find_element(By.CLASS_NAME, "login-button")

# Fill out the login form
email_input.send_keys("joashlwj@gmail.com")
password_input.send_keys("Password@12345")
login_button.click()

# Wait for navigation to the account page
WebDriverWait(driver, 10).until(EC.url_contains("/account"))

# Check if the login was successful
assert "/account" in driver.current_url

# Close the WebDriver
driver.quit()
