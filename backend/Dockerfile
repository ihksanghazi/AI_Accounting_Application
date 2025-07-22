# Stage 1: Build
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /main ./cmd

# Stage 2: Deploy
FROM alpine:latest
WORKDIR /
COPY --from=builder /main /main
EXPOSE 8081
CMD ["/main"]