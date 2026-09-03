package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type Config struct {
	CloudGatewayURL      string `json:"cloud_gateway_url"`
	TallyHost            string `json:"tally_host"`
	TallyPort            int    `json:"tally_port"`
	PollIntervalSeconds  int    `json:"poll_interval_seconds"`
	CredentialsFile      string `json:"credentials_file"`
}

func loadConfig(path string) (*Config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var cfg Config
	if err := json.Unmarshal(data, &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

func pollCloudGateway(cfg *Config) {
	client := &http.Client{Timeout: 10 * time.Second}
	for {
		url := fmt.Sprintf("%s/api/v1/tally/sync", cfg.CloudGatewayURL)
		resp, err := client.Get(url)
		if err != nil {
			log.Printf("poll error: %v", err)
			time.Sleep(time.Duration(cfg.PollIntervalSeconds) * time.Second)
			continue
		}
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		if resp.StatusCode == 200 && len(body) > 0 {
			tallyURL := fmt.Sprintf("http://%s:%d", cfg.TallyHost, cfg.TallyPort)
			_, err = client.Post(tallyURL, "application/xml", bytes.NewReader(body))
			if err != nil {
				log.Printf("tally post error: %v", err)
			} else {
				log.Printf("Synced voucher to Tally at %s", tallyURL)
			}
		}
		time.Sleep(time.Duration(cfg.PollIntervalSeconds) * time.Second)
	}
}

func main() {
	cfg, err := loadConfig("config.json")
	if err != nil {
		log.Fatalf("config load failed: %v", err)
	}
	log.Printf("Orbit Tally Connector polling %s every %ds", cfg.CloudGatewayURL, cfg.PollIntervalSeconds)
	pollCloudGateway(cfg)
}
