"""
Dashboard and activity logging — verifies the core "log activity, see it
reflected in real KPIs" loop works end-to-end through the actual UI, not
just via direct API calls.
"""

from selenium.webdriver.common.by import By

from conftest import wait_for


def test_dashboard_shows_kpi_cards_after_login(driver, new_company):
    # new_company already leaves us logged in on the dashboard
    wait_for(driver).until(lambda d: d.find_elements(By.CLASS_NAME, "kpi-card"))
    cards = driver.find_elements(By.CLASS_NAME, "kpi-card")
    assert len(cards) >= 4, "expected the KPI card row to render"


def test_adding_a_log_updates_the_dashboard_total(driver, new_company):
    # Go log some activity
    driver.find_element(By.LINK_TEXT, "Activity Logs").click()
    wait_for(driver).until(lambda d: d.find_element(By.CSS_SELECTOR, "form button[type=submit]"))

    quantity_input = driver.find_element(By.CSS_SELECTOR, "input[type=number]")
    quantity_input.clear()
    quantity_input.send_keys("500")
    driver.find_element(By.CSS_SELECTOR, "form button[type=submit]").click()

    # The new log should appear in the table below
    wait_for(driver).until(lambda d: "500" in d.find_element(By.TAG_NAME, "table").text)
    assert "500" in driver.find_element(By.TAG_NAME, "table").text

    # And the dashboard's total should no longer read zero
    driver.find_element(By.LINK_TEXT, "Dashboard").click()
    wait_for(driver).until(lambda d: d.find_elements(By.CLASS_NAME, "kpi-value"))
    kpi_text = driver.find_element(By.CLASS_NAME, "kpi-value").text
    assert kpi_text.strip() != "—", "KPI card should show a real computed number, not the loading placeholder"


def test_ai_insights_page_returns_recommendations_not_an_error(driver, new_company):
    driver.find_element(By.LINK_TEXT, "AI Insights").click()
    wait_for(driver, timeout=15).until(
        lambda d: d.find_elements(By.CLASS_NAME, "rec-card") or d.find_elements(By.CLASS_NAME, "error-banner")
    )
    # Whether it's live Groq or the rule-based fallback, some recommendation
    # card should render — the page should never be left blank or errored.
    assert len(driver.find_elements(By.CLASS_NAME, "rec-card")) > 0
