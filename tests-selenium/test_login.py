"""
Login flow — the front door of the whole app. If these fail, nothing
else matters, since every other test depends on being able to log in.
"""

from selenium.webdriver.common.by import By

from conftest import wait_for, BASE_URL


def test_login_page_loads_with_the_expected_form(driver):
    driver.get(f"{BASE_URL}/login")
    wait_for(driver).until(lambda d: d.find_element(By.ID, "email"))

    assert driver.find_element(By.ID, "email").is_displayed()
    assert driver.find_element(By.ID, "password").is_displayed()
    assert "Green Print" in driver.page_source


def test_wrong_password_shows_an_error_not_a_silent_failure(driver):
    driver.get(f"{BASE_URL}/login")
    wait_for(driver).until(lambda d: d.find_element(By.ID, "email"))

    driver.find_element(By.ID, "email").send_keys("nobody@nowhere.io")
    driver.find_element(By.ID, "password").send_keys("definitely-wrong")
    driver.find_element(By.CSS_SELECTOR, "form button[type=submit]").click()

    error = wait_for(driver).until(lambda d: d.find_element(By.CLASS_NAME, "error-banner"))
    assert error.is_displayed()
    # Still on the login page — a failed login must never navigate away.
    assert "/login" in driver.current_url


def test_registering_a_new_company_logs_you_straight_in(driver, new_company):
    # new_company fixture already drove the whole registration form and
    # waited for the redirect — if we're here, it worked. Just confirm
    # we actually landed somewhere logged-in, not stuck on an auth page.
    assert "/login" not in driver.current_url
    assert "/register" not in driver.current_url


def test_signing_out_returns_to_the_login_page(driver, new_company):
    sign_out = wait_for(driver).until(lambda d: d.find_element(By.CLASS_NAME, "rail-logout"))
    sign_out.click()
    wait_for(driver).until(lambda d: "/login" in d.current_url)
    assert "/login" in driver.current_url
