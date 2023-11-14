package main

import (
	"database/sql"
	"encoding/base64"
	"fmt"
	"net/http"
	"strconv"
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
	Department  string `json:"department"`
	Priority    string `json:"priority"`
	Description string `json:"description"`
	CreatedOn   string `json:"created_on"`
	CreatedBy   string `json:"created_by"`
	IsResolved  bool   `json:"is_resolved"`
	AssignTo    string `json:"assign_to"`
	// ImageData   []byte `json:"image_data"`
	ImageData string `json:"image_data"`
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

type CreateCommentRequest struct { // here commentId is serial in db
	TicketId  int    `json:"id"` //tickets
	Comment   string `json:"comment"`
	CommentBy string `json:"comment_by"`
}

type CreateCommentResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type Comment struct {
	Comment   string `json:"comment"`
	TicketId  int    `json:"ticket_id"`
	CommentBy string `json:"comment_by"`
	CommentID int    `json:"commentid"`
}
type GetCommentsRequest struct {
	TicketId int `json:"id" form:"id" param:"id"`
}
type TicketsResponse struct {
	Id          int    `json:"id"`
	Department  string `json:"department"`
	Priority    string `json:"priority"`
	Description string `json:"description"`
	CreatedOn   string `json:"created_on"`
	CreatedBy   string `json:"created_by"`
	IsResolved  bool   `json:"is_resolved"`
	AssignTo    string `json:"assign_to"`
	ImageData   []byte `json:"image_data"`
	// ImageData string `json:"image_data"`
}

type ResolveTicketRequest struct {
	Id int `json:"id"`
}

type ResolveTicketResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}
type AdminResponse struct {
	UserEmail string `json:"user_email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
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
func CreateTicketHandler(c echo.Context) error {
	var createTicketRequest CreateTicketRequest
	if err := c.Bind(&createTicketRequest); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	imageData, err := base64.StdEncoding.DecodeString(createTicketRequest.ImageData)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid image data"})
	}

	query := `
        INSERT INTO tickets (department, priority, description, created_on, created_by, image_data, is_resolved, assign_to)
        VALUES ($1, $2, $3, $4, $5, $6, false, $7)
    `
	currentTime := time.Now().UTC()
	_, err = db.Exec(query,
		createTicketRequest.Department,
		createTicketRequest.Priority,
		createTicketRequest.Description,
		currentTime,
		createTicketRequest.CreatedBy,
		imageData,
		createTicketRequest.AssignTo,
	)
	if err != nil {
		fmt.Printf("err ----- %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create ticket"})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Ticket created successfully!",
	})
}

func GetTicketDetailsHandler(c echo.Context) error {
	ticketID, err := strconv.Atoi(c.Param("ticketId"))
	if err != nil || ticketID <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ticket ID"})
	}

	query := "SELECT * FROM tickets WHERE id = $1"
	row := db.QueryRow(query, ticketID)

	var ticket TicketsResponse
	err = row.Scan(
		&ticket.Id,
		&ticket.Department,
		&ticket.Priority,
		&ticket.Description,
		&ticket.CreatedOn,
		&ticket.CreatedBy,
		&ticket.ImageData,
		&ticket.IsResolved,
		&ticket.AssignTo,
	)

	if err == sql.ErrNoRows {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Ticket not found"})
	} else if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Internal server error"})
	}

	return c.JSON(http.StatusOK, ticket)
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
			&ticket.ImageData,
			&ticket.IsResolved,
			&ticket.AssignTo,
		)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to fetch tickets!"})
		}

		tickets = append(tickets, ticket)
	}

	return c.JSON(http.StatusOK, tickets)
}
func ResolveTicketHandler(c echo.Context) error {
	var resolveTicketRequest ResolveTicketRequest
	if err := c.Bind(&resolveTicketRequest); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	if resolveTicketRequest.Id <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ticket id"})
	}

	result, err := db.Exec(`
		UPDATE tickets
		SET is_resolved = true
		WHERE id = $1
	`, resolveTicketRequest.Id)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Server error"})
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to resolve the ticket."})
	}

	if rowsAffected > 0 {
		return c.JSON(http.StatusOK, ResolveTicketResponse{
			Success: true,
			Message: "Ticket resolved successfully!",
		})
	} else {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Ticket not found."})
	}
}
func CreateCommentHandler(c echo.Context) error {
	var createCommentRequest CreateCommentRequest
	if err := c.Bind(&createCommentRequest); err != nil {
		fmt.Println("Error binding request:", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	exists, err := isTicketExists(createCommentRequest.TicketId)
	if err != nil {
		fmt.Println("Error checking if ticket exists:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Internal server error"})
	}
	if !exists {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Ticket not found"})
	}
	_, err = db.Exec(`
		INSERT INTO comments (comment, Id, comment_by)
		VALUES ($1, $2, $3)
	`, createCommentRequest.Comment, createCommentRequest.TicketId, createCommentRequest.CommentBy)

	if err != nil {
		fmt.Println("Error inserting comment:", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to create comment"})
	}

	return c.JSON(http.StatusOK, CreateCommentResponse{
		Success: true,
		Message: "Comment created successfully",
	})
}

func isTicketExists(ticketID int) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM tickets WHERE id = $1", ticketID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func GetAdminsHandler(c echo.Context) error {
	query := "SELECT user_email, first_name, last_name FROM users WHERE is_admin = true"
	rows, err := db.Query(query)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Internal server error"})
	}
	defer rows.Close()

	var admins []AdminResponse
	for rows.Next() {
		var admin AdminResponse
		err := rows.Scan(
			&admin.UserEmail,
			&admin.FirstName,
			&admin.LastName,
		)

		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to fetch admins!"})
		}
		admins = append(admins, admin)
	}

	return c.JSON(http.StatusOK, admins)
}

func GetCommentsHandler(c echo.Context) error {
	ticketID, err := strconv.Atoi(c.Param("ticketId"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ticket id"})
	}

	// fmt.Printf("Ticket ID: %v\n", ticketID)

	if ticketID <= 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid ticket id"})
	}

	rows, err := db.Query(`
		SELECT comment, id, comment_by, commentid
		FROM comments
		WHERE id = $1
	`, ticketID)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Server error"})
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var comment Comment
		err := rows.Scan(&comment.Comment, &comment.TicketId, &comment.CommentBy, &comment.CommentID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Unable to fetch comments."})
		}
		comments = append(comments, comment)
	}

	if len(comments) > 0 {
		return c.JSON(http.StatusOK, comments)
	} else {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "No comments found for the given ticket."})
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
	e.GET("/get_ticket_details/:ticketId", GetTicketDetailsHandler)
	e.GET("/get_admins_data", GetAdminsHandler)
	e.POST("/create_ticket", CreateTicketHandler)
	e.PUT("/resolve_ticket/:id", ResolveTicketHandler)
	e.POST("/create-comment", CreateCommentHandler)
	e.GET("/get-comments/:ticketId", GetCommentsHandler)

	e.Logger.Fatal(e.Start(":8080"))
}
