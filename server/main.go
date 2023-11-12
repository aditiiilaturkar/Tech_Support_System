package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "postgres"
	dbname   = "it_support"
)

var db *sql.DB

func checkError(err error) {
	if err != nil {
		panic(err)
	}
}

func init() {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	var err error
	db, err = sql.Open("postgres", psqlInfo)
	checkError(err)

	err = db.Ping()
	checkError(err)
	fmt.Println("Successfully connected!")
}

type LoginRequest struct {
	UserEmail string `json:"user_email"`
	Password  string `json:"password"`
}

type CreateTicketRequest struct {
	Department  string         `json:"department"`
	Priority    string         `json:"priority"`
	Description string         `json:"description"`
	CreatedOn   string         `json:"created_on"`
	CreatedBy   string         `json:"created_by"`
	ResolvedBy  sql.NullString `json:"resolved_by"`
	ImageData   []byte         `json:"image_data"`
}

type CreateTicketResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
type LoginResponse struct {
	IsAuthenticated bool   `json:"isAuthenticated"`
	IsAdmin         bool   `json:"isAdmin"`
	UserEmail       string `json:"user_email"`
	FirstName       string `json:"first_name"`
	LastName        string `json:"last_name"`
}
type UserDetails struct {
	UserEmail string `json:"user_email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	IsAdmin   bool   `json:"is_admin"`
}

type TicketsResponse struct {
	Id          int            `json:"id"`
	Department  string         `json:"department"`
	Priority    string         `json:"priority"`
	Description string         `json:"description"`
	CreatedOn   string         `json:"created_on"`
	CreatedBy   string         `json:"created_by"`
	ResolvedBy  sql.NullString `json:"resolved_by"`
	ImageData   []byte         `json:"image_data"`
}
type ResolveTicketRequest struct {
	Id         int    `json:"id"`
	ResolvedBy string `json:"resolved_by"`
}

type ResolveTicketResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func LoginHandler(c echo.Context) error {
	var loginRequest LoginRequest
	err := c.Bind(&loginRequest)
	// fmt.Println("i reached here ")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	// Query to check user credentials
	query := "SELECT COUNT(*) FROM USERS WHERE user_email = $1 AND password = $2"
	var count int
	err = db.QueryRow(query, loginRequest.UserEmail, loginRequest.Password).Scan(&count)
	if err != nil {
		fmt.Println("Error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Internal server error"})
	}

	// fmt.Println("Login Request:")
	// fmt.Printf("user_email: %s\n", loginRequest.UserEmail)
	// fmt.Printf("password: %s\n", loginRequest.Password)

	//Query to get user details:
	getUserDetailsQuery := "SELECT user_email, first_name, last_name, is_admin FROM users WHERE user_email = $1 AND password = $2"
	var userDetails UserDetails

	err = db.QueryRow(getUserDetailsQuery, loginRequest.UserEmail, loginRequest.Password).
		Scan(&userDetails.UserEmail, &userDetails.FirstName, &userDetails.LastName, &userDetails.IsAdmin)
	if err != nil {
		fmt.Println("Error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Invalid Credentials"})
	}

	c.Response().Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	// fmt.Println("At least i reached here %v", count)

	response := LoginResponse{
		IsAuthenticated: count == 1,
		IsAdmin:         userDetails.IsAdmin,
		UserEmail:       userDetails.UserEmail,
		FirstName:       userDetails.FirstName,
		LastName:        userDetails.LastName,
	}

	return c.JSON(http.StatusOK, response)
}

func GetTicketsHandler(c echo.Context) error {
	query := "SELECT * FROM tickets"
	rows, err := db.Query(query)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Internal server error"})
	}
	defer rows.Close()
	var tickets []TicketsResponse
	for rows.Next() {
		var ticket TicketsResponse
		err := rows.Scan(
			&ticket.Id,
			&ticket.Department,
			&ticket.Priority,
			&ticket.Description,
			&ticket.CreatedOn,
			&ticket.CreatedBy,
			&ticket.ResolvedBy,
			&ticket.ImageData,
		)

		if err != nil {
			// fmt.Println("\n error prints %v ", err)
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to fetch tickets!"})
		}
		tickets = append(tickets, ticket)

	}
	return c.JSON(http.StatusOK, tickets)
}

func CreateTicketHandler(c echo.Context) error {
	var createTicketRequest CreateTicketRequest
	err := c.Bind(&createTicketRequest)
	if err != nil {
		// fmt.Println("\n hiiii %v ", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}
	query := `
		INSERT INTO tickets (
			department,
			priority,
			description,
			created_on,
			created_by,
			resolved_by,
			image_data
		) VALUES (
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7
		)
	`
	createTicketRequest.CreatedOn = time.Now().Format("2006-01-02 15:04:05")

	_, err = db.Exec(query, createTicketRequest.Department, createTicketRequest.Priority, createTicketRequest.Description,
		createTicketRequest.CreatedOn, createTicketRequest.CreatedBy, createTicketRequest.ResolvedBy, createTicketRequest.ImageData)

	if err != nil {
		// fmt.Println("Error:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to create ticket!"})
	}
	// fmt.Printf("Received Request: %+v\n", createTicketRequest)

	return c.JSON(http.StatusOK, CreateTicketResponse{
		Success: true,
		Message: "Ticket created successfully!",
	})
}

func ResolveTicketHandler(c echo.Context) error {
	var resolveTicketRequest ResolveTicketRequest
	err := c.Bind(&resolveTicketRequest)
	if err != nil {
		// fmt.Println("\n hiiii %v ", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}
	if resolveTicketRequest.Id <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ticket id"})
	}
	result, err := db.Exec(`
		UPDATE tickets
		SET resolved_by = $1
		WHERE id = $2
	`, resolveTicketRequest.ResolvedBy, resolveTicketRequest.Id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Server error"})

	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Unable to resolve the ticket."})
	}
	if rowsAffected > 0 {
		return c.JSON(http.StatusOK, ResolveTicketResponse{
			Success: true,
			Message: "Ticket resolved successfully!",
		})
	} else {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Ticket not found."})
	}
}

func main() {
	e := echo.New()
	e.Use(middleware.CORS())
	// Routes
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World! 123")
	})

	config := middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete},
	}
	e.Use(middleware.CORSWithConfig(config))

	e.POST("/login", LoginHandler)
	e.GET("/get_tickets", GetTicketsHandler)
	e.POST("/create_ticket", CreateTicketHandler)
	e.PUT("/resolve_ticket", ResolveTicketHandler)
	e.Logger.Fatal(e.Start(":8080"))
}
