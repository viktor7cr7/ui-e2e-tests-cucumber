Feature: Пополнение баланса

    Scenario: Я как пользователь хочу пополнить баланс на 100 долларов через Stripe
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