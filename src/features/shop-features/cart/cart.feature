Feature: Отображение и взаимодействие с корзиной

    Scenario: Я как пользователь проверяю пустую корзину и добавляю в неё несколько товаров
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    Then "2ый" элемент "product container" должен отображаться
    Then "3ый" элемент "product container" должен отображаться
    When Я нажимаю кнопку "cart"
    Then Элемент "modal cart" должен отображаться
    And Текст элемента "state cart" должен быть равен тексту "Нет добавленных товаров"
    And Текст элемента "total price" должен быть равен тексту "Total Cost: ₽ 0"
    When Я нажимаю кнопку "close modal cart"
    Then Элемент "modal cart" не должен отображаться
    And Я нажимаю на "1ую" кнопку "add to cart"
    And Я нажимаю на "2ую" кнопку "add to cart"
    And Я нажимаю на "3ую" кнопку "add to cart"
    Then "1ый" элемент "notification success" должен отображаться
    Then "2ый" элемент "notification success" должен отображаться
    Then "3ый" элемент "notification success" должен отображаться
    And "1ый" элемент "notification success" должен содержать текст "Товар добавлен в корзину"
    And "2ый" элемент "notification success" должен содержать текст "Товар добавлен в корзину"
    And "3ый" элемент "notification success" должен содержать текст "Товар добавлен в корзину"
    When Я нажимаю кнопку "cart"
    Then Только "3" элемента "item cart" должны отображаться на странице
    And Текст элемента "total price" не должен быть равен тексту "Total Cost: ₽ 0"

    Scenario: Я как пользователь хочу добавить и удалить товары из корзины
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    Then "2ый" элемент "product container" должен отображаться
    Then "3ый" элемент "product container" должен отображаться
    And Я нажимаю на "1ую" кнопку "add to cart"
    And Я нажимаю на "2ую" кнопку "add to cart"
    And Я нажимаю на "3ую" кнопку "add to cart"
    When Я нажимаю кнопку "cart"
    Then Только "3" элемента "item cart" должны отображаться на странице
    And Я нажимаю кнопку "delete product"
    And Я нажимаю кнопку "delete product"
    And Я нажимаю кнопку "delete product"
    And Текст элемента "state cart" должен быть равен тексту "Нет добавленных товаров"
    And Текст элемента "total price" должен быть равен тексту "Total Cost: ₽ 0"