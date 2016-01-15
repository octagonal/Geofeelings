Feature: Login
  Background:
    I visit register
  Scenario: Entering Information
    When I click submit
    Then I should see the loading screen
