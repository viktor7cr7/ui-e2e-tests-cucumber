Feature: Отображение информации о грейде

    Scenario: Я как пользователь хочу проверить отображение страницы Grades
    Given Cумма покупок пользователя "31" обнулена
    Given Авторизация через куки
    Given Я нахожусь на странице "profile"
    And Элемент "grades title" должен отображаться
    And Элемент "grades indicator" не должен отображаться
    And Элемент "grades title" должен отображаться
    And Только "3" элемента "discount count percentage" должны отображаться на странице
    And Элемент "my grades" должен отображаться
    And Элемент "current amount" должен отображаться
    And Элемент "current level" должен отображаться
    And Элемент "to next level" должен отображаться