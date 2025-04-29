Feature: Я как пользователь хочу приобрести один или несколько товаров через модальное окно покупки или через корзину


Scenario: Я как пользователь хочу приобрести один товар через модальное окно покупки, используя баланс
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    And Я извлекаю "текст" у "1го" элемента "product name" и сохраняю его как "productName" в глобальное хранилище
    And Я сохраняю цену элемента "user balance" и сохраняю его как "userBalance" в глобальное хранилище
    And Я сохраняю цену "1го" элемента "product price" и сохраняю его как "productPrice" в глобальное хранилище
    Then Я нажимаю на "1ую" кнопку "buy product"
    Then "1ый" элемент "modal buy product" должен отображаться
    And Текст "1го" элемента "product name modal buy" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена "1го" элемента "product price modal buy" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Я сохраняю цену "1го" элемента "product price modal buy" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я выбираю значение "Balance" из селекта "select payment method"
    When Я нажимаю кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "orders"
    And Я сохраняю цену элемента "user balance" и сохраняю его как "newUserBalance" в глобальное хранилище
    Then Баланс пользователя "user balance" уменьшился на цену "productTotalPrice" в глобальном хранилище для значения "userBalance"
    And Цена "последнего" элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата "последнего" элемента "create order" должна быть равна сегодняшней дате
    And "последний" элемент "status order" должен содержать текст "paid"


Scenario: Я как пользователь хочу приобрести один товар через модальное окно покупки, используя платежную карту
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    Then Я нажимаю на "1ую" кнопку "buy product"
    Then "1ый" элемент "modal buy product" должен отображаться
    And Я извлекаю "текст" у "1го" элемента "product name modal buy" и сохраняю его как "productNameModalBuy" в глобальное хранилище
    And Я сохраняю цену "1го" элемента "product price modal buy" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я выбираю значение "Credit Card" из селекта "select payment method"
    When Я нажимаю кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "stripe"
    And Текст элемента "name product" должен быть равен тексту в глобальном хранилище для значения "productNameModalBuy"
    And Цена элемента в "usd" элемента "product price usd" должна быть равна цене в глобальном хранилище "productTotalPrice"  
    And Я заполняю поле "email" значением "еуыеtest-email@mail.ru" 
    And Я заполняю поле "card number" значением "4242424242424242" 
    And Я заполняю поле "card expiry" значением "1230" 
    And Я заполняю поле "card cvc" значением "333"
    And Я заполняю поле "billing name" значением "Testoviy User"
    When Я нажимаю кнопку "submit button"
    Then Я перенаправляюсь на страницу "orders"
    And Цена "последнего" элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата "последнего" элемента "create order" должна быть равна сегодняшней дате
    And "последний" элемент "status order" должен содержать текст "unpaid"

Scenario: Я как пользователь хочу приобрести несколько товаров через модальное окно покупки, используя баланс
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    And Я извлекаю "текст" у "1го" элемента "product name" и сохраняю его как "productName" в глобальное хранилище
    And Я сохраняю цену элемента "user balance" и сохраняю его как "userBalance" в глобальное хранилище
    And Я сохраняю цену "1го" элемента "product price" и сохраняю его как "productPrice" в глобальное хранилище
    Then Я нажимаю на "1ую" кнопку "buy product"
    Then "1ый" элемент "modal buy product" должен отображаться
    And Текст "1го" элемента "product name modal buy" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена "1го" элемента "product price modal buy" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Я заполняю поле "modal buy quantity" значением "3" 
    And Я сохраняю цену "1го" элемента "product price modal buy" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я выбираю значение "Balance" из селекта "select payment method"
    When Я нажимаю кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "orders"
    And Я сохраняю цену элемента "user balance" и сохраняю его как "newUserBalance" в глобальное хранилище
    Then Баланс пользователя "user balance" уменьшился на цену "productTotalPrice" в глобальном хранилище для значения "userBalance"
    And Цена "последнего" элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата "последнего" элемента "create order" должна быть равна сегодняшней дате
    And "последний" элемент "status order" должен содержать текст "paid"


Scenario: Я как пользователь хочу приобрести несколько товаров через модальное окно покупки, используя платежную карту
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    Then Я нажимаю на "1ую" кнопку "buy product"
    Then "1ый" элемент "modal buy product" должен отображаться
    And Я извлекаю "текст" у "1го" элемента "product name modal buy" и сохраняю его как "productNameModalBuy" в глобальное хранилище
    And Я заполняю поле "modal buy quantity" значением "10" 
    And Я сохраняю цену "1го" элемента "product price modal buy" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я выбираю значение "Credit Card" из селекта "select payment method"
    When Я нажимаю кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "stripe"
    And Текст элемента "name product" должен быть равен тексту в глобальном хранилище для значения "productNameModalBuy"
    And Цена элемента в "usd" элемента "product price usd" должна быть равна цене в глобальном хранилище "productTotalPrice"  
    And Я заполняю поле "email" значением "еуыеtest-email@mail.ru" 
    And Я заполняю поле "card number" значением "4242424242424242" 
    And Я заполняю поле "card expiry" значением "1230" 
    And Я заполняю поле "card cvc" значением "333"
    And Я заполняю поле "billing name" значением "Testoviy User"
    When Я нажимаю кнопку "submit button"
    Then Я перенаправляюсь на страницу "orders"
    And Цена "последнего" элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата "последнего" элемента "create order" должна быть равна сегодняшней дате
    And "последний" элемент "status order" должен содержать текст "unpaid"

Scenario: Я как пользователь хочу приобрести один товар через корзину, используя баланс
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    And Я извлекаю "текст" у "1го" элемента "product name" и сохраняю его как "productName" в глобальное хранилище
    And Я сохраняю цену элемента "user balance" и сохраняю его как "userBalance" в глобальное хранилище
    And Я сохраняю цену "1го" элемента "product price" и сохраняю его как "productPrice" в глобальное хранилище
    And Я нажимаю на "1ую" кнопку "add to cart"
    When Я нажимаю кнопку "cart"
    Then Элемент "modal cart" должен отображаться
    And Текст элемента "product name cart" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена элемента "price for one" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Я сохраняю цену элемента "total price" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я выбираю значение "Balance" из селекта "payment method cart"
    When Я нажимаю кнопку "buy product cart"
    Then Я перенаправляюсь на страницу "orders"
    And Я сохраняю цену элемента "user balance" и сохраняю его как "newUserBalance" в глобальное хранилище
    Then Баланс пользователя "user balance" уменьшился на цену "productTotalPrice" в глобальном хранилище для значения "userBalance"
    And Цена "последнего" элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата "последнего" элемента "create order" должна быть равна сегодняшней дате
    And "последний" элемент "status order" должен содержать текст "paid"


Scenario: Я как пользователь хочу приобрести один товар через корзину, используя платежную карту
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    And Я извлекаю "текст" у "1го" элемента "product name" и сохраняю его как "productName" в глобальное хранилище
    And Я сохраняю цену элемента "user balance" и сохраняю его как "userBalance" в глобальное хранилище
    And Я сохраняю цену "1го" элемента "product price" и сохраняю его как "productPrice" в глобальное хранилище
    And Я нажимаю на "1ую" кнопку "add to cart"
    When Я нажимаю кнопку "cart"
    Then Элемент "modal cart" должен отображаться
    And Текст элемента "product name cart" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена элемента "price for one" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Я сохраняю цену элемента "total price" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я выбираю значение "Credit Card" из селекта "payment method cart"
    When Я нажимаю кнопку "buy product cart"
    Then Я перенаправляюсь на страницу "stripe"
    And Текст элемента "name product" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена элемента в "usd" элемента "product price usd" должна быть равна цене в глобальном хранилище "productTotalPrice"  
    And Я заполняю поле "email" значением "еуыеtest-email@mail.ru" 
    And Я заполняю поле "card number" значением "4242424242424242" 
    And Я заполняю поле "card expiry" значением "1230" 
    And Я заполняю поле "card cvc" значением "333"
    And Я заполняю поле "billing name" значением "Testoviy User"
    When Я нажимаю кнопку "submit button"
    Then Я перенаправляюсь на страницу "orders"
    And Цена "последнего" элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата "последнего" элемента "create order" должна быть равна сегодняшней дате
    And "последний" элемент "status order" должен содержать текст "unpaid"


Scenario: Я как пользователь хочу приобрести несколько товаров через корзину, используя баланс
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    And Я извлекаю "текст" у "1го" элемента "product name" и сохраняю его как "productName" в глобальное хранилище
    And Я сохраняю цену элемента "user balance" и сохраняю его как "userBalance" в глобальное хранилище
    And Я сохраняю цену "1го" элемента "product price" и сохраняю его как "productPrice" в глобальное хранилище
    And Я нажимаю на "1ую" кнопку "add to cart"
    When Я нажимаю кнопку "cart"
    Then Элемент "modal cart" должен отображаться
    And Текст элемента "product name cart" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена элемента "price for one" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Я нажимаю кнопку "update quantity"
    And Я заполняю поле "input quantity" значением "3"
    When Я нажимаю кнопку "save change quantity"
    Then Элемент "quantity value" должен содержать текст "3"
    And Я сохраняю цену элемента "total price" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я выбираю значение "Balance" из селекта "payment method cart"
    When Я нажимаю кнопку "buy product cart"
    Then Я перенаправляюсь на страницу "orders"
    And Я сохраняю цену элемента "user balance" и сохраняю его как "newUserBalance" в глобальное хранилище
    Then Баланс пользователя "user balance" уменьшился на цену "productTotalPrice" в глобальном хранилище для значения "userBalance"
    And Цена "последнего" элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата "последнего" элемента "create order" должна быть равна сегодняшней дате
    And "последний" элемент "status order" должен содержать текст "paid"

Scenario: Я как пользователь хочу приобрести несколько товаров через корзину, используя платежную карту
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    And Я извлекаю "текст" у "1го" элемента "product name" и сохраняю его как "productName" в глобальное хранилище
    And Я сохраняю цену элемента "user balance" и сохраняю его как "userBalance" в глобальное хранилище
    And Я сохраняю цену "1го" элемента "product price" и сохраняю его как "productPrice" в глобальное хранилище
    And Я нажимаю на "1ую" кнопку "add to cart"
    When Я нажимаю кнопку "cart"
    Then Элемент "modal cart" должен отображаться
    And Текст элемента "product name cart" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена элемента "price for one" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Я нажимаю кнопку "update quantity"
    And Я заполняю поле "input quantity" значением "10"
    When Я нажимаю кнопку "save change quantity"
    Then Элемент "quantity value" должен содержать текст "10"
    And Я сохраняю цену элемента "total price" и сохраняю его как "productTotalPrice" в глобальное хранилище
    And Я выбираю значение "Credit Card" из селекта "payment method cart"
    When Я нажимаю кнопку "buy product cart"
    Then Я перенаправляюсь на страницу "stripe"
    And Текст элемента "name product" должен быть равен тексту в глобальном хранилище для значения "productName"
    And Цена элемента в "usd" элемента "product price usd" должна быть равна цене в глобальном хранилище "productTotalPrice"  
    And Я заполняю поле "email" значением "еуыеtest-email@mail.ru" 
    And Я заполняю поле "card number" значением "4242424242424242" 
    And Я заполняю поле "card expiry" значением "1230" 
    And Я заполняю поле "card cvc" значением "333"
    And Я заполняю поле "billing name" значением "Testoviy User"
    When Я нажимаю кнопку "submit button"
    Then Я перенаправляюсь на страницу "orders"
    And Цена "последнего" элемента "total price order" должна быть равна цене в глобальном хранилище для значения "productTotalPrice"
    And Дата "последнего" элемента "create order" должна быть равна сегодняшней дате
    And "последний" элемент "status order" должен содержать текст "unpaid"