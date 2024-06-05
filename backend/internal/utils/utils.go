package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

const DefaultLanguage = "ru-RU"

// Data структура, содержащая обертку в Data, считается хорошим тоном отдавать данные в теле запроса, обернутые в Data
type Data struct {
	Data any `json:"data"`
}

// BindJsonFromRequest Десериализует тело запроса в структуру, переданную в data any
func BindJsonFromRequest(c *gin.Context, data any) bool {
	if err := c.ShouldBindJSON(&data); err != nil {
		BindErrorMessageWithAbort(c, http.StatusBadRequest, "cannot bind json object, err: "+err.Error())
		return false
	}
	return true
}

// BindErrorMessageWithAbort создает структуру ошибки и одтает ее клиенту с переданным статус кодом
func BindErrorMessageWithAbort(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, Data{Data: struct {
		Error string
	}{
		Error: message,
	}})
	c.Abort()
}

// BindResponseData отдает данные клиенту в формате json
func BindResponseData(c *gin.Context, data any) {
	// если данные не переданы функцию, отдаем статус код 204, нет данных, но запрос успешен
	if data == nil {
		c.JSON(http.StatusNoContent, nil)
		return
	}
	// создаем экземпляр структуры ответа клиенту
	response := Data{
		Data: data, // подставляем значения
	}
	// jsoniter - пакет для сериализации данных в json, быстрее чем дефолтный пакет encoding/json в go
	b, err := jsoniter.Marshal(response)
	if err != nil {
		// если ошибка - даем о ней знать клиенту
		BindErrorMessageWithAbort(c, http.StatusInternalServerError, err.Error())
		return
	}
	// отдаем сериализованные байты, ставим заголовок application/json
	c.Data(http.StatusOK, "application/json", b)
}

func GetLanguage(c *gin.Context) string {
	if r := c.GetHeader("Accept-Language"); len(r) > 0 {
		return r
	}
	return DefaultLanguage
}
