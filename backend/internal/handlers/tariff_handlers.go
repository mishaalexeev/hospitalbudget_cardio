package handlers

import (
	"net/http"
	"strings"

	"gitlab.com/rotapro/backend/internal/utils"
	"gitlab.com/rotapro/backend/sqlite"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
)

type Tariff struct {
	MedicalSupport
	Coef  float64 `json:"coef"`
	Tarif int64   `json:"tarif"`
}

func GetTarif(c *gin.Context) {
	region, ok := c.GetQuery("region")
	if !ok {
		utils.BindErrorMessageWithAbort(c, http.StatusUnprocessableEntity, "cannot get region from query")
		return
	}
	result, err := sqlite.ExecuteWithResult(sqlite.GetCoefByRegion, region)
	if err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot get coef from database with provided region, err: "+err.Error())
		return
	}
	var regionCoef RegionCoef
	if err = jsoniter.Unmarshal(result, &regionCoef); err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot unmarshal region coef, err: "+err.Error())
		return
	}

	result, err = sqlite.ExecuteWithResult(sqlite.GetMedicalSupport)
	if err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot get data from db: "+err.Error())
		return
	}

	var medicalSup []MedicalSupport
	if err = jsoniter.Unmarshal(result, &medicalSup); err != nil {
		utils.BindErrorMessageWithAbort(c, http.StatusInternalServerError, "cannot unmarshal region coef, err: "+err.Error())
		return
	}

	const group43 = 9599.28
	const group44 = 9983.05
	const group45 = 11716.3
	const group46 = 7214.04
	const group47 = 7921.65
	const group48 = 12008.3
	tarifs := make([]Tariff, len(medicalSup))
	for i := range medicalSup {
		tarif := getTarif(float64(medicalSup[i].FinCostStd), float64(medicalSup[i].WageShare), regionCoef.Coef)
		if region == "Москва" {
			if strings.Contains(medicalSup[i].MedicalGroup, "43 гр.") {
				tarif += group43
			}
			if strings.Contains(medicalSup[i].MedicalGroup, "44 гр.") {
				tarif += group44
			}
			if strings.Contains(medicalSup[i].MedicalGroup, "45 гр.") {
				tarif += group45
			}
			if strings.Contains(medicalSup[i].MedicalGroup, "46 гр.") {
				tarif += group46
			}
			if strings.Contains(medicalSup[i].MedicalGroup, "47 гр.") {
				tarif += group47
			}
			if strings.Contains(medicalSup[i].MedicalGroup, "48 гр.") {
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
