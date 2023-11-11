package main

type User struct {
	username string `json:username`
	password string `json:password`
	isAdmin  bool   `json:isAdmin`
}

var users = map[string]User{
	"user1": {username: "user1", password: "password1", isAdmin: true},
	"user2": {username: "user2", password: "password2", isAdmin: false},
}
