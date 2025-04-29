Feature: Я как пользователь хочу отфильтровать заказы по идентификатору, цене, дате и статусу


    Scenario: Фильтрация по идентификатору
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я нажимаю ссылку "orders"
    And Я перенаправляюсь на страницу "orders"
    And Я сохраняю идентификатор "последнего" элемента "order id" и сохраняю его как "lastOrderId" в глобальное хранилище
    Then Я заполняю поле "search id" значением "lastOrderId" из глобального хранилища
    Then Только "1" элемент "order item" должен отображаться на странице
    And Текст элемента "order id" должен содержать текст из значения "lastOrderId" глобального хранилища


    Scenario: Фильтрация по убыванию цены
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я нажимаю ссылку "orders"
    And Я перенаправляюсь на страницу "orders"
    Then Я выбираю значение "desc" из селекта "sort price"
    Then Элемент "sort price" должен быть равен значению "desc"
    And Элементы "number" "total price order" отсортированы по убыванию


    Scenario: Фильтрация по возрастанию цены
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я нажимаю ссылку "orders"
    And Я перенаправляюсь на страницу "orders"
    Then Я выбираю значение "asc" из селекта "sort price"
    Then Элемент "sort price" должен быть равен значению "asc"
    And Элементы "number" "total price order" отсортированы по возрастанию

    Scenario: Фильтрация по времени создания ордера (по убыванию)
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я нажимаю ссылку "orders"
    And Я перенаправляюсь на страницу "orders"
    Then Я выбираю значение "desc" из селекта "sort date"
    Then Элемент "sort date" должен быть равен значению "desc"
    And Элементы "create order" отсортированы по убыванию local даты

    Scenario: Фильтрация по времени создания ордера (по убыванию)
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я нажимаю ссылку "orders"
    And Я перенаправляюсь на страницу "orders"
    Then Я выбираю значение "asc" из селекта "sort date"
    Then Элемент "sort date" должен быть равен значению "asc"
    And Элементы "create order" отсортированы по возрастанию local даты

    Scenario: Фильтрация по статусу оплаты (оплачен)
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я нажимаю ссылку "orders"
    And Я перенаправляюсь на страницу "orders"
    Then Я выбираю значение "paid" из селекта "sort status"
    Then Элемент "sort status" должен быть равен значению "paid"
    And Каждый элемент "status order" должен быть равен тексту "Status: paid"

    Scenario: Фильтрация по статусу оплаты (оплачен)
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then Я нажимаю ссылку "orders"
    And Я перенаправляюсь на страницу "orders"
    Then Я выбираю значение "unpaid" из селекта "sort status"
    Then Элемент "sort status" должен быть равен значению "unpaid"
    And Каждый элемент "status order" должен быть равен тексту "Status: unpaid"