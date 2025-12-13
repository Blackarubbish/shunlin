APP_NAME=sl-blog-server

# 默认任务
all: run

run:
	go run ./cmd/server/main.go

build:
	go build -o $(APP_NAME) ./cmd/server

test:
	go test ./... -v

lint:
	golangci-lint run

tidy:
	go mod tidy

clean:
	rm -f $(APP_NAME)

docker-build:
	docker build -t $(APP_NAME):latest .

