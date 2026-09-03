import pytest
from unittest.mock import MagicMock, patch, call

from app.services.agent_loop import ControlledAgentLoop

def make_mock_response(prompt_tokens, completion_tokens, content, tool_calls=None):
    mock_resp = MagicMock()
    mock_resp.usage.prompt_tokens = prompt_tokens
    mock_resp.usage.completion_tokens = completion_tokens
    mock_choice = MagicMock()
    mock_choice.message.content = content
    mock_choice.message.tool_calls = tool_calls
    # OpenAI SDK: response.choices[0].message
    mock_resp.choices = [mock_choice]
    # Also support .message attribute for compatibility
    mock_resp.choices[0].message = mock_choice.message
    return mock_resp

def test_goal_reached_early_stops_before_max():
    with patch("app.services.agent_loop.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        MockOpenAI.return_value = mock_client
        # First response not goal, second is goal
        mock_client.chat.completions.create.side_effect = [
            make_mock_response(100, 50, "Thinking..."),
            make_mock_response(100, 50, "GOAL_REACHED: Tally XML generated"),
        ]
        loop = ControlledAgentLoop(max_iterations=10)
        messages = []
        result = loop.run_step("Generate Tally XML", messages)
        assert "GOAL_REACHED" in result
        assert mock_client.chat.completions.create.call_count == 2
        assert loop.total_input_tokens == 200
        assert loop.total_output_tokens == 100

def test_loop_guard_hard_ceiling_10():
    with patch("app.services.agent_loop.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        MockOpenAI.return_value = mock_client
        # Always return non-goal to force loop to max
        mock_client.chat.completions.create.return_value = make_mock_response(10, 20, "Still working...")
        loop = ControlledAgentLoop(max_iterations=10)
        messages = []
        with patch("builtins.print") as mock_print:
            result = loop.run_step("Infinite correction loop", messages)
            # Should have hit guard message
            guard_calls = [str(c) for c in mock_print.call_args_list]
            assert any("LOOP GUARD TRIGGERED" in str(c) for c in guard_calls)
        assert mock_client.chat.completions.create.call_count == 10
        assert loop.total_input_tokens == 100
        assert loop.total_output_tokens == 200
        assert result == "Still working..."

def test_token_cost_calculation_and_audit_print():
    with patch("app.services.agent_loop.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        MockOpenAI.return_value = mock_client
        mock_client.chat.completions.create.return_value = make_mock_response(500000, 250000, "GOAL_REACHED")
        loop = ControlledAgentLoop(max_iterations=10)
        # Pricing: 15 NPR / 1M input, 60 NPR / 1M output
        # Expected: 500k*15/1M=7.5, 250k*60/1M=15.0 => total 22.5
        with patch("builtins.print") as mock_print:
            loop.run_step("Cost test", [])
            audit_call = [c for c in mock_print.call_args_list if "Run Financial Audit" in str(c)]
            assert len(audit_call) == 1
            audit_text = str(audit_call[0])
            assert "Input Tokens: 500000" in audit_text
            assert "Output Tokens: 250000" in audit_text
            assert "NPR 22.5000" in audit_text

def test_custom_max_iterations():
    with patch("app.services.agent_loop.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        MockOpenAI.return_value = mock_client
        mock_client.chat.completions.create.return_value = make_mock_response(5, 5, "no goal")
        loop = ControlledAgentLoop(max_iterations=3)
        loop.run_step("test", [])
        assert mock_client.chat.completions.create.call_count == 3

def test_temperature_zero_deterministic():
    with patch("app.services.agent_loop.OpenAI") as MockOpenAI:
        mock_client = MagicMock()
        MockOpenAI.return_value = mock_client
        mock_client.chat.completions.create.return_value = make_mock_response(1, 1, "GOAL_REACHED")
        loop = ControlledAgentLoop()
        loop.run_step("deterministic check", [])
        kwargs = mock_client.chat.completions.create.call_args[1]
        assert kwargs["temperature"] == 0.0
        assert kwargs["model"] == "gpt-5.5"
