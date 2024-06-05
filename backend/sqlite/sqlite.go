package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/mattn/go-sqlite3"
	"github.com/sirupsen/logrus"
)

var dbConn *sql.DB

// InitSqlite функция для инициализации бд
func InitSqlite() {
	createLocalDBDir() // создаем директорию где будет лежать база

	db, err := sql.Open("sqlite3", "./db/sqlitelogs.db?cache=shared") // открываем базу данных
	if err != nil {
		panic(err)
	}
	db.SetMaxOpenConns(10)                 //задаем максимальное количество открытых соединений
	db.SetMaxIdleConns(10)                 //задаем максимальное количество висячих соединений
	db.SetConnMaxLifetime(7 * time.Second) //время жизни соединения
	db.SetConnMaxIdleTime(7 * time.Second) //время жизни висячего соединения
	for i := 0; i < 3; i++ {
		if err = db.Ping(); err != nil { // проверяем подключение
			logrus.Warn(err)
			time.Sleep(1 * time.Second)
			continue
		}
	}
	if err != nil {
		_ = db.Close()
		logrus.Panic(err)
		return
	}
	dbConn = db
	// создаем таблицу по коэффициентам регионов
	if _, err = db.Exec(createRegionCoefTable); err != nil {
		logrus.Errorf("cannot create main table: %v", err)
		return
	}
	// создаем таблицу по переводам регионов
	if _, err = db.Exec(createRegionCoefTranslationTable); err != nil {
		logrus.Errorf("cannot create main table: %v", err)
		return
	}
	// создаем таблицу по стоимостям
	if _, err = db.Exec(createMedicalSupportTable); err != nil {
		logrus.Errorf("cannot create main table: %v", err)
		return
	}
}

func createLocalDBDir() {
	const path = "./db"                              // константа директории
	if _, err := os.Stat(path); os.IsNotExist(err) { // проверяем наличие директории, если ошибка - не существует, идем дальше
		if err = os.Mkdir(path, 0777); err != nil { // создаем директорию
			panic("Cannot make dir for localdb: " + err.Error()) // паника, если что-то не дало создать директорию
			return
		}
	}
}

// Execute выполняет квери запрос
func Execute(query string, args ...any) error {
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second) // создаем контекст с таймаутом, чтобы если запрос повис - произошел откат транзакции
	defer cancel()
	tx, err := dbConn.BeginTx(ctx, nil) //начинаем транзакцию
	if err != nil {
		return err
	}
	stmt, err := tx.Prepare(query) //передаем в транзакцию запрос
	if err != nil {
		if errRollback := tx.Rollback(); errRollback != nil { // если ошибка - откатываем транзакцию
			return fmt.Errorf("cannot rollback: %v, Err: %v", errRollback, err)
		}
		return err
	}
	_, err = stmt.Exec(args...) // передаем аргументы в запрос и выполняем его
	if err != nil {
		if errRollback := tx.Rollback(); errRollback != nil { // если ошибка - откатываем транзакцию
			return fmt.Errorf("cannot rollback: %v, Err: %v", errRollback, err)
		}
		return err
	}
	if err = stmt.Close(); err != nil { // завершаем запрос
		if errRollback := tx.Rollback(); errRollback != nil { // если ошибка - откатываем транзакцию
			return fmt.Errorf("cannot rollback: %v, Err: %v", errRollback, err)
		}
		return err
	}
	if err = tx.Commit(); err != nil { // совершаем транзакцию
		if errRollback := tx.Rollback(); errRollback != nil { // если ошибка - откатываем транзакцию
			return fmt.Errorf("cannot rollback: %v, Err: %v", errRollback, err)
		}
		return err
	}

	return nil
}

// ExecuteWithResult аналогично Execute, только квери возвращает строки, которые мы вычитываем байтами
func ExecuteWithResult(query string, args ...any) ([]byte, error) {
	rows, err := dbConn.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var bt []byte
	for rows.Next() {
		if err = rows.Scan(&bt); err != nil {
			return nil, err
		}
	}
	return bt, err
}
