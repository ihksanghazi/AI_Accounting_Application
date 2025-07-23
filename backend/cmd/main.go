package main

import (
	"log"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ihksanghazi/AI_Accounting_Application/internal/database"
	"github.com/ihksanghazi/AI_Accounting_Application/internal/handlers"
	"github.com/ihksanghazi/AI_Accounting_Application/internal/middleware"
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

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/companies", handlers.GetCompany)
			protected.POST("/companies", handlers.CreateCompany)
			protected.PUT("/companies", handlers.UpdateCompany)
		}
	}

	r.Run(":8081") // Jalankan di port 8081
}
