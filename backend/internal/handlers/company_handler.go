package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ihksanghazi/AI_Accounting_Application/internal/database"
	"github.com/ihksanghazi/AI_Accounting_Application/internal/models"
)

func GetCompany(c *gin.Context) {
	userId, _ := c.Get("userId")

	var company models.Company
	// Konversi userId (interface{}) ke uint
	result := database.DB.Where("owner_id = ?", uint(userId.(float64))).First(&company)

	if result.Error != nil {
		// Tidak masalah jika tidak ditemukan, kembalikan null (bukan error)
		c.JSON(http.StatusOK, nil)
		return
	}
	c.JSON(http.StatusOK, company)
}

type CompanyInput struct {
	Name    string `json:"name" binding:"required"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
	Type    string `json:"type" binding:"required"`
}

func CreateCompany(c *gin.Context) {
	userId, _ := c.Get("userId")
	var input CompanyInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	company := models.Company{
		Name:    input.Name,
		Address: input.Address,
		Phone:   input.Phone,
		Type:    input.Type,
		OwnerID: uint(userId.(float64)),
	}
	database.DB.Create(&company)
	c.JSON(http.StatusCreated, company)
}

func UpdateCompany(c *gin.Context) {
	userId, _ := c.Get("userId")
	var input CompanyInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var company models.Company
	database.DB.Where("owner_id = ?", uint(userId.(float64))).First(&company)
	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Company not found"})
		return
	}

	database.DB.Model(&company).Updates(input)
	c.JSON(http.StatusOK, company)
}
