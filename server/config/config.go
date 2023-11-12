package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type Cat struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

func firstFun(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World! 123")
}
func getCats(c echo.Context) error {
	catName := c.QueryParam("name")
	catType := c.QueryParam("type")
	dataType := c.Param("data")
	if dataType == "string" {
		return c.String(http.StatusOK, fmt.Sprintf("Your cat name is : %s \n and his type is: %s", catName, catType))
	}
	if dataType == "json" {
		return c.JSON(http.StatusOK, map[string]string{
			"name": catName,
			"type": catType,
		})
	}
	return c.JSON(http.StatusBadRequest, map[string]string{
		"error": "Let us know if you want json or string",
	})
}

func addCat(c echo.Context) error {
	cat := Cat{}
	defer c.Request().Body.Close()

	b, err := io.ReadAll(c.Request().Body)
	if err != nil {
		log.Printf("Failed reading request", err)
		return c.String(http.StatusInternalServerError, "")
	}
	err = json.Unmarshal(b, &cat)
	if err != nil {
		log.Printf("Failed Unmarshal request", err)
		return c.String(http.StatusInternalServerError, "")
	}
	log.Printf(" this is your cat %#v", cat)
	return c.String(http.StatusOK, "We got the cat!")
}

func main() {
	e := echo.New()
	e.GET("/", firstFun)
	e.GET("/cats/:data", getCats)
	e.GET("/cats", addCat)
	e.Logger.Fatal(e.Start(":8080"))
}

// package main

// import (
// 	"database/sql"
// 	"fmt"

// 	_ "github.com/lib/pq"
// )

// const (
// 	host     = "localhost"
// 	port     = 5432
// 	user     = "postgres"
// 	password = "postgres"
// 	dbname   = "it_support"
// )

// func checkError(err error) {
// 	if err != nil {
// 		panic(err)
// 	}
// }

// // query rows from a table
// var (
// 	emp_id     int
// 	first_name string
// 	last_name  string
// 	gender     string
// 	birthdate  string
// 	email      string
// 	salary     int
// )

// func main() {
// 	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
// 		"password=%s dbname=%s sslmode=disable",
// 		host, port, user, password, dbname)

// 	db, err := sql.Open("postgres", psqlInfo)
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer db.Close()

// 	err = db.Ping()
// 	if err != nil {
// 		panic(err)
// 	}

// 	selectallstmt := `select * from employee`
// 	rows, e := db.Query(selectallstmt)
// 	checkError(e)

// 	defer rows.Close()
// 	for rows.Next() {
// 		err := rows.Scan(&emp_id, &first_name, &last_name, &gender, &birthdate, &email, &salary)
// 		if err != nil {
// 			panic(err)
// 		}
// 		fmt.Println("\n", emp_id, first_name, last_name, gender, birthdate, email, salary)
// 	}
// 	// fmt.Print(rows)
// 	fmt.Println("Successfully connected!")
// }

// // CREATE TABLE users (
// //     username  VARCHAR(100) UNIQUE PRIMARY KEY,
// //     first_name VARCHAR(50) NOT NULL,
// //     last_name VARCHAR(50) NOT NULL,
// //     is_admin BOOLEAN NOT NULL DEFAULT FALSE
// // );
// // main.go
// // server/config/main.go
// // server/config/main.go

// // package config

// // import (
// // 	"database/sql"
// // 	"fmt"

// // 	_ "github.com/lib/pq"
// // )

// // const (
// // 	host     = "localhost"
// // 	port     = 5432
// // 	user     = "postgres"
// // 	password = "postgres"
// // 	dbname   = "it_support"
// // )

// // var DB *sql.DB

// // func init() {
// // 	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
// // 		"password=%s dbname=%s sslmode=disable",
// // 		host, port, user, password, dbname)

// // 	var err error
// // 	DB, err = sql.Open("postgres", psqlInfo)
// // 	if err != nil {
// // 		panic(err)
// // 	}

// // 	err = DB.Ping()
// // 	if err != nil {
// // 		panic(err)
// // 	}
// // }
