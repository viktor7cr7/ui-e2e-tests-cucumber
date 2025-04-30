Feature: Отправка письма для восстановления пароля

    Scenario: Я как пользователь хочу отправить письмо для сброса пароля
    Given Я нахожусь на странице "home"
    Then Я нажимаю кнопку "market forgot password"
    Given Я перенаправляюсь на страницу "user forgot password"
    Then Элемент "header forgot password" должен отображаться
    And Я заполняю поле "email" значением "test-email@mail.ru"
    And Я нажимаю кнопку "submit forgot password"
    Then Элемент "notification forgot success" должен отображаться
    And Элемент "notification forgot success" должен содержать текст "Пожалуйста проверьте свою почту для сброса пароля"