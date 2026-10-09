#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080/api/v1}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@bookstore.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-123456}"

if [[ -n "${ADMIN_TOKEN:-}" ]]; then
  admin_token="$ADMIN_TOKEN"
else
  login_response=$(curl -fsS -X POST "${BASE_URL}/auth/login" \
    -H 'Content-Type: application/json' \
    -d "$(printf '{"email":"%s","password":"%s"}' "$ADMIN_EMAIL" "$ADMIN_PASSWORD")")
  admin_token=$(printf '%s' "$login_response" | python3 -c 'import json, sys; print(json.load(sys.stdin)["data"]["accessToken"])')
fi

categories_response=$(curl -fsS "${BASE_URL}/categories")
category_ids=$(printf '%s' "$categories_response" | python3 -c '
import json
import sys

data = json.load(sys.stdin)["data"]
if not data:
    raise SystemExit("No categories found. Create at least one category first.")
print(",".join(str(category["id"]) for category in data[:2]))
')

IFS=',' read -r first_category_id second_category_id <<< "$category_ids"
second_category_id="${second_category_id:-$first_category_id}"

titles=(
  "The Midnight Library" "Atomic Habits" "The Silent Patient" "Educated" "Project Hail Mary"
  "The Psychology of Money" "Tomorrow and Tomorrow and Tomorrow" "The Alchemist" "Dune" "Sapiens"
  "The Seven Husbands of Evelyn Hugo" "Deep Work" "The Book Thief" "The Creative Act" "Pachinko"
  "The Midnight Garden" "The Art of Rest" "A Study in Scarlet" "The Last Storyteller" "The Ocean at the End"
  "The City of Brass" "The Paper Palace" "The Great Gatsby" "The House in the Cerulean Sea" "The Lincoln Highway"
  "Lessons in Chemistry" "The Thursday Murder Club" "The Night Circus" "Cloud Atlas" "The Covenant of Water"
  "The Measure" "The Vanishing Half" "The Namesake" "The Light We Carry" "The Anthropocene Reviewed"
  "The Immortal Life" "The Song of Achilles" "The Paris Apartment" "The Happiness Project" "The Shadow of the Wind"
  "The Little Prince" "The Art of Thinking Clearly" "The Four Winds" "The Cartographers" "The Dutch House"
  "The Housekeeper and the Professor" "The Lincoln Lawyer" "The Storyteller" "The Wisdom of Sundays" "The Book of Delights"
)

images=(
  book-1.png book-2.png book-3.png book-4.png book-5.png book-6.png book-7.png book-8.png book-9.png book-10.png
  book-11.png book-12.png book-13.png book-14.png book-15.png book-16.png book-17.png book-18.png book-19.png book-20.png
  young-bucks.png girl-stop.png ride-lifetime.png
)

for index in "${!titles[@]}"; do
  book_number=$((index + 1))
  price=$((12 + (index % 18) * 2))
  stock_quantity=$((15 + (index % 6) * 5))
  category_id="$first_category_id"
  if (( index % 3 == 0 )); then
    category_id="$second_category_id"
  fi
  image="${images[$((index % ${#images[@]}))]}"

  response_file=$(mktemp)
  http_code=$(curl -sS -o "$response_file" -w '%{http_code}' \
    -X POST "${BASE_URL}/books" \
    -H "Authorization: Bearer ${admin_token}" \
    -H 'Content-Type: application/json' \
    -d "$(cat <<JSON
{
  "title": "${titles[$index]}",
  "isbn": "978000000${book_number}",
  "price": ${price},
  "stockQuantity": ${stock_quantity},
  "categoryIds": [${category_id}],
  "description": "A sample catalogue book added for bookstore development and testing.",
  "imageUrl": "${image}"
}
JSON
)")

  if [[ "$http_code" != "201" ]]; then
    printf 'Failed at book %d (HTTP %s):\n' "$book_number" "$http_code" >&2
    cat "$response_file" >&2
    rm -f "$response_file"
    exit 1
  fi

  printf '[%d/50] Added %s using %s\n' "$book_number" "${titles[$index]}" "$image"
  rm -f "$response_file"
done

printf 'Finished: added 50 sample books.\n'