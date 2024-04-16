package utils

import (
	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"net/http"
)

type Data struct {
	Data any `json:"data"`
}

func BindJsonFromRequest(c *gin.Context, data any) bool {
	if err := c.ShouldBindJSON(&data); err != nil {
		BindErrorMessageWithAbort(c, http.StatusBadRequest, "cannot bind json object, err: "+err.Error())
		return false
	}
	return true
}

func BindErrorMessageWithAbort(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, Data{Data: struct {
		Error string
	}{
		Error: message,
	}})
	c.Abort()
}

func BindResponseData(c *gin.Context, data any) {
	if data == nil {
		c.JSON(http.StatusNoContent, nil)
		return
	}
	response := Data{
		Data: data,
	}
	b, err := jsoniter.Marshal(response)
	if err != nil {
		BindErrorMessageWithAbort(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.Data(http.StatusOK, "application/json", b)
}
