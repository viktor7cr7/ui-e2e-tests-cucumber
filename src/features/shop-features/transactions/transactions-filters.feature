Feature: Фильтрация транзакций

    Scenario: Сортировка по возрастанию значения идентификатора
    Given Авторизация через куки
    Given Я нахожусь на странице "transaction"
    Then Я нажимаю кнопку "sort id"
    And Элементы "number" "row id" отсортированы по возрастанию

    Scenario: Сортировка по убыванию значения идентификатора
    Given Авторизация через куки
    Given Я нахожусь на странице "transaction"
    Then Я нажимаю кнопку "sort id"
    Then Я нажимаю кнопку "sort id"
    And Элементы "number" "row id" отсортированы по убыванию

    Scenario: Сортировка по возрастанию суммы
    Given Авторизация через куки
    Given Я нахожусь на странице "transaction"
    Then Я нажимаю кнопку "sort amount"
    And Элементы "number" "row amount" отсортированы по возрастанию

    Scenario: Сортировка по убыванию суммы
    Given Авторизация через куки
    Given Я нахожусь на странице "transaction"
    Then Я нажимаю кнопку "sort amount"
    Then Я нажимаю кнопку "sort amount"
    And Элементы "number" "row amount" отсортированы по убыванию

    Scenario: Сортировка по возрастанию статуса (paid=>unpaid)
    Given Авторизация через куки
    Given Я нахожусь на странице "transaction"
    Then Я нажимаю кнопку "sort status"
    And Элементы "string" "row status" отсортированы по возрастанию

    Scenario: Сортировка по убыванию статуса (unpaid=>paid)
    Given Авторизация через куки
    Given Я нахожусь на странице "transaction"
    Then Я нажимаю кнопку "sort status"
    Then Я нажимаю кнопку "sort status"
    And Элементы "string" "row status" отсортированы по убыванию

    Scenario: Сортировка по возрастанию даты создания транзакции
    Given Авторизация через куки
    Given Я нахожусь на странице "transaction"
    Then Я нажимаю кнопку "row created"
    And Элементы "sort createdAt" отсортированы по возрастанию даты

    Scenario: Сортировка по убыванию даты создания транзакции
    Given Авторизация через куки
    Given Я нахожусь на странице "transaction"
    Then Я нажимаю кнопку "row created"
    Then Я нажимаю кнопку "row created"
    And Элементы "sort createdAt" отсортированы по убыванию даты