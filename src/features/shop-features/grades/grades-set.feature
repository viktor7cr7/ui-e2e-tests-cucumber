Feature: Изменение уровня грейда и получение скидки

    Scenario: Я как пользователь хочу приобрести товар и получить скидку 5% на товары
    Given Cумма покупок пользователя "31" обнулена
    Given Авторизация через куки
    Given Я нахожусь на странице "profile"
    And Значение атрибута "percentage" в элементе "grades indicator" должно быть равно тексту "0"
    And Текст элемента "current amount" должен быть равен тексту "0 руб"
    And Текст элемента "current level" должен быть равен тексту "Новичок"
    And Текст элемента "to next level" должен быть равен тексту "1 руб"
    And Текст элемента "current discount" должен быть равен тексту "0%"
    And Я нажимаю ссылку "buy products"
    When Я перенаправляюсь на страницу "buy products"
    Then Я нажимаю на "1ую" кнопку "buy product"
    And Я сохраняю цену "1го" элемента "product price modal buy" и сохраняю его как "productPrice" в глобальное хранилище
    And Я выбираю значение "Balance" из селекта "select payment method"
    When Я нажимаю кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "orders"
    And Я нажимаю ссылку "profile"
    And Значение атрибута "percentage" в элементе "grades indicator" должно быть равно тексту "7"
    And Цена элемента "current amount" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Текст элемента "current level" должен быть равен тексту "Любитель"
    And Текст элемента "to next level" должен быть равен тексту "21500 руб"
    And Текст элемента "current discount" должен быть равен тексту "5%"
    And Я нажимаю ссылку "buy products"
    When Я перенаправляюсь на страницу "buy products"
    And Цена "1го" элемента "product price" должна быть рассчитана с учетом сохраненной цены "productPrice" в глобальном хранилище к скидке "5%"


    Scenario: Я как пользователь хочу приобрести товар и получить скидку 15% на товары
    Given Cумма покупок пользователя "31" обнулена
    Given Авторизация через куки
    Given Я нахожусь на странице "profile"
    And Значение атрибута "percentage" в элементе "grades indicator" должно быть равно тексту "0"
    And Текст элемента "current amount" должен быть равен тексту "0 руб"
    And Текст элемента "current level" должен быть равен тексту "Новичок"
    And Текст элемента "to next level" должен быть равен тексту "1 руб"
    And Текст элемента "current discount" должен быть равен тексту "0%"
    And Я нажимаю ссылку "buy products"
    When Я перенаправляюсь на страницу "buy products"
    And Я сохраняю цену "10го" элемента "product price" и сохраняю его как "productPriceForOne" в глобальное хранилище
    Then Я нажимаю на "10ую" кнопку "buy product"
    And Я заполняю "10ое" поле "modal buy quantity" значением "3"
    And Я сохраняю цену "10го" элемента "product price modal buy" и сохраняю его как "productPrice" в глобальное хранилище
    And Я выбираю значение "Balance" из 10го селекта "select payment method"
    When Я нажимаю на "10ую" кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "orders"
    And Я нажимаю ссылку "profile"
    And Значение атрибута "percentage" в элементе "grades indicator" должно быть равно тексту "72"
    And Цена элемента "current amount" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Текст элемента "current level" должен быть равен тексту "Профессионал"
    And Текст элемента "to next level" должен быть равен тексту "14000 руб"
    And Текст элемента "current discount" должен быть равен тексту "15%"
    And Я нажимаю ссылку "buy products"
    When Я перенаправляюсь на страницу "buy products"
    And Цена "10го" элемента "product price" должна быть рассчитана с учетом сохраненной цены "productPriceForOne" в глобальном хранилище к скидке "15%"

    Scenario: Я как пользователь хочу приобрести товар и получить скидку 25% на товары
    Given Cумма покупок пользователя "31" обнулена
    Given Авторизация через куки
    Given Я нахожусь на странице "profile"
    And Значение атрибута "percentage" в элементе "grades indicator" должно быть равно тексту "0"
    And Текст элемента "current amount" должен быть равен тексту "0 руб"
    And Текст элемента "current level" должен быть равен тексту "Новичок"
    And Текст элемента "to next level" должен быть равен тексту "1 руб"
    And Текст элемента "current discount" должен быть равен тексту "0%"
    And Я нажимаю ссылку "buy products"
    When Я перенаправляюсь на страницу "buy products"
    Then Я нажимаю на "2ую" кнопку "buy product"
    And Я сохраняю цену "2го" элемента "product price modal buy" и сохраняю его как "productPrice" в глобальное хранилище
    And Я выбираю значение "Balance" из 2го селекта "select payment method"
    When Я нажимаю на "2ую" кнопку "product modal buy"
    Then Я перенаправляюсь на страницу "orders"
    And Я нажимаю ссылку "profile"
    And Значение атрибута "percentage" в элементе "grades indicator" должно быть равно тексту "320"
    And Цена элемента "current amount" должна быть равна цене в глобальном хранилище для значения "productPrice"
    And Текст элемента "current level" должен быть равен тексту "Лидер"
    And Текст элемента "to next level" должен быть равен тексту "Максимальный уровень"
    And Текст элемента "current discount" должен быть равен тексту "25%"
    And Я нажимаю ссылку "buy products"
    When Я перенаправляюсь на страницу "buy products"
    And Цена "2го" элемента "product price" должна быть рассчитана с учетом сохраненной цены "productPrice" в глобальном хранилище к скидке "25%"