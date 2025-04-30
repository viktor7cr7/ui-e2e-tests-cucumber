Feature: Авторизация в магазине через логин/пароль

    @dev
    Scenario: Успешная авторизация в магазине
    Given Я нахожусь на странице "home"
    Then Я заполняю поле "email shop input" значением "$.EMAIL_SHOP_LOGIN"
    And Я заполняю поле "password shop input" значением "$.SHOP_PASSWORD"
    Then Я нажимаю кнопку "market signin"
    Given Я перенаправляюсь на страницу "buy products"
    When Элемент "notification login success" должен содержать текст "login successful"
    And Элемент "user balance" должен отображаться