FROM golang AS build
WORKDIR /src
ENV CGO_ENABLED=1
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o /github.com/mishaalexeev/hospitalbudget_cardio/backend .

ENTRYPOINT ["/github.com/mishaalexeev/hospitalbudget_cardio/backend"]

EXPOSE 8080