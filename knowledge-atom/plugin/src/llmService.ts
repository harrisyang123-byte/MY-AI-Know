import { requestUrl, RequestUrlParam, App, Vault } from "obsidian";

export interface LLMConfig {
	apiBase: string;
	apiKey: string;
	model: string;
	maxTokens: number;
	temperature: number;
}

export interface LLMMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface LLMLogEntry {
	timestamp: string;
	direction: "request" | "response" | "error";
	url: string;
	model: string;
	jsonMode: boolean;
	summary: string;
	detail: string;
}

const MAX_LOG_ENTRIES = 100;

export class LLMService {
	// LLM 配置
	private config: LLMConfig;
	// 日志条目数组
	private logs: LLMLogEntry[] = [];
	// 日志监听器列表
	private logListeners: Array<(entry: LLMLogEntry) => void> = [];
	// Obsidian App 实例
	private app?: App;
	// Obsidian Vault 实例
	private vault?: Vault;
	// 日志文件路径
	private static readonly LOG_FILE_PATH = ".knowledge-atom/llm-logs.txt";

	constructor(config: LLMConfig, app?: App) {
		this.config = config;
		this.app = app;
		this.vault = app?.vault;
	}

	updateConfig(config: LLMConfig): void {
		this.config = config;
	}

	getConfig(): LLMConfig {
		return { ...this.config };
	}

	onLog(listener: (entry: LLMLogEntry) => void): () => void {
		this.logListeners.push(listener);
		return () => {
			this.logListeners = this.logListeners.filter((l) => l !== listener);
		};
	}

	getLogs(): LLMLogEntry[] {
		return [...this.logs];
	}

	clearLogs(): void {
		this.logs = [];
	}

	private async persistLog(entry: LLMLogEntry): Promise<void> {
		if (!this.vault) return;

		try {
			const logLine = `[${entry.timestamp}] [${entry.direction.toUpperCase()}] ${entry.summary}\n${entry.detail}\n\n---\n\n`;
			const dir = LLMService.LOG_FILE_PATH.substring(0, LLMService.LOG_FILE_PATH.lastIndexOf("/"));
			
			if (!(await this.vault.adapter.exists(dir))) {
				await this.vault.adapter.mkdir(dir);
			}

			let allLogs: string[] = [];
			
			// 读取现有日志
			if (await this.vault.adapter.exists(LLMService.LOG_FILE_PATH)) {
				const currentContent = await this.vault.adapter.read(LLMService.LOG_FILE_PATH);
				// 按 "---" 分割日志条目
				allLogs = currentContent.split("---")
					.map(log => log.trim())
					.filter(log => log.length > 0)
					.map(log => log + "\n\n---\n\n");
			}

			// 添加新日志
			allLogs.push(logLine);

			// 保留最近的5次对话（每次对话通常是 REQUEST + RESPONSE/ERROR，即2条日志）
			// 所以保留10条日志条目
			const maxEntries = 10;
			if (allLogs.length > maxEntries) {
				allLogs = allLogs.slice(allLogs.length - maxEntries);
			}

			// 写入日志文件
			await this.vault.adapter.write(LLMService.LOG_FILE_PATH, allLogs.join(""));
		} catch (e) {
			console.error("Failed to persist LLM log:", e);
		}
	}

	private addLog(entry: LLMLogEntry): void {
		this.logs.push(entry);
		if (this.logs.length > MAX_LOG_ENTRIES) {
			this.logs.shift();
		}
		for (const listener of this.logListeners) {
			try {
				listener(entry);
			} catch {}
		}
		this.persistLog(entry);
	}

	private logRequest(url: string, model: string, jsonMode: boolean, body: string, messages: LLMMessage[]): void {
		const msgSummary = messages.map((m) => `${m.role}: ${m.content.substring(0, 80)}...`).join("\n");
		this.addLog({
			timestamp: new Date().toISOString(),
			direction: "request",
			url,
			model,
			jsonMode,
			summary: `${model} | jsonMode=${jsonMode} | ${messages.length}条消息`,
			detail: `=== 完整请求 ===\nURL: ${url}\nModel: ${model}\njsonMode: ${jsonMode}\nmax_tokens: ${this.config.maxTokens}\n\n完整请求体:\n${body}\n\n消息摘要:\n${msgSummary}`,
		});
	}

	private logResponse(url: string, model: string, rawResponse: string, duration: number): void {
		this.addLog({
			timestamp: new Date().toISOString(),
			direction: "response",
			url,
			model,
			jsonMode: false,
			summary: `${model} | ${duration}ms | ${rawResponse.length}字符`,
			detail: `=== 完整响应 ===\n耗时: ${duration}ms\n\n原始响应 (完整):\n${rawResponse}`,
		});
	}

	private logError(url: string, model: string, error: unknown, duration: number, extraInfo?: string): void {
		const errMsg = error instanceof Error ? error.message : String(error);
		this.addLog({
			timestamp: new Date().toISOString(),
			direction: "error",
			url,
			model,
			jsonMode: false,
			summary: `${model} | ${duration}ms | 失败`,
			detail: `=== 错误详情 ===\n耗时: ${duration}ms\n\n错误信息: ${errMsg}\n\n堆栈: ${error instanceof Error ? error.stack : "无堆栈"}\n${extraInfo ? `\n额外信息: ${extraInfo}` : ""}`,
		});
	}

	async chat(messages: LLMMessage[], jsonMode = false): Promise<string> {
		const isReasoner = this.isReasonerModel();
		const isGemini = this.isGeminiModel();

		this.logRequest("(determined by model)", this.config.model, jsonMode, "(building request)", messages);
		const startTime = Date.now();

		let rawResponse: string;
		let content: string;

		if (isGemini) {
			// Gemini 原生 API
			const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent`;
			
			// 转换消息格式
			const contents = messages.map(m => ({
				role: m.role === "assistant" ? "model" : "user",
				parts: [{ text: m.content }]
			}));
			
			const bodyObj = {
				contents,
				generationConfig: {
					maxOutputTokens: this.config.maxTokens,
					temperature: this.config.temperature,
					responseMimeType: jsonMode ? "application/json" : undefined
				}
			};
			
			const body = JSON.stringify(bodyObj, null, 2);
			
			const params: RequestUrlParam = {
				url,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-goog-api-key": this.config.apiKey,
				},
				body,
			};

			try {
				const response = await requestUrl(params);
				rawResponse = response.text;
				const data = response.json as Record<string, unknown>;
				
				// 解析 Gemini 响应
				const candidates = data.candidates;
				if (!Array.isArray(candidates) || candidates.length === 0) {
					throw new Error(`Gemini 返回空响应。原始响应: ${rawResponse.substring(0, 1000)}`);
				}
				
				const candidate = candidates[0] as Record<string, unknown>;
				const contentPart = candidate.content as Record<string, unknown>;
				const parts = contentPart.parts as Array<Record<string, unknown>>;
				
				if (!parts || parts.length === 0) {
					throw new Error(`Gemini 返回空内容。原始响应: ${rawResponse.substring(0, 1000)}`);
				}
				
				content = parts[0].text as string;
				
			} catch (error) {
				this.logError(url, this.config.model, error, Date.now() - startTime);
				throw error;
			}
			
		} else {
			// OpenAI 兼容 API
			const bodyObj: Record<string, unknown> = {
				model: this.config.model,
				messages,
				temperature: this.config.temperature,
			};

			// DeepSeek Reasoner 模型使用 max_completion_tokens
			if (isReasoner) {
				bodyObj.max_completion_tokens = this.config.maxTokens;
			} else {
				bodyObj.max_tokens = this.config.maxTokens;
			}

			if (jsonMode && !isReasoner) {
				bodyObj.response_format = { type: "json_object" };
			}

			const body = JSON.stringify(bodyObj, null, 2);
			const url = `${this.config.apiBase}/chat/completions`;

			const params: RequestUrlParam = {
				url,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.config.apiKey}`,
				},
				body,
			};

			let data: unknown;
			try {
				const response = await requestUrl(params);
				rawResponse = response.text;
				data = response.json;
			} catch (error) {
				this.logError(url, this.config.model, error, Date.now() - startTime);
				throw error;
			}

			if (!data || typeof data !== "object") {
				this.logResponse(url, this.config.model, rawResponse, Date.now() - startTime);
				const emptyErr = new Error(`LLM 返回无效响应。响应类型: ${typeof data}`);
				this.logError(url, this.config.model, emptyErr, Date.now() - startTime, `原始响应: ${rawResponse}`);
				throw emptyErr;
			}

			const dataObj = data as Record<string, unknown>;
			const choices = dataObj.choices;

			if (!Array.isArray(choices) || choices.length === 0) {
				this.logResponse(url, this.config.model, rawResponse, Date.now() - startTime);
				const emptyErr = new Error(`LLM 返回空响应。完整响应: ${rawResponse.substring(0, 1000)}`);
				this.logError(url, this.config.model, emptyErr, Date.now() - startTime);
				throw emptyErr;
			}

			const choice = choices[0] as Record<string, unknown>;
			const message = (choice.message || {}) as Record<string, unknown>;
			let contentVal: string | unknown = message.content;
			const reasoningContent = message.reasoning_content;

			// 对于推理模型，如果 content 为空但有 reasoning_content，尝试从 reasoning_content 中提取 JSON
			if (isReasoner) {
				if ((!contentVal || (typeof contentVal === "string" && contentVal.trim() === "")) && reasoningContent) {
					contentVal = reasoningContent;
				}
			} else {
				// 对于非推理模型，如果 content 为空但有 reasoning_content，使用 reasoning_content
				if ((!contentVal || (typeof contentVal === "string" && contentVal.trim() === "")) && reasoningContent) {
					contentVal = reasoningContent;
				}
			}

			if (!contentVal || (typeof contentVal === "string" && contentVal.trim() === "")) {
				this.logResponse(url, this.config.model, rawResponse, Date.now() - startTime);
				const finishReason = choice.finish_reason || "unknown";
				const detail = `finish_reason: ${finishReason}\nmessage keys: ${Object.keys(message).join(", ")}\n完整 message: ${JSON.stringify(message).substring(0, 500)}`;
				const emptyErr = new Error(
					`LLM 返回空内容 (finish_reason: ${finishReason})。模型: ${this.config.model}。${detail}`
				);
				this.logError(url, this.config.model, emptyErr, Date.now() - startTime);
				throw emptyErr;
			}

			if (typeof contentVal !== "string") {
				contentVal = JSON.stringify(contentVal);
			}
			
			content = String(contentVal);
		}

		this.logResponse("(success)", this.config.model, rawResponse, Date.now() - startTime);

		return content.trim();
	}

	private isGeminiModel(): boolean {
		const model = this.config.model.toLowerCase();
		return model.includes("gemini");
	}

	private isReasonerModel(): boolean {
		const model = this.config.model.toLowerCase();
		return model.includes("reasoner") || model.includes("r1") || model.includes("o1") || model.includes("o3");
	}

	async chatWithTimeout(messages: LLMMessage[], timeoutMs?: number, jsonMode = false): Promise<string> {
		// 所有模型统一使用5分钟超时时间
		const actualTimeout = timeoutMs || 300000;
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error(`LLM 请求超时 (${actualTimeout}ms)。模型: ${this.config.model}`)), actualTimeout);
		});
		return Promise.race([this.chat(messages, jsonMode), timeoutPromise]);
	}

	async chatJSON<T>(messages: LLMMessage[], timeoutMs?: number): Promise<T> {
		const useJsonMode = !this.isReasonerModel();
		// 所有模型统一使用5分钟超时时间
		const actualTimeout = timeoutMs || 300000;
		let raw = "";

		try {
			raw = await this.chatWithTimeout(messages, actualTimeout, useJsonMode);
		} catch (e) {
			if (useJsonMode) {
				try {
					raw = await this.chatWithTimeout(messages, actualTimeout, false);
				} catch (e2) {
					const err1 = e instanceof Error ? e.message : String(e);
					const err2 = e2 instanceof Error ? e2.message : String(e2);
					throw new Error(`LLM 请求失败（两种模式均失败）。\njson_mode: ${err1}\n普通模式: ${err2}`);
				}
			} else {
				throw e;
			}
		}

		if (!raw || raw.trim().length === 0) {
			throw new Error(`LLM 返回了空字符串。模型: ${this.config.model}，max_tokens: ${this.config.maxTokens}。`);
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(raw.trim());
		} catch {
			try {
				const cleaned = this.extractJSON(raw);
				parsed = JSON.parse(cleaned);
			} catch {
				throw new Error(
					`无法解析 LLM 返回的 JSON。模型: ${this.config.model}\n原始响应 (前2000字): ${raw.substring(0, 2000)}`
				);
			}
		}

		parsed = this.unwrapResult(parsed);
		return parsed as T;
	}

	private unwrapResult(obj: unknown): unknown {
		if (typeof obj !== "object" || obj === null) return obj;

		const record = obj as Record<string, unknown>;
		const knownKeys = ["concepts", "relations", "tags", "summary", "links"];

		for (const key of knownKeys) {
			if (key in record) return obj;
		}

		for (const value of Object.values(record)) {
			if (typeof value === "object" && value !== null && !Array.isArray(value)) {
				const inner = value as Record<string, unknown>;
				for (const key of knownKeys) {
					if (key in inner) return inner;
				}
			}
		}

		return obj;
	}

	private extractJSON(text: string): string {
		let s = text;

		// 尝试从代码块中提取 JSON
		const codeBlockMatch = s.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
		if (codeBlockMatch) {
			s = codeBlockMatch[1].trim();
		}

		// 查找所有可能的 JSON 开头位置
		const bracePositions: number[] = [];
		const bracketPositions: number[] = [];
		
		for (let i = 0; i < s.length; i++) {
			if (s[i] === "{") {
				bracePositions.push(i);
			} else if (s[i] === "[") {
				bracketPositions.push(i);
			}
		}

		// 如果没有找到任何 JSON 结构，直接返回
		if (bracePositions.length === 0 && bracketPositions.length === 0) {
			return s.trim();
		}

		// 尝试从最后一个可能的 JSON 开头开始查找（推理模型可能在前面有思考内容，最后才输出 JSON）
		const allPositions = [...bracePositions, ...bracketPositions].sort((a, b) => a - b);
		
		// 从后往前尝试，找到第一个有效的 JSON
		for (let i = allPositions.length - 1; i >= 0; i--) {
			const start = allPositions[i];
			const openChar = s[start];
			const closeChar = openChar === "{" ? "}" : "]";

			let depth = 0;
			let inString = false;
			let escape = false;
			
			for (let j = start; j < s.length; j++) {
				const ch = s[j];
				if (escape) {
					escape = false;
					continue;
				}
				if (ch === "\\") {
					escape = true;
					continue;
				}
				if (ch === '"') {
					inString = !inString;
					continue;
				}
				if (inString) continue;
				
				if (ch === openChar) depth++;
				if (ch === closeChar) depth--;
				
				if (depth === 0) {
					return s.substring(start, j + 1).trim();
				}
			}
		}

		// 如果没有找到完整的 JSON 结构，从第一个可能的位置开始返回
		const firstBrace = s.indexOf("{");
		const firstBracket = s.indexOf("[");
		let start = -1;
		
		if (firstBrace === -1) {
			start = firstBracket;
		} else if (firstBracket === -1) {
			start = firstBrace;
		} else {
			start = Math.min(firstBrace, firstBracket);
		}

		return s.substring(start).trim();
	}
}

export const DEFAULT_LLM_CONFIG: LLMConfig = {
	apiBase: "http://127.0.0.1:4000/v1",
	apiKey: "",
	model: "gemini-3-flash",
	maxTokens: 2048,
	temperature: 0.3,
};
