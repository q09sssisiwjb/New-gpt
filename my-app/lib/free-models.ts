export interface FreeModel {
  id: string;
  name: string;
  parameters: string;
  contextLength: string;
  description: string;
}

export const FREE_MODELS: FreeModel[] = [
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    parameters: "671B (37B active)",
    contextLength: "~128K",
    description: "Reasoning, complex tasks, on par with OpenAI o1"
  },
  {
    id: "deepseek/deepseek-r1-distill-llama-70b:free",
    name: "DeepSeek R1 Distill Llama 70B",
    parameters: "70B",
    contextLength: "~128K",
    description: "General reasoning, instruction following"
  },
  {
    id: "deepseek/deepseek-v3:free",
    name: "DeepSeek V3",
    parameters: "~671B",
    contextLength: "~128K",
    description: "General purpose, chat, coding"
  },
  {
    id: "venice/uncensored:free",
    name: "Venice Uncensored",
    parameters: "24B",
    contextLength: "~32K",
    description: "Uncensored instruct model, advanced use cases"
  },
  {
    id: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick",
    parameters: "400B total (17B active)",
    contextLength: "256K",
    description: "Multimodal (text + image), sparse MoE"
  },
  {
    id: "kimi/kimi-vl-a3b-thinking:free",
    name: "Kimi VL A3B Thinking",
    parameters: "16B (2.8B active)",
    contextLength: "131K",
    description: "Visual reasoning, image understanding"
  },
  {
    id: "mistral/mistral-small-3.1:free",
    name: "Mistral Small 3.1",
    parameters: "24B",
    contextLength: "96K",
    description: "Multimodal, function calling, JSON output"
  },
  {
    id: "nvidia/llama-3.1-nemotron-8b:free",
    name: "NVIDIA Llama 3.1 Nemotron",
    parameters: "8B",
    contextLength: "8K",
    description: "Coding, NVIDIA-optimized inference"
  }
];
