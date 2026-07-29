"""
Shared pytest fixtures for the Green Print Selenium suite.

BASE_URL points at a running build of the frontend (see README.md in this
folder for how to serve it locally, and .github/workflows/e2e.yml for how
CI builds + serves it against a real backend + real Postgres).

These tests drive an actual browser against the actual app — no mocked
API responses, no stubbed components. If the backend or database isn't
reachable, these tests fail exactly like a real user's browser would.
"""

import os
import time
import uuid

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5000")
DEFAULT_TIMEOUT = int(os.environ.get("SELENIUM_TIMEOUT", "10"))


@pytest.fixture
def driver():
    """A fresh headless Chrome window for each test."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1440,900")

    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(2)
    yield drv
    drv.quit()


@pytest.fixture
def mobile_driver():
    """A headless Chrome window sized like a phone, for responsive tests."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=390,844")  # iPhone-ish viewport

    drv = webdriver.Chrome(options=options)
    drv.implicitly_wait(2)
    yield drv
    drv.quit()


def wait_for(driver, timeout=DEFAULT_TIMEOUT):
    return WebDriverWait(driver, timeout)


def _register_new_company_via_ui(driver):
    """
    Registers a brand-new company through the real UI (not an API
    shortcut) and returns its credentials, so tests that need to be
    logged in don't depend on any particular seeded demo data existing.
    Works with any driver (desktop or mobile-sized).
    """
    unique = uuid.uuid4().hex[:8]
    email = f"selenium.{unique}@test.io"
    password = "password123"

    driver.get(f"{BASE_URL}/register")
    wait_for(driver).until(lambda d: d.find_element("id", "companyName"))

    driver.find_element("id", "companyName").send_keys(f"Selenium Test Co {unique}")
    driver.find_element("id", "adminName").send_keys("Selenium Tester")
    driver.find_element("id", "adminEmail").send_keys(email)
    driver.find_element("id", "adminPassword").send_keys(password)
    driver.find_element("css selector", "form button[type=submit]").click()

    # Successful registration redirects to the dashboard.
    wait_for(driver).until(lambda d: "/login" not in d.current_url and "/register" not in d.current_url)

    return {"email": email, "password": password}


@pytest.fixture
def new_company(driver):
    return _register_new_company_via_ui(driver)


@pytest.fixture
def new_company_mobile(mobile_driver):
    """Same as new_company, but registers using the mobile-sized driver."""
    return _register_new_company_via_ui(mobile_driver)
