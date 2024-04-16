package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	_ "github.com/mattn/go-sqlite3"
	"github.com/sirupsen/logrus"
	"os"
	"time"
)

var dbConn *sql.DB

func InitSqlite() {
	createLocalDBDir()

	db, err := sql.Open("sqlite3", "./db/sqlitelogs.db?cache=shared")
	if err != nil {
		panic(err)
	}
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(7 * time.Second)
	db.SetConnMaxIdleTime(7 * time.Second)
	for i := 0; i < 3; i++ {
		if err = db.Ping(); err != nil {
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
	if _, err = db.Exec(createRegionCoefTable); err != nil {
		logrus.Errorf("cannot create main table: %v", err)
		return
	}
	if _, err = db.Exec(createMedicalSupportTable); err != nil {
		logrus.Errorf("cannot create main table: %v", err)
		return
	}
}

func createLocalDBDir() {
	const path = "./db"
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err = os.Mkdir(path, 0777); err != nil {
			panic("Cannot make dir for localdb: " + err.Error())
			return
		}
	}
}

func Execute(query string, args ...any) error {
	ctx, cancel := context.WithTimeout(context.Background(), 7*time.Second)
	defer cancel()
	tx, err := dbConn.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	stmt, err := tx.Prepare(query)
	if err != nil {
		if errRollback := tx.Rollback(); errRollback != nil {
			return fmt.Errorf("cannot rollback: %v, Err: %v", errRollback, err)
		}
		return err
	}
	_, err = stmt.Exec(args...)
	if err != nil {
		if errRollback := tx.Rollback(); errRollback != nil {
			return fmt.Errorf("cannot rollback: %v, Err: %v", errRollback, err)
		}
		return err
	}
	if err = stmt.Close(); err != nil {
		if errRollback := tx.Rollback(); errRollback != nil {
			return fmt.Errorf("cannot rollback: %v, Err: %v", errRollback, err)
		}
		return err
	}
	if err = tx.Commit(); err != nil {
		if errRollback := tx.Rollback(); errRollback != nil {
			return fmt.Errorf("cannot rollback: %v, Err: %v", errRollback, err)
		}
		return err
	}

	return nil
}

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
