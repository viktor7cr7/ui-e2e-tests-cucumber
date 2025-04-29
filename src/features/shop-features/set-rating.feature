Feature: Я как пользователь хочу оценить товар


@dev
Scenario: Я как пользователь хочу поставить оценку 3
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    Then Я нажимаю на "1ую" кнопку "buy product"
    And Я выбираю значение "Balance" из селекта "select payment method"
    When Я нажимаю кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "orders"
    And Я нажимаю на "последнюю" ссылку "details order"
    When Я перенаправляюсь на страницу "orders details"
    And Я нажимаю на "3ю" кнопку "grey rating"
    And Элемент "notification success" должен содержать текст "Спасибо за отзыв!"
    And На странице должны быть только "3" элемента со значением селектора "gold rating"