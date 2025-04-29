Feature: Я как пользователь хочу посмотреть детали заказа и поставь рейтинг

    Scenario: Я как пользователь хочу посмотреть детали одиночного заказа
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    And Я сохраняю цену "1го" элемента "product price" и сохраняю его как "productPriceForOne" в глобальное хранилище
    Then Я нажимаю на "1ую" кнопку "buy product"
    Then "1ый" элемент "modal buy product" должен отображаться
    And Я заполняю поле "modal buy quantity" значением "5"
    And Я извлекаю "значение" у "1го" элемента "modal buy quantity" и сохраняю его как "productQuantity" в глобальное хранилище
    And Я сохраняю цену "1го" элемента "product price modal buy" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я извлекаю "текст" у "1го" элемента "product name modal buy" и сохраняю его как "productName" в глобальное хранилище
    And Я выбираю значение "Balance" из селекта "select payment method"
    When Я нажимаю кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "orders"
    And Я нажимаю на "последнюю" ссылку "details order"
    When Я перенаправляюсь на страницу "orders details"
    And Текст элемента "name product" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата элемента "create order" должна быть равна сегодняшней дате
    And Количество элемента "quantity" должно быть равно количеству в глобальном хранилище для значения "productQuantity"
    And Цена элемента "price for one" должна быть равна цене в глобальном хранилище для значения "productPriceForOne"
    And Элемент "rating" должен отображаться

    Scenario: Я как пользователь хочу посмотреть детали мульти-заказа
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    And Я нажимаю на "1ую" кнопку "add to cart"
    And Я нажимаю на "2ую" кнопку "add to cart"
    And Я нажимаю на "3ую" кнопку "add to cart"
    When Я нажимаю кнопку "cart"
    And Я сохраняю цену элемента "total price" и сохраняю его как "totalPriceCart" в глобальное хранилище
    And Я выбираю значение "Balance" из селекта "payment method cart"
    When Я нажимаю кнопку "buy product cart"
    Then Я перенаправляюсь на страницу "orders"
    And Я нажимаю на "последнюю" ссылку "details order"
    When Я перенаправляюсь на страницу "orders details"
    And Цена элемента "total price order" должна быть равна цене в глобальном хранилище для значения "totalPriceCart"
    And Только "3" элемента "order item" должны отображаться на странице