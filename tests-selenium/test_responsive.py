"""
Responsive layout tests — directly verifies the mobile hamburger-menu
behavior added to Layout.jsx / index.css: the sidebar is hidden by
default on narrow screens, opens via the hamburger button, and closes
via the backdrop tap or picking a nav link.
"""

from selenium.webdriver.common.by import By

from conftest import wait_for


def test_desktop_shows_the_sidebar_without_needing_a_hamburger(driver, new_company):
    # `driver` fixture is a desktop-sized window (1440x900)
    rail = driver.find_element(By.CLASS_NAME, "rail")
    assert rail.is_displayed()

    toggles = driver.find_elements(By.CLASS_NAME, "rail-toggle")
    # The hamburger button exists in the DOM (CSS shows/hides it by
    # breakpoint) but must not be visible at desktop width.
    assert len(toggles) == 0 or not toggles[0].is_displayed()


def test_mobile_hides_the_sidebar_by_default_and_shows_a_hamburger(mobile_driver, new_company_mobile):
    rail = mobile_driver.find_element(By.CLASS_NAME, "rail")
    toggle = mobile_driver.find_element(By.CLASS_NAME, "rail-toggle")

    assert toggle.is_displayed(), "hamburger button should be visible on a phone-sized screen"
    assert not rail.is_displayed(), "sidebar should be off-screen by default on mobile"


def test_mobile_hamburger_opens_the_sidebar_drawer(mobile_driver, new_company_mobile):
    mobile_driver.find_element(By.CLASS_NAME, "rail-toggle").click()

    rail = wait_for(mobile_driver).until(lambda d: d.find_element(By.CSS_SELECTOR, ".rail.open"))
    assert rail.is_displayed(), "sidebar should slide into view after tapping the hamburger"

    backdrop = mobile_driver.find_element(By.CLASS_NAME, "rail-backdrop")
    assert backdrop.is_displayed(), "a backdrop should appear behind the open drawer"


def test_mobile_backdrop_tap_closes_the_sidebar_drawer(mobile_driver, new_company_mobile):
    mobile_driver.find_element(By.CLASS_NAME, "rail-toggle").click()
    wait_for(mobile_driver).until(lambda d: d.find_element(By.CSS_SELECTOR, ".rail.open"))

    mobile_driver.find_element(By.CLASS_NAME, "rail-backdrop").click()

    wait_for(mobile_driver).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".rail.open")) == 0)
    assert len(mobile_driver.find_elements(By.CSS_SELECTOR, ".rail.open")) == 0


def test_mobile_picking_a_nav_link_closes_the_drawer(mobile_driver, new_company_mobile):
    mobile_driver.find_element(By.CLASS_NAME, "rail-toggle").click()
    wait_for(mobile_driver).until(lambda d: d.find_element(By.CSS_SELECTOR, ".rail.open"))

    mobile_driver.find_element(By.LINK_TEXT, "Activity Logs").click()

    wait_for(mobile_driver).until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".rail.open")) == 0)
    assert "/logs" in mobile_driver.current_url
