import Groq from 'groq-sdk';

let cachedModels: string[] | null = null;
let lastFetchTime = 0;

export async function getAvailableGroqModel(
  groq: Groq,
  preferredModel?: string
): Promise<{ model: string; availableModels: string[] }> {
  const target = preferredModel || process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  const now = Date.now();

  if (!cachedModels || now - lastFetchTime > 5 * 60 * 1000) {
    try {
      const list = await groq.models.list();
      cachedModels = (list.data || [])
        .filter((m: any) => m.active !== false)
        .map((m: any) => m.id);
      lastFetchTime = now;
      console.log('Active Groq models for current key:', cachedModels);
    } catch (err) {
      console.warn('Could not query groq.models.list():', err);
    }
  }

  const available = cachedModels || [];

  if (available.length > 0) {
    if (available.includes(target)) {
      return { model: target, availableModels: available };
    }

    // Preferred candidates in priority order matching active Groq models
    const priorityList = [
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'qwen/qwen3.8-27b',
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
      'llama3-8b-8192',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
    ];

    for (const candidate of priorityList) {
      if (available.includes(candidate)) {
        console.info(`Requested model '${target}' not available in Groq project. Auto-switched to '${candidate}'.`);
        return { model: candidate, availableModels: available };
      }
    }

    // Pick first general chat model (excluding audio/whisper/guard)
    const chatFallback = available.find(
      (id) => !id.includes('whisper') && !id.includes('guard') && !id.includes('orpheus')
    );
    if (chatFallback) {
      console.info(`Auto-switched to chat model '${chatFallback}'.`);
      return { model: chatFallback, availableModels: available };
    }
  }

  return { model: target, availableModels: available };
}
