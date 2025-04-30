Feature: Фильтрация товаров

    Scenario: Фильтрация по поиску
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я заполняю поле "search product" значением "смарт"
    Then Только "2" элемента "product container" должны отображаться на странице
    And "2" элемента "product container" должны содержать текст "смарт"

    Scenario: Фильтрация по категории
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я выбираю значение "Одежда" из селекта "category product"
    Then Только "2" элемента "product container" должны отображаться на странице

    Scenario: Фильтрация по убыванию цены
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я выбираю значение "desc" из селекта "sort product price"
    Then Элемент "sort" должен быть равен значению "price:desc,rating:"
    And Элементы "number" "product price" отсортированы по убыванию

    Scenario: Фильтрация по возрастанию цены
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я выбираю значение "asc" из селекта "sort product price"
    Then Элемент "sort" должен быть равен значению "price:asc,rating:"
    Then Элементы "number" "product price" отсортированы по возрастанию

    Scenario: Фильтрация по убыванию рейтинга
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я выбираю значение "desc" из селекта "sort product rating"
    Then Элемент "sort" должен быть равен значению "price:,rating:desc"

    Scenario: Фильтрация по убыванию рейтинга
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я выбираю значение "asc" из селекта "sort product rating"
    Then Элемент "sort" должен быть равен значению "price:,rating:asc"

    Scenario: Фильтрация по диапазону цены
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я нажимаю кнопку "btn price range"
    And Элемент "price track" должен отображаться
    And Элемент "price slider 1" внутри "price track" передвигаю на "20%" вправо
    And Элемент "price slider" внутри "price track" передвигаю на "10%" вправо
    And Я нажимаю кнопку "btn range confirm"
    Then Только "3" элемента "product container" должны отображаться на странице

    Scenario: Сброс фильтрации
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я заполняю поле "search product" значением "смарт"
    And Я ожидаю "1" секунд
    Then Я выбираю значение "desc" из селекта "sort product price"
    Then Я выбираю значение "asc" из селекта "sort product rating"   
    And Я нажимаю кнопку "reset filters"
    Then Текст атрибута "action" в элементе "filters form" должен быть равен тексту "/dashboard/user/all-products?index"