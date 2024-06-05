package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/rotapro/backend/internal/utils"
	"gitlab.com/rotapro/backend/sqlite"
)

type RegionCoefResult struct {
	ID int64 `json:"id"`
	RegionCoef
}

type RegionCoef struct {
	Region string `json:"region" binding:"required,max=100"` // после типа данных указываются теги рефлексии,
	// с их помощью можно выполнять какие-либо действия над полями структуры,
	// например по тегу json пакеты сериализации понимают в ключ с каким имененем должно быть это значение в json
	// binding тег нужен для задания валидации на поле, используется оберткой gin'а над пакетом validator
	Coef float64 `json:"coef" binding:"required,max=2147483647"`
}

func GetRegionCoef(c *gin.Context) {
	bt, err := sqlite.ExecuteWithResult(sqlite.GetAllRegionCoef, utils.GetLanguage(c))
	if err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot get data from db: "+err.Error())
		return
	}

	utils.BindResponseData(c, jsoniter.RawMessage(bt))
}

func UpdateRegionCoef(c *gin.Context) {
	data := new(RegionCoef)
	if ok := utils.BindJsonFromRequest(c, &data); !ok {
		return
	}

	if err := sqlite.Execute(sqlite.UpdateRegionCoef, data.Coef, data.Region); err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.BindResponseData(c, nil)
}
