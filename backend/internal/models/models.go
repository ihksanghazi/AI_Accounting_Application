// backend/internal/models/models.go

package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BaseModel struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key;" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (base *BaseModel) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

type User struct {
	BaseModel
	Name     string   `json:"name"`
	Email    string   `gorm:"unique" json:"email"`
	Password string   `json:"-"`
	Company  *Company `gorm:"foreignKey:OwnerID" json:"company"`
}

type Company struct {
	BaseModel
	Name         string        `json:"name"`
	Address      string        `json:"address"`
	Phone        string        `json:"phone"`
	Type         string        `json:"type"`
	OwnerID      uuid.UUID     `gorm:"type:uuid;unique" json:"ownerId"` // <-- PERBAIKAN: uint -> uuid.UUID
	Accounts     []Account     `json:"accounts"`
	Transactions []Transaction `json:"transactions"`
}

type Account struct {
	BaseModel
	Name           string         `json:"name"`
	Code           string         `json:"code"`
	Type           string         `json:"type"`
	CompanyID      uuid.UUID      `gorm:"type:uuid" json:"companyId"` // <-- PERBAIKAN: uint -> uuid.UUID
	JournalEntries []JournalEntry `json:"-"`
}

type Transaction struct {
	BaseModel
	Date           time.Time      `json:"date"`
	Description    string         `json:"description"`
	CompanyID      uuid.UUID      `gorm:"type:uuid" json:"companyId"` // <-- PERBAIKAN: uint -> uuid.UUID
	JournalEntries []JournalEntry `json:"journalEntries"`
}

type JournalEntry struct {
	BaseModel
	Type          string    `json:"type"`
	Amount        float64   `json:"amount"`
	TransactionID uuid.UUID `gorm:"type:uuid" json:"transactionId"` // <-- PERBAIKAN: uint -> uuid.UUID
	AccountID     uuid.UUID `gorm:"type:uuid" json:"accountId"`     // <-- PERBAIKAN: uint -> uuid.UUID
}
