# Инструкция
**Запуск Backend - hospitalbudget_cardio/backend**
1. установить Go (https://go.dev/dl/ в зависимости от архитектуры процессора)
2. перейти на компьютере в папку go\src
3. создать там папку github.com
4. создать там папку mishaalexeev
5. создать там папку hospitalbudget_cardio
6. склонировать туда проект
7. открыть папку _backend_ в ide
8. команда - go env -w CGO_ENABLED=1
9. команда - go build main.go
10. команда - nohup go run ./main &

**Запуск Frontend - hospitalbudget_cardio/frontend**
1. открыть папку _frontend_ в ide
2. чтобы подтянуть зависимости команда - npm i
3. в файле app/tarrifs/service/tarrifs.service.ts заменить ip на ip сервера, где запущен backend
4. в файле app/mi-pricing/service/mi-pricing.service.ts заменить ip на ip сервера, где запущен backend
5. команда - ng build
