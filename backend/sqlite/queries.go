package sqlite

// в файле хранятся различные квери которые используются для обращения в базу за данными
const createRegionCoefTable = `
	PRAGMA shrink_memory;
	PRAGMA synchronous = OFF;

	CREATE TABLE IF NOT EXISTS region_coef
	(
		id          integer not null unique,
		coef        integer not null,
		CONSTRAINT kd_PK PRIMARY KEY (id)
	);
`

const createRegionCoefTranslationTable = `
	PRAGMA shrink_memory;
	PRAGMA synchronous = OFF;

	CREATE TABLE IF NOT EXISTS region_translation
	(
		id          integer not null unique,
		region_ru   text    not null,
    	region_en   text    not null,
    	CONSTRAINT 	rt_PK PRIMARY KEY (id)
	);
`

const createMedicalSupportTable = `
	PRAGMA shrink_memory;
	PRAGMA synchronous = OFF;

	CREATE TABLE IF NOT EXISTS ht_med_sup
	(
		id           		integer not null unique,
		medical_group   	text    not null,
		medical_group_en	text    not null,
		fin_cost_std 		integer not null,
		wage_share   		integer not null,
		CONSTRAINT   		kd_PK PRIMARY KEY (id)
	);
`

const (
	GetAllRegionCoef = `SELECT
    	json_group_array(json_object(
    	        'id', rc.id,
    	        'region', CASE WHEN ? IS 'ru-RU' THEN rt.region_ru ELSE rt.region_en END,
    	        'coef', rc.coef
    	                 )) AS region_coef
		FROM
    	region_coef rc
    	    JOIN
    	region_translation rt ON rc.id = rt.id`

	GetCoefByRegion = `SELECT json_object(
               'id', rc.id,
               'region', CASE WHEN ? IS 'ru-RU' THEN rt.region_ru ELSE rt.region_en END,
               'coef', coef
        ) AS region_coef
		FROM region_coef rc
		         JOIN region_translation rt ON rc.id = rt.id
		WHERE rc.id = ?`

	UpdateRegionCoef = `UPDATE region_coef SET coef = ? WHERE region = ?`
	InsertRegionCoef = `INSERT INTO region_coef(region, coef) VALUES (?, ?)`

	GetMedicalSupport = `SELECT json_group_array(json_object(
		'id', id,
    	'medical_group', CASE WHEN ? IS 'ru-RU' THEN medical_group ELSE medical_group_en END,
		'fin_cost_std', fin_cost_std,
		'wage_share', wage_share
	)) FROM ht_med_sup`
	UpdateMedicalSupport = `UPDATE ht_med_sup SET medical_group = ?, medical_group_en = ?, fin_cost_std = ?, wage_share = ? WHERE id = ?`
	InsertMedicalSupport = `INSERT INTO ht_med_sup(medical_group, medical_group_en, fin_cost_std, wage_share) VALUES (?, ?, ?, ?)`
)

// таблица коэффициентов из экселя, нужна была для ввода значений в базу
var kdMap = map[string]float64{
	"Алтайский край":                           1.147,
	"Амурская область":                         1.397,
	"Архангельская область":                    1.57,
	"Астраханская область":                     1,
	"Белгородская область":                     1,
	"Брянская область":                         1,
	"Владимирская область":                     1,
	"Волгоградская область":                    1,
	"Вологодская область":                      1.105,
	"Воронежская область":                      1,
	"Еврейская автономная область":             1.494,
	"Забайкальский край":                       1.35,
	"Ивановская область":                       1,
	"Иркутская область":                        1.276,
	"Кабардино-Балкарская Республика":          1,
	"Калининградская область":                  1,
	"Калужская область":                        1,
	"Камчатский край":                          3.629,
	"Карачаево-Черкесская Республика":          1.017,
	"Кемеровская область":                      1.21,
	"Кировская область":                        1,
	"Костромская область":                      1,
	"Краснодарский край":                       1,
	"Красноярский край":                        1.32,
	"Курганская область":                       1.105,
	"Курская область":                          1,
	"Ленинградская область":                    1,
	"Липецкая область":                         1,
	"Магаданская область":                      3.536,
	"Москва":                                   1.715,
	"Московская область":                       1.083,
	"Мурманская область":                       1.861,
	"Ненецкий автономный округ":                3.461,
	"Нижегородская область":                    1.004,
	"Новгородская область":                     1.007,
	"Новосибирская область":                    1.14,
	"Омская область":                           1.105,
	"Оренбургская область":                     1.105,
	"Орловская область":                        1,
	"Пензенская область":                       1.007,
	"Пермский край":                            1.104,
	"Приморский край":                          1.38,
	"Псковская область":                        1,
	"Республика Адыгея":                        1,
	"Республика Алтай":                         1.661,
	"Республика Башкортостан":                  1.105,
	"Республика Бурятия":                       1.35,
	"Республика Дагестан":                      1.006,
	"Республика Ингушетия":                     1,
	"Республика Калмыкия":                      1.049,
	"Республика Карелия":                       1.519,
	"Республика Коми":                          1.7,
	"Республика Крым":                          1,
	"Республика Марий Эл":                      1,
	"Республика Мордовия":                      1,
	"Республика Саха (Якутия)":                 3.079,
	"Республика Северная Осетия-Алания":        1.019,
	"Республика Татарстан":                     1,
	"Республика Тыва":                          1.712,
	"Республика Хакасия":                       1.42,
	"Российская Федерация":                     1,
	"Ростовская область":                       1.001,
	"Рязанская область":                        1,
	"Самарская область":                        1,
	"Санкт-Петербург":                          1.232,
	"Саратовская область":                      1.001,
	"Сахалинская область":                      1.788,
	"Свердловская область":                     1.105,
	"Севастополь":                              1,
	"Смоленская область":                       1,
	"Ставропольский край":                      1.003000278,
	"Тамбовская область":                       1,
	"Тверская область":                         1,
	"Томская область":                          1.278,
	"Тульская область":                         1,
	"Тюменская область":                        1.105,
	"Удмуртская Республика":                    1.105,
	"Ульяновская область":                      1,
	"Хабаровский край":                         1.4,
	"Ханты-Мансийский автономный округ - Югра": 1.755,
	"Челябинская область":                      1.105,
	"Чеченская Республика":                     1,
	"Чувашская Республика":                     1,
	"Чукотский автономный округ":               4.05,
	"Ямало-Ненецкий автономный округ":          2.446,
	"Ярославская область":                      1,
}
