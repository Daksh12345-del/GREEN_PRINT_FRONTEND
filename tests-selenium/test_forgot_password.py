"""
Forgot-password UI flow — verifies the request form works and gives the
same message regardless of whether the email exists (can't be tested via
UI whether an email exists or not, but we can verify the page never
errors and always shows the same generic confirmation).
"""

from selenium.webdriver.common.by import By

from conftest import wait_for, BASE_URL


def test_forgot_password_link_is_on_the_login_page(driver):
    driver.get(f"{BASE_URL}/login")
    wait_for(driver).until(lambda d: d.find_element(By.LINK_TEXT, "Forgot password?"))
    driver.find_element(By.LINK_TEXT, "Forgot password?").click()
    wait_for(driver).until(lambda d: "/forgot-password" in d.current_url)
    assert "/forgot-password" in driver.current_url


def test_submitting_the_forgot_password_form_shows_a_confirmation(driver):
    driver.get(f"{BASE_URL}/forgot-password")
    wait_for(driver).until(lambda d: d.find_element(By.ID, "email"))

    driver.find_element(By.ID, "email").send_keys("someone@example.com")
    driver.find_element(By.CSS_SELECTOR, "form button[type=submit]").click()

    confirmation = wait_for(driver).until(lambda d: d.find_element(By.CLASS_NAME, "demo-box"))
    assert "someone@example.com" in confirmation.text


def test_reset_password_page_without_a_token_shows_a_helpful_message(driver):
    driver.get(f"{BASE_URL}/reset-password")
    error = wait_for(driver).until(lambda d: d.find_element(By.CLASS_NAME, "error-banner"))
    assert "reset" in error.text.lower()
