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
  echo "🔐 ZEPHYR_TOKEN: ${#ZEPHYR_TOKEN} символов"

  # отладка
response=$(curl -i -s -X GET "https://eu.api.zephyrscale.smartbear.com/v2/testcases/${TEST_KEY}/testscript" \
  -H "Authorization: Bearer $ZEPHYR_TOKEN" \
  -H "Accept: application/json")

echo "=== RAW RESPONSE ==="
echo "$response"
echo "===================="

# Попробуем извлечь текст, если ответ нормальный
script=$(echo "$response" | jq -r '.text' 2>/dev/null)
fi