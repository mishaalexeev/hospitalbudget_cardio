package main

import (
	"net/http"
	"os"
	"reflect"

	"gitlab.com/rotapro/backend/internal/handlers"
	"gitlab.com/rotapro/backend/internal/utils"
	"gitlab.com/rotapro/backend/sqlite"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// init() выполняется всегда перед main(), нужна для инициализации каких-то компонентов
func init() {
	// пакет logrus задает форматирования для логгера
	logrus.SetFormatter(&logrus.JSONFormatter{}) // указываем использовать форматирование json
	logrus.SetOutput(os.Stdout)                  // указываем писать логи в стандартный вывод (https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D1%8B%D0%B5_%D0%BF%D0%BE%D1%82%D0%BE%D0%BA%D0%B8)
	logrus.SetLevel(logrus.DebugLevel)           // указываем на стандартный уровень логирования - дебаг
	sqlite.InitSqlite()                          // инициализация бд SQLite
}

// main основная функция, точка входа в программу
func main() {
	engine := gin.Default() // gin - веб фреймворк/хттп сервер, есть еще fasthttp_server, fiber и тд,
	// но этот просто лучше знаю, можешь в сравнение добавить почему именно он,
	//потому что много возможностей из коробки и быстро и понятно настраивается
	engine.Use(recovery(), CORSMiddleware()) // указываем джину использовать эти миддлвары,
	// middleware - прослойка, позволяющая выполнять тот или иной код по цепочке вызовов, таким образом одно и то же не нужно постоянно дублировать,
	// если нужно проверять авторизацию, например, то достаточно написать мидллвару, кстати авторизации у нас нет
	engine.GET("/ping", pingHandler)                               // эндпоинт для проверки доступности серверва
	engine.GET("/region_coefficients", handlers.GetRegionCoef)     // получить коэффициенты по регионам
	engine.POST("/region_coefficients", handlers.UpdateRegionCoef) // обновить коэффициенты по регионам
	engine.POST("/mi_cost", handlers.GetMiCost)                    // получить стоимость МИ
	// GET POST - http методы, читай тут (https://developer.mozilla.org/ru/docs/Web/HTTP/Methods)
	engine.GET("/medical_support", handlers.GetMedicalSupport)            // получить медицинские тарифы или че там не помню
	engine.POST("/medical_support", handlers.UpdateMedicalSupport)        // обновить их
	engine.POST("/medical_support_insert", handlers.InsertMedicalSupport) // воткнуть новые

	engine.GET("/get_tariff", handlers.GetTariff) // посчитать тариф
	engine.Run()                                  // запустить сервер
}

// recovery прослойка для того чтобы если какой-то код вызвал панику приложения,
// или запрос уложил приложение - сервер сразу же восстановился и сообщил об этом
func recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			// The recover built-in function allows a program to manage behavior of a panicking goroutine.
			// Executing a call to recover inside a deferred function (but not any function called by it) stops the panicking
			// sequence by restoring normal execution and retrieves the error value passed to the call of panic.
			// If recover is called outside the deferred function it will not stop a panicking sequence.
			// In this case, or when the goroutine is not panicking, recover returns nil.
			if err := recover(); err != nil {
				utils.BindResponseData(c, struct {
					Title string
					Error any
				}{
					Title: "internal service panic " + reflect.TypeOf(err).Name(),
					Error: err,
				})
			}
		}()
	}
}

// CORSMiddleware миддлвара, устанавливающая заголовки для работы CORS, читай тут (https://developer.mozilla.org/ru/docs/Web/HTTP/CORS)
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// возвращает 204 статус код, читай тут (https://developer.mozilla.org/ru/docs/Web/HTTP/Status)
func pingHandler(c *gin.Context) {
	c.JSON(http.StatusNoContent, nil)
}
