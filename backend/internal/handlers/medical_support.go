package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"gitlab.com/rotapro/backend/internal/utils"
	"gitlab.com/rotapro/backend/sqlite"
)

type MedicalSupport struct {
	MedicalGroup string `json:"medical_group"`
	FinCostStd   int64  `json:"fin_cost_std"`
	WageShare    int64  `json:"wage_share"`
}

func GetMedicalSupport(c *gin.Context) {
	bt, err := sqlite.ExecuteWithResult(sqlite.GetMedicalSupport)
	if err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot get data from db: "+err.Error())
		return
	}

	utils.BindResponseData(c, jsoniter.RawMessage(bt))
}

func UpdateMedicalSupport(c *gin.Context) {
	data := new(MedicalSupport)
	if ok := utils.BindJsonFromRequest(c, &data); !ok {
		return
	}

	if err := sqlite.Execute(sqlite.UpdateMedicalSupport, data.FinCostStd, data.WageShare, data.MedicalGroup); err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.BindResponseData(c, nil)
}

func InsertMedicalSupport(c *gin.Context) {
	var data []MedicalSupport
	if ok := utils.BindJsonFromRequest(c, &data); !ok {
		return
	}
	for i := range data {
		if err := sqlite.Execute(sqlite.InsertMedicalSupport, data[i].MedicalGroup, data[i].FinCostStd, data[i].WageShare); err != nil {
			utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, err.Error())
			return
		}
	}

	utils.BindResponseData(c, nil)
}
