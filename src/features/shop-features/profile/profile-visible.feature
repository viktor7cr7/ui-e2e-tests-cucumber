Feature: Отображение данных профиля

    Scenario: Я как пользователь хочу проверить отображение данных профиля
    Given Авторизация через куки
    Given Я нахожусь на странице "profile"
    And Элемент "profile title" должен отображаться
    And Элемент "upload avatar" должен отображаться
    And Элемент "email input" должен отображаться
    And Элемент "save changes" должен отображаться
    And Текст атрибута "src" в элементе "avatar img" должен содержать текст "https://res.cloudinary.com"