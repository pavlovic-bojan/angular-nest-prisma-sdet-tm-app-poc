Feature: App health

  Scenario: Root endpoint returns Hello World
    When I send a GET request to "/"
    Then the response status is 200
    And the response body equals "Hello World!"
