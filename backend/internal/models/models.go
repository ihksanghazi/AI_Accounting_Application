// go_api/internal/models/models.go

package models

import (
	"time"

	"gorm.io/gorm"
)

// User sudah ada, kita lengkapi dengan relasi ke Company
type User struct {
	gorm.Model
	Name     string   `json:"name"`
	Email    string   `gorm:"unique" json:"email"`
	Password string   `json:"-"`
	Company  *Company `gorm:"foreignKey:OwnerID" json:"company"` // Relasi: User memiliki Company
}

// Company sekarang memiliki detail lengkap
type Company struct {
	gorm.Model
	Name         string        `json:"name"`
	Address      string        `json:"address"`
	Phone        string        `json:"phone"`
	Type         string        `json:"type"`                  // JASA, DAGANG, MANUFAKTUR
	OwnerID      uint          `gorm:"unique" json:"ownerId"` // Foreign key ke User
	Accounts     []Account     `json:"accounts"`
	Transactions []Transaction `json:"transactions"`
}

// Account (Daftar Akun)
type Account struct {
	gorm.Model
	Name           string         `json:"name"`
	Code           string         `json:"code"`
	Type           string         `json:"type"` // ASET, LIABILITAS, EKUITAS, PENDAPATAN, BEBAN
	CompanyID      uint           `json:"companyId"`
	JournalEntries []JournalEntry `json:"-"` // Relasi ke Jurnal
}

// Transaction (Header dari sebuah Jurnal)
type Transaction struct {
	gorm.Model
	Date           time.Time      `json:"date"`
	Description    string         `json:"description"`
	CompanyID      uint           `json:"companyId"`
	JournalEntries []JournalEntry `json:"journalEntries"`
}

// JournalEntry (Detail Debit/Kredit dari sebuah Transaksi)
type JournalEntry struct {
	gorm.Model
	Type          string  `json:"type"` // DEBIT atau KREDIT
	Amount        float64 `json:"amount"`
	TransactionID uint    `json:"transactionId"`
	AccountID     uint    `json:"accountId"`
}
