package database

import (
	"fmt"
	"log"
	"os"

	"github.com/ihksanghazi/AI_Accounting_Application/internal/models" // <-- Pastikan path ini benar
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := fmt.Sprintf("host=db user=%s password=%s dbname=%s port=5432 sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"),
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// --- PERBAIKAN DI SINI ---
	// Tambahkan pengecekan error pada AutoMigrate
	err = DB.AutoMigrate(
		&models.User{},
		&models.Company{},
		&models.Account{},
		&models.Transaction{},
		&models.JournalEntry{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database: ", err)
	}
	// -------------------------

	log.Println("Database connected and migrated successfully")
}
