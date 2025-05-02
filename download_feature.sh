KEY_OR_MODE=$1   # либо 'KAN-T1001', либо 'all'
ZEPHYR_TOKEN=$2

mkdir -p features

if [ "$KEY_OR_MODE" = "all" ]; then
  echo "📥 Загружаю все .feature-файлы из Zephyr Scale"

  curl -s -X GET "https://api.zephyrscale.smartbear.com/v2/testcases?maxResults=1000" \
    -H "Authorization: Bearer $ZEPHYR_TOKEN" \
    -H "Accept: application/json" | \
    jq -r '.items[].key' | while read TEST_KEY; do
      echo "▶ Загружаю сценарий для: $TEST_KEY"
      curl -s -X GET "https://api.zephyrscale.smartbear.com/v2/testcases/${TEST_KEY}/testscript" \
        -H "Authorization: Bearer $ZEPHYR_TOKEN" \
        -H "Accept: text/plain" \
        -o features/${TEST_KEY}.feature
  done

else
  TEST_KEY=$KEY_OR_MODE
  echo "📥 Загружаю .feature из Zephyr для ключа: $TEST_KEY"

  curl -s -X GET "https://api.zephyrscale.smartbear.com/v2/testcases/${TEST_KEY}/testscript" \
    -H "Authorization: Bearer $ZEPHYR_TOKEN" \
    -H "Accept: text/plain" \
    -o features/${TEST_KEY}.feature
fi