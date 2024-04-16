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

	response := miCostResponse{
		RotaPro: data.RotaProCost,
	}
	oneStent := data.Stent +
		data.Introducer +
		data.DiagnosticCatheter +
		data.GuideCatheter +
		data.Guide +
		data.PredilatoryBalloon +
		data.PostdilatoryBalloon
	twoStent := oneStent + data.Stent + data.PredilatoryBalloon + data.PostdilatoryBalloon
	threeStent := oneStent + (data.Stent+data.PostdilatoryBalloon+data.PredilatoryBalloon)*2

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
	response.RAWithThreeStents = int64(float64(oneStent) + float64(data.Stent+data.PredilatoryBalloon+data.PostdilatoryBalloon)*rotaProCoef + float64(data.RotaProCost))
	c.JSON(http.StatusOK, response)
}
