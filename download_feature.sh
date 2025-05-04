KEY_OR_MODE=$1
ZEPHYR_TOKEN=$2
JQ_BIN=$3
PROJECT_KEY="KAN"

FEATURES_DIR="src/features/zephyr"

echo "Удаляю все тест-кейсы из папки Zephyr: $FEATURES_DIR"
rm -rf "$FEATURES_DIR"

echo "Создаю заново пустую папку: $FEATURES_DIR"
mkdir -p "$FEATURES_DIR"

echo "Содержимое папки после очистки:"
ls -l "$FEATURES_DIR"

get_test_script() {
  local test_key=$1
  local retries=5
  local delay=2
  local raw_response=""
  local http_code=""
local trace_file="curl_trace_${test_key}.log"

  echo "DEBUG: Запуск get_test_script для test_key=$test_key" >&2
  echo "▶ DEBUG (od -c) test_key:" >&2
  echo "$test_key" | od -c >&2
  for attempt in $(seq 1 $retries); do
    echo "🔄 Попытка $attempt получить $test_key..." >&2

    # Получаем ответ + HTTP статус (в одну строку)
    raw_response=$(curl -s --trace-ascii "$trace_file" -w "%{http_code}" -X GET \
      "https://eu.api.zephyrscale.smartbear.com/v2/testcases/${test_key}/testscript" \
      -H "Authorization: Bearer $ZEPHYR_TOKEN" \
      -H "Accept: application/json")

    echo "📄 Запрос и ответ сохранены в $trace_file"

    http_code=${raw_response: -3}
    raw_response=${raw_response:: -3}

    if [[ $http_code -eq 200 && -n "$raw_response" ]]; then
      echo "✅ Ответ успешно получен (HTTP $http_code)" >&2
      break
    else
      echo "⚠️ Ошибка: HTTP $http_code, ответ: $raw_response" >&2
      echo "⏳ Жду $delay сек перед повтором..." >&2
      sleep $delay
    fi
  done

  # Возвращаем только JSON-часть
  echo "$raw_response"
}

add_zephyr_tag() {
  set -x
  local input_file=$1
  local output_file=$2
  if grep -q "^@.*" "$input_file"; then
    echo "ℹ️ Файл уже содержит теги — оставляем как есть"
    cp "$input_file" "$output_file"
  else
    echo "🏷 Добавляю тег @zephyr"
    tmp_file=$(mktemp)
    awk 'BEGIN {added=0}
         /[[:space:]]*Scenario:/ && !added {print "@zephyr"; added=1}
         {print}' "$input_file" > "$tmp_file"
    cat "$tmp_file"
    mv "$tmp_file" "$output_file"
  fi
  rm -f "$input_file"
}

if [ "$KEY_OR_MODE" = "all" ]; then
  echo "📥 Загружаю все тест-кейсы из Zephyr Scale..."

  # Получение всех кейсов (максимум 1000)
  response=$(curl -s -X GET \
    "https://eu.api.zephyrscale.smartbear.com/v2/testcases?projectKey=${PROJECT_KEY}&maxResults=1000" \
    -H "Authorization: Bearer $ZEPHYR_TOKEN" \
    -H "Accept: application/json")

  # Извлекаем ключи всех тестов
  keys=$(echo "$response" | "$JQ_BIN" -r '.values[].key')

  echo "keys = $keys"

  for TEST_KEY in $keys; do
    echo "▶ Загрузка кейса: $TEST_KEY"
    
    # Извлекаем текст сценария из ответа JSON
    raw_response=$(get_test_script "$TEST_KEY")
    response=$(echo "$raw_response" | "$JQ_BIN" -r '.text // empty')
    if [[ -z "$response" ]]; then
        echo "Ошибка: Не удалось извлечь поле .text для кейса $TEST_KEY"
        continue
    fi
    
    echo "raw_response = $raw_response"
    echo "Ответ от зефир = $response"

    # Путь к файлу с тестом
    feature_file=$(echo "$FEATURES_DIR/${TEST_KEY}.feature" | tr -d '\r')
    tmp_file="tmp.feature"

    # Создаем заголовки Feature и Scenario
    feature_header="Feature: Тест кейс $TEST_KEY"
    scenario_header="Scenario: Сценарий для теста $TEST_KEY"

    # Сохраняем в .feature файл
    echo "$feature_header" > "$tmp_file"
    echo "$scenario_header" >> "$tmp_file"
    echo "$response" >> "$tmp_file"

    # Добавляем тег @zephyr, если его нет
    add_zephyr_tag "$tmp_file" "$feature_file"
  done

  echo "✅ Загружено: $(echo "$keys" | wc -l) тестов"
else
  TEST_KEY=$KEY_OR_MODE
  echo "📥 Загружаю один .feature из Zephyr для ключа: $TEST_KEY"

  # Путь к финальному файлу
  feature_file="$FEATURES_DIR/${TEST_KEY}.feature"
  tmp_file="tmp.feature"

  # Получаем JSON с телом теста
  response=$(curl -s -X GET "https://eu.api.zephyrscale.smartbear.com/v2/testcases/${TEST_KEY}/testscript" \
    -H "Authorization: Bearer $ZEPHYR_TOKEN" \
    -H "Accept: application/json" | "$JQ_BIN" -r '.text')

  echo "Response: ${response}"

  # Проверка: если `script` содержит errorCode — это ошибка
  if echo "$response" | grep -q '"errorCode"'; then
    echo "❌ Получен ответ об ошибке от Zephyr: $response"
    exit 1
  fi
  

    # Создаем заголовки Feature и Scenario
    feature_header="Feature: Тест кейс $TEST_KEY"
    scenario_header=" Scenario: Сценарий для теста $TEST_KEY"

    # Сохраняем в .feature файл
    echo "$feature_header" > "$tmp_file"
    echo "$scenario_header" >> "$tmp_file"
    echo "$response" >> "$tmp_file"

  # Добавляем тег и записываем в целевой файл
  add_zephyr_tag "$tmp_file" "$feature_file"

  echo "✅ Готово: $feature_file"
fi