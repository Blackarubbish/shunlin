APP_NAME=sl-blog-server

# 默认任务
all: run

run:
	go run ./main.go

build:
	go build -o $(APP_NAME) ./

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

