TAG=$1

yarn precucumber

if [ -z "$TAG" ]; then
  echo "🟢 Запуск всех тестов"
  yarn cucumber:localhost --profile dev
else
  echo "🟢 Запуск тестов с тегом: $TAG"
  yarn cucumber:localhost --tags "$TAG"
fi