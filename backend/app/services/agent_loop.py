import os
from openai import OpenAI

class ControlledAgentLoop:
    def __init__(self, max_iterations: int = 10):
        self.max_iterations = max_iterations
        self.client = OpenAI(
            base_url="https://hackathon-2026-2-resource.openai.azure.com/openai/v1/",
            api_key=os.getenv("HACKATHON_KEY")
        )
        # Standard gpt-5.5 hackathon pricing metrics (illustrative / Azure rates)
        self.input_token_cost_per_m = 15.00  # NPR
        self.output_token_cost_per_m = 60.00 # NPR
        self.total_input_tokens = 0
        self.total_output_tokens = 0

    def run_step(self, prompt: str, messages: list):
        iteration = 0
        messages.append({"role": "user", "content": prompt})

        while iteration < self.max_iterations:
            iteration += 1
            response = self.client.chat.completions.create(
                model="gpt-5.5",
                messages=messages,
                temperature=0.0  # Zero temperature for deterministic accounting parsing
            )
            
            # Update token logs
            self.total_input_tokens += response.usage.prompt_tokens
            self.total_output_tokens += response.usage.completion_tokens
            
            assistant_message = response.choices[0].message
            messages.append(assistant_message)

            if assistant_message.content and "GOAL_REACHED" in assistant_message.content:
                print(f"Goal completed in {iteration} steps.")
                break
            
            # Execute tool actions if model returned tool calls, else return final text
            # ...
            
        if iteration >= self.max_iterations:
            print("LOOP GUARD TRIGGERED: Hard ceiling of 10 loops hit. Stopping to protect quota.")
        
        # Print financial metrics of the run for Q&A slide reference [cite: 34]
        total_cost = (
            (self.total_input_tokens / 1000000) * self.input_token_cost_per_m +
            (self.total_output_tokens / 1000000) * self.output_token_cost_per_m
        )
        print(f"Run Financial Audit: Input Tokens: {self.total_input_tokens} | Output Tokens: {self.total_output_tokens} | Total Run Cost: NPR {total_cost:.4f}")
        return assistant_message.content
