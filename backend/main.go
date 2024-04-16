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

func init() {
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetOutput(os.Stdout)
	logrus.SetLevel(logrus.DebugLevel)
	sqlite.InitSqlite()
}

func main() {
	engine := gin.Default()
	engine.Use(recovery(), CORSMiddleware())
	engine.GET("/ping", pingHandler)
	engine.GET("/region_coefficients", handlers.GetRegionCoef)
	engine.POST("/region_coefficients", handlers.UpdateRegionCoef)
	engine.POST("/mi_cost", handlers.GetMiCost)

	engine.GET("/medical_support", handlers.GetMedicalSupport)
	engine.POST("/medical_support", handlers.UpdateMedicalSupport)
	engine.POST("/medical_support_insert", handlers.InsertMedicalSupport)

	engine.GET("/get_tariff", handlers.GetTarif)
	engine.Run()
}

func recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
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

func pingHandler(c *gin.Context) {
	c.JSON(http.StatusNoContent, nil)
}
