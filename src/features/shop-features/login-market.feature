Feature: Авторизация в магазине через логин/пароль

    Scenario: Авторизация в магазине
    Given Я нахожусь на странице "home"
    Then Я заполняю поле "email shop input" значением "test-email@mail.ru"
    And Я заполняю поле "password shop input" значением "BETejEmm321"
    Then Я нажимаю кнопку "market signin"
    Given Я перенаправляюсь на страницу "buy products"
    When Элемент "notification login success" должен содержать текст "login successful"
    And Элемент "user balance" должен отображаться