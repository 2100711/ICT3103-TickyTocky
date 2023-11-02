from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize the WebDriver (e.g., ChromeDriver)
driver = webdriver.Chrome()

# Navigate to your application's registration page
driver.get("http://localhost:3000/register")

# Wait for the email input to be visible
WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "email")))

# Find elements
email_input = driver.find_element(By.ID, "email")
password_input = driver.find_element(By.ID, "password")
confirm_password_input = driver.find_element(By.ID, "cfmPassword")
first_name_input = driver.find_element(By.ID, "f_name")
last_name_input = driver.find_element(By.ID, "l_name")
register_button = driver.find_element(By.XPATH, "//button[@type='submit']")

# Fill out the registration form
email_input.send_keys("sleepy@gmail.com")
password_input.send_keys("Password@12345")
confirm_password_input.send_keys("Password@12345")
first_name_input.send_keys("sleepy")
last_name_input.send_keys("head")

# Click the "Register" button
register_button.click()

# Wait for some confirmation that registration was successful
# This is just an example, you'll need to modify this according to your app's behavior post-registration
WebDriverWait(driver, 10).until(EC.url_contains("/login"))

# Check if the registration was successful
assert "/login" in driver.current_url

# Close the WebDriver
driver.quit()
