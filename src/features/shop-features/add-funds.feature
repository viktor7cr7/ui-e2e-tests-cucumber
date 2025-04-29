Feature: Я как пользователь хочу проверить отображение сайта и пополнить баланс на 100 долларов

    Scenario: Я как пользователь хочу проверить отображение сайта
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

    Scenario: Я как пользователь хочу пополнить баланс на 100 долларов
    Given Авторизация через куки
    Given Я нахожусь на странице "add funds"
    When Я нажимаю кнопку "cart"
    Then Я заполняю поле "amount input" значением "100"
    And Текст элемента "total amount" должен быть равен тексту "$ 100.00"
    And Я сохраняю цену элемента "total amount" и сохраняю его как "totalAmountUSD" в глобальное хранилище
    And Я нажимаю кнопку "go to payment"
    When Я перенаправляюсь на страницу "stripe"
    And Цена элемента "product price usd" должна быть равна цене в глобальном хранилище для значения "totalAmountUSD"
    And Я заполняю поле "email" значением "еуыеtest-email@mail.ru" 
    And Я заполняю поле "card number" значением "4242424242424242" 
    And Я заполняю поле "card expiry" значением "1230" 
    And Я заполняю поле "card cvc" значением "333"
    And Я заполняю поле "billing name" значением "Testoviy User"
    When Я нажимаю кнопку "submit button"
    Then Я перенаправляюсь на страницу "transaction"
    And "последний" элемент "row amount" в таблице "transaction table" должен быть равен значению "8,790 RUB"