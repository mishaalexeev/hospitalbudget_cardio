package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	"github.com/mishaalexeev/hospitalbudget_cardio/backend/internal/utils"
	"github.com/mishaalexeev/hospitalbudget_cardio/backend/sqlite"
)

// MedicalSupport структура данных, содержащая информацию по мед.группам
type MedicalSupport struct {
	ID             int64  `json:"id,omitempty"`
	MedicalGroup   string `json:"medical_group,omitempty"`
	MedicalGroupEn string `json:"medical_group_en,omitempty"`
	FinCostStd     int64  `json:"fin_cost_std"`
	WageShare      int64  `json:"wage_share"`
}

func GetMedicalSupport(c *gin.Context) {
	// выполняем запрос с получением результата из базы
	bt, err := sqlite.ExecuteWithResult(sqlite.GetMedicalSupport, utils.GetLanguage(c))
	if err != nil {
		// если ошибка - сообщаем об этом клиенту
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot get data from db: "+err.Error())
		return
	}

	// результат из базы возвращается уже как json, отдаем его клиенту
	utils.BindResponseData(c, jsoniter.RawMessage(bt))
}

func UpdateMedicalSupport(c *gin.Context) {
	// создаем новый экземпляр структуры
	data := new(MedicalSupport)
	// получаем json из тела запроса и десериализируем в структуру
	if ok := utils.BindJsonFromRequest(c, &data); !ok {
		return
	}

	// выполняем запрос с пользовательскими данными
	if err := sqlite.Execute(sqlite.UpdateMedicalSupport, data.MedicalGroup, data.MedicalGroupEn, data.FinCostStd, data.WageShare, data.ID); err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, err.Error())
		return
	}

	// отдаем пустой результат со статусом 204
	utils.BindResponseData(c, nil)
}

func InsertMedicalSupport(c *gin.Context) {
	var data []MedicalSupport
	if ok := utils.BindJsonFromRequest(c, &data); !ok {
		return
	}
	for i := range data {
		if err := sqlite.Execute(sqlite.InsertMedicalSupport, data[i].MedicalGroup, data[i].MedicalGroupEn, data[i].FinCostStd, data[i].WageShare); err != nil {
			utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, err.Error())
			return
		}
	}

	utils.BindResponseData(c, nil)
}
