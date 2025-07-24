// backend/internal/handlers/company_handler.go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/ihksanghazi/AI_Accounting_Application/internal/database"
	"github.com/ihksanghazi/AI_Accounting_Application/internal/models"
	"gorm.io/gorm"
)

func GetCompany(c *gin.Context) {
	userIdStr, _ := c.Get("userId")
	ownerUUID, err := uuid.Parse(userIdStr.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	var company models.Company
	result := database.DB.Where("owner_id = ?", ownerUUID).First(&company)

	if result.Error == gorm.ErrRecordNotFound {
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
	userIdStr, _ := c.Get("userId")
	ownerUUID, err := uuid.Parse(userIdStr.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

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
		OwnerID: ownerUUID,
	}

	database.DB.Create(&company)

	c.JSON(http.StatusCreated, company)
}

func UpdateCompany(c *gin.Context) {
	userIdStr, _ := c.Get("userId")
	ownerUUID, err := uuid.Parse(userIdStr.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}

	var input CompanyInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var company models.Company
	result := database.DB.Where("owner_id = ?", ownerUUID).First(&company)
	if result.Error == gorm.ErrRecordNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "Company not found"})
		return
	}

	database.DB.Model(&company).Updates(input)
	c.JSON(http.StatusOK, company)
}
