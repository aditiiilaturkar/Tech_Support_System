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
