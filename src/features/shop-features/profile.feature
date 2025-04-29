Feature: Я как пользователь хочу проверить отображение данных профиля и обновить данные

    Scenario: Я как пользователь хочу проверить отображение данных профиля
    Given Авторизация через куки
    Given Я нахожусь на странице "profile"
    And Элемент "profile title" должен отображаться
    And Элемент "upload avatar" должен отображаться
    And Элемент "email input" должен отображаться
    And Элемент "save changes" должен отображаться
    And Текст атрибута "src" в элементе "avatar img" должен содержать текст "https://res.cloudinary.com"

    Scenario: Я как пользователь хочу обновить аватар и email
    Given Авторизация через куки
    Given Я нахожусь на странице "profile"
    And Я загружаю файл "avatar.jpg" в элемент "upload avatar"
    And Значение элемента "upload avatar" должно содержать текст "avatar.jpg"
    And Я заполняю поле "email input" значением "test-email-test@mail.ru"
    And Я нажимаю кнопку "save changes"
    And Элемент "notification success" должен отображаться
    And Текст элемента "notification success" должен быть равен тексту "Данные успешно обновлены"
    And Значение атрибута "src" в элементе "avatar img" должно содержать текст "https://res.cloudinary.com"
    And Значение элемента "email input" должно быть равно тексту "test-email-test@mail.ru"
    And Я заполняю поле "email input" значением "test-email@mail.ru"
    And Я нажимаю кнопку "save changes"
    And Только "2" элемента "notification success" должны отображаться на странице