FROM golang AS build
WORKDIR /src
ENV CGO_ENABLED=1
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
RUN go build -o /gitlab.com/rotapro/backend .

ENTRYPOINT ["/gitlab.com/rotapro/backend"]

EXPOSE 8080