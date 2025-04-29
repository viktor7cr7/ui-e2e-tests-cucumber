Feature: Как пользователь я хочу посмотреть описание товара

    Scenario:  Как пользователь я хочу посмотреть описание товара и взаимодействовать с ним
    Given Авторизация через куки
    Given Я нахожусь на странице "buy products"
    Then "1ый" элемент "product container" должен отображаться
    Then Я навожу мышкой на "1ый" элемент "product img"
    Then "1ый" элемент "button description" должен отображаться
    And "1ый" элемент "description product" не должен отображаться
    And Я нажимаю на "1ую" кнопку "button description"
    Then "1ый" элемент "description product" должен отображаться
    And Элемент "description name" должен содержать текст "Портативная (беспроводная) колонка JBL CHARGE5 RED"
    And Элемент "desciption text" должен содержать текст "Портативная водонепроницаемая колонка с возможностью зарядки внешних устройств порадует мощным звуком и небольшим весом"
    And Элемент "desciption id" должен содержать текст "ID: 28"
    When Я нажимаю кнопку "close modal description product"
    Then "1ый" элемент "description product" не должен отображаться