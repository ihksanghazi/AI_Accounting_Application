package main

import (
	"log"

	"github.com/ihksanghazi/AI_Accounting_Application/internal/database"
	"github.com/ihksanghazi/AI_Accounting_Application/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Di development, kita muat .env. Untuk produksi, env vars disuntik oleh Docker.
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	database.Connect()

	r := gin.Default()

	// Tambahkan CORS Middleware di sini nanti
	// r.Use(cors.Default())

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}
	}

	r.Run(":8081") // Jalankan di port 8081
}
