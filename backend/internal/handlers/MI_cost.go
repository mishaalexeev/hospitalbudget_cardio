package handlers

import (
	"net/http"

	"gitlab.com/rotapro/backend/internal/utils"

	"github.com/gin-gonic/gin"
)

var rotaProCoef = 1.7

type MiCost struct {
	RotaProCost         int64 `json:"rota_pro_cost"`
	Stent               int64 `json:"stent"`
	Introducer          int64 `json:"introducer"`
	DiagnosticCatheter  int64 `json:"diagnostic_catheter"`
	GuideCatheter       int64 `json:"guide_catheter"`
	Guide               int64 `json:"guide"`
	PredilatoryBalloon  int64 `json:"predilatory_balloon"`
	PostdilatoryBalloon int64 `json:"postdilatory_balloon"`
	VSUZIConductor      int64 `json:"vsuzi_conductor"`
	OKTConductor        int64 `json:"okt_conductor"`
	Conductor           int64 `json:"conductor"`
	DrillAdvance        int64 `json:"drill_advance"`
}

type treatmentCost struct {
	Name  string `json:"name"`
	CKV   int64  `json:"ckv"`
	CKVPA int64  `json:"ckvpa"`
}

type miCostResponse struct {
	RotaPro           int64           `json:"rota_pro_cost"`
	RAWithThreeStents int64           `json:"ra_with_three_stents"`
	MiCostData        []treatmentCost `json:"mi_cost_data"`
}

func GetMiCost(c *gin.Context) {
	data := new(MiCost)
	if ok := utils.BindJsonFromRequest(c, &data); !ok {
		return
	}

	// создаем структуру ответа
	response := miCostResponse{
		RotaPro: data.RotaProCost,
	}
	// считаем по формуле из экселя
	oneStent := data.Stent +
		data.Introducer +
		data.DiagnosticCatheter +
		data.GuideCatheter +
		data.Guide +
		data.PredilatoryBalloon +
		data.PostdilatoryBalloon
	twoStent := oneStent + data.Stent + data.PredilatoryBalloon + data.PostdilatoryBalloon
	threeStent := oneStent + (data.Stent+data.PostdilatoryBalloon+data.PredilatoryBalloon)*2

	if lang := utils.GetLanguage(c); lang != utils.DefaultLanguage {
		response.MiCostData = []treatmentCost{
			{Name: "1 stent", CKV: oneStent, CKVPA: oneStent + data.RotaProCost},
			{Name: "2 stents", CKV: twoStent, CKVPA: twoStent + data.RotaProCost},
			{Name: "3 stents", CKV: threeStent, CKVPA: threeStent + data.RotaProCost},
			{Name: "IVUS + 1 stent", CKV: oneStent + data.VSUZIConductor, CKVPA: oneStent + data.VSUZIConductor + data.RotaProCost},
			{Name: "IVUS + 2 stents", CKV: twoStent + data.VSUZIConductor, CKVPA: twoStent + data.VSUZIConductor + data.RotaProCost},
			{Name: "IVUS + 3 stents", CKV: threeStent + data.VSUZIConductor, CKVPA: threeStent + data.VSUZIConductor + data.RotaProCost},
			{Name: "OCT + 1 stent", CKV: oneStent + data.OKTConductor, CKVPA: oneStent + data.OKTConductor + data.RotaProCost},
			{Name: "OCT + 2 stents", CKV: twoStent + data.OKTConductor, CKVPA: twoStent + data.OKTConductor + data.RotaProCost},
			{Name: "OCT + 3 stents", CKV: threeStent + data.OKTConductor, CKVPA: threeStent + data.OKTConductor + data.RotaProCost},
		}
	} else {
		response.MiCostData = []treatmentCost{
			{Name: "с 1 стентом", CKV: oneStent, CKVPA: oneStent + data.RotaProCost},
			{Name: "с 2 стентами", CKV: twoStent, CKVPA: twoStent + data.RotaProCost},
			{Name: "с 3 стентами", CKV: threeStent, CKVPA: threeStent + data.RotaProCost},
			{Name: "ВСУЗИ с 1 стентом", CKV: oneStent + data.VSUZIConductor, CKVPA: oneStent + data.VSUZIConductor + data.RotaProCost},
			{Name: "ВСУЗИ с 2 стентами", CKV: twoStent + data.VSUZIConductor, CKVPA: twoStent + data.VSUZIConductor + data.RotaProCost},
			{Name: "ВСУЗИ с 3 стентами", CKV: threeStent + data.VSUZIConductor, CKVPA: threeStent + data.VSUZIConductor + data.RotaProCost},
			{Name: "ОКТ с 1 стентом", CKV: oneStent + data.OKTConductor, CKVPA: oneStent + data.OKTConductor + data.RotaProCost},
			{Name: "ОКТ с 2 стентами", CKV: twoStent + data.OKTConductor, CKVPA: twoStent + data.OKTConductor + data.RotaProCost},
			{Name: "ОКТ с 3 стентами", CKV: threeStent + data.OKTConductor, CKVPA: threeStent + data.OKTConductor + data.RotaProCost},
		}
	}

	response.RAWithThreeStents = int64(float64(oneStent) + float64(data.Stent+data.PredilatoryBalloon+data.PostdilatoryBalloon)*rotaProCoef + float64(data.RotaProCost))
	// отдает ответ в виде json
	// JSON serializes the given struct as JSON into the response body. It also sets the Content-Type as "application/ json".
	c.JSON(http.StatusOK, response)
}
