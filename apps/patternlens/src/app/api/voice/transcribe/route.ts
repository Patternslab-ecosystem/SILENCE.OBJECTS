// TODO M3: Import safety middleware from @/lib/safety
// Apply: normalizeInput, checkRateLimit, scanOutput to ALL AI/voice/medical/legal endpoints
// See: DIPLO_BIBLE_v3 section IV.B @silence/safety
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CLAUDE_MODEL } from '@/constants/app';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Filler words to remove per language
const FILLER_WORDS: Record<string, string[]> = {
  pl: ['no', 'więc', 'znaczy', 'jakby', 'wiesz', 'kurde', 'no i',
       'yyyy', 'eeee', 'mmm', 'hmm', 'no tak', 'w sumie'],
  en: ['um', 'uh', 'like', 'you know', 'so', 'well', 'basically',
       'literally', 'actually', 'right', 'yeah', 'mmm', 'hmm'],
};

function cleanTranscription(text: string, language: string): string {
  let cleaned = text;
  const fillers = FILLER_WORDS[language] || FILLER_WORDS.en;

  for (const filler of fillers) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  }

  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

const TRANSCRIPTION_PROMPTS: Record<string, string> = {
  pl: 'Transkrybuj to nagranie audio po polsku. Zwróć TYLKO transkrybowany tekst, bez komentarzy ani formatowania.',
  en: 'Transcribe this audio recording in English. Return ONLY the transcribed text, no comments or formatting.',
};

async function transcribeAudio(base64Audio: string, mediaType: string, language: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');

  const prompt = TRANSCRIPTION_PROMPTS[language] || TRANSCRIPTION_PROMPTS.en;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Audio,
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Claude transcription error:', response.status, errorBody);
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.content?.length) throw new Error('Empty response from Claude');
  return data.content[0].text;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = (formData.get('language') as string) || 'en';

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert audio to base64 for Claude multimodal API
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = buffer.toString('base64');
    const mediaType = audioFile.type || 'audio/webm';

    const transcription = await transcribeAudio(base64Audio, mediaType, language);
    const cleanedText = cleanTranscription(transcription, language);

    return NextResponse.json({
      text: cleanedText,
      originalLength: transcription.length,
      cleanedLength: cleanedText.length
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
