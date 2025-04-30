Feature: Отображение страницы Add Funds

    Scenario: Я как пользователь хочу проверить отображение страницы Add Funds
    Given Авторизация через куки
    Given Я нахожусь на странице "add funds"
    Then Элемент "header" должен отображаться
    And Элемент "add funds content" должен отображаться
    And Элемент "section payment" не должен отображаться
    When Я нажимаю кнопку "cart"
    Then Элемент "add funds content" не должен отображаться
    And Элемент "button back" должен отображаться
    And Элемент "section payment" должен отображаться
    And Элемент "current method payment" должен отображаться
    And Элемент "amount input" должен отображаться
    And Элемент "total amount" должен отображаться