pipeline {
    agent any

    parameters {
        choice(
            name: 'TEST_SOURCE',
            choices: ['framework', 'jira_all', 'jira_one'],
            description: 'Источник тестов: один кейс из Jira, все кейсы из Jira, или только локальные из фреймворка'
        )
        string(
            name: 'JIRA_TAG',
            defaultValue: '',
            description: 'Ключ Jira теста (например: KAN-T1). Используется только при выборе jira_one'
        )
    }

    environment {
        REPO_URL = 'https://viktorsmolov916@bitbucket.org/automations-tests/ui-e2e-tests-cucumber.git'
        BRANCH = 'integration-jira'
        PATH = "${env.PATH};C:\\Users\\itqa\\AppData\\Roaming\\npm\\node_modules\\yarn\\bin"
        ZEPHYR_TOKEN = credentials('ZEPHYR_TOKEN')
        JQ_BIN = 'C:\\tools\\jq\\jq.exe'
    }

    stages {
        stage('Клонирование репозитория') {
            steps {
                git branch: "${env.BRANCH}", url: "${env.REPO_URL}"
            }
        }

        stage('Установка зависимостей') {
            steps {
                script {
                    bat 'yarn install'
                    bat 'npx playwright install'
                }
            }
        }

        stage('Подготовка .feature-файлов') {
            steps {
                script {
                    def bashPath = '"C:\\Program Files\\Git\\bin\\bash.exe"'

                    if (params.TEST_SOURCE == 'jira_one') {
                        if (!params.JIRA_TAG?.trim()) {
                            error "❌ Не указан ключ теста (JIRA_TAG), а выбран режим jira_one"
                        }
                        echo "📥 Скачиваю один .feature-файл из Zephyr по ключу: ${params.JIRA_TAG}"
                        bat "${bashPath} download_feature.sh ${params.JIRA_TAG} ${env.ZEPHYR_TOKEN} ${env.JQ_BIN}"

                    } else if (params.TEST_SOURCE == 'jira_all') {
                        echo "📥 Скачиваю все .feature-файлы из Zephyr"
                        bat "${bashPath} download_feature.sh all ${env.ZEPHYR_TOKEN} ${env.JQ_BIN}"

                    } else {
                        echo "📂 Используем только локальные .feature-файлы из фреймворка"
                    }
                }
            }
        }

        stage('Запуск тестов') {
            steps {
                script {
                    def bashPath = '"C:\\Program Files\\Git\\bin\\bash.exe"'
                    if (params.TEST_SOURCE == 'jira_one' || params.TEST_SOURCE == 'jira_all') {
                        echo "🧪 Запускаю Zephyr-тесты с тегом @zephyr"
                        bat "${bashPath} run_tests.sh zephyr"
                    } else {
                        echo "🧪 Запускаю локальные dev-тесты"
                        bat " ${bashPath} run_tests.sh"
                    }
                }
            }
        }
        
        stage('Публикация Allure Report') {
            steps {
                allure([
                results: [[path: 'allure-results']]
            ])
        }
}

        // stage('Публикация отчётов в Zephyr') {
        //     steps {
        //         echo "📤 Загружаю отчёты в Zephyr (настраивается отдельно)"
        //     }
        // }
    }
}