package handlers

import (
	"net/http"
	"strconv"

	"github.com/mishaalexeev/hospitalbudget_cardio/backend/internal/utils"
	"github.com/mishaalexeev/hospitalbudget_cardio/backend/sqlite"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

// здесь ничего нового, работа с бд и пересчет данных по формулам из экселя

type Tariff struct {
	MedicalSupport
	Coef  float64 `json:"coef"`
	Tarif int64   `json:"tarif"`
}

func GetTariff(c *gin.Context) {
	regionstr, ok := c.GetQuery("region_id")
	if !ok {
		utils.BindErrorMessageWithAbort(c, http.StatusUnprocessableEntity, "cannot get region from query")
		return
	}
	regionID, err := strconv.ParseInt(regionstr, 10, 64)
	if err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot parse region from query")
		return
	}
	result, err := sqlite.ExecuteWithResult(sqlite.GetCoefByRegion, utils.GetLanguage(c), regionID)
	if err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot get coef from database with provided region, err: "+err.Error())
		return
	}
	var regionCoef RegionCoefResult
	if err = jsoniter.Unmarshal(result, &regionCoef); err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot unmarshal region coef, err: "+err.Error())
		return
	}

	result, err = sqlite.ExecuteWithResult(sqlite.GetMedicalSupport, utils.GetLanguage(c))
	if err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot get data from db: "+err.Error())
		return
	}

	var medicalSup []MedicalSupport
	if err = jsoniter.Unmarshal(result, &medicalSup); err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot unmarshal region coef, err: "+err.Error())
		return
	}

	const moscowID = 20

	const group43 = 9599.28
	const group44 = 9983.05
	const group45 = 11716.3
	const group46 = 7214.04
	const group47 = 7921.65
	const group48 = 12008.3
	tarifs := make([]Tariff, len(medicalSup))
	for i := range medicalSup {
		tarif := getTarif(float64(medicalSup[i].FinCostStd), float64(medicalSup[i].WageShare), regionCoef.Coef)
		if regionID == moscowID {
			if medicalSup[i].ID == 1 {
				tarif += group43
			}
			if medicalSup[i].ID == 2 {
				tarif += group44
			}
			if medicalSup[i].ID == 3 {
				tarif += group45
			}
			if medicalSup[i].ID == 4 {
				tarif += group46
			}
			if medicalSup[i].ID == 5 {
				tarif += group47
			}
			if medicalSup[i].ID == 6 {
				tarif += group48
			}
		}
		//Need to check if region == Moscow
		tarifs[i] = Tariff{
			MedicalSupport: MedicalSupport{
				MedicalGroup: medicalSup[i].MedicalGroup,
				FinCostStd:   medicalSup[i].FinCostStd,
				WageShare:    medicalSup[i].WageShare,
			},
			Coef:  regionCoef.Coef,
			Tarif: int64(tarif),
		}
	}

	utils.BindResponseData(c, tarifs)
}

func getTarif(finCostStd, wageShare, coef float64) float64 {
	wagePercent := wageShare / 100
	return finCostStd * ((1 - wagePercent) + wagePercent*coef)
}
