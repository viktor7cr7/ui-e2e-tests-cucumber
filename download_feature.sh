KEY_OR_MODE=$1
ZEPHYR_TOKEN=$2
PROJECT_KEY="KAN"

FEATURES_DIR="src/features/zephyr"
mkdir -p $FEATURES_DIR

add_zephyr_tag() {
  local input_file=$1
  local output_file=$2
  if grep -q "^@.*" "$input_file"; then
    echo "ℹ️ Файл уже содержит теги — оставляем как есть"
    mv "$input_file" "$output_file"
  else
    echo "🏷 Добавляю тег @zephyr"
    awk 'BEGIN {added=0}
         /^Scenario:/ && !added {print "@zephyr"; added=1}
         {print}' "$input_file" > "$output_file"
    rm "$input_file"
  fi
}

if [ "$KEY_OR_MODE" = "all" ]; then
  echo "📥 Загружаю все тест-кейсы из Zephyr Scale..."

  # Получение всех кейсов (максимум 1000)
  response=$(curl -s -X GET \
    "https://eu.api.zephyrscale.smartbear.com/v2/testcases?projectKey=${PROJECT_KEY}&maxResults=1000" \
    -H "Authorization: Bearer $ZEPHYR_TOKEN" \
    -H "Accept: application/json")

  # Извлекаем ключи всех тестов
  keys=$(echo "$response" | jq -r '.values[].key')

  for TEST_KEY in $keys; do
    echo "▶ Загрузка кейса: $TEST_KEY"
    # Извлекаем текст сценария из ответа JSON
    script=$(curl -s -X GET "https://eu.api.zephyrscale.smartbear.com/v2/testcases/${TEST_KEY}/testscript" \
      -H "Authorization: Bearer $ZEPHYR_TOKEN" \
      -H "Accept: application/json" | jq -r '.text')

    # Сохраняем текст сценария во временный файл
    echo "$script" > tmp.feature

    # Добавляем тег @zephyr, если его нет
    add_zephyr_tag tmp.feature "$FEATURES_DIR/${TEST_KEY}.feature"
  done

  echo "✅ Загружено: $(echo "$keys" | wc -l) тестов"
else
  TEST_KEY=$KEY_OR_MODE
  echo "📥 Загружаю один .feature из Zephyr для ключа: $TEST_KEY"

  # Получаем ответ от API и сохраняем в файл для отладки
  json=$(curl -s -X GET "https://eu.api.zephyrscale.smartbear.com/v2/testcases/${TEST_KEY}/testscript" \
    -H "Authorization: Bearer $ZEPHYR_TOKEN" \
    -H "Accept: application/json")

  echo "$json" > tmp_response.json

  # Проверяем, что в ответе есть поле "text"
  if echo "$json" | grep -q '"text":'; then
    # Извлекаем значение поля text вручную (без jq)
    script=$(echo "$json" | sed -n 's/.*"text":"\([^"]*\)".*/\1/p' | sed 's/\\n/\n/g' | sed 's/\\"/"/g')

    echo "$script" > tmp.feature

    # Добавляем тег @zephyr, если его нет
    add_zephyr_tag tmp.feature "$FEATURES_DIR/${TEST_KEY}.feature"

    echo "✅ Готово: $FEATURES_DIR/${TEST_KEY}.feature"
  else
    echo "❌ Ошибка: не удалось получить .feature из Zephyr"
    echo "ℹ️ Ответ сохранён в tmp_response.json:"
    cat tmp_response.json
    exit 1
  fi
fi