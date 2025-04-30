Feature: Регистрация пользователя

    Scenario: Регистрация пользователя используя моки
    Given Я нахожусь на странице "home"
    Then Я нажимаю кнопку "market register"
    Given Я перенаправляюсь на страницу "user register"
    Then Элемент "user register header" должен отображаться
    When Я заполняю поле "name" значением "market" 
    And Я заполняю поле "email" значением "market-register@mail.ru"
    And Я заполняю поле "password" значением "market-register@mail.ru"
    Given Эндпоинт "user register" для "localhost" мокируется с помощью "user register"
    And Я нажимаю кнопку "button register"
    Given Я перенаправляюсь на страницу "user login"
    Then Элемент "notification register success" должен содержать текст "Registartion successful"
    And Элемент "user login header" должен отображаться